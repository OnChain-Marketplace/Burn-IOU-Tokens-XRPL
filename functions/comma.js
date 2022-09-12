let comma = function(number){
  if(isNaN(number)) return number
  var number = number.toString()
  if(number.includes('.')){
      var split = number.split('.')
      var whole = split[0]
      var dp = split[1]
      var whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      var number = whole + "." + dp
  }else {
    var number = number.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return number
}

module.exports = { comma };