export class Controller1 extends Subject {
    get model1() { return this._model1; }
    ;
    /**
     * Constructor
     */
    constructor() {
        super();
        //Syntaxe to avoid "import" instruction in the generated JS
        this._model1 = new window['Model1']();
        console.log('Controller is loaded');
    }
}
