# Project Commands

The purpose of this documentation is having explanation for all project commands that we have in package.json file.
All commands have `:` as separator. At start(before `:`) we specify what service/library/tool this command relates to. Then next could be command that related to the service/library/tool. This second part can also be separated by `:` which depends on your service/library/tool structure.

## Visualisation
```
<service-name>:<command-for-this-service>
```
or
```
<service-name>:<sub-domain>:<command-for-this-sub-domain>
```
## all
Also we can specify `all` as service name for running specific command for all services. For example `all:build` command will build all services/library/tool that reserved in this project.

## How to run?
We can't run those commands directly. For this we use package manager. Currently we use `pnpm` so to run some command we should use `pnpm`. For example:
```
pnpm api:start
```

## Commands
In list bellow we have all commands with description:
### auto-trader
Auto trader service. More info [here](../apps/auto-trader/README.md)
 * **auto-trader:build** - Build auto-trader service
 * **auto-trader:test** - Run tests for auto-trader service
 * **auto-trader:test:watch** - Run tests for auto-trader in watch mode
 * **auto-trader:start** - Start auto-trader service
### api
Api service. More info [here](../apps/api/README.md)
 * **api:start** - Start api service
 * **api:build** - Build api service
 * **api:test-int** - Run api test-int services
### user-control-panel
User control panel service. More info [here](../apps/user-control-panel/README.md)
 * **user-control-panel:start** - Start user-control-panel service
 * **user-control-panel:build** - Build user-control-panel service
 * **user-control-panel:test** - Run tests for user-control-panel service
 * **user-control-panel:lint** - Run linting for user-control-panel service
### object-navigator
Object navigator library. More info [here](../libs/object-navigator/README.md)
 * **object-navigator:show** - Show object-navigator project information
 * **object-navigator:test** - Run tests for object-navigator library
 * **crypto-utils:build** - Build crypto-utils library
 * **crypto-utils:test** - Run tests for crypto-utils library
### monorepo
Under `monorepo` domain we have commands related to monorepo management.
 * **monorepo:show** - Show all projects in the monorepo
 * **monorepo:graph** - Generate and display dependency graph
 * **monorepo:create-app:console** - Create a new console application
### models
Models library. More info [here](../libs/models/README.md)
 * **models:build** - Build models library
 * **models:test** - Run tests for models library
 * **models:lint** - Run linting for models library
 * **models:migrations:run** - Run database migrations
 * **models:migrations:dev** - Run migrations in development mode
 * **models:migrations:seed** - Seed database with initial data
 * **models:migrations:reset** - Reset database and run migrations
 * **models:migrations:generate** - Generate new migration files
 * **models:migrations:migrate-and-seed** - Run migrations and seed database
### configs
Configs library. More info [here](../libs/configs/README.md)
 * **configs:build** - Build configs library
### all
`all` domain run specific command in all monorepo services/libraries/tools that consist this information 
 * **all:build** - Build all services and libraries
 * **all:start** - Start all services
 * **all:test** - Run tests for all services and libraries
 * **all:lint** - Run linting for all services and libraries
### docker
`docker` domain to work with external services
 * **docker:external:up** - Start external services (PostgreSQL)
 * **docker:init-external:up** - Initialize and start external services
 * **docker:int-test:up** - Start services for integration testing