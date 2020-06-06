/* eslint-disable */

Module['locateFile'] = function (path, scriptDirectory) {
    if(['wasm', 'map'].includes(path.split('.').pop())) {
        return path;
    }
    return scriptDirectory + path;
}