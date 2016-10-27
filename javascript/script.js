$(document).ready(function(){    
    // Toggles on/off the content of each entry
    
    var defaultData = [
                "<article>" +
                "<h2>Welcome to My Diary!!!!</h2>"              +
                "<div class='date'>Tue Mar 17 01:05 1977</div>" +
                "<p>There are currently no entries in this diary, but go ahead and add one — it will be AWESOME!!!</p>" +
                "</article>"
            ];
    
    var defaultData2 = '[{"subject": "Welcome to my Diary!!!",' +
        '"body": "There are currently no entries in this diary, but go ahead and add one — it will be AWESOME!!!"}]';
    
    $("section").on("click", "div", function() {
        $(this).toggleClass('selected');
        $(this).next('p').slideToggle(300);
    })
        
    $('a').click(function(){
        $('#addTextForm').parent().show();
        determineLocation();
        $('input').focus();
    });
    
    $('#submit').click(function(){
        submitEntry();
        //$('a').show();
        $('#addTextForm').parent().hide();
    })
    
    $('#cancel').click(function(){
        $('a').show();
        $('#addTextForm').parent().hide();
    })
    
    $("section").on("click", "img", function(evnt) {
        var li = $(this).parents('li');
        var current = localStorage.getItem('data');
        var parsed = JSON.parse(current);
        console.log(li.index());
        parsed.splice(li.index(), 1);
        li.remove();
        localStorage.setItem('data', JSON.stringify(parsed));
    })
    
    
    function showEntries() {
        //localStorage.clear();
        var data = localStorage.getItem('data');
        if (data) {
            data = JSON.parse(data);
            var $posts = $('#posts');
            $posts.empty();
            $.each(data, function(i, post){
                var li = '<li></li>';
                var article = '<article class="entry"></article>';
                var div = '<div class="entry"></div>';
                var h2 = '<h2></h2>';
                var img = '<img src="../images/remove.png"></img>';
                var span = '<span class="location"></span>'
                var parf = '<p></p>';
                var $li = $(li);
                var $article = $(article);
                var $h2 = $(h2);
                var $div = $(div);
                $(h2).text(post.subject).appendTo($div);
                $(img).appendTo($div);
                $(span).text(post.location).appendTo($div);
                $div.appendTo($article);
                $(parf).text(post.body).appendTo($article);
                $article.appendTo($li);
                $li.appendTo($posts);
            })
        }else{
            data = JSON.parse(defaultData2);
            var $posts = $('#posts');
            $posts.empty();
            $.each(data, function(i, post){
                var article = '<article class="entry"></article>';
                var h2 = '<h2></h2>';
                var parf = '<p class="default"></p>';
                var $article = $(article);
                $(h2).text(post.subject).appendTo($article);
                $(parf).text(post.body).appendTo($article);
                $article.appendTo($posts);
            })
        }
        
    }
    
    function submitEntry() {
        var subject = $("#addTextForm input").val();
        if (!subject) {
            alert("Subject is required");
            return;
        }
        var body = $("#addTextForm textarea").val();
        if (!body) {
            alert("Body is required");
            return;
        }
        
        var location = $("#geoLocation").text();
        addEntry(subject, body, location);
        resetEntryForm();
        showEntries();
    }
    
        
    function addEntry(subject, body, location) {
        console.log("Adding an entry");
        var current;
        
        if(localStorage.getItem('data') != null){
            var data = localStorage.getItem('data');
            current = JSON.parse(data);
        }else {
            current = [];
        }
        
        var entry = {};
        entry.location = location;
        entry.subject = subject;
        entry.body = body;
        current.unshift(entry);
        localStorage.setItem("data", JSON.stringify(current));
    }
    

    function resetEntryForm() {
        $("#addTextForm input").val("");
        $("#addTextForm textarea").val("");
        $("#addTextForm").parent().hide();
    }
    
    function determineLocation (){
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position){
                    console.log(position);
                    var date = moment().format('MMM Do YYYY, hh:mm:ss a');
                    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    var geocoder = new google.maps.Geocoder();
                    return geocoder.geocode({'latLng': latlng}, function(results, status){
                        if(status === "OK"){
                            var city = results[0].address_components[4].short_name;
                            $('#geoLocation').text("at " + city + " on " + date);
                        } else {
                            throw "Geocoder failed due to: " + status;
                        }
                    });
                },
                function (error) {
                  switch(error.code) {
                    case error.PERMISSION_DENIED:
                      throw "User denied the request for Geolocation.";
                      break;
                    case error.POSITION_UNAVAILABLE:
                      throw "Location information is unavailable.";
                      break;
                    case error.TIMEOUT:
                      throw "The request to get user location timed out.";
                      break;
                    case error.UNKNOWN_ERROR:
                      throw "An unknown error occurred.";
                      break;
                    }
                },
                {maximumAge:0} //Max old age to get it from cache
            )
        }
    }
    
    $(showEntries());
})