#!/bin/bash
# GoldTrader — Dev Quick Start
set -e

echo ""
echo "🪙 ══════════════════════════════════════════════"
echo "   GoldTrader MT — Simulador XAUUSD"
echo "   Datos reales: Yahoo Finance (sin API key)"
echo "══════════════════════════════════════════════════"
echo ""

# Copia .env si no existe
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ .env creado"
fi

# Levanta Postgres
echo "🗄  Levantando PostgreSQL..."
docker compose up db -d --quiet-pull 2>/dev/null || docker-compose up db -d 2>/dev/null
echo "⏳ Esperando Postgres..."
until docker compose exec -T db pg_isready -U trader -q 2>/dev/null; do sleep 1; done
echo "✅ Postgres listo"

# Backend
echo ""
echo "🔧 Backend — instalando dependencias..."
cd backend
npm install --silent
npx prisma generate --silent
npx prisma migrate deploy
npx ts-node prisma/seed.ts
echo "🚀 Iniciando NestJS (puerto 3001)..."
npm run start:dev &
BACKEND_PID=$!
cd ..

# Espera a que el backend esté listo
echo "⏳ Esperando al backend..."
until curl -s http://localhost:3001/api/prices/current > /dev/null 2>&1; do sleep 1; done
echo "✅ Backend listo — precio XAUUSD: $(curl -s http://localhost:3001/api/prices/current | grep -o '"price":[0-9.]*' | head -1)"

# Frontend
echo ""
echo "🎨 Frontend — instalando dependencias..."
cd frontend
npm install --silent
echo "🚀 Iniciando Next.js (puerto 3000)..."
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "══════════════════════════════════════════════════"
echo "✅ GoldTrader corriendo:"
echo "   🌐 App     → http://localhost:3000"
echo "   🔌 API     → http://localhost:3001/api"
echo "   📊 Precio  → http://localhost:3001/api/prices/current"
echo "══════════════════════════════════════════════════"
echo "   Datos XAUUSD reales de Yahoo Finance"
echo "   Precio se refresca cada 30 segundos"
echo "   Ctrl+C para detener todo"
echo "══════════════════════════════════════════════════"
echo ""

trap "echo ''; echo 'Deteniendo...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; docker compose stop db" EXIT
wait
