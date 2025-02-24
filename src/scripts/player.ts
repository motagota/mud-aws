import { IHandler } from "./handler";

export class Player {
  handler: IHandler | undefined;

  loggedIn: boolean;

  constructor(handler?: IHandler) {
    this.handler = handler;

    this.loggedIn = false;
  }
}
