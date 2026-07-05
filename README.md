# Employee Management System

A RESTful API built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)** for managing employees and HR operations.

---

## 📌 Project Overview

This project provides CRUD (Create, Read, Update, Delete) operations for managing employees and other HR-related entities such as departments, attendance, leaves, payroll, performance reviews, and notifications.

---

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Dotenv
- Nodemon

---

## 📂 Project Structure

```
employee-management-system/
│
├── config/
│   └── db-connect.js
│
├── controllers/
│   ├── employee-controller.js
│   ├── department-controller.js
│   ├── attendance-controller.js
│   ├── leave-controller.js
│   ├── payroll-controller.js
│   ├── performance-controller.js
│   └── notification-controller.js
│
├── models/
│   ├── employee-model.js
│   ├── department-model.js
│   ├── attendance-model.js
│   ├── leave-model.js
│   ├── payroll-model.js
│   ├── performance-model.js
│   └── notification-model.js
│
├── routes/
│   ├── employee-routes.js
│   ├── department-routes.js
│   ├── attendance-routes.js
│   ├── leave-routes.js
│   ├── payroll-routes.js
│   ├── performance-routes.js
│   └── notification-routes.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── index.js
└── README.md
```

---

## 🎯 Chosen Entity

### Employee

The Employee entity was selected because it is the core entity of the Employee Management System.

Each employee contains information such as:

- First Name
- Last Name
- Email
- Phone Number
- Job Title
- Department
- Salary
- Hire Date
- Employment Status
- Image URL

---



## ⚙️ Installation


Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGODB_URI=mongodb_connection_string

DB_NAME=employee_management_system
```

Run the server:

```bash
npm start
```

## 🧪 Testing

The API was tested using **Postman**.


---


##  Author

**Rana Tarek Ahmed**

Backend Developer

Node.js | Express.js | MongoDB | REST API
