cmake_minimum_required(VERSION 3.5)
project(demo)
file(GLOB SOURSE *.cpp)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXECUTABLE_SUFFIX ".js")

SET(CMAKE_BUILD_TYPE Release)
SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O0 -s SAFE_HEAP=1 -g4 --source-map-base http://localhost:3000/  --bind") 
SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s ALLOW_MEMORY_GROWTH=1")
SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s USE_WEBGL2=1")
SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s ENVIRONMENT=web -s MODULARIZE=1 -s EXPORT_NAME='WASM' -s FORCE_FILESYSTEM=1 -lidbfs.js ") #-s EXPORT_ES6=1
SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} --pre-js ../pre.js")
add_executable(${CMAKE_PROJECT_NAME} ${SOURSE})

add_custom_command(TARGET ${CMAKE_PROJECT_NAME} POST_BUILD # copy demo.wasm
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
    ${CMAKE_SOURCE_DIR}/context.cpp
    ${CMAKE_SOURCE_DIR}/../public/context.cpp
    COMMENT "copy ${CMAKE_PROJECT_NAME}.wasm to static")
add_custom_command(TARGET ${CMAKE_PROJECT_NAME} POST_BUILD # copy demo.wasm
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
    ${CMAKE_SOURCE_DIR}/test.cpp
    ${CMAKE_SOURCE_DIR}/../public/test.cpp
    COMMENT "copy ${CMAKE_PROJECT_NAME}.wasm to static")
add_custom_command(TARGET ${CMAKE_PROJECT_NAME} POST_BUILD # copy demo.wasm
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
    ${CMAKE_SOURCE_DIR}/main.cpp
    ${CMAKE_SOURCE_DIR}/../public/main.cpp
    COMMENT "copy ${CMAKE_PROJECT_NAME}.wasm to static")
add_custom_command(TARGET ${CMAKE_PROJECT_NAME} POST_BUILD # copy demo.wasm
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
    ${CMAKE_CURRENT_BINARY_DIR}/${CMAKE_PROJECT_NAME}.wasm
    ${CMAKE_SOURCE_DIR}/../public/${CMAKE_PROJECT_NAME}.wasm
    COMMENT "copy ${CMAKE_PROJECT_NAME}.wasm to static")
add_custom_command(TARGET ${CMAKE_PROJECT_NAME} POST_BUILD # copy demo.wasm
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
    ${CMAKE_CURRENT_BINARY_DIR}/${CMAKE_PROJECT_NAME}.wasm.map
    ${CMAKE_SOURCE_DIR}/../public/${CMAKE_PROJECT_NAME}.wasm.map
    COMMENT "copy ${CMAKE_PROJECT_NAME}.wasm.map to static")
add_custom_command(TARGET ${CMAKE_PROJECT_NAME} POST_BUILD # copy demo.js
    COMMAND ${CMAKE_COMMAND} -E copy_if_different
    ${CMAKE_CURRENT_BINARY_DIR}/${CMAKE_PROJECT_NAME}.js
    ${CMAKE_SOURCE_DIR}/../src/wasm/${CMAKE_PROJECT_NAME}.js
    COMMENT "copy ${CMAKE_PROJECT_NAME}.js to static")