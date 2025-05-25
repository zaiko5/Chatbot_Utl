import mysql from 'mysql2/promise';  // la versión promise es para usar async/await

// Configuración de conexión, típicamente en .env
export const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cervantespartida01',      // Cambia según lo que pusiste
    database: 'chatbotdb',
});

export default connection;