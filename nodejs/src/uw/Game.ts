import { ConnectionState, GameState, MapState, Severity } from './helpers';
import Commands from './Commands';
import Map from './Map';
import Prototypes from './Prototypes';
import { createSimpleLogger } from './simpleLogger';
import type {
    IUwShootingArray,
    UnregisterUwCallback,
    UpdateCallbackType,
    UwConnectionCallbackType,
    UwGameStateCallbackType,
    UwLogCallbackType,
    UwMapStateCallbackType,
    UwShootingCallbackType,
} from './types';
import createUWApi, { UwApi } from './uwApi';

interface ILogger {
    log: (severity: Severity, message: string, extra?: any) => void;
    error: (message: string, extra?: any) => void;
}

interface IGameOptions {
    logger?: ILogger;
    /**
     * @default false
     */
    isHardened?: boolean;
}

class Game {
    #api: UwApi;

    #cleanLogCallback: UnregisterUwCallback;
    #cleanExceptionCallback: UnregisterUwCallback;

    #cleanCallbacks: UnregisterUwCallback[];

    _connectionStateChangedHandler: UwConnectionCallbackType[];
    _updatingHandler: UpdateCallbackType[];
    _gameStateChangedHandler: UwGameStateCallbackType[];
    _mapStateChangedHandler: UwMapStateCallbackType[];
    _shootingHandler: UwShootingCallbackType[];

    _steamPath: string;
    _isHardened: boolean;
    _isInitialized: boolean;
    _logger: ILogger;

    // other
    prototypes: Prototypes;
    map: Map;
    world: any;
    commands: Commands;

    // state
    _tick: number;

    constructor(steamPath: string, options?: IGameOptions) {
        this._tick = 0;
        this._steamPath = steamPath;
        this._isHardened = options?.isHardened || false;
        this._logger = options?.logger || createSimpleLogger();

        this.#cleanCallbacks = [];

        this._connectionStateChangedHandler = [];
        this._updatingHandler = [];
        this._gameStateChangedHandler = [];
        this._mapStateChangedHandler = [];
        this._shootingHandler = [];
    }

    async initialize(): Promise<boolean> {
        // Api already initialized
        if (this._isInitialized) {
            return true;
        }
        this.#api = await createUWApi(this._steamPath, this._isHardened);
        this.#api.uwInitialize(this.#api.UW_VERSION);

        this.#cleanLogCallback = this.#api.uwSetLogCallback(this._handleLogCallback);

        this.#cleanExceptionCallback = this.#api.uwSetExceptionCallback(this._handleExceptionCallback);

        this.#cleanCallbacks.push(
            this.#api.uwSetConnectionStateCallback(this._handleConnectionStateCallback),
            this.#api.uwSetUpdateCallback(this._handleUpdateCallback),
            this.#api.uwSetGameStateCallback(this._handleGameStateCallback),
            this.#api.uwSetMapStateCallback(this._handleMapStateCallback),
            this.#api.uwSetShootingCallback(this._handleShootingCallback),
        );

