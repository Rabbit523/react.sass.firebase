var exec = require('./exec');
var chalk = require('chalk');
var inquirer = require('inquirer');

console.log("Pls do the following");
console.log("1. Delete all react app builder folder");
console.log("2. Delete the html folder in /var/www/html");
console.log("3. Delete the html folder in /var/wwww/appbuilder/html");
console.log("4. Delete sites avaialbe and sites enabled /etc/httpd/");

inquirer.prompt([
    {
      type: 'confirm',
      name: 'appName',
      message: "Have you done the above required procedures",
    }]).then(function(anwser){
        console.log(chalk.yellow('Installing npm dependencies.'))

        exec('npm', ['install'], {capture:true,cwd:"../Builder/"}, function(output){
            console.log("Builder installed");
            exec('npm', ['install'], {capture:true,cwd:"../Cloud\ Functions/"}, function(output){
                console.log("Cloud Functions installed");
                exec('npm', ['install'], {capture:true,cwd:"../Cloud\ Functions/functions/"}, function(output){
                    console.log("Cloud Functions - functions installed");
                    exec('npm', ['install'], {capture:true,cwd:"../Mobile\ App/"}, function(output){
                        console.log("Mobile App installed");
                        exec('npm', ['install'], {capture:true,cwd:"../SaaS\ Landing\ Page/app-builder-landing/"}, function(output){
                            console.log("Landing Page installed");
                            console.log("Done");
                        });
                    });
                });
            });
        });
});

