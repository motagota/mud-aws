"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCLogonHandler = void 0;
const colors = {
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
class SCLogonHandler {
    constructor(p_connection, p_io) {
        this.loginState = {
            username: "",
            awaitingPassword: false,
            isExistingUser: false,
            state: NEWCONNECTION,
            numberOfTries: 0,
        };
        this.stateHandlers = {
            [NEWCONNECTION]: this.handleNewConnection.bind(this),
            //   [NEWUSER]: this.handleNewUser.bind(this),
            //   [ENTERNEWPASS]: this.handleEnterNewPass.bind(this),
            //    [ENTERPASS]: this.handleEnterPass.bind(this),
        };
        this.m_connection = p_connection;
        this.m_io = p_io;
    }
    Enter() {
        this.m_connection.emit("message", `
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
`);
        this.m_connection.emit("message", `<green>Please enter your username, or 'new' if you are new:</green>`);
    }
    async Handle(p_data) {
        console.log(`handle ${p_data}`);
        const handler = this.stateHandlers[this.loginState.state];
        if (handler) {
            await handler(p_data);
        }
    }
    async handleNewConnection(data) {
        if (data.toLowerCase() === "new") {
            this.setState(NEWUSER, "Please enter your desired name: ", colors.yellow);
            return;
        }
    }
    SetHandler(handler) {
        throw new Error("Method not implemented.");
    }
    // Helper methods
    setState(newState, message, color) {
        this.loginState.state = newState;
        this.sendMessage(color, message);
    }
    sendMessage(color, text) {
        this.m_connection.emit("message", `${color}${text}${color}`);
    }
}
exports.SCLogonHandler = SCLogonHandler;
