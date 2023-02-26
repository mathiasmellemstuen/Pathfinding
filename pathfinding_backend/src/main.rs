#[macro_use] extern crate rocket;

use map::find_type_t_on_map;
use rocket::fs::FileServer;

const WIDTH : usize = 32;
const HEIGHT: usize = 32; 
const FULL_SIZE: usize = WIDTH * HEIGHT; 
const TRAVERSABLE : usize = 0;
const OBSTACLE : usize = 1;
const STARTPOINT : usize = 2;
const ENDPOINT : usize = 3;

mod inside_bounds;
mod map;
mod convert_dimensions;
mod get_neighbours;
mod dijktras;


#[get("/map_info")]
fn map_info() -> String {
    format!(r#"{{ "width":{WIDTH}, "height":{HEIGHT}}}"#)
}
#[get("/find_path/<map>")]
fn find_path(map: &str) -> String {

    let final_map = map::create_map(String::from(map));

    if final_map.is_ok() {

        let start_result = find_type_t_on_map(final_map.unwrap(), crate::STARTPOINT);
        let end_result = find_type_t_on_map(final_map.unwrap(), crate::ENDPOINT);

        if start_result.is_ok() && end_result.is_ok() {
    
            let (progress_recording, path) = dijktras::find_path(start_result.unwrap(), end_result.unwrap(), final_map.unwrap());

            let mut return_str = format!(r#"{{"recording":["#); 

            for (current, neighbour) in progress_recording {
                
                let (current_x, current_y) = crate::convert_dimensions::convert_1D_to_2D(current); 
                let (neighbour_x, neighbour_y) = crate::convert_dimensions::convert_1D_to_2D(neighbour); 

                return_str.push_str(format!(r#"{{"c":{{"x":{current_x}, "y":{current_y}}}, "n":{{"x":{neighbour_x}, "y":{neighbour_y}}}}},"#).as_str());
            }
            return_str.pop(); 

            return_str.push_str(format!(r#"],"path": ["#).as_str()); 

            for item in path {
                let (x, y) = crate::convert_dimensions::convert_1D_to_2D(item); 
                return_str.push_str(format!(r#"{{"x":{x}, "y":{y}}},"#).as_str()); 
            }
            
            return_str.pop(); 
            return_str.push_str(r#"]}"#); 

            return return_str;
        }
    }
    "ERROR: Invalid map string".to_string()
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/api", routes![find_path, map_info])
}