from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from enum import Enum

class InputAgentEnum(str, Enum):
    REVIEW_AGENT = "Review Agent"
    CHIEF_OF_STAFF = "Chief of Staff"
    EXECUTION_AGENT = "Execution Agent"
    PLANNING_AGENT = "Planning Agent"
    RESEARCH_AGENT = "Research Agent"
    MEMORY_AGENT = "Memory Agent"
    GENERIC_AGENT = "Generic Agent"

class OutputDestinationEnum(str, Enum):
    CEO = "CEO"
    EXECUTIVE = "Executive"
    MANAGER = "Manager"
    DEVELOPER = "Developer"
    CLIENT = "Client"
    INVESTOR = "Investor"
    RESEARCHER = "Researcher"
    DESIGNER = "Designer"
    EMPLOYEE = "Employee"
    CUSTOMER = "Customer"
    STUDENT = "Student"
    PROFESSOR = "Professor"
    VENDOR = "Vendor"
    ADMINISTRATOR = "Administrator"
    SUPPORT_TEAM = "Support Team"
    GENERAL_PUBLIC = "General Public"

class OutputTypeEnum(str, Enum):
    EXECUTIVE_SUMMARY = "Executive Summary"
    STAKEHOLDER_UPDATE = "Stakeholder Update"
    PROFESSIONAL_EMAIL = "Professional Email"
    MEETING_NOTES = "Meeting Notes"
    PROJECT_UPDATE = "Project Update"
    STATUS_REPORT = "Status Report"
    INCIDENT_REPORT = "Incident Report"
    RELEASE_NOTES = "Release Notes"
    PRESENTATION_SUMMARY = "Presentation Summary"
    DAILY_BRIEF = "Daily Brief"
    WEEKLY_BRIEF = "Weekly Brief"
    NOTIFICATION = "Notification"
    ANNOUNCEMENT = "Announcement"
    REMINDER = "Reminder"
    DASHBOARD_UPDATE = "Dashboard Update"
    CHAT_MESSAGE = "Chat Message"

class PriorityEnum(str, Enum):
    LOW = "Low"
    NORMAL = "Normal"
    HIGH = "High"
    CRITICAL = "Critical"

class ToneEnum(str, Enum):
    EXECUTIVE = "Executive"
    PROFESSIONAL = "Professional"
    FORMAL = "Formal"
    FRIENDLY = "Friendly"
    TECHNICAL = "Technical"
    SIMPLE = "Simple"
    EDUCATIONAL = "Educational"
    MARKETING = "Marketing"
    SUPPORTIVE = "Supportive"
    EMPATHETIC = "Empathetic"
    CONFIDENT = "Confident"
    NEUTRAL = "Neutral"

class DocumentLengthEnum(str, Enum):
    SHORT_SUMMARY = "Short Summary"
    MEDIUM_REPORT = "Medium Report"
    DETAILED_REPORT = "Detailed Report"
    FULL_DOCUMENTATION = "Full Documentation"

class ChannelEnum(str, Enum):
    EMAIL = "Email"
    SLACK = "Slack"
    TEAMS = "Microsoft Teams"
    GOOGLE_CHAT = "Google Chat"
    TELEGRAM = "Telegram"
    WHATSAPP = "WhatsApp"
    SMS = "SMS"
    PUSH_NOTIFICATION = "Push Notification"
    DASHBOARD = "Dashboard Notification"
    GOOGLE_DOCS = "Google Docs"
    PDF = "PDF"
    PRESENTATION = "Presentation"
    MEETING_MINUTES = "Meeting Minutes"

class LanguageEnum(str, Enum):
    ENGLISH = "English"
    TAMIL = "Tamil"
    HINDI = "Hindi"
    SPANISH = "Spanish"
    FRENCH = "French"
    GERMAN = "German"
    JAPANESE = "Japanese"
    KOREAN = "Korean"
    CHINESE = "Chinese"

class ExportFormatEnum(str, Enum):
    MARKDOWN = "markdown"
    HTML = "html"
    PDF = "pdf"
    DOCX = "docx"
    EMAIL = "email"
    TEXT = "text"
    JSON = "json"

