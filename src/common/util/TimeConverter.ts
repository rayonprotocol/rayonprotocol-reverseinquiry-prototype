const timeConverter = UNIX_timestamp => {
  var a = new Date(UNIX_timestamp * 1000);
  var year = a.getFullYear();
  var month = a.getMonth() + 1;
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = year + '/' + month + '/' + date + ' ' + hour + ':' + min + ':' + sec;
  return time;
};

export default timeConverter;
