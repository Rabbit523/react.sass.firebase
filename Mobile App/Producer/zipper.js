
var program = require('commander');
var chalk = require('chalk');
var inquirer = require('inquirer');
const fs = require('fs');
var exec = require('./lib/exec');

const projects= ["all","businessDirectory","chat","conference","events","news","nightClub","radio","recepie","restaurant","scanner","shop_regular",'shop_shopify'];


/*
 * General Asker funciton
 * @param {Array} choices 
 * @param {Function} callback 
 * @param {String} questioin  the question -- default to What you want to do next?
 * @param {Boolean} addExit 
 * @param {Boolean} returnSelectedIndex defaut to true - return index or lowercase of the select
 */
function asker(choices,callback,questioin="What you want to do next?",addExit=true,returnSelectedIndex=true){
    if(addExit){
        choices.push("Exit");
    }
    inquirer.prompt(
        [{
            type: "list",
            name: "selector",
            message: questioin,
            choices: choices,
            filter: function( val ) { return val; }
        }]
    ).then( answers => {
            //console.log(JSON.stringify(answers));
            var selected=answers.selector;//.toLowerCase().replace(/\s/g,"");
            var selectedIndex=-1;
            for (let index = 0; index < choices.length; index++) {
                const element = choices[index];
                if(element==answers.selector){
                    selectedIndex=index;
                }
            }
            if(selected=="exit"){
                process.exit(0);
            }else{
                if(returnSelectedIndex){
                    callback(selectedIndex);
                }else{
                    callback(selected);
                }
                
            }
            
        }
    );


}


/**
 * STEP 1. Main start function, displays the initial menu
 */
function start(){
    asker(projects,zipAppFor,"What type of app",true,false)
}


function makeAZipCommand(name,itemsToExcude){
    var excludeCommandAsArray=['-r',name+'_'+(new Date().getTime())+'.zip','uniexpoapp','-x'];
    var commandAsString="";
    itemsToExcude.forEach(element => {
        excludeCommandAsArray.push(element);
        commandAsString+=" "+element;
    });
    //console.log(chalk.red("Execute"));
    //commandAsString='zip -r '+name+'.zip reactfireadmin -x '+commandAsString;
    //console.log(chalk.yellow(commandAsString))

    exec('zip' ,excludeCommandAsArray, {cwd:"../"}, function(output){
        console.log(output);
        console.log(chalk.cyan('ZIP done'));
    });

}

function dismisFiles(app,list){
    if(app=="all"){
        //Do nothing
        return list;
    }else{
        projects.forEach(element => {
            if(element!=app){
                list.push('*/DemoData/'+element+".js*");
            }
        });
    }
}

function zipAppFor(app){
    var filesToExclude = [
        '*/__tests__*',
        '*.git*',
        '*.expo*',
        '*.expo-shared*',
        '*.vscode*',
        '*/node_modules*',
        '*/test*',
        '*/to*',
        '*.babelrc*',
        '*.dockerignore*',
        '*.gitignore*',
        '*.watchmanconfig*',
        '*Dockerfile*',
        '*package-lock.json*'
    ];
    dismisFiles(app,filesToExclude);
    makeAZipCommand(app,filesToExclude);
}

start();