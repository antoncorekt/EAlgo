'use strict';

//import GraphicsEngine from './graphics.js';


class Gene {
    constructor(x){
        this.x = x;
    }

    static crossover(a,b){
        return new Gene((a+b)/2.);
    }

    mutation(min, max){
        this.x += (Math.random() * (max - min) + min)*0.5;
    }

    toStr(){
        return "[ "+this.x+" ]";
    }
}

// Класс Util служит для статических утилитарный функций необходимый в бизнес логике
class Util { 

    // функция f(x)
    // return float
  static f(obj){
    let x = obj.x;
    return (4 - x)*Math.cos(0.5 * x - 1.5);
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
  constructor(left, right, count, mutation) {
    this.left = left;
    this.right = right;
    this.count = count;
    this.mutation = mutation;

    this.populations = [];

    this.debug = false;

    this.model_state  = new Object();
    this.model_state.time_line = [];

  }

  // создание первой популяции
  createFirstPopulation(){

    for(let i=0; i<this.count; i++){
        this.populations.push(
            new Gene(Util.getFloatRandom(this.left, this.right))
        );
    }

    if (this.debug){
        console.log(this.populations);
    }

    this.model_state.time_line.push(this.populations.slice());
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

  process() {
    this.createFirstPopulation();
    
    let prev_best_result;
    let new_best_result = prev_best_result = this.getBestResult(this.populations);

    let i = 0;
    let count_mutation = 0;
    do {
        if (this.debug){
            console.log("-----------------------------------------------------------------");
            console.log("-----------------------------------------------------------------");
            console.log(i+ " iteration");
            console.log("prev_best_result -> " + prev_best_result);
        }
        count_mutation = 0;

        prev_best_result = new_best_result;

        if (this.debug)
            console.log("----start mutation process");
        for(let j=0; j<this.populations.length; j++){
            if (Util.getPsevdoRandomChance(this.mutation,this.populations.length,this.populations.length-j,count_mutation)){
                count_mutation++;
                this.populations[j].mutation;
                if (this.debug){
                    console.log(j + " gen mutated -> " + this.populations[j].x);
                }
            }
        }
        if (this.debug)
            console.log("end mutation process-----\n");
        
        if (this.debug)
            console.log("start make children-------- will be " + this.populations.length/4 +  " iterates");
        for(let j=0; j<this.populations.length/4; j++){
            let stack = [];
            let index_stack = [];

            for(let k=0; k<4; k++){
                let rand = Util.getIntRandom(0,this.populations.length-1);
                index_stack.push(rand);
                stack.push(this.populations[rand]);
            }
            if (this.debug){
                console.log("Choose 4 random genes, their indexes -> " + index_stack );
                console.log(stack);

            }

            let parent_a = this.getBestResult(stack);
            stack.splice(stack.indexOf(parent_a),1);

            if (this.debug)
                console.log("parent_a -> " + parent_a.toString());

            let parent_b = this.getBestResult(stack);
            stack.splice(stack.indexOf(parent_b),1);

            if (this.debug)
                console.log("parent_b -> " + parent_b.toString());
            
            if (this.debug)
                console.log("now will deleting gen " + stack[0].toStr());
            this.populations.splice(this.populations.indexOf(stack[0]),1);
           // this.populations.splice(this.populations.indexOf(stack[1]),1);

            let children = Gene.crossover(parent_a, parent_b);
            this.populations.push(children);

            if (this.debug)
                console.log("add children " + children.toStr());
        }
        if (this.debug)
            console.log("end make children--------");

        new_best_result = this.getBestResult(this.populations);

        this.model_state.time_line.push(this.populations.slice());

    }
   // while(false);
    while(Math.abs(prev_best_result-new_best_result) < 0.00001);


    console.log("--->>>>>>>>>>>>>" + new_best_result);

    return this.model_state;
  }

  
}

console.log("start");
//new Model(-20,20,500,10).process();
console.log("end");
