## CRUD API

This repository serves as the solution to the assignment creating simple CRUD API using in-memory database and Node.js core modules. The API is designed to handle basic operations for managing user records.

Additionally, the application incorporates Jest for unit testing, Webpack for build automation, and features clustering and load balancing to utilize multiple Node.js processes for enhanced performance.

## Prerequisites

- Node.js v22.9.0 or later
- Create a `.env` file and set the port value (e.g., `PORT=4000`). See `.env.example`

## Usage

- Clone this repository.
- Install dependencies `npm install`.
- Set the port value in the `.env` file.
- Start the application and run tests

## Endpoints

- **Create:** `POST /api/users`
- **Read (All):** `GET /api/users`
- **Read (One):** `GET /api/users/{userId}`
- **Update:** `PUT /api/users/{userId}`
- **Delete:** `DELETE /api/users/{userId}`

## Running the Application

There are 2 modes to run the application:

- **Development Mode:** Use `ts-node-dev` for hot-reloading:

```
  npm run start:dev
```

- **Production Mode:** Run the bundled version:

```
  npm run start:prod
```

## Clustering and Load Balancing

To run the application with multiple instances using clustering and load balancing:

```
npm run start:multi
```

## To run the Jest unit tests:

```
npm test
```

