cmake_minimum_required(VERSION 3.5)
# project(PathfindingBackend)

target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src)
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/include)
add_library(${PROJECT_NAME} STATIC)