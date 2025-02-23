import { IHandler } from "./handler";

export class Player {
  handler: IHandler | undefined;

  constructor(handler?: IHandler) {
    this.handler = handler;
  }
}
