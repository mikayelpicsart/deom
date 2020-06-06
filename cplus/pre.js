/* eslint-disable */

Module['locateFile'] = function (path, scriptDirectory) {
    typeof readyPromiseReject === 'function'; // for eslint use readyPromiseReject 
    if(['wasm', 'map'].includes(path.split('.').pop())) {
        return path;
    }
    return scriptDirectory + path;
}