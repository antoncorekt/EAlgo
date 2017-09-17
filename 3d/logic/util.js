
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
}