### Tecnologías Utilizadas

Frontend

React + Vite + TypeScript (DOM / Native)

TailwindCSS

API REST

Leaflet.js (mapas)

Clean Architecture / MVVM

Prettier

CORS

Middleware personalizado

Cloudinary (almacenamiento de imágenes)

StackBlitz (pruebas y despliegues rápidos)

Vim u otros editores

Backend

Node.js

Express

MySQL

Prisma ORM

JWT

Docker (opcional)

Arquitectura modular / limpia

Diseño UI/UX

Penpot (Open Source)

---

### Instalación y Ejecución

🔹 1. Clonar el Frontend

git clone https://github.com/Ro-Are-Lo/rastreo_gps_frontend
cd rastreo_gps_frontend

🔹 2. Instalar dependencias del Frontend

npm install

🔹 3. Ejecutar el entorno de desarrollo del Frontend

npm run dev

---

### Backend (Opcional)

🔹 4. Clonar el Backend

git clone https://github.com/Ro-Are-Lo/rastreo_gps_backend
cd rastreo_gps_backend

🔹 5. Instalar dependencias del Backend

npm install

🔹 6. Ejecutar el Backend

npm run dev




```
### **Frontend README.md** (copia este contenido):
```markdown
# 🚖 Frontend - Sistema de Rastreo GPS para Taxis

Interfaz React para monitoreo en tiempo real de flota de taxis.

## 🚀 Configuración en CUALQUIER MÁQUINA

### Prerrequisitos
- Node.js 18+ **O** Docker
- Backend corriendo en http://localhost:3000

### Método 1: Rápido (con script)
```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/rastreo-gps-frontend.git
cd rastreo-gps-frontend

# 2. Cambiar a la rama de implementación
git checkout feature/mi-implementacion-completa

# 3. Setup automático
chmod +x scripts/setup.sh
./scripts/setup.sh

# 4. Iniciar
npm run dev
```



### Método 2: Manual

**bash**

```
# 1. Instalar dependencias
npm install

# 2. Configurar API URL
cp .env.example .env
# Asegúrate que VITE_API_URL apunte a tu backend

# 3. Iniciar servidor de desarrollo
npm run dev
```

### Método 3: Docker (sin instalar Node.js)

**bash**

```
# Con Docker Compose (backend + frontend)
cd ../rastreo-gps-backend  # Ve al backend primero
docker-compose up -d       # Inicia backend y DB
cd ../rastreo-gps-frontend # Regresa al frontend
docker-compose up -d       # Inicia frontend
```

## 🌐 URLs

* **Aplicación:** [http://localhost:5173](http://localhost:5173/)
* **Backend API:** [http://localhost:3000/api](http://localhost:3000/api) (debe estar corriendo)

## 📁 Estructura del Proyecto

**text**

```
src/
├── components/     # 🧩 Componentes reutilizables
├── pages/          # 📄 Páginas/Vistas
│   ├── Login/      # 🔐 Autenticación
│   └── Dashboard/  # 📊 Panel principal
├── context/        # 🌐 Estado global (Auth)
├── services/       # ⚡ Lógica de negocio
├── api/            # 🔌 Cliente HTTP (Axios)
├── types/          # 📝 Tipos TypeScript
└── utils/          # 🛠️ Funciones helper
```

## 🎨 Tecnologías Utilizadas

### Core

* **React 19** - Biblioteca UI
* **TypeScript** - Tipado estático
* **Vite** - Build tool ultrarrápido

### UI/UX

* **Tailwind CSS** - Estilos utility-first
* **Lucide React** - Iconos modernos
* **Framer Motion** - Animaciones fluidas
* **React Leaflet** - Mapas interactivos

### Routing & State

* **React Router DOM** - Navegación SPA
* **Context API** - Gestión de estado
* **Axios** - Cliente HTTP

## 🔧 Configuración (.env)

**env**

```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Rastreo GPS Taxis
```

## 📱 Vistas Implementadas

### 1. 🔐 Login

* Formulario de autenticación
* Validación en tiempo real
* Manejo de tokens JWT
* Recordar sesión

### 2. 🗺️ Mapa/Dashboard

* Mapa interactivo con Leaflet
* Marcadores de vehículos en tiempo real
* Filtros por estado y tipo
* Panel de estadísticas

### 3. 🚗 Gestión de Vehículos (En desarrollo)

* Listado de flota
* CRUD completo
* Historial de ubicaciones
* Asignación de conductores

## 🔌 Conexión con Backend

### Configuración Axios

**typescript**

```
// Se configura automáticamente
// Token JWT se envía en cada request
// Error handling centralizado
```

### Proxy Development

**javascript**

```
// En vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true
  }
}
```

## 🏗️ Build para Producción

**bash**

```
npm run build     # Crea build optimizado en /dist
npm run preview   # Sirve el build localmente
```

## 🐳 Docker

**dockerfile**

```
# Imagen de producción optimizada
# Incluye Nginx para servir archivos estáticos
# Build multi-stage para tamaño mínimo
```

Para ejecutar con Docker:

**bash**

```
docker build -t rastreo-frontend .
docker run -p 5173:80 rastreo-frontend
```

## 🚀 Scripts Disponibles

**bash**

```
npm run dev        # Desarrollo (localhost:5173)
npm run build      # Build producción
npm run preview    # Preview del build
npm run setup      # Configuración automática
```

## ✅ Estado Actual

* ✅ Estructura base completa
* ✅ Autenticación funcionando
* ✅ Mapa con Leaflet integrado
* ✅ Conexión con backend API
* ✅ Build optimizado con Vite
* ✅ Docker configurado

## 🔗 Enlaces

* [Backend API](https://github.com/tu-usuario/rastreo-gps-backend)
* [Documentación API](http://localhost:3000/api-docs)
* [Aplicación en vivo](http://localhost:5173/)

**text**

```
## **🔧 SCRIPTS DE SETUP QUE NECESITAS**

### **Backend: `scripts/setup.sh`**
```bash
#!/bin/bash

echo "🚀 SETUP AUTOMÁTICO - Backend Rastreo GPS"
echo "========================================"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no encontrado. Instala Node.js 18+${NC}"
    echo "Visita: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detectado${NC}"

# 2. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error instalando dependencias${NC}"
    exit 1
fi

# 3. Configurar .env
if [ ! -f .env ]; then
    echo "⚙️  Creando archivo .env desde .env.example..."
    cp .env.example .env
    echo -e "${GREEN}✅ Archivo .env creado${NC}"
    echo "⚠️  IMPORTANTE: Edita el archivo .env y configura:"
    echo "   - DATABASE_URL (tu conexión PostgreSQL)"
    echo "   - JWT_SECRET (clave secreta para tokens)"
else
    echo -e "${GREEN}✅ Archivo .env ya existe${NC}"
fi

# 4. Verificar Docker (opcional)
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker detectado${NC}"
    echo "   Puedes usar: docker-compose up -d"
fi

echo -e "\n${GREEN}🎉 SETUP COMPLETADO!${NC}"
echo -e "\n📋 Siguientes pasos:"
echo "1. Edita el archivo .env con tus credenciales"
echo "2. Para desarrollo: npm run dev"
echo "3. Para Docker: docker-compose up -d"
echo "4. Para pruebas: npm test"
echo -e "\n🌐 Servidor disponible en: http://localhost:3000"
```
