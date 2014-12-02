function loadScript(callback){
  var script = document.createElement("script");
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
  script.src = "https://maps.googleapis.com/maps/api/js?libraries="+
               "places&key=AIzaSyDk9Xht3_NXs72Jx5Ahc3F3f8XXkhiXmPk"+
               "&sensor=false&callback="+callback;
}

module.exports = loadScript;
