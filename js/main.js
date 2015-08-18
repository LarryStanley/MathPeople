var peopleData;
var presentData = {nodes:[],edges:[]};
var previousPeople;
function searchResult() {
    $(".searchForm").fadeOut("slow", function(){
        $(".center").append("<h1 id='searching'>搜尋中...</h1>").fadeIn();
        engadgeSearch($("input").val());
    });
}

function engadgeSearch(input) {
    $.ajax({
        dataType: "json",
        url: "math.json",
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
    })
}


function searchPrevious(name) {
    console.log(name);
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
    console.log("yes");
    presentData.nodes.push({
        "id": people.name,
        "label": people.name,
        "x": x,
        "y": y,
        "size": 3
    });

    if (people.next.length > 0) {
        var firstX = x - (people.next.length - 1);
        $.each(people.next, function(index, value) {
            $.each(peopleData, function(key, relative) {
                if (relative.name == value) {
                    presentData.edges.push({
                        "id" : people.name + "-" + relative.name,
                        "source" : people.name,
                        "target" : relative.name
                    });
                    drawData(firstX + index, y + 1, relative);
                }
            });
        });
    }else
        showResult();
}

function showResult() {
    $("#searching").fadeOut("slow", function(){
        $("#searching").remove();
        var string = "<div class='result' id='result'>";
        string = string + '<button class="btn btn-default right" onclick="backToSearch()">重新查詢</button>'
        string = string + "</div>";
        $(".center").append(string).fadeIn();
        console.log(JSON.stringify(presentData));
        sigma.parsers.json( JSON.stringify(presentData), {
            container: 'result',
            settings: {
                defaultNodeColor: '#ec5148'
            }
        });
    });
}
function backToSearch() {
    $(".result").fadeOut("slow", function() {
        $(".result").remove();
        $(".searchForm").fadeIn("slow");
    });
}
