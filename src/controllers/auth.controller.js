const createError = require('http-errors')
const hash = require('hash.js')
const jsonwebtoken = require('jsonwebtoken')
const db = require('../database')

class AuthController {
  /**
   * User login
   */
  static async login(req, res) {
    // for how many hours the login token is valid
    const hoursValid = 24 * 7 // 7 days

    // search by the user through their email
    const user = await db.users.findUnique({
      where: {
        email: req.body.email,
      },
      include: {
        person: {
          select: {
            name: true,
          },
        },
      },
    })

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
        name: user.person.name,
        email: user.email,
      },
      process.env.SECRET
    )

    // save to DB until when is their login valid
    await db.users.update({
      data: {
        login_until: new Date(new Date().getTime() + hoursValid * 60 * 60 * 1000),
      },
      where: {
        email: user.email,
      },
    })

    return res.status(200).send({
      token: token,
    })
  }

  /**
   * User logout
   */
  static async logout(req, res) {
    // get user from decoded token
    const user = req.res.locals.user

    await db.users.update({
      data: {
        login_until: null,
      },
      where: {
        email: user.email,
      },
    })

    return res.status(204).send()
  }

  /**
   * User creation
   */
  static async register(req, res) {
    // generate a random salt
    const salt = (Math.random() + 1).toString(36).substring(2)

    // create user and person associated
    const person = await db.people.create({
      data: {
        name: req.body.name,
        user: {
          create: {
            email: req.body.email,
            password: hash
              .sha512()
              .update(salt + req.body.password)
              .digest('hex'),
            salt: salt,
          },
        },
      },
    })

    // log user in
    return AuthController.login(req, res)
  }
}

module.exports = AuthController
