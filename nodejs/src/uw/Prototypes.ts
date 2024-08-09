
import type Game from './Game';
import {
    MapState,
    Prototype,
    Severity,
} from './helpers';
import { IUwProtoGeneric } from './types';
import {
    IUWApi,
} from './uwApi.type';

class Prototypes {
    _api: IUWApi;
    _game: Game;

    _hitChangesTable: Record<string, any>;
    _terrainTypesTable: Record<string, any>;

    _all: number[];
    _types: Record<number, IUwProtoGeneric>;
    _resources: Record<number, any>;
    _recipes: Record<number, any>;
    _constructions: Record<number, any>;
    _units: Record<number, any>;

    constructor(api: IUWApi, game: Game) {
        this._api = api;
        this._game = game;
        this._game.addMapStateCallback(this._handleMapStateChanged);

        this._hitChangesTable = {};
        this._terrainTypesTable = {};

        this._all = []
        this._types = {}
        this._resources  = {}
        this._recipes  = {}
        this._constructions  = {}
        this._units  = {}
    }

    all(): number[] {
        return this._all;
    }

    type(id: number): Prototype {
        return this._types[id]?.type || Prototype.NONE;
    }

    name(id: number): string {
        return this._types[id]?.name || '';
    }

    json(id: number): string {
        return this._types[id]?.json || '';
    }

    resource(id: number): undefined | Record<string, any> {
        return this._resources[id];
    }

    recipes(id: number): undefined | Record<string, any> {
        return this._recipes[id];
    }

    construction(id: number): undefined | Record<string, any> {
        return this._constructions[id];
    }

    unit(id: number): undefined | Record<string, any> {
        return this._units[id];
    }

    hitChancesTable() {
        return this._hitChangesTable;
    }

    terrainTypesTable() {
        return this._terrainTypesTable;
    }

    async allPrototypes(): Promise<IUwProtoGeneric[]> {
        return this._api.uwAllPrototypes();
    }

    async _loadPrototypes() {
        this._game._logger.log(Severity.Note, 'loading prototypes');
        this._types = {}
        this._resources = {}
        this._recipes = {}
        this._constructions = {}
        this._units = {}

        const prototypes = await this.allPrototypes();

        this._all = prototypes.map((proto, index) => {
            const {
                type,
                json,
            } = proto;
            switch (type) {
                case Prototype.Resource: {
                    this._resources[index] = json;
                    break;
                }
                case Prototype.Recipe: {
                    this._recipes[index] = json;
                    break;
                }
                case Prototype.Construction: {
                    this._constructions[index] = json;
                    break;
                }
                case Prototype.Unit: {
                    this._units[index] = json;
                    break;
                }
                default: break;
            }

            this._types[index] = proto;
            return index;
        });

        this._game._logger.log(Severity.Note, 'prototypes loaded');
    }

    async _loadDefinitions() {
        this._game._logger.log(Severity.Note, 'loading definitions');
        const definitionsJSON = await this._api.uwDefinitionsJson();

        try {
            const definitions = JSON.parse(definitionsJSON) as { hitChancesTable: any, terrainTypesTable: any };
            this._hitChangesTable = definitions.hitChancesTable;
            this._terrainTypesTable = definitions.terrainTypesTable;
        } catch (err) {
            this._game._logger.log(Severity.Error, 'definitions load failed', err);
        }

        this._game._logger.log(Severity.Note, 'definitions loaded');
    }

    _handleMapStateChanged = (state: MapState) => {
        if (state === MapState.Loaded) {
            this._loadPrototypes();
            this._loadDefinitions();
        }
    }
}

export default Prototypes;
