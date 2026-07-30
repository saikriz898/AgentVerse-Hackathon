# LifeOS Communication Agent - REST API Reference

Base URL: `/api/v1`

---

## 🔐 Authentication Endpoints

### 1. Register User
`POST /api/v1/auth/register`

**Request Body**:
```json
{
  "username": "developer_john",
  "email": "john@lifeos.ai",
  "password": "SecurePassword123!",
  "role": "user"
}
```

**Response (200 OK)**:
```json
{
  "id": "usr_94a218f0",
  "username": "developer_john",
  "email": "john@lifeos.ai",
  "role": "user",
  "created_at": "2026-07-28T18:40:00Z"
}
```

---

### 2. Login
`POST /api/v1/auth/login`

**Request Body**:
```json
{
  "username": "developer_john",
  "password": "SecurePassword123!"
}
```

**Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

## 🪄 Communication Transformation Endpoints

### 3. Master Transform Endpoint
`POST /api/v1/communication/transform`

**Request Body**:
```json
{
  "input_agent": "Chief of Staff",
  "output_destination": "Executive",
  "output_type": "Executive Summary",
  "tone": "Executive",
  "length": "Short Summary",
  "language": "English",
  "payload": {
    "title": "Quarterly Agent Operations",
    "achievements": ["Deployed Communication Agent", "Connected 6 agents"],
    "risks": ["API rate limits on LLM endpoint"]
  }
}
```

**Response Payload Schema**:
```json
{
  "status": "success",
  "id": "comm_f8291a0c",
  "document_type": "Executive Summary",
  "title": "Quarterly Agent Operations Executive Summary",
  "summary": "Condensed top-line executive brief.",
  "content": "# Executive Summary\n...",
  "markdown": "# Executive Summary\n...",
  "email_subject": "Executive Brief: Quarterly Agent Operations",
  "email_body": "Dear Executive,\n...",
  "recommendations": [
    "Proceed with production deployment.",
    "Monitor LLM API latency."
  ],
  "confidence": 0.98,
  "generated_at": "2026-07-28T18:40:05Z",
  "input_agent": "Chief of Staff",
  "output_destination": "Executive",
  "tone": "Executive",
  "length": "Short Summary",
  "language": "English",
  "has_missing_info": false,
  "missing_info_details": [],
  "formatted_views": {
    "markdown": "# Executive Summary\n...",
    "html": "<!DOCTYPE html><html>...",
    "email": "Subject: Executive Brief...",
    "docx": "[DOCX Plain Text Format]"
  }
}
```

---

### 4. Specialized Endpoints
- `POST /api/v1/communication/summary`
- `POST /api/v1/communication/report`
- `POST /api/v1/communication/email`
- `POST /api/v1/communication/markdown`
- `POST /api/v1/communication/html`
- `POST /api/v1/communication/meeting-notes`
- `POST /api/v1/communication/status`
- `POST /api/v1/communication/release-notes`
- `POST /api/v1/communication/documentation`

---

## 📜 History & Management

### 5. Fetch History Logs
`GET /api/v1/communication/history?source_agent=Chief%20of%20Staff&document_type=Executive%20Summary&limit=20`

### 6. Delete Record
`DELETE /api/v1/communication/{id}`

### 7. Export Document
`POST /api/v1/communication/export`
```json
{
  "content": "# Markdown Document",
  "format": "pdf",
  "title": "Quarterly Report"
}
```
