#include "Map.hpp"
#include "StatusCode.hpp"
#include "IndexFromPosition.hpp"

#include <cstdlib>
#include <iostream>

bool Map::positionIsInsideBounds(int x, int y) const {
    return x >= 0 && y >= 0 && x < this->width && y < this->height; 
}

StatusCode Map::setCell(Cell* cell, int x, int y) const {

    if(!positionIsInsideBounds(x, y)) {
        return StatusCode::OUT_OF_BOUNDS; 
    }
    
    int index = getIndexFromPosition(x, y, this->width);

    allCells[index] = *cell;

    return StatusCode::SUCCESS;
}

StatusCode Map::getCell(Cell** cell, int x, int y) const {
    
    if(!positionIsInsideBounds(x, y)) {
        return StatusCode::OUT_OF_BOUNDS; 
    }

    int index = getIndexFromPosition(x, y, this->width);
    *cell = allCells + index;

    return StatusCode::SUCCESS;
}

Map::Map(int width, int height) {

    this->width = width; 
    this->height = height; 

    // Allocating the memory for the map, allocating the map in a 1D array for memory efficiency
    allCells = (Cell*)malloc(width * height * sizeof(Cell));

    // Setting all corresponding posisions
    for(int i = 0; i < width * height; i++) {
        allCells[i].point = {i % this->width, i / this->height};
    }
}

Map::~Map() {
    free(allCells);
}