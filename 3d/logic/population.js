
class PopulationServise {

    constructor(mutation_chance) {
        this.population = [];
        this.time_line = [];
        this.mutation_chance = mutation_chance;
        this.count = 0;
    }

    createFirstPopulation(left, right, count) {
        for (let i = 0; i < count; i++) {
            this.population.push(new Gene(Util.getFloatRandom(left, right), Util.getFloatRandom(left, right), false));
        }
        let best_gene = Util.getBestResult(this.population, "Object");
        best_gene.best = true;
        this.time_line.push(Util.copyPopulations(this.population));
        this.population.forEach((x) => x.reset());
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

        function createNewChildren(candid, a, b) {
            let parent_a = Util.getBestResult(candid, "Object");
            candid.splice(Util.getBestResult(candid, "Index"), 1);

            let parent_b = Util.getBestResult(candid, "Object");
            candid.splice(Util.getBestResult(candid, "Index"), 1);

            let parent_c = Util.getBestResult(candid, "Object");
            candid.splice(Util.getBestResult(candid, "Index"), 1);

            if (candid.length > 0) {
                let die_obj = Util.getWorstResult(candid, "Object");
                die_obj.die = true;
            }
            return Gene.crossover(parent_a, parent_b, parent_c, a, b);
        }

        let j = 0;
        let candidants = [];
        for (let i = 0; i < (cur_pop_len - die_gen) / 4; i++) {

            for (let k = 0; k < 5; k++) {
                let rand = Util.getIntRandom(0, this.population.length - 1);
                if (this.population[rand].die || this.population[rand].is_parent ) {
                    k--;
                    j++;
                    if (j>100) break
                   // console.log(j);
                    continue;
                }
                this.population[rand].is_parent = true;
                candidants.push(this.population[rand]);
                j++;
            }

            if (candidants.length >= 3){
               this.population.push(createNewChildren(candidants, this.left, this.right));
            }
            candidants = [];
            j = 0;
        }



       /* if (candidants.length > 2)
            createNewChildren(candidants, this.left, this.right);*/

        let best_gene = Util.getBestResult(this.population, "Object");
        best_gene.best = true;

        this.count++;

    }

    write_to_timeline() {
        this.time_line.push(Util.copyPopulations(this.population));
        this.population.forEach((x) => x.reset());
    }




}