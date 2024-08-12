import { IEntity } from './entity.type';
import Game from './Game';
import { ENTITY_ATTRIBUTES, ForeignPolicyEnum, isKeyDefined } from './helpers';
import { IUWApi } from './uwApi.type';


class World {
    _api: IUWApi;
    _game: Game;

    _myForce = 0;
    _entities: Map<number, IEntity>;
    _policies: Record<number, ForeignPolicyEnum> = {};

    constructor(api: IUWApi, game: Game) {
        this._api = api;
        this._game = game;
        this._game.addUpdateCallback(this._updating)

        this._entities = new Map<number, any>();
    }

    myForce() {
        return this._myForce;
    }

    entities() {
        return this._entities;
    }

    policy(id: number) {
        return this._policies[id] || ForeignPolicyEnum.None;
    }

    async _allIds(): Promise<number[]> {
        return this._api.uwAllEntities();
    }

    async _modifiedIds(): Promise<number[]> {
        return this._api.uwModifiedEntities();
    }

    async _modifiedEntities(): Promise<IEntity[]> {
        return this._api.uwModifiedEntitiesResolved();
    }

    _updateRemoved(modifiedIds: number[]) {
        const allIds = new Set(modifiedIds);

        const removed = [...this._entities.keys()].map((id) => {
            if (!allIds.has(id)) {
                this._entities.delete(id);
            }
            return id;
        });
        return removed;
    }

    _updatePolicies() {
        this._policies = {};
        for (const entity of this._entities.values()) {
            if (!isKeyDefined(entity, 'ForeignPolicy')) {
                continue;
            }
            const {
                policy,
                forces,
            } = entity.ForeignPolicy!;

            if (forces[0] === this._myForce) {
                this._policies[forces[1]] = policy;
            }
            if (forces[1] === this._myForce) {
                this._policies[forces[0]] = policy;
            }
        }
    }

    _updateModified(modifiedEntities: IEntity[]) {
        for (let modifiedEntity of modifiedEntities) {
            const originalEntity = this._entities.get(modifiedEntity.Id);
            if (!originalEntity) {
                continue;
            }

            for (const attr of ENTITY_ATTRIBUTES) {
                if (isKeyDefined(modifiedEntity, attr)) {
                    // @ts-ignore
                    originalEntity[attr] = modifiedEntity[attr];
                } else if (isKeyDefined(originalEntity, attr)) {
                    delete originalEntity[attr];
                }
            }
        }
    }

    _updating = async (_stepping: boolean) => {
        const player = await this._api.uwMyPlayer();
        this._myForce = player.forceEntityId;

        const modifiedEntities = await this._modifiedEntities();
        const modifiedIds = modifiedEntities.map((en) => en.Id);

        this._updateRemoved(modifiedIds);
        this._updateModified(modifiedEntities);
        this._updatePolicies();
    }
}

export default World;
