var chalk = require('chalk');
var inquirer = require('inquirer');
const fs = require('fs');
var fse = require('fs-extra');
const replace = require('replace-in-file');
var exec = require('./exec');
var questions = require('./resources/questions').questions;
var request = require('request');
var program = require('commander');

program.option('-f, --file <file>', 'Select question from file');

//RAB Location
var RAB_LOCATION="/root/react-app-builder/"
//var RAB_LOCATION="/home/ddimov/activeCode/"

//Code Location
const laingPage=RAB_LOCATION+"SaaS\ Landing\ Page/app-builder-landing";
const appbuilderPage=RAB_LOCATION+"Builder"
const mobileAppCode=RAB_LOCATION+"Mobile\ App";
const easySetupWebLocation="/root/react-app-builder/WebSetup"

//Web Location
const landingPageWebLocation="/var/www/html";
const appbuilderPageWebLocation="/var/www/appbuilder/html";

//Virtual Hosts Location
const landingPageVHostLocation="/etc/httpd/sites-available/";
const landingPageVHostEnabledLocation="/etc/httpd/sites-enabled/";
const appbuilderPageVHostLocation="/etc/httpd/sites-available/";
const appbuilderPageVHostEnabledLocation="/etc/httpd/sites-enabled/";

//Actions done so far
var actionsDone=[];

var isCLI=true;





//Let's start
console.log(chalk.yellow("Welcome to React App Builder Initialization sctipt. This are the procedures we will make"));
console.log(chalk.green("1. Ask you for all the nececery data"));
console.log(chalk.green("2. Write all the nececery data"));
console.log(chalk.green('3. Firebase login & deploy cloud functions'));
console.log(chalk.green('4. Importing the Firebase demo data.'));
console.log(chalk.green('5. Creating Landing page'));
console.log(chalk.green('6. Creatinig App Builder page'));
console.log(chalk.green("7. Create your Expo Preview App"));
console.log(chalk.green('8. Starting the Automated App builder'));
console.log(chalk.green('9. Creating virtual hosts'));
console.log(chalk.green('10. Show install notification'));
//console.log(chalk.green('10. Creating CRON JOBS'));


program
        .parse(process.argv);
        if (program.file === undefined){
            console.log('Ask user what to to');
            //Call initial procedure
            procedure1();
        } 
        else {

          isCLI=false;
          console.log("Reading file");
          console.log(program.file);

          fs.readFileSync(program.file)

          let rawAnwsers = fs.readFileSync(program.file);  
          let anwsers = JSON.parse(rawAnwsers);  
          setUpState("Setting images for preview app",10);
          procedure2(anwsers); 
        }


/*
  @ Download recursive function
  */
function download(uri, filename, callback){
  request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
};


//Gather user data
function procedure1(){
  inquirer.prompt(questions).then(procedure2a);
}

function procedure2a(answers)
{
  setUpState("Downloading images for preview app",10);
  download(answers.linkToLogo,mobileAppCode+"/assets/icons/app.png",function(){
    download(answers.linkToLogo,mobileAppCode+"/assets/icons/loading.png",function(){
      console.log("done");
      procedure2();
    });
  });
}
/**
 * Writing out files
 * @param {Object} answers 
 */
