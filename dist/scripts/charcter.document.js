"use strict";
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    characters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Character" }],
    createdAt: { type: Date, default: Date.now },
});
const characterSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    attributes: {
        level: { type: Number, default: 1 },
        health: { type: Number, default: 100 },
        mana: { type: Number, default: 100 },
    },
    loggedIn: { type: Boolean, default: false },
    lastLogin: Date,
    createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);
const Character = mongoose.model("Character", characterSchema);
module.exports = { User, Character };
