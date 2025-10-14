# First time set up

This document descripes first time set up of the system localy.
The whole project is designed to rum local set up as smooth as possible

Steps to run project locally: 

1) Clone project from git repository:
```
git clone git@github.com:chestnyh/trading-bot.git
```
2) Go to project folder:
```
cd trading-bot
```
3) Running script that check of existance of necessary tools set
```
TBD run script to
```
If something is not installed it should be installed

4) Copy file with local project env variables
```
cp .env.dev.example .env.dev
```
Probably some variables have conflicts with services you have on your machine.
So you can modigy .env.dev accordingly values accordingly.

5) Installing dependencies(as package manager we use pnpm):
```
pnpm install
```
6) Run all necessary external services:
```
pnpm docker:init-external:up
```
7) Run migration:
```
pnpm models:migrations:dev
```
8) Run seeds: 
```
models:migrations:seed
```
9) Run all services(we use microservice architrcture):
```
pnpm all:start 
```