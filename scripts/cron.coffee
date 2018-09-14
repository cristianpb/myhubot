#Description:
#   Defines periodic executions

soap = require('soap')
moment = require('moment')
url = process.env.HUBOT_RATP_WSDL
date_format = 'YYYYMMDDhh:mm'
client = null
room = "#testbot"

soap.createClient( url, (err, cl) ->
  if err
    throw err
  else
    console.log "Soap connected"
    client = cl
)


findPerturbations = (robot, args, value) ->

    # Find perturbations for each line
 
    client.getMissionsNext args, (err, result) ->
      if err
        throw err
      else
        described = result.return
        if described['perturbations']
          for perturbation in described['perturbations']
            mymsg = "#{perturbation["message"]["text"]}"
            robot.messageRoom room, mymsg



module.exports = (robot) ->
  cronJob = require('cron').CronJob
  tz = 'Europe/Paris'

  patternMorning = '0 30 8 * * *'
  patternNight = '0 55 17 * * *'

  new cronJob(patternMorning, (->
    do checkPerturbations
  ), null, true, tz)

  new cronJob(patternNight, (->
    do checkPerturbations
  ), null, true, tz)

  checkPerturbations = ->
    mymsg = "This is a cronjob"
    #robot.messageRoom room, mymsg
    console.log "#{mymsg}"
    lignes = [['M2', 'Nation'], ['M4', 'Raspail'], ['M5', 'Bastille'], ['M6', 'Raspail'], ['M7', 'tolbiac'], ['M8', 'Bastille'], ['M13', 'Gaîté'], ['M12', 'Montparnasse Bienvenüe'], ['RA', 'Chatelet-Les-Halles'], ['RB', 'Denfert Rochereau'], ['b28', 'gaite']]

    for value in lignes

      args =
        station:
          line:
            id:
              value[0]
          name:
            value[1]
        direction:
          sens:
            'A'
      findPerturbations(robot, args, value)
