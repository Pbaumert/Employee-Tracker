# Employee Tracker

## Description

This is a command-line application built to manage a company's employee database using Node.js, Inquirer, and PostgreSQL. The application allows users to view and manage departments, roles, and employees within a company. It is designed to help business owners organize and plan their workforce efficiently.

## Table of Contents

- [Employee Tracker](#employee-tracker)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Database Schema](#database-schema)
    - [Department Table](#department-table)
    - [Role Table](#role-table)
    - [Employee Table](#employee-table)
  - [License](#license)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Pbaumert/employee-tracker.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd employee-tracker
   ```

3. **Install dependencies**:
   Install the required Node.js packages using npm:
   ```bash
   npm install
   ```

4. **Set up PostgreSQL database**:
   - Ensure PostgreSQL is installed on your system.
   - Open your PostgreSQL client (e.g., DBeaver) and create a new database named `employee_tracker`.
   - Run the provided SQL script (in the `db/` directory) to create the necessary tables and seed the database with initial data:
     - `department`
     - `role`
     - `employee`

5. **Create a `.env` file** in the root of the project to store your PostgreSQL connection credentials:
   ```
   DB_USER=your_postgresql_username
   DB_PASSWORD=your_postgresql_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=employee_tracker
   ```

## Usage

1. **Start the application**:
   Run the following command to start the application:
   ```bash
   node index.js
   ```

2. **Command-Line Menu**:
   Once started, the application will present you with a list of options to choose from:
   - View all departments
   - View all roles
   - View all employees
   - Add a department
   - Add a role
   - Add an employee
   - Update an employee role

3. **Follow the prompts**:
   Use your keyboard to navigate the menu and follow the prompts to manage departments, roles, and employees.

## Features

- View a list of all departments, roles, and employees.
- Add new departments, roles, and employees.
- Update the role of an employee.
- User-friendly command-line interface with prompts using Inquirer.

## Technologies

- **Node.js**: JavaScript runtime for building the command-line application.
- **Inquirer.js**: Library for interactive command-line prompts.
- **PostgreSQL**: Relational database to store department, role, and employee data.
- **pg**: PostgreSQL client for Node.js.

## Database Schema

The following tables make up the database schema for this application:

### Department Table
| Column | Data Type | Description                      |
|--------|-----------|----------------------------------|
| id     | SERIAL    | Primary Key, auto-incrementing ID |
| name   | VARCHAR   | Name of the department            |

### Role Table
| Column       | Data Type | Description                            |
|--------------|-----------|----------------------------------------|
| id           | SERIAL    | Primary Key, auto-incrementing ID       |
| title        | VARCHAR   | Title of the role                      |
| salary       | DECIMAL   | Salary for the role                    |
| department_id| INTEGER   | Foreign Key referencing Department ID  |

### Employee Table
| Column     | Data Type | Description                                  |
|------------|-----------|----------------------------------------------|
| id         | SERIAL    | Primary Key, auto-incrementing ID            |
| first_name | VARCHAR   | Employee's first name                        |
| last_name  | VARCHAR   | Employee's last name                         |
| role_id    | INTEGER   | Foreign Key referencing Role ID              |
| manager_id | INTEGER   | Foreign Key referencing another Employee ID  |

## License

This project is licensed under the MIT License.