#ifndef PATHFINDING_CELL
#define PATHFINDING_CELL

#include "CellType.hpp"
#include <stdint.h>
#include "Point.hpp"

struct Cell {
    Point point; 
    CellType cellType = CellType::TRAVERSABLE; 
    uint32_t cost = 1;
};
#endif