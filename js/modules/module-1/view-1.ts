import { Controller1 } from './controller-1'

export class View1 implements Observer
{
    private _controller1: Controller1;

    /**
     * Constructor
     * @param controllers Associated controller
     */
    constructor(controllers: Array<Subject>)
    {
        this._controller1 = <Controller1>controllers[0];
        this._controller1.addObserver(this);

        this.display();
    }

    /**
     * Notification function of the view
     */
    notify()
    {

    }

    /**
     * Displays content on the web page
     */
    display()
    {
        let h = document.createElement('h1');
        h.innerText = "Hello World !";

        document.body.append(h);
    }
}