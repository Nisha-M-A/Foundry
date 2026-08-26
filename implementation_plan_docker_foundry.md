# Dockerize Foundry Application

## Goal Description
Dockerize the existing Foundry application (React/Vite client and Node.js/Express server) for local development and testing, ensuring external services (MongoDB Atlas, Gemini API) remain external and secrets are not hardcoded.

## User Review Required
None - this is a standard local development Docker configuration following the provided constraints.

## Proposed Changes

### Docker Configuration
#### [NEW] [client/Dockerfile](file:///c:/Users/nisha/Downloads/foundry/client/Dockerfile)
Create a Dockerfile for the frontend that installs dependencies and runs the Vite development server, exposed on port 5173.

#### [NEW] [client/.dockerignore](file:///c:/Users/nisha/Downloads/foundry/client/.dockerignore)
Exclude `node_modules`, `.env`, and `dist`.

#### [NEW] [server/Dockerfile](file:///c:/Users/nisha/Downloads/foundry/server/Dockerfile)
Create a Dockerfile for the backend that installs dependencies and runs the Node.js server, exposed on port 5000.

#### [NEW] [server/.dockerignore](file:///c:/Users/nisha/Downloads/foundry/server/.dockerignore)
Exclude `node_modules` and `.env`.

#### [NEW] [docker-compose.yml](file:///c:/Users/nisha/Downloads/foundry/docker-compose.yml)
Create a Compose file to orchestrate both services.
- `server` service mapped to port 5000, reading env vars from `./server/.env`.
- `client` service mapped to port 5173, with `VITE_API_URL` set to `http://localhost:5000/api`.

## Verification Plan
1. Stop running local instances.
2. Run `docker-compose build`.
3. Run `docker-compose up -d`.
4. Verify containers are running.
5. Access the app via `http://localhost:5173`.
6. Test a Foundry workflow (Login, Create Project, Generate Blueprint, Add Feature, Versioning).
