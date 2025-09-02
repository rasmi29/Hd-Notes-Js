# Software Requirements Specification (SRS)
## HD Notes Application

### **Document Information**
- **Project Name:** HD Notes Application
- **Version:** 1.0
- **Date:** September 2025
- **Prepared for:** Full Stack Development Internship Assignment

---

## **1. Introduction**

### **1.1 Purpose**
This document specifies the requirements for developing a full-stack note-taking application called "HD Notes" that allows users to authenticate via OTP and manage personal notes.

### **1.2 Scope**
The HD Notes application will provide:
- User registration and authentication system
- OTP-based login mechanism
- Personal note creation and management
- Responsive web interface
- Secure API with JWT authorization

### **1.3 Definitions and Acronyms**
- **OTP:** One-Time Password
- **JWT:** JSON Web Token
- **API:** Application Programming Interface
- **SPA:** Single Page Application

---

## **2. Overall Description**

### **2.1 Product Perspective**
HD Notes is a standalone web application consisting of:
- React TypeScript frontend (SPA)
- Node.js JavaScript backend (REST API)
- Database for user and note storage
- OTP service integration

### **2.2 Product Functions**
- User registration with email validation
- OTP-based authentication
- Secure note creation and deletion
- User session management
- Responsive UI across devices

### **2.3 User Characteristics**
- **Primary Users:** General users who need to take and manage notes
- **Technical Expertise:** Basic computer/smartphone usage
- **Access:** Web browsers on desktop and mobile devices

---

## **3. Specific Requirements**

### **3.1 Functional Requirements**

#### **3.1.1 User Authentication**
- **FR-1.1:** System shall allow user registration with name, date of birth, and email
- **FR-1.2:** System shall validate email format and uniqueness
- **FR-1.3:** System shall generate and send OTP to user's email
- **FR-1.4:** System shall verify OTP for account activation
- **FR-1.5:** System shall provide OTP resend functionality
- **FR-1.6:** System shall support "Keep me logged in" option
- **FR-1.7:** System shall provide secure logout functionality

#### **3.1.2 Note Management**
- **FR-2.1:** Authenticated users shall be able to create notes
- **FR-2.2:** Users shall be able to view their own notes only
- **FR-2.3:** Users shall be able to delete their notes
- **FR-2.4:** System shall maintain note ownership and authorization

#### **3.1.3 User Interface**
- **FR-3.1:** System shall display welcome message with user name
- **FR-3.2:** System shall show masked email address
- **FR-3.3:** System shall provide intuitive note management interface
- **FR-3.4:** System shall show appropriate error messages

### **3.2 Non-Functional Requirements**

#### **3.2.1 Performance**
- **NFR-1.1:** Page load time shall not exceed 3 seconds
- **NFR-1.2:** API response time shall be under 500ms
- **NFR-1.3:** OTP delivery shall be within 30 seconds

#### **3.2.2 Security**
- **NFR-2.1:** All API endpoints shall be protected with JWT
- **NFR-2.2:** OTPs shall expire after 5 minutes
- **NFR-2.3:** User sessions shall have configurable timeout
- **NFR-2.4:** Input validation on both client and server side

#### **3.2.3 Usability**
- **NFR-3.1:** Interface shall be responsive (mobile + desktop)
- **NFR-3.2:** Design shall match provided Figma specifications
- **NFR-3.3:** Error messages shall be user-friendly and actionable

#### **3.2.4 Compatibility**
- **NFR-4.1:** Support modern browsers (Chrome, Firefox, Safari, Edge)
- **NFR-4.2:** Mobile compatibility (iOS Safari, Android Chrome)

### **3.3 Technical Requirements**

#### **3.3.1 Frontend**
- **TR-1.1:** React 18+ with TypeScript
- **TR-1.2:** Responsive CSS framework or custom responsive design
- **TR-1.3:** State management for user sessions
- **TR-1.4:** Form validation and error handling

#### **3.3.2 Backend**
- **TR-2.1:** Node.js with Express.js framework (JavaScript)
- **TR-2.2:** JWT implementation for authorization
- **TR-2.3:** Email service integration for OTP
- **TR-2.4:** Input validation and sanitization
- **TR-2.5:** RESTful API design

#### **3.3.3 Database**
- **TR-3.1:** Database selection: MongoDB
- **TR-3.2:** User schema: name, email, dateOfBirth, hashed otp, timestamps
- **TR-3.3:** Note schema: content, userId, timestamps,title
- **TR-3.4:** Proper indexing for performance

---

## **4. System Architecture**

### **4.1 High-Level Architecture**
```
Frontend (React TS) → API Gateway → Backend (Node.js) → Database
                                 ↓
                            Email Service (OTP)
```

### **4.2 API Endpoints Structure**
- **Authentication:** `/api/v1/auth/*`
- **Notes Management:** `/api/v1/notes/*`

---

## **5. User Interface Requirements**

### **5.1 Design Specifications**
- **Color Scheme:** Blue theme (#4F46E5 primary, white backgrounds)
- **Typography:** Clean, modern fonts
- **Layout:** Card-based design with flowing background
- **Responsive Breakpoints:** Mobile (<768px), Desktop (≥768px)

### **5.2 Page Requirements**
1. **Sign Up Page:** Two-step form (user info → OTP verification)
2. **Sign In Page:** Email + OTP authentication
3. **Dashboard:** Welcome section + notes management

---

## **6. Development and Deployment**

### **6.1 Development Requirements**
- **Version Control:** Git with meaningful commit messages
- **Code Quality:** ESLint, Prettier for consistent formatting
- **Documentation:** Comprehensive README with setup instructions

### **6.2 Deployment Requirements**
- **Cloud Hosting:** Deploy on platforms like Vercel, Netlify (frontend) + Railway, Render (backend)
- **Environment Variables:** Secure configuration management
- **Database Hosting:** Cloud database service

---

## **7. Assumptions and Constraints**

### **7.1 Assumptions**
- Users have access to email for OTP verification
- Modern browser support is sufficient
- Email service (Nodemailer) integration is available
- Cloud deployment platforms are accessible

### **7.2 Constraints**
- 3-day development timeline
- Backend must use JavaScript (not TypeScript as originally specified)
- Must closely replicate provided Figma designs
- No traditional password-based authentication

---

## **8. Success Criteria**
- ✅ Successful user registration and authentication
- ✅ Functional note creation and deletion
- [ ] Mobile and desktop responsive design
- ✅ Secure JWT implementation
- [ ] Cloud deployment with working URL
- ✅ Comprehensive documentation