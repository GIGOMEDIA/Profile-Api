# Insighta Labs+ — Profile Analytics System

## 📌 Overview

Insighta Labs+ is a full-stack data analytics system that provides:

* Profile data querying and filtering
* JWT-based authentication with refresh tokens
* CSV export functionality
* Multiple interfaces:

  * REST API (Backend)
  * CLI tool
  * Web dashboard

---

## 🏗️ Project Structure

This project is divided into three separate applications:

### 1. Backend API

Handles:

* Authentication (JWT + Refresh Tokens)
* Profile data querying
* CSV export
* MongoDB integration

### 2. CLI Tool

Command-line interface to:

* Login
* Fetch profiles
* Export CSV

### 3. Web Portal

Browser-based UI for:

* Login
* Viewing profiles
* Exporting data

---

## 🚀 Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* React (Vite)
* Axios
* Commander (CLI)
* JWT Authentication

---

## ⚙️ Backend Setup

### 1. Clone repo

```bash
git clone <your-backend-repo-url>
cd profile-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
REFRESH_SECRET=your_refresh_secret
```

### 4. Run server

```bash
npm run dev
```

Server runs on:

```
http://localhost:5000
```

---

## 🔐 Authentication Flow

* Login → returns:

  * accessToken
  * refreshToken

* Access token used for protected routes:

```
Authorization: Bearer <accessToken>
```

---

## 📡 API Endpoints

### Auth

* POST `/api/v1/auth/login`
* POST `/api/v1/auth/refresh`
* POST `/api/v1/auth/logout`

### Profiles

* GET `/api/v1/profiles`
* GET `/api/v1/profiles/search?q=...`
* GET `/api/v1/profiles/export`

---

## 🖥️ CLI Setup

### 1. Navigate to CLI project

```bash
cd insighta-cli
```

### 2. Install

```bash
npm install
npm link
```

### 3. Commands

#### Login

```bash
insighta login -u admin
```

#### Get profiles

```bash
insighta profiles
```

#### Export CSV

```bash
insighta export
```

---

## 🌐 Web Portal Setup

### 1. Navigate to web project

```bash
cd insighta-web
```

### 2. Install

```bash
npm install
```

### 3. Run

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 📊 Features

* Pagination & filtering
* Search query parsing
* Role-based authentication (admin / analyst)
* CSV export
* Token rotation (refresh tokens)
* CLI + Web interface

---

## ⚠️ Notes

* Ensure MongoDB is connected before using `/profiles`
* Tokens expire — use refresh endpoint
* CORS must be enabled for frontend

---

## ✅ Submission Checklist

* [ ] Backend repo working
* [ ] CLI repo working
* [ ] Web repo working
* [ ] `.env` not committed
* [ ] README included in all repos
* [ ] API tested (Postman)
* [ ] MongoDB connected
* [ ] CSV export working

---

## 👨‍💻 Author

Built for Backend Engineering Stage Assessment
