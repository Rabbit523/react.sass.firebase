import firebaseConfig from './firebase_config'
var defaultExport={}

//FireBase - //Since version 6.0.0 , config is fetched from firebase_config.js - for easier setup
defaultExport.firebaseConfig = firebaseConfig.config;

//App setup
defaultExport.adminConfig={
  "appName": "React app builder",
  "slogan":"make mobile apps.",
  "design":{
    "sidebarBg":"sidebar-2.jpg", //sidebar-1, sidebar-2, sidebar-3
    "dataActiveColor":"rose", //"purple | blue | green | orange | red | rose"
    "dataBackgroundColor":"black", // "white | black"
  },
  "showItemIDs":false,
  "allowedUsers":null, //If null, allow all users, else it should be array of allowd users
  "adminUsers":["lifeisyoureality@gmail.com"],
  "allowGoogleAuth":true, //Allowed users must contain list of allowed users in order to use google auth
  "allowRegistration": true,
  "fieldBoxName": "Fields",
  "maxNumberOfTableHeaders":5,
  "prefixForJoin":[],
  "listOfItemKeys":["username","primaryData",'city'],
  "showSearchInTables":true,
  "methodOfInsertingNewObjects":"push", //timestamp (key+time) | push - use firebase keys
  "goDirectlyInTheInsertedNode":true,
  "urlSeparator":"+",
  "urlSeparatorFirestoreSubArray":"~",
  "googleMapsAPIKey":"AIzaSyD-_tfnqKnHRpuF8gIsAw7ePZ7loY5Ik3s",

  "fieldsTypes":{
    "photo":["photo","image","category_image","userImage"],
    "dateTime":["datetime","start","eventDateStart","eventDateEnd","date"],
    "date":["datefield","created"],
    "time":["time"],
    "map":["map","latlng","location","eventLocation"],
    "textarea":["description"],
    "html":["content","html",'build_instructions'],
    "radio":["goDirectlyToDetails","isTesting","showBannerAds","showinterstitialAds","facebookLogin","googleLogin","sendEmailOnOrder","acceptPayments","sandBoxMode","radio","radiotf","featured","isShopping","showPhotos","layout","coloring","outbound","rounded","showNavButton","cartCODAvailable","category_first","isRoot","isDirectShopping","cartPayPalAvailable","showCategoryFilter","haveThumbnails","hide_all_category_filter","hideHeader","display_header_image","isHavingStream","photosVertical","PayPalAvailable","CODAvailable","isRTL","backgroundImage","detailsBackgroundImage","hideTabIconName","hasFeatures"],
    "checkbox":["checkbox","streamType"],
    "dropdowns":["status","dropdowns","navButtonAction","type","listStyle","category_style","listing_style","order","sectionType","webSource","barStyle","imageRowFontWeight"],
    "file":["videoField"],
    "rgbaColor":['rgba'],
    "hexColor":['*Color',"buttonText","backgroundColor","buttonText"],
    "relation":['creator','collection','collection_news','collection_recipe','radios_collection','collection_eventsconference','collection_event','eventsnc_collection','collection_product','collection_venue','collection_product_shopify'],
    "iconmd":['iconmd'],
    "iconfa":['iconfa'],
    "iconti":['iconti'],
    "iconfe":['icon'],
  },
  "optionsForDateTime":[
    {"key":"eventDateEnd", "dateFormat":"YYYY-MM-DD" ,"timeFormat":true, "saveAs":"x","locale":"es"},
    {"key":"eventDateStart", "dateFormat":"X" ,"timeFormat":"HH:mm", "saveAs":"x"},
  ],
  "optionsForSelect":[
      {"key":"dropdowns","options":["new","processing","rejected","completed"]},
      {"key":"checkbox","options":["Skopje","Belgrade","New York"]},
      {"key":"streamType","options":["icecast","shoutcast","shoutcast2"]},
      {"key":"type","options":["Bug fix","Feature","Improuvment","deleted","added","updated"]},
      {"key":"status","options":["just_created","confirmed","canceled"]},
      {"key":"radio","options":["no","maybe","yes"]},
      {"key":"radiotf","options":["true","false"]},
      {"key":"featured","options":["true","false"]},
      {"key":"isShopping","options":["true","false"]},
      {"key":"rounded","options":["true","false"]},
      {"key":"outbound","options":["true","false"]},
      {"key":"layout","options":["side","tabs","grid"]},
      {"key":"coloring","options":["simple","advanced"]},
      {"key":"showPhotos","options":["true","false"]},
      {"key":"showNavButton","options":["true","false"]},
      {"key":"navButtonAction","options":["add-to-favorites"]},
      {"key":"sectionType","options":["master-detail","cart","orders","wish-list","profile","listOfUsers","web","map","notifications","scanner",'chats','addContact']},
      {"key":"category_first","options":["true","false"]},
      {"key":"isRoot","options":["true","false"]},
      {"key":"listStyle","options":["grid", "grid2", "list"],"labels":["Grid", "Special Grid","List"]},
      {"key":"barStyle","options":["light-content", "dark-content"]},
      {"key":"imageRowFontWeight","options":["normal", "bold"]},
      {"key":"listing_style","options":["grid", "grid2", "list"]},
      {"key":"category_style","options":["grid", "grid2", "list"]},
      {"key":"webSource","options":["url","html"]},
      {"key":"order","options":["ASC", "DSC"]},
      {"key":"cartCODAvailable","options":["true","false"]},
      {"key":"hasFeatures","options":["true","false"]},
      {"key":"CODAvailable","options":["true","false"]},
      {"key":"isDirectShopping","options":["true","false"]},
      {"key":"cartPayPalAvailable","options":["true","false"]},
      {"key":"PayPalAvailable","options":["true","false"]},
      {"key":"showCategoryFilter","options":["true","false"]},
      {"key":"haveThumbnails","options":["true","false"]},
      {"key":"hide_all_category_filter","options":["true","false"]},
      {"key":"hideHeader","options":["true","false"]},
      {"key":"display_header_image","options":["true","false"]},
      {"key":"isHavingStream","options":["true","false"]},
      {"key":"photosVertical","options":["true","false"]},
      {"key":"isRTL","options":["true","false"]},
      {"key":"backgroundImage","options":["true","false"]},
      {"key":"detailsBackgroundImage","options":["true","false"]},
      {"key":"hideTabIconName","options":["true","false"]},
      {"key":"isTesting","options":["true","false"]},
      {"key":"goDirectlyToDetails","options":["true","false"]},
      {"key":"showBannerAds","options":["true","false"]},
      {"key":"showinterstitialAds","options":["true","false"]},
      {"key":"facebookLogin","options":["true","false"]},
      {"key":"googleLogin","options":["true","false"]},
      {"key":"sendEmailOnOrder","options":["true","false"]},
      {"key":"acceptPayments","options":["true","false"]},
      {"key":"sandBoxMode","options":["true","false"]},
  ],
  "optionsForRelation":[
    //'collection','collection_news','collection_recipe','radios_collection','collection_eventsconference','collection_event','eventsnc_collection','collection_product','collection_venue'
    {
      "display": "title",
      "isValuePath": true,
      "key": "collection",
      "path": "/APP_NAME_restaurant_collection",
      "relationJoiner": "-",
      "relationKey": "collection_restaurant",
      "value": "name"
    },{
      "display": "title",
      "isValuePath": true,
      "key": "collection_news",
      "path": "/APP_NAME_news_collection",
      "relationJoiner": "-",
      "relationKey": "collection_news",
      "value": "name"
    },{
      "display": "title",
      "isValuePath": true,
      "key": "collection_recipe",
      "path": "/APP_NAME_recipes_collection",
      "relationJoiner": "-",
      "relationKey": "collection_recipe",
      "value": "name"
    },{
      "display": "title",
      "isValuePath": true,
      "key": "radios_collection",
      "path": "/APP_NAME_radios_collection",
      "relationJoiner": "-",
      "relationKey": "collection_radios",
      "value": "name"
    },{
      "display": "title",
      "isValuePath": true,
      "key": "collection_eventsconference",
      "path": "/APP_NAME_eventsconference_collection",
      "relationJoiner": "-",
      "relationKey": "collection_eventsconference",
      "value": "name"
    },{
      "display": "title",
      "isValuePath": true,
      "key": "collection_event",
      "path": "/APP_NAME_events_collection",
      "relationJoiner": "-",
      "relationKey": "collection_events",
      "value": "name"
    },{
      "display": "title",
      "isValuePath": true,
      "key": "eventsnc_collection",
      "path": "/APP_NAME_eventsnc_collection",
      "relationJoiner": "-",
      "relationKey": "collection_eventsnc",
      "value": "name"
    },{
      "display": "title",
      "isValuePath": true,
      "key": "collection_product",
      "path": "/APP_NAME_products_collection",
      "relationJoiner": "-",
      "relationKey": "collection_products",
      "value": "name"
    },{
      "display": "title",
      "isValuePath": true,
      "key": "collection_product_shopify",
      "path": "/APP_NAME_product_collection_shopify",
      "relationJoiner": "-",
      "relationKey": "collection_product_shopify",
      "value": "name"
    },{
      "isValuePath": true,
      "display": "title",
      "key": "collection_venue",
      "path": "/APP_NAME_conferencevenue_collection",
      "produceRelationKey": true,
      "relationJoiner": "-",
      "relationKey": "collection_conferencevenue",
      "value": "name"
    },
    {
        //Firestore - Native
        "display": "title",
        "isValuePath": true,
        "key": "collection_radios",
        "path": "/radios_collection",
        "produceRelationKey": true,
        "relationJoiner": "-",
        "relationKey": "radios_collection",
        "value": "name"
      }
  ],
  "paging":{
    "pageSize": 200,
    "finite": true,
    "retainLastPage": false
  },
  "hiddenKeys":["keyToHide","anotherKeyToHide","listStyle"],
  "previewOnlyKeys":["previewOnlyKey","anotherPreviewOnlyKye"]
}

