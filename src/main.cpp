#include <iostream>
#include "Map.hpp"
#include "Cell.hpp"
#include "StatusCode.hpp"

int main() {

    int width = 2; 
    int height = 2; 

    Map map(width, height); 

    for(int i = 0; i < width; i++) {
        for(int j = 0; j < height; j++) {
            Cell cell;
            cell.cellType = CellType::TRAVERSABLE;
            cell.cost = i + j + 1;

            map.setCell(&cell, i, j); 
        }
    }

    for(int i = 0; i < width; i++) {
        for(int j = 0; j < height; j++) {
            Cell* cell = nullptr; 
            StatusCode status = map.getCell(&cell, i, j); 
            std::cout << cell->cost << std::endl; 
        }
    }

    std::cout << "Hello world." << std::endl; 
    return 0; 
}