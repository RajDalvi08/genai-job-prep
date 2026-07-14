# 🚀 AI-Powered Job Prep & Interview Simulator (MERN + GenAI)

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-green.svg)](https://nodejs.org/)
[![Express Version](https://img.shields.io/badge/express-v5.2.1-lightgrey.svg)](https://expressjs.com/)
[![Mongoose Version](https://img.shields.io/badge/mongoose-v9.7.3-red.svg)](https://mongoosejs.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-In%20Progress-yellow.svg)](https://deepmind.google/technologies/gemini/)
[![React Version](https://img.shields.io/badge/React-v19.2-blue.svg)](https://react.dev/)

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

### Backend (Status: Core Auth & AI Init Done 🛠)
*   **Runtime:** Node.js
*   **Framework:** Express.js (v5)
*   **Database:** MongoDB via Mongoose
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs (Password Hashing)
*   **Environment Management:** dotenv

### Frontend (Status: Initialized 🛠)
*   **Build Tool:** Vite
*   **Library:** React.js (v19)
*   **Routing:** React Router v7
*   **Styling:** Sass

### Artificial Intelligence & Automation (Status: In Progress ⚙️)
*   **GenAI Engines:** Google Gemini API (`@google/genai` using `gemini-3.5-flash`), Groq (`groq-sdk`)
*   **Structured Outputs:** `zod` and `zod-to-json-schema` for strict schema validation
*   **PDF Compiler:** Puppeteer (Upcoming 🚀)
*   **File Uploads:** Multer (Upcoming 🚀)

---

## 📂 Project Structure

```bash
gen-ai/
├── Backend/
│   ├── src/
│   │   ├── config/              # Database connection and configs
│   │   ├── controllers/         # Route controllers (Auth logic)
│   │   ├── middlewares/         # Express middlewares (JWT auth, etc.)
│   │   ├── models/              # Mongoose Schemas (User, Blacklist, InterviewReport)
│   │   ├── routes/              # Express API routers (Auth)
│   │   ├── services/            # Business logic and AI services
│   │   └── app.js               # Express application initialization
│   ├── .env                     # Local environment variables
│   ├── package.json             # Scripts & dependencies
│   └── server.js                # Application entry point
├── Frontend/
│   ├── public/                  # Static assets
│   ├── src/                     # React components and logic
│   ├── index.html               # Main HTML entry point
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite configuration
├── .gitignore                   # Git ignore configuration
└── README.md                    # Project documentation
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

**Backend:**
```bash
cd Backend
npm install
```

**Frontend:**
```bash
cd ../Frontend
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `Backend` directory and add the following:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

### 4. Run the Development Servers

**Start the Backend Server:**
```bash
cd Backend
npm run dev
```
The server will start at `http://localhost:3000`.

**Start the Frontend Server:**
```bash
cd Frontend
npm run dev
```
The frontend will start typically at `http://localhost:5173`.

---

### 🔌 API Documentation (Current)

**Authentication Endpoints (Base URL: `/api/auth`)**

| Method | Endpoint    | Description                          | Access  |
| :---   | :---        | :---                                 | :---    |
| POST   | `/register` | Register a new user                  | Public  |
| POST   | `/login`    | Login user and receive token         | Public  |
| GET    | `/logout`   | Logout user (Token blacklisting)     | Public  |
| GET    | `/get-me`   | Get current authenticated user info  | Private |

---

## 🗺 Implementation Roadmap

- [x] Initialize Node.js & Express server.
- [x] Configure MongoDB database connection using Mongoose.
- [x] Implement User registration schema and controllers with password hashing (bcryptjs).
- [x] Complete JWT login, logout, and token blacklisting middleware.
- [x] Build the frontend dashboard base using React.js and Vite.
- [x] Initiate AI integration (Gemini API / Groq SDK).
- [x] Configure strict structured JSON generation with Gemini using Zod schema conversion.
- [ ] Add resume file upload support (Multer).
- [ ] Complete AI integration for resume processing & mock interviews.
- [ ] Create ATS-optimized resume formatting & PDF export via Puppeteer.
- [ ] Develop remaining React UI components.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/<your-username>/<your-repo-name>/issues).

---

## 📜 License
This project is licensed under the [ISC License](LICENSE).
```

It is already saved directly to the `README.md` file in your directory as well! Let me know if you need any other adjustments.
