DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department; 

CREATE TABLE department (
    dept_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    _name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    role_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    dept_id  INTEGER,
    CONSTRAINT fk_department FOREIGN KEY (dept_id) REFERENCES department(dept_id) ON DELETE SET NULL
);

CREATE TABLE employee (
    employee_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE SET NULL,
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(employee_id) ON DELETE SET NULL
);