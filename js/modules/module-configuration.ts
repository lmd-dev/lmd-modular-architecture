//Structure for a required controller for the module
interface ModuleConfigurationController
{
    file: string;
    className: string;
}

//Structure for a controller required for a view of the module
interface ModuleConfigurationViewController
{
    module: string;
    controllerName: string;
}

//Structure for a required view for the module
interface ModuleConfigurationView
{
    file: string;
    className: string;
    controllers: Array<ModuleConfigurationViewController>;
}

//Structure for a required model for the module
interface ModuleConfigurationModel
{
    file: string,
    className: string
}

//Structure required for the configuration file of a module
interface ModuleConfiguration
{
    required: Array<string>;
    controllers: Array<ModuleConfigurationController>;
    views: Array<ModuleConfigurationView>;
    models: Array<ModuleConfigurationModel>;
}