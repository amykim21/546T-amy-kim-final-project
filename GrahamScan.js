// https://www.freecodecamp.org/news/learn-d3-js-in-5-minutes-c5ec29fb0725/
// import * as d3 from "d3"; // not necessary it seems

d3.select('h3').style('color', 'blue');
d3.select('h3').style('font-size', '24px');

/* https://www.tutorialsteacher.com/d3js/function-of-data-in-d3js
Took the skeleton of how to make a function in V3
*/

var points = [];
var x;
var y;
const cr = 5;

var width = 500;
var height = 500;

/* https://www.tutorialsteacher.com/codeeditor?cid=d3-37
Skeleton for appending a circle to an svg element
*/
//Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("style", "border:1px solid #000000;");


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




    const x1 = d3.mouse(this)[0];
    const y1 = d3.mouse(this)[1];


    var x2 = x1;
    var y2 = y1;

    if(points.length > 1) {
        x2 = points[points.length-2].x;
        y2 = points[points.length-2].y;
    }
    console.log(points);

    svg.append("line")
    .style("stroke", "black")
    .style("stroke-width", 5)
    .attr("x1", x1)
    .attr("y1", y1)
    .attr("x2", x2)
    .attr("y2", y2);
});

// d3.select("svg")
//     .on("click", function() {
//         const x1 = d3.mouse(this)[0];
//         const y1 = d3.mouse(this)[1];

//         const x2 = points[points.length-1].x;
//         const y2 = points[points.length-1].y;

//         console.log(points);

//         svg.append("line")
//         .attr("x1", x1)
//         .attr("y1", y1)
//         .attr("x2", x2)
//         .attr("y2", y2);
//     });

