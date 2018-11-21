let mongoose = require('mongoose');
let $base64 = require('../utils/base64_utils');
let md5 = require('js-md5');
let fs = require('fs');

let Users = mongoose.model('Users');
let DO_ERROR_RES = require('../utils/DO_ERROR_RES');
let getClientIP = require('../utils/getClientIP_utils');
let marked = require('marked');

module.exports = {
  register: function (req, res, next) {
    let user_ip = getClientIP(req);
    let username = req.body.username;
    if (!username) {
      DO_ERROR_RES;
      return next();
    }

    Users.findOne({username: username}, function (err, user) {
      if (err) {
        DO_ERROR_RES(res);
        return next();
      }

      if (!user) {
        let {username, password, is_admin,img_url} = req.body;
        let UserInfo = new Users({
          username,password, is_admin, login_info: [{
            login_time: new Date().getTime().toString(),
            login_ip: user_ip
          }],
          img_url
        });
        UserInfo.save();
        res.status(200);
        res.send({
          "code": '1',
          "msg": 'user added and login success',
          "token": $base64.encode(`${username}|${password}|${new Date().getTime()}`),
          "data": UserInfo
        });
      }else {
        res.statue(200);
        res.send({
          "code": "2",
          "msg": "user already exist"
        });
      }
    })
  }
}