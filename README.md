# Environment Variables

Before running the project, please follow instructions below

1. Run npm install to install the relevant packages. Please note NODE.js is required on your machine

2. Create the following files in your root directory:

** .env.test ** -- inside this file contains: PGDATABASE = nc_news_test
** .env.development ** -- inside this file contains: PGDATABASE = nc_news

These files tell the project which PostgreSQL database to connect to.
As they are dotenv files, they contain environment variables which should be kept hidden 
Therefore all dotenv files must be ignored when pushed to github.

3. To do this, write .env.* inside the .gitignore files