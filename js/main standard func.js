/*
Assignment 1 Tourism Destinations
*/

const API_KEY = "4ce9d0c14a032e3c3f1a638532d135b8";
const SIZE_URL = "https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&format=json&nojsoncallback=1&api_key=" + API_KEY + "&photo_id=";
const INFO_URL = "https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&format=json&nojsoncallback=1&api_key=" + API_KEY + "&photo_id=";
const SEARCH_URL = "https://www.flickr.com/services/rest/?method=flickr.photos.search&per_page=10&format=json&nojsoncallback=1&api_key=" + API_KEY + "&min_upload_date=2015-01&sort=relevance&safe_search=safe&extras=date_taken&text=";
let photos = []; // Photo data array
let places = []; // Places array
let history = []; // Recentry viewed array
let request = 0; // number of photo data request
let received = 0; // number of photo size data received
let infoReceived = 0; // number of photo info data received

$( document ).ready(function() {
    $.get("./data/places.json", function(data){
        places = data.places;
        listPlaces(places);
    }, "json");
    $("#modal-close").click(function(){
        $("#modal-containter").css("display", "none");
        $("#modal-content").attr("src","");
    });
});

// Clear data before showing search result
function clear() {
    //$("figure").hide();
    photos = [];
    request = 0;
    received = 0;
    infoReceived = 0;
}

// Extract photo id and title, and call getSizes
function fetchPhoto(data) {
    request = data.length;
    for (let i = 0; i < data.length; i++) {
        let id = data[i].id;
        let title = data[i].title;
        let date = data[i].datetaken;
        date = date.split(" "); // Split Date and Time
        date = date[0]; // Select only Date
        let photoObj = {"id": id, "title": title, "date": date}
        photos.push(photoObj);
        getSizes(photoObj);
        // getInfo(photoObj);  Removed
    }
}

// Get photo files in different sizes
function getSizes(photoObj) {
    $.get(SIZE_URL + photoObj.id, function(data){
        let sizeArray = data.sizes.size;
        let large_index;
        let small_index;
        let largeSq_index;
        // Find right sizes
        for (let i = 0; i < sizeArray.length; i++) {
            let size = sizeArray[i].label;
            if (size == "Large") {
                large_index = i;
            } else if (size == "Small") {
                small_index = i;
            } else if (size == "Large Square") {
                largeSq_index = i;
            }
        }
        // Check if sizes are found otherwise set alternative sizes
        if(!large_index) {
            large_index = sizeArray.length-1;
        }
        if(!small_index) {
            if(largeSq_index) {
                small_index = largeSq_index;
            } else {
                small_index = 0;
            }
        }
        if(!largeSq_index) {
            largeSq_index = 0;
        }
        photoObj.file = sizeArray[large_index].source;
        photoObj.thumbFile = sizeArray[small_index].source;
        photoObj.largeSqFile = sizeArray[largeSq_index].source;
        received++;
        if(request === received) display(photos, "#container");
        // when the number of received photo data reached the number of data requested
        // if(request === received) getInfo(photoObj);
    }, "json");
}

// Not in use since date is received via extra query in SIZE_URL
// Get info(date) of photos
function getInfo(photoObj) {
    $.get(INFO_URL + photoObj.id, function(data){
        let date = data.photo.dates.taken;
        photoObj.date = date;
        infoReceived++;
        // when the number of received photo info reached the number of data requested
        if(request == infoReceived && request == received) display(photos, "#container");
    }, "json");
}

// Display photos in HTML
function display(photos, target) {
    //if(!target) target = "#container"; // default
    $(target).empty();
    let htmlstr = "";
    for (let i = 0; i < photos.length; i++) {
        // Assign different sized thumnail photo per target
        let thumbnail;
        if (target == "#container") {
            thumbnail = photos[i].thumbFile;
        } else if (target == "#history") {
            thumbnail = photos[i].largeSqFile;
        }
        // HTML output
        htmlstr = `<figure data-full="${photos[i].file}" photo-index="${i}" photo-id="${photos[i].id}">
                <img src="${thumbnail}" alt="${photos[i].title}"><figcaption>${photos[i].title} - ${photos[i].date}</figcaption></figure>`;
        $(target).append(htmlstr);
    }
    // Assign click function to each figure element
    $("figure").each(function(index){
        $(this).click(function(){
            $("#modal-containter").css("display", "block");
            $("#modal-content").attr("src", $(this).attr("data-full"));
            $("#modal-caption").text($(this).find("figcaption").text());
            updateHistory($(this).attr("photo-index"), $(this).attr("photo-id"));
            console.log("clicked");
        });
    });
}

// Add and update viewed photos
function updateHistory(photoIndex, photoID) {
    // Find index in history array if already exists
    let existed = -1;
    let latestViewed;
    history.forEach(function(photo, index){
        if (photo.id == photoID) {
            existed = index;
            latestViewed = photo;
        }
        console.log(index);
    });
    if (existed >= 0) {
        history.splice(existed, 1); // remove
        console.log("existed");
    } else {
        latestViewed = photos[photoIndex];
        console.log("new");
    }

    history.unshift(latestViewed); // add at the start
    if (history.length > 5) history.pop(); // keep the array up to 5
    display(history, "#history");
}

// List places and define click function for each
function listPlaces(places) {
    let htmlstr = "";
    for (let i = 0; i < places.length; i++) {
        let keyword = places[i].keyword;
        htmlstr = `<li keyword="${keyword}">${places[i].place}</li>`;
        $("#categories").append(htmlstr);
    }
    $("li").each(function(){
        $(this).click(function(index){
            clear();
            // Get photos with keywords
            $.get(SEARCH_URL + $(this).attr("keyword"), function(data){
            let photoArray = data.photos.photo;
            fetchPhoto(photoArray);
            }, "json");
        });
    });
}