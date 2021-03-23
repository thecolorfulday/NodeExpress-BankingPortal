const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
// use static files
app.use(express.static(path.join(__dirname, 'public')));

/*-----------------------------------*/
/* File handling and routing */
const accountData = fs.readFileSync(path.join(__dirname, 'json', 'accounts.json'), 'utf-8');
const accounts = JSON.parse(accountData);

const userData = fs.readFileSync(path.join(__dirname, 'json', 'users.json'), 'utf-8');
const users = JSON.parse(userData);

app.get('/savings', (req, res) => {
  res.render('account', {
    account: accounts.savings
  });
});
app.get('/checking', (req, res) => {
  res.render('account', {
    account: accounts.checking
  });
});
app.get('/credit', (req, res) => {
  res.render('account', {
    account: accounts.credit
  });
});

app.get('/profile', (req, res) => {
  res.render('profile', {
    user: users[0]
  })
});

/*-------------------------------------*/
/* Handling form data */
app.use(express.urlencoded({
  extended: true
}));
app.get('/transfer', (req, res) => {
  res.render('transfer');
});
app.post('/transfer', (req, res) => {
  accounts[req.body.from].balance -= parseInt(req.body.amount, 10);
  accounts[req.body.to].balance += parseInt(req.body.amount, 10);
  let accountsJSON = JSON.stringify(accounts);

  fs.writeFileSync(path.join(__dirname, 'json', 'accounts.json'), accountsJSON, 'utf-8');

  res.render('transfer', {
    message: 'Transfer Completed'
  });
});
app.get('/payment', (req, res) => {
  res.render('payment', {
    account: accounts.credit
  });
});
app.post('/payment', (req, res) => {
  accounts.credit.balance -= req.body.amount;
  accounts.credit.available += parseInt(req.body.amount);
  let accountsJSON = JSON.stringify(accounts);
  fs.writeFileSync(path.join(__dirname, 'json', 'accounts.json'), accountsJSON, 'utf8');
  res.render('payment', {
    message: 'Payment Successful',
    account: accounts.credit
  });
});


app.get('/', (req, res) => res.render('index', {
  title: 'Account Summary',
  accounts: accounts
}));

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

app.listen(3000, () => {
  console.log('PS Project Running on port 3000!');
});