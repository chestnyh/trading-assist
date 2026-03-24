# Code Organization

This project follows a monorepo structure. Code is organized into applications, shared libraries, and supporting directories.

## Project Structure

```
trading-assist/
├── _docs/                  # Documentation
├── apps/                   # Applications aka Services
├── libs/                   # Shared libraries
├── scripts/                # Development scripts
└── docker/                 # Docker configurations
├── nx.json                 # Nx workspace configuration
├── package.json            # Dependencies and scripts
├── tsconfig.base.json      # TypeScript base configuration
└── docker-compose.yml      # Docker Compose configuration
```

## Monorepo Benefits

This structure allows for:
- **Code sharing**: Libraries can be shared across multiple applications
- **Consistent tooling**: Single configuration for linting, testing, and building
- **Atomic changes**: Changes to shared code and consuming apps can be made together
- **Dependency management**: Clear dependency graph between applications and libraries
