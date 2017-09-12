

class GraphicsEngine {


    // [left ; right] - область допустимых значений
    // count - размер популяции
    // proc - шанс мутации
    // [xL ; xR] - ось X
    // [yB ; yT] - ось Y
    constructor(left, right, count, proc, chance, xL, xR, yB, yT) {

        this.left = left;
        this.right = right;
        this.count = count;
        this.proc = proc;
        this.chance = chance;
        this.xL = xL;
        this.xR = xR;
        this.yB = yB;
        this.yT = yT;

        this.model = new Model(left, right, count, proc, chance);

        this.data = this.model.process();

        console.log(this.data);


    }

    f() {
        var x = document.getElementById("myRange");
        x.defaultValue = 0;
        x.min = 0;
        x.max = this.data.time_line.length - 1;



        var self = this;
        self.init(0);

        $(document).ready(function (e) {

            let fun = function (oper){
                
                self.update($("input[type=range]").val());
                let val = $("input[type=range]").val();
                $("#popul").text("Count populations: " + self.data.time_line[val].length);
                let child = 0, sum=0, mut=0;
                self.data.time_line[val].forEach((x)=>{sum+=Util.f(x);if(x.child)child++;if(x.mut)mut++;});
                $("#new_child").text("New child in epoch: " + child);
                $("#best_res").text("Best result in epoch: " + self.model.getBestResult(self.data.time_line[val]) );
                $("#aver_res").text("Average result in epoch: " + sum/self.data.time_line[val].length );
                $("#mutat").text("Mutation: " + mut );
            }

            $(document).on('keypress', function (e) {

                if (e.originalEvent.code == "ArrowRight" && !$(':focus').length) {
                    $("input[type=range]").val(Number.parseInt($("input[type=range]").val()) + 1);
                    self.update($("input[type=range]").val());
                    $("#epoch").text("Epoch: " + $("input[type=range]").val());
                    fun();
                }

                if (e.originalEvent.code == "ArrowLeft" && !$(':focus').length) {
                    $("input[type=range]").val(Number.parseInt($("input[type=range]").val()) - 1);
                    self.update($("input[type=range]").val());
                    $("#epoch").text("Epoch: " + $("input[type=range]").val());
                    fun();
                }
            });

            $("#myRange").on("input change", function () {
               
               
                $("#epoch").text("Epoch: " + $("input[type=range]").val());
                
                fun();

            });

            
        });
    }

    update(num) {
        var w = window.innerWidth - document.getElementsByClassName("panel")[0].offsetWidth;
        var h = window.innerHeight;
        var padding = 20;

        var dataset = [];

        console.log(this.data);


        for (let i = 0; i < this.data.time_line[num].length; i++) {
            let t = [];
            t.push(this.data.time_line[num][i].x);
            t.push(Util.f(this.data.time_line[num][i]));
            t.push(this.data.time_line[num][i]);
            //t.push(0);
            dataset.push(t);
        }

        var xScale = d3.scaleLinear()
            .domain([this.xL, this.xR])
            .range([padding, w - padding * 2]);

        var yScale = d3.scaleLinear()
            .domain([this.yB, this.yT])
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
            .data(dataset)
            .enter()
            .append("circle")
            .attr("fill", function (d) {
                //console.log(d[3])
                if (d[2].child) {
                    return "green";
                }

                if (d[2].die) {
                    return "magenta";
                }

                if (d[2].best) {
                    return "red";
                }

                return "black";
            })
            .attr("cx", function (d) {
                return xScale(d[0]);
            })
            .attr("cy", function (d) {
                return yScale(d[1]);
            })
            .attr("r", function (d) {
                if (d[2].die) {
                    return 2;
                }

                if (d[2].child) {
                    return 4;
                }

                if (d[2].best) {
                    return 6;
                }

                return 3;
            })
            .on("mouseover", (d, i) => {
                $(document).ready(function (e) {
                    $("#lastX").text("X: " + d[0]);
                    $("#lastY").text("Y: " + d[1]);
                    let s = "";
                    if (d[2].child) s += "CHILD ";
                    if (d[2].best) s += "BEST ";
                    if (d[2].mut) s += "MUTABLES ";
                    $("#lastType").text("Type: " + s);
                });
            })
            .on("mouseout", (d, i) => {
                $(document).ready(function (e) {

                });
            });




    }



    init(num) {


        var w = window.innerWidth - document.getElementsByClassName("panel")[0].offsetWidth;
        var h = window.innerHeight;
        let padding = 20;
        var xScale = d3.scaleLinear()
            .domain([this.xL, this.xR])
            .range([padding, w - padding * 2]);

        var yScale = d3.scaleLinear()
            .domain([this.yB, this.yT])
            .range([h - padding, padding]);

        var xAxis = d3.axisBottom()
            .scale(xScale);

        //Define Y axis
        var yAxis = d3.axisLeft()
            .scale(yScale);


        //Create SVG element
        var svg = d3.select(".grafic")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        this.update(0);

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

