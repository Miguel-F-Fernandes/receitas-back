const packageJSON = require('../../package.json')

class HealthController {
  /**
   * Uptime
   */
  static async uptime(req, res) {
    const uptime = process.uptime()
    const date = new Date(uptime * 1000)
    const days = date.getUTCDate() - 1,
      hours = date.getUTCHours(),
      minutes = date.getUTCMinutes(),
      seconds = date.getUTCSeconds(),
      milliseconds = date.getUTCMilliseconds()

    const segments = []

    if (days > 0) {
      segments.push(days + ' dia' + (days === 1 ? '' : 's'))
    }
    if (hours > 0) {
      segments.push(hours + ' hora' + (hours === 1 ? '' : 's'))
    }
    if (minutes > 0) {
      segments.push(minutes + ' minuto' + (minutes === 1 ? '' : 's'))
    }
    if (seconds > 0) {
      segments.push(seconds + ' segundo' + (seconds === 1 ? '' : 's'))
    }
    if (milliseconds > 0) {
      segments.push(milliseconds + ' milisegundo' + (seconds === 1 ? '' : 's'))
    }
    const dateString = segments.join(', ')

    return res.status(200).send(dateString)
  }

  /**
   * Version
   */
  static async version(req, res) {
    return res.status(200).send(packageJSON.version)
  }

  /**
   * Ping
   */
  static async ping(req, res) {
    return res.status(204).send()
  }
}

module.exports = HealthController
