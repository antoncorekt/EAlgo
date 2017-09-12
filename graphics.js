

class GraphicsEngine {



    constructor() {
        this.model = new Model(-20, 20, 300, 10);

        this.data = this.model.process();

        console.log(this.data);


    }

    f() {
        var x = document.getElementById("myRange");
        x.defaultValue = 0;
        x.min = 0;
        x.max = this.data.time_line.length-1;



        var self = this;
        self.init(0);

        $(document).ready(function (e) {
            $("#myRange").on("input change", function () {
                console.log("update " + this.value);



                self.update(this.value);



            });
        });
    }

    update(num) {
        var w = window.innerWidth;
        var h = window.innerHeight;
        var padding = 20;

        var dataset = [];

        console.log(this.data);

        for (let i = 0; i < this.data.time_line[num].length; i++) {
            let t = [];
            t.push(this.data.time_line[num][i].x);
            t.push(Util.f(this.data.time_line[num][i]));
            //t.push(0);
            dataset.push(t);
        }

        var xScale = d3.scaleLinear()
            .domain([-20, 20])
            .range([padding, w - padding * 2]);

        var yScale = d3.scaleLinear()
            .domain([-20, 20])
            .range([h - padding, padding]);

        /* d3.select('svg')
             .selectAll('circle')
             .attr("fill", "steelblue")
             .attr('cx',function (d) {
                 return xScale(d[0]);
             })          // position the circle at 40 on the x axis
             .attr('cy', function (d) {
                 return yScale(d[1]);
             }) // position the circle at 250 on the y axis
             .transition()             // apply a transition
             .ease(d3.easeLinear)           // control the speed of the transition
             .duration(4000) 
                     // apply it over 2000 milliseconds
                     .attr('cx',function (d) {
                         return xScale(d[0]);
                     })          // position the circle at 40 on the x axis
                     .attr('cy', function (d) {
                         console.log("->>>>>" + d);
                         return yScale(d[1]+5);
                     }); */


        d3.select('svg')
            .selectAll('circle')
            .remove();

        d3.select('svg')
            .selectAll('circle')
            .attr("fill", "steelblue")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return xScale(d[0]);
            })
            .attr("cy", function (d) {
                return yScale(d[1]);
            })
            .attr("r", function (d) {
                return 3;
            });


    }

    init(num) {

        console.log("sds" + num);

        var w = window.innerWidth;
        var h = window.innerHeight;
        var padding = 20;

        var dataset = [];

        console.log(this.data);

        for (let i = 0; i < this.data.time_line[num].length; i++) {
            let t = [];
            t.push(this.data.time_line[num][i].x);
            t.push(Util.f(this.data.time_line[num][i]));
            //t.push(0);
            dataset.push(t);
        }



        // this.data.time_line[0].forEach((x)=>dataset.push([x, x]));

        //Create scale functions
        var xScale = d3.scaleLinear()
            .domain([-20, 20])
            .range([padding, w - padding * 2]);

        var yScale = d3.scaleLinear()
            .domain([-20, 20])
            .range([h - padding, padding]);

        var rScale = d3.scaleLinear()
            .domain([0, 5])
            .range([2, 5]);

        //Define X axis
        var xAxis = d3.axisBottom()
            .scale(xScale);

        //Define Y axis
        var yAxis = d3.axisLeft()
            .scale(yScale);

        //Create SVG element
        var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        //Create circles
        svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return xScale(d[0]);
            })
            .attr("cy", function (d) {
                return yScale(d[1]);
            })
            .attr("r", function (d) {
                return rScale(1);
            });

        //Create labels
        /* svg.selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .text(function(d) {
                    return d[0] + "," + d[1];
            })
            .attr("x", function(d) {
                    return xScale(d[0]);
            })
            .attr("y", function(d) {
                    return yScale(d[1]);
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "red");*/


        //Create X axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (h / 2) + ")")
            .call(xAxis);


        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + (w / 2) + ", 0)")
            .call(yAxis);

    }

}

//export default new GraphicsEngine();

new GraphicsEngine().f();