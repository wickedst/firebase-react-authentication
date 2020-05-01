const checkUsername = require("./check-username");

module.exports = {
  "check-username": functions.https.onCall(checkUsername),
};
