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
            if perturbation['level'] != 'info'
              mymsg = "Ligne #{value}: #{perturbation["text"]}"
              robot.messageRoom room, mymsg



module.exports = (robot) ->
  cronJob = require('cron').CronJob
  tz = 'Europe/Paris'
  pattern = '0 30 8 * * *'
  new cronJob(pattern, (->
    do everyMorning
  ), null, true, tz)

  everyMorning = ->
    mymsg = "Good morning. It's 8:30."
    robot.messageRoom room, mymsg
    lignes = [['M4', 'Raspail'], ['M6', 'Raspail'], ['RA', 'Chatelet-Les-Halles'], ['RB', 'Denfert Rochereau'], ['M13', 'Gaîté']]

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
