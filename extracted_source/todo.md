# DivorceDocPrep - Project TODO

## Core Features

### Database & Schema
- [x] Create state-specific requirements table
- [x] Create document categories table
- [x] Create user documents tracking table
- [x] Create user checklist progress table
- [x] Add state information and requirements data

### Backend API
- [x] Implement state selection and requirements retrieval
- [x] Implement document checklist generation based on user state
- [x] Implement document upload and tracking
- [x] Implement AI-powered document assistance (help users find documents)
- [x] Implement progress tracking and completion status
- [ ] Implement document export functionality (PDF package)

### Frontend UI
- [x] Design landing page with value proposition
- [x] Create state selection interface
- [x] Build document checklist dashboard
- [x] Implement document category views with progress tracking
- [x] Create AI chat assistant for document guidance
- [x] Build document upload interface
- [x] Implement progress visualization
- [ ] Create export/download functionality for complete package
- [x] Add educational content about each document type

### Testing & Deployment
- [x] Test complete user workflow from state selection to document export
- [x] Test AI assistance functionality
- [x] Verify document upload and storage
- [x] Create deployment checkpoint

## Payment Integration

### Stripe Setup
- [x] Add Stripe feature to project
- [x] Configure Stripe payment products and prices
- [x] Create payment tiers in Stripe

### Backend Implementation
- [x] Add user payment status to database schema
- [x] Create payment verification procedures
- [ ] Add access control based on payment status
- [x] Implement Stripe webhook handlers

### Frontend Implementation
- [x] Create pricing page with three tiers
- [x] Build Stripe checkout integration
- [ ] Add payment gate to protected features
- [x] Update landing page with pricing CTA
- [ ] Add "Upgrade" prompts for free users

### Revised Pricing Strategy
- [x] Update pricing strategy to only include deliverable features
- [x] Remove email support mentions (not implemented)
- [x] Remove attorney matching (not implemented)
- [x] Focus on AI assistant, document storage, and state-specific guidance

## AI Assistant Enhancement - Paralegal Expert System

### Knowledge Base Development
- [x] Create comprehensive website navigation guides for IRS (tax transcripts)
- [x] Create guides for Social Security Administration (benefits statements)
- [x] Create guides for state DMV websites (vehicle registration)
- [x] Create guides for county assessor websites (property records)
- [x] Create guides for bank/credit union document portals
- [x] Create guides for credit reporting agencies (credit reports)
- [x] Create guides for employer HR portals (pay stubs, W-2s)
- [x] Create guides for retirement account providers (401k, IRA statements)

### AI System Prompt Enhancement
- [x] Add paralegal-level expertise to system prompt
- [x] Include state-specific divorce law knowledge
- [x] Add document authentication and verification guidance
- [x] Include timeline and deadline awareness
- [x] Add troubleshooting for common website issues

### Intelligent Routing Logic
- [x] Detect which document user is asking about
- [x] Provide specific website URLs based on document type
- [x] Give step-by-step navigation instructions
- [x] Include screenshots/visual descriptions where helpful
- [x] Provide alternative methods if primary method fails

## Pricing Strategy Revision

- [x] Remove Basic tier ($97) - doesn't include AI assistant
- [x] Keep Complete tier as primary offering ($197)
- [x] Keep Premium tier for high-net-worth cases ($297)
- [x] Update Stripe products to archive Basic tier
- [x] Update pricing page to show 2 tiers instead of 3
- [x] Emphasize AI-assisted document guidance as core value

## State Expansion - Add All 50 States

- [x] Create comprehensive state data for all 50 states
- [x] Add community property vs equitable distribution classification
- [x] Add residency requirements for each state
- [x] Add waiting period information
- [x] Add state-specific financial disclosure requirements
- [x] Seed database with all 50 states
- [x] Update state selection dropdown to show all states
- [ ] Test state-specific guidance in AI assistant

## Security & Privacy Enhancements

### Legal Documentation
- [x] Create comprehensive Privacy Policy
- [x] Create Terms of Service
- [x] Add Data Retention Policy
- [x] Add GDPR/CCPA compliance statements
- [ ] Create Security & Encryption documentation page

### Data Security
- [x] Audit S3 bucket permissions (ensure private, not public)
- [x] Implement file encryption at rest for uploaded documents
- [x] Add file encryption in transit (HTTPS already enabled)
- [ ] Implement secure file deletion (permanent removal)
- [ ] Add file access logging for audit trail
- [ ] Implement rate limiting on file uploads
- [ ] Add file type validation and virus scanning

### Access Controls
- [ ] Ensure users can only access their own documents (row-level security)
- [ ] Add session timeout for inactive users
- [ ] Implement secure password requirements (via OAuth)
- [ ] Add two-factor authentication option
- [ ] Implement IP-based access logging

### Privacy Features
- [ ] Add "Delete All My Data" button in settings
- [x] Implement data export functionality (GDPR right to data portability)
- [ ] Add privacy notice on document upload
- [ ] Create data anonymization for analytics
- [ ] Add cookie consent banner
- [ ] Implement secure chat history encryption

