pub fn inside_bounds(x: i32, y: i32) -> bool {
    return x>= 0 && y >= 0 && x < crate::WIDTH as i32 && y < crate::HEIGHT as i32;
}