export enum Severity {
    Note = 0,
    Hint = 1,
    Warning = 2,
    Info = 3,
    Error = 4,
    Critical = 5,
}


export enum ConnectionState {
    NONE = 0,
    Connecting = 1,
    Connected = 2,
    Disconnecting = 3,
    Error = 4,
}

export enum MapState {
    NONE = 0,
    Downloading = 1,
    Loading = 2,
    Loaded = 3,
    Unloading = 4,
    Error = 5,
}

export enum GameState {
    NONE = 0,
    Session = 1,
    Preparation = 2,
    Game = 3,
    Finish = 4,
}

export enum OrderType {
    NONE = 0,
    Stop = 1,
    Guard = 2,
    Run = 3,
    Fight = 4,
    Load = 5,
    Unload = 6,
    SelfDestruct = 7,
}

export enum OrderPriority {
    NONE = 0,
    Assistant = 1 << 0,
    User = 1 << 1,
    Enqueue = 1 << 2,
    Repeat = 1 << 3,
}


export enum Prototype {
    NONE = 0,
    Resource = 1,
    Recipe = 2,
    Construction = 3,
    Unit = 4,
}

export enum OverviewFlags {
    NONE = 0,
    Resource = 1 << 0,
    Construction = 1 << 1,
    MobileUnit = 1 << 2,
    StaticUnit = 1 << 3,
    Unit = (1 << 2) | (1 << 3),
}

export interface ILogger {
    log: (severity: Severity, message: string, extra?: any) => void;
    error: (message: string, extra?: any) => void;
}

export function getLibName(isHardened = false) {
    return `libunnatural-uwapi${isHardened ? '-hard' : ''}.${process.platform === 'win32' ? 'dll' : 'so'}`
}
