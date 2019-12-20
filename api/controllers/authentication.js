const { UserService } = require('../services/user-service');
const { InputValidator } = require('../validators/input-validator');

class AuthenticationController {

  constructor(db) {
    this.userService = new UserService(db);
    this.registerUser = this.registerUser.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  // Validate Email
  // Validate Password
  // Save User
  async registerUser(req, res) {
    try{
      const reqBody = req.body;
      const validateName = InputValidator.validateName(reqBody.name);
      const validateEmail = InputValidator.validateEmail(reqBody.email);
      const validatePassword = InputValidator.validatePassword(reqBody.password);
      if(validateName.statusCode == 400){
        return res.status(400).send(validateName.message);
      } else if(validateEmail.statusCode == 400){
        return res.status(400).send(validateEmail.message);
      } else if(validatePassword.statusCode == 400){
        return res.status(400).send(validatePassword.message);
      }  
      let userRes = await this.userService.registerUser(reqBody.name,reqBody.email,reqBody.password)
      if(userRes.code == -1){
        return res.status(400).send(userRes.message);
      }
      // console.log('registerUser Res:' + JSON.stringify(userRes));
      return res.send(userRes);
    } catch (ex){
      return res.status(404).send(ex.toString());
    }
  }

  async logIn(req, res, next) {
    try{
      const reqBody = req.body;
      const validateEmail = InputValidator.validateEmail(reqBody.email);
      const validatePassword = InputValidator.validatePassword(reqBody.password);
      if(validateEmail.statusCode == 400){
        return res.status(400).send(validateEmail.message);
      } else if(validatePassword.statusCode == 400){
        return res.status(400).send(validatePassword.message);
      }  
      let userRes = await this.userService.logIn(reqBody.email,reqBody.password);
      // console.log(userRes.user);
      if(userRes.code == -1){
        return res.status(400).send(userRes.message);
      }
      // console.log('logIn Res:' + JSON.stringify(userRes));
      return res.send(userRes);
    } catch (ex){
      return res.status(404).send(ex.toString());
    }
  }

  async logOut(req, res, next) {
    try{
      const token = req.headers.authorization.substr(7);
      // console.log('logout token:'+token);
      let logOutRes = await this.userService.logOut(token);
      return res.send("logOut Successful");
    } catch (ex){
      return res.status(404).send(ex.toString());
    }
  }
}

module.exports.AuthenticationController = AuthenticationController;
