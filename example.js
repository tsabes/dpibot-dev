var request = require('request');
var cheerio = require('cheerio');
var Iconv = require('iconv').Iconv;
var date = require('date-utils');

var iconv = new Iconv('EUC-KR','UTF-8//TRANSLIT//IGNORE');

        var dt = new Date();
        var d = dt.toFormat('YYYYMMDD');

        var url = 'http://www.welstory.com/menu/Suwon_sec/foodcourt_R5.jsp?sDate=' + d;

        request({ uri : url, encoding : 'binary' }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var strContents = new Buffer(body, 'binary');
                strContents = iconv.convert(strContents).toString();

                $ = cheerio.load(strContents);

                var first = "[지하 1층]"
                var fifth = "[5층]"

                $("#floor_2_1 .restaurant_menu").each(function() {
                    first = first + '\n' + $(this).text();
                });
                
                $("#floor_2_5 .restaurant_menu").each(function() {
                    fifth = fifth + '\n' + $(this).text();
                });
                console.log(first);
                console.log(fifth);
/*
                $('#meal_2 .restaurant_titB1').each(function() {
                    console.log($(this).text());
                 });
                $('#meal_2 .restaurant_menu').each(function() {
                    console.log($(this).text());
                 });

                $("#floor_2_1 .restaurant_menu").each(function() {
                    console.log($(this).text());
                });

                $("#floor_2_5 .restaurant_menu").each(function() {
                    console.log($(this).text());
                });               
                $("#floor_2_5 .restaurant_menu").each(function() {
                    if ($(this).is(".restaurant_titB1")) {
                        console.log($(this).text());
                    }
                    if ($(this).is(".restaurant_menu")) {
                        console.log($(this).text());
                    }
                });
*/                
            }
            else {
                console.log("error");
            }
        });
