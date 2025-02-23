"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = require("./player");
class PlayerManager {
    static getPlayers() {
        return this.players;
    }
    static setPlayer(id, handler) {
        this.players[id] = handler;
        const player = new player_1.Player(handler);
        this._players.set(id, player);
    }
    static removePlayer(id) {
        delete this.players[id];
    }
}
PlayerManager.players = {};
PlayerManager._players = new Map();
exports.default = PlayerManager;
