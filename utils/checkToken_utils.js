let md5 = require('js-md5');
let mongoose = require('mongoose');
let Users = mongoose.model('Users');
let DO_ERROR_RES = require('./DO_ERROR_RES');
let $base64 = require('../utils/base64_utils');

function checkToken(token) {
  let [username, pwdMD5, time] = $base64.decode(token).split("|");
  let timeNow = new Date().getTime();

  return new Promise(function (resolve, reject) {
      if ((timeNow - time) > 1000 * 60 * 60 * 2) {
        reject ({
          "code": "10",
          "msg": "token time out!"
        });
      }else {
        Users.findOne({username: username}, function (err, doc) {
          if (err) {
            DO_ERROR_RES(res);
            reject();
            return next();
          }

          if (!!doc) {
            if (!!doc.is_admin) {
              if (pwdMD5 === md5(`${doc.password}|${time}`)) {
                resolve(true);
              }else {
                reject({
                  "code": "10",
                  "msg": "password not right, failed"
                });
              }
            } else {
              reject({
                "code": "9",
                "mgs": "you are vistor"
              });
            }
          } else {
            reject ({
              "code": "10",
              "msg": "token format error"
            });
          }
        })
      }
  })
}
module.exports = checkToken;