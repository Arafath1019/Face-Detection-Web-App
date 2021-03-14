const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var cors = require('cors');
const bodyParser = require('body-parser');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'YOUR_DATABASE_USER_NAME',
    password : 'YOUR_DATABASE_PASSWORD',
    database : 'YOUR_DATABASE_NAME'
  }
});

const app = express();

app.use(cors());

app.use(bodyParser.json());



//root-router
app.get('/', (req, res) =>{
    res.send(database.users);
});


//signin route
app.post('/signin', (req, res) =>{
    const { password, email } = req.body;
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('Unable to get user'));
      } else {
        res.status(400).json('Wrong credentials');
      }
    })
    .catch(err => res.status(400).json('Wrong credentials'));
});


//register route
app.post('/register', (req, res) =>{
    const {name, email, password } = req.body;
    // const hash = bcrypt.hashSync(password);
     bcrypt.hash(password, saltRounds, function(err, hash) {
    // Store hash in your password DB.

            db.transaction(trx => {
                trx.insert({
                    hash: hash,
                    email: email
                })
                .into('login')
                .returning('email')
                .then(loginEmail => {
                    return trx('users')
                        .returning('*')
                        .insert({
                        email: email,
                        name: name,
                        joined: new Date()
                        })
                        .then(user => {
                            res.json(user[0]); 
                        });
                    })
                    .then(trx.commit)
                    .catch(trx.rollback);
                })
                .catch(err => res.status(400).json('Unable to register'));
        });
});


//User profile route
app.get('/profile/:id', (req, res) =>{
    const { id } = req.params;
    db.select('*').from('users').where({id})
    .then(user =>{
        if(user.length){
            res.json(user[0]);
        }else{
           res.status(400).json('No such user found');
        }
        
    })
    .catch(err => res.status(400).json('Error getting user'));
});


//image counting route
app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries') 
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
});



app.listen(3000, () =>{
    console.log('app is running on port 3000');
});

