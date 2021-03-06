let run_interval_id = null;
let prev_dir = null;
let snake_speed = 150;
let apple = null;
let has_eaten = false;
let score = 0;
let snake_body = [];
let game_over = new Audio('/static/assets/game_over.ogg');
let eat_apple = new Audio("/static/assets/bite.mp3");
let muted = false;

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

// ===================================control snake=======================================
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
        // target snake
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
            return;
        }
        // if snake is dead
        for (let i = 0; i < snake_body.length; i++) {
            if (snake_body[i].x === x && snake_body[i].y === y) {
                clearInterval(run_interval_id) //game over
                muted ? "" : game_over.play();
                document.querySelector('#game_over_modal').classList.add("active");
                document.querySelector('#name').focus()
                snake_body.forEach((body) => {
                    body.tail.remove()
                });
                snake_body = [];
                return false
            }
        }
        // move snake_head one step
        snake.style.left = `${(x - 1) * 32.58}px`;
        snake.style.bottom = `${(y - 1) * 32.58}px`;
        snake.setAttribute("data-x", `${x}`)
        snake.setAttribute("data-y", `${y}`)
        // snake_head has moved !!!
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
        // if snake eats apple
        if (document.querySelector('#apple').getAttribute("data-x") == x && document.querySelector('#apple').getAttribute("data-y") == y) { //olmani yedi
            earn_score()
            create_tail(x, y)
        }

    }, snake_speed);
    prev_dir = dir;
}
function earn_score() {
    muted ? "" : eat_apple.play()
    score++;
    let x_rand = Math.ceil(Math.random() * 17)
    let y_rand = Math.ceil(Math.random() * 15)
// shu joyiga bir nima o'ylash kerak. While ga tushmadi
    for (let i = 0; i < snake_body.length; i++) {
        if (snake_body[i].x === x_rand && snake_body[i].y === y_rand) {
            x_rand = Math.ceil(Math.random() * 17)
            y_rand = Math.ceil(Math.random() * 15)
            // again = true;
            // break;
        } 
        // else {
        //     again = false
        // }
    }
    document.querySelectorAll('.score_val').forEach(element => {
        element.innerHTML = `${score}`
    });
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

document.querySelector('#show_leaderboards').addEventListener("click", () => {
    document.querySelector('#leaderboard_modal').classList.add("active");
});
document.querySelector('.close_leaderboards').addEventListener("click", (e) => {
    e.preventDefault()
    document.querySelector('#leaderboard_modal').classList.remove("active");
});
document.querySelector('#close_modal').addEventListener("click", (e) => {
    e.preventDefault()
    score = 0;
    document.querySelector('#game_over_modal').classList.remove("active");
});
document.querySelector('#mute').addEventListener("click", (e) => {
    if (muted) {
        e.target.src = "https://www.gstatic.com/images/icons/material/system/2x/volume_up_white_24dp.png";
        muted = false
    } else {
        e.target.src = "https://www.gstatic.com/images/icons/material/system/2x/volume_off_white_24dp.png";
        muted = true
    }
});
document.querySelector('#re_play').addEventListener("click", (e) => {
    window.location.reload()
});

document.querySelector('#submit').addEventListener("click", async (e) => {
    e.preventDefault()
    let player = document.querySelector('#name').value;
    if (player.length < 20 && player.length > 1) {
        document.querySelector('#game_over_modal').classList.remove("active");
        fetch("/add_score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                player,
                scored: score
            })
        })
    }
});

document.querySelector('#name').addEventListener("keyup", (e) => {
    if (e.target.value.length > 20) {
        document.querySelector('.name_error').classList.add("active");
    } else {
        document.querySelector('.name_error').classList.remove("active");
    }
});