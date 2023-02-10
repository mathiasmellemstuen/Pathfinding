#include "Map.hpp"
#include "StatusCode.hpp"

#include <cstdlib>
#include <iostream>

bool Map::positionIsInsideBounds(int x, int y) {
    return x >= 0 && y >= 0 && x < this->width && y < this->height; 
}

int Map::getIndexFromPosition(int x, int y) {
    return (y * this->width) + x;
}

StatusCode Map::setCell(Cell* cell, int x, int y) {

    if(!positionIsInsideBounds(x, y)) {
        return StatusCode::OUT_OF_BOUNDS; 
    }
    
    int index = getIndexFromPosition(x, y);

    allCells[index].cost = cell->cost; 
    allCells[index].cellType = cell->cellType; 

    return StatusCode::SUCCESS;
}

StatusCode Map::getCell(Cell** cell, int x, int y) {
    
    if(!positionIsInsideBounds(x, y)) {
        return StatusCode::OUT_OF_BOUNDS; 
    }
    
    int index = getIndexFromPosition(x, y);
    *cell = allCells + index;
    
    return StatusCode::SUCCESS;
}

Map::Map(int width, int height) {

    this->width = width; 
    this->height = height; 

    // Allocating the memory for the map, allocating the map in a 1D array for memory efficiency
    allCells = (Cell*)malloc(width * height * sizeof(Cell));
}

Map::~Map() {
    std::cout << "Freeing" << std::endl;
    free(allCells);
}