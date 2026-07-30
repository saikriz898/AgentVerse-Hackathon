import pytest
from app.validators.json_validator import JSONValidator
from app.validators.code_validator import CodeValidator
from app.validators.doc_validator import DocumentValidator
from app.validators.ai_validator import AIValidator
from app.validators.memory_validator import MemoryValidator
from app.validators.comms_validator import CommunicationValidator
from app.validators.execution_validator import ExecutionValidator
from app.validators.planning_validator import PlanningValidator
from app.validators.chief_of_staff_validator import ChiefOfStaffValidator

def test_json_validator_missing_keys():
    content = {"task_id": "123"}
    parsed, issues, warnings, suggestions, deduction = JSONValidator.validate(
        content, required_keys=["task_id", "status", "result"]
    )
    assert len(issues) == 2
    issue_codes = [i.code for i in issues]
    assert "MISSING_REQUIRED_KEY" in issue_codes
    assert deduction > 0

def test_json_validator_invalid_syntax():
    raw = '{ "task_id": "123", invalid_json }'
    parsed, issues, warnings, suggestions, deduction = JSONValidator.validate(raw)
    assert len(issues) >= 1
    assert issues[0].code == "INVALID_JSON_SYNTAX"

def test_code_validator_security_flaws():
    bad_code = """
def query(user):
    api_key = "AKIA1234567890ABCDEF"
    sql = "SELECT * FROM users WHERE name = " + user
    eval("print('unsafe')")
    return sql
"""
    issues, warnings, suggestions, deduction = CodeValidator.validate(bad_code, language="python")
    codes = [i.code for i in issues]
    assert "HARDCODED_SECRET" in codes or "AWS_ACCESS_KEY" in codes
    assert "SQL_INJECTION_CONCAT" in codes
    assert "UNSAFE_EVAL" in codes

def test_doc_validator_unclosed_block():
    bad_md = """# Section
```python
def foo():
    pass
"""
    issues, warnings, suggestions, deduction = DocumentValidator.validate(bad_md, document_type="markdown")
    codes = [i.code for i in issues]
    assert "UNCLOSED_CODE_BLOCK" in codes

def test_ai_validator_placeholders():
    text = "The system design is complete. [TODO] Add detailed architectural diagram. TBD."
    issues, warnings, suggestions, deduction = AIValidator.validate(text)
    codes = [i.code for i in issues]
    assert "PLACEHOLDER_TODO" in codes
    assert "PLACEHOLDER_TBD" in codes

def test_memory_validator_bounds():
    bad_memory = {
        "category": "user_pref",
        "tags": "not_a_list",
        "importance_score": 1.5,
        "summary": "short"
    }
    issues, warnings, suggestions, deduction = MemoryValidator.validate(bad_memory)
    codes = [i.code for i in issues]
    assert "INVALID_IMPORTANCE_SCORE" in codes
    assert "INVALID_TAGS_FORMAT" in codes

def test_chief_of_staff_validator():
    text = "Delegation directive: delegate tasks to Unknown Agent."
    issues, warnings, suggestions, deduction = ChiefOfStaffValidator.validate(
        text, delegated_agents=["Unknown Agent"]
    )
    codes = [i.code for i in issues]
    assert "UNKNOWN_DELEGATED_AGENT" in codes
    assert len(warnings) > 0

def test_comms_validator():
    email = "Hello Team, please find the updates below."
    issues, warnings, suggestions, deduction = CommunicationValidator.validate(email, comm_type="email")
    assert any("Subject" in w for w in warnings)

def test_execution_validator_db_script():
    script = "DROP DATABASE production;"
    issues, warnings, suggestions, deduction = ExecutionValidator.validate("database_scripts", script)
    codes = [i.code for i in issues]
    assert "DANGEROUS_DB_SCRIPT" in codes
