let User = require('../models/User');
module.exports = {
    getCode: function(phoneNumber,cb){
       
         User.findOne({
    phone: phoneNumber
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.send({
        success: false,
        message: 'Number not found, please enter valid number'
      });
    } else {
      // Check if phone number matches
      let code = Math.floor(100000 + Math.random() * 900000);
      console.log("The Code for phone number: "+phoneNumber+"is :"+code);

      user.code = code;
      user.save(function(err,user){
        console.log("user code updated ..");
        cb();
      });
      
      
    }
  });

    }

}