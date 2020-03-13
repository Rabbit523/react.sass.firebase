function removeSlash(website){
    //Remove slash at the end
    if(website.substr(website.length - 1)=="/"){
      return website.slice(0, -1);
    }else{
      return website;
    }
  }
  exports.removeSlash=removeSlash;
  
  
  function IsJsonString(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }
  exports.IsJsonString=IsJsonString;
  
  /**
   * @method prettyDate
   * @param {Date} time
   * creates a 'pretty date' from a unix time stamp
   * @private
   */
  function prettyDate(date) {
      var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var diff = (((new Date()).getTime() - date.getTime()) / 1000), day_diff = Math.floor(diff / 86400);
      if (isNaN(day_diff) || day_diff < 0) {
          return '';
      }
      if (day_diff >= 31) {
          var date_year = date.getFullYear();
          var month_name = monthname[date.getMonth()];
          var date_month = date.getMonth() + 1;
          if (date_month < 10) {
              date_month = "0" + date_month;
          }
          var date_monthday = date.getDate();
          if (date_monthday < 10) {
              date_monthday = "0" + date_monthday;
          }
          return date_monthday + " " + month_name + " " + date_year;
      }
      return day_diff == 0 && (diff < 60 && "just now" || diff < 120 && "1 minute ago" || diff < 3600 && Math.floor(diff / 60) + " minutes ago" || diff < 7200 && "1 hour ago" || diff < 86400 && "about " + Math.floor(diff / 3600) + " hours ago") || day_diff == 1 && "Yesterday" || day_diff < 7 && day_diff + " days ago" || day_diff < 31 && Math.ceil(day_diff / 7) + " week" + ((Math.ceil(day_diff / 7)) == 1 ? "" : "s") + " ago";
  }
  exports.prettyDate=prettyDate;
  
  /**
   * @method fix_relative_image_paths_in_article
   * @private
   */
  function fix_relative_image_paths_in_article(content, url) {
      return fix_duplicate_http(content.replace(/src="/g, 'src="' + url), url);
  }
  exports.fix_relative_image_paths_in_article=fix_relative_image_paths_in_article;
  
  /**
   * @method fix_duplicate_http
   * @private
   */
  function fix_duplicate_http(content, url) {
      var obj = url + 'http'
      var re = new RegExp(obj, "g");
      return content.replace(re, "http");
  }
  
  /**
   * @method get_images
   * @param {String} content
   * @private
   */
  function get_images(content) {
      String.prototype.reverse = function() {
          return this.split('').reverse().join('');
      };
  
      var images = content.reverse().match(/(gepj|gpj|fig|gnp)\..+?\/\/:ptth(?=\"\=crs)/g);
      if(!Array.isArray(images)){
        images = content.reverse().match(/(gepj|gpj|fig|gnp)\..+?\/\/:sptth(?=\"\=crs)/g);
      }
      if (Array.isArray(images)) {
           for(var i=0;i<images.length;i++){
               images[i]=images[i].reverse();
           }
  
  
      }
      return images;
  }
  exports.get_images=get_images;
  
  /**
   * @method HtmlCodesDecode
   * @param {String} str
   * @private
   * @return {String}
   */
  function HtmlCodesDecode(str) {
      str = str.replace(/&#8220;/g, '"');
      str = str.replace(/&#8216;/g, '\'');
      str = str.replace(/&#8221;/g, '"');
      str = str.replace(/&#8217;/g, '\'');
      str = str.replace(/&#8211;/g, '-');
       str = str.replace(/&#038;/g, '');
      return str;
  
  }
  exports.HtmlCodesDecode=HtmlCodesDecode;
  
  /**
   * @method getImageFromAttachment
   * @param {Object} post
   * @private
   */
  function getImageFromAttachment(post,isBig) {
      if ( typeof post.attachments[0] != "undefined") {
          //console.log("imame attachment");
  
          if ((post.attachments[0].mime_type).indexOf("image") !== -1) {
              var foundImage = post.attachments[0].url;
              if(!isBig&&post.attachments[0].images&&post.attachments[0].images.thumbnail&&post.attachments[0].images.thumbnail.url){
                  foundImage = post.attachments[0].images.thumbnail.url;
              }
  
  
              //console.log("Attachment on " + post.title);
              //console.log("Attachment is " + foundImage);
              return foundImage;
          } else {
              return null;
          }
      } else {
          return null;
      }
  }
  exports.getImageFromAttachment=getImageFromAttachment;
  
  /**
   * @method fix_wordpress_date
   * @param {String} wpDate
   * @private
   */
  function fix_wordpress_date(wpDate) {
      var year = wpDate.substring(0, 4);
      var day = wpDate.substring(8, 10);
      var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
      var month=wpDate.substring(5, 7);
      if(month.charAt(0)=="0"){
          month=month.charAt(1)+""
      }
      var month = monthNames[parseInt(month) - 1];
      return day + " " + month + " " + year;
  }
  exports.fix_wordpress_date=fix_wordpress_date;
  
  /**
   * @method HtmlDecode
   * @private
   */
  var HtmlDecode = (function() {
      var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
      var translate = {
          "nbsp" : " ",
          "amp" : "&",
          "quot" : "\"",
          "lt" : "<",
          "gt" : ">"
      };
      return function(s) {
          return ( s.replace(translate_re, function(match, entity) {
                  return translate[entity];
              }) );
      }
  })();
  exports.HtmlDecode=HtmlDecode;
  
  
  function domainToWebsite(domain){
    return "https://"+domain;
  }
  exports.domainToWebsite=domainToWebsite;
  
  function websiteToDomain(website){
    website=website.replace("http://","");
    website=website.replace("https://","");
    website=website.replace("www.","");
    website=removeSlash(website);
    return website;
  }
  exports.websiteToDomain=websiteToDomain;
  