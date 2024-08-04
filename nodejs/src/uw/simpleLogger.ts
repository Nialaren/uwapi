import { Severity, ILogger } from './helpers';

export function createSimpleLogger(): ILogger {
    return {
        log: (level: Severity, message: string, extra?: any) => {
            setTimeout(() => {
                console.log(`[${Date.now()}][${Severity[level]} = ${level}] ${message}`, extra);
            }, 0);
        },
        error: (message, extra) => {
            setTimeout(() => {
                console.error(`[${Date.now()}][Exception] ${message}`, extra);
            }, 0);
        }
    };
}
