import * as uw from './uw';
import { UpdateCallbackType } from './uw/types';


const STEAM_PATH = '/home/fisa/.local/share/Steam/steamapps/common/Unnatural Worlds/bin';


function tickCallbackClosure(game: uw.Game) {
    const tickCallback: UpdateCallbackType = async (stepping) => {

        if (game.tick() % 100 == 0 && game.tick() !== 0) {
            console.log(`${game.tick()} Alive ${stepping}`);
        }

        if (game.tick() % 100 === 0) {
            // console.log(await game.testModifiedEntities());
        }
        // console.log(game.tick());
    }
    return tickCallback;
}

let teardownCallback = async () => {};

function processBootstrap() {
    const signals = {
        SIGHUP: 1,
        SIGINT: 2,
        SIGTERM: 15,
        SIGCHLD: 17,
        // SIGKILL: ''
    };
    console.log('PREPARING LISTENERS');
    Object.keys(signals).forEach((signal: keyof typeof signals) => {
        process.on(signal, async () => {
            console.log('Shutting down!');
            await teardownCallback();
            process.exit(signals[signal]);
        });
    });

    // const originalWrite = process.stdout.write;

    // Override the process.stdout.write method
    // process.stdout.write = (chunk, encoding, callback) => {
    //     // Convert chunk to string (it may be a buffer)
    //     const message = chunk.toString();

    //     originalWrite.call(process.stdout, `CATCHED: ${message}`, encoding, callback);

    //     // Filter out messages containing "hello"
    //     if (!message.includes('hello')) {
    //         // Call the original write method for non-filtered messages
    //         originalWrite.call(process.stdout, chunk, encoding, callback);
    //     }
    // };

    // process.stderr.write = (chunk, encoding, callback) => {
    //     // Convert chunk to string (it may be a buffer)
    //     const message = chunk.toString();

    //     originalWrite.call(process.stdout, `CATCHED ERROR: ${message}`, encoding, callback);

    //     // Filter out messages containing "hello"
    //     if (!message.includes('hello')) {
    //         // Call the original write method for non-filtered messages
    //         originalWrite.call(process.stdout, chunk, encoding, callback);
    //     }
    // }
}

async function main() {
    process.chdir(STEAM_PATH);

    const game = new uw.Game(STEAM_PATH, {
        isHardened: true,
    });
    await game.initialize();

    teardownCallback = async () => {
        await game.cleanup();
    };
    game.log('Hello from the example bot!');
    game.setPlayerName('fisa');
    game.setPlayerColor(0, 1.0, 0);
    // game.connectLobbyId(123);
    // Connect part

    if (!await game.tryReconnect()) {
        game.setConnectStartGui(true);
        if (!await game.connectFindLan()) {
            game.connectNewServer(1);
        }
    }

    // game.setPlayerColor(0, 1.0, 0);

    game.addUpdateCallback(tickCallbackClosure(game));

    console.log('ALL DOWN');

}

processBootstrap();
main();
