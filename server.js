const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose");
const players = require("./src/models/player_model");
const { MONGO_URL, PORT } = require("./config");



app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "src", "views"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/static", express.static(path.join(__dirname, "src", "public")))

mongoose.connect(MONGO_URL).then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log("connection failed", err + "");
})

app.get("/play", async (req, res) => {
    let best_player = await players.find().sort({ score: -1 }).limit(10)
    if (best_player.length) {
        let best_name = best_player[0].name;
        let best_score = best_player[0].score;
        res.render("index", { best_name, best_score, leaderboards: best_player})
    } else {
        res.render("index")
    }
})
app.post("/add_score", async (req, res) => {
    const { player, scored } = req.body;

    let winner = await players.findOne({
        name: player
    })
    if (!winner) {
        await players.create({
            name: player,
            score: Number(scored)
        })
    } else {
        if(winner.score < Number(scored)){
            await players.findOneAndUpdate({ name: player }, { score: scored })
        }
    }
})

app.listen(PORT, () => {
    console.log("server started at port")
})