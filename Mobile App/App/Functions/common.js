import moment from 'moment';
import {Linking,Platform} from "react-native";

class FunctionDirectorty {

	stripeHTML(value){
		return value.replace(/<(?:.|\n)*?>/gm, '').replace(/&nbsp;/gi,'').replace(/&ndash;/gi,'').replace(/<\!DOCTYPE html>/gi,'');
	}
  roundOn(value,places=2) {
		return parseFloat(value+"").toFixed(parseInt(places));
	}

	toCurrency(value,code="USD"){
    var currencyFormatter = require('currency-formatter');
		return currencyFormatter.format(value, { code: code });
	}

	toReadableDate(value,format='LLLL'){
		return moment(value).format(format)
	}

	openGps(location){
		var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:'
		var url = scheme + '37.484847,-122.148386'
		this.openExternalApp(url)
	}

	openExternalApp(url) {
		Linking.canOpenURL(url).then(supported => {
			if (supported) {
				Linking.openURL(url);
			} else {

			}
		});
	}


	append(value,string=""){
		return value+string;
	}

	prepend(value,string=""){
		return string+value;
	}

  multiply(value,by=1){
		return Number(value)*Number(by);
	}

  trim(value,length=10){
    return value.length > length ?
                    value.substring(0, length - 3) + "..." :
                    value;
  }

  capitalizeFirstLetter(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }


   dynamicSort(property) { 
		return function (obj1,obj2) {
			return obj1[property] > obj2[property] ? 1
				: obj1[property] < obj2[property] ? -1 : 0;
		}
	}

	dynamicSortMultiple() {
		//save the arguments object as it will be overwritten
		//note that arguments object is an array-like object
		//consisting of the names of the properties to sort by
		var props = arguments;
		return function (obj1, obj2) {
			var i = 0, result = 0, numberOfProperties = props.length;
			//try getting a different result from 0 (equal)
			//as long as we have extra properties to compare
			while(result === 0 && i < numberOfProperties) {
				result = (new FunctionDirectorty()).dynamicSort(props[i])(obj1, obj2);
				i++;
			}
			return result;
		}
	}


}

function callFunction(subject,actions) {


	var functions=actions.split(",");
	let functionIndexer  = new FunctionDirectorty();
	for (var i = 0; i < functions.length; i++) {
		var functionParts=functions[i].split("~");
		var functionName=functionParts[0];

		if(functionIndexer[functionName]!=undefined&&functionIndexer[functionName]!=null){
			if(functionParts.length==1){
				//Just name
				subject=functionIndexer[functionName](subject);
			}else if(functionParts.length==2){
				//1 parameter
				subject=functionIndexer[functionName](subject,functionParts[1]);
			}else if(functionParts.length==3){
				//2 parameters
				subject=functionIndexer[functionName](subject,functionParts[1],functionParts[2]);
			}
			else if(functionParts.length==3){
				//3 parameters
				subject=functionIndexer[functionName](subject,functionParts[1],functionParts[3]);
			}
		}else{

		}

	}
	return subject;

}
exports.callFunction=callFunction;
exports.FunctionDirectory=new FunctionDirectorty();
