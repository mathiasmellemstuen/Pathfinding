#include "Dijktras.hpp"
#include "IndexFromPosition.hpp"
#include <vector>
#include <limits>
#include <iostream>
#include <algorithm>

struct DijtrasNode {
    Point* point; 
    uint32_t score; 
    DijtrasNode* previous = nullptr;

    bool operator==(const DijtrasNode& rhs) {
        return *point == *rhs.point; 
    }
}; 

std::vector<Point*> getNeighbours(const DijtrasNode& current, const Map& map) {
    std::vector<Point*> neighbours;
    Cell* cell = nullptr; 

    if(map.getCell(&cell, current.point->x + 1, current.point->y) == StatusCode::SUCCESS && cell->cellType != CellType::OBSTACLE) {
        neighbours.push_back(&cell->point);
    }
    
    if(map.getCell(&cell, current.point->x - 1, current.point->y) == StatusCode::SUCCESS && cell->cellType != CellType::OBSTACLE) {
        neighbours.push_back(&cell->point);
    }
    
    if(map.getCell(&cell, current.point->x, current.point->y + 1) == StatusCode::SUCCESS && cell->cellType != CellType::OBSTACLE) {
        neighbours.push_back(&cell->point);
    }

    if(map.getCell(&cell, current.point->x, current.point->y - 1) == StatusCode::SUCCESS && cell->cellType != CellType::OBSTACLE) {
        neighbours.push_back(&cell->point);
    }

    if(map.getCell(&cell, current.point->x + 1, current.point->y + 1) == StatusCode::SUCCESS && cell->cellType != CellType::OBSTACLE) {
        neighbours.push_back(&cell->point);
    }

    if(map.getCell(&cell, current.point->x + 1, current.point->y - 1) == StatusCode::SUCCESS && cell->cellType != CellType::OBSTACLE) {
        neighbours.push_back(&cell->point);
    }

    if(map.getCell(&cell, current.point->x - 1, current.point->y + 1) == StatusCode::SUCCESS && cell->cellType != CellType::OBSTACLE) {
        neighbours.push_back(&cell->point);
    }

    if(map.getCell(&cell, current.point->x - 1, current.point->y - 1) == StatusCode::SUCCESS && cell->cellType != CellType::OBSTACLE) {
        neighbours.push_back(&cell->point);
    }

    return neighbours;
}

StatusCode Dijktras::findPath(const Point& from, const Point& to, const Map& map, std::vector<Point*>* path) {

    int n = map.width * map.height;

    std::vector<DijtrasNode> allNodes;
    allNodes.resize(n);

    std::vector<DijtrasNode*> remaining;

    for(int i = 0; i < n; i++) {
        
        Cell* cell; 
        map.getCell(&cell, i % map.width, i / map.height);

        DijtrasNode node; 
        node.point = &(cell->point); 
        node.score = std::numeric_limits<uint32_t>::max() - 1; 
        allNodes[i] = node;
        remaining.push_back(&allNodes[i]); 
    }

    remaining.at(getIndexFromPosition(from.x, from.y, map.width))->score = 0;


    while(remaining.size() != 0) {

        DijtrasNode* current = remaining[0]; 

        for(DijtrasNode* node : remaining) {
            if(current->score > node->score) {
                current = node; 
            }
        }

        remaining.erase(std::remove(remaining.begin(), remaining.end(), current), remaining.end());

        if(current->point->x == to.x && current->point->y == to.y) {

            while(!(current->point->x == from.x && current->point->y == from.x)) {

                path->push_back(current->point);
                current = current->previous;
            }

            return StatusCode::SUCCESS;
        }
        std::vector<Point*> neighbours = getNeighbours(*current, map);

        for(Point* neighbour : neighbours) {
            for(DijtrasNode* neighbourNode : remaining) {
                if(neighbour->x == neighbourNode->point->x && neighbour->y == neighbourNode->point->y) {

                    Cell* neighbourCell = nullptr; 
                    map.getCell(&neighbourCell, neighbour->x, neighbour->y); 

                    uint32_t neighbourScore = current->score + neighbourCell->cost; 

                    if(neighbourScore < neighbourNode->score) {
                        neighbourNode->score = neighbourScore; 
                        neighbourNode->previous = current;
                    }
                }
            }
        }

    }
    return StatusCode::PATH_NOT_FOUND; 
};