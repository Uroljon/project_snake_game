let run_interval_id = null;
let prev_dir = null;
let snake_speed = 150;
let apple = null;
let has_eaten = false;
let score = 0;
let snake_body = [];
function init_game() {
    let game = document.querySelector('.game');
    for (let y = 15; y > 0; y--) {
        for (let x = 1; x <= 17; x++) {
            if (y % 2 !== 0) { //toq => white
                game.innerHTML += `<div class="square ${x % 2 !== 0 ? 'white' : 'black'}" data-x="${x}" data-y="${y}"></div>` //toq =>white
            } else {
                game.innerHTML += `<div class="square ${x % 2 !== 0 ? 'black' : 'white'}" data-x="${x}" data-y="${y}"></div>` //toq => black
            }
        }
    }
    let x_rand = Math.ceil(Math.random() * 17)
    let y_rand = Math.ceil(Math.random() * 15)
    game.innerHTML += `<span id="apple" data-x="${x_rand}" data-y="${y_rand}" style="left:${(x_rand - 1) * 32.58}px; bottom: ${(y_rand - 1) * 32.58}px">🍎</span>`
}
init_game()
// control snake
document.body.addEventListener("keydown", (e) => {
    if ((e.key == "ArrowRight" && prev_dir !== "ArrowLeft") || (e.key == "ArrowLeft" && prev_dir !== "ArrowRight") || (e.key == "ArrowDown" && prev_dir !== "ArrowUp") || (e.key == "ArrowUp" && prev_dir !== "ArrowDown") || (e.key === " ")) {
        move(e.key)
    }
})

function move(dir) {
    let snake = document.querySelector('.snake');
    clearInterval(run_interval_id) //har safar keyboard bosilganda eski interval ochiriladi
    run_interval_id = setInterval(() => {
        let game = document.querySelector('.game');
        let x = Number(snake.getAttribute("data-x"))
        let y = Number(snake.getAttribute("data-y"));

        // =============================SNAKE UCHUN========================================
        if (dir == "ArrowRight" && prev_dir !== "ArrowLeft") {
            (x === 17) ? x = 1 : x++;
        } else if (dir == "ArrowLeft" && prev_dir !== "ArrowRight") {
            (x === 1) ? x = 17 : x--;
        } else if (dir == "ArrowDown" && prev_dir !== "ArrowUp") {
            (y === 1) ? y = 15 : y--;
        } else if (dir == "ArrowUp" && prev_dir !== "ArrowDown") {
            (y === 15) ? y = 1 : y++;
        } else if (dir === " ") { //stop snake
            clearInterval(run_interval_id)
        }
        for (let i = 0; i < snake_body.length; i++) {
            if (snake_body[i].x === x && snake_body[i].y === y) {
                clearInterval(run_interval_id) //game over
                return false
            }
        }
        snake.style.left = `${(x - 1) * 32.58}px`;
        snake.style.bottom = `${(y - 1) * 32.58}px`;
        snake.setAttribute("data-x", `${x}`)
        snake.setAttribute("data-y", `${y}`)
        // ==========================snake 1 qadam yurdi...===============================
        // move snake_body
        if (snake_body.length) {
            if (snake_body.length === 1) {
                game.append(snake_body[snake_body.length - 1].tail);
                create_tail(x, y)
            } else {
                snake_body[0].tail.remove();
                snake_body.shift()
                game.append(snake_body[snake_body.length - 1].tail);
                create_tail(x, y)
            }
        }

        if (document.querySelector('#apple').getAttribute("data-x") == x && document.querySelector('#apple').getAttribute("data-y") == y) { //olmani yedi
            earn_score()
            create_tail(x, y)
        }

    }, snake_speed);
    prev_dir = dir;
}
function earn_score() {
    score++;
    let x_rand = Math.ceil(Math.random() * 17)
    let y_rand = Math.ceil(Math.random() * 15)
    // while (snake_body.includes(document.querySelector(`[data-x="${x_rand}"]`))) {
    //     x_rand = Math.ceil(Math.random() * 17)
    // }
    // while (snake_body.includes(document.querySelector(`[data-y="${y_rand}"]`))) {
    //     y_rand = Math.ceil(Math.random() * 15)
    // }
    document.querySelector('#score_val').innerHTML = `${score}`
    document.querySelector('#apple').setAttribute("data-x", `${x_rand}`)
    document.querySelector('#apple').setAttribute("data-y", `${y_rand}`)
    document.querySelector('#apple').style.left = `${(x_rand - 1) * 32.58}px`
    document.querySelector('#apple').style.bottom = `${(y_rand - 1) * 32.58}px`
}
function create_tail(x, y) {
    let tail = document.createElement("div");
    tail.classList.add("snake")
    tail.classList.add("tail")
    tail.setAttribute("tail-x", x)
    tail.setAttribute("tail-y", y)
    tail.style.left = `${(x - 1) * 32.58}px`;
    tail.style.bottom = `${(y - 1) * 32.58}px`;
    snake_body.push({
        tail,
        x,
        y
    })
}

