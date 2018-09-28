
var cronJob = require('cron').CronJob;
var moment = require('moment');
moment.locale('fr');
var csv = require("fast-csv");

module.exports = function(robot) {
  new cronJob('00 59 11 * * *', function() {
    ["kerniversaire", "anniversaire"].forEach( celebration => {
      var msg = "";
      console.log("checking today's birthdays...");
      const birthday_list = [];
      csv
        .fromPath("scripts/anniversaire.csv")
        .on("data", function(data){
          birthday_list.push({
            "name": data[0].split(";")[0],
            "anniversaire": data[0].split(";")[1],
            "kerniversaire": data[0].split(";")[2],
          });
        })
        .on("end", function(){
          birthday_list.shift();
          //birthday_list.push({"name": "myhubot", "anniversaire": //"02/10/1989", "kerniversaire": "01/10/2017"})
          var birthdayUsers = findUsersBornOnDate(moment(), birthday_list, celebration);
          if (birthdayUsers.length > 0) {
            for (idx = i = 0, len = birthdayUsers.length; i < len; idx = ++i) {
              user = birthdayUsers[idx];
              console.log(celebration);
              console.log(user);
              msg += `<!channel> L'${celebration} de <@${user.name.split(" ")[user.name.split(" ").length -1].toLowerCase()}> est dans ${moment.duration(moment().diff(moment(user[celebration], "DD/MM"))).humanize()}`;
              msg += `\n ${user.name} aura ${user.years} \n`;
            }
          }
          if (msg !== "") {
            msg += "\n" + (quote()) + "\n";
            return robot.messageRoom("#general", msg);
          }
        })
    });
  }, null, true, 'Europe/Paris');
};

function findUsersBornOnDate (date, users, celebration) {
  var k, matches, user, next_date;
  matches = [];
  for (k in users || {}) {
    user = users[k];
    next_date = moment(date)
    if (isValidBirthdate(user[celebration])) {
      //if (date.format("ddd") == "sam.") {
      if (date.format("ddd") == "ven.") {
        [1,1,1].forEach(item => {
          if (equalDates(next_date.add(item, "days"), moment(user[celebration], "DD/MM/YYYY"))) {
            user['years'] = moment.duration(next_date.diff(moment(user[celebration], "DD/MM/YYYY"))).humanize();
            matches.push(user);
          }
        })
      } else if (["lun.", "mar.", "mer.", "jeu."].indexOf(date.format("ddd")) !== -1 ) {
        if (equalDates(next_date.add(1, "days"), moment(user[celebration], "DD/MM/YYYY"))) {
          user['years'] = moment.duration(next_date.diff(moment(user[celebration], "DD/MM/YYYY"))).humanize();
          matches.push(user);
        }
      }
    }
  }
  return matches;
};
function isValidBirthdate (date) {
  if (date) {
    if (date.length > 0) {
      if (moment(date, "DD/MM/YYYY").isValid) {
        return true;
      }
    }
  }
  return false;
};
function equalDates (dayA, dayB) {
  return (dayA.month() === dayB.month()) && (dayA.date() === dayB.date());
};
function quote (name) {
  quotes = ["Hoping that your day will be as special as you are.", "Count your life by smiles, not tears. Count your age by friends, not years.", "May the years continue to be good to you. Happy Birthday!", "You're not getting older, you're getting better.", "May this year bring with it all the success and fulfillment your heart desires.", "Wishing you all the great things in life, hope this day will bring you an extra share of all that makes you happiest.", "Happy Birthday, and may all the wishes and dreams you dream today turn to reality.", "May this day bring to you all things that make you smile. Happy Birthday!", "Your best years are still ahead of you.", "Birthdays are filled with yesterday's memories, today's joys, and tomorrow's dreams.", "Hoping that your day will be as special as you are.", "You'll always be forever young.", "Happy Birthday, you're not getting older, you're just a little closer to death.", "Birthdays are good for you. Statistics show that people who have the most live the longest!", "I'm so glad you were born, because you brighten my life and fill it with joy.", "Always remember: growing old is mandatory, growing up is optional.", "Better to be over the hill than burried under it.", "You always have such fun birthdays, you should have one every year.", "Happy birthday to you, a person who is smart, good looking, and funny and reminds me a lot of myself.", "We know we're getting old when the only thing we want for our birthday is not to be reminded of it.", "Happy Birthday on your very special day, I hope that you don't die before you eat your cake."];
  return quotes[(Math.random() * quotes.length) >> 0];
};
