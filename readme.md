# 📋 Task App — Laravel 13 + React + Inertia.js

A full-stack task management app built with **Laravel 13** and **React** using **Inertia.js**.  
Each task is ordered within a category, and you get a simple yet powerful API + UI setup.

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



