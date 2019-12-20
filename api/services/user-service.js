const uuid = require('uuid');
const crypto = require('crypto');
const q = require('q')
const DBName = "mydb";
const collectionName = "users";

function hash(str) {
  const hmac = crypto.createHmac('sha256', process.env.HASH_SECRET || 'test-secret');
  hmac.update(str);
  return hmac.digest('hex');
}

function createToken() {
  return 'token.' + uuid.v4().split('-').join('');
}

class UserService {
  constructor(db) {
    this.db = db;
    this.getUserProfileByToken = this.getUserProfileByToken.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  /**
   * Registers a user and returns it's token
   * @param {String} name
   * @param {String} email
   * @param {String} password
   * @return {Promise} resolves to user's token or rejects with Error that has statusCodes
   */
  async registerUser(name, email, password) {
    const user = {
      name,
      email,
      password: hash(password),
      
    }, token = createToken();
    let users = await this.db.db(DBName).collection(collectionName).find({"email": email}).toArray();
    if(users.length == 0) {
      let userObj = await this.db.db(DBName).collection(collectionName).insertOne(user);
      let tokenRes = await this.db.db(DBName).collection("tokens").insertOne({_id: token, email: user.email});
      return { code: 0, token: token };
    } else {
      return { code: -1, message: "emailId already exists"};
    }
  }

  /**
   * Gets a user profile by token
   * @param {String} token
   * @return {Promise} that resolves to object with email and name of user or rejects with error
   */
  async getUserProfileByToken(token) {
    const tokens = await this.db.db(DBName).collection("tokens").find({"_id": token}).toArray();
    if(tokens.length == 0) {
      return { code: -1, message: "token invalid"};
    } 
    const users = await this.db.db(DBName).collection(collectionName).find({"email": tokens[0].email}).toArray();
    users[0].token = token;
    return { code: 0, user: users[0]};
  }

  /**
   * Log in a user to get his token
   * @param {String} email
   * @param {String} password
   * @return {Promise} resolves to token or rejects to error
   */
  async logIn(email, password) {
    const users = await this.db.db(DBName).collection(collectionName).find({"email": email}).toArray();
    const token = createToken();
    if(users.length == 0) {
      return { code: -1, message: "emailId doesn't exist in DB"};
    } else if(hash(password) != users[0].password){
      return { code: -1, message: "password doesn't match"};
    }
    let tokenRes = await this.db.db(DBName).collection("tokens").insertOne({_id: token, email: users[0].email});
    return { code: 0, 'token': token };
  }

  async logOut(token) {
    let res = await this.db.db(DBName).collection("tokens").deleteOne({"_id": token});
  }
}

module.exports.UserService = UserService;


