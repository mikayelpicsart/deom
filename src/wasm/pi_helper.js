const createPIModule = require('./pi.js');

let library = null;

class FactoryMethod {
    constructor(kernelName) {
        this.kernelName = kernelName;
        this.kernels = [];
    }

    addKernel(kernel) {
        this.kernels.push(kernel);
    }

    createNode() {
        if (this.kernelName in library.Type) {
            // Value kernel
            const kernel = this.kernels[0];
            const args = this._valueNodeArgs(arguments);
            const inputType = library.Type.values[kernel.inputs[0].type];
            const node = library.valueNode(args.name, inputType, args.value, args.device);
            const outputTypeIdx = kernel.outputs[0].type;
            const outputType = library.Type.values[outputTypeIdx];
            const vv = node._output('value', outputType);
            const v = library._typeMap[outputTypeIdx]._cast(vv);
            if (args.initValue) {
                v.value = args.initValue;
            }
            return v;
        }
        const args = this._nodeArgs(arguments);
        const node = library.node(args.name, this.kernelName, args.inputs, args.device);
        const outputs = args.kernel.outputs;
        if (outputs.length === 0) {
            throw new Error("No outputs?");
        }
        if (outputs.length === 1) {
            const outputTypeIdx = args.kernel.outputs[0].type;
            const outputType = library.Type.values[outputTypeIdx];
            const vv = node._output(outputs[0].name, outputType);
            return library._typeMap[outputTypeIdx]._cast(vv);
        }
        let outputValues = {};
        for (let i = 0; i < outputs.length; ++i) {
            const outputTypeIdx = args.kernel.outputs[i].type;
            const outputType = library.Type.values[outputTypeIdx];
            const vv = node._output(outputs[i].name, outputType);
            outputValues[outputs[i].name] = library._typeMap[outputTypeIdx]._cast(vv);
        }
        return outputValues;
    }

    _nodeArgs(args) {
        let name = "bla";
        let device = library.Device.Unspecified;
        let positionalArgs = [...args];
        if (positionalArgs.length > 0 && positionalArgs[positionalArgs.length - 1] instanceof library.Device) {
            device = positionalArgs.pop();
        }
        if (positionalArgs.length > 0 && typeof positionalArgs[positionalArgs.length - 1] == 'string') {
            name = positionalArgs.pop();
        }

        let dictArgs = null;
        if (positionalArgs.length > 0) {
            if (Object.keys(positionalArgs[positionalArgs.length - 1]).length > 0) {
                dictArgs = positionalArgs.pop();
            }
        }
        if (dictArgs) {
            if ('name' in dictArgs) {
                name = dictArgs.name;
                delete dictArgs.name;
            }
            if ('device' in dictArgs) {
                device = dictArgs.device;
                delete dictArgs.device;
            }
        }
        const kernel = this._selectKernel(positionalArgs, dictArgs);

        let inputsMap = new library.InputsMap();
        if (positionalArgs) {
            for (let i = 0; i < positionalArgs.length; ++i) {
                inputsMap.set(kernel.inputs[i].name, positionalArgs[i]);
            }
        }
        if (dictArgs) {
            for (let e in dictArgs) {
                inputsMap.set(e, dictArgs[e]);
            }
        }
        return {inputs: inputsMap, name: name, device: device, kernel: kernel};
    }

    _selectKernel(positionalArgs, dictArgs) {
        let matchedKernels = [];
        let match = true;
        for (let kIdx = 0; kIdx < this.kernels.length; ++kIdx) {
            const kernel = this.kernels[kIdx];
            let inputs = [...kernel.inputs];
            if (positionalArgs) {
                for (let i = 0; i < positionalArgs.length; ++i) {
                    const inputType = library._typeMap[inputs[i].type];
                    if (!(positionalArgs[i] instanceof inputType)) {
                        match = false;
                        break;
                    }
                }
                if (!match) {
                    continue;
                }
                inputs = inputs.slice(positionalArgs.length);
            }
            if (dictArgs) {
                for (let i = 0; i < inputs.length; ++i) {
                    if (inputs[i].name in dictArgs) {
                        const inputType = library._typeMap[inputs[i].type];
                        if (!(dictArgs[inputs[i].name] instanceof inputType)) {
                            match = false;
                            break;
                        }
                    } else if (!inputs[i].optional) {
                        match = false;
                        break;
                    }
                }
            } else if (inputs.length > 0) {
                for (let i = 0; i < inputs.length; ++i) {
                    if (!inputs[i].optional) {
                        match = false;
                    }
                }
            }
            if (match) {
                matchedKernels.push(kernel);
            }
        }
        if (matchedKernels.length === 0) {
            throw new Error("Couldn't match a kernel.");
        }
        if (matchedKernels.length > 1) {
            let kernelsStr = "";
            matchedKernels.forEach(kernel => {
                kernelsStr += kernel.toString() + '\n';
            });
            throw new Error("More then one kernel candidate:\n" + kernelsStr);
        }
        return matchedKernels[0];
    }

