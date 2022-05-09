require('console.table');
const db = require('./lib/DB');
const {
    menuPrompts,
    departmentPrompts,
    rolePrompts,
    employeePrompts,
    updateEmpRolePrompts,
    updateEmpManagerPrompts,
    byManagerPrompts,
    byDeptPrompts
} = require('./src/prompts');
const myError = () => {
    console.log(`
        Something went wrong...
    `);
};
const space = `
`;

async function showAllDepts() {
    const result = await db.getAllDepartments();
    return result.map(dept => {
        let obj = { Name: dept.Name };
        return obj;
    });
};

async function showAllRoles() {
    const result = await db.getAllRoles();
    return result.map(role => {
        let obj = {
            Title: role.title,
            Salary: role.salary,
            Dept: role._name
        };
        return obj;
    });
};

async function showAllEmployees() {
    const result = await db.getAllEmployees();
    return result;
};

const showEmployeesByMananger = async () => {
    const answer = await byManagerPrompts();
    const teamList = await db.getEmployeesByManager(answer);

    return teamList;
};

async function showEmployeesByDept() {
    const answer = await byDeptPrompts();
    const result = await db.getEmployeesByDept(answer);

    return result;
}

// add records
const addNewDept = () => {
    // capture user data, send to db
    return departmentPrompts()
        .then(newDept => {
            return db.addDepartment(newDept);
        }).then(result => {
            // if not add, notify user and return menu
            if (!result.affectedRows) {
                myError();
                return mainMenu();
            }
            // notify user add is success, return to menu
            console.log(result.message);
            return mainMenu();
        })
        .catch(err => {
            myError();
            console.log(err)
        });
};

const addNewRole = () => {
    // capture user data, add to db
    return rolePrompts()
        .then(newRole => {
            return db.addRole(newRole);
        })
        .then(result => {
            // if not added, error and send back to menu
            if (!result.affectedRows) {
                myError();
                return mainMenu();
            }
            // tell user add was success, return menu
            console.log(result.message);
            return mainMenu();
        })
        .catch(err => {
            myError();
            console.log(err)
        });
};

const addNewEmployee = () => {
    // capture user data and return data to db
    return employeePrompts()
        .then(newEmployee => {
            return db.addEmployee(newEmployee);
        })
        .then(result => {
            // is failed, tell the user and send to menu
            if (!result.affectedRows) {
                myError();
                return mainMenu();
            }
            // is success, tell user and send to menu
            console.log(result.message);
            return mainMenu();
        })
        .catch(err => {
            myError();
            console.log(err)
        });
};

const updateEmployeeRole = () => {
    // capture user data and send to db
    return updateEmpRolePrompts()
        .then(updatedEmployee => {
            return db.updateEmployeeRole(updatedEmployee);
        })
        .then(result => {
            // if nothing happened, tell user and return to menu
            if (!result.affectedRows) {
                myError();
                return mainMenu();
            }
            // tell user update is success, return menu
            console.log(result.message);
            return mainMenu();
        })
        .catch(err => {
            myError();
            console.log(err)
        });
};

const updateManager = () => {
    // capture user data and send to db
    return updateEmpManagerPrompts()
        .then(updatedEmployee => {
            return db.updateEmployeeManager(updatedEmployee);
        })
        .then(result => {
            // if nothing happened, tell user and return to menu
            if (!result.affectedRows) {
                myError();
                return mainMenu();
            }
            // tell user update is success, return menu
            console.log(result.message);
            return mainMenu();
        })
        .catch(err => {
            myError();
            console.log(err)
        });
};

// main menu
const mainMenu = () => {
    console.log(`
    
          Menu  
         ¯¯¯¯¯¯
    `)
    return menuPrompts()
        .then(answer => {
            let userChoice = answer.menu;

            switch (userChoice) {
                case 'allDept':
                    return showAllDepts()
                        .then(data => {
                            console.log(space);
                            console.table('Departments', data);
                        }).then(() => mainMenu());
                case 'allRoles':
                    return showAllRoles()
                        .then(data => {
                            console.log(space);
                            console.table('Employee Roles', data);
                        }).then(() => mainMenu())
                case 'allEmployees':
                    return showAllEmployees()
                        .then(data => {
                            console.log(space);
                            console.table('All Employees', data);
                        }).then(() => mainMenu());
                case 'employeesByManager':
                    return showEmployeesByMananger()
                        .then(data => {
                            console.log(space);
                            console.table('Team Employees', data);
                        }).then(() => mainMenu());
                case 'employeesByDept':
                    return showEmployeesByDept()
                        .then(data => {
                            console.log(space);
                            console.table('Department Employees', data);
                        }).then(() => mainMenu());
                case 'addDept':
                    addNewDept();
                    break;
                case 'addRole':
                    addNewRole();
                    break;
                case 'addEmployee':
                    addNewEmployee();
                    break;
                case 'updateEmployeeRole':
                    updateEmployeeRole();
                    break;
                case 'updateManager':
                    updateManager();
                    break;
                case 'exitApp':
                    return process.kill(process.pid, 'SIGTERM');
            }
        })
        .catch(err => {
            myError();
            console.log(err)
        });
};

// start app
const init = () => {
    console.log(`Welcome to the Employee Tracker`);
    // call menu
    mainMenu();
};

init();