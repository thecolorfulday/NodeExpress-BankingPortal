const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

let  accounts = undefined;
let  users = undefined;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
// use static files
app.use(express.static(path.join(__dirname, 'public')));

fs.readFile(path.join(__dirname, 'json', 'accounts.json'), 'utf-8', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  const accountData = data;
  accounts = JSON.parse(accountData);
  
});

fs.readFile(path.join(__dirname, 'json', 'users.json'), 'utf-8', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  const userData  = data;
  users = JSON.parse(userData);
});

app.get('/saving', (req, res) => {
  res.render('account', {account: accounts.savings});
});
app.get('/checking', (req, res) => {
  res.render('account', {account: accounts.checking});
});
app.get('/credit', (req, res) => {
  res.render('account', {account: accounts.credit});
});

app.get('/profile', (req, res) => {
  res.render('profile', {
    user: users[0]
  })
});

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Account Summary',
    accounts: accounts
  });
});

/**
 * res.render(view [, locals] [, callback])
 * The view argument is a string that is the file path of the view file to render. 
 * This can be an absolute path, or a path relative to the views setting. 
 * If the path does not contain a file extension, 
 * then the view engine setting determines the file extension. 
 * If the path does contain a file extension, 
 * then Express will load the module for the specified template engine (via require()) 
 * and render it using the loaded module’s __express function.
 */

app.listen(3000, ()=>{
  console.log('PS Project Running on port 3000!');
});