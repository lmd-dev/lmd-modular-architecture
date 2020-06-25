/**
 * Represents the structure of a module
 */
class Module
{
    //Manager of the module
    private _modulesManager: ModulesManager;

    //Name of the module
    private _name: string;
    public get name(): string { return this._name; };

    //Configuration of the module
    private _configuration: ModuleConfiguration;

    //Array of controllers for the module
    private _controllers: Map<string, Subject>;
    public get controllers(): Map<string, Subject> { return this._controllers; };

    //Array of views for the module
    private _views: Map<string, Observer>;
    public get views(): Map<string, Observer> { return this._views; };

    /**
     * Constructor
     * @param modulesManager Parent manager
     * @param moduleName NAme of the module
     */
    constructor(modulesManager: ModulesManager, moduleName: string)
    {
        this._modulesManager = modulesManager;
        this._name = moduleName;
        this._controllers = new Map<string, Subject>();
        this._views = new Map<string, Observer>();
        this._configuration = null;
    }

    /**
     * Loads the configuration file of the module from the server and then, loads required models and the controllers
     */
    loadConfigurationModelsAndControllers(): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            this.loadConfiguration().then(() =>
            {
                if (this._modulesManager.hasModulesRequired(this._configuration.required))
                {
                    this.loadModels().then(() =>
                    {
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
    loadConfiguration(): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            let xhr = new XMLHttpRequest();
            xhr.open('get', 'modules/' + encodeURIComponent(this.name));
            xhr.onload = () =>
            {
                if (xhr.status == 200 && xhr.readyState == XMLHttpRequest.DONE)
                {
                    this._configuration = JSON.parse(xhr.responseText);
                    resolve();
                }
            }

            xhr.onerror = (error) =>
            {
                reject(error);
            }

            xhr.send();
        });
    }

    /**
     * Import required models
     */
    loadModels(): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            let loadingPromises = new Array<Promise<any>>();

            this._configuration.models.forEach((dataModel: ModuleConfigurationModel) =>
            {
                if(eval("typeof " + dataModel.className) == "undefined")
                {
                    console.log(dataModel);
                    loadingPromises.push(new Promise((resolveModel, rejectModel) =>
                    {
                        import(`/modules/${encodeURIComponent(this._name)}/${encodeURIComponent(dataModel.file)}`).then((jsmodule) =>
                        {
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
    loadControllers(): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            let loadingPromises = new Array<Promise<any>>();

            this._configuration.controllers.forEach((data: ModuleConfigurationController) =>
            {
                loadingPromises.push(new Promise((resolveController, rejectController) =>
                {
                    import(`/modules/${encodeURIComponent(this._name)}/${encodeURIComponent(data.file)}`).then((jsmodule) =>
                    {
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
    getController(controllerName): Subject
    {
        if (this._controllers.get(controllerName) !== undefined)
        {
            return this._controllers.get(controllerName);
        }

        throw "Module::getController - Unknown controller " + controllerName;
    }

    /**
     * Creates and initializes views of the module
     */
    loadViews(): Promise<any>
    {
        return new Promise((resolve, reject) =>
        {
            let loadingPromises = new Array<Promise<any>>();

            this._configuration.views.forEach((data: ModuleConfigurationView) =>
            {
                loadingPromises.push(new Promise((resolveView, rejectView) =>
                {
                    import(`/modules/${encodeURIComponent(this._name)}/${encodeURIComponent(data.file)}`).then((jsmodule) =>
                    {
                        let controllers = new Array<Subject>();
                        console.log(data);
                        data.controllers.forEach((controller: ModuleConfigurationViewController) =>
                        {
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