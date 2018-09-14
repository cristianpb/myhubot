
var cronJob = require('cron').CronJob;
var moment = require('moment');

module.exports = function(robot) {
  var getAmbiguousUserText;

  new cronJob('0 30 17 * * *', function() {
    console.log("checking today's birthdays...");
    birthday_list = [
      {"name": "Eelaman", "date_of_birth": "03/05"}, 
      {"name": "myhubot", "date_of_birth": "14/09"}, 
    ]
    var birthdayUsers = findUsersBornOnDate(moment(), birthday_list);
    if (birthdayUsers.length === 1) {
      msg = "<!channel> Today is <@" + birthdayUsers[0].name + ">'s birthday!";
      msg += "\n" + (quote());
      return robot.messageRoom("#general", msg);
    } else if (birthdayUsers.length > 1) {
      msg = "<!channel> Today is ";
      for (idx = i = 0, len = birthdayUsers.length; i < len; idx = ++i) {
        user = birthdayUsers[idx];
        msg += "<@" + user.name + ">'s" + (idx !== (birthdayUsers.length - 1) ? " and " : "");
      }
      msg += " birthday!";
      msg += "\n" + (quote());
      //return robot.messageRoom("#general", msg);
      return res.send(msg);
    }
  }, null, true, 'Europe/Paris');
  getAmbiguousUserText = function(users) {
    var user;
    return "Be more specific, I know " + users.length + " people named like that: " + (((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = users.length; i < len; i++) {
        user = users[i];
        results.push(user.name);
      }
      return results;
    })()).join(", "));
  };
};

function findUsersBornOnDate (date, users) {
  var k, matches, user;
  matches = [];
  for (k in users || {}) {
    user = users[k];
    if (isValidBirthdate(user.date_of_birth)) {
      if (equalDates(date, moment(user.date_of_birth, "DD/MM"))) {
        matches.push(user);
      }
    }
  }
  return matches;
};
function isValidBirthdate (date) {
  if (date) {
    if (date.length > 0) {
      if (moment(date, "DD/MM").isValid) {
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
