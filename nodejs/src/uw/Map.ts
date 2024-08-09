import Game from './Game';
import { MapState, OverviewFlags, Severity } from './helpers';
import { IUwMapInfo, IUwTile } from './types';
import { IUWApi } from './uwApi.type';

interface IVector3 {
    x: number;
    y: number;
    z: number;
}

function Vector3(vecPosition: [number, number, number]) {
    const [x, y, z] = vecPosition;
    return {
        x,
        y,
        z,
    };
}


class Map {
    _api: IUWApi;
    _game: Game;

    _name = '';
    _guid = '';
    _path = '';
    _maxPlayers = 0;
    _positions: IVector3[] = [];
    _ups: IVector3[] = [];
    _neighbors: number[][] = [];
    // bytes?
    _terrains: Uint8Array[] = [];
    _overview: OverviewFlags[] = [];

    constructor(api: IUWApi, game: Game) {
        this._api = api;
        this._game = game;
        this._game.addMapStateCallback(this._handleMapStateChanged);
        this._game.addUpdateCallback(this._updating)
    }

    name(): string {
        return this._name;
    }

    guid(): string {
        return this._guid;
    }

    path(): string {
        return this._path;
    }

    maxPlayers(): number {
        return this._maxPlayers;
    }

    positions() {
        return this._positions;
    }

    ups() {
        return this._ups;
    }

    neighbors() {
        return this._neighbors;
    }

    neighborsOnPos(pos: number) {
        return this._neighbors[pos];
    }

    terrains() {
        return this._terrains;
    }

    overview() {
        return this._overview;
    }

    async entities(position: number): Promise<number[]> {
        return this._api.uwOverviewIds(position);
    }

    async areaRange(point: IVector3, radius: number): Promise<number[]> {
        return this._api.uwAreaRange(point.x, point.y, point.z, radius);
    }

    async areaConnected(position: number, radius: number): Promise<number[]> {
        return this._api.uwAreaConnected(position, radius);
    }

    async areaNewighborhood(position: number, radius: number): Promise<number[]> {
        return this._api.uwAreaNeighborhood(position, radius);
    }

    async areaExtended(position: number, radius: number): Promise<number[]> {
        return this._api.uwAreaExtended(position, radius);
    }

    async testVisible(a: IVector3, b: IVector3): Promise<boolean> {
        return this._api.uwTestVisible(a.x, a.y, a.z, b.x, b.y, b.z);
    }

    async testShooting(
        shooterPosition: number,
        shooterProto: number,
        targetPosition: number,
        targetProto: number,
    ): Promise<boolean> {
        return this._api.uwTestShooting(
            shooterPosition,
            shooterProto,
            targetPosition,
            targetProto
        );
    }

    ditanceLine(ai: number, bi: number): number {
        const a = this._positions[ai];
        const b = this._positions[bi];

        return Math.sqrt(
            (a.x - b.x)**2
            + (a.y - b.y)**2
            + (a.z - b.z)**2
        );
    }

    async distanceEstimate(a: number, b: number): Promise<number> {
        return this._api.uwDistanceEstimate(a, b);
    }

    async yaw(a: number, b: number): Promise<number> {
        return this._api.uwYaw(a, b);
    }

    async testConstructionPlacement(constructionPrototype: number, position: number): Promise<boolean> {
        return this._api.uwTestConstructionPlacement(constructionPrototype, position);
    }

    async findConstructionPlacement(constructionPrototype: number, position: number): Promise<number> {
        return this._api.uwFindConstructionPlacement(constructionPrototype, position);
    }

    async _load() {
        this._game._logger.log(Severity.Note, 'loading map');
        this._positions = []
        this._ups = []
        this._neighbors = []
        this._terrains = [];
        this._overview = []

        const info: IUwMapInfo = await this._api.uwMapInfo();

        this._name = info.name;
        this._guid = info.guid;
        this._path = info.path;
        this._maxPlayers = info.maxPlayers;
        this._game._logger.log(Severity.Note, `Map name ${this._name}`);
        this._game._logger.log(Severity.Note, `Map guid ${this._guid}`);

        const tileCount = await this._api.uwTilesCount();

        const tiles: IUwTile[] = [];

        const tenPercent = Math.floor(tileCount / 10);
        let count = 0;
        for (let i = 0; i < tileCount; i++) {
            if (i % tenPercent === 0) {
                this._game._logger.log(Severity.Note, `map loading ${count * 10}%`);
                count++;
            }
            const tile: IUwTile = await this._api.uwTile(i);
            this._positions.push(Vector3(tile.position));
            this._ups.push(Vector3(tile.up));
            this._neighbors.push(tile.neighborsIndices);
            this._terrains.push(tile.terrain);

            tiles.push(tile);
        }

        console.log(tiles);

        this._game._logger.log(Severity.Note, 'map loaded');
    }

    _handleMapStateChanged = (mapState: MapState) => {
        if (mapState === MapState.Loaded) {
            this._load();
        }
    }
    _updating = async (stepping: boolean) => {
        if (stepping) {
                const overviewFlags = await this._api.uwOverviewExtract();
                if (overviewFlags.length > 0) {
                this._overview = overviewFlags;
            }
        } else {
            this._overview = [];
        }
    }
}

export default Map;
