import pool from '../config/db.js'; 

class User {
    static async findByUsername(username) {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    static async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findByPhoneNumber(phone_number) {
        const [rows] = await pool.query('SELECT * FROM user WHERE phone_number = ?', [phone_number]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(username, email, hashedPassword = null) {
        await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    }

    static async updatePassword(email, hashedPassword) {
        await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
    }
}

export default User;