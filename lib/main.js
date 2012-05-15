const file = require("file")
const widgets = require("widget");
const tabs = require("tabs");
const windowUtils = require("window-utils");



var id_elems = ["urlbar", "new-tab-button", "back-button", "searchbar", "urlbar-reload-button",
"forward-button", "bookmarks-menu-button", "home-button", "page-proxy-favicon","PersonalToolbar", "tabview-button", "alltabs-button"];

//var id_elems = ["urlbar-stop-button", "stop-button","urlbar-go-button"]



data = require("self").data

require("widget").Widget({
	id: "snapshot",
	label: "Snapshot button",
	contentURL: data.url("Camera_icon.ico"),
	onClick: take_snapshot 
})


//http://stackoverflow.com/questions/3115982/how-to-check-javascript-array-equals
function arrays_equal(a,b) { return !!a && !!b && !(a<b || b<a); }

//shamelessly stolen from http://stackoverflow.com/questions/5223/length-of-javascript-associative-array
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

//take_snapshot();


function take_snapshot() {
	var locations = new Array();
	for (e in id_elems) {
		var elemlocator = new windowUtils.WindowTracker({
		    onTrack: function(window) {
		        if ("chrome://browser/content/browser.xul" != window.location) return;
		        let elem = window.document.getElementById(id_elems[e]);
		        if (elem != null) {
			        let rect = elem.getBoundingClientRect();
			        console.log(id_elems[e] + " " + [Math.round(rect.top), Math.round(rect.left), Math.round(rect.right), Math.round(rect.bottom)])
			        if (!arrays_equal([Math.round(rect.top), Math.round(rect.left), Math.round(rect.right), Math.round(rect.bottom)], [0,0,0,0])) {
			        	locations[id_elems[e]] = [Math.round(rect.top), Math.round(rect.left), Math.round(rect.right), Math.round(rect.bottom)];
			        }
		    	}
		    	else {
		    		console.log("we can\'t find element " + id_elems[e]);
		    	}
		    }                                                
		});
	}

	locations = fake_element_locations(locations)
	
	var writer = file.open("/Users/isegall/workspace/tp-dataviz-prototype/data/locations.json", "w");
	writer.write("{");
	locations_len = Object.size(locations)
	index = 0
	for (var elem in locations) {
		writer.write("\"" + elem + "\":[" + locations[elem] + "]");
		if (index < locations_len -1) {
			writer.write(",");
		}
		index++;
	}
	writer.write("}");
	writer.close();
}


function fake_element_locations(locations) {
	locations["site-id-button"] = locations["page-proxy-favicon"];
	delete locations["page-proxy-favicon"];
	
	locations["bookmark-toolbar"] = locations["PersonalToolbar"];
	delete locations["PersonalToolbar"];
	
	locations["forward-button"][0] = locations["urlbar"][0];
	locations["forward-button"][1] = locations["back-button"][2];
	locations["forward-button"][2] = locations["forward-button"][1] + (locations["back-button"][2] - locations["back-button"][1])*.75;
	locations["forward-button"][3] = locations["urlbar"][3];
	
	locations["site-id-button"][0] = locations["forward-button"][0];
	locations["site-id-button"][1] = locations["forward-button"][2];
	locations["site-id-button"][2] = locations["site-id-button"][1] + (locations["forward-button"][2] - locations["forward-button"][1]);
	locations["site-id-button"][3] = locations["forward-button"][3];

	locations["urlbar"][1] = locations["site-id-button"][2];
	
//	locations["new-tab-button"][0] = locations["new-tab-button"][3] - 25;
//	locations["new-tab-button"][3] = locations["searchbar"][0] - 5;
	locations["new-tab-button"][1] = 505;
	locations["new-tab-button"][2] = locations["new-tab-button"][1] + 25;
	
	locations["most-frequent-menu"] = [null, null, null, null];
	locations["most-frequent-menu"][0] = locations["urlbar-reload-button"][0];
	locations["most-frequent-menu"][1] = locations["urlbar-reload-button"][1] - (locations["urlbar-reload-button"][2] - locations["urlbar-reload-button"][1]) - 2;
	locations["most-frequent-menu"][2] = locations["urlbar-reload-button"][1] - 2;
	locations["most-frequent-menu"][3] = locations["urlbar-reload-button"][3];
	
	locations["star-button"] = [null, null, null, null];
	locations["star-button"][0] = locations["most-frequent-menu"][0];
	locations["star-button"][1] = locations["most-frequent-menu"][1] - (locations["most-frequent-menu"][2] - locations["most-frequent-menu"][1]) - 4;
	locations["star-button"][2] = locations["most-frequent-menu"][1] - 4;
	locations["star-button"][3] = locations["most-frequent-menu"][3];

	locations["searchbar-search-engine-dropdown"] = [null, null, null, null]
	locations["searchbar-search-engine-dropdown"][0] = locations["searchbar"][0];
	locations["searchbar-search-engine-dropdown"][1] = locations["searchbar"][1];
	locations["searchbar-search-engine-dropdown"][2] = locations["searchbar-search-engine-dropdown"][1] + (locations["searchbar"][3] - locations["searchbar"][0])*1.5;
	locations["searchbar-search-engine-dropdown"][3] = locations["searchbar"][3];
	
	locations["searchbar-pick-new-search-engine"] = [null, null, null, null]
	locations["searchbar-pick-new-search-engine"][0] = locations["searchbar"][3];
	locations["searchbar-pick-new-search-engine"][1] = locations["searchbar"][1];
	locations["searchbar-pick-new-search-engine"][2] = locations["searchbar-search-engine-dropdown"][2];
	locations["searchbar-pick-new-search-engine"][3] = locations["searchbar"][3] + 100;


	locations["searchbar"][1] = locations["searchbar-search-engine-dropdown"][2];

	locations["searchbar-choose-suggestion"] = [null, null, null, null];
	locations["searchbar-choose-suggestion"][0] = locations["searchbar"][3];
	locations["searchbar-choose-suggestion"][1] = locations["searchbar"][1];
	locations["searchbar-choose-suggestion"][2] = locations["searchbar"][2];
	locations["searchbar-choose-suggestion"][3] = locations["searchbar-choose-suggestion"][0] + 100;
	
	locations["urlbar-choose-suggestion"] = [null, null, null, null];
	locations["urlbar-choose-suggestion"][0] = locations["urlbar"][3];
	locations["urlbar-choose-suggestion"][1] = locations["urlbar"][1];
	locations["urlbar-choose-suggestion"][2] = locations["urlbar"][2];
	locations["urlbar-choose-suggestion"][3] = locations["urlbar-choose-suggestion"][0] + 100;
		
		
	locations["bookmark-toolbar"][3] = locations["bookmark-toolbar"][3] + 25;
	
	return locations;
}




console.log("done");
