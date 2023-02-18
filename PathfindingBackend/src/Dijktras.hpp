#ifndef PATHFINDER_DIJKTRAS
#define PATHFINDER_DIJKTRAS

#include <vector>
#include "Point.hpp"
#include "StatusCode.hpp"
#include "Map.hpp"

class Dijktras {
    public:
        StatusCode findPath(const Point& from, const Point& to, const Map& map, std::vector<Point*>* path);
};
#endif