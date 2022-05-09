const inquirer = require("inquirer");
const db = require("../lib/DB");
const space = new inquirer.Separator();

const menuPrompts = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'View All Departments',
                    value: 'allDept',
                    short: 'Showing all departments'
                },
                {
                    name: 'View All Roles',
                    value: 'allRoles',
                    short: 'Showing all roles'
                },
                {
                    name: 'View All Employees',
                    value: 'allEmployees',
                    short: 'Showing all employees'
                },
                {
                    name: 'View Employees by Manager',
                    value: 'employeesByManager',
                    short: 'Getting managers...'
                },
                {
                    name: 'View Employees by Department',
                    value: 'employeesByDept',
                    short: 'Getting departments...'
                },
                space,
                {
                    name: 'Add a Department',
                    value: 'addDept',
                    short: 'Adding a new department'
                },
                {
                    name: 'Add a Role',
                    value: 'addRole',
                    short: 'Adding a new role',
                },
                {
                    name: 'Add an Employee',
                    value: 'addEmployee',
                    short: 'Adding a new employee'
                },
                space,
                {
                    name: "Update an Employee's Role",
                    value: 'updateEmployeeRole',
                    short: 'Updating an employee'
                },
                {
                    name: "Update an Employee's Manager",
                    value: 'updateManager',
                    short: 'Updating an employee'
                },
                space,
                {
                    name: 'Exit',
                    value: 'exitApp',
                    short: 'Bye!'
                },
                space
            ]
        }
    ]);
};

    const departmentPrompts = () => {
        return inquirer.prompt([
            {
                type: 'input',
                name: '_name',
                message: "Enter the name of the department you'd like to add.",
                validate: deptInput => {
                    if (!deptInput) {
                        console.log('The new department still needs a name.');
                        return false;
                    }
                    return true;
                }
            }
        ]);
    };

    const rolePrompts = async () => {
        // get depts from db
        let result = await db.getAllDepartments();
        let depts = result.map(dept => {
            let obj = {
                value: dept.dept_id,
                name: dept.Name
            };
            return obj;
        });

        let prompts = [
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of this new role?',
                validate: titleInput => {
                    if (!titleInput) {
                        console.log('You must enter a title!');
                        return false;
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary (do not include commas, decimals, or $).',
                validate: salaryInput => {
                    if (!salaryInput || isNaN(salaryInput)) {
                        console.log('Enter a valid number (using only numbers).');
                        return false;
                    }
                    return true;
                }
            },
            {
                type: 'list',
                name: 'dept_id',
                message: 'Which department does this role belong to?',
                choices: depts
            }
        ];

        return inquirer.prompt(prompts);
    };

    const employeePrompts = async () => {
        // get roles from db, makes roles arr for role choices
        const titles = await db.getAllRoles();
        let roles = titles.map(role => {
            let obj = {
                value: role.role_id,
                name: role.title
            };
            return obj;
        });

        // get employees from db, create managers arr for manager choices
        const people = await db.getAllEmployees();
        let managers = people.filter(person => person.Title === 'Manager').map(manager => {
            let obj = {
                value: manager.ID,
                name: `${manager.First_Name} ${manager.Last_Name}`
            };
            return obj;
        });

        managers.push({
            value: null,
            name: 'N/A'
        });

        // create employee questions
        let prompts = [
            {
                type: 'input',
                name: 'first_name',
                message: "Enter the new employee's first name.",
                validate: nameInput => {
                    if (!nameInput) {
                        console.log("Enter the new employee's first name. (Required)");
                        return false;
                    }
                    return true;
                }
            },
            {
                type: 'input',
                name: 'last_name',
                message: "Enter the new employee's last name.",
                validate: nameInput => {
                    if (!nameInput) {
                        console.log("Enter the new employee's last name. (Required)");
                        return false;
                    }
                    return true;
                }
            },
            {
                type: 'list',
                name: 'role_id',
                message: "What is the employee's title?",
                choices: roles
            },
            {
                type: 'list',
                name: 'manager_id',
                message: "Who is the employee's manager?",
                choices: managers
            }
        ];

        return inquirer.prompt(prompts);
    }

    const updateEmpRolePrompts = async () => {
        // get employees for update choices
        const people = await db.getAllEmployees();
        let employees = people.map(person => {
            let obj = {
                value: person.ID,
                name: `${person.First_Name} ${person.Last_Name}`
            };
            return obj;
        });

        // get roles for new role choices
        const titles = await db.getAllRoles();
        let roles = titles.map(title => {
            let obj = {
                value: title.role_id,
                name: title.title
            };
            return obj;
        });

        // create prompts
        let prompts = [
            {
                type: 'list',
                name: 'employee_id',
                message: 'Which employee would you like to update?',
                choices: employees
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'What is their new title?',
                choices: roles
            }
        ];

        return inquirer.prompt(prompts);
    };

    const updateEmpManagerPrompts = async () => {
        // get employees for update choices
        const people = await db.getAllEmployees();
        let employees = people.map(person => {
            let obj = {
                value: person.ID,
                name: `${person.First_Name} ${person.Last_Name}`
            };
            return obj;
        });

        // get roles for new role choices
        const bosses = await db.getManagers();
        let managers = bosses.map(person => {
            let obj = {
                value: person.employee_id,
                name: person.Name
            };
            return obj;
        });

        managers.push({
            value: null,
            name: 'N/A'
        });

        // create prompts
        let prompts = [
            {
                type: 'list',
                name: 'employee_id',
                message: 'Which employee would you like to update?',
                choices: employees
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Who is their new manager?',
                choices: managers
            }
        ];

        return inquirer.prompt(prompts);
    };

    const byManagerPrompts = async () => {
        // get mnagers for choices
        const bosses = await db.getManagers();
        let managers = bosses.map(person => {
            let obj = {
                value: person.employee_id,
                name: person.Name
            };
            return obj;
        });

        let prompts = [
            {
                type: 'list',
                name: 'manager_id',
                message: "Which manager's team would you like to see?",
                choices: managers
            }
        ];

        return inquirer.prompt(prompts);
    };

    const byDeptPrompts = async () => {
        const deptList = await db.getAllDepartments();
        let depts = deptList.map(dept => {
            let obj = {
                value: dept.dept_id,
                name: dept.Name
            };
            return obj;
        });

        let prompts = [
            {
                type: 'list',
                name: 'dept_id',
                message: "Which department would you like to see?",
                choices: depts
            }
        ];

        return inquirer.prompt(prompts);
    }

    module.exports = {
        menuPrompts,
        departmentPrompts,
        rolePrompts,
        employeePrompts,
        updateEmpRolePrompts,
        updateEmpManagerPrompts,
        byManagerPrompts,
        byDeptPrompts
    };