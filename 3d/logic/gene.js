
class Gene {

    constructor(x, y, is_child){
        this.x = x;
        this.y = y;
        this.z = Util.f(x,y);
        this.is_child = is_child;
        this.best = false;
        this.die = false;
        this.is_parent = false;
        this.mut = false;
        this.parents = [];
        this.life = 0;
    }

    static crossover(parent_a, parent_b){
        let x = (parent_a.x + parent_b.x)/2.;
        let y = (parent_a.y  +parent_b.y)/2.;
        let child = new Gene(x,y,true);
        child.parents.push(parent_a);
        child.parents.push(parent_b);
        
        return child;
    }

    mutation(min, max) {
        this.mut = true;
        this.x += Util.getFloatRandom(min, max) * 0.1;
        if (this.x > max) this.x = max;
        if (this.x < min) this.x = min;
        this.y += Util.getFloatRandom(min, max) * 0.1;
        if (this.y > max) this.y = max;
        if (this.y < min) this.y = min;
        this.z = Util.f(this.x,this.y);
    }


    reset(){
        this.is_child = false;
        this.best = false;
        this.is_parent = false;
        this.mut = false;
        this.parents = [];   
    }

}