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
              channel.send("죄송합니다. 현재 한강물 온도를 알아내지 못했습니다.");
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
        channel.send("`여러분의 회사생활 도우미 DPIbot 입니다`");
        channel.send("`저와 은밀히 대화하려면 /dm @DPIbot <message> 명령을 이용해주세요`");
        var data =
            '```' +
            '============ Command List =============\n' +
            '!소개-이 명령을 출력합니다.` \n' +
            '!응급-응급 전화번호 출력합니다.` \n' +
            '!메뉴-R5 5층 점심메뉴 출력합니다.` \n' +
            '!춤-춤을 춥니다.` \n' +
            '!한강-한강의 수온을 알려드립니다.` \n' +
            '```' +
            '' +
            '';
        channel.send(data);
  } else if(message.text == "!응급") {
        channel.send("`응급전화번호는 031-200-3119 입니다!`");
  }

});

slack.on('error', function(err) {
  debug('error:', {err:err});
});

slack.login();


