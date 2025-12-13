# Chat application

## Assignment

Create a progressive web application for IRC (Slack)-style text communication.

Full assignment link: https://github.com/kurice/vpwa26/tree/main/semestralny-projekt

## Physical data model diagram

## Application architecture diagram

## Design decisions

## Screenshots

![Chat screen](docs/screenshots/chat.png)
![Add channel screen](docs/screenshots/add-channel.png)
![Settings](docs/screenshots/settings.png)
![Invite](docs/screenshots/invite.png)
![Register screen](docs/screenshots/register.png)
![Login screen](docs/screenshots/login.png)

## Development setup

### Requirements

- **Node.js 24.11.0** for both frontend and backend
- (optional) **Docker** to create Postgres database

### To set up backend (AdonisJS)

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

### To set up frontend (Quasar SPA)

```sh
cd ./frontend

# Install necessary packages
npm install

# Configure environment variables as described in the example .env
cp .env.example .env

# Run the frontend
npm run dev
```