//Navigation
defaultExport.navigation=[
  {
    "link": "/",
    "name": "Dashboard",
    "schema":null,
    "icon":"home",
    "path": "",
     isIndex:true,
  },
  {
    "link": "sections",
    "path": "null",
    "name": "App setup",
    "icon":"phonelink_setup",
    "tableFields":["name","description"],
  },
  {
    "link": "fireadmin",
    "path": "design",
    "name": "Design",
    "icon":"color_lens",
    "tableFields":["name","description"],
    "subMenus":[
      {
        "link": "fireadmin",
        "path": "design/general",
        "name": "General",
        "icon":"border_color",
        "tableFields":["name","description"],
      },{
        "link": "fireadmin",
        "path": "design/navBar",
        "name": "Navigation bar",
        "icon":"border_top",
        "tableFields":["name","description"],
      },{
        "link": "fireadmin",
        "path": "design/rows",
        "name": "List design",
        "icon":"short_text",
        "tableFields":["name","description"],
      },{
        "link": "fireadmin",
        "path": "design/sideMenu",
        "name": "Side menu colors",
        "icon":"format_color_fill",
        "tableFields":["name","description"],
      }
    ]
  },
  {
    "link": "firestoreadmin",
    "path": "orders",
    "name": "Orders",
    "icon":"shopping_cart",
    "tableFields":["status","total"],
  },
  {
    "link": "push",
    "path": "",
    "name": "Push notification",
    "icon":"speaker_notes",
    "tableFields":[],
  },
  {
    "link": "preview",
    "path": "null",
    "name": "Preview",
    "icon":"remove_red_eye",
    "tableFields":["name","description"],
  },
  {
    "link": "submit",
    "path": "null",
    "name": "Submit app",
    "icon":"check_circle_outline",
    "tableFields":["name","description"],
  },
  {
    "link": "fireadmin",
    "path": "settings",
    "name": "App settings",
    "icon":"settings_applications",
    "tableFields":[],
    "subMenus":[
      {
        "link": "fireadmin",
        "path": "settings/adMob",
        "name": "AdMob",
        "icon":"feedback",
        "tableFields":[],
      },{
        "link": "fireadmin",
        "path": "settings/login",
        "name": "Login",
        "icon":"mobile_friendly",
        "tableFields":[],
      },{
        "link": "fireadmin",
        "path": "settings/orders",
        "name": "Orders",
        "icon":"touch_app",
        "tableFields":[],
      },{
        "link": "fireadmin",
        "path": "settings/paypal",
        "name": "PayPal",
        "icon":"payment",
        "tableFields":[],
      }
    ]
  },
  {
    "link": "fireadmin",
    "path": "users",
    "name": "Users",
    "icon":"supervised_user_circle",
    "tableFields":["email","numOfApps","userImage"],
  },
];


  //From v 5.1.0 we suggest remoteSetup due to security
  //
