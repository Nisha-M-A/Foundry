# Foundry — AI Product Blueprint Workspace

> **Turn a product idea into a structured software blueprint using a team of specialized AI agents.**

Foundry is an AI-powered product planning workspace that transforms a natural-language product idea into a structured software blueprint.

Instead of relying on a single AI response, Foundry uses four specialized AI agents — **Product Manager, System Architect, Backend Engineer, and UI Designer** — to analyze the same product idea from different engineering perspectives and produce structured, visualizable outputs.

Foundry also supports **iterative blueprint evolution**, allowing users to add features to an existing project while preserving the previous blueprint, export the generated blueprint, and recover from failed AI generations through retry functionality.

---

## ✨ Features

### 🤖 Multi-Agent Product Planning

Foundry divides product planning across four specialized AI agents:

* **Product Manager** — product vision, target users, requirements, user stories, and feature planning.
* **System Architect** — system components, architecture, services, databases, and connections.
* **Backend Engineer** — backend workflows, APIs, data processing, and implementation logic.
* **UI Designer** — screens, user flows, interface structure, and interaction design.

Each agent generates structured output tailored to its role rather than returning a generic AI response.

### 📊 Structured Visual Blueprints

Generated agent responses are transformed into dedicated visual representations:

* Product Manager → Product Mind Map
* System Architect → Architecture Diagram
* Backend Engineer → Backend Flowchart
* UI Designer → UI Wireframe

Dedicated blueprint routes allow users to inspect each agent's output independently.

### 🔄 Iterative Blueprint Evolution

Foundry supports incremental product development through versioned blueprints.

Users can:

1. Generate an initial **V1** blueprint.
2. Add a new feature.
3. Generate the next version while retaining the existing product context.
4. Continue evolving the blueprint across multiple versions.

This allows the blueprint to represent **V1 → V2 → V3 → V4** product evolution rather than generating disconnected plans for every feature.

### 📄 Blueprint Export

Generated blueprints can be exported into a professionally structured document containing the product information and the outputs from the four AI agents.

### 🛡️ Validation & Error Handling

AI-generated structured responses are validated before being used by the application.

If an individual agent fails during generation, Foundry:

* Records the agent failure.
* Displays a user-friendly error state.
* Allows the user to retry failed agents without recreating the project.

### 🔁 Failed-Agent Retry

Failed generations can be retried directly from the project workspace.

The retry workflow allows Foundry to recover from temporary external AI failures such as API availability or quota-related errors without requiring the user to restart the entire project.

### 🐳 Dockerized Development

Foundry is containerized using Docker Compose to provide a reproducible development environment.

The application runs as separate client and server services, while the backend connects to MongoDB for project persistence.

---

## 🏗️ Architecture

At a high level, Foundry follows a client-server architecture:

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │   Vite + Tailwind   │
                    └──────────┬──────────┘
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Node.js Backend   │
                    │      Express        │
                    └──────┬──────┬───────┘
                           │      │
                ┌──────────┘      └──────────┐
                ▼                             ▼
       ┌────────────────┐             ┌────────────────┐
       │    MongoDB     │             │   Gemini API   │
       │   Persistence  │             │  AI Generation │
       └────────────────┘             └───────┬────────┘
                                             │
                     ┌───────────────────────┼──────────────────────┐
                     ▼                       ▼                      ▼
              Product Manager       System Architect        Backend Engineer
                     │                       │                      │
                     └───────────────────────┼──────────────────────┘
                                             ▼
                                      UI Designer
```

### Agent Workflow

```text
Product Idea
     │
     ▼
Create Project
     │
     ▼
┌───────────────────────────────────────────────┐
│              AI Agent Team                    │
│                                               │
│  Product Manager                              │
│  System Architect                             │
│  Backend Engineer                             │
│  UI Designer                                  │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
              Structured AI Outputs
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
      Product       Architecture    Backend
      Blueprint       Blueprint     Blueprint
                        │
                        ▼
                  UI Blueprint
                        │
                        ▼
                Unified Project
                        │
                        ▼
              Versioned Blueprint
