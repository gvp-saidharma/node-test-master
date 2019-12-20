const { UserService } = require('../services/user-service');

class ProfileController {

  constructor(db) {
    this.userService = new UserService(db);
    this.getUserProfile = this.getUserProfile.bind(this);
  }

  async getUserProfile(req, res, next) {
    try{
      const token = req.headers.authorization.substr(7);
      // console.log('registerUser:' + token);
      let userRes = await this.userService.getUserProfileByToken(token);
      // console.log('registerUser Res:' + JSON.stringify(userRes));
      if(userRes.code == -1){
        return res.status(400).send(null);
      }
      // console.log('registerUser Res:' + JSON.stringify(userRes.user));
      return res.send(userRes.user);
    } catch (ex){
      return res.status(404).send(ex.toString());
    }
  }
}

module.exports.ProfileController = ProfileController;
