#include <emscripten/html5.h>
#include <GLES2/gl2.h>
#include <EGL/egl.h>

class Context {
public:
    Context (int width, int height, char * id);

    ~Context (void);

    void run (uint8_t* buffer);

private:
    int width;
    int height;

    GLuint programObject;
    GLuint vertexShader;
    GLuint fragmentShader;

    EMSCRIPTEN_WEBGL_CONTEXT_HANDLE context;

};