# Chat application

## Assignment

Create a progressive web application for IRC (Slack)-style text communication.

Full assignment link: https://github.com/kurice/vpwa26/tree/main/semestralny-projekt

## Physical data model diagram

![Physical data model diagram](docs/db-diagram.png)

## Application architecture diagram

![Architecture diagram](docs/architecture-diagram.png)

## Design decisions

We tried to keep the number of dependencies to a minimum. In frontend, only `pinia` and `socket.io-client` were additionally installed. In backend, only `socket.io` was additinally installed.

- Almost all client side state is manipulated through Pinia stores to centralize state management
- Messages and user status are handled with web sockets.

## Database changes from previous checkpoint

- Constraints were added on many fields
- Adonis specific tables were created for migrations (`adonis_schema`, `adonis_schema_version`)

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
