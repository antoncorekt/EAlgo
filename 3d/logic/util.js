
class Util {

    static f(x,y){
        return 0.5 - (Math.pow(Math.sqrt(x*x+y*y),2)-0.5)/(1+0.001*(x*x+y*y));
    }

    static getFloatRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    static getIntRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static copyPopulations(populations) {
        let res = [];
        for (let i = 0; i < populations.length; i++) {
            res.push(new Gene(populations[i].x, populations[i].y, populations[i].child));

            res[i].mut = populations[i].mut;
            res[i].die = populations[i].die;
            res[i].best = populations[i].best;
            res[i].father = populations[i].father;
            if (populations[i].child) {
                res[i].parents[0] = populations[i].parents[0];
                res[i].parents[1] = populations[i].parents[1];
            }
        }
        return res;
    }

    static getWorstResult(genArray, type){
        let max = genArray[0].z, res_index=0, res_obj = genArray[0];
        for (let i = 1; i < genArray.length; i++) {
            let t = genArray[i].z;
            if (t > max) {
                max = t;
                res_index = i;
                res_obj = genArray[i];
            }
        }
        if ( type == "Object")
            return res_obj;  
        else
            if (type == undefined || type == "f(x)")
                return max;
            else
                return res_index;

    }

    static getBestResult(genArray, type){
        let max = genArray[0].z, res_index=0, res_obj = genArray[0];
        for (let i = 1; i < genArray.length; i++) {
            let t = genArray[i].z;
            if (t < max) {
                max = t;
                res_index = i;
                res_obj = genArray[i];
            }
        }
        if ( type == "Object")
            return res_obj;  
        else
            if (type == undefined || type == "f(x)")
                return max;
            else
                return res_index;

    }



}