var peopleData;
var presentData = {nodes:[],edges:[]};
var previousPeople;
var searching = [];
var distance = 12;
var autocompleteData = [];
function searchResult() {
    $(".searchForm").fadeOut("slow", function(){
        $(".center").append("<h1 id='searching'>搜尋中...</h1>").fadeIn();
        engadgeSearch($("input").val());
    });
}

function engadgeSearch(input) {
    $.ajax({
        dataType: "json",
        url: "math.new.json",
        success: function(data) {
            peopleData = data.data;
            var i;
            for (i = 0; i < peopleData.length; i++) {
                if (input == peopleData[i].name) {

                    break;
                }
            }

            if (i == peopleData.length){
                $("#searching").fadeOut("slow", function(){
                    $("#searching").remove();
                    $(".center").append("<div class='result'><h1>查詢失敗...</h1></div>").fadeIn();
                    backToSearch();
                });
            }
            if (peopleData[i].previous) {
                searchPrevious(peopleData[i].previous);
            } else {
                drawData(0, 0, peopleData[i]);
            }
            
        }
    });
}


function searchPrevious(name) {
    console.log("search previous " + name);
    $.each(peopleData, function(index, value) {
        if (value.name == name) {
            if (value.previous)
                searchPrevious(value.previous);
            else
                drawData(0, 0, value);
            return false;
        }
    });
}

function drawData(x,y, people) {
    presentData.nodes.push({
        "id": people.name,
        "label": people.name,
        "x": x,
        "y": y,
        "size": 10,
        "color": '#94B8B5'
    });
    var peopleIndex = searching.indexOf(people.name);
    if (peopleIndex >= 0)
        searching.splice(peopleIndex, 1);

    if (people.next.length > 0) {
        $.extend( searching, people.next);
        if (people.next.length > 1)
            distance -= 3;
        $.each(people.next, function(index, value) {
            $.each(peopleData, function(key, relative) {
                if (relative.grade > people.grade) {
                    if (relative.name == value) {
                        console.log("peopel "+relative.name);
                        presentData.edges.push({
                            "id" : people.name + "-" + relative.name,
                            "source" : people.name,
                            "target" : relative.name
                        });
                        var firstX = x - (people.next.length - 1)*distance/2;
                        drawData(firstX + index * distance, y + 5, relative);
                    }
                }
            });
        });
    }else{
        if (searching.length == 0)
            showResult();
    }
}

function showResult() {
    $("#searching").fadeOut("slow", function(){
        $("#searching").remove();
        var string = "<div class='result' id='result'>";
        string = string + "</div>";
        $(".container").append(string).fadeIn();
        s = new sigma({ 
            graph: presentData,
            container: 'result',
            settings: {
                defaultNodeColor: '#ec5148',
                defaultLabelColor: '#FFFFFF',
                doubleClickEnabled: false,
                mouseEnabled: false
            }
        });
        $(".container").append("<button id='research' class='btn btn-default pull-right' onclick='backToSearch()'>重新查詢</button>")
    });
}
function backToSearch() {
    presentData = {nodes:[],edges:[]};
    $(".result").fadeOut("slow", function() {
        $(".result").remove();
        $("#research").remove();
        $(".searchForm").fadeIn("slow");
    });
}

$(document).ready(function() {
    $.ajax({
        dataType: "json",
        url: "math.json",
        success: function(data) {
            $.each(data.data, function(index, value) {
                autocompleteData.push({value: value.name, data: data.name});
            });
            $('input').autocomplete({
                lookup: autocompleteData,
                onSelect: function (suggestion) {
                    $("input").val(suggestion.value);
                    searchResult();
                }
            });
        }
    });
});

$(document).keypress(function(e) {
    if(e.which == 13) {
        searchResult();
    }
});