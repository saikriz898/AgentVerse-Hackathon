export type InputAgent =
  | "Review Agent"
  | "Chief of Staff"
  | "Execution Agent"
  | "Planning Agent"
  | "Research Agent"
  | "Memory Agent"
  | "Generic Agent";

export type OutputDestination =
  | "CEO"
  | "Executive"
  | "Manager"
  | "Developer"
  | "Client"
  | "Investor"
  | "Researcher"
  | "Designer"
  | "Employee"
  | "Customer"
  | "Student"
  | "Professor"
  | "Vendor"
  | "Administrator"
  | "Support Team"
  | "General Public";

export type OutputType =
  | "Executive Summary"
  | "Business Report"
  | "Email"
  | "Memo"
  | "Letter"
  | "Press Release"
  | "Meeting Minutes"
  | "Proposal"
  | "Technical Documentation"
  | "API Documentation"
  | "Knowledge Base Article"
  | "User Guide"
  | "FAQ"
  | "Presentation"
  | "PDF Report"
  | "Word Document"
  | "Markdown"
  | "HTML"
  | "Plain Text"
  | "CSV Summary"
  | "JSON Summary";

export type PriorityType = "Low" | "Normal" | "High" | "Critical";

export type ToneType =
  | "Executive"
  | "Professional"
  | "Formal"
  | "Friendly"
  | "Technical"
  | "Simple"
  | "Casual"
  | "Persuasive"
  | "Empathetic"
  | "Marketing"
  | "Confident"
  | "Neutral";

export type DocumentLength =
  | "Short Summary"
  | "Medium Report"
  | "Detailed Report"
  | "Full Documentation";

export type LanguageType =
  | "English"
  | "Tamil"
  | "Hindi"
  | "Spanish"
  | "French"
  | "German"
  | "Japanese"
  | "Korean"
  | "Chinese";

export type ChannelType =
  | "Email"
  | "Slack"
  | "Microsoft Teams"
  | "Google Chat"
  | "WhatsApp"
  | "Telegram"
  | "SMS"
  | "Dashboard Notification"
  | "Push Notification"
  | "Internal Portal"
  | "Google Docs"
  | "PDF"
  | "Presentation"
  | "Meeting Minutes";

export interface TemplateItem {
  id: string;
  name: string;
  description: string;
  category: string;
  default_destination: OutputDestination;
  default_tone: ToneType;
  default_type: OutputType;
  sample_payload: Record<string, any>;
  is_preset?: boolean;
  output_type?: OutputType;
  target_destination?: OutputDestination;
  structure_template?: string;
}

export interface StatsSummary {
  total_transformations: number;
  total_delivered: number;
  average_confidence: number;
  by_agent: Record<string, number>;
  by_destination: Record<string, number>;
  by_language: Record<string, number>;
}

export interface StandardInputObject {
  communication_id?: string;
  source_agent: InputAgent;
  communication_type: OutputType;
  priority: PriorityType;
  audience: OutputDestination;
  language: LanguageType;
  payload: Record<string, any>;
  attachments?: any[];
  metadata?: Record<string, any>;
}

export interface TransformationRequest {
  communication_id?: string;
  input_agent: InputAgent;
  source_agent?: InputAgent;
  output_destination: OutputDestination;
  audience?: OutputDestination;
  output_type: OutputType;
  communication_type?: OutputType;
  priority?: PriorityType;
  tone?: ToneType;
  length?: DocumentLength;
  language?: LanguageType;
  custom_instructions?: string;
  payload: Record<string, any>;
}

export interface DeliveryRequest {
  communication_id: string;
  channel: ChannelType;
  approved_by?: string;
  notify_chief_of_staff?: boolean;
}

export interface DeliveryResponse {
  status: string;
  message: string;
  communication_id: string;
  delivery_channel: string;
  delivered_at: string;
  chief_of_staff_notified: boolean;
  chief_of_staff_payload: Record<string, any>;
}

export interface TransformationResult {
  status: string;
  id: string;
  communication_id?: string;
  document_type: string;
  output_type?: string;
  title: string;
  summary: string;
  content: string;
  transformed_content?: string;
  executive_summary?: string;
  markdown: string;
  email_subject: string;
  email_body: string;
  recommendations: string[];
  confidence: number;
  quality_score?: number;
  generated_at: string;
  created_at?: string;
  
  intent?: string;
  writing_style?: string;
  action_items?: any[];
  explainability_rationale?: Record<string, any>;
  
  has_missing_info?: boolean;
  missing_info_details?: string[];
  
  input_agent: InputAgent;
  output_destination: OutputDestination;
  priority?: PriorityType;
  tone: ToneType;
  language: LanguageType;
  
  recommended_channel?: ChannelType;
  channel_rationale?: string;
  quality_evaluation?: {
    grammar_rating: string;
    readability_score: number;
    zero_fabrication_confirmed: boolean;
  };
  
  review_status?: string;
  approval_status?: string;
  delivery_status?: string;
  chief_of_staff_notified?: boolean;
  
  formatted_views?: {
    html?: string;
    markdown?: string;
    email?: { subject: string; body: string } | string;
    slack?: string;
    teams?: string;
    pdf_summary?: string;
  };
}

export interface ExportRequest {
  document_id: string;
  format: 'pdf' | 'docx' | 'html' | 'md' | 'json';
}
