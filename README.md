# Project README

Welcome to the project! This repository contains multiple frontend and backend services.

## Prerequisites

- Node.js
- npm or yarn

## Getting Started

Since `node_modules` are gitignored, you will need to install the dependencies for the projects you are working on.

Navigate to the respective directory and install the dependencies:

```bash
# Example for a frontend project
cd frontend-admin
npm install

# Example for the backend API
cd api
npm install
```

## Environment Variables

This project uses environment variables. Do not commit `.env` files. Instead, create a `.env.test` or `.env.example` file that contains the variable names without sensitive values. 

A `.env.test` has been created for your convenience in the corresponding folders. Make sure to copy it to `.env` and fill in the necessary values before running the application.

```bash
cp .env.test .env
```