```

---

## 🔄 Version Evolution

Foundry's versioning workflow is designed around incremental changes.

```text
V1
│
├── Original product idea
├── Product strategy
├── System architecture
├── Backend workflow
└── UI structure
        │
        │ Add Feature
        ▼
V2
│
├── Existing V1 blueprint
└── New feature changes
        │
        │ Add Feature
        ▼
V3
│
├── Existing V2 blueprint
└── Additional feature changes
        │
        ▼
V4
└── Further product evolution
```

The goal is to preserve the existing blueprint while incorporating the newly requested functionality.

---

## 🧰 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* JavaScript / JSX
* Lucide React / React Icons

### Backend

* Node.js
* Express.js
* REST APIs

### AI

* Google Gemini API
* Specialized prompts for each AI agent
* Structured AI-generated responses
* Zod-based schema validation

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JWT
* bcryptjs

### DevOps

* Docker
* Docker Compose

### Deployment

* Vercel
* Render

### Development Tools

* Git
* GitHub
* VS Code

---

## 📁 Project Structure

```text
foundry/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── utils/
│   ├── Dockerfile
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── schemas/
│   ├── services/
│   ├── prompts/
│   ├── models/
│   ├── middleware/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git
* Docker Desktop

You will also need:

* A MongoDB database
* A Google Gemini API key

---

## ⚙️ Environment Variables

Create the required environment files according to the existing project configuration.

### Client

```env
VITE_API_URL=http://localhost:5000/api
```

### Server

Configure the server-side environment variables for:

```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

> **Never commit real API keys, database credentials, or JWT secrets to GitHub.**

If the repository's current environment variable names differ, use the names defined in the project configuration rather than copying these examples blindly.

---

## 🐳 Running with Docker

From the project root:

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

View server logs:

```bash
docker compose logs server --tail=50
```

View client logs:

```bash
docker compose logs client --tail=50
```

The default development setup exposes:

```text
Frontend → http://localhost:5173
Backend  → http://localhost:5000
```

To stop the containers:

```bash
docker compose down
```

To rebuild after code changes:

```bash
docker compose down
docker compose up -d --build
```

---

## 💻 Running Without Docker

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd foundry
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create the required `.env` files and add your local configuration.

### 5. Start the backend

```bash
cd server
npm run dev
```

### 6. Start the frontend

```bash
cd client
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

## 🧪 Validation

The project includes validation and build checks for the frontend.

Example:

```bash
cd client
npm run lint
npm run build
```

These checks help catch syntax, linting, and production-build issues before deployment.

---

## 🔐 Security Notes

Foundry relies on external services for AI generation and database persistence.

Before deploying:

* Keep API keys in environment variables.
* Do not commit `.env` files containing secrets.
* Use a strong JWT secret.
* Restrict database access appropriately.
* Configure production environment variables separately from local development.

---

## 🎯 Project Highlights

Foundry demonstrates several practical AI engineering concepts:

* Multi-agent AI architecture
* Role-specific LLM prompting
* Structured AI outputs
* Schema validation
* AI-generated visual representations
* Incremental product blueprint versioning
* Feature-driven blueprint evolution
* API-based AI integration
* Failure handling and retry mechanisms
* MongoDB persistence
* JWT authentication
* Docker containerization
* Docker Compose orchestration
* Cloud deployment

---

## 📌 Current Status

**Foundry is feature-complete and deployed.**

The current implementation includes:

* Multi-agent blueprint generation
* Four specialized AI agents
* Structured blueprint visualization
* Versioned product evolution
* Add Feature workflow
* Blueprint export
* Error handling
* Failed-agent retry
* History and project search
* Dockerized development
* Cloud deployment

---

## 👩‍💻 Author

**Nisha M. A.**

Computer Science & Engineering Undergraduate

* GitHub: https://github.com/Nisha-M-A
* LinkedIn: https://www.linkedin.com/in/nisha26/
* Portfolio: https://portfolio-nine-virid-11.vercel.app/

---

## ⭐ Why Foundry?

Traditional AI product planning often produces a single large response that mixes product requirements, architecture, backend logic, and UI decisions.

Foundry approaches the problem differently:

> **One product idea → four specialized perspectives → structured blueprints → iterative evolution.**

The result is a more organized way to move from **idea → software blueprint → evolving product plan**.
