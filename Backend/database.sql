use sky_detector;
CREATE TABLE USERS
(
    id INT
    AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR
    (100),
    password VARCHAR
    (100),
    username VARCHAR
    (30) PRIMARY KEY,
    focalLength FLOAT,
    height FLOAT,
    width FLOAT,
	register_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);