var chalk = require('chalk');
var questions = [
    {
      type: 'input',
      name: 'appName',
      message: "App name:",
      validate: function(value) {
        var flag = false;
        if(value.length > 0){
          flag = true
        }else flag = false
        return flag || chalk.red('Please enter App name!');
      },
    },
    {
      type: 'input',
      name: 'previewAppDecription',
      message: "Preview app description:",
      default:function(anwsers){
        return "Use our "+anwsers.appName+" preview app to test and preview your work.";
      }
    },
    {
      type: 'input',
      name: 'linkToLogo',
      message: "Link, url to your logo for the mobile preview app:",
      default: function (anwsers){ return "https://cdn3.iconfinder.com/data/icons/scientific-1/512/Test_Tube-512.png"},
      validate: function(value) {
        var re = /^^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
        var confirm = re.test(String(value).toLowerCase());
        
        return confirm || chalk.red('Please enter a valid url!');
      },
    },
    {
      type: 'confirm',
      name: 'isThisFreshInstall',
      message: "Is this fresh install:",
      default:true,
    },
    {
      type: 'confirm',
      name: 'doYouNeedLanding',
      message: "Do you need a landing page",
      default:true,
    },
    {
      type: 'input',
      name: 'adminUser',
      message: "Admin user email:",
      validate: function(value) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var confirm = re.test(String(value).toLowerCase());
        
        return confirm || chalk.red('Please enter a valid Admin user email!');
      },
    },
    {
      type: 'input',
      name: 'domainName',
      message: function(answers){ return "What will be your domain name. This is where your "+(answers.doYouNeedLanding?"landing page":"app builder page")+" will appear. ex mybuilder.com"},
      validate: function(value) {
        var re = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
        var confirm = re.test(String(value).toLowerCase());
        
        return confirm || chalk.red('Please enter a valid domain!');
      },
    },
    {
      type: 'input',
      name: 'subDomainName',
      message: function(anwsers){
        return "What will be your app builder subdomain name. This is where the App Builder site will be. ex builder."+anwsers.domainName;
      },
      default:function(anwsers){
        return "builder."+anwsers.domainName;
      },
      when: function(answers) {
        return answers.doYouNeedLanding;
      },
      validate: function(value) {
        var re = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;
        var confirm = re.test(String(value).toLowerCase());
        
        return confirm || chalk.red('Please enter a valid domain!');
      },
    },
    {
      type: 'input',
      name: 'purchaseCode',
      message: 'Envato purchase code:',
      validate: function(value) {
        var flag = false;
        if(value.length > 0){
          var parts = value.split("-");
          if(parts.length === 5){
            if(parts[0].length === 8 && parts[1].length === 4 && parts[2].length === 4 && parts[3].length === 4 && parts[4].length === 12){
                flag = true;
            }else flag = false;
          }else flag = false; 
        }
        return flag || chalk.red('Please enter a valid purchase code!');
      },
    },
    {
      type: 'input',
      name: 'firebaseApiKey',
      message: "Firebase apiKey:",
      validate: function(value) {
        var flag = false;
        if(value.length > 0){
          flag = true
        }else flag = false
        return flag || chalk.red('Please enter apiKey!');
      },
    },
    {
      type: 'input',
      name: 'firebaseProjectId',
      message: "Firebase projectId:",
      validate: function(value) {
        var flag = false;
        if(value.length > 0){
          flag = true
        }else flag = false
        return flag || chalk.red('Please enter projectId!');
      },
    },
    {
      type: 'input',
      name: 'firebaseAppId',
      message: "Firebase appId:",
      validate: function(value) {
        var flag = false;
        if(value.length > 0){
          flag = true
        }else flag = false
        return flag || chalk.red('Please enter appId!');
      },
    },
    {
      type: 'input',
      name: 'sendGridEmail',
      message: "SendGrid email:",
      validate: function(value) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var confirm = re.test(String(value).toLowerCase());
        
        return confirm || chalk.red('Please enter a valid SendGrid email!');
      },
    },
    {
      type: 'input',
      name: 'sendGridApiKey',
      message: 'SendGrid API KEY:',
      validate: function(value) {
        var flag = false;
        if(value.length > 0){
          var SGIdentificator = value.substr(0,3);
          if(SGIdentificator === "SG."){
            flag = true;
          }else flag = false;
        }
        return flag || chalk.red('Please enter a valid SendGrid API KEY!');
      },
    },
    {
      type: 'input',
      name: 'expoBuildUsername',
      message: "Expo Build username:",
      validate: function(value) {
        var flag = false;
        if(value.length > 2){
          flag = true
        }else flag = false
        return flag || chalk.red('Please enter Expo Build username!');
      },
    },
    {
      type: 'input',
      name: 'expoBuildPassword',
      message: "Expo Build password:",
      validate: function(value) {
        var flag = false;
        if(value.length > 2){
          flag = true
        }else flag = false
        return flag || chalk.red('Please enter Expo Build password!');
      },
    },
    {
      type: 'input',
      name: 'expoPreviewUsername',
      message: "Expo Preview username:",
      validate: function(value) {
        var flag = false;
        if(value.length > 2){
          flag = true
        }else flag = false
        return flag || chalk.red('Please enter Expo Preview username!');
      },
    },
    {
      type: 'input',
      name: 'expoPreviewPassword',
      message: "Expo Preview password:",
      validate: function(value) {
        var flag = false;
        if(value.length > 2){
          flag = true
        }else flag = false
        return flag || chalk.red('Please enter Expo Preview password!');
      },
    }
  ];

  //DEVELOPMENT SPEED
 //questions=[questions[0],questions[1]];

  exports.questions=questions;