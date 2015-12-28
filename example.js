var request = require('request');
var cheerio = require('cheerio');
var Iconv = require('iconv').Iconv;
var iconv = new Iconv('EUC-KR','UTF-8//TRANSLIT//IGNORE');

        
        var url = 'http://www.welstory.com/menu/Suwon_sec/foodcourt_R5.jsp?sDate=20151228'
        request({ uri : url, encoding : 'binary' }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var strContents = new Buffer(body, 'binary');
                strContents = iconv.convert(strContents).toString();
                $ = cheerio.load(strContents);

                $('#meal_2 .flr_restaurant').each(function() {
                    console.log($(this).text());
                 });
                $('#meal_2 .restaurant_titB1').each(function() {
                    console.log($(this).text());
                 });
                $('#meal_2 .restaurant_menu').each(function() {
                    console.log($(this).text());
                 });

            }
            else {
                console.log("error");
            }   
        });
