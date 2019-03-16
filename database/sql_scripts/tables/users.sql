CREATE TABLE users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    register_date TIMESTAMP,
    user_type VARCHAR(20) -- {student, teacher}
);