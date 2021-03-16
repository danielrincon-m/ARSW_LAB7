var apiclient = (function () {
    return {
        getBlueprintsByAuthor: function (author, callback) {
            $.get("/blueprints/" + author, function (data) {
                callback(null, data);
            }).fail(function () {
                alert("error");
            });
        },

        getBlueprintsByNameAndAuthor: function (name, author, callback) {
            $.get("/blueprints/" + author + "/" + name, function (data) {
                callback(null, data);
            }).fail(function () {
                alert("error");
            });
        },

        updateBlueprint: function (author, name, points) {
            let blueprint = {
                author: author,
                name: name,
                points: points
            };
            console.log("/blueprints/" + author + "/" + name);
            $.ajax({
                url: "/blueprints/" + author + "/" + name,
                type: 'PUT',
                data: JSON.stringify(blueprint),
                contentType: "application/json",
                async: false
            }).done(function (msg) {
                console.log("INSERTÓ " + msg);
            }).fail(function (jqXHR, textStatus) {
                console.log("Error: " + jqXHR + " " + textStatus);
            });
        }
    }
})();