### UI/UX Privacy
- [x] Add security badges/trust indicators on homepage
- [ ] Add encryption notice on upload page
- [ ] Create dedicated Security & Privacy page
- [x] Add privacy policy link to footer
- [x] Add "Your data is encrypted" messaging throughout app
- [ ] Add auto-logout warning before timeout

### Compliance
- [ ] Add HIPAA compliance notice (medical records)
- [ ] Add financial data protection notice
- [ ] Implement audit logging for all data access
- [ ] Create incident response plan documentation

## User Settings Page

- [x] Create Settings page component
- [x] Add "Export My Data" button with download functionality
- [x] Add "Delete All My Data" button with confirmation dialog
- [x] Add account information display (name, email, registration date)
- [x] Add payment tier display and upgrade option
- [x] Add route to settings page in App.tsx
- [x] Add settings link to dashboard navigation
- [x] Test data export generates complete JSON file
- [x] Test data deletion removes all user data and logs out

## AI Document Scanning & Data Extraction

### Backend Implementation
- [x] Integrate vision AI for OCR and document analysis
- [x] Create document type detection (tax return, bank statement, pay stub, etc.)
- [x] Implement intelligent data extraction for each document type
- [x] Build structured data storage for extracted information
- [ ] Create document categorization and organization logic
- [ ] Add image preprocessing (rotation, contrast, denoising)

### Frontend Camera & Upload
- [x] Build camera capture UI for mobile/desktop
- [x] Add image preview and crop functionality
- [ ] Implement multi-page document scanning
- [x] Add progress indicators for OCR processing
- [x] Create extracted data review/edit interface
- [ ] Add manual correction capabilities for AI mistakes

### Professional PDF Generation
- [ ] Install PDF generation library (pdf-lib or pdfkit)
- [ ] Create PDF template with professional layout
- [ ] Implement tabbed sections by document category
- [ ] Add automatic highlighting of key information
- [ ] Generate table of contents with page numbers
- [ ] Add cover page with user info and completion summary
- [ ] Implement bookmarks for easy navigation
- [ ] Add watermark with generation date

### Data Extraction Rules
- [ ] Tax returns: Income, deductions, filing status, dependents
- [ ] Bank statements: Account numbers, balances, transactions
- [ ] Pay stubs: Employer, gross/net pay, YTD earnings
- [ ] Property deeds: Address, owner names, assessed value
- [ ] Retirement accounts: Account type, balance, beneficiaries
- [ ] Credit reports: Score, accounts, balances, payment history
- [ ] Vehicle titles: VIN, make/model, owner, lien holder

### Testing
- [ ] Test camera capture on mobile devices
- [ ] Test OCR accuracy with sample documents
- [ ] Test data extraction for all document types
- [ ] Test PDF generation with complete document set
- [ ] Verify highlighting and tabs work correctly

## Secure Document Sharing with Legal Counsel

### Database Schema
- [x] Create shareLinks table (id, userId, shareToken, recipientEmail, recipientName, password, expiresAt, maxViews, viewCount, isActive)
- [x] Create shareAccessLog table (id, shareLinkId, accessedAt, ipAddress, userAgent)
- [x] Push database schema changes

### Backend Implementation
- [x] Create PDF generation endpoint (generates and caches PDF)
- [x] Create share link generation endpoint (creates secure token, sets expiration)
- [ ] Create share link access endpoint (validates token/password, logs access)
- [x] Implement password hashing for share links
- [ ] Add email notification for attorney (send link + password)
- [x] Add access logging and analytics
- [ ] Implement link expiration and view limit enforcement
- [x] Add share link revocation capability

### Frontend UI
- [x] Add "Share with Attorney" button to Documents page
- [x] Create share dialog with attorney email/name input
- [x] Add password generation and customization
- [x] Add expiration time selector (24h, 7 days, 30 days, custom)
- [x] Add max views limit option
- [ ] Create share link management page (view active links, revoke)
- [ ] Build public share access page (password entry, PDF viewer)
- [x] Add copy link button and email send confirmation

### Security Features
- [ ] Generate cryptographically secure share tokens
- [ ] Hash passwords with bcrypt
- [ ] Rate limit share link access attempts
- [ ] Add IP-based access logging
- [ ] Implement automatic expiration cleanup
- [ ] Add "Revoke All Links" emergency button

### Testing
- [ ] Test PDF generation with complete document set
- [ ] Test share link creation and email delivery
- [ ] Test password-protected access
- [ ] Test link expiration enforcement
- [ ] Test view limit enforcement
- [ ] Test access logging

## Fix Smart Scan AI & Data Extraction

- [x] Fix document scanner to upload image to S3 first
- [x] Pass S3 public URL to vision AI instead of base64
- [ ] Test OCR extraction with real documents
- [ ] Verify extracted data populates correct fields
- [x] Add visual feedback showing extracted data
- [ ] Allow users to edit/correct extracted data before saving

