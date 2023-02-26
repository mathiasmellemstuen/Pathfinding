pub fn get_neighbours(index: usize, map: [usize; crate::FULL_SIZE]) -> Vec<usize> {

    let (x, y) = crate::convert_dimensions::convert_1D_to_2D(index); 

    let mut neighbours: Vec<usize> = Vec::new();

    if crate::inside_bounds::inside_bounds(x as i32 + 1, y as i32) && map[crate::convert_dimensions::convert_2D_to_1D(x + 1, y)] != crate::OBSTACLE  {
        neighbours.push(crate::convert_dimensions::convert_2D_to_1D(x + 1, y))
    }
    
    if crate::inside_bounds::inside_bounds(x as i32 - 1, y as i32) && map[crate::convert_dimensions::convert_2D_to_1D(x - 1, y)] != crate::OBSTACLE {
        neighbours.push(crate::convert_dimensions::convert_2D_to_1D(x - 1, y))
    }

    if crate::inside_bounds::inside_bounds(x as i32, y as i32 + 1) && map[crate::convert_dimensions::convert_2D_to_1D(x, y + 1)] != crate::OBSTACLE {
        neighbours.push(crate::convert_dimensions::convert_2D_to_1D(x, y + 1))
    }

    if crate::inside_bounds::inside_bounds(x as i32, y as i32 - 1) && map[crate::convert_dimensions::convert_2D_to_1D(x, y - 1)] != crate::OBSTACLE {
        neighbours.push(crate::convert_dimensions::convert_2D_to_1D(x, y - 1))
    }

    if crate::inside_bounds::inside_bounds(x as i32 + 1, y as i32 + 1) && map[crate::convert_dimensions::convert_2D_to_1D(x + 1, y + 1)] != crate::OBSTACLE {
        neighbours.push(crate::convert_dimensions::convert_2D_to_1D(x + 1, y + 1))
    }

    if crate::inside_bounds::inside_bounds(x as i32 - 1, y as i32 - 1) && map[crate::convert_dimensions::convert_2D_to_1D(x - 1, y - 1)] != crate::OBSTACLE {
        neighbours.push(crate::convert_dimensions::convert_2D_to_1D(x - 1, y - 1))
    }
    
    if crate::inside_bounds::inside_bounds(x as i32 + 1, y as i32 - 1) && map[crate::convert_dimensions::convert_2D_to_1D(x + 1, y - 1)] != crate::OBSTACLE {
        neighbours.push(crate::convert_dimensions::convert_2D_to_1D(x + 1, y - 1))
    }

    if crate::inside_bounds::inside_bounds(x as i32 - 1, y as i32 + 1) && map[crate::convert_dimensions::convert_2D_to_1D(x - 1, y + 1)] != crate::OBSTACLE {
        neighbours.push(crate::convert_dimensions::convert_2D_to_1D(x - 1, y + 1))
    }

    neighbours
}