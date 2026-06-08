# 💰 Salary Manager Pro

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.6-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Vite-8.0.12-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind CSS-4.3.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/dipeshgirase12-ai/Salary-Manager-Pro?style=for-the-badge&logo=github" alt="Stars">
  <img src="https://img.shields.io/github/forks/dipeshgirase12-ai/Salary-Manager-Pro?style=for-the-badge&logo=github" alt="Forks">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js" alt="Node">
  <img src="https://img.shields.io/badge/Express.js-4.19.2-000000?style=for-the-badge&logo=express" alt="Express">
</p>

---

<div align="center">

# 🚀 The Ultimate Salary Management Solution

*A modern, full-stack salary management system with worker tracking, salary calculations, PDF/Excel exports, and secure authentication.*

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Now-2ecc71?style=for-the-badge&logo=vercel)]()
[![Source Code](https://img.shields.io/badge/📂%20Source%20Code-GitHub-333?style=for-the-badge&logo=github)]()
[![Contact](https://img.shields.io/badge/📧%20Contact%20Developer-E-red?style=for-the-badge&logo=gmail)]()

</div>

---

## ✨ Features

<table>
<tr>
<td valign="top">

### 👷 Worker Management
- Add, edit, and delete worker records
- Track mobile numbers, joining dates
- Active/Inactive status management

### 💰 Salary Management
- Calculate salaries with working days
- Advance payment tracking
- Automatic final salary computation

### 📅 Attendance Tracking
- Track daily attendance
- Monthly attendance reports
- Attendance-based salary calculation

</td>
<td valign="top">

### 📊 Analytics Dashboard
- Real-time statistics
- Total salary overview
- Advance payment tracking
- Visual data cards

### 📄 PDF Export
- Monthly salary reports
- Full database exports
- Professional formatted documents

### 📈 Excel Export
- Spreadsheet-compatible exports
- Formatted salary sheets
- Easy data analysis

</td>
</tr>
</table>

---

### 🔐 Security Features

| Feature | Description |
|---------|-------------|
| JWT Authentication | Secure token-based auth |
| Password Hashing | bcryptjs encryption |
| Protected Routes | Role-based access control |
| User Data Isolation | Per-user localStorage keys |
| Guest Mode | View-only demo access |

---

### 💾 Additional Features

- 🗑️ **Recycle Bin** - Soft delete with restore capability
- 💾 **Backup & Restore** - JSON backup system
- 🌙 **Dark Mode** - Easy on the eyes
- 📱 **Mobile Responsive** - Works on all devices
- 🎯 **Multi-User Support** - Isolated user data
- ⚡ **Fast Loading** - Optimized performance

---

## 🎬 Animated Demo

<details>
<summary><b>📺 Click to View Demo GIFs</b></summary>

### Dashboard
![Dashboard Demo](./assets/dashboard-demo.gif)

### Worker Management
![Worker Management](./assets/workers-demo.gif)

### Salary Management
![Salary Management](./assets/salary-demo.gif)

### Attendance
![Attendance](./assets/attendance-demo.gif)

### PDF Export
![PDF Export](./assets/pdf-export-demo.gif)

### Excel Export
![Excel Export](./assets/excel-export-demo.gif)

</details>

---

## 📸 Screenshots

<details>
<summary><b>🖼️ View Screenshots</b></summary>

| Dashboard | Workers | Salary |
|:---------:|:-------:|:------:|
| ![Dashboard](https://via.placeholder.com/400x300/38B2AC/FFFFFF?text=Dashboard) | ![Workers](https://via.placeholder.com/400x300/646CFF/FFFFFF?text=Workers) | ![Salary](https://via.placeholder.com/400x300/10B981/FFFFFF?text=Salary) |

| Attendance | Reports |
|:----------:|:-------:|
| ![Attendance](https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Attendance) | ![Reports](https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Reports) |

</details>

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| ![React](https://img.shields.io/badge/React-19.2.6-61DAFB?style=flat&logo=react) | 19.2.6 | UI Framework |
| ![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?style=flat&logo=vite) | 8.0.12 | Build Tool |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3.0-38B2AC?style=flat&logo=tailwind-css) | 4.3.0 | Styling |
| ![React Router](https://img.shields.io/badge/React%20Router-7.17.0-FFFFFF?style=flat&logo=react-router) | 7.17.0 | Routing |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js) | 18+ | Runtime |
| ![Express.js](https://img.shields.io/badge/Express-4.19.2-000000?style=flat&logo=express) | 4.19.2 | API Server |
| ![JWT](https://img.shields.io/badge/JWT-9.0.2-000?style=flat&logo=jsonwebtoken) | 9.0.2 | Authentication |
| ![bcryptjs](https://img.shields.io/badge/bcryptjs-2.4.3-000?style=flat) | 2.4.3 | Password Hashing |

### Libraries
| Library | Purpose |
|---------|---------|
| ![ExcelJS](https://img.shields.io/badge/ExcelJS-4.4.0-33CF53?style=flat&logo=microsoft-excel) | Excel Export |
| ![jsPDF](https://img.shields.io/badge/jsPDF-4.2.1-FF0000?style=flat) | PDF Generation |
| ![jspdf-autotable](https://img.shields.io/badge/jspdf--autotable-5.0.8-FF6B6B?style=flat) | PDF Tables |

---

## 📐 Architecture

```mermaid
graph TB
    subgraph Client["Frontend - React + Vite"]
        direction TB
        UI["UI Components"] --> PAGES["Pages"]
        PAGES --> UTILS["Utils"]
        UTILS --> STORE["Storage Layer"]
    end

    subgraph Server["Backend - Express + Node"]
        direction TB
        API["API Routes"] --> AUTH["Auth Controller"]
        API --> WORKERS["Workers API"]
        API --> SALARIES["Salaries API"]
        AUTH --> JWT[(JWT Token)]
        WORKERS --> DB[("SQLite")]
        SALARIES --> DB
    end

    Client --> |HTTP/HTTPS| Server
    STORE --> |localStorage| LS[("Local Storage")]

    style Client fill:#38B2AC,color:#FFF
    style Server fill:#646CFF,color:#FFF
    style DB fill:#F59E0B,color:#FFF
    style LS fill:#10B981,color:#FFF
```

---

## 📁 Project Structure

```
Salary-Manager-Pro/
├── assets/                 # Images and GIFs
├── public/                 # Static assets
├── server/                 # Backend server
│   ├── src/
│   │   └── server.js      # Express server
│   ├── .env               # Environment variables
│   └── package.json
├── src/                   # Frontend source
│   ├── components/
│   │   └── Navbar.jsx     # Navigation bar
│   ├── pages/
│   │   ├── AdminLogin.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Workers.jsx
│   │   ├── Salaries.jsx
│   │   └── Attendance.jsx
│   ├── utils/
│   │   ├── auth.js        # Authentication
│   │   ├── authApi.js     # Auth API calls
│   │   ├── storage.js     # localStorage utils
│   │   ├── excelExport.js # Excel export
│   │   └── pdfExport.js   # PDF export
│   ├── App.jsx            # Main app
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── package.json           # Frontend dependencies
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

---

## 🚀 Installation Guide

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/dipeshgirase12-ai/Salary-Manager-Pro.git
cd Salary-Manager-Pro
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 4. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cd server
cp .env.example .env
```

Example `.env`:
```env
# Server Configuration
PORT=3001

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_PLAIN=admin123

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 5. Start the Application

#### Start Frontend (in one terminal):
```bash
npm run dev
```

#### Start Auth Server (in another terminal):
```bash
npm run dev:auth
```

Or combined:
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd server && npm run dev
```

### 6. Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Auth Server:** http://localhost:3001

### 7. Demo Access (No Login Required)

To view the demo without registering:
1. On the login page, click **"Continue as Guest"**
2. You'll have view-only access to the dashboard, workers, and salaries pages
3. All add/edit/delete buttons will be hidden in guest mode

---

## 🔐 User Roles & Access Modes

### 👤 Guest Mode (Demo)
| Permission | Status |
|------------|--------|
| View Dashboard | Allowed |
| View Workers | Allowed |
| View Salaries | Allowed |
| Add/Edit/Delete | Disabled |
| Export Data | Disabled |
| Backup/Restore | Disabled |

### 👨‍💻 Admin Mode (Full Access)
| Permission | Status |
|------------|--------|
| View Dashboard | Allowed |
| View Workers | Allowed |
| View Salaries | Allowed |
| Add/Edit/Delete | Allowed |
| Export Data | Allowed |
| Backup/Restore | Allowed |

---

## 📡 API Documentation

### Authentication APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/login` | POST | Admin login with JWT |

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1...",
  "userId": "admin"
}
```

### Dashboard APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dashboard/stats` | GET | Get dashboard statistics |

### Workers APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| GET all workers | GET | Retrieve all workers |
| GET worker by ID | GET | Get single worker |
| POST new worker | POST | Create new worker |
| PUT update worker | PUT | Update existing worker |
| DELETE worker | DELETE | Delete worker |

### Salary APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| GET all salaries | GET | Retrieve all salaries |
| GET salary by ID | GET | Get single salary |
| POST new salary | POST | Create new salary |
| PUT update salary | PUT | Update existing salary |
| DELETE salary | DELETE | Delete salary |

### Export APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| GET /export/excel | GET | Export to Excel |
| GET /export/pdf | GET | Export to PDF |
| GET /export/pdf/full | GET | Full database PDF |

---

## 🔒 Security Features

```
+-------------------------------------------------------------+
|                    SECURITY ARCHITECTURE                    |
+-------------------------------------------------------------+
|                                                             |
|  +-------------+    +-------------+    +-------------+      |
|  |   JWT      |    |  bcrypt     |    |  Route      |      |
|  |  Tokens    |----|  Hashing    |----|  Guards     |      |
|  +-------------+    +-------------+    +-------------+      |
|        |                  |                  |               |
|        v                  v                  v               |
|  +-------------+    +-------------+    +-------------+      |
|  |  SQLite     |    | Per-User    |    |  Role       |      |
|  |  Database   |    |  Isolation  |    |   Based     |      |
|  +-------------+    +-------------+    +-------------+      |
|                                                             |
+-------------------------------------------------------------+
```

---

## 🚀 Performance Optimizations

| Feature | Implementation |
|---------|----------------|
| Fast Loading | Vite's optimized build |
| Optimized Queries | localStorage indexing |
| Responsive UI | Tailwind CSS utilities |
| Minimal Rerenders | React hooks optimization |
| Smart Caching | useMemo & useCallback |

---

## 🌟 Roadmap

```
+-------------------------------------------------------------+
|                    FUTURE FEATURES                          |
+-------------------------------------------------------------+
|                                                             |
|  Android App       ---->  React Native mobile app           |
|  Cloud Sync        ---->  Multi-device synchronization      |
|  WhatsApp Reports  ---->  Automated WhatsApp alerts         |
|  Multi-Company     ---->  Multi-tenant architecture        |
|  Payroll Automation ---->  Auto salary calculations         |
|  Advanced Analytics ---->  Charts & visualizations          |
|  Push Notifications ---->  Browser push notifications       |
|  PWA Support       ---->  Progressive web app              |
|                                                             |
+-------------------------------------------------------------+
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create your feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Salary Manager Pro
Created by Dipesh Girase

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Developer Profile

<p align="center">

<a href="https://github.com/dipeshgirase12-ai">
  <img src="https://img.shields.io/badge/GitHub-dipeshgirase12--ai-333?style=for-the-badge&logo=github" alt="GitHub">
</a>

<a href="https://www.linkedin.com/in/dipesh-girase-4598b52b2">
  <img src="https://img.shields.io/badge/LinkedIn-Dipesh%20Girase-0077B5?style=for-the-badge&logo=linkedin" alt="LinkedIn">
</a>

</p>

### Made with ❤️ by Dipesh Girase

*Full-Stack Developer | React Enthusiast | Problem Solver*

---

**Connect with me:**
- GitHub: [dipeshgirase12-ai](https://github.com/dipeshgirase12-ai)
- LinkedIn: [Dipesh Girase](https://www.linkedin.com/in/dipesh-girase-4598b52b2)

---

**Star this repo if you like it!**

[![Star](https://img.shields.io/github/stars/dipeshgirase12-ai/Salary-Manager-Pro?style=social&logo=github)]()
[![Follow](https://img.shields.io/github/followers/dipeshgirase12-ai?style=social&logo=github)]()

---

<p align="center">
  <strong>© 2024 Salary Manager Pro. All rights reserved.</strong>
</p>

<p align="center">
  <a href="#">Back to top</a>
</p>
