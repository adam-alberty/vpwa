# Chat application

## Assignment

Create a progressive web application for IRC (Slack)-style text communication.

Full assignment link: https://github.com/kurice/vpwa26/tree/main/semestralny-projekt

## Physical data model diagram

## Application architecture diagram

## Design decisions

## Screenshots

## Development setup

`./frontend` - Quasar SPA
`./backend` - AdonisJS server

### Requirements

- **Node.js 24.11.0** for both frontend and backend
- (optional) **Docker** to create Postgres database

### To set up backend

```sh
cd ./backend

# Install necessary packages
npm install

# Configure environment variables as described in the example .env
cp .env.example .env

# Start the database
docker compose up -d

# Run the migrations
node ace migration:refresh --seed

# Run the backend
npm run dev
```

### To set up frontend

```sh
cd ./frontend

# Install necessary packages
npm install

# Configure environment variables as described in the example .env
cp .env.example .env

# Run the frontend
npm run dev
```
