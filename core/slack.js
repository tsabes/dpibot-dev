var fs = require('fs')
  , path = require('path')
  , _ = require('lodash')
  , request = require('request')
  , Slack = require('slack-client')
  , debug = require('debug')('slack');

var config = require('../core/config')
  , slack = new Slack(config.slack.slackToken, config.slack.autoReconnect, config.slack.autoMark);

slack.on('open', function() {
  debug('open:', 'Connected to ' + slack.team.name + ' as ' + slack.self.name);
});

slack.on('message', function(message) {
  var channel = slack.getChannelGroupOrDMByID(message.channel);

  if(message.text === "!") {
    fs.readFile(path.join(__dirname, '/data/usage.info'), 'utf8', function(err, data) {
      if(err) {
        debug('error:', {err:err});
      }
      channel.send(data);
    });
  } if(message.text === "!종목") {
    // function.json 에 대항하는 기능을 수행한다.
    var stockList = require('./data/stock.json');
    var listStr = '!{종목이름} 형태로 호가를 확인할 수 있습니다.'
    _.forEach(stockList, function(stock) {
      listStr += stock.name + '\n';
    });
    channel.send(listStr);
  } else {

  }
  
  // } else if(message.text == "!한강") {
  //   request('http://hangang.dkserver.wo.tc', function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       var result = JSON.parse(body);
  //       channel.send("`많이 힘드시죠? 현재 한강물 온도는 " + result.temp + "°C 입니다.`");
  //     } else {
  //       channel.send("죄송합니다. 현재 한강물 온도를 알아내지 못했습니다.");
  //     }
  //   });
  // } else if(message.text == "!기쁨") {
  //   var data = 
  //     '⊂_ヽ\n' +
  //     '　 ＼＼ Λ＿Λ\n' +
  //     '　　 ＼( \'ㅅ\' ) 두둠칫\n' +
  //     '　　　 >　⌒ヽ\n' +
  //     '　　　/ 　 へ＼\n' +
  //     '　　 /　　/　＼＼\n' +
  //     '　　 ﾚ　ノ　　 ヽ_つ\n' +
  //     '　　/　/ 두둠칫\n' +
  //     '　 /　/|\n' +
  //     '　(　(ヽ\n' +
  //     '　|　|、＼\n' +
  //     '　| 丿 ＼ ⌒)\n' +
  //     '　| |　　) /\n' +
  //     '(`ノ )　　Lﾉ\n' +
  //     '' +
  //     '';
  //     channel.send(data);
  // }
});

slack.on('error', function(err) {
  debug('error:', {err:err});
});

slack.login();


