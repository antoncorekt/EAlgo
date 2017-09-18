
class Model {

    constructor(){

        this.service = new PopulationServise(10);
        this.service.createFirstPopulation(-20,20,50);
    }


    f(){

        let max_epoch = 5, i = 0;
        do {

            this.service.makeNewEpoch();
            this.service.write_to_timeline();

            i++;
            
        } while(i<max_epoch);

        console.log(Util.getBestResult(this.service.time_line[4], "Object"));

        return this.service;
    }

}