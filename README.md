# ADAVAM - E-Commerce & Admin Dashboard

Welcome to the ADAVAM project! This repository contains a full-stack e-commerce solution with multiple frontend interfaces and a robust backend API.

## 📸 Galería del Proyecto

<!-- Contenedor con scroll horizontal garantizado (Tabla) -->
<table>
  <tr>
    <td><img src="img/Screenshot%202026-08-18%20at%203.43.03%E2%80%AFPM.png" width="750" /></td>
    <td><img src="img/Screenshot%202026-08-18%20at%203.45.40%E2%80%AFPM.png" width="450" /></td>
    <td><img src="img/Screenshot%202026-08-18%20at%203.46.28%E2%80%AFPM.png" width="450" /></td>
    <td><img src="img/Screenshot%202026-08-18%20at%203.48.26%E2%80%AFPM.png" width="450" /></td>
    <td><img src="img/Screenshot%202026-08-18%20at%203.48.39%E2%80%AFPM.png" width="450" /></td>
    <td><img src="img/Screenshot%202026-08-18%20at%203.49.10%E2%80%AFPM.png" width="450" /></td>
    <td><img src="img/Screenshot%202026-08-18%20at%2010.59.25%E2%80%AFPM.png" width="450" /></td>
    <td><img src="img/Screenshot%202026-08-18%20at%2011.21.32%E2%80%AFPM.png" width="450" /></td>
    <td><img src="img/Screenshot%202026-08-18%20at%2011.21.48%E2%80%AFPM.png" width="450" /></td>
    <td><img src="img/Screenshot%202026-08-18%20at%2011.21.57%E2%80%AFPM.png" width="450" /></td>
    <td><img src="img/Screenshot%202026-08-18%20at%2011.22.08%E2%80%AFPM.png" width="450" /></td>
    <td><img src="img/Screenshot%202026-08-18%20at%2011.22.30%E2%80%AFPM.png" width="450" /></td>
    <td><img src="img/Screenshot%202026-08-18%20at%2011.22.46%E2%80%AFPM.png" width="450" /></td>
    <td><img src="img/Screenshot%202026-08-18%20at%2011.23.02%E2%80%AFPM.png" width="450" /></td>
    <td><img src="img/Screenshot%202026-08-18%20at%2011.47.04%E2%80%AFPM.png" width="450" /></td>
  </tr>
</table>

---

## 🚀 Prerequisites

- Node.js
- npm or yarn
- PostgreSQL (Database)

## 🛠️ Getting Started

Since `node_modules` are gitignored, you will need to install the dependencies for the projects you are working on.

Navigate to the respective directory and install the dependencies:

```bash
# Example for the Admin frontend project
cd frontend-admin
npm install
npm run dev

# Example for the Client Flowbite project
cd frontend-flowbite
npm install
npm run dev

# Example for the backend API
cd api
npm install
npm run dev
```

## 🔐 Environment Variables

This project uses environment variables. Do not commit `.env` files. Instead, create a `.env.test` or `.env.example` file that contains the variable names without sensitive values. 

A `.env.test` has been created for your convenience in the corresponding folders. Make sure to copy it to `.env` and fill in the necessary values before running the application.

```bash
cp .env.test .env
```
