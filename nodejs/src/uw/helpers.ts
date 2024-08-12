import { IEntity } from './entity.type';

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

export enum Priority {
    Disabled = 0,
    Normal = 1,
    High = 2,
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

export enum UnitStateFlags {
   None = 0,
   Shooting = 1 << 0,
   /**
    * processing recipe
    */
   Processing = 1 << 1,
   /**
    * changing recipe
    */
   Rebuilding = 1 << 2,
}

export enum PlayerStateFlags {
    None = 0,
    Loaded = 1 << 0,
    Pause = 1 << 1,
    Disconnected = 1 << 2,
    Admin = 1 << 3,
}

export enum PlayerConnectionClass {
    None = 0,
    Computer = 1,
    VirtualReality = 2,
    Robot = 3,
    UwApi = 4,
}

export enum ForceStateFlags {
   None = 0,
   Winner = 1 << 0,
   Defeated = 1 << 1,
   Disconnected = 1 << 2,
}

export enum ForeignPolicyEnum {
    None = 0,
    Self = 1,
    Ally = 2,
    Neutral = 3,
    Enemy = 4,
};


export const ENTITY_ATTRIBUTES = Object.freeze(<const>[
    'Proto',
    'Owner',
    'Controller',
    'Position',
    'Unit',
    'Life',
    'Move',
    'Aim',
    'Recipe',
    'UpdateTimestamp',
    'RecipeStatistics',
    'Priority',
    'Amount',
    'Attachment',
    'Player',
    'Force',
    'ForceDetails',
    'ForeignPolicy',
    'DiplomacyProposal',
]);

export interface ILogger {
    log: (severity: Severity, message: string, extra?: any) => void;
    error: (message: string, extra?: any) => void;
}

export function isKeyDefined(obj: IEntity, key: keyof IEntity) {
    return key in obj && typeof obj[key] !== 'undefined' && obj[key] !== null;
}

export function getLibName(isHardened = false) {
    return `libunnatural-uwapi${isHardened ? '-hard' : ''}.${process.platform === 'win32' ? 'dll' : 'so'}`
}
