let map = {}; 

let previous_start_point_dom_id : any = null;
let previous_end_point_dom_id : any = null; 

let previous_path : Array<Position>;
let previous_structured_recordings : {[key: string]: any}; 

let play_resume_is_play : boolean = true; 
let is_paused : boolean = false;

let speeds_values : Array<number> = [1/8, 1/4, 1/2, 1, 2, 4, 8]; 
let speeds_text : Array<string> = ["<sup>1</sup>&frasl;<sub>8</sub>", "<sup>1</sup>&frasl;<sub>4</sub>", "<sup>1</sup>&frasl;<sub>2</sub>", "1", "2", "4", "8"]; 

let mouseDown: number = 0;
let current_speed : number = 1; 
let current_speed_index : number = 3;
let current_animation_show_index : number = 0;

interface Position {
    x: number; 
    y: number; 
}

interface RecordingSample {
    c: Position, 
    n: Position
}

interface RecordingSample extends Array<RecordingSample>{}
interface Position extends Array<Position>{}
interface AllReceivedData {
    path: Array<Position>,
    recording: Array<RecordingSample>
} 

function get_map_info() {
    fetch("api/map_info", { method: "GET"})
    .then((response) => response.json())
    .then((data) => {
        let width : number = parseInt(data.width);
        let height : number = parseInt(data.height); 

        create_grid(width, height); 
    });
}

function create_grid(width: number, height : number) {
    const container = document.getElementById("grid_container");

    container?.style.setProperty("--grid-rows", width.toString()); 
    container?.style.setProperty("--grid-cols", height.toString()); 

    for(let i = 0; i < width; i++) {
        for(let j = 0; j < height; j++) {

            let cell = document.createElement("div");
            cell.className = "cell"; 
            cell.id = "\{\"x\":" + i + ",\"y\":" + j + "}"; 
            cell.onmouseover = ()=> {

                if(!(mouseDown > 0))
                    return; 
                add_type_to_cell(cell.id, get_type_radio_choice()); 
            }
            cell.onmousedown = () => {
                add_type_to_cell(cell.id, get_type_radio_choice()); 
            }

            container?.appendChild(cell);
        }
    }
}

function get_type_radio_choice() : number {
    let start_checked = (document.getElementById("start") as HTMLInputElement).checked;
    let goal_checked = (document.getElementById("goal") as HTMLInputElement).checked;
    let obstacle_checked = (document.getElementById("obstacle") as HTMLInputElement).checked;

    return obstacle_checked ? 1 : start_checked ? 2 : goal_checked ? 3 : 0; 
}

function add_type_to_cell(this_id : string, type : number) {

    const positions = JSON.parse(this_id); 
    const container = document.getElementById(this_id);

    if(type == 1) {

        map[this_id] = 1; 
        container?.style.setProperty("background-color", "#FFFFFE"); 
        map[JSON.stringify(positions)] = type; 
    }
    else if(type == 2) {
        
        if(previous_start_point_dom_id != null) {

            delete map[previous_start_point_dom_id?.id]; 
            previous_start_point_dom_id?.style.setProperty("background-color", "#272936"); 
        }

        map[this_id] = 2; 

        previous_start_point_dom_id = container;
        container?.style.setProperty("background-color", "green"); 
    }
    else if(type == 3) {
        

        if(previous_end_point_dom_id != null) {
            delete map[previous_end_point_dom_id?.id]; 
            previous_end_point_dom_id?.style.setProperty("background-color", "#272936"); 
        }

        map[this_id] = 3; 

        previous_end_point_dom_id = container;
        container?.style.setProperty("background-color", "red"); 
    } else {

        remove_type_of_cell(this_id); 
    }
}

function show_results_without_animation(path : Array<Position>, structured_recordings: {[key: string]: any}) {

    let keys = Object.keys(structured_recordings); 

    for(let i = keys.length - 1; i >= 0; i--) {
        for(let j = 0; j < structured_recordings[keys[i]].length; j++) {
            const container = document.getElementById(JSON.stringify(structured_recordings[keys[i]][j]));
            
            if(container?.style.getPropertyValue("background-color") == "" || container?.style.getPropertyValue("background-color") == "pink" || container?.style.getPropertyValue("background-color") == "rgb(39, 41, 54)") {
                if(j == 0) {
                    container?.style.setProperty("background-color", "darkmagenta"); 
                } else {
                    container?.style.setProperty("background-color", "pink"); 
                }
            }
        }
    }

    for(let i = path.length - 2; i >= 0; i--) {
        const container = document.getElementById(JSON.stringify(path[i]));
        container?.style.setProperty("background-color", "orange"); 
    }
}

function show_result(path : Array<Position>, structured_recordings: {[key: string]: any}) {
    let keys = Object.keys(structured_recordings); 
    let n = keys.length - 1;

    function recurse_running_show_result() {
        
        setTimeout(()=> {
            if(!is_paused) { 
                for(let i = 0; i < structured_recordings[keys[current_animation_show_index]].length; i++) {
                        const container = document.getElementById(JSON.stringify(structured_recordings[keys[current_animation_show_index]][i]));
                        
                        if(container?.style.getPropertyValue("background-color") == "" || container?.style.getPropertyValue("background-color") == "pink" || container?.style.getPropertyValue("background-color") == "rgb(39, 41, 54)") {
                            if(i == 0) {
                                container?.style.setProperty("background-color", "darkmagenta"); 
                            } else {
                                container?.style.setProperty("background-color", "pink"); 
                            }
                        }
                    }

                    if(current_animation_show_index != n) {
                        recurse_running_show_result(); 
                        current_animation_show_index++; 
                    } else {
                        show_path(path); 
                    }
                } else {
                    recurse_running_show_result(); 
                }
        }, 10 / current_speed); 
    }

    current_animation_show_index = 0; 
    recurse_running_show_result();
}

