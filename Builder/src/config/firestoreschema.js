import * as firebase from 'firebase';
require("firebase/firestore");

var collectionMeta={
	//Radios
	"radios":{
		"fields":{
			"currentSong":"Current song",
			"radios_collection":"",
			"description":"The description about the radio",
			"image":"https://i.scdn.co/image/f87d436bcce8be370a2cb8d6512f5de8ac89d5ce",
			"name":"Enter the name of the radio",
			"currentArtist":"Current artist",
			"stream":"http://176.9.117.123:9998/;stream/1",
			"stationName":"Radio name",
			"streamType":"icecast"
			
		},
		"collections":[],
	},
	
	"radios_collection":{
		"fields":{
			"title":"Enter the type",
			"description":"Enter the type discription",
			"image":"https://i2.cdscdn.com/pdt2/6/7/9/1/700x700/auc8713016015679/rw/radio-cd-stereo-audiosonic.jpg",
			"name":"Enter the type"
		},
		"collections":[],
	},
	//NEWS
	"news":{
		"fields":{
			"collection_news":"",
			"description":"Your event description",
			"image":"https://i.imgur.com/svaHD6d.jpg",
			"title":"Your event title",
			"date":"2018-01-01 18:00",
		},
		"collections":["photos"],
	},
	"news_collection":{
		"fields":{
			"title":"Your category title",
			"description":"Category description",
			"image":"https://i.imgur.com/tcglVPv.jpg",
		},
		"collections":[],
	},

	

	//RESTAURANT
	"restaurant":{
		"fields":{
			"calories":100,
			"collection":"",
			"description":"Your product description",
			"image":"https://i.imgur.com/80vu1wL.jpg",
			"price":"10",
			"title":"Your product title",
			"options":{
				"option1":{
					"name":"Portion size",
					"values":["Big","Medium","Small"]
				},
				"option2":{
					"name":"Additional prop2",
					"values":["Option 2"]
				},
				"option3":{
					"name":"Additional prop3",
					"values":["Option 3 "]
				}
			},
		},
		"collections":["variants"],
	},
	"restaurant_collection":{
		"fields":{
			"description":"Category description",
			"image":"https://i.imgur.com/80vu1wL.jpg",
			"title":"Your category title",
		},
		"collections":[],
	},
	"variants":{
		"fields":{
			"option1":"Big",
			"option2":"",
			"option3":"",
			"price":10,
			"title":"Big portion"
		},
		"collections":[],
	},

	//Recepies
	"recipes":{
		"fields":{
			"timetoprepare":"1 hour",
			"for":"4 persons",
			"collection_recipe":"",
			"description":"Your recipe description",
			"image":"https://i.imgur.com/80vu1wL.jpg",
			"title":"Your product title",
			"link":"http://google.com",
			"videolink":"https://www.youtube.com/watch?v=RjfC7Wp34Fc"
		},
		"collections":["ingredients","photos"],
	},
	"recipes_collection":{
		"fields":{
			"description":"Category description",
			"image":"https://i.imgur.com/80vu1wL.jpg",
			"title":"Your category title",
		},
		"collections":[],
	},
	"ingredients":{
		"fields":{
			"name":"Ingrediants group",
			"list":["100ml Water","100ml Milk","item 3","item 4","item 5","item 6","item 7","item 8","item 9","item 10"]
		},
		"collections":[],
	},
	"photos":{
		"fields":{
			"name":"Name of the photo",
			"photo":"https://i.imgur.com/80vu1wL.jpg"
		},
		"collections":[],
	},

	//EVENTS
	"events":{
		"fields":{
			"locationName":"Location name",
			"collection_event":"",
			"description":"Your event description",
			"image":"https://i.imgur.com/svaHD6d.jpg",
			"price":"10",
			"title":"Your event title",
			"eventDateStart":"2018-01-01 18:00",
			"eventDateEnd":"2018-01-01 22:00",
			"eventLocation":new firebase.firestore.GeoPoint(41.22, 22.34),
			"options":{
				"option1":{
					"name":"VIP",
					"values":["Yes","No"]
				},
				"option2":{
					"name":"Additional prop2",
					"values":["Option 2"]
				},
				"option3":{
					"name":"Additional prop3",
					"values":["Option 3 "]
				}
			},
		},
		"collections":["variants","photos"],
	},
	"events_collection":{
		"fields":{
			"title":"Your category title",
			"description":"Category description",
			"image":"https://i.imgur.com/tcglVPv.jpg",
		},
		"collections":[],
	},

	//CONFERENCE EVENTS
	"eventsconference":{
		"fields":{
			"item_order":1,
			"item_special":"no",
			"collection_eventsconference":"",
			"description":"The speaker session long text",
			"image":"https://i.stack.imgur.com/l60Hf.png",
			"title":"Session title",
			"eventDateStartEndTime":"09:00 AM until 11:30 AM",
		},
		"collections":[],
	},
	"conferencetickets":{
		"fields":{
			"collection_eventsconference":"",
			"description":"Ticket information",
			"image":"https://cdn4.iconfinder.com/data/icons/computer-and-web-2/500/Calendar-512.png",
			"price":"10",
			"title":"Your ticket name",
			"options":{
				"option1":{
					"name":"Workshop",
					"values":["Yes","No"]
				},
				"option2":{
					"name":"Additional prop2",
					"values":["Option 2"]
				},
				"option3":{
					"name":"Additional prop3",
					"values":["Option 3 "]
				}
			},
		},
		"collections":["variants"],
	},
	"eventsconference_collection":{
		"fields":{
			"title":"Day 1",
			"description":"Conference day 1",
			"image":"https://i.imgur.com/tcglVPv.jpg",
		},
		"collections":[],
	},
	"conference_venue":{
		"fields":{
			"locationName":"Location name",
			"collection_venue":"",
			"description":"Your venue description",
			"image":"https://i.imgur.com/svaHD6d.jpg",
			"title":"Your venue title",
			"location":new firebase.firestore.GeoPoint(41.22, 22.34),
		},
		"collections":["photos"],
	},
	"conferencevenue_collection":{
		"fields":{
			"title":"Your category title",
			"description":"Category description",
			"image":"https://i.imgur.com/zcl46Wx.jpg",
		},
		"collections":[],
	},

	//NIGHT CLUB
	"eventsnc":{
		"fields":{
			"locationName":"Location name",
			"eventsnc_collection":"",
			"description":"Your event description",
			"image":"https://i.imgur.com/svaHD6d.jpg",
			"price":"10",
			"title":"Your event title",
			"eventDateStart":"2018-01-01 18:00",
			"eventDateEnd":"2018-01-01 22:00",
			"options":{
				"option1":{
					"name":"VIP",
					"values":["Yes","No"]
				},
				"option2":{
					"name":"Additional prop2",
					"values":["Option 2"]
				},
				"option3":{
					"name":"Additional prop3",
					"values":["Option 3 "]
				}
			},
		},
		"collections":["variants","photos"],
	},
	"eventsnc_collection":{
		"fields":{
			"title":"Your category title"
		},
		"collections":[],
	},
	"venue":{
		"fields":{
			"locationName":"Location name",
			"collection_venue":"",
			"description":"Your venue description",
			"image":"https://i.imgur.com/svaHD6d.jpg",
			"title":"Your venue title",
			"location":new firebase.firestore.GeoPoint(41.22, 22.34),
		},
		"collections":["photos"],
	},
	"albums":{
		"fields":{
			"date":"2018-01-01 18:00",
			"image":"https://i.imgur.com/svaHD6d.jpg",
			"description":"",
			"title":""
		},
		"collections":["photos"],
	},
	//BUSINESS DIRECTORY
	"directories":{
		"fields":{
			"locationName":"Location name",
			"collection_directory":"",
			"description":"Your event description",
			"image":"https://i.imgur.com/svaHD6d.jpg",
			"price":"10",
			"title":"Your event title",
			"numReview":0,
			"rating":0,
			"eventDateStart":"2018-01-01 18:00",
			"eventDateEnd":"2018-01-01 22:00",
			"eventLocation":new firebase.firestore.GeoPoint(41.22, 22.34),
			"options":{
				"option1":{
					"name":"VIP",
					"values":["Yes","No"]
				},
				"option2":{
					"name":"Additional prop2",
					"values":["Option 2"]
				},
				"option3":{
					"name":"Additional prop3",
					"values":["Option 3 "]
				}
			},
		},
		"collections":["variants","photos"],
	},
	"directories_collection":{
		"fields":{
			"title":"Your category title",
			"description":"Category description",
			"image":"https://i.imgur.com/tcglVPv.jpg",
		},
		"collections":[],
	},

	//Shopify 
	"products_shopify":{
		"fields":{
			"brand":"Brand name",
			"collection_product_shopify":"",
			"description":"Your product description",
			"image":"https://i.imgur.com/zcl46Wx.jpg",
			"price":"10",
			"title":"Your product title",
			"options":{
				"option1":{
					"name":"Color",
					"values":["Black","White"]
				},
				"option2":{
					"name":"Additional prop2",
					"values":["Option 2"]
				},
				"option3":{
					"name":"Additional prop3",
					"values":["Option 3 "]
				}
			},
		},
		"collections":["variants","photos"],
	},
	"product_collection_shopify":{
		"fields":{
			"title":"Your category title",
			"description":"Category description",
			"image":"https://i.imgur.com/zcl46Wx.jpg",
			
		},
		"collections":[],
	},
	//SHOP
	"products":{
		"fields":{
			"brand":"Brand name",
			"collection_product":"",
			"description":"Your product description",
			"image":"https://i.imgur.com/zcl46Wx.jpg",
			"price":"10",
			"title":"Your product title",
			"options":{
				"option1":{
					"name":"Color",
					"values":["Black","White"]
				},
				"option2":{
					"name":"Additional prop2",
					"values":["Option 2"]
				},
				"option3":{
					"name":"Additional prop3",
					"values":["Option 3 "]
				}
			},
		},
		"collections":["variants","photos"],
	},
	"products_collection":{
		"fields":{
			"title":"Your category title",
			"description":"Category description",
			"image":"https://i.imgur.com/zcl46Wx.jpg",
			
		},
		"collections":[],
	},

	"TEMPLATE":{
		"fields":{},
		"collections":[],
	},
}

module.exports=collectionMeta;