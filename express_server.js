const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;




app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());



// fix this to allow for capital letters
const generateRandomString = () => {
  return (Math.random().toString(36)+'00000000000000000').slice(2, 8);
};


const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com'
};


const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

// endpoints
app.get('/', (request, response) => {
  response.send('Hello!');
});

app.get('/urls', (request, response) => {
  let templateVars = { 
    username: request.cookies["username"],
    urls: urlDatabase 
  };
  response.render('urls_index', templateVars);
});

app.get("/urls/new", (request, response) => {
  let templateVars = { 
    username: request.cookies["username"], 
  };
  response.render("urls_new", templateVars);
});


app.get('/urls/:shortURL', (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = urlDatabase[shortURL];
  
  let templateVars = { 
    username: request.cookies["username"],
    shortURL: shortURL, 
    longURL: longURL };
  response.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = urlDatabase[shortURL];
  response.redirect(longURL);
});



app.get('/urls.json', (request, response) => {
  response.json(urlDatabase);
});

app.get('/hello', (request, response) => {
  let templateVars = { greeting: 'Hello World!' };
  response.render('hello_world', templateVars);
});

app.get('/register', (request, response) => {
  let templateVars = { username: request.cookies["username"] };
  response.render('register', templateVars);
});







app.post('/urls/:shortURL/delete', (request, response) => {
  const shortURL = request.params.shortURL;
  delete urlDatabase[shortURL];
  response.redirect(`/urls`);
});

app.post('/urls/:id', (request, response) => {
  const shortURL = request.params.id;
  const longURL = request.body.style;

  urlDatabase[shortURL] = longURL;
  response.redirect(shortURL);
});


// post to app
app.post("/urls", (request, response) => {
  const longURL = request.body.longURL;
  const rndStr = generateRandomString()
  urlDatabase[rndStr] = longURL;
  response.redirect(`/urls/${rndStr}`);

});

app.post("/login", (request, response) => {
  const username = request.body.username;
  response.cookie('username', username);
  response.redirect('/urls');
  
});

app.post("/logout", (request, response) => {
  response.clearCookie('username');
  response.redirect('/urls');
});

app.post('/register', (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

