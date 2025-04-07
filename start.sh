#!/bin/bash

# Controllo di Docker
if ! command -v docker &> /dev/null; then
    echo "Docker non è installato. Installa Docker e riprova."
    exit 1
fi

# Controllo di Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose non è installato. Installa Docker Compose e riprova."
    exit 1
fi

echo "Avvio dell'applicazione Finance App..."

# Costruisci e avvia i container
docker-compose up --build -d

echo "Attendere mentre i servizi si avviano..."
sleep 10

# Controlla lo stato dei container
echo "Stato dei container:"
docker-compose ps

echo ""
echo "L'applicazione Finance App è ora disponibile su:"
echo " - Frontend: http://localhost:3000"
echo " - Backend API: http://localhost:5000/api"
echo ""
echo "Per arrestare l'applicazione esegui: docker-compose down"
echo "Per visualizzare i log esegui: docker-compose logs -f"