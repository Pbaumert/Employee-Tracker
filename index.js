const inquirer = require('inquirer');
const pool = require('./db/connection');

// Main menu with options to manage departments, roles, and employees
function mainMenu() {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          pool.end();
          break;
      }
    });
}

// View all departments
function viewAllDepartments() {
  pool.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    console.table(results.rows);
    mainMenu();
  });
}

// View all roles
function viewAllRoles() {
  pool.query(
    `SELECT role.id, role.title, department.name AS department, role.salary
     FROM role
     LEFT JOIN department ON role.department_id = department.id`,
    (err, results) => {
      if (err) throw err;
      console.table(results.rows);
      mainMenu();
    }
  );
}

// View all employees
function viewAllEmployees() {
  pool.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager
     FROM employee
     LEFT JOIN role ON employee.role_id = role.id
     LEFT JOIN department ON role.department_id = department.id
     LEFT JOIN employee manager ON employee.manager_id = manager.id`,
    (err, results) => {
      if (err) throw err;
      console.table(results.rows);
      mainMenu();
    }
  );
}

// Add a department
function addDepartment() {
  inquirer
    .prompt({
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      pool.query('INSERT INTO department (name) VALUES ($1)', [answer.name], (err, results) => {
        if (err) throw err;
        console.log(`Added ${answer.name} to the database`);
        mainMenu();
      });
    });
}

// Add a role
function addRole() {
  pool.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;

    const departments = results.rows.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'Enter the name of the role:',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'Enter the salary for the role:',
        },
        {
          type: 'list',
          name: 'department_id',
          message: 'Select the department for this role:',
          choices: departments,
        },
      ])
      .then((answers) => {
        const { title, salary, department_id } = answers;
        pool.query(
          'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
          [title, salary, department_id],
          (err, results) => {
            if (err) throw err;
            console.log(`Added role ${title} to the database`);
            mainMenu();
          }
        );
      });
  });
}

// Add an employee
function addEmployee() {
  pool.query('SELECT * FROM role', (err, roleResults) => {
    if (err) throw err;

    const roles = roleResults.rows.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    pool.query('SELECT * FROM employee', (err, employeeResults) => {
      if (err) throw err;

      const managers = employeeResults.rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'first_name',
            message: "Enter the employee's first name:",
          },
          {
            type: 'input',
            name: 'last_name',
            message: "Enter the employee's last name:",
          },
          {
            type: 'list',
            name: 'role_id',
            message: "Select the employee's role:",
            choices: roles,
          },
          {
            type: 'list',
            name: 'manager_id',
            message: "Select the employee's manager:",
            choices: managers,
          },
        ])
        .then((answers) => {
          const { first_name, last_name, role_id, manager_id } = answers;
          pool.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
            [first_name, last_name, role_id, manager_id],
            (err, results) => {
              if (err) throw err;
              console.log(`Added employee ${first_name} ${last_name} to the database`);
              mainMenu();
            }
          );
        });
    });
  });
}

// Update an employee's role
function updateEmployeeRole() {
  pool.query('SELECT * FROM employee', (err, employeeResults) => {
    if (err) throw err;

    const employees = employeeResults.rows.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    pool.query('SELECT * FROM role', (err, roleResults) => {
      if (err) throw err;

      const roles = roleResults.rows.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee whose role you want to update:',
            choices: employees,
          },
          {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role for the employee:',
            choices: roles,
          },
        ])
        .then((answers) => {
          const { employee_id, role_id } = answers;
          pool.query(
            'UPDATE employee SET role_id = $1 WHERE id = $2',
            [role_id, employee_id],
            (err, results) => {
              if (err) throw err;
              console.log('Updated employee role in the database');
              mainMenu();
            }
          );
        });
    });
  });
}

// Start the application
mainMenu();
