class InputValidator {

  static validateName(name) {
    if(name == null || name.trim().length == 0) {
      return { statusCode: 400, message: 'Name must be a valid non empty string.' };
    }
    return { statusCode: 200 };
  }

  static validateEmail(email) {
    var reg = new RegExp("^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\\.([a-zA-Z]{2,5})$");
    if (email == null || email.trim().length == 0 || reg.test(email) == false) 
    {
        return { statusCode: 400, message: `${email} is not a valid email` };
    }
    return { statusCode: 200 };
  }

  static validatePassword(password) {
    if(password == null || password.trim().length == 0) {
      return { statusCode: 400, message: 'password must be a valid non empty string ' };
    }
    return { statusCode: 200 };
  }
}

module.exports.InputValidator = InputValidator;
