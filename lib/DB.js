const connection = require('../db/connection');


class DB {
    // references connection for later queires
    constructor(connection) {
        this.connection = connection;
    };

    // methods on db instance (promises)
    // view all departments
    getAllDepartments() {
        const sql = `SELECT department.dept_id, department._name AS Name
        FROM department`;
        return this.connection.promise().query(sql)
            .then(([rows, ...data]) => rows);
    };

    // view all roles
    getAllRoles() {
        const sql = 'SELECT * FROM role LEFT JOIN department ON role.dept_id = department.dept_id';
        return this.connection.promise().query(sql)
            .then(([rows, ...data]) => rows);
    };

    // view all employess
    getAllEmployees() {
        const sql = `SELECT employee.first_name AS First_Name, employee.last_name AS Last_Name, employee.employee_id AS ID, role.title AS Title, role.salary AS Salary, department._name as Dept,
        (SELECT CONCAT(x.first_name, ' ', x.last_name) FROM employee x WHERE x.employee_id = employee.manager_id) AS Manager
        FROM employee
        LEFT OUTER JOIN role ON employee.role_id = role.role_id
        LEFT OUTER JOIN department ON role.dept_id = department.dept_id
        ORDER BY last_name`;
        return this.connection.promise().query(sql)
            .then(([rows, ...data]) => rows);
    };

    // get only managers from employee table
    getManagers() {
        const sql = `SELECT employee.employee_id, CONCAT(employee.first_name, ' ' , employee.last_name) AS Name
        FROM employee
        WHERE employee.role_id = 1`;
        return this.connection.promise().query(sql)
            .then(([rows, ...data]) => rows);
    };

    // get employees with the same manager (get a team)
    getEmployeesByManager(answer) {
        const sql = `SELECT employee.first_name AS First_Name, employee.last_name AS Last_Name, employee.employee_id AS ID, role.title AS Title, department._name as Dept
        FROM employee 
        LEFT OUTER JOIN role ON employee.role_id = role.role_id
        LEFT OUTER JOIN department ON role.dept_id = department.dept_id
        WHERE employee.manager_id = ?
        ORDER BY last_name`;
        const params = [answer.manager_id];
        return this.connection.promise().query(sql, params)
            .then(([rows, ...data]) => rows);
    };

    // get all employees in a dept
    getEmployeesByDept(answer) {
        const sql = `SELECT employee.employee_id AS ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title
        FROM employee 
        LEFT OUTER JOIN role ON employee.role_id = role.role_id
        WHERE role.dept_id = ?
        ORDER BY last_name`;
        const params = [answer.dept_id];
        return this.connection.promise().query(sql, params)
            .then(([rows, ...data]) => rows);
    }

    // add new dept
    addDepartment(answer) {
        return this.connection.promise().query(
            'INSERT INTO department (_name) VALUES (?)',
            [answer._name]
        ).then(([result, ...data]) => {
            return {
                affectedRows: result.affectedRows,
                message: `
        Department added.
                `};
        });
    };

    // add new role
    addRole(answer) {
        const sql = 'INSERT INTO role (title, salary, dept_id) VALUES (?,?,?)';
        const params = [answer.title, answer.salary, answer.dept_id];
        return this.connection.promise().query(sql, params)
            .then(([result, ...data]) => {
                return {
                    affectedRows: result.affectedRows,
                    message: `
        Role added.
                    `};
            });
    };

    // add new employee
    addEmployee(answer) {
        const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)';
        const params = [
            answer.first_name,
            answer.last_name,
            answer.role_id,
            answer.manager_id
        ];
        return this.connection.promise().query(sql, params)
            .then(([result, ...data]) => {
                return {
                    affectedRows: result.affectedRows,
                    message: `
        Employee added.
                        `};
            });
    };

    // update employee role
    updateEmployeeRole(answer) {
        const sql = `UPDATE employee SET role_id = ? WHERE employee_id = ?`;
        const params = [answer.role_id, answer.employee_id];
        return this.connection.promise().query(sql, params)
            .then(([result, ...data]) => {
                return {
                    affectedRows: result.affectedRows,
                    message: `
        Employee updated.
                    `};
            });
    };

    // update an employees manager (new boss)
    updateEmployeeManager(answer) {
        const sql = `UPDATE employee SET manager_id = ? WHERE employee_id = ?`;
        const params = [answer.manager_id, answer.employee_id];
        return this.connection.promise().query(sql, params)
            .then(([result, ...data]) => {
                return {
                    affectedRows: result.affectedRows,
                    message: `
        Employee updated.
                    `};
            });
    };
};

module.exports = new DB(connection);