/**
 * Represents the structure of a module
 */
class Module {
    get name() { return this._name; }
    ;
    get controllers() { return this._controllers; }
    ;
    get views() { return this._views; }
    ;
    /**
     * Constructor
     * @param modulesManager Parent manager
     * @param moduleName NAme of the module
     */
    constructor(modulesManager, moduleName) {
        this._modulesManager = modulesManager;
        this._name = moduleName;
        this._controllers = new Map();
        this._views = new Map();
        this._configuration = null;
    }
    /**
     * Loads the configuration file of the module from the server and then, loads required models and the controllers
     */
    loadConfigurationModelsAndControllers() {
        return new Promise((resolve, reject) => {
            this.loadConfiguration().then(() => {
                if (this._modulesManager.hasModulesRequired(this._configuration.required)) {
                    this.loadModels().then(() => {
                        this.loadControllers().then(resolve).catch(reject);
                    }).catch(reject);
                }
                else
                    reject();
            }).catch(reject);
        });
    }
    /**
     * Loads the configuration file from the server
     */
    loadConfiguration() {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('get', 'modules/' + encodeURIComponent(this.name));
            xhr.onload = () => {
                if (xhr.status == 200 && xhr.readyState == XMLHttpRequest.DONE) {
                    this._configuration = JSON.parse(xhr.responseText);
                    resolve();
                }
            };
            xhr.onerror = (error) => {
                reject(error);
            };
            xhr.send();
        });
    }
    /**
     * Import required models
     */
    loadModels() {
        return new Promise((resolve, reject) => {
            let loadingPromises = new Array();
            this._configuration.models.forEach((dataModel) => {
                if (eval("typeof " + dataModel.className) == "undefined") {
                    console.log(dataModel);
                    loadingPromises.push(new Promise((resolveModel, rejectModel) => {
                        import(`/modules/${encodeURIComponent(this._name)}/${encodeURIComponent(dataModel.file)}`).then((jsmodule) => {
                            window[dataModel.className] = jsmodule[dataModel.className];
                            resolveModel();
                        }).catch(rejectModel);
                    }));
                }
            });
            Promise.all(loadingPromises).then(resolve).catch(reject);
        });
    }
    /**
     * Creates and initializes the controllers of the module
     */
    loadControllers() {
        return new Promise((resolve, reject) => {
            let loadingPromises = new Array();
            this._configuration.controllers.forEach((data) => {
                loadingPromises.push(new Promise((resolveController, rejectController) => {
                    import(`/modules/${encodeURIComponent(this._name)}/${encodeURIComponent(data.file)}`).then((jsmodule) => {
                        this._controllers.set(data.className, new jsmodule[data.className]());
                        resolveController();
                    }).catch(rejectController);
                }));
            });
            Promise.all(loadingPromises).then(resolve).catch(reject);
        });
    }
    /**
     * Returns a controller from its name
     * @param controllerName Name of the required controller
     */
    getController(controllerName) {
        if (this._controllers.get(controllerName) !== undefined) {
            return this._controllers.get(controllerName);
        }
        throw "Module::getController - Unknown controller " + controllerName;
    }
    /**
     * Creates and initializes views of the module
     */
    loadViews() {
        return new Promise((resolve, reject) => {
            let loadingPromises = new Array();
            this._configuration.views.forEach((data) => {
                loadingPromises.push(new Promise((resolveView, rejectView) => {
                    import(`/modules/${encodeURIComponent(this._name)}/${encodeURIComponent(data.file)}`).then((jsmodule) => {
                        let controllers = new Array();
                        console.log(data);
                        data.controllers.forEach((controller) => {
                            if (controller.module == "" || controller.module == this.name)
                                controllers.push(this._controllers.get(controller.controllerName));
                            else
                                controllers.push(this._modulesManager.getController(controller.module, controller.controllerName));
                        });
                        this._views.set(data.className, new jsmodule[data.className](controllers));
                        resolveView();
                    }).catch(rejectView);
                }));
            });
            Promise.all(loadingPromises).then(resolve).catch(reject);
        });
    }
}
