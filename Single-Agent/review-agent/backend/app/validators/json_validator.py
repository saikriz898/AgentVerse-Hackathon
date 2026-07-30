import json
import re
from typing import Dict, Any, List, Optional, Tuple
from app.schemas.review import IssueItem

class JSONValidator:
    """Validates JSON structure, required keys, extra keys, data types, nulls, and nested objects."""

    @staticmethod
    def validate(
        content: Any,
        required_keys: Optional[List[str]] = None,
        schema_definition: Optional[Dict[str, Any]] = None
    ) -> Tuple[Dict[str, Any], List[IssueItem], List[str], List[str], float]:
        """
        Returns:
            parsed_json (dict/list),
            issues (List[IssueItem]),
            warnings (List[str]),
            suggestions (List[str]),
            score_deduction (float)
        """
        issues: List[IssueItem] = []
        warnings: List[str] = []
        suggestions: List[str] = []
        deduction = 0.0

        parsed_data = content

        # 1. Check JSON syntax if string
        if isinstance(content, str):
            try:
                parsed_data = json.loads(content)
            except json.JSONDecodeError as e:
                issues.append(IssueItem(
                    code="INVALID_JSON_SYNTAX",
                    severity="critical",
                    message=f"JSON parsing error: {e.msg} at line {e.lineno} column {e.colno}",
                    field="syntax",
                    suggestion="Fix JSON syntax (check missing quotes, trailing commas, unescaped characters)."
                ))
                return {}, issues, warnings, suggestions, 50.0

        if not isinstance(parsed_data, (dict, list)):
            issues.append(IssueItem(
                code="INVALID_JSON_ROOT",
                severity="high",
                message=f"JSON root must be an Object or Array, got {type(parsed_data).__name__}",
                field="root"
            ))
            deduction += 30.0
            return {}, issues, warnings, suggestions, deduction

        # 2. Check required keys if dict
        if isinstance(parsed_data, dict):
            if required_keys:
                for rkey in required_keys:
                    if rkey not in parsed_data:
                        issues.append(IssueItem(
                            code="MISSING_REQUIRED_KEY",
                            severity="high",
                            message=f"Required key '{rkey}' is missing from JSON response.",
                            field=rkey,
                            suggestion=f"Include key '{rkey}' in output JSON."
                        ))
                        deduction += 15.0
                    elif parsed_data[rkey] is None:
                        warnings.append(f"Required key '{rkey}' is null.")
                        deduction += 5.0

            # 3. Check for Null values across top level
            null_keys = [k for k, v in parsed_data.items() if v is None]
            if null_keys:
                warnings.append(f"Top-level keys with null values: {', '.join(null_keys)}")
                suggestions.append("Ensure null values are intentionally assigned or omit them if optional.")

            # 4. Check schema definition types if provided
            if schema_definition:
                expected_props = schema_definition.get("properties", {})
                for prop_name, prop_spec in expected_props.items():
                    if prop_name in parsed_data:
                        val = parsed_data[prop_name]
                        expected_type = prop_spec.get("type")
                        if expected_type == "string" and not isinstance(val, str):
                            issues.append(IssueItem(
                                code="TYPE_MISMATCH",
                                severity="medium",
                                message=f"Field '{prop_name}' expected string, got {type(val).__name__}",
                                field=prop_name
                            ))
                            deduction += 10.0
                        elif expected_type == "integer" and not isinstance(val, int):
                            issues.append(IssueItem(
                                code="TYPE_MISMATCH",
                                severity="medium",
                                message=f"Field '{prop_name}' expected integer, got {type(val).__name__}",
                                field=prop_name
                            ))
                            deduction += 10.0
                        elif expected_type == "array" and not isinstance(val, list):
                            issues.append(IssueItem(
                                code="TYPE_MISMATCH",
                                severity="medium",
                                message=f"Field '{prop_name}' expected array, got {type(val).__name__}",
                                field=prop_name
                            ))
                            deduction += 10.0

                # Check unexpected keys if additionalProperties = False
                if schema_definition.get("additionalProperties") is False:
                    extra_keys = set(parsed_data.keys()) - set(expected_props.keys())
                    if extra_keys:
                        warnings.append(f"Unexpected extra keys found: {', '.join(extra_keys)}")
                        deduction += 5.0

        return parsed_data if isinstance(parsed_data, dict) else {"data": parsed_data}, issues, warnings, suggestions, deduction