function procedure2(answers){

    setUpState("Writting all the nececery files",20);
    
    //Save that data in file
    var stringToSave="var firebaseConfig=";
    var objToBeSaved={
      "apiKey": answers.firebaseApiKey,
      "authDomain": answers.firebaseProjectId+".firebaseapp.com",
      "databaseURL": "https://"+answers.firebaseProjectId+".firebaseio.com",
      "projectId": answers.firebaseProjectId,
      "storageBucket": answers.firebaseProjectId+".appspot.com",
      "appId": answers.firebaseAppId
    }
    stringToSave+=JSON.stringify(objToBeSaved, null, '  ');
    stringToSave+=";\r\n";
    stringToSave+="exports.config=firebaseConfig;";

    fs.writeFileSync(RAB_LOCATION+"SaaS\ Landing\ Page/app-builder-landing/src/config/firebase_config.js",stringToSave);
    fs.writeFileSync(RAB_LOCATION+"Mobile\ App/firebase_config.js",stringToSave);
    fs.writeFileSync(RAB_LOCATION+"Cloud\ Functions/functions/firebase_config.js",stringToSave);
    fs.writeFileSync(RAB_LOCATION+"Builder/src/config/firebase_config.js",stringToSave);

    var buildappjsReplacers=[];
        buildappjsReplacers.push(['"appName": "React app builder",','"appName":"'+answers.appName+'",']);
        buildappjsReplacers.push(['"adminUsers":[],','"adminUsers":["'+answers.adminUser+'"],']);
        buildappjsReplacers.push(['defaultExport.licenseCode="";','defaultExport.licenseCode="'+answers.purchaseCode+'";']);
        buildappjsReplacers.push(["defaultExport.isSaaS=false;","defaultExport.isSaaS=true;"]);
        buildappjsReplacers.push(['defaultExport.buildAccountUsername="mobidoniabuild";','defaultExport.buildAccountUsername="'+answers.expoBuildUsername+'";']);
        buildappjsReplacers.push(['defaultExport.buildAccountPassword="AppBuild2";','defaultExport.buildAccountPassword="'+answers.expoBuildPassword+'";']);

        buildappjsReplacers.push(['defaultExport.tinyMCEAPIKey="22cwjj0ahtz5zze4rv0mzizljuzfxkxu758941fql7k6sn6s";','defaultExport.tinyMCEAPIKey="'+answers.tinyMCEApiKey+'";']);
        buildappjsReplacers.push(['"googleMapsAPIKey":"YOUR_KEY";','"googleMapsAPIKey":"'+answers.googleMapsApiKey+'"']);

    var configProducerReplacers=[];
      configProducerReplacers.push(['exports.SENDGRID_API_KEY="YOUR_SENDGRID_API_KEY"','exports.SENDGRID_API_KEY="'+answers.sendGridApiKey+'"']);
      configProducerReplacers.push(['exports.fromEmail="your@email.com"','exports.fromEmail="'+answers.sendGridEmail+'"']);
      configProducerReplacers.push(['exports.isSaaS=false;','exports.isSaaS=true;']);
      configProducerReplacers.push(['exports.isServer=false;',' exports.isServer=true;']);
     
    
    var previewAppAppJsonReplacers=[];
      previewAppAppJsonReplacers.push(['"name": "App Platform - UniApp",','"name": "'+answers.appName+'",']);
      previewAppAppJsonReplacers.push(['"slug": "uniexpoapp",','"slug": "'+(answers.appName.toLowerCase().replace(/\s/g,""))+'",']);
      previewAppAppJsonReplacers.push(['"bundleIdentifier": "com.mobidonia.rechat"','"bundleIdentifier": "preview.'+answers.domainName+'"']);
      previewAppAppJsonReplacers.push(['"package": "com.mobidonia.rechat"','"package": "preview.'+answers.domainName+'"']);
      previewAppAppJsonReplacers.push(['"description": "app_description",','"description": "'+answers.previewAppDecription+'",']);
     
    var previewAppConfigReplacers=[];
      previewAppConfigReplacers.push(['exports.showBCScanner = false;','exports.showBCScanner = true;']);
      previewAppConfigReplacers.push(['exports.isPreview=false;','exports.isPreview=true;']);

    var demoDataReplacers=[];
      demoDataReplacers.push(['http://demo.reactappbuilder.com/','http://'+answers.subDomainName+'/']);
      

    try {
      buildappjsReplacers.forEach(element => {
          replace.sync({
            files: RAB_LOCATION+'Builder/src/config/app.js',
            from: element[0],
            to: element[1]
          });
      });
      configProducerReplacers.forEach(element => {
        replace.sync({
          files: RAB_LOCATION+'Mobile App/Producer/config.js',
          from: element[0],
          to: element[1]
        });
      });

      previewAppAppJsonReplacers.forEach(element => {
        replace.sync({
          files: RAB_LOCATION+'Mobile App/app.json',
          from: element[0],
          to: element[1]
        });
      });

      previewAppConfigReplacers.forEach(element => {
        replace.sync({
          files: RAB_LOCATION+'Mobile App/config.js',
          from: element[0],
          to: element[1]
        });
      });

      demoDataReplacers.forEach(element => {
        replace.sync({
          files: RAB_LOCATION+'SaaS Landing Page/data.json',
          from: element[0],
          to: element[1]
        });
      });



      console.log(chalk.green("Procedure 2 Finished: File change has been done!"));

       //Procedure 2 ends - continue on procedure 3
      procedure3(answers);

    }
    catch (error) {
      console.error(chalk.red('Error occurred:', error));
    }

   
}

