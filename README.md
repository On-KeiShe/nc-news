# NC News Backend Project

Welcome to my project NC News - a backend project for a news application using RESTful API. This project is built with **Node.js**, **Express** and **PostgreSQL**.

NC News is a Reddit-style new aggregation app, providing data on articles, topics, users and comments. It supports queries for sorting anf filtering.

## Hosted Version
You can view the hosted version here:
https://

## Tech Stack
- Node.js
- Express
- PostgreSQL
- pg-format
- Jest
- Supertest

## Getting Started Locally

### 1. Clone the repository
git clone https://github.com/On-KeiShe/nc-news.git
cd nc-news


### 2. Install Dependencies
npm install

### 3. Set up the databases
CREATE DATABASE nc_news;
CREATE DATABASE nc_news_test;

### 4. Seed the databases
npm run setup-dbs
npm run seed

### 5. Create Environment Variables
Create the following files in your root directory:

**.env.test** -- inside this file contains: PGDATABASE = nc_news_test
**.env.development** -- inside this file contains: PGDATABASE = nc_news

These files tell the project which PostgreSQL database to connect to.
As they are dotenv files, they contain environment variables which should be kept hidden 
Therefore all dotenv files must be ignored when pushed to github.
To do this, write .env.* inside the .gitignore files

### 6. Running tests
npm test

## Minimum Requirements
- **Node.js**: v20.11.1 or higher
- **PostgreSQL**: v15.5 or higher

## Developed By
Name: On-Kei She
Bootcamp project for Northcoders