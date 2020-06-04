#include <stdio.h>
#include <stdlib.h>
#include <emscripten.h>
#include "context.h"
#include <iostream>

Context* contexts;

extern "C"
{
    EMSCRIPTEN_KEEPALIVE
    int readFile(char * path)
    {
        FILE *fp;
        fp = fopen(path, "r");
        char c;
        std::cout << "read from wasm START " << path << std::endl;
        while ((c = getc(fp)) != EOF) std::cout << c;
        std::cout << std::endl;
        std::cout << "read from wasm END" << std::endl;
        fclose(fp);
        return 0;
    }
    EMSCRIPTEN_KEEPALIVE
    int createFile(char * path)
    {
        emscripten_log(EM_LOG_NO_PATHS | EM_LOG_CONSOLE, "%s", path);
        std::cout << path << std::endl;
        FILE *fp;
        fp = fopen(path, "w");
        fputs("This is test string,", fp);
        fputs("This is test string 2.\n", fp);
        fputs("This is test string 3.\n", fp);
        fclose(fp);
        return 0;
    }
    EMSCRIPTEN_KEEPALIVE
    void clearContexts (void) {
        if (contexts) delete contexts;
    }

    EMSCRIPTEN_KEEPALIVE
    void createContext (int width, int height, char * id) {
        contexts = new Context(width, height, id);
        free(id);
    }

    EMSCRIPTEN_KEEPALIVE
    void loadTexture (uint8_t *buf, int bufSize) {
        printf("[WASM] Loading Texture %i \n", bufSize);
        contexts->run(buf);
        free(buf);
    }
}