## Premium Export Capabilities

### PDF Export
- [x] Add "Download PDF Package" button to Documents page
- [x] Generate professional PDF with cover page, TOC, tabs
- [x] Include all uploaded documents in organized sections
- [x] Add extracted data summaries for each document
- [x] Optimize PDF for printing (page breaks, margins)
- [x] Add watermark with generation date and user info

### Email Delivery
- [ ] Add "Email to Attorney" option in share dialog
- [ ] Send PDF package as attachment via email
- [ ] Include password in separate email or SMS
- [ ] Add professional email template with instructions
- [ ] Track email delivery status

### Print Options
- [ ] Add "Print-Friendly View" button
- [ ] Generate print-optimized HTML version
- [ ] Include printer-friendly CSS (no backgrounds, optimized fonts)
- [ ] Add page numbers and headers/footers
- [ ] Create table of contents with page numbers

### Export Formats
- [ ] Add "Export as ZIP" option (all original files)
- [ ] Add "Export Data as CSV" for spreadsheet import
- [ ] Add "Export to Google Drive" integration
- [ ] Add "Export to Dropbox" integration

### Premium Features
- [ ] Lock PDF export behind Complete tier ($197)
- [ ] Lock email delivery behind Premium tier ($297)
- [ ] Show upgrade prompts for free users
- [ ] Add export usage limits (e.g., 3 PDFs per month for Complete)

## AI-Guided Walkthrough System

### Proactive Guidance Engine
- [x] Create AI guidance system that suggests next steps
- [x] Implement smart document prioritization (easy → hard)
- [x] Add contextual "What should I do next?" suggestions
- [x] Build progress tracking with percentage complete
- [x] Add milestone celebrations (25%, 50%, 75%, 100%)
- [x] Implement "You're almost done!" motivation messages

### Conversational Onboarding
- [ ] Create welcome wizard on first login
- [ ] Add conversational state selection flow
- [ ] Build profile questions in chat format
- [ ] Add "Let's get started!" initial message
- [ ] Implement guided tour of platform features

### Smart Assistant Integration
- [x] Add proactive greeting when user opens Assistant
- [x] Suggest specific documents based on progress
- [ ] Auto-populate chat with document-specific questions
- [ ] Add "Quick Actions" buttons for common tasks
- [ ] Implement "I'm stuck" emergency help flow

### Progress Dashboard Enhancement
- [x] Add "Your Next Step" prominent card on dashboard
- [x] Show estimated time to complete remaining documents
- [x] Display money saved so far
- [x] Add visual progress bar with milestones
- [x] Show "Documents Completed" vs "Documents Remaining"

### Contextual Help
- [ ] Add inline help tooltips on every page
- [ ] Implement "Need help with this?" buttons
- [ ] Add video tutorials for complex documents
- [ ] Create FAQ section with common questions
- [ ] Add live chat trigger for stuck users

## LAUNCH BLOCKERS - CRITICAL FIXES

### Payment Gates Implementation
- [x] Add payment tier check to AI Assistant page
- [x] Add payment tier check to document upload
- [x] Add payment tier check to PDF download
- [ ] Add payment tier check to document scanner
- [x] Add payment tier check to share feature
- [x] Create "Upgrade to Unlock" modal component
- [x] Show upgrade prompts for free users

### Stripe Checkout Flow
- [ ] Fix pricing page buttons to redirect to Stripe Checkout
- [ ] Create Stripe checkout session endpoint
- [ ] Add success page after payment
- [ ] Add cancel page for abandoned checkout
- [ ] Test payment with Stripe test card
- [ ] Verify webhook updates user tier correctly

### Homepage Updates
- [ ] Add AI-guided walkthrough to features
- [ ] Add smart document scanning to features
- [ ] Add proactive assistance messaging
- [ ] Update value propositions

### End-to-End Testing
- [ ] Test complete user flow: signup → pay → use features
- [ ] Verify free users see upgrade prompts
- [ ] Verify paid users can access all features
- [ ] Test PDF generation with real documents
- [ ] Test document scanner with real images

## PAID-ONLY ACCESS MODEL

- [ ] Remove all payment tier checks from code
- [ ] Remove UpgradeModal component references
- [ ] Update homepage to require payment before signup
- [ ] Make pricing page the primary entry point
- [ ] Remove "free" tier from database schema
- [ ] Update user flow: pricing → payment → account creation
- [ ] Add 30-day money-back guarantee messaging
- [ ] Test complete payment-first flow
- [ ] Verify all features work after payment

## CRITICAL FIX - Stripe Checkout Not Working

- [ ] Debug why checkout buttons don't redirect to Stripe
- [ ] Fix createCheckoutSession endpoint
- [ ] Test checkout redirect with test mode
- [ ] Verify webhook receives payment events
- [ ] Confirm user tier updates after payment
- [ ] Test complete user journey: pricing → payment → dashboard access
