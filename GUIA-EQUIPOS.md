# 🚀 Guía de Desarrollo Multiequipo - TechStore

Esta guía contiene los pasos necesarios para trabajar en el proyecto TechStore desde diferentes computadoras sincronizando el código y la base de datos local (Docker).

---

## 🛠️ Comandos de Inicio Rápido (Cualquier Equipo)

Desde la carpeta raíz del proyecto:

| Acción | Comando |
| :--- | :--- |
| **Instalar todo** | `npm run install:all` |
| **Levantar DB (Docker)** | `docker-compose up -d` |
| **Arrancar Proyecto (Fullstack)** | `npm run dev` |
| **Arrancar solo Backend** | `npm run backend` |
| **Arrancar solo Frontend** | `npm run frontend` |

---

## 💻 Flujo de Sincronización entre Equipos

Sigue estos pasos cada vez que cambies de computadora para no perder cambios ni datos.

### 1. En el EQUIPO ACTUAL (Al terminar de trabajar)
Antes de apagar la computadora, guarda tus avances:

```bash
# 1. Exportar los datos actuales de la DB al archivo sincronizado
npm run db:export

# 2. Subir todo a Git
git add .
git commit -m "Sincronización: Avances del día y base de datos"
git push origin main
```

### 2. En el EQUIPO NUEVO (Al empezar a trabajar)
Al llegar a la otra computadora, descarga y restaura:

```bash
# 1. Bajar los últimos cambios de código y datos
git pull origin main

# 2. Asegurarse de que Docker esté corriendo
docker-compose up -d

# 3. Importar los datos descargados a tu Postgres local
npm run db:import

# 4. (Opcional) Si hay dependencias nuevas
npm run install:all

# 5. ¡A programar!
npm run dev
```

---

## ⚠️ Notas Importantes
- **Archivos `.env`**: Recuerda que el archivo `.env` NO se sube a Git. Si es la primera vez en un equipo, copia el `.env.example` de la carpeta `backend/` y renómbralo a `.env`.
- **Docker**: Asegúrate de tener Docker Desktop abierto antes de ejecutar los comandos de base de datos.
- **Limpieza de DB**: Si el comando `npm run db:import` te da problemas por datos duplicados, puedes limpiar la DB con `docker-compose down -v` y luego `docker-compose up -d` antes de volver a importar.

---

*Generado por Antigravity AI*
