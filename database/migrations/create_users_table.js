import connection from '../connection.js';

const createUsersTable = async () => {
    const user_table = `
        CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255),
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            phone_number VARCHAR(15),
            address VARCHAR(255),
            role ENUM('admin', 'user') DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await connection(user_table);
        console.log('Bảng users đã được tạo.');
    } catch (error) {
        console.error('Lỗi tạo bảng:', error);
    }
    process.exit(0);
};

createUsersTable();