/**
 * Firebase Deploy cloud functions
 * @param {Object} answers 
 * @param {Array} commands 
 */
function sub_procedure3_firebase_deploy(answers,commands){
  console.log("Now create the src file");
        var rc=JSON.stringify({
          "projects": {
            "default": answers.firebaseProjectId
          }
        }, null, '  ');
        fs.writeFileSync(RAB_LOCATION+"Cloud\ Functions/.firebaserc",rc);
        var firebaseJSON=JSON.stringify({
          "functions": {
            "source": "functions"
          },
          "firestore": {
            "rules": "firestore.rules",
            "indexes": "firestore.indexes.json"
          }
        }, null, '  ');
        fs.writeFileSync(RAB_LOCATION+"Cloud\ Functions/firebase.json",firebaseJSON);
        
        exec('firebase', commands, {capture:false,cwd:RAB_LOCATION+"Cloud\ Functions/functions"}, function(loginoutput){
          //Next deploy the function
          console.log("Procedure 3 Finished: Cloud functions deploied");
          if(answers.isThisFreshInstall=="true"){
            //If this is fresh install, install firebase demo data
            procedure4(answers);
          }else{
            //If not, this is update, skip procedure 4
            procedure5(answers);
          }
          
        });
}


/**
 * Firebase login & deploy cloud functions
 * @param {Object} answers 
 */
function procedure3(answers){
  setUpState("Uploading Cloud Functions.",30);
  if(isCLI){
    //CLI
    exec('firebase', ['logout'], {capture:true}, function(logoutoutput){
      console.log('logged out');
      exec('firebase', ['login','--no-localhost'], {capture:false}, function(loginoutput){
        console.log('logged in');
        sub_procedure3_firebase_deploy(answers,['deploy','--only','functions']);
  
      });
    });
  }else{
    //WEB
    sub_procedure3_firebase_deploy(answers,['deploy','--only','functions']);
  }


  
}


/**
 * Upload the firebase demo data
 * @param {Object} answers 
 */
function procedure4(answers){
  setUpState("Upload the firebase demo data",40);
  //firebase database:set --project melanie-29640 /saas_rab_siite data.json
  var commands=null;
  if(isCLI){
    //CLI
    commands=['database:set',"-y",'--project',answers.firebaseProjectId,'/rab_saas_site', "data.json"];
  }else{
    //WEB
    commands=['database:set',"-y",'--project',answers.firebaseProjectId,'/rab_saas_site', "data.json"];
  }


  exec('firebase', commands, {capture:true,cwd: RAB_LOCATION+"SaaS\ Landing\ Page/"}, function(installoutput){
    console.log("Procedure 4 Finished: Firebase demo data installed");
    if(answers.doYouNeedlanding=="true"){
      procedure5(answers);
    }else{
      procedure6(answers);
    }
    
  });
}

/**
 * Creating lading page
 * @param {Object} answers 
 */
function procedure5(answers){
  setUpState("Creating landing page",50);
  console.log("Creating the landing page");
  exec('npm', ['run','build'], {capture:true,cwd:laingPage}, function(landiingoutput){
    console.log(landiingoutput);
    fse.move(laingPage + "/build", landingPageWebLocation, { overwrite: true }, console.error);
    console.log("Procedure 5 Finished: Landing page in place");
    procedure6(answers);
  });
}

/**
 * Creating App builder page
 * @param {Object} answers 
 */