        // OTHER APIS
        this.prototypes = new Prototypes(this.#api, this);
        this.map = new Map(this.#api, this);
        // this.world = World(self._api, self._ffi, self)
        this.commands = new Commands(this.#api);

        this._isInitialized = true;
        this._logger.log(Severity.Note, 'Init done');
        return true;
    }

    log(message: string, level: Severity = Severity.Info) {
        this.#api.uwLog(level, message);
    }

    setPlayerName(name: string): void {
        this.#api.uwSetPlayerName(name);
    }

    setPlayerColor(r: number, g: number, b: number): void {
        this.#api.uwSetPlayerColor(r, g, b);
    }

    setConnectStartGui(startGui: boolean, extraParams: string = ''): void {
        this.#api.uwSetConnectStartGui(startGui, extraParams);
    }

    setConnectAsObserver(isObserver: boolean): void {
        this.#api.uwSetConnectAsObserver(isObserver);
    }

    connectFindLan(timeoutMicroseconds?: number): Promise<boolean> {
        return this.#api.uwConnectFindLan(timeoutMicroseconds);
    }

    connectDirect(address: string, port: number): void {
        this.#api.uwConnectDirect(address, port);
    }

    connectLobbyId(id: number): void {
        this.#api.uwConnectLobbyId(id);
    }

    connectNewServer(visibility = 0, name = '', extraCmdParams = '') {
        this.#api.uwConnectNewServer(visibility, name, extraCmdParams);
    }

    tryReconnect(): Promise<boolean> {
        return this.#api.uwTryReconnect();
    }

    disconnect(): void {
        this.#api.uwDisconnect();
    }


    connectionStateEnum(): Promise<ConnectionState> {
        return this.#api.uwConnectionState();
    }

    mapStateEnum(): Promise<MapState> {
        return this.#api.uwMapState();
    }

    tick(): number {
        return this._tick;
    }

    // CALLBACKS
    addConnectionStateCallback(callback: UwConnectionCallbackType) {
        this._connectionStateChangedHandler.push(callback);
    }

    addUpdateCallback(callback: UpdateCallbackType) {
        this._updatingHandler.push(callback);
    }

    addGameStateCallback(callback: UwGameStateCallbackType) {
        this._gameStateChangedHandler.push(callback);
    }

    addMapStateCallback(callback: UwMapStateCallbackType) {
        this._mapStateChangedHandler.push(callback);
    }

    addShootingCallback(callback: UwShootingCallbackType) {
        this._shootingHandler.push(callback);
    }

    /**
     * PRIVATE HANDLERS
     */
    _handleLogCallback: UwLogCallbackType = ({
        message,
        severity,
        component,
    }) => {
        this._logger.log(
            severity,
           `${component} - ${message}`,
        );
    }

    _handleExceptionCallback = (message: string) => {
        this._logger.log(Severity.Critical, message);
    };

    _handleUpdateCallback = (tick: number, stepping: boolean) => {
        this._tick = tick;
        this._updatingHandler.forEach((fn) => {
            if (typeof fn === 'function') {
                fn(stepping);
            }
        });
    };

    _handleConnectionStateCallback = (connectionState: ConnectionState) => {
        this._logger.log(
            Severity.Info,
           `Connection state: ${ConnectionState[connectionState]}`,
        );
        this._connectionStateChangedHandler.forEach((fn) => {
            if (typeof fn === 'function') {
                fn(connectionState);
            }
        });
    }

    _handleGameStateCallback = (gameState: GameState) => {
        this._logger.log(
            Severity.Info,
           `Game state: ${GameState[gameState]}`,
        );
        this._gameStateChangedHandler.forEach((fn) => {
            if (typeof fn === 'function') {
                fn(gameState);
            }
        });
    }

    _handleMapStateCallback = (mapState: MapState) => {
        this._logger.log(
            Severity.Info,
           `Map state: ${MapState[mapState]}`,
        );
        this._mapStateChangedHandler.forEach((fn) => {
            if (typeof fn === 'function') {
                fn(mapState);
            }
        });
    }

    _handleShootingCallback = (shootData: IUwShootingArray) => {
        this._logger.log(
            Severity.Info,
           'Shooting data',
           shootData
        );
        this._shootingHandler.forEach((fn) => {
            if (typeof fn === 'function') {
                fn(shootData);
            }
        });
    }

    async cleanup() {
        if (!this._isInitialized) {
            return;
        }
        this.#api.uwDeinitialize();
        return new Promise<void>((resolve) => {
            this.#cleanCallbacks.forEach((call) => {
                setTimeout(call, 100);
            });
            this.#cleanCallbacks = [];

            setTimeout(() => {
                this.#cleanExceptionCallback();
                setTimeout(() => {
                    this.#cleanLogCallback();
                    setTimeout(async () => {
                        await this.#api.cleanup();

                        resolve();
                    }, 100);
                }, 100);
            }, 200);

            this._isInitialized = false;
        });





        // this.#cleanExceptionCallback();
        // setTimeout(this.#cleanLogCallback, 100);
        // this.#cleanLogCallback();
        // setTimeout(this.#api.cleanup, 100);
        // this.#api.cleanup();

    }
}


export default Game;
