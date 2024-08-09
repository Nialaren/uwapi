import type {
    ConnectionState,
    GameState,
    MapState,
    OrderPriority,
    OrderType,
    Prototype,
    Severity,
} from './helpers';

export interface IUwMapInfo {
    name: string;
    guid: string;
    path: string;
    maxPlayers: number;
}

export interface IUwTile {
    position: [number, number, number];
    up: [number, number, number];
    neighborsIndices: number[];
    neighborsCount: number;
    terrain: Uint8Array;
    border: boolean;
}

export interface IUwProtoGeneric {
    type: Prototype;
    name: string;
    json: any;
}

export interface IUWLogData {
    message: string;
    component: string;
    severity: Severity;
}

export interface IUwShootingUnit {
    position: number;
    force: number;
    prototype: number;
    /**
     * beware, it may have expired
     */
    id: number;
}

export interface IUwShootingData {
    shooter: IUwShootingUnit;
    target: IUwShootingUnit;
}

export interface IUwShootingArray {
    data: IUwShootingData[];
    count: number;
}

export interface IUwIdsStruct {
    ids: number[];
    count: number;
}

// custom
export type UpdateCallbackType = (stepping: boolean) => void;
export type UnregisterUwCallback = () => void;

// global callbacks
export type UwLogCallbackType = (logData: IUWLogData) => void;
export type UwExceptionCallbackType = (message: string) => void;

// game state callbacks
export type UwConnectionCallbackType = (state: ConnectionState) => void;
export type UwGameStateCallbackType = (state: GameState) => void;
export type UwUpdateCallbackType = (tick: number, stepping: boolean) => void;
export type UwMapStateCallbackType = (state: MapState) => void;
export type UwShootingCallbackType = (data: IUwShootingArray) => void;


// MyPlayer
export interface IUwMyPlayer {
    playerEntityId: number;
    forceEntityId: number;
    primaryController: boolean;
    admin: boolean;
}



export interface IUwOrder {
    entity: number;
    position: number;
    order: OrderType;
    priority: OrderPriority;
}
