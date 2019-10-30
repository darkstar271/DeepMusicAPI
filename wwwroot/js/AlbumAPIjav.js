//run the LoadTable function when the page has loaded
$(document).ready(function () {
    LoadTable();
});


const uri = "/api/AlbumsAPI"; //the api as a global variable and URL of the api, this one is for localhost
// alert("API " + uri);
let allalbum = null; //holds the data in a global,  the Global variable is not the same as the ID
//Loads up the <p id="counter"> </p> with a count of the staff, data come from the LoadTable Function where this is called
function getCount(data) {
    // alert("getcount " + datas);
    const theCount = $("#counter"); //bind TheCount to the counter
    if (data) { //if any data exists
        // alert("We have data " + data);
        theCount.text("There are " + data + " Albums");
    } else {
        theCount.text("There are no Albums");
        alert("No data");
    }
}
//this function reloads the table of staff after any changes
function LoadTable() {
    $.ajax({
        type: "GET", //use the GET controller
        url: uri, //the uri from the global
        cache: false, //don't cache the data in browser reloads, get a fresh copy
        success: function (data) { //if the request succeeds ....
            const tBody = $("#allAlbums"); //for the tbody bind with allAlbums <tbody id="allAlbums"></tbody>
            allalbum = data; //pass in all the data to the global allAlbums use it in Edit
            $(tBody).empty(); //empty out old data
            getCount(data.length); //count for the counter function
            //a foreach through the rows creating table data
            $.each(data,// this is a for each loop
                function (key, item) {
                    const tr = $("<tr></tr>")
                        .append($("<td></td>").text(item.artistName)) // the colums name in data base, changed from "artistName" to "ArtistName"
                        .append($("<td></td>").text(item.track)) //inserts content in the tags,    changed from "track" to "Track"
                        .append($("<td></td>").text(item.genre))//  changed from "genre" to "Genre"
                        .append($("<td></td>")
                            .append($("<button>Edit</button>")
                                .on("click",
                                    function () {
                                        editItem(item.album_ID);// Album_ID, changed from "item.id" to "Album_ID"
                                    }) //in the empty cell append in an edititem button
                            )
                        )
                        .append(
                            $("<td></td>").append(
                                $("<button>Delete</button>").on("click",
                                    function () {
                                        deleteItem(item.album_ID);// Album_ID, changed from "item.id" to "Album_ID"
                                    })//in an empty cell add in a deleteitem button
                            )
                        );
                    tr.appendTo(tBody);//add all the rows to the tbody
                });
        }
    });
}
//Add an Album to the database
function addItem() {
    const item = {
        artistName: $("#add-ArtistName").val(),
        track: $("#add-track").val(),
        genre: $("#add-genre").val()
    };
    $.ajax({
        type: "POST", //this calls the POST in the API controller
        accepts: "application/json",
        url: uri,
        contentType: "application/json",
        data: JSON.stringify(item),
        //if there is an error
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Something went wrong!");
        },
        //if it is successful
        success: function (result) {
            LoadTable();
            $("#add-ArtistName").val(""); //clear entry boxes
            $("#add-track").val("");
            $("#add-genre").val("");
            alert("album added successfully");
        }
    });
}
//Delete a person from the database
function deleteItem(id) {
    alert("delete " + id);// this just sends to screen information on what value "id"
    $.ajax({
        url: uri + "/" + id, //add the ID to the end of the URI
        type: "DELETE", //this calls the DELETE in the API controller
        success: function (result) {
            LoadTable();
        }
    });
}
//click event for edit button to load details into form. Go through each entry held in allStaff and add in the one that matches the id from the click
// e.g , here "#edit-artistName" matches AlbumAPI.cshtml    id = "edit-artistName"
function editItem(id) {
    alert("edit " + id);// this just sends to screen information on what value "id"
    $.each(allalbum,
        function (key, item) {
            if (item.album_ID === id) {//where the ID == the one on the click
                $("#edit-artistName").val(item.artistName); //add it to the form field
                $("#edit-id").val(item.album_ID);// item.album_ID must be the same as item.album_ID === id
                //  alert("item.id " + item.album_ID);// this just sends to screen information on what value "id"
                $("#edit-track").val(item.track);
                $("#edit-genre").val(item.genre);
            }
        });
}

$(".my-form").on("submit", //Save());//saving the edit to the db
    function () {
        alert(`submit ${$("#edit-artistName").val()}`); // this just sends to screen information on what value "id"
        const item = { //pass all the data on the form to a variable called item use later to send to server
            artistName:
                $("#edit-artistName")
                    .val(), // each one of these must match up with the database column names, i.e artistName: and column "artistName" on the table
            track: $("#edit-track").val(),
            genre: $("#edit-genre").val(),
            album_ID: $("#edit-id").val()
        };
        alert("Saving ... " + item.album_ID + " " + item.artistName + " " + item.track + " " + item.genre);
        $.ajax({
            url: uri + "/" + $("#edit-id").val(), //add the row id to the uri
            type: "PUT", //send it to the PUT controller
            accepts: "application/json",
            contentType: "application/json",
            data: JSON.stringify(item), //take the item data and pass it to the server data is moved to server
            success: function (result) {
                LoadTable(); //load the table afresh
            }
        });
        return false;
    });
