﻿class Subject
{
    //Observers of the subject
    private _observers: Array<Observer>;

    /**
     * Constructor
     */
    constructor()
    {
        this._observers = new Array<Observer>();
    }

    /**
     * Adds an observer to the subject
     * @param observer Observer to add
     */
    addObserver(observer: Observer)
    {
        this._observers.push(observer);
    }

    /**
     * Notify all the observers of the subject
     * @param data Facultative data to send to the obsevers
     */
    notify(data: any = null)
    {
        this._observers.forEach((observer) =>
        {
            observer.notify(data);
        });
    }
}