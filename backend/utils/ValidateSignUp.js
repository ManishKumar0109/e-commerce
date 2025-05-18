const validate = require("validator")

const valsignup = (emailId, password, firstName, lastName) => {
  if (
    !emailId ||
    !password ||
    !firstName ||
    !lastName ||
    !validate.isEmail(emailId) ||
    !validate.isStrongPassword(password) ||
    !validate.isAlpha(firstName) ||
    !validate.isAlpha(lastName)
  ) {
    throw new Error("Invalid Credentials") // Throw error instead of using next()
  }
  return true
}

module.exports = valsignup
