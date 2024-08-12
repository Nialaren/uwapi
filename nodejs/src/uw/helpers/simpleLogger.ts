import { Severity, ILogger } from '../helpers';

export function createSimpleLogger(): ILogger {
    return {
        log: (level: Severity, message: string, extra?: any) => {
            setTimeout(() => {
                const msg = `[${Date.now()}][${Severity[level]} = ${level}] ${message}`;
                if (extra) {
                    console.log(msg, extra);
                } else {
                    console.log(msg);
                }
            }, 0);
        },
        error: (message, extra) => {
            setTimeout(() => {
                const msg = `[${Date.now()}][Exception] ${message}`;
                if (extra) {
                    console.error(msg, extra);
                } else {
                    console.error(msg);
                }
            }, 0);
        }
    };
}
