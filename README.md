# 🚀 AI-Powered Job Prep & Interview Simulator (MERN + GenAI)

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-green.svg)](https://nodejs.org/)
[![Express Version](https://img.shields.io/badge/express-v5.2.1-lightgrey.svg)](https://expressjs.com/)
[![Mongoose Version](https://img.shields.io/badge/mongoose-v9.7.3-red.svg)](https://mongoosejs.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Integration%20Pending-orange.svg)](https://deepmind.google/technologies/gemini/)

A **Production-Ready Full Stack Gen AI Job Preparation Web Application** designed to simulate real-world recruitment processes. This application enables users to upload resumes, analyze job descriptions, detect skill gaps, generate AI-powered interview questions, and export ATS-optimized resumes as PDFs.

---

## 🎯 Key Project Objectives

- **Secure Authentication:** Robust JWT-based authentication with cookie parser and token blacklisting for safe sessions.
- **AI-Powered Skill Gap Analysis:** Automated comparison of user resumes with job descriptions to identify missing skills using Google's **Gemini AI**.
- **Interactive AI Mock Interviews:** Custom-tailored behavioral and technical interview questions based on candidate profiles and target roles.
- **ATS-Optimized Resume Builder:** Beautifully structured resume builder that matches industry standard applicant tracking systems.
- **Dynamic PDF Generation:** High-fidelity PDF creation powered by **Puppeteer** for instant, downloadable documents.

---

## 🛠 Tech Stack

### Backend (Current Status: In Progress 🛠)
*   **Runtime:** Node.js
*   **Framework:** Express.js (v5)
*   **Database:** MongoDB via Mongoose
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs (Password Hashing)
*   **Environment Management:** dotenv

### Frontend (Upcoming 🚀)
*   **Library:** React.js
*   **Styling:** CSS / Tailwind CSS

### Artificial Intelligence & Automation (Upcoming 🚀)
*   **GenAI Engine:** Google Gemini API
*   **PDF Compiler:** Puppeteer

---

## 📂 Project Structure

```bash
gen-ai/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # MongoDB connection configuration
│   │   ├── controllers/
│   │   │   └── auth.controller.js # Auth controller (Registration logic)
│   │   ├── models/
│   │   │   └── user.model.js    # Mongoose User Schema
│   │   ├── routes/
│   │   │   └── auth.routes.js   # Auth Express routers
│   │   └── app.js               # Express application initialization
│   ├── .env                     # Local environment variables
│   ├── package.json             # Scripts & dependencies
│   └── server.js                # Application entry point
├── .gitignore               # Git ignore configuration
└── README.md                # Project documentation
```

---

## ⚙️ Installation & Setup

Follow these steps to set up and run the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Install Dependencies
Navigate into the `Backend` directory and install dependencies:
```bash
cd Backend
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `Backend` directory and add the following:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Upcoming variables
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the Development Server
Launch the server using nodemon for automatic reloads:
```bash
npm run dev
```
The server will start running at `http://localhost:3000` with the console output `Connected to Database` (once MongoDB is connected).

---

## 🔌 API Documentation (Current)

### Authentication Endpoints

#### 1. Register User
*   **Endpoint:** `POST /api/auth/register`
*   **Headers:** `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
      "username": "johndoe",
      "email": "johndoe@example.com",
      "password": "SecurePassword123"
    }
    ```
*   **Response (Success - 201 Created):**
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "_id": "60d5ec42d4a2...",
        "username": "johndoe",
        "email": "johndoe@example.com"
      }
    }
    ```

---

## 🗺 Implementation Roadmap

- [x] Initialize Node.js & Express server.
- [x] Configure MongoDB database connection using Mongoose.
- [x] Implement User registration schema and controllers with password hashing (bcryptjs).
- [ ] Complete JWT login, logout, and token blacklisting middleware.
- [ ] Add resume file upload support (Multer).
- [ ] Integrate Google Gemini AI API for resume processing & mock interviews.
- [ ] Create ATS-optimized resume formatting & PDF export via Puppeteer.
- [ ] Build the frontend dashboard using React.js.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/<your-username>/<your-repo-name>/issues).

---

## 📜 License
This project is licensed under the [ISC License](LICENSE).
