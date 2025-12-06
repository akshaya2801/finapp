# API Endpoints Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "securePassword123"
}
```

Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": "uuid-here"
}
```

---

### 2. Login User
**POST** `/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid-here",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

---

### 3. Refresh Token
**POST** `/auth/refresh`

Headers:
```
Authorization: Bearer <refreshToken>
```

Request:
```json
{
  "refreshToken": "eyJhbGc..."
}
```

Response (200):
```json
{
  "success": true,
  "accessToken": "newAccessToken"
}
```

---

## Ticket Endpoints

### 1. Create Ticket
**POST** `/tickets`

Headers:
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Request:
```json
{
  "category": "Life Insurance",
  "title": "Policy clarification needed",
  "description": "I need clarification on my life insurance policy...",
  "priority": "high"
}
```

Response (201):
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "ticketId": "uuid-here"
}
```

---

### 2. Get All Tickets
**GET** `/tickets`

Headers:
```
Authorization: Bearer <accessToken>
```

Query Parameters:
- `status` (optional): "open", "in_progress", "resolved", "closed"

Example: `GET /tickets?status=open`

Response (200):
```json
{
  "success": true,
  "tickets": [
    {
      "id": "uuid-1",
      "user_id": "uuid-user",
      "category": "Life Insurance",
      "title": "Policy clarification",
      "description": "...",
      "priority": "high",
      "status": "open",
      "created_at": "2025-12-01T10:30:00Z",
      "updated_at": "2025-12-01T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Single Ticket
**GET** `/tickets/:ticketId`

Headers:
```
Authorization: Bearer <accessToken>
```

Response (200):
```json
{
  "success": true,
  "ticket": {
    "id": "uuid-here",
    "user_id": "uuid-user",
    "category": "Life Insurance",
    "title": "Policy clarification",
    "description": "...",
    "priority": "high",
    "status": "open",
    "created_at": "2025-12-01T10:30:00Z",
    "updated_at": "2025-12-01T10:30:00Z"
  }
}
```

---

### 4. Update Ticket Status
**PUT** `/tickets/:ticketId/status`

Headers:
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Request:
```json
{
  "status": "in_progress"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Ticket status updated"
}
```

Valid status values: `"open"`, `"in_progress"`, `"resolved"`, `"closed"`

---

## Message Endpoints

### 1. Get Messages for Ticket
**GET** `/messages/ticket/:ticketId`

Headers:
```
Authorization: Bearer <accessToken>
```

Response (200):
```json
{
  "success": true,
  "messages": [
    {
      "id": "uuid-msg-1",
      "ticket_id": "uuid-ticket",
      "sender_id": "uuid-user",
      "sender_name": "Support Agent",
      "sender_email": "support@company.com",
      "text": "We're looking into this for you...",
      "attachments": [
        {
          "id": "uuid-att-1",
          "file_url": "/uploads/file.pdf",
          "file_name": "policy.pdf",
          "file_type": "application/pdf"
        }
      ],
      "created_at": "2025-12-01T10:35:00Z"
    }
  ]
}
```

---

### 2. Send Message
**POST** `/messages/:ticketId`

Headers:
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Request:
```json
{
  "text": "Thank you for the response. That clarifies things."
}
```

Response (201):
```json
{
  "success": true,
  "message": "Message sent",
  "messageId": "uuid-here"
}
```

---

## Attachment Endpoints

### 1. Upload Attachment
**POST** `/attachments/upload`

Headers:
```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

Form Data:
- `file`: (binary) - File to upload
- `ticketId`: (string) - Ticket UUID (optional if messageId provided)
- `messageId`: (string) - Message UUID (optional if ticketId provided)

Example using curl:
```bash
curl -X POST http://localhost:3000/api/attachments/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@path/to/file.pdf" \
  -F "ticketId=uuid-here"
```

Response (201):
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "attachment": {
    "id": "uuid-att",
    "fileUrl": "/uploads/uuid-filename.pdf",
    "fileName": "document.pdf",
    "fileType": "application/pdf"
  }
}
```

---

### 2. Delete Attachment
**DELETE** `/attachments/:attachmentId`

Headers:
```
Authorization: Bearer <accessToken>
```

Response (200):
```json
{
  "success": true,
  "message": "Attachment deleted"
}
```

---

## Device Endpoints

### 1. Register Device
**POST** `/devices/register`

Headers:
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Request:
```json
{
  "deviceId": "android_device_id_123",
  "fcmToken": "fcm_token_here"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Device registered successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "All fields are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Ticket not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "error details"
}
```

---

## Rate Limiting (Recommended for Production)

- 100 requests per minute per IP for auth endpoints
- 1000 requests per minute per user for other endpoints
- File upload limit: 10MB per file

---

## CORS Headers

```
Access-Control-Allow-Origin: * (configure for production)
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Testing with Postman

1. Import the collection from `postman_collection.json` (to be created)
2. Set environment variables:
   - `base_url`: `http://localhost:3000/api`
   - `token`: (obtained from login)
   - `ticketId`: (from create/get tickets)

3. Use pre-request scripts to automatically set tokens

---

## Important Notes

- All timestamps are in UTC ISO 8601 format
- Use Bearer token authentication for all protected endpoints
- Access token expires in 1 hour (default)
- Refresh token expires in 7 days (default)
- Maximum request body size: 50MB
- All requests should use `Content-Type: application/json`
