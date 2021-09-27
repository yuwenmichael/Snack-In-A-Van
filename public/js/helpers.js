var constants = require('../constant');
var register = function(Handlebars) {
    var helpers = {
        checkTime: function(dateUTC) {
            var orderDate = new Date(dateUTC)
            var now = new Date()
            var diff = now - orderDate;
            if (diff > constants.CHANGE_TIME) {
                return false
            } else {
                return true
            }
        },
        rate: function(rating){
            if(rating === "0"){
                return false
            }else{
                return true
            }
        },
        showrate: function(status){
            if (status==="Fulfilled"){
                return false
            }
            else{
                return true
            }
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        return helpers;
    }

};

// export helpers to be used in our express app
module.exports.register = register;
module.exports.helpers = register(null);