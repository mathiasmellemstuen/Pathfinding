
pub fn convert_1D_to_2D(value: usize) -> (usize, usize) {
    (value % crate::WIDTH, value / crate::HEIGHT)
}

pub fn convert_2D_to_1D(x: usize, y: usize) -> usize {
    x + crate::WIDTH * y
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn convert_dimensions_test() {

        let value = 200; 
        let (x, y) = convert_1D_to_2D(value);
        let out_value = convert_2D_to_1D(x, y); 

        assert!(value == out_value); 
    }
}