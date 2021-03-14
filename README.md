# Face Detection web app

This web app uses the Clarifai API to locate a face in a picture. Using a React.js front-end and Node.js backend with Express.js as well as a PosrtgreSQL database to keep track of how many entries every user has made.


## Technologies Used

### Front-End
- HTML5
- CSS3
 - React.js

### NPM Packages
- Create-React-App
- Tachyons
- react-tilt
- particles.js
- Bcrypt
- Postgresql
- knex
- body parser
- cors
- express

## Instructions

To run this app in your local environment:
1. Colne this repo
2. Run `npm install` both in frontend and backend file.
3. Also make sure that, in your local environment there is PostgreSQL is set up.
4. Create a smartbrain database.
5. Create two tables users and login table under the smartbrain database.
6. Edit the database configuration process as the owner database owner requirements in server.js file
7. First run your database from the postgreSQL shell command or GUI.
8. Secondly run `npm start` in the backend directory and thirdly run `npm start` in the frontend directory.
     
