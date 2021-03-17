var apiclient = (function () {

    let defineBlueprint = function (author, name, points) {
        return {
            author: author,
            name: name,
            points: points
        };
    }

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

        createBlueprint: function (author, name, points) {
            let blueprint = defineBlueprint(author, name, points);

            let postPromise = $.ajax({
                url: "/blueprints",
                type: 'POST',
                data: JSON.stringify(blueprint),
                contentType: "application/json"
            }).fail(function (jqXHR, textStatus) {
                console.log("Error en el POST: " + jqXHR + " " + textStatus);
            });

            return postPromise;
        },

        updateBlueprint: function (author, name, points) {
            let blueprint = defineBlueprint(author, name, points);

            let putPromise = $.ajax({
                url: "/blueprints/" + author + "/" + name,
                type: 'PUT',
                data: JSON.stringify(blueprint),
                contentType: "application/json"
            }).fail(function (jqXHR, textStatus) {
                console.log("Error en el PUT: " + jqXHR + " " + textStatus);
            });

            return putPromise;
        },

        deleteBlueprint: function (author, name) {
            let deletePromise = $.ajax({
                url: "/blueprints/" + author + "/" + name,
                type: 'DELETE'
            }).fail(function (jqXHR, textStatus) {
                console.log("Error en el DELETE: " + jqXHR + " " + textStatus);
            });

            return deletePromise;
        }
    }
})();