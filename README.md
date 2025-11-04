# 🗄️ Objects — Remote Application (Storage)

The **Objects** microfrontend is part of the **Storage** application group.  
It is built with [React](https://react.dev/) and [Rsbuild](https://modernjs.dev/rsbuild) using [Module Federation](https://module-federation.io/).

This module integrates into the **Chrome Host application** and provides UI and functionality for managing S3-compatible object storage users, buckets, and quotas.

---

## 🚀 Overview

The **Objects App** provides user-facing functionality for managing S3/Swift storage users, their buckets, quotas, and resources.  
It consumes shared components, hooks, and utilities exposed by the **Chrome Host Application**.

### 🔧 Features
- 👥 **S3/Swift User Management** — create, view, edit, and delete storage users
- 📊 **Quota Management** — configure and manage storage quotas including objects count, space (data size), buckets limit, and storage types/pools
- 🪣 **Bucket Management** — create, view, edit, and delete S3 buckets for each user
- 📈 **User Details** — view comprehensive user information including overview, resource usage, and bucket lists
- 💾 **Resource Configuration** — configure storage types, space limits, object limits, and bucket limits for users
- 🔗 **Endpoint Management** — manage public and private endpoints for storage access
- 📊 **Usage Monitoring** — view real-time usage statistics for space, objects, and buckets
- 🔗 **Shared UI and logic** imported from the Host app
- 🧩 **Microfrontend integration** using Module Federation

---

## 🧱 Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | [React 18+](https://react.dev/) |
| Bundler | [Rsbuild](https://modernjs.dev/rsbuild) |
| Microfrontends | [Module Federation](https://module-federation.io/) |
| UI Library | [shadcn/ui](https://ui.shadcn.com/) *(imported from Host)* |
| Routing | [React Router](https://reactrouter.com/) |
| Internationalization | [react-i18next](https://react.i18next.com/) |
| Global State | [Redux](https://redux.js.org/) *(via Host store)* |
| Utilities | [lodash](https://lodash.com/), [lucide-react](https://lucide.dev/) |

---

## ⚠️ Important Note

> **This remote application cannot run independently.**  
> It must always be loaded and executed within the **Chrome Host application** context.  
> The Host provides authentication, global routing, shared UI components, and state management — all of which are required for Objects to function properly.

---

## ⚙️ Installation & Local Development

### 1. Clone the repository

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Before starting the app, you need to create a local environment file.
Copy the example file:

```bash
cp .env.example .env.local
```
Open .env.local and provide valid values for all keys (API endpoints, etc.).

### 4. Start the development server
```bash
npm run dev
```

The app will be available at:
http://localhost:8001
