# Instrucciones para resetear la contraseña de PostgreSQL en Windows

## Opción 1: Usando pgAdmin (MÁS FÁCIL)
1. Abre pgAdmin
2. Cuando te conectes, usa la contraseña que recuerdas
3. Click derecho en "PostgreSQL 16" → "Properties"
4. Ve a la pestaña "Connection"
5. Ahí verás el usuario "postgres"
6. Para cambiar la contraseña:
   - Click derecho en "Login/Group Roles" → "postgres" → "Properties"
   - Pestaña "Definition"
   - Cambia la contraseña a algo que recuerdes (ej: "admin123")
   - Guarda

## Opción 2: Usando SQL en pgAdmin
1. Abre pgAdmin y conéctate
2. Abre "Query Tool"
3. Ejecuta:
   ```sql
   ALTER USER postgres PASSWORD 'nueva_contraseña_aqui';
   ```
4. Usa esa nueva contraseña en backend\.env

## Opción 3: Usar Supabase (Base de datos en la nube - GRATIS)
Si no puedes acceder a PostgreSQL local:
1. Ve a https://supabase.com
2. Crea una cuenta gratis
3. Crea un nuevo proyecto
4. Copia la "Connection String" que te dan
5. En backend\.env, comenta las líneas DB_HOST, DB_PORT, etc.
6. Descomenta y usa DATABASE_URL con la connection string de Supabase
