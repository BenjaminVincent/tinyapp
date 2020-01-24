const express = require('express');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');
const { getUserByEmail, urlsForUser, getRequestUser } = require('./helpers');



const app = express();
const PORT = 8080;



app.set('view engine', 'ejs');


app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  secret: 'secret',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));



const generateRandomString = () => {
  return (Math.random().toString(36) + '00000000000000000').slice(2, 8);
};

/**********************************/
/*
      urlDatabase and users
      contain placeholders,
      the placeholders are
      not functional,
      just for layout reference
*/
/**********************************/



const urlDatabase = {
  aaaaaa: { longURL: "http://www.youtube.com", userID: "3"}
};



const users = {
  "3": {
    id: "3",
    email: "a@a.com",
    password: "123"
  }
};


/**********************************/
/*
                "GET"
*/
/**********************************/


app.get('/urls', (request, response) => {

  const id = getRequestUser(request);
  const user = users[id];
  const userURLs = urlsForUser(id, urlDatabase);

  let templateVars = {
    user,
    urls: userURLs
  };

  if (user) {
    response.render('urls_index', templateVars);
  } else {
    response.render('login', templateVars);
  }

});



app.get("/urls/new", (request, response) => {

  const user = getRequestUser(request);
  const userObj = users[user];

  let templateVars = {
    user: userObj,
    urls: urlDatabase
  };

  if (user) {
    response.render("urls_new", templateVars);
  } else {
    response.render("login", templateVars);
  }

});



app.get('/urls/:shortURL', (request, response) => {

  const shortURL = request.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const id = getRequestUser(request);
  const userObj = users[id];
  
  let templateVars = {
    user: userObj,
    shortURL: shortURL,
    longURL: longURL
  };

  response.render('urls_show', templateVars);

});



app.get("/u/:shortURL", (request, response) => {

  const shortURL = request.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;

  response.redirect(longURL);

});



app.get('/urls.json', (request, response) => {

  response.json(urlDatabase);

});



app.get('/register', (request, response) => {

  let templateVars = {
    user: getRequestUser(request)
  };

  response.render('register', templateVars);

});



app.get('/login', (request, response) => {

  const user = getRequestUser(request);

  let templateVars = {
    user: user
  };

  response.render('login', templateVars);

});



/**********************************/
/*
              "POST"
*/
/**********************************/



app.delete('/urls/:shortURL', (request, response) => {

  const shortURL = request.params.shortURL;
  const userID = request.session.user;
  const userURLS = urlsForUser(userID, urlDatabase);

  if (userID === userURLS[shortURL].userID) {
    delete urlDatabase[shortURL];
  } else {
    response.send("not allowed");
  }

  response.redirect(`/urls`);

});



app.post('/urls/:id', (request, response) => {

  const shortURL = request.params.id;
  const longURL = request.body.longURL;
  const userID = request.session.user;
  const userURLS = urlsForUser(userID, urlDatabase);
  
  if (userID === userURLS[shortURL].userID) {
    urlDatabase[shortURL].longURL = longURL;
    response.redirect(shortURL);
  } else {
    response.send("not allowed");
  }

});



app.post("/urls", (request, response) => {

  const longURL = request.body.longURL;
  const rndStr = generateRandomString();

  urlDatabase[rndStr] = { longURL, userID: request.session.user };

  response.redirect(`/urls/${rndStr}`);

});



app.post("/login", (request, response) => {

  const {email, password} = request.body;
  const user = getUserByEmail(email, users);

  if (user) {
    if (bcrypt.compareSync(password, user.hashedPassword)) {
      request.session.user = user.id;
    } else {
      response.send("403: Email and or password do not match!");
    }
  } else {
    response.send("403: account doesn't exist!");
  }

  response.redirect('/urls');
  
});



app.post("/logout", (request, response) => {

  request.session = null;
  response.redirect('/urls');

});



app.put('/register', (request, response) => {

  const { email, password } = request.body;
  const id = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (getUserByEmail(email, users)) {
    response.send("400: email already exists");
  } else {
    users[id] = { id, email, hashedPassword };
    request.session.user = id;
    response.redirect('/urls');
  }

});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});







