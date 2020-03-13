function validateForm() {

  var flagAppName = false, flagAdminEmail = false, flagPurchaseCode = false,
        flagFApiKey = false, flagFProjectId = false, flagFAppId = false, flagSendGridEmail = false, flagSendGridApiKey = false,
        flagExpoUsername = false, flagExpoPassword = false, flagAppLogo = false, flagPrevAppDesc = false, flagMainDomain = false,
        flagSubDomain = false, flagExpoPreviewUsername = false, flagExpoPreviewPass = false, flagGoogleMapsApiKey = false, flagTinyMCEApiKey = false;
        
  var appname = $('#appname').val();
  var adminemail = $('#adminemail').val();
  var purchasecode = $('#purchasecode').val();
  var maindomain = $('#maindomain').val();
  var subdomain = $('#subdomain').val();
  var expopreviewusername = $('#expopreviewusername').val();
  var expopreviewpassword = $('#expopreviewpassword').val();
  var firebaseapikey = $('#firebaseapikey').val();
  var firebaseprojectid = $('#firebaseprojectid').val();
  var firebaseappid = $('#firebaseappid').val();
  var sendgridemail = $('#sendgridemail').val();
  var sendgridapikey = $('#sendgridapikey').val();
  var expousername = $('#expousername').val();
  var expopassword = $('#expopassword').val();
  var applogo = $('#applogo').val();
  var previewappdesc = $('#previewappdesc').val();
  var googlemapsapikey = $('#googlemapsapikey').val();
  var tinymceapikey = $('#tinymceapikey').val();

  var doyouneedlanding = $('#doyouneedlanding').val();

  localStorage.setItem("maindomain",maindomain);
  localStorage.setItem("subdomain",subdomain);
  localStorage.setItem("expopreview",expopreviewusername);
  localStorage.setItem("doyouneedlanding",doyouneedlanding);

  if(adminemail.length < 1){
    $("#erroradminemail").text("Please fill in the required fields!");
    $("#erroradminemail").show();
  }else{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(String(adminemail).toLowerCase())){
        $("#erroradminemail").text("");
        $("#erroradminemail").hide();
        flagAdminEmail = true;
    }else{
        $("#erroradminemail").text("Please provide a valid email address!");
        $("#erroradminemail").show();
        flagAdminEmail = false;
    }
  }

  if(purchasecode.length < 1){
    $("#errorpurchasecode").text("Please fill in the required fields!");
    $("#errorpurchasecode").show();
  }else{
    var parts = purchasecode.split("-");
    if(parts.length === 5){
        if(parts[0].length === 8 && parts[1].length === 4 && parts[2].length === 4 && parts[3].length === 4 && parts[4].length === 12){
            $("#errorpurchasecode").text("");
            $("#errorpurchasecode").hide();
            flagPurchaseCode = true;
        }else{
            $("#errorpurchasecode").text("Please provide a valid purchase code!");
            $("#errorpurchasecode").show();
            flagPurchaseCode = false;
        }
    }else{
        $("#errorpurchasecode").text("Please provide a valid purchase code!");
        $("#errorpurchasecode").show();
        flagPurchaseCode = false;
    }
  }

  if(maindomain.length < 1){
    $("#errormaindomain").text("Please fill in the required fields!");
    $("#errormaindomain").show();
    flagMainDomain = false;
  }else{
    $("#errormaindomain").text("");
    $("#errormaindomain").hide();
    flagMainDomain = true;
  }

  if(subdomain.length < 1){
    $("#errorsubdomain").text("Please fill in the required fields!");
    $("#errorsubdomain").show();
    flagSubDomain = false;
  }else{
    $("#errorsubdomain").text("");
    $("#errorsubdomain").hide();
    flagSubDomain = true;
  }

  if(appname.length < 1){
    $("#errorappname").text("Please fill in the required fields!");
    $("#errorappname").show();
    flagAppName = false;
  }else{
    $("#errorappname").text("");
    $("#errorappname").hide();
    flagAppName = true;
  }

  if(previewappdesc.length < 1){
    $("#errorpreviewappdesc").text("Please fill in the required fields!");
    $("#errorpreviewappdesc").show();
    flagPrevAppDesc = false;
  }else{
    $("#errorpreviewappdesc").text("");
    $("#errorpreviewappdesc").show();
    flagPrevAppDesc = true;
  }
  
  if(expopreviewusername.length < 1){
    $("#errorexpopreviewusername").text("Please fill in the required fields!");
    $("#errorexpopreviewusername").show();
    flagExpoPreviewUsername = false; 
  }else{
    $("#errorexpopreviewusername").text("");
    $("#errorexpopreviewusername").hide();
    flagExpoPreviewUsername = true;
  }

  if(expopreviewpassword.length < 1){
    $("#errorexpopreviewpassword").text("Please fill in the required fields!");
    $("#errorexpopreviewpassword").show();
    flagExpoPreviewPass = false;
  }else{
    if(expopreviewpassword.length < 8){
        $("#errorexpopreviewpassword").text("Password must be at least 8 characters long!");
        $("#errorexpopreviewpassword").show();
        flagExpoPreviewPass = false;
    }else{
        $("#errorexpopreviewpassword").text(""); 
        $("#errorexpopreviewpassword").hide();
        flagExpoPreviewPass = true;
    }
  }

  if(firebaseapikey.length < 1){
    $("#errorfirebaseapikey").text("Please fill in the required fields!");
    $("#errorfirebaseapikey").show();
    flagFApiKey = false;
  }else{
    $("#errorfirebaseapikey").text("");
    $("#errorfirebaseapikey").hide();
    flagFApiKey = true;
  }

  if(firebaseprojectid.length < 1){
    $("#errorfirebaseprojectid").text("Please fill in the required fields!");
    $("#errorfirebaseprojectid").show();
    flagFProjectId = false; 
  }else{
    $("#errorfirebaseprojectid").text("");
    $("#errorfirebaseprojectid").hide();
    flagFProjectId = true;
  }

  if(firebaseappid.length < 1){
    $("#errorfirebaseappid").text("Please fill in the required fields!");
    $("#errorfirebaseappid").show();
    flagFAppId = false;
  }else{
    $("#errorfirebaseappid").text("");
    $("#errorfirebaseappid").hide();
    flagFAppId = true;
  }

  if(sendgridemail.length < 1){
    $("#errorsendgridemail").text("Please fill in the required fields!");
    $("#errorsendgridemail").show();
    flagSendGridEmail = false;
  }else{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(String(sendgridemail).toLowerCase())){
        $("#errorsendgridemail").text("");
        $("#errorsendgridemail").hide();
        flagSendGridEmail = true;
    }else{
        $("#errorsendgridemail").text("Please provide a valid email address!");
        $("#errorsendgridemail").hide();
        flagSendGridEmail = false;
    }
  }

  if(sendgridapikey.length < 1){
    $("#errorsendgridapikey").text("Please fill in the required fields!");
    $("#errorsendgridapikey").show();
    flagSendGridApiKey = false;
  }else{
    var SGIdentificator = sendgridapikey.substr(0,3);
    if(SGIdentificator === "SG."){
        $("#errorsendgridapikey").text("");
        $("#errorsendgridapikey").hide();
        flagSendGridApiKey = true;
    }else{
        $("#errorsendgridapikey").text("Please Please provide a valid SendGrid ApiKey!");
        $("#errorsendgridapikey").show();
        flagSendGridApiKey = false;
    }
  }

  if(expousername.length < 1){
    $("#errorexpousername").text("Please fill in the required fields!");
    $("#errorexpousername").show();
    flagExpoUsername = false; 
  }else{
    $("#errorexpousername").text("");
    $("#errorexpousername").hide();
    flagExpoUsername = true;
  }

  if(expopassword.length < 1){
    $("#errorexpopassword").text("Please fill in the required fields!");
    $("#errorexpopassword").show();
    flagExpoPassword = false;
  }else{
    if(expopassword.length < 8){
        $("#errorexpopassword").text("Password must be at least 8 characters long!");
        $("#errorexpopassword").show();
        flagExpoPassword = false;
    }else{
        $("#errorexpopassword").text(""); 
        $("#errorexpopassword").hide();
        flagExpoPassword = true;
    }
  }

  if(googlemapsapikey.length < 1){
    $("#errorgooglemapsapikey").text("Please fill in the required fields!");
    $("#errorgooglemapsapikey").show();
    flagGoogleMapsApiKey = false;
  }else{
    $("#errorgooglemapsapikey").text("");
    $("#errorgooglemapsapikey").show();
    flagGoogleMapsApiKey = true;
  }

  if(tinymceapikey.length < 1){
    $("#errortinymceapikey").text("Please fill in the required fields!");
    $("#errortinymceapikey").show();
    flagTinyMCEApiKey = false;
  }else{
    $("#errortinymceapikey").text("");
    $("#errortinymceapikey").show();
    flagTinyMCEApiKey = true;
  }

    const input = document.querySelector('input[type="file"]')
    input.addEventListener('change',function(e){
        var fileTypes = ['jpg', 'jpeg', 'png'];
        var extension = input.files[0].name.split('.').pop().toLowerCase(),  //file extension from input file
        isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types
        if (isSuccess) { //yes
            var reader = new FileReader();
            reader.onload = function (e) {
                flagAppLogo = true;
                $("#errorapplogo").text("");
                $("#errorapplogo").hide();
                $('.imagePreview').css("background-image", "url("+this.result+")");
            }
            reader.readAsDataURL(input.files[0]);
        }
    },false)

    if(!applogo.length){
        flagAppLogo = false;
        $("#errorapplogo").text("Please fill in the required fields!");
        $("#errorapplogo").show();
    }
  
   /*if(flagAdminEmail && flagPurchaseCode && flagMainDomain && flagSubDomain && flagAppName && flagPrevAppDesc && flagExpoPreviewUsername && flagExpoPreviewPass
    && flagFApiKey && flagFProjectId && flagFAppId && flagSendGridEmail && flagSendGridApiKey && flagExpoUsername && flagExpoPassword){
      console.log("Looks good");
      return true
  }else {
    console.log("Some error");
    return false;
  }*/
  if(doyouneedlanding == "true" && flagAdminEmail && flagPurchaseCode && flagMainDomain && flagSubDomain && flagAppName && flagPrevAppDesc && flagExpoPreviewUsername && flagExpoPreviewPass
  && flagFApiKey && flagFProjectId && flagFAppId && flagSendGridEmail && flagSendGridApiKey && flagExpoUsername && flagExpoPassword && flagGoogleMapsApiKey && flagTinyMCEApiKey){
    console.log("Looks good");
    return true
  }else if(doyouneedlanding == "false" && flagAdminEmail && flagPurchaseCode && flagMainDomain && flagAppName && flagPrevAppDesc && flagExpoPreviewUsername && flagExpoPreviewPass
  && flagFApiKey && flagFProjectId && flagFAppId && flagSendGridEmail && flagSendGridApiKey && flagExpoUsername && flagExpoPassword && flagGoogleMapsApiKey && flagTinyMCEApiKey){
    console.log("Looks good");
    return true
  }else {
    console.log("Some error");
    return false;
  }
}