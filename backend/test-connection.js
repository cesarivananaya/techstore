require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    logging: console.log,
});

async function testConnection() {
    try {
        console.log('🔍 Intentando conectar a PostgreSQL...');
        console.log('Host:', process.env.DB_HOST);
        console.log('Port:', process.env.DB_PORT);
        console.log('Database:', process.env.DB_NAME);
        console.log('User:', process.env.DB_USER);
        console.log('Password:', process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-3) : 'NO CONFIGURADA');

        await sequelize.authenticate();
        console.log('✅ Conexión exitosa a PostgreSQL');

        // Listar tablas
        const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        console.log('\n📋 Tablas en la base de datos:');
        if (results.length === 0) {
            console.log('   (ninguna tabla encontrada - la base de datos está vacía)');
        } else {
            results.forEach(row => console.log('  -', row.table_name));
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        console.error('\n💡 Posibles soluciones:');
        console.error('   1. Verifica que PostgreSQL esté corriendo');
        console.error('   2. Verifica la contraseña en backend\\.env (línea DB_PASSWORD)');
        console.error('   3. Verifica que la base de datos "techstore" exista en pgAdmin');
        process.exit(1);
    }
}

testConnection();
