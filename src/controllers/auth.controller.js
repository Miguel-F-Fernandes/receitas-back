const createError = require('http-errors')
const hash = require('hash.js')
const jsonwebtoken = require('jsonwebtoken')

class AuthController {
  /**
   * User login
   */
  static async login(req, res) {
    // TODO
    let user
    // for how many hours the login token is valid
    const hoursValid = 24 * 7 // 7 days

    // search by the user through their email
    // req.body.email

    // if the user wasn't found or the password doesn't match
    if (
      !user ||
      user.password !==
        hash
          .sha512()
          .update(user.salt + req.body.password)
          .digest('hex')
    ) {
      return res.status(401).send(createError('Incorrect email or password'))
    }

    // sign their token
    const token = jsonwebtoken.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        permissions: [user.type],
      },
      process.env.SECRET
    )

    // save to DB until their login is valid

    // login_until: new Date(new Date().getTime() + hoursValid * 60 * 60 * 1000),

    return res.status(200).send({
      token: token,
    })
  }

  /**
   * User logout
   */
  static async logout(req, res) {
    // TODO
    // get user from decoded token
    const user = req.res.locals.user

    // clear their login time on the DB
    // login_until: null,

    return res.status(204).send()
  }

  /**
   * User creation
   */
  static async register(req, res) {
    // TODO
    // generate a random salt
    const salt = (Math.random() + 1).toString(36).substring(2)

    // create the user
    // email: req.body.email,
    // name: req.body.name,
    // password: hash
    //   .sha512()
    //   .update(salt + req.body.password)
    //   .digest('hex'),
    // salt: salt,
    // type: req.body.type,

    return res.status(204).send()
  }
}

module.exports = AuthController
