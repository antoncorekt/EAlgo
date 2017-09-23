
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

    static crossover(parent_a, parent_b, parent_c, min, max){
        let stack = [];
        stack.push(parent_a);
        stack.push(parent_b);
        stack.push(parent_c);
        
        let best = Util.getBestResult(stack,"Object");
        stack.splice(Util.getBestResult(stack, "Index"), 1);
        let g1 = stack[0];
        let g2 = stack[1];
        let dX = Math.max(best.x - g1.x, best.x - g2.x) + best.x;
        let dY = Math.max(best.y - g1.y, best.y - g2.y) + best.y;

        if (dX > max) dX = max;
        if (dX < min) dX = min;
        if (dY > max) dY = max;
        if (dY < min) dY = min;

        let child = new Gene(Util.getFloatRandom(best.x, dX),Util.getFloatRandom(best.y, dY),true);
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