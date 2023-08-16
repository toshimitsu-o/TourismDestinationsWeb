/*
Open Trip Map API Implementation

kinds
 - accomodations
 - adult
 - amusements
 - interesting_places
 - sport
 - tourist_facilities

radius (m)

*/

const OT_KEY = "5ae2e3f221c38a28845f05b6c063c679c35ac09cb308c9b7c9677155";
const OT_SEARCH = "https://api.opentripmap.com/0.1/en/places/radius?rate=2&format=json&limit=50&apikey=" + OT_KEY + "&radius=50000";
const OT_INFO = "https://api.opentripmap.com/0.1/en/places/xid/";

let poiList = []; // List array of POI places
$( document ).ready(function() {
    $("#poi-kinds a").click(function(){
        $("#poi-list").remove();
        $("#poi-info").remove();
        fetchPOI($(this).attr("kind"));
    });
});

// Get POI data from OT API
function fetchPOI(kinds = "interesting_places") {
    let url = OT_SEARCH + "&lon=" + destination.lon + "&lat=" + destination.lat + "&kinds=" + kinds;
    $.get(url, function (data) {
        poiList = data;
        $("#poi-list").remove(); // Remove to reset the list
        $("#poi-box").append(`<div id="poi-list"></div>`);
        if (poiList.length !== 0) {
            listPOI(poiList);
        } else {
            // If nothing in the list
            $("#poi-list").append("<p>Sorry. No place found.</p>");
        }
    }, "json");
}
// Display list of POI
function listPOI(list) {
    let htmlstr = "";
    list.forEach(function(item, index){
        htmlstr = `<a href="#poi-list" xid="${item.xid}">${item.name}</a>`;
        $("#poi-list").append(htmlstr);
    });
    $("#poi-list a").each(function(){
        $(this).click(function(){
            $("#poi-info").remove();
            let xid = $(this).attr("xid");
            displayPOI(xid);
        });
    });
}
// Display details of the selected POI with xid
function displayPOI(xid){
    let url = OT_INFO + xid + "?apikey=" + OT_KEY;
    $.get(url, function (data) {
        let title, img, desc, sourcelink;
        title = (data.name) ? `<h4>${data.name}</h4>` : "";
        if (data.preview) {
            img = (data.preview.source) ? `<img src="${data.preview.source}">` : "";
        } else {
            img = "";
        }
        if (data.wikipedia_extracts) {
            desc = (data.wikipedia_extracts.text) ? `${data.wikipedia_extracts.text}` : "";
        } else {
            desc = "";
        }
        sourcelink = (data.wikipedia) ? ` (<a href="${data.wikipedia}" target="_blank" style="font-style: italic;">wikipedia</a>)` : "";
        let infostr = `${title}
        <div class="poidetails">
        <div class="poidesc"><p>${desc}${sourcelink}</p></div>
        <div class="poiimg">${img}</div>
        </div>`;
        $("#poi-box").append('<div id="poi-info"></div>');
        $("#poi-info").append(infostr);
    }, "json");
}