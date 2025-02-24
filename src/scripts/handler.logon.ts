import { Server, Socket } from "socket.io";
import { IHandler } from "./handler";
import { Colors } from "./colors";

const colors: Colors = {
  system: "\x1b[35m", // Magenta
  error: "\x1b[31m", // Red
  chat: "\x1b[32m", // Green
  combat: "\x1b[31m", // Red
  info: "\x1b[36m", // Cyan
  yellow: "\x1b[33m", // yellow
  reset: "\x1b[0m", // Reset
};

const NEWCONNECTION = "NEWCONNECTION";
const NEWUSER = "NEWUSER";
const ENTERNEWPASS = "ENTERNEWPASS";
const ENTERPASS = "ENTERPASS";

export class SCLogonHandler implements IHandler {
  private m_connection: Socket;
  private m_io: Server;

  private loginState = {
    username: "",
    awaitingPassword: false,
    isExistingUser: false,
    state: NEWCONNECTION,
    numberOfTries: 0,
  };

  private readonly stateHandlers: {
    [key: string]: (data: string) => Promise<void>;
  } = {
    [NEWCONNECTION]: this.handleNewConnection.bind(this),
    [NEWUSER]: this.handleNewUser.bind(this),
    //   [ENTERNEWPASS]: this.handleEnterNewPass.bind(this),
    //    [ENTERPASS]: this.handleEnterPass.bind(this),
  };

  constructor(p_connection: Socket, p_io: Server) {
    this.m_connection = p_connection;
    this.m_io = p_io;
  }
  Enter(): void {
    this.m_connection.emit(
      "message",
      `
<green>
┌─────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░  ░░░░░░░░░░  ░░░░░░░░░░  ░░░░░░░░░░░░░░     │
│  ▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒▒▒  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒     │
│  ▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │
│  ██████████  ██████████  ██████████  ██████████████     │
│                                                         │
│<cyan>█████╗ ███████╗ ███████╗    ███╗   ███╗██╗   ██╗██████╗  </cyan>│
│<cyan>╚══██║ ██╔════╝ ██╔════╝    ████╗ ████║██║   ██║██╔══██╗ </cyan>│
│<cyan>   ██║ ███████╗ ███████╗    ██╔████╔██║██║   ██║██║  ██║ </cyan>│
│<cyan>██ ██║ ██╔════╝ ╚════██║    ██║╚██╔╝██║██║   ██║██║  ██║ </cyan>│
│<cyan>╚████║ ███████╗ ███████║    ██║ ╚═╝ ██║╚██████╔╝██████╔╝ </cyan>│
│<cyan> ╚═══╝ ╚══════╝ ╚══════╝    ╚═╝     ╚═╝ ╚═════╝ ╚═════╝  </cyan>│
│                                                         │
│<yellow>       A modern multiplayer text adventure realm       </yellow>   │
└─────────────────────────────────────────────────────────┘
</green>
`
    );

    this.m_connection.emit(
      "message",
      `<green>Please enter your username, or 'new' if you are new:</green>`
    );
  }

  async Handle(p_data: string) {
    console.log(`handle ${p_data}`);
    const handler = this.stateHandlers[this.loginState.state];
    if (handler) {
      await handler(p_data);
    }
  }

  private async handleNewConnection(data: string) {
    if (data.toLowerCase() === "new") {
      this.setState(NEWUSER, "Please enter your desired name: ", colors.yellow);
      return;
    }
  }

  private async handleNewUser(data: string) {
    try {
    } catch (error) {
      this.sendError("Error processing username. Please try again.");
    }
  }
  SetHandler(handler: IHandler): void {
    throw new Error("Method not implemented.");
  }

  // Helper methods
  private setState(newState: string, message: string, color: string) {
    this.loginState.state = newState;
    this.sendMessage(color, message);
  }

  public sendMessage(color: string, text: string) {
    this.m_connection.emit("message", `${color}${text}${color}`);
  }

  private sendError(text: string) {
    this.sendMessage(colors.error, text);
  }
}
