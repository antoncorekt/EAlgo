
class Model {

    constructor(x_left, x_right, mutation_chance, count){

        this.service = new PopulationServise(mutation_chance);
        this.service.createFirstPopulation(x_left,x_right,count);
    }


    f(max_ep){

        let max_epoch = max_ep, i = 0;
        do {

            this.service.makeNewEpoch();
            this.service.write_to_timeline();

            i++;
            
        } while(i<max_epoch);

        console.log(Util.getBestResult(this.service.time_line[4], "Object"));

        return this.service;
    }

}