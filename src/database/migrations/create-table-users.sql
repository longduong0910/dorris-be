CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL UNIQUE,
    email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL UNIQUE,
    password VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
    full_name VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL, 
    phone_number VARCHAR(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    address VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    sso_provider ENUM('local', 'google', 'facebook') DEFAULT 'local',
    sso_id VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
);
