/**
 * Check if the user on the JWT exists on the DB
 */
async function isRevokedCallback(req, payload, done) {
  let user
  try {
    // TODO get User with payload.email
  } catch (err) {
    return done(err)
  }

  // user not found
  if (!user) {
    return done(null, true)
  }

  // token expired
  if (
    !user.dataValues.login_until ||
    user.dataValues.login_until.getTime() < new Date().getTime()
  ) {
    return done(null, true)
  }

  req.res.locals.user = user

  // ok to proceed
  return done(null, false)
}
module.exports = {
  isRevokedCallback,
}
