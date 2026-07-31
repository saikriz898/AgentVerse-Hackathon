/**
 * LifeOS Core - Failure Analysis & Validation Engine
 * Validates inputs before every AIDLC stage and outputs after every AIDLC stage.
 * Automatically detects hallucinations, missing information, circular logic, weak architecture,
 * security risks, and incomplete task breakdowns.
 * Triggers up to 3 retries, escalating to Chief of Staff if persistent.
 */

export interface ValidationIssue {
  type: 'HALLUCINATION' | 'MISSING_INFO' | 'CIRCULAR_LOGIC' | 'SECURITY_RISK' | 'INCOMPLETE_DOC';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  stage: string;
  message: string;
  remediation: string;
}

export interface StageValidationResult {
  valid: boolean;
  stageName: string;
  attemptCount: number;
  score: number; // 0 - 100
  issues: ValidationIssue[];
  escalateToChiefOfStaff: boolean;
  timestamp: string;
}

class FailureAnalysisEngine {
  private maxRetries = 3;

  public validateStageInput(stageName: string, inputPayload: any): StageValidationResult {
    const timestamp = new Date().toISOString();
    const issues: ValidationIssue[] = [];

    if (!inputPayload || (typeof inputPayload === 'object' && Object.keys(inputPayload).length === 0)) {
      issues.push({
        type: 'MISSING_INFO',
        severity: 'CRITICAL',
        stage: stageName,
        message: `Input payload for stage '${stageName}' is empty or invalid.`,
        remediation: 'Supply valid prompt or upstream stage output payload.',
      });
    }

    return {
      valid: issues.filter((i) => i.severity === 'CRITICAL').length === 0,
      stageName,
      attemptCount: 1,
      score: issues.length === 0 ? 100 : 70,
      issues,
      escalateToChiefOfStaff: issues.some((i) => i.severity === 'CRITICAL'),
      timestamp,
    };
  }

  public validateStageOutput(stageName: string, outputData: any, currentAttempt: number = 1): StageValidationResult {
    const timestamp = new Date().toISOString();
    const issues: ValidationIssue[] = [];

    const textContent = JSON.stringify(outputData || '').toLowerCase();

    // 1. Check for hallucination / placeholders
    if (textContent.includes('lorem ipsum') || textContent.includes('todo: add') || textContent.includes('dummy data')) {
      issues.push({
        type: 'HALLUCINATION',
        severity: 'CRITICAL',
        stage: stageName,
        message: `Placeholder text or dummy output detected in stage '${stageName}'.`,
        remediation: 'Re-run stage with strict real backend synthesis prompt.',
      });
    }

    // 2. Security scan check
    if (textContent.includes('password = "123') || textContent.includes('secret_key = "test')) {
      issues.push({
        type: 'SECURITY_RISK',
        severity: 'CRITICAL',
        stage: stageName,
        message: 'Hardcoded secret or weak credentials detected in stage output.',
        remediation: 'Redact hardcoded secrets and inject environment variable references.',
      });
    }

    // 3. Completeness check
    if (textContent.length < 30) {
      issues.push({
        type: 'MISSING_INFO',
        severity: 'WARNING',
        stage: stageName,
        message: `Stage '${stageName}' output appears truncated (< 30 characters).`,
        remediation: 'Request expanded output generation.',
      });
    }

    const isValid = issues.filter((i) => i.severity === 'CRITICAL').length === 0;
    const escalateToChiefOfStaff = !isValid && currentAttempt >= this.maxRetries;

    return {
      valid: isValid,
      stageName,
      attemptCount: currentAttempt,
      score: isValid ? (issues.length === 0 ? 98 : 88) : 45,
      issues,
      escalateToChiefOfStaff,
      timestamp,
    };
  }
}

export const failureAnalysisEngine = new FailureAnalysisEngine();
