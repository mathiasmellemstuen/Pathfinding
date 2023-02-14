#include <iostream>
#include <vector>
#include "Map.hpp"
#include "Cell.hpp"
#include "StatusCode.hpp"
#include "Dijktras.hpp"

int main() {

    int width = 5; 
    int height = 5; 

    Map map(width, height); 

    for(int i = 0; i < width; i++) {
        for(int j = 0; j < height; j++) {
            Cell cell;
            cell.point.x = i; 
            cell.point.y = j; 
            cell.cellType = CellType::TRAVERSABLE;
            cell.cost = 1;

            map.setCell(&cell, i, j); 
        }
    }

    Cell cell;
    cell.cellType = CellType::OBSTACLE;
    cell.cost = 1;

    map.setCell(&cell, 2, 0); 

    std::vector<Point*> path;

    Dijktras dijktras;

    if(dijktras.findPath({0,0}, {4,0}, map, &path) == StatusCode::SUCCESS) {
        std::cout << "PATH FOUND" << std::endl; 
        for(Point* p : path) {
            std::cout << "x: " << p->x << " y: " << p->y << std::endl; 
        }
    } else {
        std::cout << "PATH NOT FOUND" << std::endl; 
    }

    return 0; 
}