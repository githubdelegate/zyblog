
module.exports = function getClientIP(req) {
  let ips = req.header['x-forwarded-for'] || req.connection.remoteAddress 
          || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  let ipsArr = ips.match(/\d+\.\d+\.\d+\.\d+/);
  let ip;
  if (getType(ipsArr) === 'array') {
    ip = ipsArr[0];
  } else {
    ip= 'Postman';
  }

  function getType(value) {
    return Object.prototype.toString.call(value).match(/^(\[object )(\w+)\]$/i)[2].toLowerCase()
  }
  return ip;
}