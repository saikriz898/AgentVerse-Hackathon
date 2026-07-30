import ast
import json
import re
from typing import Dict, Any, List, Tuple
from app.schemas.review import IssueItem

SECRET_PATTERNS = [
    (r'(?i)(api[_-]?key|secret|password|passwd|auth[_-]?token)\s*=\s*["\'][A-Za-z0-9_\-]{8,}["\']', "HARDCODED_SECRET", "Hardcoded API key or credential detected in source code."),
    (r'AKIA[0-9A-Z]{16}', "AWS_ACCESS_KEY", "AWS Access Key ID pattern detected."),
    (r'-----BEGIN\s+(RSA|EC|PRIVATE)\s+KEY-----', "PRIVATE_KEY", "Private RSA/EC encryption key embedded in code.")
]

SQL_INJECTION_PATTERNS = [
    (r'(?i)SELECT\s+.*\s+FROM\s+.*\+\s*[a-zA-Z_]', "SQL_INJECTION_CONCAT", "String concatenation detected in SQL query formulation. Use parameterized queries."),
    (r'(?i)EXECUTE\s+IMMEDIATE\s+["\'].*%', "DYNAMIC_SQL_RISK", "Dynamic SQL execution detected without parameter binding.")
]

UNSAFE_CODE_PATTERNS = [
    (r'\beval\s*\(', "UNSAFE_EVAL", "Use of eval() function poses remote code execution risks."),
    (r'\bexec\s*\(', "UNSAFE_EXEC", "Use of exec() function poses remote code execution risks."),
    (r'dangerouslySetInnerHTML', "XSS_RISK", "dangerouslySetInnerHTML poses Cross-Site Scripting (XSS) risks in React.")
]

