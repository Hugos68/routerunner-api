# Routerunner

A logistic app for truckdrivers for keeping track of their trips and registering orders and retour packagings.

## Local Development

### Prerequisites

Before you begin, ensure you have the following installed:
- [Bun](https://bun.sh/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Hugos68/routerunner.git
   cd routerunner
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env`
   - Fill in the necessary environment variables in the `.env` file

### Development

To start the development server:

```
bun run dev
```

The server will start on `http://localhost:3000`. 
The base URL for the API is `/api/v1`.

### Database Management

- Push schema changes:
  ```
  bun run drizzle:push
  ```

- Seed the database:
  ```
  bun run drizzle:seed
  ```
  Note: Once seeded there are 3 registered users with usernames: `driver`, `planner` and `admin`. They all share the same password which is: `1234567890`.

- Open Drizzle Studio:
  ```
  bun run drizzle:studio
  ```

### Format & Linting

We use Biome for formatting and linting. To check and automatically fix issues:

```
bun run biome:check
```

### Testing

Run tests using Bun's test runner:

```
bun test
```

## Docker

### Prerequisites

Before you begin, ensure you have the following installed:
- [Docker](https://www.docker.com/)

### Docker Compose

To build and run the app (including a PostgresSQL database):
```
docker-compose up -d --build
```

## API Documentation

- Swagger UI: Available at `/api-docs`
- OpenAPI documentation: Available at `/api-spec`

## License

See [LICENSE](./LICENSE.txt)
