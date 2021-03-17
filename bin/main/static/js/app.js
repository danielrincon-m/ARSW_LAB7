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
            if (selectedBlueprint != undefined) {
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

    let getBlueprints = function (author, clearCnvs) {
        api.getBlueprintsByAuthor(author, function (err, res) {
            if (res != undefined) {
                authorName = author;
                totalPoints = 0;
                blueprints = [];

                getBlueprintsInfo(res);
                createTable();
                if (clearCnvs) {
                    clearCanvas();
                }
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

    let clearCanvas = function () {
        $("#current-bp-text").html("Current blueprint:");
        let canvas = $("#myCanvas")[0];
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        selectedBlueprint = null;
    }

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

    let createNewBlueprint = function () {
        if (authorName != undefined) {
            let bpName = prompt("Por favor, escriba el nombre del plano:", "Cookie");
            if (bpName != undefined && bpName != "") {
                clearCanvas();
                points = [];
                selectedBlueprint = bpName;
                $("#current-bp-text").html("Current blueprint: " + selectedBlueprint);
            }
        }
    }

    let blueprintExists = function (name) {
        let blueprint = blueprints.find(function (blueprint) {
            return blueprint.name == name
        });
        return blueprint != undefined;
    }

    let updateBlueprint = function () {
        if (selectedBlueprint != undefined) {
            if (blueprintExists(selectedBlueprint)) {
                api.updateBlueprint(authorName, selectedBlueprint, points).then(function () {
                    getBlueprints(authorName, false);
                });
            } else {
                api.createBlueprint(authorName, selectedBlueprint, points).then(function () {
                    getBlueprints(authorName, false);
                });
            }
        }
    }

    let deleteBlueprint = function () {
        if (authorName != undefined && selectedBlueprint != undefined) {
            api.deleteBlueprint(authorName, selectedBlueprint).then(function () {
                getBlueprints(authorName, true);
            });
        }
    }

    return {
        init: init,
        drawBlueprint: drawBlueprint,
        getBlueprints: getBlueprints,
        updateBlueprint: updateBlueprint,
        createNewBlueprint: createNewBlueprint,
        deleteBlueprint: deleteBlueprint,
    };
})();