// https://www.freecodecamp.org/news/learn-d3-js-in-5-minutes-c5ec29fb0725/
// import * as d3 from "d3"; // not necessary it seems
// import * as d3 from "./node_modules/d3";
// import * as d3 from "https://cdn.skypack.dev/d3@7";
// import { sort } from "d3";
// import * as d3 from "https://d3js.org/d3.v4.min.js";

// d3.select('h3').style('color', 'blue');
// d3.select('h3').style('font-size', '24px');
// d3.select('div').style('display', 'inline-block');

/* https://www.tutorialsteacher.com/d3js/function-of-data-in-d3js
Took the skeleton of how to make a function in V3
*/

var points = [];
var dualLines = []; // dual plane version of points

// var stack = [];
var x;
var y;
const cr = 5; // point radius, in pixels

var width = 500;
var height = 500;

/* https://www.tutorialsteacher.com/codeeditor?cid=d3-37
Skeleton for appending a circle to an svg element
*/
//Create SVG element
var svg = d3.select("body")
// var svg = d3.select("gs")
            .append("svg")
            .attr("class", "gs")
            .attr("id", "gsSVG")
            .attr("width", width)
            .attr("height", height)
            .attr("style", "border:1px solid #000000;");
            // .attr("display", "inline-block");

var dualSvg = d3.select("body")
// var dualSvg = d3.select("dp")
                .append("svg")
                .attr("class", "dp")
                .attr("id", "dpSVG")
                .attr("width", width)
                .attr("height", height)
                .attr("style", "border:1px solid #000000;");
                // .attr("display", "inline-block");


// var gsButton = d3.select("gsButton")
//                 .on("onclick", function() {
//                     console.log("button clicked");
//                 });

document.getElementById("gsButton").addEventListener("click", function() {
    console.log("gsButton clicked");

    const lowerH = lowerHull();
    console.log(lowerH);
    for(var i = 0; i < lowerH.length-1; i++) {
        // draw lines between lower hull points, left to right
        drawLine(lowerH[i].x, lowerH[i].y, lowerH[i+1].x, lowerH[i+1].y);
    }

    const upperH = upperHull();
    console.log(upperH);
    for(var i = 0; i < upperH.length-1; i++) {
        // draw lines between lower hull points, left to right
        drawLine(upperH[i].x, upperH[i].y, upperH[i+1].x, upperH[i+1].y);
    }

});

document.getElementById("resetButton").addEventListener("click", function() {
    console.log("resetButton clicked");

    svg.selectAll("*").remove();

    points = [];
});



d3.select("svg")
    .on("click", function() {
    var xy = d3.mouse(this);
    // console.log(xy); // x and y coordinates; (0, 0) is top left
    x = xy[0];
    y = xy[1];

    points.push({x: x, y: y});
    
    // draw point
    svg.append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", cr);

    // draw dual line
    var line = convertToDualLine(x, y);
    drawDualLine(line);


    const x1 = d3.mouse(this)[0];
    const y1 = d3.mouse(this)[1];


    var x2 = x1;
    var y2 = y1;

    if(points.length > 1) {
        x2 = points[points.length-2].x;
        y2 = points[points.length-2].y;
    }
    console.log(points);

    // drawLine(x1, y1, x2, y2);

    // svg.append("line")
    // .attr("class", "dashed")
    // .style("stroke-dasharray", ("10, 10")) // adding this line makes it dashed
    // // means 5 pixels draw, 5 pixels off
    // .style("stroke", "black")
    // .style("stroke-width", 5)
    // .attr("x1", x1)
    // .attr("y1", y1)
    // .attr("x2", x2)
    // .attr("y2", y2);
});

function drawDualLine(coords) {
    dualSvg.append("line")
        .style("stroke", "black")
        .style("stroke-width", 5)
        .attr("x1", coords[0])
        .attr("y1", coords[1])
        .attr("x2", coords[2])
        .attr("y2", coords[3]);
}

function drawLine(x1, y1, x2, y2) {
    svg.append("line")
        .style("stroke", "black")
        .style("stroke-width", 5)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2);
}

function drawDashedLine(x1, y1, x2, y2) {
    svg.append("line")
        .attr("class", "dashed")
        .style("stroke-dasharray", ("10, 10")) // adding this line makes it dashed
        // means 5 pixels draw, 5 pixels off
        .style("stroke", "black")
        .style("stroke-width", 5)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2);
}

// function det(M) {
//     var d = 0;

//     return d;
// }

/*
if orient() < 0, then it is a right turn
if orient() > 0, then it is a left turn
if orient() = 0, then straight
*/
function orient(p, q, r) {
    const M = [
        [1, 1, 1],
        [p.x, q.x, r.x],
        [p.y, q.y, r.y]
    ];
    var det = (q.x * r.y - r.x * q.y) - (p.x * r.y - r.x * p.y) + (p.x * q.y - q.x * p.y);

    return det;
    // return math.det(M); // ERROR: Math.det not a function
    // GrahamScan.js:136 Uncaught ReferenceError: math is not defined
}

function upperHull() {
    var stack = []; // will contain convex hull
    var sorted = Array.from(points); // make copy

    // sort points by x-coordinate
    sorted.sort((a, b) => {
        return (a.x-b.x);
    });

    if(sorted.length > 1) {
        stack.push(sorted[0]);
        stack.push(sorted[1]);
    } else {
        console.log("need more points for convex hull");
        return stack;
    }

    for(var i = 2; i < sorted.length; i++) {
        const point = sorted[i];
        console.log(orient(stack[stack.length-2], stack[stack.length-1], point));
        while(stack.length > 1 && orient(stack[stack.length-2], stack[stack.length-1], point) < 0) {
            stack.pop();
        }
        stack.push(point);
    }

    return stack;
}

function lowerHull() {
    var stack = []; // will contain convex hull
    var sorted = Array.from(points); // make copy

    // sort points by x-coordinate
    sorted.sort((a, b) => {
        return (a.x-b.x);
    });

    if(sorted.length > 1) {
        stack.push(sorted[0]);
        stack.push(sorted[1]);
    } else {
        console.log("need more points for convex hull");
        return stack;
    }

    for(var i = 2; i < sorted.length; i++) {
        const point = sorted[i];
        console.log("lowerHull orient: " + orient(stack[stack.length-2], stack[stack.length-1], point));
        while(stack.length > 1 && orient(stack[stack.length-2], stack[stack.length-1], point) > 0) {
            stack.pop();
        }
        stack.push(point);
    }

    return stack;
}




// -----------------------------------Dual Plane----------------------------------------------

function convertToDualLine(p, q) {
    // ---note: SVG's grid has (0, 0) on the upper left; y axis flipped
    // var slope = p;
    // var yIntercept = -1 * q;
    var a1 = 0;
    var b1 = 0; // from bottom of the svg box; b1 = 0 stays the same
    var a2 = width;
    var b2 = 0;//height; // to top of the svg box; b2 = height stays the same

    // calculate a
    // a1 = (b1 - q) / p;
    // a2 = (b2 - q) / p;

    // calculate b
    b1 = a1 * p + q;
    b2 = a2 * p + q;

    var line = [a1, b1, a2, b2];

    // dualLines.push(line);

    return line;
}


