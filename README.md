# Software Requirements Specification (SRS)
## HD Notes Application

---

### **Document Information**
- **Project Name:** HD Notes Application  
- **Version:** 1.0  
- **Date:** September 2025  
- **Prepared for:** Full Stack Development Internship Assignment  
- **Frontend Deployment:** [HD Notes Frontend](https://apna-note.vercel.app)  
- **Backend Deployment:** [HD Notes Backend](https://hdnote.onrender.com)  

---

## **1. Introduction**

### **1.1 Purpose**
This document specifies the requirements for developing and maintaining a full-stack note-taking application called **"HD Notes"** that allows users to authenticate via OTP and manage personal notes.

### **1.2 Scope**
The HD Notes application provides:
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
- MongoDB for user and note storage  
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
- FR-1.1: Register with name, date of birth, and email  
- FR-1.2: Validate email format and uniqueness  
- FR-1.3: Generate and send OTP to user’s email  
- FR-1.4: Verify OTP for account activation  
- FR-1.5: Support OTP resend functionality  
- FR-1.6: "Keep me logged in" option  
- FR-1.7: Secure logout functionality  

#### **3.1.2 Note Management**
- FR-2.1: Create notes (authenticated users only)  
- FR-2.2: View own notes only  
- FR-2.3: Delete notes  
- FR-2.4: Maintain note ownership and authorization  

#### **3.1.3 User Interface**
- FR-3.1: Display welcome message with username  
- FR-3.2: Masked email display  
- FR-3.3: Intuitive note management interface  
- FR-3.4: Error messages for invalid operations  

### **3.2 Non-Functional Requirements**

#### **Performance**
- Page load time ≤ 3 seconds  
- API response time ≤ 500ms  
- OTP delivery ≤ 30 seconds  

#### **Security**
- All API endpoints protected with JWT  
- OTP expiry = 5 minutes  
- Configurable session timeout  
- Client + server input validation  

#### **Usability**
- Fully responsive interface (mobile + desktop)  
- Matches provided Figma designs  
- Clear error messages  

#### **Compatibility**
- Modern browsers (Chrome, Firefox, Safari, Edge)  
- Mobile support (iOS Safari, Android Chrome)  

### **3.3 Technical Requirements**

#### **Frontend**
- React 18+ with TypeScript  
- TailwindCSS for responsive UI  
- State management for sessions  
- React Hook Form for validation  

#### **Backend**
- Node.js with Express.js  
- JWT for secure authorization  
- Nodemailer for OTP service  
- REST API endpoints for authentication & notes  

#### **Database**
- MongoDB (Atlas cloud hosting)  
- **User Schema:** name, email, dateOfBirth, hashed otp, timestamps  
- **Note Schema:** title, content, userId, timestamps  
- Indexed fields for performance  

---

## **4. System Architecture**

### **4.1 High-Level Architecture**

```
Frontend (React TS) → API Gateway → Backend (Node.js) → Database
                                 ↓
                            Email Service (OTP)
```


### **4.2 API Endpoints**
- **Authentication:** `/api/v1/auth/*`  
- **Notes Management:** `/api/v1/notes/*`  

---

## **5. User Interface Requirements**

### **5.1 Design**
- **Primary Color:** #4F46E5 (blue)  
- **Typography:** Clean, modern fonts  
- **Layout:** Card-based design with flowing background  
- **Breakpoints:** Mobile (<768px), Desktop (≥768px)  

### **5.2 Pages**
1. **Sign Up Page:** User info → OTP verification  
2. **Sign In Page:** Email + OTP login  
3. **Dashboard:** Welcome section + note management  

---

## **6. Development and Deployment**

### **6.1 Development**
- Version Control: GitHub  
- Code Quality: ESLint + Prettier  
- Documentation: README with setup instructions  

### **6.2 Deployment**
- **Frontend:** [Vercel](https://vercel.com)  
- **Backend:** [Render](https://render.com)  
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas)  
- **Email Service:** Nodemailer with Gmail/SMTP  

---

## **7. Assumptions and Constraints**

### **Assumptions**
- Users have email access  
- Browser compatibility ensured  
- OTP service via Nodemailer  
- Free cloud deployment platforms used  

### **Constraints**
- 3-day development deadline  
- Backend strictly in JavaScript  
- Must follow given Figma UI  
- OTP login only (no passwords)  

---

## **8. Success Criteria**
- ✅ OTP-based registration & login  
- ✅ Create & delete notes  
- ✅ JWT-protected APIs  
- ✅ Cloud deployment (frontend + backend)  
- ✅ Database on MongoDB Atlas  
- ✅ Documentation completed  
- ✅ Full mobile responsive testing  

---

## **9. Technologies Used**

<p align="center">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="React" width="60" height="60"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="TypeScript" width="60" height="60"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" alt="TailwindCSS" width="60" height="60"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" alt="Node.js" width="60" height="60"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" alt="Express" width="60" height="60"/>
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" alt="MongoDB" width="60" height="60"/>
  <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vercel.svg" alt="Vercel" width="60" height="60"/>
  <img src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/render.svg" alt="Render" width="60" height="60"/>
</p>

---
