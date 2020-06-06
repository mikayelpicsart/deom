#include <emscripten/bind.h>
#include <iostream>

using namespace emscripten;

class MyClass
{
public:
    MyClass(int x, std::string y)
        : x(x), y(y)
    {
    }

    void incrementX()
    {
        ++x;
    }

    int getX() const { return x; }
    void setX(int x_) { x = x_; }

    static std::string getStringFromInstance(const MyClass &instance)
    {
        return instance.y;
    }
    static int error(int test)
    {
        return (int)10 / test;
    }

private:
    int x;
    std::string y;
};

// Binding code
EMSCRIPTEN_BINDINGS(my_class_example)
{
    class_<MyClass>("MyClassTEXT")
        .constructor<int, std::string>()
        .function("incrementX", &MyClass::incrementX)
        .property("x", &MyClass::getX, &MyClass::setX)
        .class_function("getStringFromInstance", &MyClass::getStringFromInstance)
        .class_function("error", &MyClass::error);
}