class ModulesManager
{
    //Array of available modules
    private _availableModules: Map<string, Module>;

    /**
     * Constructor
     * @param modulesNames Names of the available modules to load
     */
    constructor(modulesNames: Array<string>)
    {        
        this._availableModules = new Map<string, Module>();

        modulesNames.forEach((moduleName: string) =>
        {
            this._availableModules.set(moduleName, new Module(this, moduleName));
        });

        this.loadControllers().then(() =>
        {
            this.loadViews();
        });
    }

    /**
     * Gets configuration file for each module and loads their controllers
     */
    loadControllers(): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            let loadingPromises = new Array<Promise<any>>();

            this._availableModules.forEach((module: Module) =>
            {
                loadingPromises.push(module.loadConfigurationModelsAndControllers());
            });

            Promise.all(loadingPromises).then(resolve).catch(reject);
        });
    }

    /**
     * Returns a controller from its name and its parent module
     * @param moduleName Module where find the controller
     * @param controllerName Name of the required controller
     */
    getController(moduleName: string, controllerName)
    {
        if (this._availableModules.get(moduleName) !== undefined)
        {
            return this._availableModules.get(moduleName).getController(controllerName);
        }

        throw "ModulesManager::getController - Unknown module " + moduleName;
    }

    /**
     * Loads views of each module
     */
    loadViews()
    {
        return new Promise((resolve, reject) =>
        {
            let loadingPromises = new Array<Promise<any>>();

            this._availableModules.forEach((module: Module) =>
            {
                loadingPromises.push(module.loadViews());
            });

            Promise.all(loadingPromises).then(resolve).catch(reject);
        });
    }

    /**
     * Indicates if the required modules have been loaded
     * @param requiredModules Names of the required modules
     */
    hasModulesRequired(requiredModules: Array<string>): boolean
    {
        let result = true;

        requiredModules.forEach((requiredModule: string) =>
        {
            result = result && this._availableModules.get(requiredModule) !== undefined;
        });

        return result;
    }
}