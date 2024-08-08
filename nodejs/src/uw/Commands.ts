import {
    OrderPriority,
    OrderType,
    Priority
} from './helpers';
import { IUwOrder } from './types';
import {
    IUWApi,
} from './uwApi.type';

const invalid = 4294967295;

class Commands {
    _api: IUWApi;

    constructor(api: IUWApi) {
        this._api = api;
    }

    async orders(unitId: number): Promise<IUwOrder[]> {
        return this._api.uwOrders(unitId);
    }

    async order(unitId: number, order: IUwOrder) {
        return this._api.uwOrder(unitId, order);
    }

    stop(): IUwOrder {
        return {
            entity: invalid,
            position: invalid,
            order: OrderType.Stop,
            priority: OrderPriority.User,
        };
    }

    guard(): IUwOrder {
        return {
            entity: invalid,
            position: invalid,
            order: OrderType.Guard,
            priority: OrderPriority.User,
        };
    }

    runToPosition(position: number): IUwOrder {
        return {
            entity: invalid,
            position,
            order: OrderType.Run,
            priority: OrderPriority.User,
        };
    }

    runToEntity(entity: number) {
        return {
            entity,
            position: invalid,
            order: OrderType.Run,
            priority: OrderPriority.User,
        };
    }

    fightToPosition(position: number): IUwOrder {
        return {
            entity: invalid,
            position,
            order: OrderType.Fight,
            priority: OrderPriority.User,
        };
    }

    fightToEntity(entity: number): IUwOrder {
        return {
            entity,
            position: invalid,
            order: OrderType.Fight,
            priority: OrderPriority.User,
        };
    }

    async commandSelfDestruct(unit: number) {
        return this._api.uwCommandSelfDestruct(unit);
    }

    async commandPlaceConstruction(proto: number, position: number, yaw = 0.0) {
        return this._api.uwCommandPlaceConstruction(proto, position, yaw);
    }

    async commandSetRecipe(unit: number, recipe: number) {
        return this._api.uwCommandSetRecipe(unit, recipe);
    }

    async commandLoad(unit: number, resourceType: number) {
        return this._api.uwCommandLoad(unit, resourceType);
    }

    async commandUnload(unit: number) {
        return this._api.uwCommandUnload(unit);
    }

    async commandMove(unit: number, position: number, yaw = 0.0) {
        return this._api.uwCommandMove(unit, position, yaw);
    }

    async commandAim(unit: number, target: number) {
        return this._api.uwCommandAim(unit, target);
    }

    async commandRenounceControl(unit: number) {
        return this._api.uwCommandRenounceControl(unit);
    }

    async commandSetPriority(unit: number, priority: Priority) {
        return this._api.uwCommandSetPriority(unit, priority);
    }
}

export default Commands;