function procedure6(answers){
  setUpState("Creating the app builder page",60);
  console.log("Creating the app builder page");
  if(answers.doYouNeedlanding=="true"){
    exec('npm', ['run','build'], {capture:true,cwd:appbuilderPage}, function(appbuilderoutput){
      console.log(appbuilderoutput);
      fse.move(appbuilderPage + "/build", appbuilderPageWebLocation, { overwrite: true }, console.error);
      console.log("Procedure 6 Finished: App builder page in place");
      procedure7(answers);
    });
  }else{
    exec('npm', ['run','build'], {capture:true,cwd:appbuilderPage}, function(appbuilderoutput){
      console.log(appbuilderoutput);
      fse.move(appbuilderPage + "/build", landingPageWebLocation, { overwrite: true }, console.error);
      console.log("Procedure 6 Finished: App builder page in place of the landing page");
      procedure7(answers);
    });
  }
  
}

/**
 * Create Expo Preview App
 * @param {Object} answers 
 */
function procedure7(answers){
  setUpState("Create Expo Preview App",70);
  console.log("Start expo login with the preview account");
  exec('expo', ['logout'], {capture:true}, function(logoutoutput){
    exec('expo', ['login','-u',answers.expoPreviewUsername,'-p',answers.expoPreviewPassword], {capture:true}, function(loginoutput){
      //After login, we can start the app build
      var metroBuilder=exec('npx', ['expo-cli','start'], {cwd:RAB_LOCATION+"Mobile App/"}, function(output){
          console.log(chalk.cyan('Starting local Metro builder'));
      });

      setTimeout(()=>{
          console.log("Kill the builder after 20sec");
          metroBuilder.kill('SIGINT');

          //The build parameters
          var makeApp = ['expo-cli','publish'];

          //Start making
          exec('npx', makeApp, {cwd:RAB_LOCATION+"Mobile App/"}, function(output){
              console.log(chalk.green('Create procedure done, now put the mobile code back to normal state'))
              var previewAppConfigReplacers=[];
                previewAppConfigReplacers.push(['exports.showBCScanner = true;','exports.showBCScanner = false;']);
                previewAppConfigReplacers.push(['exports.isPreview=true;','exports.isPreview=false;']);
              
                previewAppConfigReplacers.forEach(element => {
                  replace.sync({
                    files: RAB_LOCATION+'Mobile App/config.js',
                    from: element[0],
                    to: element[1]
                  });
                });

              console.log(chalk.cyan('Procedure 3 Finished: Preview App publishing completed'));
              console.log("\n");
              procedure8(answers)
          });

      },20000)

    });
  });
}


/**
 * Start the App builder script
 * @param {Object} answers 
 */
function procedure8(answers){
  setUpState("Start the App builder script",80);
  console.log("Start expo login with the preview account");
  exec('expo', ['logout'], {capture:true}, function(logoutoutput){
    exec('expo', ['login','-u',answers.expoBuildUsername,'-p',answers.expoBuildPassword], {capture:true}, function(loginoutput){
      exec('pm2', ['start','./Producer/produce.js','--name','AppProducer'], {capture:true,cwd:RAB_LOCATION+"Mobile\ App"}, function(logoutoutput){
        console.log("Procedure 8 Finished: Logged in with app builderd and producer is running");
        procedure9(answers);
      });
    });
  });
}

/**
 * Set the virtual hosts
 * @param {Object} answers 
 */
