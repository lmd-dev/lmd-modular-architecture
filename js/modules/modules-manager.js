class ModulesManager {
    /**
     * Constructor
     * @param modulesNames Names of the available modules to load
     */
    constructor(modulesNames) {
        this._availableModules = new Map();
        modulesNames.forEach((moduleName) => {
            this._availableModules.set(moduleName, new Module(this, moduleName));
        });
        this.loadControllers().then(() => {
            this.loadViews();
        });
    }
    /**
     * Gets configuration file for each module and loads their controllers
     */
    loadControllers() {
        return new Promise((resolve, reject) => {
            let loadingPromises = new Array();
            this._availableModules.forEach((module) => {
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
    getController(moduleName, controllerName) {
        if (this._availableModules.get(moduleName) !== undefined) {
            return this._availableModules.get(moduleName).getController(controllerName);
        }
        throw "ModulesManager::getController - Unknown module " + moduleName;
    }
    /**
     * Loads views of each module
     */
    loadViews() {
        return new Promise((resolve, reject) => {
            let loadingPromises = new Array();
            this._availableModules.forEach((module) => {
                loadingPromises.push(module.loadViews());
            });
            Promise.all(loadingPromises).then(resolve).catch(reject);
        });
    }
    /**
     * Indicates if the required modules have been loaded
     * @param requiredModules Names of the required modules
     */
    hasModulesRequired(requiredModules) {
        let result = true;
        requiredModules.forEach((requiredModule) => {
            result = result && this._availableModules.get(requiredModule) !== undefined;
        });
        return result;
    }
}
