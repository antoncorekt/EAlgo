
class GraphicsEngine {

    constructor(x_left, x_right){
        this.x_left = x_left;
        this.x_right = x_right;

    }


    f(){

        function getrandom(num , left,right) 
        {
           var value = [ ];
            for(let i=0;i<=num;i++)
           {
            let rand = Util.getIntRandom(left, right);
            value.push(rand);
           }
            return value;
        }

        function getData(left,right,len){
          let res = [];


          
          for(let i=0; i<1; i++){
            let t = new Object();
            t.opacity = 1;
            let t_x = getrandom(len, left, right);
            let t_y = getrandom(len, left, right);
            let t_z = [];
            for(let i=0; i<t_x.length; i++){
              t_z.push(Util.f(t_x[i], t_y[i]));
            }
            t.x = t_x;
            t.y = t_y;
            t.z = t_z;
            t.type = 'scatter3d';
            t.mode = 'markers';
            t.marker= {
              color: 'rgb(127, 127, 127)',
              size: 3,
              symbol: 'square',
              line: {
              color: 'rgb(204, 204, 204)',
              width: 1},
              opacity: 0.8},
           
            res.push(t);
          }

          return res;
        }

        let data1 = getData(-20,20,1000);
    
    var data=[
        {
          opacity:0.4,
            type: 'scatter3d',
          x: getrandom(75,20),
          y: getrandom(75,20),
          z: [5],
            mode:'markers'
        },
           
    ];
    var layout = {
       scene:{
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
        }},
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

    Plotly.newPlot('engine', data1, layout);
    }




}

new GraphicsEngine(-20,20).f();