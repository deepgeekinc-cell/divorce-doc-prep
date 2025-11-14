# DivorceDocPrep - Smart Document Collection Assistant

A full-stack web application that helps individuals preparing for divorce gather all required documents before their first lawyer meeting, potentially saving thousands of dollars in legal fees.

## Overview

DivorceDocPrep eliminates the expensive document chase that divorce lawyers typically charge $250-$500/hour for. Our intelligent platform provides state-specific guidance and AI-powered assistance to help users collect every required document online before meeting with their attorney.

### Key Benefits

- **Save Money**: Reduce attorney billable hours by $1,250-$7,500 by doing document prep yourself
- **Save Time**: Arrive at your first lawyer meeting fully prepared, eliminating weeks of back-and-forth
- **State-Specific**: Get customized document checklists based on your state's divorce requirements
- **AI-Powered**: Expert AI guidance helps you find every document online, from tax returns to property deeds
- **Track Progress**: Visual checklist keeps you organized and shows exactly what's left to gather
- **Secure Storage**: Upload and organize all documents in one secure, encrypted location

## Features

### 1. State Selection & Profile Setup
- Select your state for state-specific requirements
- Answer profile questions (children, business ownership, real estate, retirement accounts)
- Automatically customize document checklist based on your situation

### 2. Comprehensive Document Checklist
- **Personal Identification**: Marriage certificates, birth certificates, social security cards
- **Income & Employment**: Tax returns, W-2s, pay stubs, 1099 forms
- **Bank Accounts & Investments**: Bank statements, investment accounts, cryptocurrency holdings
- **Real Estate & Property**: Property deeds, mortgages, appraisals, vehicle titles
- **Debts & Liabilities**: Credit card statements, student loans, credit reports
- **Insurance Policies**: Health, life, auto insurance documents
- **Legal Agreements**: Prenuptial agreements, trust documents
- **Monthly Expenses**: Utility bills, phone bills, budget worksheets
- **Child-Related** (if applicable): Childcare expenses, school records, medical records

### 3. AI Document Assistant
- Chat with an AI assistant to get help finding specific documents
- Get step-by-step guidance on where to access documents online
- Receive specific URLs and instructions for common document sources
- Ask questions about document requirements

### 4. Document Upload & Organization
- Securely upload documents to cloud storage
- Organize documents by category
- Track which documents have been collected
- View upload history and manage files

### 5. Progress Tracking
- Visual progress indicators showing completion percentage
- Track documents uploaded vs. total required
- See at-a-glance what's left to gather
- Dashboard overview of your preparation status

## Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and caching

### Backend
- **Express 4** - Web server framework
- **tRPC 11** - End-to-end typesafe APIs
- **Drizzle ORM** - TypeScript ORM for database
- **MySQL/TiDB** - Relational database
- **Manus Auth** - OAuth authentication

### AI & Services
- **LLM Integration** - AI-powered document assistance
- **S3 Storage** - Secure file storage
- **Superjson** - Automatic type serialization

## Getting Started

### Prerequisites
- Node.js 22+ installed
- pnpm package manager
- Database connection (MySQL/TiDB)

### Installation

1. Clone the repository:
```bash
cd /home/ubuntu/divorce-doc-prep
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up the database:
```bash
pnpm db:push
```

4. Seed the database with document categories and state information:
```bash
pnpm exec tsx seed-data.mts
```

5. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Database Schema

### Users Table
- User authentication and profile information
- Role-based access control (admin/user)
- OAuth integration with Manus

### User Profiles Table
- State selection
- Situation flags (children, business, real estate, retirement accounts)
- Links to user account

### Document Categories Table
- Predefined categories (Personal Identification, Income & Employment, etc.)
- Display order and descriptions

### Document Types Table
- Specific document types within each category
- Descriptions and "where to find" guidance
- Conditional requirements based on user profile

### User Documents Table
- Track uploaded documents
- S3 file keys and URLs
- Upload timestamps and file metadata

### Checklist Progress Table
- Track completion status for each document type
- User-specific progress tracking

### Chat Messages Table
- Store AI assistant conversation history
- User and assistant message pairs

## Usage Guide

### For End Users

1. **Sign Up/Login**: Create an account or log in using OAuth
2. **Select Your State**: Choose the state where you'll be filing for divorce
3. **Complete Your Profile**: Answer questions about your situation (children, property, etc.)
4. **Review Your Checklist**: See your personalized document checklist
5. **Gather Documents**: Use the AI assistant to help find each document online
6. **Upload & Organize**: Upload documents as you collect them
7. **Track Progress**: Monitor your completion percentage
8. **Meet Your Lawyer**: Show up fully prepared with all documents organized

### For Administrators

- Access admin features through role-based permissions
- Manage document categories and types
- View user statistics and progress
- Add new states or update requirements

## AI Assistant Capabilities

The AI assistant can help users:
- Find specific documents online (IRS transcripts, bank statements, etc.)
- Understand what each document is and why it's needed
- Get step-by-step instructions for accessing documents
- Navigate government websites and online portals
- Troubleshoot common document retrieval issues

Example queries:
- "How do I get my tax transcripts from the IRS?"
- "Where can I find my bank statements online?"
- "What is a property deed and where do I get it?"
- "How do I access my 401(k) statements?"

## Security & Privacy

- **Authentication**: Secure OAuth-based login
- **Encrypted Storage**: All documents stored securely in S3
- **Role-Based Access**: Users can only access their own documents
- **HTTPS**: All data transmitted over secure connections
- **Database Security**: Proper SQL injection prevention and input validation

## Deployment

### Using Manus Platform

1. Save a checkpoint:
```bash
# Checkpoint is already created
```

2. Click the "Publish" button in the Management UI
3. Your application will be deployed with a public URL

### Environment Variables

The following environment variables are automatically configured:
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - OAuth application ID
- `OAUTH_SERVER_URL` - OAuth backend URL
- `BUILT_IN_FORGE_API_KEY` - LLM and storage API key
- `BUILT_IN_FORGE_API_URL` - Manus services URL

## Future Enhancements

### Recommended Next Steps

1. **PDF Export Functionality**: Add ability to export all collected documents as a single PDF package for easy sharing with attorneys

2. **Email Reminders**: Implement automated email reminders for users who haven't completed their checklist, helping them stay on track

3. **Additional States**: Expand beyond the initial 4 states (California, New York, Texas, Florida) to cover all 50 states with state-specific requirements

4. **Document Templates**: Provide downloadable templates for common forms (financial affidavits, parenting plans, etc.)

5. **Attorney Directory**: Add a directory of divorce attorneys by state with ratings and specializations

6. **Cost Calculator**: Build a calculator to estimate total divorce costs based on complexity and state

7. **Mobile App**: Create native iOS/Android apps for document scanning and upload on-the-go

8. **Document Verification**: Add AI-powered document verification to ensure uploaded files are complete and legible

9. **Collaboration Features**: Allow users to share their checklist with their attorney or spouse

10. **Video Tutorials**: Add video guides for finding and uploading common documents

## Support

For questions or issues:
- Check the AI Assistant within the application
- Review this documentation
- Contact support at the Manus platform

## License

Proprietary - All rights reserved

## Credits

Built with Manus platform technologies and modern web development best practices.

---

**Start saving on legal fees today!** Visit the application and begin your document preparation journey.
