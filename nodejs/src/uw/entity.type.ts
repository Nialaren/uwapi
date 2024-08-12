import type {
    IUwAimComponent,
    IUwAmountComponent,
    IUwAttachmentComponent,
    IUwControllerComponent,
    IUwDiplomacyProposalComponent,
    IUwForceComponent,
    IUwForceDetailsComponent,
    IUwForeignPolicyComponent,
    IUwLifeComponent,
    IUwMoveComponent,
    IUwOwnerComponent,
    IUwPlayerComponent,
    IUwPositionComponent,
    IUwPriorityComponent,
    IUwProtoComponent,
    IUwRecipeComponent,
    IUwRecipeStatisticsComponent,
    IUwUnitComponent,
    IUwUpdateTimestampComponent,
} from './component.type';

export interface IEntity {
    Id: number;
    Proto?: IUwProtoComponent;
    Owner?: IUwOwnerComponent;
    Controller?: IUwControllerComponent;
    Position?: IUwPositionComponent;
    Unit?: IUwUnitComponent;
    Life?: IUwLifeComponent;
    Move?: IUwMoveComponent;
    Aim?: IUwAimComponent;
    Recipe?: IUwRecipeComponent;
    UpdateTimestamp?: IUwUpdateTimestampComponent;
    RecipeStatistics?: IUwRecipeStatisticsComponent;
    Priority?: IUwPriorityComponent;
    Amount?: IUwAmountComponent;
    Attachment?: IUwAttachmentComponent;
    Player?: IUwPlayerComponent;
    Force?: IUwForceComponent;
    ForceDetails?: IUwForceDetailsComponent;
    ForeignPolicy?: IUwForeignPolicyComponent;
    DiplomacyProposal?: IUwDiplomacyProposalComponent;
}
