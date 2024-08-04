import {
    define as _define,
    DataType,
    FieldType,
} from 'ffi-rs';

interface IFunctionDefinition extends Partial<ISharedProps> {
    retType: DataType;
    paramsType: FieldType[];
    freeResultMemory?: boolean;
}

interface ISharedProps {
    library: string;
    errno?: boolean;
    runInNewThread?: boolean;
}

interface ICustomDefinition {
    [functionName: string]: IFunctionDefinition;
}

export function define(definitions: ICustomDefinition, sharedDefault: ISharedProps) {
    Object.keys(definitions).forEach((functionName) => {
        definitions[functionName] = {
            ...sharedDefault,
            ...definitions[functionName],
        };
    });
    // @ts-ignore - wrong type
    return _define(definitions);
}
