var app = (function () {

    let authorName;
    let blueprints;
    let totalPoints;

    let api = apimock;
    // let api = apiclient;

    let drawBlueprint = function (author, bpname) {
        api.getBlueprintsByNameAndAuthor(bpname, author, function (err, res) {
            //Obtener los puntos
            console.log(res);
            let points = res.points;
            //Dibujar los puntos
            let canvas = $("#canvas")[0];
            let ctx = canvas.getContext("2d");

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
                ctx.moveTo(points[i].x, points[i].y);
            }
            ctx.stroke();

            $("#current-bp-text").html("Current blueprint: " + bpname);
        });
    };

    let getBlueprints = function (author) {
        authorName = author;
        totalPoints = 0;
        blueprints = [];

        api.getBlueprintsByAuthor(author, function (err, res) {
            getBlueprintsInfo(res);
            createTable();
        });
    };

    let getBlueprintsInfo = function (res) {
        for (let i = 0; i < res.length; i++) {
            let blueprint = {
                name: res[i].name,
                nPoints: res[i].points.length
            };
            totalPoints += blueprint.nPoints;
            blueprints.push(blueprint);
        }
    };

    let createTable = function () {
        let html = "";
        blueprints.forEach(bp => {
            html += "<tr>";
            html += "<td>" + bp.name + "</td>";
            html += "<td>" + bp.nPoints + "</td>";
            html += "<td><button class='btn btn-secondary' type='button' onclick='app.drawBlueprint(\"" +
                authorName + "\",\"" + bp.name + "\");'>Open</button></td>";
            html += "</tr>";
        });
        $("#table-title").html(authorName + "'s blueprints");
        $("#bp-table").html(html);
        $("#total-points").html("Total user points: " + totalPoints);
        // $("#current-bp-text").html("Current blueprint: " + )
    };

    let openBlueprint = function (name) {
        console.log("Open Blueprint: " + name);
    };

    let changeAuthorName = function (newName) {
        authorName = newName;
    };

    return {
        drawBlueprint: drawBlueprint,
        getBlueprints: getBlueprints,
        openBlueprint: openBlueprint,
        changeAuthorName: changeAuthorName,
    };
})();