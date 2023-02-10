#ifndef PATHFINDING_CELL
#define PATHFINDING_CELL

#include "CellType.hpp"

struct Cell {
    CellType cellType = CellType::TRAVERSABLE; 
    int cost = 1; 
};
#endif