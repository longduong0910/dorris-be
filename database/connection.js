import db from '../config/db.js';

const connection = async (sql, params) => {
    const [rows] = await db.execute(sql, params);
    return rows;
};

export default connection;