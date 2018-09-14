module.exports = function(robot) {
  return robot.hear(/test pres (.*)/i, function(res) {
    let limit = res.match[1]
    let mydict = {
      'Mikael':0,
      'Charlotte':0,
      'Eelaman':0,
      'Matthieu':0,
      'Cristian':0,
      'Stanislas':0
    }
    for (let n of selectPresentateur()) {
      mydict[rand]++;
      // truncate the sequence at 1000
      if (n[0] >= limit) {
        return res.send(`Results ${JSON.stringify(mydict)}`);
        break;
      }
    }
  });
};

function* selectPresentateur() { // a generator function
  let prev = 0
  while (true) {
    myArray = ['Mikael', 'Charlotte', 'Eelaman', 'Matthieu', 'Cristian', 'Stanislas' ]
    rand = myArray[Math.floor(Math.random() * myArray.length)]
    prev++;
    yield [ prev, rand ];
  }
}
