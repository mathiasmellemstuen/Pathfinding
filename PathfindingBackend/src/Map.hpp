#ifndef PATHFINDING_MAP
#define PATHFINDING_MAP

#include "CellType.hpp"
#include "StatusCode.hpp"
#include "Cell.hpp"

class Map {
    public:
        int width;
        int height;
        StatusCode setCell(Cell* cell, int x, int y) const;
        StatusCode getCell(Cell** cell, int x, int y) const; 
        Map(int width, int height); 
        ~Map();
    private: 
        Cell* allCells;
        inline bool positionIsInsideBounds(int x, int y) const;
};
#endif