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
pnpm all:start
```
to start all services

## Commands
In list bellow we have all commands with description:
### auto-trader
 * **auto-trader:build**
    * TBD add description
 * **auto-trader:test**
    * TBD add description
 * **auto-trader:test:watch**
    * TBD add description
 * **auto-trader:start**
    * TBD add description
### api
 * **api:start**
    * TBD add description
 * **api:build**
    * TBD add description
 * **api:test-int**
    * TBD add description
### user-control-panel
 * **user-control-panel:start**
    * TBD add description
 * **user-control-panel:build**
    * TBD add description
 * **user-control-panel:test**
    * TBD add description
 * **user-control-panel:lint**
    * TBD add description
### object-navigator
 * **object-navigator:show**
    * TBD add description
 * **object-navigator:test**
    * TBD add description
### monorepo
 * **monorepo:show**
    * TBD add description
 * **monorepo:graph**
    * TBD add description
 * **monorepo:create-app:console**
    * TBD add description
### models    
 * **models:build**
    * TBD add description
 * **models:test**
    * TBD add description
 * **models:lint**
    * TBD add description
 * **models:migrations:run**
    * TBD add description
 * **models:migrations:dev**
    * TBD add description
 * **models:migrations:seed**
    * TBD add description
 * **models:migrations:reset**
    * TBD add description
 * **models:migrations:generate**
    * TBD add description
 * **models:migrations:migrate-and-seed**
    * TBD add description
### configs
 * **configs:build**
    * TBD add description
### all
 * **all:build**
    * TBD add description
 * **all:start**
    * TBD add description
 * **all:test**
    * TBD add description
 * **all:lint**
    * TBD add description
### docker
 * **docker:external:up**
    * TBD add description
 * **docker:init-external:up**
    * TBD add description
 * **docker:int-test:up**
    * TBD add description