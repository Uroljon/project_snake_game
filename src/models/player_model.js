const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 25,
    },
    score: {
        type: Number,
        required: true
    }
})
const players = mongoose.model("players", userSchema)
module.exports = players;