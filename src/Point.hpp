#ifndef PATHFINDING_POINT
#define PATHFINDING_POINT

struct Point {
    int x = 0; 
    int y = 0; 

    bool operator==(const Point& rhs) {
        return x == rhs.x && y == rhs.y; 
    }
}; 
#endif