# Infotrack

ASP.NET Core 8 API plus an Angular 18 client for searching conveyancing solicitors by location. The API scrapes listing data from [solicitors.com](https://www.solicitors.com) and views results in a grid.

## Prerequisites

| Tool | Notes |
|------|--------|
| [.NET SDK](https://dotnet.microsoft.com/download) | 8.0 or later |
| [Node.js](https://nodejs.org/) | LTS (18 or 20 recommended for Angular 18) |
| npm | Included with Node.js |
| IDE (optional) | Visual Studio 2022 with **ASP.NET and web development**, or VS Code with C# / Angular extensions |

`node_modules`, `bin`, `obj`, `.vs`, and build output are **not** in the repository. Run the setup steps below after cloning.

## Repository layout

```
Infotrack/
  Infotrack.sln
  Infotrack.Server/      # ASP.NET Core Web API
  infotrack.client/      # Angular SPA (Bootstrap UI)
```

## First-time setup

```bash
git clone <repository-url>
cd Infotrack

cd infotrack.client
npm install

cd ../Infotrack.Server
dotnet restore
```

Trust the ASP.NET HTTPS development certificate (required for the Angular dev server):

```bash
dotnet dev-certs https --trust
```

## Running the application

### Option A — Visual Studio

1. Open `Infotrack.sln`.
2. Set **Infotrack.Server** as the startup project.
3. Choose a launch profile (**https**, **http**, or **IIS Express**).
4. Press **F5**.

With **https** or **IIS Express**, the solution uses **SpaProxy** to run `npm start` in `infotrack.client` automatically.

| What | URL |
|------|-----|
| Web UI (Angular dev server) | **https://127.0.0.1:56312** |
| API + Swagger (Kestrel **https** profile) | **https://localhost:7047/swagger** |
| API (Kestrel **http** profile) | **http://localhost:5172/swagger** |
| IIS Express | **http://localhost:59777** / **https://localhost:44335** |

Accept the browser warning for the local dev certificate if prompted.

> **Note:** `npm start` serves the UI over **HTTPS** on **127.0.0.1:56312**, not `http://localhost:4200` or `http://localhost:56312`.

### Option B — Command line

**Terminal 1 — API**

```bash
cd Infotrack.Server
dotnet run --launch-profile https
```

**Terminal 2 — UI**

```bash
cd infotrack.client
npm start
```

Then open **https://127.0.0.1:56312** in your browser.

## Build

**Backend**

```bash
cd Infotrack.Server
dotnet build
```

**Frontend**

```bash
cd infotrack.client
npm run build
```
