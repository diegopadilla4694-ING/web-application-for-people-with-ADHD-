import mysql from "mysql2/promise";

export const pool = mysql.createPool({
    host: "bgmdntp0fxpecf7ftkxe-mysql.services.clever-cloud.com",
    user: "ulgznnricuicq9eo",
    password: "5l9h6AuI82mbKStL0LCm",
    database: "bgmdntp0fxpecf7ftkxe",
    port: 3306,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    
    ssl: {
        rejectUnauthorized: false
    }
});