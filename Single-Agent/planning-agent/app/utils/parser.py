"""Parser utilities for extracting structured JSON from LLM outputs."""

import json
import re
from typing import Any, Union
from app.utils.logger import logger


def parse_json_from_llm(content: Union[str, dict, list]) -> Any:
    """Safely extract and parse JSON from string or return already parsed data.

    Handles common LLM formats like ```json ... ``` codeblocks or trailing text.
    """
    if isinstance(content, (dict, list)):
        return content

    if not isinstance(content, str):
        raise ValueError(f"Expected string or dict/list for JSON parsing, got {type(content)}")

    cleaned = content.strip()

    # Strip markdown code blocks if present
    markdown_pattern = r"```(?:json)?\s*([\s\S]*?)\s*```"
    match = re.search(markdown_pattern, cleaned, re.IGNORECASE)
    if match:
        cleaned = match.group(1).strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        logger.warning(f"Direct JSON parse failed ({e}), attempting fuzzy extraction.")
        # Attempt to extract first bracket/brace JSON array or object
        json_extract = re.search(r"(\[[\s\S]*\]|\{[\s\S]*\})", cleaned)
        if json_extract:
            try:
                return json.loads(json_extract.group(1))
            except json.JSONDecodeError as sub_e:
                logger.error(f"Fuzzy JSON extraction also failed: {sub_e}")
        
        raise ValueError(f"Failed to parse valid JSON from LLM output: {content[:200]}...") from e
