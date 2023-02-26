use regex::Regex; 

pub fn create_map(data_string : String) -> Result<[usize; crate::FULL_SIZE], &'static str> {

    let mut map = [0usize; crate::FULL_SIZE];

    let re_expression = r#"x(\d+)y(\d+)t(\d+)"#; 
    let re = Regex::new(re_expression).unwrap();
    
    if  re.is_match(&data_string) == false {
        return Err("Wrong formatting or content of input string"); 
    }

    for captures in re.captures_iter(&data_string) {

        let x: usize = captures[1].parse().unwrap();
        let y: usize = captures[2].parse().unwrap();
        let t: usize = captures[3].parse().unwrap();

        let index = crate::convert_dimensions::convert_2D_to_1D(x, y);

        map[index] = t;
    }

    return Ok(map); 
}

pub fn find_type_t_on_map(map : [usize; crate::FULL_SIZE], t : usize) -> Result<(usize, usize), &'static str> {

    for i in 0..crate::FULL_SIZE - 1 {
        if map[i] == t {
            return Ok(crate::convert_dimensions::convert_1D_to_2D(i)); 
        }
    }

    Err("Could not find the point")
}

pub fn print_map(map : [usize; crate::FULL_SIZE]) {

    for i in 0..crate::WIDTH {
        print!("---");
    }

    print!("--\n"); 

    for i in 0..crate::FULL_SIZE {

        if i % crate::WIDTH == 0 {
            print!("|\n|"); 
        }

        let text = 
        if map[i] == crate::TRAVERSABLE {" "} else
        if map[i] == crate::OBSTACLE {"#"} else
        if map[i] == crate::STARTPOINT {"O"} else 
        if map[i] == crate::ENDPOINT {"X"} else
        {"E"};

        print!(" {} ", text);
    }

    print!("|\n");

    for i in 0..crate::WIDTH {
        print!("---");
    }

    print!("--\n"); 
}