/**********************************/
/*
      express_server HELPERS!
*/
/**********************************/



const getUserByEmail = (email, database) => {

  for (const user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }

  return null;

};



const urlsForUser = (userID, urlsObj) => {
  const userURLS = {};
  for (let url in urlsObj) {
    if (urlsObj[url].userID === userID) {
      userURLS[url] = urlsObj[url];
    }
  }
  return userURLS;

};



const getRequestUser = (request) => {

  if (!request) return;
  const cookies = request.session;
  if (!cookies) {
    return null;
  }
  return cookies["user"];
};



module.exports = {
  getUserByEmail,
  urlsForUser,
  getRequestUser
};