    _valueNodeArgs(args) {
        let value = null;
        let initValue = null;
        if (args.length > 0 && args[0] != null) {
            if (args[0] instanceof library.VirtualValue) {
                value = args[0];
            } else {
                initValue = args[0];
            }
        }
        const name = args.length > 1 ? args[1] : "bla";
        const device = args.length > 2 ? args[2] : library.Device.Unspecified;
        return {value: value, initValue: initValue, name: name, device: device};
    }
};

class KernelInfo {
    constructor(name, type, inputs, outputs) {
        this.name = name;
        this.type = type;
        this.inputs = inputs;
        this.outputs = outputs;
    }

    toString() {
        let result = this.name + '(';
        let first = true;
        this.inputs.forEach(input => {
            if (first) {
                first = false;
            } else {
                result += ', ';
            }
            if (input.optional) {
                result += '[';
            }
            result += input.name + ': ' + library._typeNameMap[input.type];
            if (input.optional) {
                result += ']';
            }
        });
        result += '): ';
        if (this.outputs.length > 1) {
            result += '{';
        }
        first = true;
        this.outputs.forEach(output => {
            if (first) {
                first = false;
            } else {
                result += ', ';
            }
            result += output.name + ': ' + library._typeNameMap[output.type];
        });
        if (this.outputs.length > 1) {
            result += '{';
        }
        return result;
    }
};

function registerKernel(kernel) {
    const inputs = [];
    kernel.inputs.forEach(input => {
        inputs.push({name: input.name, type: input.type, optional: ("default" in input)});
    });
    const outputs = [];
    if (kernel.outputs) {
        kernel.outputs.forEach(output => {
            outputs.push({name: output.name, type: output.type});
        });
    }
    const kernelName = kernel.name;
    const kernelInfo = new KernelInfo(kernelName, kernel.type, inputs, outputs);

    let factory;
    if (kernelName in library._factoryMethods) {
        factory = library._factoryMethods[kernelName];
    } else {
        factory = new FactoryMethod(kernelName);
        library._factoryMethods[kernelName] = factory;
    }
    factory.addKernel(kernelInfo);
    library[kernelName] = factory.createNode.bind(factory);
}

async function initializeLibrary() {
    library = await createPIModule();
    const factory = new library.Factory();
    const obj = JSON.parse(factory.asJson());

    library._typeMap = {
        0: undefined,
        1: library.ValueInt,
        2: library.ValueFloat,
        3: library.ValuePoint2i,
        4: library.ValuePoint2f,
        5: library.ValueARGB8,
        6: library.ValueRGB8,
        7: library.ValueBuffer8,
        8: library.ValueBufferInt,
        9: library.ValueBufferFloat,
        10: library.ValueBufferARGB8,
        11: library.ValueBufferRGB8,
        12: library.ValueBufferPoint2i,
        13: library.ValueBufferPoint2f,
        14: library.ValueImage8,
        15: library.ValueImageFloat,
        16: library.ValueImageARGB8,
        17: library.ValueImageRGB8,
        18: library.ValueImageLAB8,
        19: library.ValueImageAlphaLAB8,
        20: library.ValueString,
        21: library.ValueLABf
    };
    library._typeNameMap = {
        0: "Undefined",
        1: "ValueInt",
        2: "ValueFloat",
        3: "ValuePoint2i",
        4: "ValuePoint2f",
        5: "ValueARGB8",
        6: "ValueRGB8",
        7: "ValueBuffer8",
        8: "ValueBufferInt",
        9: "ValueBufferFloat",
        10: "ValueBufferARGB8",
        11: "ValueBufferRGB8",
        12: "ValueBufferPoint2i",
        13: "ValueBufferPoint2f",
        14: "ValueImage8",
        15: "ValueImageFloat",
        16: "ValueImageARGB8",
        17: "ValueImageRGB8",
        18: "ValueImageLAB8",
        19: "ValueImageAlphaLAB8",
        20: "ValueString",
        21: "ValueLABf"
    };
    library._factoryMethods = {};
    const kernels = obj['kernels'];
    kernels.forEach(kernel => {
        registerKernel(kernel);
    });
    library.Session.prototype.accessGraph = function (functor) {
        try {
            library.SessionLock.lock(this);
            functor();
        } finally {
            library.SessionLock.unlock();
        }
    }
    return library;
}

function getLibrary() {
    return library;
}

exports.getLibrary = getLibrary;
exports.initializeLibrary = initializeLibrary;
