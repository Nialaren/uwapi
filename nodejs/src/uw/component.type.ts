import {
    type Priority,
    type UnitStateFlags,
    type PlayerStateFlags,
    type PlayerConnectionClass,
    type ForceStateFlags,
    ForeignPolicyEnum,
} from './helpers';

export interface IUwProtoComponent {
    proto: number;
}

export interface IUwOwnerComponent {
    force: number;
}

export interface IUwControllerComponent {
    player: number;
    timestamp: number;
}

export interface IUwPositionComponent {
    position: number;
    yaw: number;
}

export interface IUwUnitComponent {
    state: UnitStateFlags;
    killCount: number;
}

export interface IUwLifeComponent {
    life: number;
}

export interface IUwMoveComponent {
    posStart: number;
    posEnd: number;
    tickStart: number;
    tickEnd: number;
    yawStart: number;
    yawEnd: number;
}

export interface IUwAimComponent {
    target: number;
}

export interface IUwRecipeComponent {
    recipe: number;
}

export interface IUwUpdateTimestampComponent {
    timestamp: number;
}

export interface IUwRecipeStatisticsComponent {
    timestamps: [number, number, number];
    completed: number;
}

export interface IUwPriorityComponent {
    priority: Priority;
}

export interface IUwAmountComponent {
    amount: number;
}

export interface IUwAttachmentComponent {
    target: number;
}

export interface IUwPlayerComponent {
    /**
     * char[28]
     */
    name: string;
    nameLength: number;
    /**
     * I64
     */
    steamUserId: number;
    force: number;
    /**
     * float
     */
    progress: number;
    ping: number;
    state: PlayerStateFlags;
    playerConnectionClass: PlayerConnectionClass;
}

export interface IUwForceComponent {
    /**
     * float[]
     */
    color: [number, number, number];
    /**
     * I64
     */
    score: number;
    killCount: number;
    lossCount: number;
    finishTimestamp: number;
    team: number;
    state: ForceStateFlags;
}

export interface IUwForceDetailsComponent {
    /**
     * I64
     */
    killValue: number;
    /**
     * I64
     */
    lossValue: number;
    startingPosition: number;
}

export interface IUwForeignPolicyComponent {
    forces: [number, number];
    policy: ForeignPolicyEnum;
}

export interface IUwDiplomacyProposalComponent {
    offeror: number;
    offeree: number;
    proposal: ForeignPolicyEnum;
}
