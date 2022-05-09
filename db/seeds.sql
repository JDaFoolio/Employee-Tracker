INSERT INTO department (_name)
VALUES 
('Engineering'), 
('Design'), 
('Sales'), 
('Accounting');

INSERT INTO role (title, salary, dept_id)
VALUES
('Manager', 100000, NULL),
('Engineer', 80000, 1),
('Designer', 60000, 2),
('Sales Person', 45000, 3),
('Accountant', 60000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('LeBron', 'James', 1, NULL),
('Lizzie', 'McGuire', 2, 1),
('Idris', 'Elba', 3, 1),
('Damian', 'Green', 3, 1),
('Shawn', 'Gabriel', 4, 1),
('Lily', 'Tran', 5, 1),
('Luis', 'Kimble', 1, NULL),
('Maxine', 'Lewis', 2, 7),
('Kishan', 'Arthur', 2, 7),
('Cole', 'Harris', 4, 7),
('Grayson', 'Midulla', 5, 7);