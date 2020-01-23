const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());



const generateRandomString = () => {
  return (Math.random().toString(36)+'00000000000000000').slice(2, 8);
};


// const urlDatabase = {
//   'b2xVn2': 'http://www.lighthouselabs.ca',
//   '9sm5xk': 'http://www.google.com'
// };

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  aaaaaa: { longURL: "http://www.youtube.com", userID: "3"}
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
  },
  "3": {
    id: "3",
    email: "a@a.com",
    password: "123"
  }
}


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

app.get('/hello', (request, response) => {
  let templateVars = { greeting: 'Hello World!' };
  response.render('hello_world', templateVars);
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
  }

  response.render('login', templateVars);
});






app.post('/urls/:shortURL/delete', (request, response) => {
  const shortURL = request.params.shortURL;
  const userID = request.cookies.user;
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
  const userID = request.cookies.user;
  const userURLS = urlsForUser(userID, urlDatabase);
  if (userID === userURLS[shortURL].userID) {
    urlDatabase[shortURL].longURL = longURL;
    response.redirect(shortURL);
  } else {
    response.send("not allowed");
  }
});


// post to app
app.post("/urls", (request, response) => {
  const longURL = request.body.longURL;
  const rndStr = generateRandomString();
  urlDatabase[rndStr] = { longURL, userID: request.cookies.user };
  response.redirect(`/urls/${rndStr}`);

});

app.post("/login", (request, response) => {
  const {email, password} = request.body;
  const user = getUserByEmail(email);
  console.log("user:", user);
  if (user) {
    if (bcrypt.compareSync(password, user.hashedPassword)){
      response.cookie('user', user.id);
    } else {
      response.send("403: Email and or password do not match!");
    }
  } else {
    response.send("403: account doesn't exist!");
  }
  response.redirect('/urls')
  
});

app.post("/logout", (request, response) => {
  response.clearCookie('user');
  response.redirect('/urls');
});

app.post('/register', (request, response) => {
  const { email, password } = request.body;
  const id = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (getUserByEmail(email)) {
    response.send("400: email already exists");;
  } else {
    users[id] = { id, email, hashedPassword };
    response.cookie('user', id);
    response.redirect('/urls');
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


const getRequestUser = (request) => {

  if (!request) return;
  const cookies = request.cookies;
  if (!cookies) {
    return null;
  }
  return cookies["user"];
};

// returns true is email is already in users object!
const getUserByEmail = (email) => {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return null;
};


const urlsForUser = (userID, urlsObj) => {
  // console.log("in urlsForUser: ", urlDatabase.aaaaaa.userID);
  const userURLS = {};
  for (let url in urlsObj) {
    if (urlsObj[url].userID === userID) {
      userURLS[url] = urlsObj[url];
    }
  }
  return userURLS;

};

