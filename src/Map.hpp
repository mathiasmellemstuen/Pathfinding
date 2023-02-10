#ifndef PATHFINDING_MAP
#define PATHFINDING_MAP

#include "CellType.hpp"
#include "StatusCode.hpp"
#include "Cell.hpp"

class Map {
    public:
        StatusCode setCell(Cell* cell, int x, int y);
        StatusCode getCell(Cell** cell, int x, int y); 
        Map(int width, int height); 
        ~Map();
    private: 
        int width;
        int height;
        Cell* allCells;
        inline int getIndexFromPosition(int x, int y);
        inline bool positionIsInsideBounds(int x, int y);
};
#endif