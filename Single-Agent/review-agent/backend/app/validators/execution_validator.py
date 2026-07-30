import re
from typing import Dict, Any, List, Tuple
from app.schemas.review import IssueItem

class ExecutionValidator:
    """Validates Execution Agent outputs (Generated Files, Reports, APIs, Code, DB Scripts)."""

    @staticmethod
    def validate(execution_type: str, output: Any) -> Tuple[List[IssueItem], List[str], List[str], float]:
        issues: List[IssueItem] = []
        warnings: List[str] = []
        suggestions: List[str] = []
        deduction = 0.0

        if output is None or (isinstance(output, (str, list, dict)) and len(output) == 0):
            issues.append(IssueItem(
                code="EXECUTION_OUTPUT_EMPTY",
                severity="critical",
                message=f"Execution output for '{execution_type}' is empty.",
                field="output"
            ))
            return issues, warnings, suggestions, 50.0

        exec_type = execution_type.lower().strip()

        if exec_type == "database_scripts":
            code_str = str(output)
            if re.search(r'(?i)\bDROP\s+DATABASE\b', code_str):
                issues.append(IssueItem(
                    code="DANGEROUS_DB_SCRIPT",
                    severity="critical",
                    message="Database script contains forbidden 'DROP DATABASE' command.",
                    field="security",
                    suggestion="Remove destructive DROP DATABASE commands."
                ))
                deduction += 40.0
            if not re.search(r';\s*$', code_str.strip()):
                warnings.append("SQL script statement does not end with a semicolon ';'.")
                deduction += 3.0

        elif exec_type == "generated_apis":
            if isinstance(output, dict):
                if "status_code" in output:
                    code = output["status_code"]
                    if not isinstance(code, int) or code < 100 or code > 599:
                        issues.append(IssueItem(
                            code="INVALID_HTTP_STATUS",
                            severity="high",
                            message=f"Invalid HTTP status code {code}.",
                            field="status_code"
                        ))
                        deduction += 20.0
                    elif code >= 500:
                        issues.append(IssueItem(
                            code="API_SERVER_ERROR",
                            severity="high",
                            message=f"API output indicates HTTP 5xx Server Error ({code}).",
                            field="status_code"
                        ))
                        deduction += 25.0

        elif exec_type == "generated_files":
            if isinstance(output, dict):
                if "path" not in output or "content" not in output:
                    issues.append(IssueItem(
                        code="MISSING_FILE_METADATA",
                        severity="high",
                        message="Generated file payload must specify both 'path' and 'content'.",
                        field="file_structure"
                    ))
                    deduction += 15.0

        return issues, warnings, suggestions, deduction
