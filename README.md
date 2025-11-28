# GraphQL Practice App

A minimal monorepo demonstrating GraphQL client-server integration with Apollo Server and Apollo Client.

## Structure

```
/server    - Apollo Server (Node + TypeScript)
/client    - React app (Vite + TypeScript) with Apollo Client
```

## Prerequisites

- Node.js (v16 or higher)
- npm

## Getting Started

### 1. Start the Server

```bash
cd server
npm run dev
```

The GraphQL server will start on `http://localhost:4000/graphql`

### 2. Start the Client (in a new terminal)

```bash
cd client
npm run dev
```

The React app will start on `http://localhost:5173`

### 3. View in Browser

Open `http://localhost:5173` in your browser. You should see the message "Hello from Apollo Server!" fetched via GraphQL.

## What's Included

### Server (`/server`)
- **Apollo Server** with a single `hello` query
- **TypeScript** configuration
- **Hot reload** with ts-node-dev

### Client (`/client`)
- **React** with Vite
- **Apollo Client** configured to query the GraphQL server
- **TypeScript** support
- Simple UI displaying the `hello` query result

## GraphQL Schema

```graphql
type Query {
  hello: String!
}
```

## Tech Stack

- **Server**: @apollo/server, graphql, TypeScript
- **Client**: React, @apollo/client, Vite, TypeScript

