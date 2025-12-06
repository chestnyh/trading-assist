# Project Architecture

## Overview

The purpose of this documentation is to provide a high-level project overview. This project implements a microservices architecture where services are split according to their specific responsibilities and domains.

### High-Level Architecture Visualisation
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │  Auto Trader    │
│   (React)       │◄──►│   (NestJS)      │    │   (NestJS)      │
│                 │    │                 │    │                 │
│ - User Control  │    │ - Authentication│    │ - Rule Engine   │
│ - Rule Builder  │    │ - Rule CRUD     │    │ - Action Hub    │
│                 │    │ - User Mgmt     │    │ - Execution     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                 │                       │
                                 │                       │
                                 ┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    │                 │
                    │ -  Store data   │
                    │                 │
                    │                 │
                    └─────────────────┘
```

### Service Breakdown

#### 1. User Control Panel (`apps/user-control-panel/`) 
 - Frontend interface for users to manage trading rules. 
 - Communicate with Backend API via http.
[More info about User Control Panel](../apps/user-control-panel/README.md)

#### 2. API Service (`apps/api/`)
 - Provides RESTful API for data management. Provides CRUD operations. 
[More info about API Service](../apps/api/README.md)

#### 3. Auto Trader (`apps/auto-trader/`)
 - Core trading engine that consume rules from database and execute them according specified configuration.
[More info about Auto Trader](../apps/auto-trader/README.md)