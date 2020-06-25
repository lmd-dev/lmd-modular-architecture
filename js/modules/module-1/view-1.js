export class View1 {
    constructor(controllers) {
        this._controller1 = controllers[0];
        this._controller1.addObserver(this);
        this.display();
    }
    notify() {
    }
    display() {
        let h = document.createElement('h1');
        h.innerText = "Hello World !";
        document.body.append(h);
    }
}
