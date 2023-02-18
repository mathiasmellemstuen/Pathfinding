#include "IndexFromPosition.hpp"

int getIndexFromPosition(int x, int y, int width) {
    return (y * width) + x;
}