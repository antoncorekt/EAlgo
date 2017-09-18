
class GraphicsEngine {

  constructor(x_left, x_right) {
    this.x_left = x_left;
    this.x_right = x_right;

    this.model = new Model();
    this.servise = this.model.f();
    this.time_line = this.servise.time_line;
    this.layout = null;
  }


  f() {
    let x = document.getElementById("myRange");
    x.defaultValue = 0;
    x.min = 0;
    x.max = this.time_line.length - 1;
    x.value = 0;

    console.log(this.servise);
    
    this.firstDraw();

    this.data = [];
    this.time_line.forEach((x)=>this.data.push(this.population_to_data(x)));

    let self = this;

    $(document).ready(function (e) {

       
        let fun = function (oper) {

            self.update($("input[type=range]").val());
           /* let val = $("input[type=range]").val();
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
            $("#best_res").text("Best result in epoch: " + self.model.getBestRes(self.data.time_line[val], "f(x)"));
            $("#aver_res").text("Average result in epoch: " + sum / self.data.time_line[val].length);
            $("#mutat").text("Mutation: " + mut);*/
        }
        

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

  population_to_data(population){
    let data = [];
    let x_arr_normal = [],y_arr_normal = [],z_arr_normal = [];
    let x_arr_die = [],y_arr_die = [],z_arr_die = [];
    let x_arr_child = [],y_arr_child = [],z_arr_child = [];
    let x_arr_mut = [],y_arr_mut = [],z_arr_mut = [];
    let x_arr_best = [],y_arr_best = [],z_arr_best = [];
    for(let i=0; i<population.length; i++){

      if (population[i].best){
        x_arr_best.push(population[i].x);
        y_arr_best.push(population[i].y);
        z_arr_best.push(population[i].z);
        continue;
      }

      if (population[i].die){
        x_arr_die.push(population[i].x);
        y_arr_die.push(population[i].y);
        z_arr_die.push(population[i].z);
        continue;
      }

      if (population[i].mut){
        x_arr_mut.push(population[i].x);
        y_arr_mut.push(population[i].y);
        z_arr_mut.push(population[i].z);
        continue;
      }

      if (population[i].child){
        x_arr_child.push(population[i].x);
        y_arr_child.push(population[i].y);
        z_arr_child.push(population[i].z);
        continue;
      }

      
      x_arr_normal.push(population[i].x);
      y_arr_normal.push(population[i].y);
      z_arr_normal.push(population[i].z);

    } 

    let normal_obj = new Object();
    normal_obj.x = x_arr_normal;
    normal_obj.y = y_arr_normal;
    normal_obj.z = z_arr_normal;
    normal_obj.marker = {
      color: 'rgb(0, 0, 0)',
      size: 3,
    };
    data.push(normal_obj);

    let die_obj = new Object();
    die_obj.x = x_arr_die;
    die_obj.y = y_arr_die;
    die_obj.z = z_arr_die;
    die_obj.marker = {
      color: 'rgb(102, 102, 153)',
      size: 2,
    };
    data.push(die_obj);

    let mut_obj = new Object();
    mut_obj.x = x_arr_mut;
    mut_obj.y = y_arr_mut;
    mut_obj.z = z_arr_mut;
    mut_obj.marker = {
      color: 'rgb(0, 0, 200)',
      3: 4,
    };
    data.push(mut_obj);

    let child_obj = new Object();
    child_obj.x = x_arr_child;
    child_obj.y = y_arr_child;
    child_obj.z = z_arr_child;
    child_obj.marker = {
      color: 'rgb(51, 204, 51)',
      size: 4,
    };
    data.push(child_obj);

    let best_obj = new Object();
    best_obj.x = x_arr_best;
    best_obj.y = y_arr_best;
    best_obj.z = z_arr_best;
    best_obj.marker = {
      color: 'rgb(255, 0, 0)',
      size: 7,
    };
    data.push(best_obj);

    data.forEach((t)=>{
      t.type = 'scatter3d';
      t.mode = 'markers';
      t.marker.symbol = 'circle';
      t.marker.opacity = 0.8;
    });
    
    return data;
  }

  firstDraw(){

    function getrandom(num, left, right) {
      var value = [];
      for (let i = 0; i <= num; i++) {
        let rand = Util.getIntRandom(left, right);
        value.push(rand);
      }
      return value;
    }

    function getData(left, right, len) {
      let res = [];



      for (let i = 0; i < 1; i++) {
        let t = new Object();
        t.opacity = 1;
        let t_x = getrandom(len, left, right);
        let t_y = getrandom(len, left, right);
        let t_z = [];
        for (let i = 0; i < t_x.length; i++) {
          t_z.push(Util.f(t_x[i], t_y[i]));
        }
        t.x = t_x;
        t.y = t_y;
        t.z = t_z;
        t.type = 'scatter3d';
        t.mode = 'markers';
        t.marker = {
          color: 'rgb(127, 127, 127)',
          size: 3,
          symbol: 'square',
          line: {
            color: 'rgb(204, 204, 204)',
            width: 1
          },
          opacity: 0.8
        },

          res.push(t);
      }

      return res;
    }

    let data1 = this.population_to_data(this.time_line[0]);
    this.layout = {
      scene: {
        xaxis: {
          backgroundcolor: "rgb(50, 50, 230)",
          gridcolor: "rgb(100, 255, 255)",
          showbackground: true,
          zerolinecolor: "rgb(255, 100, 255)",
        },
        yaxis: {
          backgroundcolor: "rgb(230, 200,230)",
          gridcolor: "rgb(255, 255, 255)",
          showbackground: true,
          zerolinecolor: "rgb(255, 255, 255)"
        },
        zaxis: {
          backgroundcolor: "rgb(230, 230,200)",
          gridcolor: "rgb(255, 255, 255)",
          showbackground: true,
          zerolinecolor: "rgb(255, 255, 255)"
        }
      },
      autosize: false,
      width: window.innerWidth - document.getElementsByClassName("panel")[0].offsetWidth,
      height: window.innerHeight,
      margin: {
        l: 0,
        r: 0,
        b: 50,
        t: 50,
        pad: 4
      },
    };

    Plotly.newPlot('engine', data1, this.layout);
  }

  update(num){
    var layout_update = {
      title: 'some new title', // updates the title
  };
    Plotly.newPlot('engine', this.data[num], layout_update);
  }



}