class CodeValidator:
    """Validates source code across Python, SQL, JS/TS, Java, C/C++, Go, Rust, C#, PHP, Ruby, Bash, HTML, CSS, JSON, YAML."""

    @staticmethod
    def validate(
        code: str,
        language: str = "python"
    ) -> Tuple[List[IssueItem], List[str], List[str], float]:
        issues: List[IssueItem] = []
        warnings: List[str] = []
        suggestions: List[str] = []
        deduction = 0.0

        lang = language.lower().strip()

        if not code or not code.strip():
            issues.append(IssueItem(
                code="EMPTY_CODE_SNIPPET",
                severity="critical",
                message="Code snippet is empty.",
                field="code"
            ))
            return issues, warnings, suggestions, 50.0

        # 1. Universal Security Scans
        for pattern, err_code, msg in SECRET_PATTERNS:
            if re.search(pattern, code):
                issues.append(IssueItem(
                    code=err_code,
                    severity="critical",
                    message=msg,
                    field="security",
                    suggestion="Move sensitive credentials to environment variables or secret manager."
                ))
                deduction += 25.0

        for pattern, err_code, msg in SQL_INJECTION_PATTERNS:
            if re.search(pattern, code):
                issues.append(IssueItem(
                    code=err_code,
                    severity="high",
                    message=msg,
                    field="security",
                    suggestion="Use parameterized ORM queries or bound placeholders."
                ))
                deduction += 20.0

        for pattern, err_code, msg in UNSAFE_CODE_PATTERNS:
            if re.search(pattern, code):
                issues.append(IssueItem(
                    code=err_code,
                    severity="high",
                    message=msg,
                    field="security",
                    suggestion="Avoid executing dynamic strings or unescaped HTML."
                ))
                deduction += 15.0

        # 2. Language-Specific Validations
        if lang in ["python", "py"]:
            try:
                tree = ast.parse(code)
                class DeadCodeVisitor(ast.NodeVisitor):
                    def visit_FunctionDef(self, node):
                        has_returned = False
                        for stmt in node.body:
                            if has_returned:
                                issues.append(IssueItem(
                                    code="DEAD_CODE_AFTER_RETURN",
                                    severity="low",
                                    message=f"Unreachable statement in function '{node.name}' after return line {stmt.lineno}.",
                                    field=f"line {stmt.lineno}"
                                ))
                            if isinstance(stmt, (ast.Return, ast.Raise)):
                                has_returned = True
                        self.generic_visit(node)
                DeadCodeVisitor().visit(tree)
            except SyntaxError as e:
                issues.append(IssueItem(
                    code="PYTHON_SYNTAX_ERROR",
                    severity="critical",
                    message=f"Python syntax error on line {e.lineno}, col {e.offset}: {e.msg}",
                    field=f"line {e.lineno}",
                    suggestion="Fix syntax errors before submitting code."
                ))
                deduction += 35.0

        elif lang in ["sql"]:
            if not re.search(r'(?i)\b(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH|GRANT)\b', code):
                warnings.append("SQL query does not contain standard DML/DDL keywords.")
                deduction += 5.0

            if re.search(r'(?i)\bSELECT\s+\*\s+FROM\b', code):
                warnings.append("Use of 'SELECT *' is discouraged in production. Explicitly list required columns for performance.")
                suggestions.append("Replace 'SELECT *' with specific column names.")
                deduction += 5.0

            if re.search(r'(?i)\bDROP\s+TABLE\b', code) and not re.search(r'(?i)\bIF\s+EXISTS\b', code):
                warnings.append("Unsafe 'DROP TABLE' without 'IF EXISTS' safeguard.")
                deduction += 5.0

        elif lang in ["javascript", "js", "typescript", "ts"]:
            if re.search(r'\bconsole\.log\(', code):
                warnings.append("Code contains console.log statements which should be cleaned up for production.")
                suggestions.append("Use a structured logger instead of console.log.")
                deduction += 2.0

            if re.search(r'\bvar\s+[a-zA-Z_]', code):
                warnings.append("Use of 'var' keyword. Prefer 'const' or 'let'.")
                suggestions.append("Replace 'var' with 'const' or 'let'.")
                deduction += 3.0

        elif lang in ["java"]:
            if "System.out.println" in code:
                warnings.append("Use of System.out.println. Prefer a logger like SLF4J/Logback.")
                deduction += 3.0

        elif lang in ["cpp", "c", "c++"]:
            if re.search(r'\bmalloc\(', code) and not re.search(r'\bfree\(', code):
                warnings.append("Potential memory leak detected: malloc() used without corresponding free().")
                deduction += 10.0
            if re.search(r'\bgets\(', code) or re.search(r'\bstrcpy\(', code):
                issues.append(IssueItem(
                    code="UNSAFE_C_FUNCTION",
                    severity="high",
                    message="Use of unsafe C string function (gets/strcpy) prone to buffer overflows.",
                    suggestion="Use strncpy or std::string instead."
                ))
                deduction += 15.0

        elif lang in ["go", "golang"]:
            if re.search(r'\bpanic\(', code):
                warnings.append("Use of panic() detected. Prefer returning explicit error objects.")
                deduction += 5.0

        elif lang in ["rust", "rs"]:
            if re.search(r'\.unwrap\(\)', code):
                warnings.append("Use of .unwrap() can cause panic in Rust production code.")
                suggestions.append("Use pattern matching or ? operator for error handling.")
                deduction += 4.0
            if "unsafe" in code:
                warnings.append("Unsafe block detected in Rust snippet.")
                deduction += 5.0

        elif lang in ["csharp", "cs"]:
            if "Console.WriteLine" in code:
                warnings.append("Use of Console.WriteLine. Prefer structured logging.")
                deduction += 3.0

        elif lang in ["php"]:
            if re.search(r'\b(shell_exec|exec|system|passthru)\s*\(', code):
                issues.append(IssueItem(
                    code="PHP_SHELL_EXEC",
                    severity="high",
                    message="PHP shell execution function detected.",
                    suggestion="Avoid executing system commands directly in PHP."
                ))
                deduction += 15.0

        elif lang in ["bash", "sh", "shell"]:
            if re.search(r'rm\s+-rf\s+/', code):
                issues.append(IssueItem(
                    code="DESTRUCTIVE_BASH_COMMAND",
                    severity="critical",
                    message="Destructive command 'rm -rf /' detected.",
                    suggestion="Remove destructive system deletion commands."
                ))
                deduction += 50.0

        elif lang in ["json"]:
            try:
                json.loads(code)
            except Exception as ex:
                issues.append(IssueItem(
                    code="INVALID_JSON_SYNTAX",
                    severity="critical",
                    message=f"JSON syntax error: {str(ex)}",
                    suggestion="Ensure valid JSON formatting with double-quoted keys."
                ))
                deduction += 30.0

        elif lang in ["html", "htm"]:
            if not re.search(r'<!DOCTYPE\s+html>', code, re.IGNORECASE):
                warnings.append("Missing <!DOCTYPE html> declaration.")
                deduction += 2.0
            if re.search(r'<img\s+((?!alt=).)*>', code, re.IGNORECASE):
                warnings.append("Image tag missing alt attribute for accessibility.")
                deduction += 3.0

        # Line length & readability heuristic
        lines = code.splitlines()
        long_lines = [idx + 1 for idx, l in enumerate(lines) if len(l) > 120]
        if len(long_lines) > 5:
            warnings.append(f"Multiple lines (>120 chars) detected on lines: {long_lines[:5]}...")
            suggestions.append("Format long code lines to improve readability.")
            deduction += 2.0

        return issues, warnings, suggestions, deduction
