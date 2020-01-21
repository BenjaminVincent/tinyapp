const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;




app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));



// fix this to allow for capital letters
const generateRandomString = () => {
  return (Math.random().toString(36)+'00000000000000000').slice(2, 8);
};


const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xk': 'http://www.google.com'
};

// endpoints
app.get('/', (request, response) => {
  response.send('Hello!');
});

app.get('/urls', (request, response) => {
  let templateVars = { urls: urlDatabase };
  response.render('urls_index', templateVars);
});

app.get("/urls/new", (request, response) => {
  response.render("urls_new");
});


app.get('/urls/:shortURL', (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = urlDatabase[shortURL];
  let templateVars = { shortURL: shortURL, longURL: longURL };
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


// post to app
app.post("/urls", (request, response) => {
  const longURL = request.body.longURL;
  const rndStr = generateRandomString()
  urlDatabase[rndStr] = longURL;
  response.redirect(`/urls/${rndStr}`);

});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

