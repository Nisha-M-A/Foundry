  ✦ Foundry

<p align="center"> <img src="https://img.shields.io/badge/ ✦-Foundry-7c3aed?style=for-the-badge" alt="Foundry"/> </p>

<h2 align="center">AI Product Planning Workspace</h2>

<p align="center"> <em>Transforming raw software ideas into structured, evolving product blueprints using a team of specialized AI agents.</em> </p>

<p align="center"> <a href="https://foundry-rose.vercel.app/"> <img src="https://img.shields.io/badge/🚀%20LIVE%20DEMO-Foundry-22c55e?style=for-the-badge" alt="Live Demo"/> </a> <a href="https://github.com/Nisha-M-A/Foundry"> <img src="https://img.shields.io/badge/💻%20GITHUB-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/> </a> </p>

<p align="center"> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/> <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/> <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/> <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" alt="Express"/> <img src="https://img.shields.io/badge/MongoDB%20Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB"/> <img src="https://img.shields.io/badge/Gemini%20API-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini"/> <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker"/> <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/> </p>

## What is Foundry?

Turning a product idea into software usually means jumping between product requirements, system architecture, backend design, database planning, and UI design.

**Foundry brings that planning process into one workspace.**

Give Foundry a product idea and its AI team generates:

| AI Agent                 | Responsibility                                                 |
| ------------------------ | -------------------------------------------------------------- |
| 🧠 **Product Manager**   | Product vision, goals, features, requirements and scope        |
| 🏗️ **System Architect** | System components, architecture and service relationships      |
| ⚙️ **Backend Engineer**  | APIs, backend services, data flow and implementation structure |
| 🎨 **UI Designer**       | Screens, user flows and interface structure                    |

The result isn't just AI-generated text.

Foundry converts the agents' outputs into **structured, visual blueprints** that can be explored, evolved and exported.

---

# 🚀 The Core Idea

### **Don't just generate a project. Evolve it.**

Foundry is designed around **versioned product evolution**.

Start with an initial idea:

```text
V1
│
├── Product Blueprint
├── Architecture Blueprint
├── Backend Blueprint
└── UI Blueprint
```

Then add a new feature:

```text
V1
 ↓
Add Feature
 ↓
V2
```

Foundry uses the existing blueprint as context and generates an updated version while preserving the existing system and integrating the new capability.

This makes the workflow closer to how real software products evolve:

> **Build → Change → Extend → Repeat**

---

# 🧩 How Foundry Works

```text
                     ┌──────────────────┐
                     │   Product Idea   │
                     └────────┬─────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │    Foundry AI Team  │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       Product Manager   System Architect   Backend Engineer
             │                 │                 │
             └─────────────────┬─────────────────┘
                               │
                               ▼
                         UI Designer
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Structured Blueprint│
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
             Product       Architecture       Backend
                │              │              │
                └──────────────┼──────────────┘
                               ▼
                              UI
                               │
                               ▼
                        Version History
                               │
                         Add Feature
                               │
                               ▼
                          V2 → V3 → V4
```

---

# 🤖 Multi-Agent AI System

Foundry uses **role-specialized AI agents** instead of treating the entire planning process as a single prompt.

### 🧠 Product Manager

Defines the **what and why**.

Produces structured product planning including:

* Product vision
* Objectives
* Core features
* Functional requirements
* Scope
* User-facing capabilities

### 🏗️ System Architect

Defines **how the system fits together**.

Produces:

* System components
* Services
* Databases
* External systems
* Component relationships
* Architecture connections

### ⚙️ Backend Engineer

Defines **how the backend behaves**.

Produces:

* API structure
* Backend services
* Data operations
* Processing logic
* Service relationships

### 🎨 UI Designer

Defines **how users interact with the product**.

Produces:

* Screens
* UI sections
* User flows
* Navigation
* Screen relationships

---

# 📊 Structured Visual Blueprints

Foundry doesn't stop at generating responses.

Each agent's output is transformed into a dedicated visual blueprint.

### Product Blueprint

Structured product requirements and feature planning.

### Architecture Blueprint

Visual representation of:

```text
Components
   ↓
Relationships
   ↓
System Architecture
```

### Backend Blueprint

Visual representation of backend services, APIs and data flow.

### UI Blueprint

Visual representation of screens and user navigation.

Dedicated blueprint routes make each area independently explorable:

```text
/projects/:projectId/blueprint/product
/projects/:projectId/blueprint/architecture
/projects/:projectId/blueprint/backend
/projects/:projectId/blueprint/ui
```

---

# 🔄 Versioned Blueprint Evolution

One of Foundry's core capabilities is **incremental blueprint evolution**.

