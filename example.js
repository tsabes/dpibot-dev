var request = require('request');
var cheerio = require('cheerio');


        var url = 'http://www.welstory.com/menu/Suwon_sec/foodcourt_R5.jsp?sDate=20151228'
        request('http://www.welstory.com/menu/Suwon_sec/foodcourt_R5.jsp?sDate=20151228', function (error, response, html) {
            if (!error && response.statusCode == 200) {
                $ = cheerio.load(html);
                console.log("parsing");
                $('#floor_all.box_floor.flr_titB1.flr_restaurant.restaurant_menu').each(function() {
                    console.log("parsing");
                    console.log($(this).text());
                 });

            }
            else {
                console.log("error");
            }   
        });