/* TRASH
 // let snake = document.querySelector('.snake');
    // let dir = e.key;
    {


        // function move_snake(x, y) {
        //     snake.style.left = `${(x - 1) * 32.58}px`;
        //     snake.style.bottom = `${(y - 1) * 32.58}px`;
        //     snake.setAttribute("data-x", `${x}`)
        //     snake.setAttribute("data-y", `${y}`)
        // }
        // if (dir == "ArrowRight" && prev_dir !== "ArrowLeft") {
        //     clearInterval(run_interval_id)
        //     run_interval_id = setInterval(() => {
        //         let x = Number(snake.getAttribute("data-x"))
        //         let y = Number(snake.getAttribute("data-y"));
        //         (x === 17) ? x = 1 : x++;
        //         move_snake(x, y)
        //     }, snake_speed);

        //     prev_dir = dir;

        // } else if (dir == "ArrowLeft" && prev_dir !== "ArrowRight") {
        //     clearInterval(run_interval_id)

        //     run_interval_id = setInterval(() => {
        //         let x = Number(snake.getAttribute("data-x"));
        //         let y = Number(snake.getAttribute("data-y"));
        //         (x === 1) ? x = 17 : x--;
        //         move_snake(x, y)
        //     }, snake_speed);

        //     prev_dir = dir;

        // } else if (dir == "ArrowDown" && prev_dir !== "ArrowUp") {
        //     clearInterval(run_interval_id)

        //     run_interval_id = setInterval(() => {
        //         let x = Number(snake.getAttribute("data-x"));
        //         let y = Number(snake.getAttribute("data-y"));
        //         (y === 1) ? y = 15 : y--;
        //         move_snake(x, y)
        //     }, snake_speed);

        //     prev_dir = dir;

        // } else if (dir == "ArrowUp" && prev_dir !== "ArrowDown") {
        //     clearInterval(run_interval_id)

        //     run_interval_id = setInterval(() => {
        //         let x = Number(snake.getAttribute("data-x"));
        //         let y = Number(snake.getAttribute("data-y"));
        //         (y === 15) ? y = 1 : y++;
        //         move_snake(x, y)
        //     }, snake_speed);

        //     prev_dir = dir;

        // } else if (dir === " ") { //stop snake
        //     clearInterval(run_interval_id)
        // }
    }


     // let tail = document.createElement("div");
            // tail.classList.add("snake")
            // tail.classList.add("tail")
            // tail.setAttribute("tail-x", x)
            // tail.setAttribute("tail-y", y)
            // tail.style.left = `${(x - 1) * 32.58}px`;
            // tail.style.bottom = `${(y - 1) * 32.58}px`;
            // snake_body.push(tail)
            // snake_body.shift()
            // document.querySelector(`[tail-x = "${x}"]`)
            // document.querySelector(`[tail-x = "${snake_body[0].x}"]`).remove();
            // document.querySelector(`[tail-x = "${snake_body[0].x}"]`).setAttribute("data-x", `${x}`)
            // snake.setAttribute("data-y", `${y}`)
*/