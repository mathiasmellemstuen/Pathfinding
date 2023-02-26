use std::clone;

use priority_queue::PriorityQueue; 
use std::collections::binary_heap; 


pub fn find_path(from: (usize, usize), to: (usize, usize), map: [usize; crate::FULL_SIZE]) -> (Vec<(usize, usize)>, Vec<usize>) {

    let mut path : Vec<usize> = Vec::new();
    let mut progress_recording : Vec<(usize, usize)> = Vec::new();

    let mut distances : [usize; crate::FULL_SIZE] = [usize::MAX; crate::FULL_SIZE];
    let mut previous : [usize; crate::FULL_SIZE] = [usize::MAX; crate::FULL_SIZE];

    let from_index = crate::convert_dimensions::convert_2D_to_1D(from.0, from.1); 
    let to_index = crate::convert_dimensions::convert_2D_to_1D(to.0, to.1); 
    
    println!("From {from_index} To {to_index}"); 

    distances[from_index] = usize::MAX;

    let mut priority_queue: PriorityQueue<usize, usize> = PriorityQueue::new(); 

    priority_queue.push(from_index, usize::MAX); 

    while priority_queue.is_empty() == false {

        let mut current_index : usize;
        let current_distance : usize;

        {
            let (i, v) = priority_queue.peek().unwrap();
            current_index = i.clone();
            current_distance = v.clone();
        }

        priority_queue.pop(); 


        if current_index == to_index {
            while !(current_index == from_index) {

                path.push(current_index);

                current_index = previous[current_index];
            }

            path.push(from_index); 

            return (progress_recording, path); 
        }

        let neighbours = crate::get_neighbours::get_neighbours(current_index, map);

        progress_recording.push((current_index, current_index)); 

        for neighbour_index in neighbours {
            
            progress_recording.push((current_index, neighbour_index)); 

            if previous[neighbour_index] != usize::MAX {
                continue; 
            }

            let new_neighbour_distance = current_distance - 1;

            if new_neighbour_distance < distances[neighbour_index] {

                distances[neighbour_index] = new_neighbour_distance; 
                previous[neighbour_index] = current_index;

                priority_queue.push(neighbour_index, new_neighbour_distance); 
            }
        }
    }
    (progress_recording, path)
}