function show_path(path : Array<Position>) {

    function recurse_running_show_path() {
        setTimeout(()=> {

            if(!is_paused) {

                const container = document.getElementById(JSON.stringify(path[current_animation_show_index]));
                container?.style.setProperty("background-color", "orange"); 

                if(current_animation_show_index != 1) {
                    current_animation_show_index--; 
                    recurse_running_show_path()
                }
            } else {
                recurse_running_show_path(); 
            }

        }, 250 / current_speed); 
    }

    current_animation_show_index = path.length - 2; 
    recurse_running_show_path(); 
}

function clear_all(path: Array<Position>, structured_recordings: {[key: string]: any}) {

    const all_cells = document.getElementsByClassName("cell"); 

    if(all_cells != undefined) {

        for(let i = 0; i < all_cells.length; i++) {
            
            const cell = all_cells[i];
            document.getElementById(cell.id)?.style.setProperty("background-color", "");
        }
    }
}

function redraw_map() {

    for(let key in map) {

        if(map[key] != 0) {
            add_type_to_cell(key, map[key]); 
        }
    }
}

function send() {

    let full_data_str = ""; 

    for (let key in map) {
        let value = map[key];

        if(value == 0) {
            continue; 
        }

        full_data_str +="x" + JSON.parse(key)?.x + "y" + JSON.parse(key)?.y + "t" + value;
    }

    let algorithm_str = (document.getElementById("algorithm_select") as HTMLSelectElement).value;
    
    fetch("api/find_path/" + algorithm_str + "/" + full_data_str, { method: "GET"})
    .then((response) => response.json())
    .then((data) => {

        let all_received_data: AllReceivedData = data; 

        let structured_recordings : {[key: string]: any} = structure_received_recording(all_received_data.recording);
        
        previous_path = all_received_data.path;
        previous_structured_recordings = structured_recordings;  

        show_result(all_received_data.path, structured_recordings); 

    });
}

function structure_received_recording(data: Array<RecordingSample>) {
    let structured_recordings : {[key: string]: any} = {};

    for (let value of data) {
        if(!structured_recordings[JSON.stringify(value.c)]) {
            structured_recordings[JSON.stringify(value.c)] = []; 
        }
        structured_recordings[JSON.stringify(value.c)].push(value.n); 
    }

    return structured_recordings;
}

function remove_type_of_cell(this_id : string) {
    const container = document.getElementById(this_id);
    container?.style.setProperty("background-color", "#272936"); 
}

window.addEventListener("load", (event) => {

    get_map_info(); 

    document.body.onmousedown = function() { 
        mouseDown++; 
    }
    document.body.onmouseup = function() {
        mouseDown--; 
    }

    document.getElementById("send_button")?.addEventListener("click", ()=> {

        if(previous_path != undefined && previous_structured_recordings != undefined)
            current_animation_show_index = 0; 
            clear_all(previous_path, previous_structured_recordings); 
            redraw_map();

        send();
    }); 
    document.getElementById("revert_button")?.addEventListener("click", ()=> {

        if(previous_path != undefined && previous_structured_recordings != undefined)
            current_animation_show_index = 0; 
            clear_all(previous_path, previous_structured_recordings); 
            redraw_map();
    }); 
    document.getElementById("forward_button")?.addEventListener("click", ()=> {

        if(previous_path != undefined && previous_structured_recordings != undefined)
            show_results_without_animation(previous_path, previous_structured_recordings); 
    });
    document.getElementById("resume_pause_button")?.addEventListener("click", ()=> {
        const element : HTMLImageElement = document.getElementById("resume_pause_button")?.getElementsByTagName("img")[0] as HTMLImageElement; 

        if(play_resume_is_play) {
            play_resume_is_play = false; 

            if(element != undefined)
                element.src = "resume.svg"

        } else {
            if(element != undefined)
                element.src = "pause.svg"

            play_resume_is_play = true; 
        }

        is_paused = !play_resume_is_play;
    }); 

    document.getElementById("lower_speed_button")?.addEventListener("click", ()=> {
        if(current_speed_index == 0) {
            return; 
        }

        current_speed_index--; 
        
        const element = document.getElementById("speed_text"); 

        if(element != undefined) {
            let speed_str = speeds_text[current_speed_index]; 
            current_speed = speeds_values[current_speed_index]; 
            element.innerHTML = speed_str; 
        }
    });

    document.getElementById("higher_speed_button")?.addEventListener("click", ()=> {

        if(current_speed_index == speeds_text.length - 1) {
            return; 
        }

        current_speed_index++; 

        const element = document.getElementById("speed_text"); 

       if(element != undefined) {
            let speed_str = speeds_text[current_speed_index]; 
            current_speed = speeds_values[current_speed_index]; 
            element.innerHTML = speed_str; 
        }
    });

    document.getElementById("erase_button")?.addEventListener("click", ()=> {
        
        // Resetting and deleting everything
        if(window.confirm("Sure you want to reset everything?")) {
            clear_all(previous_path, previous_structured_recordings); 
            map = {}; 
            previous_start_point_dom_id = null; 
            previous_end_point_dom_id = null; 
            previous_path = Array<Position>(); 
            previous_structured_recordings = {}; 
        }
    });
});