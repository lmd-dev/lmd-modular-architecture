/**
 * Represents an application using modules
 */
class ModulesApplication
{
    //Modules Manager of the application
    private _modulesManager: ModulesManager;

    /**
     * Constructor
     * @param modulesNames Names of the modules to load
     */
    constructor(modulesNames: Array<string>)
    {
        this._modulesManager = new ModulesManager(modulesNames);
    }
}

/**
 * Entry point of the application
 * May be moves to a child class of ModulesApplication
 */
window.onload = () =>
{
    let app = new ModulesApplication(['module-1']);
}