var app = (function () {

    let authorName;
    let selectedBlueprint;
    let points;
    let blueprints;
    let totalPoints;

    // let api = apimock;
    let api = apiclient;

    let init = function () {
        let canvas = $("#myCanvas")[0];
        if (window.PointerEvent) {
            canvas.addEventListener("pointerdown", draw, false);
        }
        else {
            //Provide fallback for user agents that do not support Pointer Events
            canvas.addEventListener("mousedown", draw, false);
        }

        // Event handler called for each pointerdown event:
        function draw(event) {
            if (selectedBlueprint != null) {
                let canvas = $("#myCanvas")[0];
                let coords = getMousePos(canvas, event);
                // api.addPoint(authorName, selectedBlueprint, coords);
                points.push(coords);
                // drawBlueprint(selectedBlueprint);
                drawPoints();
            }
        }

        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
    }

    let getBlueprints = function (author) {
        api.getBlueprintsByAuthor(author, function (err, res) {
            if (res != undefined) {
                authorName = author;
                totalPoints = 0;
                blueprints = [];

                getBlueprintsInfo(res);
                createTable();
            } else {
                alert("No existe el autor!");
            }
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
            html += "<td><button class='btn btn-secondary' type='button' onclick='app.drawBlueprint(\"" + bp.name + "\");'>Open</button></td>";
            html += "</tr>";
        });
        $("#table-title").html(authorName + "'s blueprints");
        $("#bp-table").html(html);
        $("#total-points").html("Total user points: " + totalPoints);
        // $("#current-bp-text").html("Current blueprint: " + )
    };

    let drawBlueprint = function (bpname) {
        selectedBlueprint = bpname;
        api.getBlueprintsByNameAndAuthor(bpname, authorName, function (err, res) {
            //Obtener los puntos
            points = Array.from(res.points);
            drawPoints();
            $("#current-bp-text").html("Current blueprint: " + bpname);
        });
    };

    let drawPoints = function () {
        //Dibujar los puntos
        let canvas = $("#myCanvas")[0];
        let ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
            ctx.moveTo(points[i].x, points[i].y);
        }
        ctx.stroke();
    }

    let updateBlueprint = function () {
        api.updateBlueprint(authorName, selectedBlueprint, points);
        console.log("Terminó la función");
        getBlueprints(authorName);
    }

    return {
        init: init,
        drawBlueprint: drawBlueprint,
        getBlueprints: getBlueprints,
        updateBlueprint: updateBlueprint,
    };
})();