function procedure9(answers){
  setUpState("Create the virtual hosts",90);
  
  //Create the virtual host for the landing page
  var landingPageSetup='<VirtualHost *:80>\n';
    landingPageSetup+="ServerName www."+answers.domainName+"\n";
    landingPageSetup+="ServerAlias "+answers.domainName+"\n";
    landingPageSetup+="DocumentRoot "+landingPageWebLocation+"\n";
  landingPageSetup+="</VirtualHost>\n";
  fs.writeFileSync(landingPageVHostLocation+answers.domainName+".conf",landingPageSetup);
  exec('sudo',['ln','-s',landingPageVHostLocation+answers.domainName+".conf",landingPageVHostEnabledLocation+answers.domainName+".conf"],{},function(symlinkoutput){
    console.log("Landing page enabled");
  })

  if(answers.doYouNeedlanding=="true"){
    //Create the virtual host for the appbuilder page
    var appBuilderPageSetup='<VirtualHost *:80>\n';
    appBuilderPageSetup+="ServerName www."+answers.subDomainName+"\n";
    appBuilderPageSetup+="ServerAlias "+answers.subDomainName+"\n";
    appBuilderPageSetup+="DocumentRoot "+appbuilderPageWebLocation+"\n";
    appBuilderPageSetup+="</VirtualHost>\n";
    fs.writeFileSync(appbuilderPageVHostLocation+answers.subDomainName+".conf",appBuilderPageSetup);

    exec('sudo',['ln','-s',appbuilderPageVHostLocation+answers.subDomainName+".conf",appbuilderPageVHostEnabledLocation+answers.subDomainName+".conf"],{},function(symlinkoutput){
      console.log("App builder page enabled");
    })
  }

  

  //Now create the Let's encrypt certificates
  exec('sudo', ['systemctl','restart','httpd'], {capture:true}, function(restartoutput){
    console.log(restartoutput);
    //It is good practice first to restart httpd, now lets start let's encrypt for the main domain
    //sudo certbot --apache -d example.com -d www.example.com --redirect -n --no-eff-email -m exampl@example.com
    //exec('sudo', ['certbot','--agree-tos','--apache','-d',answers.domainName,'-d','www.'+answers.domainName,'--redirect','-n','--no-eff-email','-m',answers.adminUser], {capture:true}, function(letsmainoutput){
      //console.log(letsmainoutput);

      if(answers.doYouNeedlanding=="true"){
        //exec('sudo', ['certbot','--agree-tos','--apache','-d',answers.subDomainName,'-d','www.'+answers.subDomainName,'--redirect','-n','--no-eff-email','-m',answers.adminUser], {capture:true}, function(letssuboutput){
          //console.log(letssuboutput);
          exec('sudo', ['systemctl','restart','httpd'], {capture:true}, function(restartoutput){
            console.log(restartoutput);
            //console.log(chalk.yellow("SSL certificates created"));
            //After restart, restore connection
            //restorecon -R /var/www/html/
            exec('restorecon', ['-R',landingPageWebLocation+"/"], {capture:true}, function(restartConnLandingoutput){
              exec('restorecon', ['-R',appbuilderPageWebLocation+"/"], {capture:true}, function(restartConnBuilderoutput){
                console.log("Procedure 9 Finished: HTTP Restarted");
                procdeure10(answers);
              });
            });
           
          });
        //});
      }else{
        //Without landing
        exec('sudo', ['systemctl','restart','httpd'], {capture:true}, function(restartoutput){
          console.log(restartoutput);
          //console.log(chalk.yellow("SSL certificates created"));
          //After restart, restore connection
          //restorecon -R /var/www/html/
          exec('restorecon', ['-R',landingPageWebLocation+"/"], {capture:true}, function(restartConnLandingoutput){
            console.log("Procedure 9 Finished: HTTP Restared");
            procdeure10(answers);
          });
         
        });
      }


      
    //});

  });
  //End let's encrypt

}

/**
 * Set the virtual hosts
 * @param {Object} answers 
 */
function procdeure10(answers){
  setUpState("All Procedures done",100);
  console.log();
  console.log();
  console.log(chalk.green("Service Started"));
  console.log("Your landing page, App builder site, App Preview Account, Automatic app builder should be all functionning now.");
  console.log(chalk.red("See you soon"));
  process.exit();
}

function setUpState(title,percent){
  var state={
    "status":title,
    "percentage":percent,
    "stage":title,
    "done":actionsDone
  }
  filePath =  easySetupWebLocation+'/public/state.json'
  fs.writeFileSync(filePath, JSON.stringify(state, null, '  '));
  actionsDone.push(title);
}







  
 
  
  
  
  
  
  
  

  
  

  

  
