/* eslint-disable */
import Config from './../config/app'
import firebase from './../config/database'

/**
 * Dynamic translations
 * @param {String} query 
 */
function td(query){
    //query --> key And preview you app
    //ky --> And_preview_you_app
    var key = query.replace(/\s/g, "_");
    return Config.activeTranslation.dynamic&&Config.activeTranslation.dynamic[key]?Config.activeTranslation.dynamic[key]:query
}


/**
 * Stratic translations
 * @param {String} query 
 */
function ts(query){
 //query --> key And preview you app
    //ky --> And_preview_you_app
    var key = query.replace(/\s/g, "_");
    return Config.activeTranslation.static&&Config.activeTranslation.static[key]?Config.activeTranslation.static[key]:query
}


/**
 * Sets current anguage, and can update user language
 * @param {String} language 
 * @param {Boolean} shouldUpdateUserLang 
 * @param {Funcion} callback
 */
function fetchAndSetLanguageAndSetUser(language,shouldUpdateUserLang,callback){
    //2. Fetch selected language
    var translations = firebase.app.database().ref('/translations/');
        translations.on('value', function(snapshot) {
          var data=snapshot.val();
          var allAvailableLanguages=[];
          //3. Set selected language
          if(data){
            Object.keys(data).map((key)=>{
                if(language.toLowerCase() === key.toLowerCase()){
                    Config.activeTranslation=data[key];
                   
                }
                allAvailableLanguages.push(key.toUpperCase());
            })
          }
          
         
          callback(allAvailableLanguages);
        });

    
    //4. if shouldUpdateUserLang - update curent user lang
 }

export default {ts:ts,td:td,fetchAndSetLanguageAndSetUser:fetchAndSetLanguageAndSetUser};