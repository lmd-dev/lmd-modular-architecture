/**
 * Represents an application using modules
 */
class ModulesApplication {
    /**
     * Constructor
     * @param modulesNames Names of the modules to load
     */
    constructor(modulesNames) {
        this._modulesManager = new ModulesManager(modulesNames);
    }
}
/**
 * Entry point of the application
 * May be moves to a child class of ModulesApplication
 */
window.onload = () => {
    let app = new ModulesApplication(['module-1']);
};
