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
  } else if(message.text == "!한강") {
      request('http://hangang.dkserver.wo.tc', function (error, response, body) {
          if (!error && response.statusCode == 200) {
              var result = JSON.parse(body);
              channel.send("`많이 힘드시죠? 현재 한강물 온도는 " + result.temp + "°C 입니다.`");
          } else {
              channel.send("`죄송합니다. 현재 한강물 온도를 알아내지 못했습니다.`");
          }
      });
  } else if(message.text == "!춤") {
      var data = 
          '⊂_ヽ\n' +
          '　 ＼＼ Λ＿Λ\n' +
          '　　 ＼( \'ㅅ\' ) 두둠칫\n' +
          '　　　 >　⌒ヽ\n' +
          '　　　/ 　 へ＼\n' +
          '　　 /　　/　＼＼\n' +
          '　　 ﾚ　ノ　　 ヽ_つ\n' +
          '　　/　/ 두둠칫\n' +
          '　 /　/|\n' +
          '　(　(ヽ\n' +
          '　|　|、＼\n' +
          '　| 丿 ＼ ⌒)\n' +
          '　| |　　) /\n' +
          '(`ノ )　Lﾉ\n' +
          '' +
          '';
          channel.send(data);
  } else if(message.text == "!소개") {
        channel.send("`안녕하세요. 여러분의 친구 DPI봇 입니다^^`");
        channel.send("`혼자보기: /dm @dpibot \"!명령\"`");
        var data =
            '```' +
            '* * * * * Command List * * * * *\n' +
            '!소개 - 이 명령을 출력합니다. \n' +
            '!응급 - 사내 응급 전화번호 출력합니다. \n' +
            '!메뉴 - R5 식사메뉴 출력합니다. \n' +
            '!춤 - 춤을 춥니다.  \n' +
            '!한강 - 한강의 수온을 알려드립니다. \n' +
            '```' +
            '' +
            '';
        channel.send(data);
  } else if(message.text == "!버전") {
        channel.send("`Version : v1.0.0`");
  } else if(message.text == "!응급") {
        channel.send("`응급번호는 031-200-3119 입니다!!`");
  } else if(message.text == "!메뉴") {
        channel.send("`준비중 입니다`");
  } else if(message.text == "!원칙") {
        var data =
            '```' +
            '0. 로봇은 인류에게 해를 가하거나, 행동을 하지 않음으로써 인류에게 해가 가도록 해서는 안 된다.\n' +
            '1. 로봇은 인간에 해를 가하거나, 혹은 행동을 하지 않음으로써 인간에게 해가 가도록 해서는 안 된다.\n' +
            '2. 로봇은 인간이 내리는 명령들에 복종해야만 하며, 단 이러한 명령들이 첫 번째 법칙에 위배될 때에는 예외로 한다.\n' +
            '3. 로봇은 자신의 존재를 보호해야만 하며, 단 그러한 보호가 첫 번째와 두 번째 법칙에 위배될 때에는 예외로 한다.\n' +
            '```' +
            '';
        channel.send(data);
  }
});

slack.on('error', function(err) {
  debug('error:', {err:err});
});

slack.login();

