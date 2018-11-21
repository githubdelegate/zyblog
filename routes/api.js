let express = require('express');
let $checkToken = require('../utils/checkToken_utils');
let router = express.Router();
let UserController = require('../controllers/users_controller');

//  验证 大部分请求的 token 是否合法
// FIXME: token 的验证原理?
router.all('*', function (req,res, next){
  let method = req.method.toLocaleLowerCase();
  let path = req.path.toString();
  if (method === 'get' || path.includes('register') 
  || path.includes('login') 
  || path.includes('upload') 
  || (method === 'post' && path.includes('comment'))) {
    return next();
  }else {
    let authorization = req.get('authorization');
    if (!!authorization) {
      let token = authorization.split(" ")[1];
      $checkToken(token).then(function () {
        console.log("token check pass");
        return next();
      }, function (err) {
        res.status(200);
        res.send(err);
      });
    }else {
      res.status(200);
      res.send({
        "code": "10",
        "msg": "need token!"
      })
    }
  }
});

//  注册
router.post('/register',UserController.register);

//  get login
// router.get('/do_login',nil);

// // post login
// router.post('/login',nil);

// // 修改密码
// router.post('/change_pwd',nil);

// // 所有的用户
// router.get('/users',nil);

// // id 查找 用户
// router.post('/user:id',nil);

// router.post('/user/original/:id', nil);

// // 修改用户信息
// router.put('/user', nil);
// // 删除用户
// router.delete('/user/:id',nil);

module.exports = router;