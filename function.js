var peopleData;
var presentData;
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
            data = undefined;
            var inputNameData;
            for (i = 0; i < peopleData.length; i++) {
                if (input == peopleData[i].name) {
                    inputNameData = peopleData[i];
                    presentData = [inputNameData];
                    break;
                }
            }
            if (inputNameData.next)
                searchNext(inputNameData.next);
        }
    })
}

function searchNext(name) {
    var data;
    for (i = 0; i < peopleData.length; i++) {
        if (name == peopleData[i].name) {
            data = peopleData[i];
            presentData.push(data);
            break;
        }
    }

    if (data.next == ""){
        if (presentData[0].previous.length)
            searchPrevious(presentData[0].previous)
        else
            sortPeople();
    }else
        searchNext(data.next);
}

function searchPrevious(name) {
    var data;
    for (i = 0; i < peopleData.length; i++) {
        if (name == peopleData[i].name) {
            data = peopleData[i];
            presentData.push(data);
            break;
        }
    }
    if (data.previous.length){
        searchPrevious(data.previous);
    }else
        sortPeople();
}

function sortPeople() {
    for (i = 0; i < presentData.length; i++) {
        for (j = 0; j < presentData.length - i - 1; j++) {
            if (presentData[j].grade > presentData[j+1].grade) {
                tempItem = presentData[j];
                presentData[j] = presentData[j+1];
                presentData[j+1] = tempItem;
            }
        }
    }
    showResult();
}

function showResult(input) {
    $("#searching").fadeOut("slow", function(){
        $("#searching").remove();
        var string = "<div class='result'>";
        for (i = 0; i < presentData.length; i++) {
            data = presentData[i];
            string = string + "<span class='grade" + data.grade + " name'>" + data.name + "</span>";
            if (i + 1 != presentData.length)
                string = string + "－";
        }
        string = string + '<button class="btn btn-default right" onclick="backToSearch()">重新查詢</button>'
        string = string + "</div>";
        $(".center").append(string).fadeIn();
    });
}

function backToSearch() {
    $(".result").fadeOut("slow", function() {
        $(".result").remove();
        $(".searchForm").fadeIn("slow");
    });
}