Example:

### V1

```text
Smart Campus Navigator

Map
Search
Route Planning
Building Information
Accessibility
Admin Dashboard
```

### Add Feature

```text
"Add real-time campus occupancy."
```

### V2

```text
Smart Campus Navigator

Existing Features
       +
Real-Time Occupancy
       +
Occupancy Management
       +
Real-Time Data Flow
```

The important part is that **V2 builds on V1 instead of simply replacing it.**

---

# 🛡️ Reliability & Failure Handling

AI systems don't always succeed.

Foundry treats that as an engineering problem rather than assuming generation will always work.

### Agent-level status

Each agent can independently reach states such as:

```text
Generating
   ↓
Completed

or

Generating
   ↓
Error
   ↓
Retry
```

Failed agents can be retried without forcing the user to restart the entire project workflow.

Foundry also handles cases where an agent has no valid saved response, allowing the rest of the workspace to remain usable.

---

# 📚 Project History

Foundry maintains project versions so users can track how their product blueprint evolves over time.

Users can:

* View previous versions
* Switch between blueprint generations
* Search project history
* Compare how a project evolved through feature additions

---

# 📄 Export

Generated blueprints can be exported into a structured document format suitable for sharing and documentation.

The goal is to turn the AI-generated planning process into something that can actually leave the application and become part of a project's documentation.

---

# 🐳 Dockerized Development

Foundry is containerized using Docker Compose.

The development environment includes:

```text
┌───────────────┐
│ React + Vite  │
│   Client      │
│    :5173      │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Node + Express│
│    Server     │
│    :5000      │
└───────┬───────┘
        │
        ├──────────────► MongoDB Atlas
        │
        └──────────────► Gemini API
```

Start the complete application with:

```bash
docker compose up -d --build
```

Check running services:

```bash
docker compose ps
```

Stop the environment:

```bash
docker compose down
```

---

# 🧰 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### AI

* Google Gemini API

### Authentication

* JWT
* bcryptjs

### Infrastructure

* Docker
* Docker Compose

### Deployment

* Vercel — Frontend
* Render — Backend

### Development

* Git
* GitHub

---

# 🏗️ Architecture Overview

```text
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ React Frontend  │
                    │  Vite + Tailwind│
                    └────────┬────────┘
                             │ REST API
                             ▼
                    ┌─────────────────┐
                    │ Express Backend │
                    │     Node.js     │
                    └───────┬─────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
          MongoDB        Gemini API    Auth Layer
           Atlas                         JWT
              │
              ▼
        Project Versions
              │
              ▼
       Blueprint Data
```

---

# 🌐 Deployment

Foundry is deployed as a full-stack application:

```text
                 INTERNET
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
     Vercel              Render
    Frontend             Backend
       │                    │
       └──────── REST ──────┘
                            │
                    ┌───────┴───────┐
                    ▼               ▼
                MongoDB          Gemini
                  Atlas            API
```

### Live Application

**https://foundry-rose.vercel.app/**

---

# 🎯 Why I Built Foundry

Foundry was built around a simple question:

> **What if an AI could act less like a chatbot and more like an engineering team?**

The project explores how specialized AI agents can collaborate to transform an ambiguous software idea into structured engineering artifacts.

More importantly, it explores what happens **after the first generation** — how AI-generated systems can evolve when requirements change.

---

# 🧪 What I Learned

Building Foundry involved more than connecting an LLM API.

Key engineering challenges included:

* Designing structured multi-agent outputs
* Handling unreliable AI generation
* Validating generated data
* Preserving previous blueprint versions
* Evolving existing architecture when features are added
* Handling failed agents independently
* Building visual representations from structured AI output
* Designing retry and recovery workflows
* Dockerizing a full-stack application
* Connecting independently deployed frontend and backend services
* Debugging production CORS and SPA routing issues
* Maintaining repository security while preparing the project for public release

---

# 🔮 Future Direction

Foundry's current MVP focuses on turning ideas into structured product blueprints and evolving them through versions.

The architecture leaves room for future capabilities such as deeper engineering analysis, richer blueprint evaluation and additional AI-assisted development workflows.

**The current product scope remains intentionally focused.**

---

# 👩‍💻 Built By

**Nisha M. A.**

Computer Science Engineering Undergraduate
SDM College of Engineering & Technology

[GitHub](https://github.com/Nisha-M-A)

[LinkedIn](https://www.linkedin.com/in/nisha26/)

---

## ⭐ If you find Foundry interesting

Feel free to explore the repository, try the deployed application, or use the project as inspiration for building AI-assisted engineering workflows.

**From idea to blueprint. From blueprint to evolution.**

#  ✦ Foundry
