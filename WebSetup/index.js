const auth = require('./auth')
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5002
const router = express.Router();
const fs = require('fs')
const fse = require('fs-extra')
app.use(auth)

var exec = require('./exec');

var SC_LOCATION="/root/react-app-builder"
var RAB_LOCATION=SC_LOCATION;

//Code Location
const laingPage=RAB_LOCATION+"/SaaS\ Landing\ Page/app-builder-landing";
const appbuilderPage=RAB_LOCATION+"/Builder"
const mobileAppCode=RAB_LOCATION+"/Mobile\ App";

const multer = require('multer');
const destinationToMobileAppCodeImages=mobileAppCode+"/assets/icons"
const destinatonToMobileAppCodeImagesLocal="uploads";
const appIconFileNameLocalStorage="uploadicon.png"
const appIconFileName="app.png";
const apploadingFileName="loading.png";

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destinatonToMobileAppCodeImagesLocal)
    },
    filename: function (req, file, cb) {
      cb(null, appIconFileNameLocalStorage)
    }
  })
const upload = multer({storage:storage})


var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.post('/install', upload.single('img'),(req,res)=>{
    
   

    var body = {
        adminUser: req.body.adminemail,
        purchaseCode: req.body.purchasecode,
        isThisFreshInstall: req.body.freshinstall?req.body.freshinstall:false,
        doYouNeedlanding: req.body.doyouneedlanding?req.body.doyouneedlanding:false,
        domainName: req.body.maindomain,
        subDomainName: req.body.subdomain+"."+req.body.maindomain,
        appName: req.body.appname,
        previewAppDecription: req.body.previewappdesc,
        expoPreviewUsername: req.body.expopreviewusername,
        expoPreviewPassword: req.body.expopreviewpassword,
        firebaseApiKey: req.body.firebaseapikey,
        firebaseProjectId: req.body.firebaseprojectid,
        firebaseAppId: req.body.firebaseappid,
        sendGridEmail: req.body.sendgridemail,
        sendGridApiKey: req.body.sendgridapikey,
        expoBuildUsername: req.body.expousername,
        expoBuildPassword: req.body.expopassword,
        googleMapsApiKey: req.body.googlemapsapikey,
        tinyMCEApiKey: req.body.tinymceapikey
    }
    res.sendFile(path.join(__dirname, 'public', 'index2.html'));
    
    //The state
    var initialState={
        "status":"Starting",
        "percentage":0,
        "stage":"Starting",
        "done":[]
    }
    filePath =  'public/state.json'
    fs.writeFileSync(filePath, JSON.stringify(initialState, null, " "))
   

    //Copy paster the working code
    //fse.copySync(SC_LOCATION,RAB_LOCATION);

    filePath = RAB_LOCATION+'/CLISetup/data.json'
    fs.writeFileSync(filePath, JSON.stringify(body, null, " "));


    //Copy the icon file to app.png
    fs.copyFile(destinatonToMobileAppCodeImagesLocal+"/"+appIconFileNameLocalStorage, destinationToMobileAppCodeImages+"/"+appIconFileName, (err) => {
        if (err) throw err;
        console.log('Image was copied');
      });

     //Copy the icon file to loading
     fs.copyFile(destinatonToMobileAppCodeImagesLocal+"/"+appIconFileNameLocalStorage, destinationToMobileAppCodeImages+"/"+apploadingFileName, (err) => {
        if (err) throw err;
        console.log('Image was copied');
      });

      //Call the script
      exec('npm',['run','startWeb'],{cwd:RAB_LOCATION+"/CLISetup"});

    //setTimeout(fun1,3000);
});
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));

