const { db } = require('../database')

/**
 * Check if the user on the JWT exists on the DB
 */
async function isRevokedCallback(req, payload, done) {
  const user = await db.users.findUnique({
    select: {
      id: true,
      email: true,
      login_until: true,
      person: {
        select: {
          id: true,
        },
      },
    },
    where: {
      email: payload.payload.email,
    },
  })

  // user not found
  if (!user) {
    return true
  }

  // token expired
  if (!user.login_until || user.login_until.getTime() < new Date().getTime()) {
    return true
  }

  req.res.locals.user = user

  // ok to proceed
  return false
}
module.exports = {
  isRevokedCallback,
}