defaultExport.pushSettings={
  "remoteSetup":false,
  "remotePath":"pushSettings",
  "pushType":"expo", //firebase -  onesignal - expo
  "Firebase_AuthorizationPushKey":"AIzaSyCFUf7fspu61J9YsWE-2A-vI9of1ihtSiE", //Firebase push authorization ket
  "pushTopic":"news", //Only for firebase push
  "oneSignal_REST_API_KEY":"",
  "oneSignal_APP_KEY":"",
  "included_segments":"Active Users", //Only for onesignal push
  "firebasePathToTokens":"/expoPushTokens", //we save expo push tokens in firebase db
  "saveNotificationInFireStore":true, //Should we store the notification in firestore
}

//flag to now which app we are using to configure Languages Style
defaultExport.appToConfig="appbuilder"

defaultExport.userDetails={}

defaultExport.remoteSetup=false;
defaultExport.remotePath="admins/mobidonia";
defaultExport.allowSubDomainControl=false;
defaultExport.subDomainControlHolder="admins/";
defaultExport.isAppCreator=true;
defaultExport.appEditPath=undefined;
defaultExport.isSaaS=true;
defaultExport.stripe_api_key = "pk_test_s9YSuCYnQ4BOjv0dVHeihOjv00nc58CuGm";
defaultExport.licenseCode="7484e97f-c8cb-486b-8a24-87ccc4077ebc"; //Envato purchase code.
defaultExport.saasAppsPath="/saasapps/"; //RAB as Saas On this path later we add user info
defaultExport.notSaaSAppsPath="/myapps"; //When RAB not as saas
defaultExport.isDemo=false; 
defaultExport.buildAccountUsername="aleksandar007";
defaultExport.buildAccountPassword="admin123456";

defaultExport.activeTranslation={"dynamic":{},"static":{}}

export default defaultExport;

