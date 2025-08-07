# 📋 Task App — Laravel 13 + React + Inertia.js

1. A full-stack task management app built with **Laravel 13** and **React** using **Inertia.js**.  
2. Each task is ordered within a category, and you get a simple yet powerful API + UI setup.
3. Command to import a CSV file with 1000 columns into table
---

## Features

- CRUD operations for **Categories** and **Tasks**
- Each task has a **position/order** and belongs to a category
- Categories return their tasks **ordered by position**
- Basic request validation
---

## Requirements

- PHP ≥ 8.1  
- Composer  
- SQLite (or any other supported DB)  
- Node.js & npm *(for frontend build)*

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/vikrant-repo/task-app-laravel.git
cd task-app-laravel
```
### 2. PHP Dependencies
```bash
composer install
```
### 3. Migration
```bash
php artisan migrate --seed
```
### 4. Start Local Server
```bash
composer run dev
```

### 4. Command to Import CSV
```bash
php artisan import:csv storage/app/sample.csv imported_table
```

## API Endpoints

All requests and responses are in JSON format.All routes are protected by auth:sanctum

| Method | Endpoint               | Description                  |
|--------|------------------------|------------------------------|
| GET    | `/api/categories`      | List categories (with tasks) |
| POST   | `/api/categories`      | Create a new category        |
| PUT    | `/api/categories/{id}` | Update a category            |
| DELETE | `/api/categories/{id}` | Delete a category            |
| POST   | `/api/tasks`           | Create a new task            |
| PUT    | `/api/tasks/{id}`      | Update a task                |
| DELETE | `/api/tasks/{id}`      | Delete a task                |
---

## Welcome Page
<img width="1908" height="935" alt="image" src="https://github.com/user-attachments/assets/a4b59e2f-4b29-4f41-b1af-7795f23538a1" />

## Register and Login
<img width="1899" height="882" alt="image" src="https://github.com/user-attachments/assets/ade78558-1533-4d9a-a5d6-891f0c304295" />

## Task Page
<img width="1863" height="936" alt="image" src="https://github.com/user-attachments/assets/a1559edf-1713-435a-8845-f844d552c961" />



