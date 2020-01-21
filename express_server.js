const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;


app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

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

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get('/urls/:shortURL', (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = urlDatabase[shortURL];

  let templateVars = { shortURL: shortURL, longURL: longURL };
  
  //console.log("longURL:", request.params);
  response.render('urls_show', templateVars);
});





app.get('/urls.json', (request, response) => {
  response.json(urlDatabase);
});

app.get('/hello', (request, response) => {
  let templateVars = { greeting: 'Hello World!' };
  response.render('hello_world', templateVars);
 // response.send('<html><body>Hello <b>World</b></body></html>\n');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

