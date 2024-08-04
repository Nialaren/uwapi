import type {
    ConnectionState,
    GameState,
    MapState,
    Severity,
} from './helpers';

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



