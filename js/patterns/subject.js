class Subject {
    /**
     * Constructor
     */
    constructor() {
        this._observers = new Array();
    }
    /**
     * Adds an observer to the subject
     * @param observer Observer to add
     */
    addObserver(observer) {
        this._observers.push(observer);
    }
    /**
     * Notify all the observers of the subject
     * @param data Facultative data to send to the obsevers
     */
    notify(data = null) {
        this._observers.forEach((observer) => {
            observer.notify(data);
        });
    }
}
