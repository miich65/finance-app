# Finance App - Istruzioni Docker

Questo documento contiene le istruzioni per avviare l'applicazione Finance App utilizzando Docker. L'applicazione è composta da un frontend React, un backend Node.js/Express e un database MongoDB.

## Prerequisiti

- Docker e Docker Compose installati sul tuo sistema
- Git per clonare il repository

## Configurazione Iniziale

1. Clona il repository e naviga nella directory del progetto:

```bash
git clone <repository-url>
cd finance-app
```

2. Crea i file Docker e Docker Compose:
   - Tutti i file necessari sono già inclusi nel repository

## Avvio dell'Applicazione

1. Avvia tutti i servizi con Docker Compose:

```bash
docker-compose up -d
```

Questo comando avvierà i seguenti container:
- MongoDB (database)
- Server Node.js (backend)
- Client React (frontend con Nginx)

2. Verifica che tutti i container siano in esecuzione:

```bash
docker-compose ps
```

## Accesso all'Applicazione

- Frontend: http://localhost
- Backend API: http://localhost/api
- MongoDB: mongodb://localhost:27017 (accessibile solo dall'interno dei container o tramite MongoDB Compass con le credenziali configurate)

## Credenziali di Accesso Demo

Per testare l'applicazione, puoi utilizzare le seguenti credenziali:

- Email: test@example.com
- Password: password123

Oppure puoi registrare un nuovo account dall'interfaccia di registrazione.

## Arresto dell'Applicazione

Per fermare tutti i servizi mantenendo i dati:

```bash
docker-compose down
```

Per fermare e rimuovere tutti i container, reti, volumi e immagini:

```bash
docker-compose down -v --rmi all
```

## Risoluzione Problemi

Se incontri problemi durante l'avvio o l'utilizzo dell'applicazione dockerizzata:

1. Controlla i log dei container:

```bash
docker-compose logs
# O per un container specifico
docker-compose logs server
```

2. Verifica che tutte le variabili d'ambiente nel file docker-compose.yml siano corrette

3. Se necessario, puoi entrare in un container per debugging:

```bash
docker exec -it finance-app-server sh
```

## Note sullo Sviluppo

Durante lo sviluppo, potresti voler utilizzare una configurazione diversa che supporti il live reloading. In tal caso, modifica il docker-compose.yml per montare il codice sorgente locale nei container e utilizzare i comandi di sviluppo come `npm run dev`.