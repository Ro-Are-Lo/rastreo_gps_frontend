#!/bin/bash

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Configurando Frontend - Rastreo GPS Taxis${NC}"
echo "================================================="

# 1. Verificar Node.js
echo -e "\n${BLUE}1. Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Instala Node.js desde: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js $NODE_VERSION instalado${NC}"

# 2. Instalar dependencias
echo -e "\n${BLUE}2. Instalando dependencias...${NC}"
npm ci
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
else
    echo -e "${RED}❌ Error instalando dependencias${NC}"
    exit 1
fi

# 3. Configurar variables de entorno
echo -e "\n${BLUE}3. Configurando variables de entorno...${NC}"
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${YELLOW}📄 Archivo .env creado desde .env.example${NC}"
        echo -e "${YELLOW}ℹ️  Asegúrate que VITE_API_URL apunte a tu backend${NC}"
    else
        echo -e "${RED}❌ No se encontró .env.example${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Archivo .env ya existe${NC}"
fi

# 4. Verificar conexión con backend
echo -e "\n${BLUE}4. Verificando conexión con backend...${NC}"
API_URL=$(grep VITE_API_URL .env | cut -d '=' -f2)
if [ -z "$API_URL" ]; then
    API_URL="http://localhost:3000"
fi

echo -e "${BLUE}🌐 Probando conexión a: $API_URL${NC}"
curl -s "$API_URL/health" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend detectado${NC}"
else
    echo -e "${YELLOW}⚠️  No se puede conectar al backend${NC}"
    echo -e "${YELLOW}   Asegúrate que el backend esté corriendo en $API_URL${NC}"
fi

echo -e "\n${GREEN}✅ CONFIGURACIÓN COMPLETADA!${NC}"
echo -e "\n${BLUE}📋 COMANDOS DISPONIBLES:${NC}"
echo "  ${GREEN}npm run dev${NC}           # Iniciar servidor de desarrollo"
echo "  ${GREEN}npm run build${NC}         # Compilar para producción"
echo "  ${GREEN}npm run preview${NC}       # Preview de producción"
echo "  ${GREEN}docker-compose up${NC}     # Iniciar con Docker"
echo -e "\n${BLUE}🌐 URLs:${NC}"
echo "  Frontend:    http://localhost:5173"
echo "  Backend API: $API_URL"