import connect from '../database/index.js';

export async function getAllUsers(req, res, next) {
    const conn = await connect();

    const sql = 'SELECT * FROM users';
    const [rows] = await conn.query(sql);
    
    res.status(200).json({
        status: 'success',
        length: rows.length,
        data: {
            rows
        }
    })
}