

class GraphicsEngine {


    // [left ; right] - область допустимых значений
    // count - размер популяции
    // chance - шанс мутации
    // proc - дополнительные эпохи после достищения нужно точности между эпохами
    // precition - точность, при достижении который алгоритм заканчивается
    // max_epoch - ограничение в эпохах
    // [xL ; xR] - ось X
    // [yB ; yT] - ось Y
    constructor(left, right, count, proc, chance, precition, max_epoch, xL, xR, yB, yT) {

        this.left = left;
        this.right = right;
        this.count = count;
        this.proc = proc;
        this.chance = chance;
        this.precition = precition;
        this.max_epoch = max_epoch;
        this.xL = xL;
        this.xR = xR;
        this.yB = yB;
        this.yT = yT;

        this.model = new Model(left, right, count, proc, chance, precition, max_epoch);

        this.data = null;
        this.data = this.model.process();


        console.log(this.data);


    }

    f() {
        let x = document.getElementById("myRange");
        x.defaultValue = 0;
        x.min = 0;
        x.max = this.data.time_line.length - 1;
        x.value = 0;


        let self = this;
        self.init(0);

        $(document).ready(function (e) {

            // функция обновление информации
            let fun = function (oper) {

                self.update($("input[type=range]").val());
                let val = $("input[type=range]").val();
                $("#epoch").text("Epoch: " + $("input[type=range]").val() + " from " + (self.data.time_line.length - 1));


                let child = 0, sum = 0, mut = 0, die = 0, all = 0; // данный которые нужно собрать в процессе прохода по данным
                self.data.time_line[val].forEach(
                    (x) => {
                        if (!x.die) {
                            all++;
                            sum += Util.f(x);
                            if (x.child)
                                child++;
                            if (x.mut)
                                mut++;
                        }
                        else {
                            die++;
                        }

                    });
                $("#popul").text("Count populations: " + all);
                $("#die").text("Count dead gens: " + die);
                $("#new_child").text("New child in epoch: " + child);
                $("#best_res").text("Best result in epoch: " + self.model.getBestResult(self.data.time_line[val]));
                $("#aver_res").text("Average result in epoch: " + sum / self.data.time_line[val].length);
                $("#mutat").text("Mutation: " + mut);
            }
            fun();

            $(document).on('keypress', function (e) {

                if (e.originalEvent.code == "ArrowRight" && !$(':focus').length) {
                    $("input[type=range]").val(Number.parseInt($("input[type=range]").val()) + 1); // регулировка Timeline вручную

                    fun();
                }

                if (e.originalEvent.code == "ArrowLeft" && !$(':focus').length) {
                    $("input[type=range]").val(Number.parseInt($("input[type=range]").val()) - 1);

                    fun();
                }
            });

            $("#myRange").on("input change", function () {

                fun();

            });


        });
    }

    update(num) {
        let w = window.innerWidth - document.getElementsByClassName("panel")[0].offsetWidth;
        let h = window.innerHeight;
        let padding = 20;

        let dataset = [];

        //console.log(this.data.time_line[num]);
        let self = this;

        for (let i = 0; i < this.data.time_line[num].length; i++) {
            let t = [];
            t.push(this.data.time_line[num][i].x);        // x coodrinate
            t.push(Util.f(this.data.time_line[num][i]));  // y coodrinate
            t.push(this.data.time_line[num][i]);          // object  
            dataset.push(t);
        }

        let xScale = d3.scaleLinear()
            .domain([this.xL, this.xR])
            .range([padding, w - padding * 2]);

        let yScale = d3.scaleLinear()
            .domain([this.yB, this.yT])
            .range([h - padding, padding]);


        d3.select('svg')
            .selectAll('circle')
            .remove();

        let get_radius = function(obj){
            if (obj.die) {
                return 2;
            }

            if (obj.best) {
                return 6;
            }

            if (obj.child) {
                return 4;
            }

            if (obj.mut) {
                return 3.2;
            }

            return 3;
        }

        d3.select('svg')
            .selectAll('circle')
            .data(dataset)
            .enter()
            .append("circle")
            .attr("fill", function (d) {

                if (d[2].best) {
                    return "red";
                }
                if (d[2].mut)
                    return "blue";

                if (d[2].child) {
                    return "green";
                }

                if (d[2].die) {
                    return "rgba(0,0,0," + ((num + 1) / self.data.time_line[num].length + 0.1) + ")";
                }

                return "black";
            })
            .attr("id", function(d){
                return (d[0] + " " + d[1]);
            })
            .attr("cx", function (d) {
                return xScale(d[0]);
            })
            .attr("cy", function (d) {
                return yScale(d[1]);
            })
            .attr("r", function (d) {
                return get_radius(d[2]);
                
            })
            .on("mouseover", (d, i) => {
               
                

                $(document).ready(function (e) {
                    $("#lastX").text("X: " + d[0]);
                    $("#lastY").text("Y: " + d[1]);
                    let s = "";
                    if (d[2].child) s += "CHILD ";
                    if (d[2].best) s += "BEST ";
                    if (d[2].mut) s += "MUTABLES ";
                    if (d[2].die) s += "DIE ";
                    $("#lastType").text("Type: " + s);
                    let el = document.getElementById(d[0] +" " + d[1]);                    
                    
                    el.setAttribute("r", get_radius(d[2])+3);

                    if(d[2].child){
                        let par_a = document.getElementById(d[2].parents[0].x +" " + Util.f(d[2].parents[0]));
                        let par_b = document.getElementById(d[2].parents[1].x +" " + Util.f(d[2].parents[1])); 
                        //console.log(d[2].parents[0].x +" " + Util.f(d[2].parents[0].x));
                        par_a.setAttribute("r",10);
                        par_b.setAttribute("r",10);
                    }
                });
            })
            .on("mouseout", (d, i) => {
                let el = document.getElementById(d[0] +" " + d[1]);                    
                
                el.setAttribute("r", get_radius(d[2]));
                if(d[2].child){
                    let par_a = document.getElementById(d[2].parents[0].x +" " + Util.f(d[2].parents[0]));
                    let par_b = document.getElementById(d[2].parents[1].x +" " + Util.f(d[2].parents[1])); 
                    //console.log(d[2].parents[0].x +" " + Util.f(d[2].parents[0].x));
                    par_a.setAttribute("r",get_radius(d[2]));
                    par_b.setAttribute("r",get_radius(d[2]));
                }
                $(document).ready(function (e) {
                    
                });
            });




    }



    init(num) {
        let w = window.innerWidth - document.getElementsByClassName("panel")[0].offsetWidth;
        let h = window.innerHeight;
        let padding = 20;

        let xScale = d3.scaleLinear()
            .domain([this.xL, this.xR])
            .range([padding, w - padding * 2]);

        let yScale = d3.scaleLinear()
            .domain([this.yB, this.yT])
            .range([h - padding, padding]);

        let xAxis = d3.axisBottom()
            .scale(xScale);

        //Define Y axis
        let yAxis = d3.axisLeft()
            .scale(yScale);


        //Create SVG element
        let svg = d3.select(".grafic")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        this.update(0);


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

    clean() {
        this.data = [];
    }

}

//export default new GraphicsEngine();

