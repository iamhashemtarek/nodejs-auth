import { createPool } from 'mysql2';

let pool;

export default function connect() {
    if(pool !== undefined){
        return pool;
    }

   // console.log(process.env.HOST, process.env.DATABASE_PORT,process.env.DATABASE_USER,process.env.DATABASE_PASSWORD,process.env.DATABASE);

    pool = createPool({
        host: process.env.HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    }).promise()

    pool.on('connection', () => {
        console.log('connected to mysql');
    })
    pool.on('release', ()=> {
        console.log('mysql connection is released');
    })

    return pool;
}