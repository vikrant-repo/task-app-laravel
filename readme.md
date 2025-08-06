Task App Laravel API
A simple REST API for managing categories and tasks, built with Laravel. Tasks can be ordered within categories.

Features
CRUD operations for Categories and Tasks

Each Task belongs to a Category and has a position/order

Categories return their list of Tasks, ordered by position

Basic request validation

Seed fake initial data with factories

Requirements
PHP ≥ 8.1

Composer

MySQL or compatible database

Node.js & npm (if using front-end assets or Laravel Mix)

Getting Started
1. Clone the repository
bash
git clone https://github.com/vikrant-repo/task-app-laravel.git
cd task-app-laravel
2. Install dependencies
bash
composer install
3. Configure environment
Copy the example environment file, then edit .env and set your database credentials:

bash
cp .env.example .env
4. Generate application key
bash
php artisan key:generate
5. Run migrations and seeders
bash
php artisan migrate --seed
6. (Optional) Build frontend assets
If needed for your setup:

bash
npm install
npm run dev
7. Start the local server
bash
php artisan serve
The API will be live at http://127.0.0.1:8000.

API Endpoints
Method	Endpoint	Description
GET	/api/categories	List categories with their tasks
POST	/api/categories	Create a new category
PUT	/api/categories/{id}	Update a category
DELETE	/api/categories/{id}	Delete a category
POST	/api/tasks	Create a new task
PUT	/api/tasks/{id}	Update a task
DELETE	/api/tasks/{id}	Delete a task
All requests and responses are JSON.

Seeding Data
Running php artisan migrate --seed creates sample categories and tasks using model factories.

License
This project is open-sourced under the MIT license.