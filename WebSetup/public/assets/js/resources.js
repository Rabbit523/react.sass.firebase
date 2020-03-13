$(document).ready(function() {

    var maindomain = localStorage.getItem("maindomain");
    var subdomain = localStorage.getItem("subdomain");
    var expopreview = localStorage.getItem("expopreview");
    var doyouneedlanding = localStorage.getItem("doyouneedlanding");

    if(doyouneedlanding == "true"){
        $("#landingpagelink").attr("href", "http://"+maindomain);
        $("#builderlink").attr("href", "http://"+subdomain+"."+maindomain);
        $("#expolink").attr("href", "https://www.expo.io/@"+expopreview);
    }else{
        $("#landingpagelink").remove();
        $("#builderlink").attr("href", "http://"+maindomain);
        $("#expolink").attr("href", "https://www.expo.io/@"+expopreview);
    }
});