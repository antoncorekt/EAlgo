
class BasicGene {

    constructor(x, y, z, is_child){
        this.x = x;
        this.y = y;
        this.z = Util.f(x,y);
        this.is_child = is_child;
    }

    static crossover(parent_a, parent_b){
        
    }

}