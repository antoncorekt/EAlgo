'use strict';

//import GraphicsEngine from './graphics.js';


class Gene {
    constructor(x, child){
        this.x = x;

        this.mut = false;
        this.child = child
        this.father = false;
        this.die = false;
        this.best = false;
        this.parents = [];

       
    }

    static crossover(a,b){
        a.father = true;
        b.father = true;
        let gene = new Gene((a.x+b.x)/2., true);
        gene.parents.push(a);
        gene.parents.push(b);
        return gene;
    }

    mutation(min, max){
        this.mut = true;
        this.x += Util.getFloatRandom(min, max)*0.1;
        if(this.x >  max) this.x=max;
        if(this.x < min) this.x = min;
        
    }

    makeBest(){
        this.best = true;
    }

    toStr(){
        return "[ "+this.x+" ]";
    }

    reset(){
        this.mut = false;
        this.child = false;
        this.best = false;
        this.father = false;
        this.parents = [];
    }
}

// Класс Util служит для статических утилитарный функций необходимый в бизнес логике
class Util { 

    // функция f(x)
    // return float
  static f(obj){
    let x = obj.x;
    //

    let pole = document.getElementById("func");
    
    if(pole.value === ""){
        return (4 - x)*Math.cos(0.5 * x - 1.5);
    }
    else{
        
    return math.eval(pole.value.replace(new RegExp("x", 'g'), x));
    }

  }

  // Возвращает случайное вещественное число между min (включительно) и max (не включительно)
  // return float
  static getFloatRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Возвращает случайное целое число между min (включительно) и max (не включительно)
  // return int
  static getIntRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  
  static isRandomProc(procent){    
      return Util.getFloatRandom(0,100)<=procent;
  }

  static copyPopulations(populations){
      let res = [];
      for(let i=0; i<populations.length; i++){
          res.push(new Gene(populations[i].x, populations[i].child));
          
          res[i].mut = populations[i].mut;
          res[i].die = populations[i].die;
          res[i].best = populations[i].best;
          res[i].father = populations[i].father;
          if(populations[i].child){
          res[i].parents[0] = populations[i].parents[0];
          res[i].parents[1] = populations[i].parents[1];
          }
      }
      return res;
  }

  // Псевдорандом
  // Например, необходимо что бы из 10 генов в популяции 10% мутировало,
  // если использовать традиционный рандом, то это и правда будет рандом, может больше, может меньше
  // Формула такая -> (k-r)/(popul), 
  // где k - начальное колво геново который должны мутировать, r - уже мутировавшие гены, popul - текущий колво генов в популяции

  static getPsevdoRandomChance(max_random_chance, max_populations, courent_populations, count_already_proc){
     // console.log(((max_populations/100*max_random_chance)-count_already_proc)/courent_populations*100 + "%");
    return Util.isRandomProc(((max_populations/100*max_random_chance)-count_already_proc)/courent_populations*100);
  }
}

class Model {

  

  // [left ; right] - ограничения
  // count - начальное кол-во популяции
  // mutation - максимальный процент мутировавших генов от популяции
  constructor(left, right, count, mutation, chance, precition, max_epoch) {
    this.left = left;
    this.right = right;
    this.count = count;
    this.mutation = mutation;
    this.chance = chance;
    this.precition = precition;
    this.max_epoch = max_epoch;

    this.populations = [];

    this.debug = false;

    this.model_state  = new Object();
    this.model_state.time_line = [];

  }

  // создание первой популяции
  createFirstPopulation(){

    for(let i=0; i<this.count; i++){
        this.populations.push(
            new Gene(Util.getFloatRandom(this.left, this.right), false)
        );
    }

    this.populations[this.getIndexBestResult(this.populations)].makeBest();

    this.model_state.time_line.push(Util.copyPopulations(this.populations));

  }

  getBestResult(pop){
      let max = Util.f(pop[0]);
      

      for (let i=1; i<pop.length; i++){
          let t = Util.f(pop[i]);
          if(t>max){
              max = t;
          }
      }
  
      return max;
  }

  getIndexBestResult(pop){
    let max = Util.f(pop[0]);
    let res = 0;

    for (let i=1; i<pop.length; i++){
        let t = Util.f(pop[i]);
        if(t>max){
            max = t;
            res = i;
        }
    }

    return res;
}

getObjBestResult(pop){
    let max = Util.f(pop[0]);
    let res = pop[0];

    for (let i=1; i<pop.length; i++){
        let t = Util.f(pop[i]);
        if(t>max){
            max = t;
            res = pop[i];
        }
    }

    return res;
}


  process() {
    this.createFirstPopulation();
    
    let prev_best_result;
    let new_best_result = prev_best_result = this.getBestResult(this.populations);
    

    let i = 0;
    let count_mutation = 0;

    let trys = new Array(this.chance);

    do {
        i++;
        count_mutation = 0;

        prev_best_result = new_best_result;
        let die_gen = 0;
       this.populations.forEach((x)=>{x.reset(); if(x.die)die_gen++;});

        // mutations process
        let t = this.populations.length;
        let max_count_mutation = 100/(t-die_gen)*this.mutation;
        for(let j=0; j<t; j++){
            if (this.populations[i].die) continue;

            if (Util.getPsevdoRandomChance(this.mutation,this.populations.length,this.populations.length-j,count_mutation)){
                
                count_mutation++;
                this.populations[j].mutation(this.left, this.right);
            }
            
        }
     
        let len = (t-die_gen)/2;
        for(let j=0; j<len; j++){
            let stack = [];
            let index_stack = [];

            if(die_gen-4>=t) break;

            for(let k=0; k<4; k++){
                let rand = Util.getIntRandom(0,this.populations.length-1);
                if (this.populations[rand].die && !this.populations[rand].child && !this.populations[rand].father) {
                    k--; 
                    continue;
                }

                index_stack.push(rand);
                stack.push(this.populations[rand]);
            }
          

            let parent_a = this.getObjBestResult(stack);
            stack.splice(stack.indexOf(parent_a),1);
           



            let parent_b = this.getObjBestResult(stack);
            stack.splice(stack.indexOf(parent_b),1);
            

         
           // this.populations.splice(this.populations.indexOf(stack[0]),1);

            //stack.forEach((x)=>x.die = true);
            stack[0].die = true;


           // this.populations.splice(this.populations.indexOf(stack[1]),1);

            let children = Gene.crossover(parent_a, parent_b);
            this.populations.push(children);

           
        }
        new_best_result = this.getBestResult(this.populations);

        this.populations[this.getIndexBestResult(this.populations)].makeBest();

        this.model_state.time_line.push(Util.copyPopulations(this.populations));

        if (Math.abs(prev_best_result-new_best_result) < this.precition){
            trys.splice(0,1);
        }
        
        if(this.max_epoch <= i)
            break;

    }
    while(trys.length>=1);


    console.log("--->>>>>>>>>>>>>" + new_best_result);

    return this.model_state;
  }

  
}

console.log("start");
//new Model(-20,20,500,10).process();
console.log("end");
