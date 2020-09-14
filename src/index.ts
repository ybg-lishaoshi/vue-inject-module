type ExtensionCallback = (pluginRegistry: PluginRegistry, obj: any) => void;

interface Module {
    // This Module's Name
    name: string;
    // Depends on which module (names)
    dependsOn: Array<string>;
    // Startup Code
    start: (vue, pluginRegisty: PluginRegistry) => void;
}

interface ModuleConfig {
    modules: Array<Module>;
}

class PluginRegistry {

    extensionCallbacks: Map<string, ExtensionCallback>;
    moduleVariables: Map<string, Map<string, any>>;

    constructor() {
        this.extensionCallbacks = new Map<string, ExtensionCallback>();
        this.moduleVariables = new Map<string, Map<string, any>>();
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
        this.moduleVariables[moduleName][varname] = obj;
    }

    moduleVarGet(moduleName: string, varname: string) {
        return this._ensureMod(moduleName)[varname];
    }

    _ensureMod(moduleName: string) {
        if (!this.moduleVariables[moduleName]) {
            this.moduleVariables[moduleName] = new Map<string, any>();
        }
        return this.moduleVariables[moduleName];
    }

}

function calculateStartupSeq(modules: Array<Module>): Array<Module> {
    return modules;
}

const plugin = {
    install(Vue, ops: ModuleConfig = { modules: [] }) {
        Vue.prototype.$pluginRegistry = new PluginRegistry();
        let startupSeq = calculateStartupSeq(ops.modules);
        startupSeq.forEach(mod => mod.start(Vue, Vue.$pluginRegistry))
    }
}

export default plugin