# LifeOS v2.0 Enterprise Standard Input Object
class StandardInputObject(BaseModel):
    communication_id: Optional[str] = Field(default=None, description="Unique communication ID")
    source_agent: InputAgentEnum = Field(default=InputAgentEnum.REVIEW_AGENT, description="Source LifeOS Agent")
    communication_type: OutputTypeEnum = Field(default=OutputTypeEnum.EXECUTIVE_SUMMARY, description="Document/Communication type")
    priority: PriorityEnum = Field(default=PriorityEnum.NORMAL, description="Urgency priority level")
    audience: OutputDestinationEnum = Field(default=OutputDestinationEnum.MANAGER, description="Target audience category")
    language: LanguageEnum = Field(default=LanguageEnum.ENGLISH, description="Communication output language")
    payload: Dict[str, Any] = Field(..., description="Validated structured output payload")
    attachments: List[Dict[str, Any]] = Field(default=[], description="Optional file attachments")
    metadata: Dict[str, Any] = Field(default={}, description="Context metadata")

# Transformation Request
class TransformationRequest(BaseModel):
    communication_id: Optional[str] = Field(default=None)
    input_agent: InputAgentEnum = Field(default=InputAgentEnum.REVIEW_AGENT)
    source_agent: Optional[InputAgentEnum] = Field(default=None)
    output_destination: OutputDestinationEnum = Field(default=OutputDestinationEnum.MANAGER)
    audience: Optional[OutputDestinationEnum] = Field(default=None)
    output_type: OutputTypeEnum = Field(default=OutputTypeEnum.EXECUTIVE_SUMMARY)
    communication_type: Optional[OutputTypeEnum] = Field(default=None)
    priority: PriorityEnum = Field(default=PriorityEnum.NORMAL)
    tone: ToneEnum = Field(default=ToneEnum.PROFESSIONAL)
    length: DocumentLengthEnum = Field(default=DocumentLengthEnum.MEDIUM_REPORT)
    language: LanguageEnum = Field(default=LanguageEnum.ENGLISH)
    payload: Dict[str, Any] = Field(..., description="Validated technical payload")
    additional_instructions: Optional[str] = Field(default=None)
    metadata: Dict[str, Any] = Field(default={})

class DeliveryRequest(BaseModel):
    communication_id: str = Field(..., description="ID of generated communication record")
    channel: ChannelEnum = Field(..., description="Selected delivery channel")
    approved_by: str = Field(default="Executive User", description="Approver ID/username")
    notify_chief_of_staff: bool = Field(default=True, description="Update Chief of Staff")

class TransformationResponse(BaseModel):
    status: str = "success"
    id: str
    communication_id: str
    document_type: str
    title: str
    summary: str
    content: str
    markdown: str
    email_subject: str
    email_body: str
    recommendations: List[str] = []
    confidence: float = 0.98
    quality_score: float = 0.98
    generated_at: str
    
    input_agent: str
    output_destination: str
    priority: str
    tone: str
    length: str
    language: str
    
    # Advanced Intelligence Engine Outputs (Part 4)
    intent: Optional[str] = "Update"
    writing_style: Optional[str] = "Executive"
    action_items: Optional[List[Dict[str, Any]]] = []
    explainability_rationale: Optional[Dict[str, Any]] = {}
    
    recommended_channel: ChannelEnum
    channel_rationale: str
    requires_user_confirmation: bool
    delivery_status: str = "pending_approval"
    chief_of_staff_notified: bool = False
    
    has_missing_info: bool
    missing_info_details: List[str] = []
    formatted_views: Dict[str, str] = {}

class ExportRequest(BaseModel):
    content: str
    format: ExportFormatEnum
    title: Optional[str] = "LifeOS Communication Report"
    output_type: Optional[str] = "Report"
    output_destination: Optional[str] = "User"
    email_subject: Optional[str] = None
    email_body: Optional[str] = None

class StatsSummary(BaseModel):
    total_transformations: int
    by_agent: Dict[str, int]
    by_destination: Dict[str, int]
    by_output_type: Dict[str, int]
    by_language: Dict[str, int]
    missing_info_rate: float
    avg_confidence_score: float = 0.98
    chief_of_staff_updates_sent: int = 0
