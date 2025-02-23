import { IHandler } from "./handler";
import { Player } from "./player";

class PlayerManager {
  private static players: { [key: string]: IHandler } = {};
  private static _players: Map<string, Player> = new Map();

  static getPlayers() {
    return this.players;
  }

  static setPlayer(id: string, handler: IHandler) {
    this.players[id] = handler;
    const player = new Player(handler);
    this._players.set(id, player);
  }

  static removePlayer(id: string) {
    delete this.players[id];
  }
}

export default PlayerManager;
