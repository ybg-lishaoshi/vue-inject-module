type ExtensionCallback = (pluginRegistry: PluginRegistry, obj: any) => void;

/**
 * Define a plugin module
 */
interface Module {
    // This Module's Name
    name: string;
    // Depends on which module (names)
    dependsOn?: Array<string>;
    extensionPoints?: object;
    extensions?: object;
    // Startup Code
    start?: (vue, pluginRegisty: PluginRegistry) => void;
}

/**
 * Used to start the framework
 */
interface ModuleConfig {
    modules: Array<Module>;
    config?: object;
}

/**
 * The core framework is to provide a plugin registry
 */
class PluginRegistry {

    extensionCallbacks: Map<string, ExtensionCallback>;
    moduleVariables: Map<string, Map<string, any>>;
    config: object;

    constructor(config) {
        this.extensionCallbacks = new Map<string, ExtensionCallback>();
        this.moduleVariables = new Map<string, Map<string, any>>();
        this.config = config;
    }

    registerExtensionPoint(extensionPointName: string, extensionCallback: ExtensionCallback) {
        this.extensionCallbacks[extensionPointName] = extensionCallback;
    }

    registerExtension(extensionPointName: string, obj: any) {
        if (this.extensionCallbacks[extensionPointName]) {
            this.extensionCallbacks[extensionPointName](this, obj);
        } else {
            console.log("Invalid Extension Point: ", extensionPointName);
        }
    }

    moduleVarAppend(moduleName: string, varname: string, obj: any) {
        if (!this._ensureMod(moduleName)[varname]) {
            this.moduleVariables[moduleName][varname] = [obj];
        } else {
            this.moduleVariables[moduleName][varname].push(obj);
        }
    }

    moduleVarSet(moduleName: string, varname: string, obj: any) {
        this._ensureMod(moduleName)[varname] = obj;
    }

    moduleVarGet(moduleName: string, varname: string) {
        return this._ensureMod(moduleName)[varname];
    }

    configGet(varname: string): any {
        return this.config[varname];
    }

    _ensureMod(moduleName: string) {
        if (!this.moduleVariables[moduleName]) {
            this.moduleVariables[moduleName] = new Map<string, any>();
        }
        return this.moduleVariables[moduleName];
    }

}

/**
 * Used to calculate startup sequence using the dependsOn specification
 * 
 * @param modules 
 */
function calculateStartupSeq(modules: Array<Module>): Array<Module> {
    return modules;
}

const plugin = {
    install(Vue, ops: ModuleConfig = { modules: [], config: {} }) {
        let registry = new PluginRegistry(ops.config);
        Vue.prototype.$pluginConfig = ops.config;
        Vue.prototype.$pluginRegistry = registry;
        let startupSeq = calculateStartupSeq(ops.modules);
        startupSeq.forEach(mod => {
            if (mod.extensionPoints) {
                for (const k in mod.extensionPoints) {
                    registry.registerExtensionPoint(k, mod.extensionPoints[k]);
                }
            }
            if (mod.extensions) {
                for (const k in mod.extensions) {
                    registry.registerExtension(k, mod.extensions[k]);
                }
            }
            // start module (if any)
            if (mod.start) {
                mod.start(Vue, registry)
            }
        })
    }
}

export default plugin
