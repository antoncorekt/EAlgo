
class PopulationServise {

    constructor(mutation_chance) {
        this.population = [];
        this.time_line = [];
        this.mutation_chance = mutation_chance;
        this.count = 0;
    }

    createFirstPopulation(left, right, count) {
        for (let i = 0; i < count; i++) {
            this.population.push(new Gene(Util.getFloatRandom(left, right),Util.getFloatRandom(left, right), false));
        }
        this.left = left;
        this.right = right;
    }

    makeNewEpoch() {
        let cur_pop_len = this.population.length;

        let die_gen = 0;
        this.population.forEach((x) => { if (x.die) die_gen++; });

        for (let i = 0; i < cur_pop_len; i++) {
            if (this.population[i].die) continue;
            if (Util.getFloatRandom(0, 100) <= this.mutation_chance) {
                this.population[i].mutation(this.left, this.right);
            }
        }

        function createNewChildren(candid) {
            let parent_a = Util.getBestResult(candid, "Object");
            candid.splice(Util.getBestResult(candid, "Index"), 1);

            let parent_b = Util.getBestResult(candid, "Object");
            candid.splice(Util.getBestResult(candid, "Index"), 1);

            if (candid.length>0){
            let die_obj = Util.getWorstResult(candid, "Object");
            die_obj.die = true;
            }
            return Gene.crossover(parent_a, parent_b);
        }

        let j = 0;
        let candidants = [];
        for (let i = 0; i < cur_pop_len; i++) {
            if (this.population[i].die) continue;
            if (this.population[i].parent) continue;

            if (j < 4) {
                candidants.push(this.population[i]);
                j++;
            }
            else {
                this.population.push(createNewChildren(candidants));
                candidants = [];
                j=0;
            }


            
        }
        if(candidants.length>2)
             createNewChildren(candidants);

        let best_gene = Util.getBestResult(this.population,"Object");
        best_gene.best = true;

        this.count++;

    }

    write_to_timeline(){
        this.time_line.push(Util.copyPopulations(this.population));
        this.population.forEach((x)=> x.reset());
    }




}