"use strict";

var Parser = function (settings = {}, logger, errors) {

    var log = function() {
        if (logger) {
            logger.log(arguments[0], arguments[1]);
        }
    };

    var strings2obj = function(message){
        var DELIMITER = "\r\n";
        var strings = message.split(DELIMITER);
        var pass = false;
        
        log("splitted message:", strings);

        var obj = {};
        var counter = 0;
        for (var i = 0; i < strings.length; i++) {
            if (strings[i] === 'END') {   // 2. нашли строку конец, со следующей не будем парсить
                pass = false;
            }

            if (pass && strings[i] !== '') {   // 3. пока pass включен, парсим 
                var tmp = strings[i].split("=");
                obj[tmp[0]] = tmp[1];
                counter++;            // счетчик на случай если между BEGIN и END нет key=value
            }

            if (strings[i] === 'BEGIN') {  // 1. нашли строку начало, со следующей будем парсить
                pass = true;
            }
        };

        log("strings2obj:", obj);
        return (counter > 0) ? obj : null;
    };

    var parse = function (message) {
        var object = strings2obj(message.toString());
        if (object) {
            var error = object.ERROR;
            object = Object.assign({}, object, {ERRORTEXT: errors[error]});
        }
        return object;
    };

    return {
        parse: parse
    };
};

module.exports = Parser;