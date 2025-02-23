export interface IHandler {
    Enter(): void;
    Handle(p_data: string): void;
    SetHandler(handler: IHandler): void;

  }
  