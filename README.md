# Hands Limited API Documentation

A comprehensive REST API for managing users, testimonials, and company updates with authentication, rate limiting, and email notifications.

## Table of Contents
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Email Notifications](#email-notifications)
- [Error Handling](#error-handling)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Support](#support)

## Features

- 🔐 JWT-based authentication
- 👥 User management system
- 📝 Testimonials management
- 📢 Company updates system
- 📧 Automated email notifications
- ⚡ Rate limiting protection
- 🔍 Input validation
- 📊 Error handling
- 🚀 Production-ready setup

## API Endpoints

### Authentication

Headers: {
"Authorization": "Bearer JWT_TOKEN",
"Role": "admin"
}
Body: {
"content": "string"
}
DELETE /updates/:id
Headers: {
"Authorization": "Bearer JWT_TOKEN",
"Role": "admin"
}


## Email Notifications

### Welcome Email
- Sent automatically upon successful registration
- Contains username and welcome message
- Includes link to dashboard

### Testimonial Confirmation
- Sent after testimonial submission
- Contains thank you message
- Includes copy of submitted testimonial

## Rate Limiting
- Global: 100 requests per minute per IP
- Login: 5 attempts per 15 minutes
- Testimonials: 10 submissions per hour
- Updates: 30 requests per minute for admins

## Error Responses


json
400 Bad Request
{

"error": "Validation error message"
}
401 Unauthorized
{
"error": "Invalid credentials"
}
403 Forbidden
{
"error": "Insufficient permissions"
}
429 Too Many Requests
{
"error": "Rate limit exceeded",
"retryAfter": number
}




## Development Setup

1. Clone and Install:

bash
git clone https://github.com/yourusername/hands-limited-api.git
cd hands-limited-api
pnpm install


2. Environment Setup:

bash

DATABASE_URL=postgresql://user:password@localhost:5432/db_name
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
PORT=8000


3. Database Setup:

bash
pnpm migrate
pnpm seed # Optional: adds test data


4. Start Development Server:

bash
pnpm dev

## Production Deployment
- Set NODE_ENV=production
- Configure proper CORS settings
- Set up proper SSL/TLS
- Configure production database
- Set up monitoring and logging
- Configure proper email service

## Support
- Technical Support: support@handslimited.com
- API Documentation: https://handslimited.com/docs
- Issue Tracking: GitHub Issues