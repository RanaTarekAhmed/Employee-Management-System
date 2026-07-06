# Employee Management System

A RESTful API built with **Node.js**, **Express.js**, **MongoDB (Mongoose)**, and **Multer** for managing employees and HR operations.

---

# 📌 Project Overview

The Employee Management System is a backend REST API that manages employee records and HR-related operations. It provides CRUD functionality for employees along with additional modules for departments, attendance, leave management, payroll, performance, and notifications.

The Employee module has been enhanced with professional backend features including filtering, pagination, sorting, and image upload.

---

# 🚀 Features

## Employee Module

- Create Employee
- Get All Employees
- Get Employee by ID
- Update Employee
- Delete Employee

## Advanced API Features

- Filtering employees using query parameters
- Advanced filtering (`gt`, `gte`, `lt`, `lte`)
- Pagination
- Sorting (ascending & descending)
- Default sorting by newest employees
- Upload employee profile images using Multer
- Store uploaded image filename in MongoDB
- Serve uploaded images as static files

---

# 🛠 Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Multer
- Dotenv
- Nodemon

---

# 📂 Project Structure

```text
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
├── middlewares/
│   └── multer-middleware.js
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
├── uploads/
│   └── employees/
│
├── utils/
│   └── delete-uploaded-file.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── index.js
└── README.md
```

---

# 🎯 Chosen Entity

## Employee

The Employee entity is the core entity of the Employee Management System.

Each employee contains:

- First Name
- Last Name
- Email
- Phone Number
- Job Title
- Department
- Salary
- Hire Date
- Status
- Profile Image

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone <repository-url>
```

## 2. Navigate to the project

```bash
cd employee-management-system
```

## 3. Install dependencies

```bash
npm install
```

## 4. Create a `.env` file

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

DB_NAME=employee_management_system
```

## 5. Start the server

```bash
npm start
```

The server will run on:

```
http://localhost:5000
```

---

# 🧪 API Usage Examples

## Create Employee

Create a new employee with a profile image using **multipart/form-data**.

---

## Get All Employees

Retrieve all employees.

---

## Filtering

Filter employees by fields such as:

- Department
- Status
- Salary

Example query parameters:

- department
- status
- salary[gt]
- salary[gte]
- salary[lt]
- salary[lte]

---

## Pagination

Retrieve employees page by page using:

- page
- limit

The response includes:

- Current Page
- Items Per Page
- Total Items
- Total Pages

---

## Sorting

Sort employees by any field.

Examples include:

- Salary (Ascending)
- Salary (Descending)
- Hire Date
- Newest Employees (Default)

---

## Get Employee by ID

Retrieve a single employee using its MongoDB ID.

---

## Update Employee

Update employee information and optionally replace the profile image.

---

## Delete Employee

Delete an employee and remove the associated profile image from storage.

---

# 📮 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/employees` | Create Employee |
| GET | `/api/v1/employees` | Get All Employees |
| GET | `/api/v1/employees/:id` | Get Employee by ID |
| PATCH | `/api/v1/employees/:id` | Update Employee |
| DELETE | `/api/v1/employees/:id` | Delete Employee |

---

# 🧪 Testing

The API was tested using **Postman**.

The following features were successfully tested:

- Create Employee with Image Upload
- Get All Employees
- Filtering
- Advanced Filtering
- Pagination
- Sorting
- Get Employee by ID
- Update Employee
- Delete Employee

---

# 👩‍💻 Author

**Rana Tarek Ahmed**

Backend Developer

**Skills**

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs
- Multer
- Postman
