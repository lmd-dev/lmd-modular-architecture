import { Model1 } from './model-1'

export class Controller1 extends Subject
{
    private _model1: Model1;
    public get model1(): Model1 { return this._model1; };

    /**
     * Constructor
     */
    constructor()
    {
        super();

        //Syntaxe to avoid "import" instruction in the generated JS
        this._model1 = <Model1>new window['Model1']();

        console.log('Controller is loaded');
    }
}