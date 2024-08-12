import {
    arrayConstructor,
    createPointer,
    DataType,
    FieldType,
    freePointer,
    JsExternal,
    load,
    PointerType,
    restorePointer,
    unwrapPointer,
} from 'ffi-rs';
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
} from '../component.type';

interface ISharedProps {
    library: string;
    errno?: boolean;
    runInNewThread?: boolean;
}

function callFetch<R>(
    fnName: string,
    options: ISharedProps,
    structType: Record<keyof R, FieldType>,
    structData: R,
    pointer: JsExternal,
): R | null {
    const structPointer = createPointer({
        paramsType: [structType],
        paramsValue: [structData],
    });
    let hasComponent = load({
        ...options,
        funcName: fnName,
        retType: DataType.Boolean,
        paramsType: [DataType.External, DataType.External],
        paramsValue: [pointer, unwrapPointer(structPointer)[0]],
        runInNewThread: false,
    });

    if (options.errno) {
        console.log(hasComponent);
        // @ts-ignore
        hasComponent = hasComponent.value as boolean;
    }

    let data: R | null = null;
    if (hasComponent) {
        data = restorePointer({
            retType: [structType],
            paramsValue: structPointer,
        })[0] as unknown as R;
    }

    freePointer({
        paramsType: [structType],
        paramsValue: structPointer,
        pointerType: PointerType.RsPointer,
    });

    return data;
}

function createFetchComponentApi(options: ISharedProps) {
    function uwEntityPointer(id: number) {
         return load({
            ...options,
            funcName: 'uwEntityPointer',
            runInNewThread: false,
            retType: DataType.External,
            paramsType: [DataType.I32],
            paramsValue: [id],
        }) as JsExternal;
    }

    function uwEntityId(pointer: JsExternal) {
        return load({
            ...options,
            funcName: 'uwEntityId',
            runInNewThread: false,
            retType: DataType.I32,
            paramsType: [DataType.External],
            paramsValue: [pointer],
            freeResultMemory: false,
        });
    }

    const UwProtoComponentStruct = {
        proto: DataType.I32,
    };

    function uwFetchProtoComponent(pointer: JsExternal) {
        const structPointerData = {
            proto: 0,
        };
        const structPointer = createPointer({
            paramsType: [UwProtoComponentStruct],
            paramsValue: [structPointerData],
        });

        const unwrapedPointer = unwrapPointer(structPointer)[0];
        const hasComponent = load({
            ...options,
            funcName: 'uwFetchProtoComponent',
            retType: DataType.Boolean,
            paramsType: [DataType.External, DataType.External],
            paramsValue: [pointer, unwrapedPointer],
        });

        let data: null | IUwProtoComponent = null;
        if (hasComponent) {
            data = restorePointer({
                retType: [UwProtoComponentStruct],
                paramsValue: structPointer,
            })[0] as unknown as IUwProtoComponent;
        }

        freePointer({
            paramsType: [UwProtoComponentStruct],
            paramsValue: structPointer,
            pointerType: PointerType.RsPointer,
        });

        return data;
    }

    const UwOwnerComponentStruct = {
        force: DataType.I32,
    };

    function uwFetchOwnerComponent(pointer: JsExternal) {
        const structPointerData = {
            force: 0,
        };
        const structPointer = createPointer({
            paramsType: [UwOwnerComponentStruct],
            paramsValue: [structPointerData],
        });
        const hasComponent = load({
            ...options,
            funcName: 'uwFetchOwnerComponent',
            retType: DataType.Boolean,
            paramsType: [DataType.External, DataType.External],
            paramsValue: [pointer, unwrapPointer(structPointer)[0]],
        });

        let data: null | IUwOwnerComponent = null;
        if (hasComponent) {
            data = restorePointer({
                retType: [UwOwnerComponentStruct],
                paramsValue: structPointer,
            })[0] as unknown as IUwOwnerComponent;
        }

        freePointer({
            paramsType: [UwOwnerComponentStruct],
            paramsValue: structPointer,
            pointerType: PointerType.RsPointer,
        });

        return data;
    }

    const UwControllerComponentStruct = {
        player: DataType.I32,
        timestamp: DataType.I32,
    };

    function uwFetchControllerComponent(pointer: JsExternal) {
        const structPointerData = {
            player: 0,
            timestamp: 0,
        };
        const structPointer = createPointer({
            paramsType: [UwControllerComponentStruct],
            paramsValue: [structPointerData],
        });
        const hasComponent = load({
            ...options,
            funcName: 'uwFetchControllerComponent',
            retType: DataType.Boolean,
            paramsType: [DataType.External, DataType.External],
            paramsValue: [pointer, unwrapPointer(structPointer)[0]],
        });

        let data: null | IUwControllerComponent = null;
        if (hasComponent) {
            data = restorePointer({
                retType: [UwControllerComponentStruct],
                paramsValue: structPointer,
            })[0] as unknown as IUwControllerComponent;
        }

        freePointer({
            paramsType: [UwControllerComponentStruct],
            paramsValue: structPointer,
            pointerType: PointerType.RsPointer,
        });

        return data;
    }

    const UwPositionComponentStruct = {
        position: DataType.I32,
        yaw: DataType.Double,
    };

    function uwFetchPositionComponent(pointer: JsExternal) {
        const structPointerData = {
            position: 0,
            yaw: 0,
        };
        const structPointer = createPointer({
            paramsType: [UwPositionComponentStruct],
            paramsValue: [structPointerData],
        });

        const hasComponent = load({
            ...options,
            funcName: 'uwFetchPositionComponent',
            retType: DataType.Boolean,
            paramsType: [DataType.External, DataType.External],
            paramsValue: [pointer, unwrapPointer(structPointer)[0]],
        });

        let data: null | IUwPositionComponent = null;
        if (hasComponent) {
            data = restorePointer({
                retType: [UwPositionComponentStruct],
                paramsValue: structPointer,
            })[0] as unknown as IUwPositionComponent;
        }

        freePointer({
            paramsType: [UwPositionComponentStruct],
            paramsValue: structPointer,
            pointerType: PointerType.RsPointer,
        });

        return data;
    }

    const UwUnitComponentStruct = {
        state: DataType.I32,
        killCount: DataType.I32,
    };

    function uwFetchUnitComponent(pointer: JsExternal) {
        return callFetch<IUwUnitComponent>(
            'uwFetchUnitComponent',
            options,
            UwUnitComponentStruct,
            { state: 0, killCount: 0 },
            pointer,
        );
    }

    const UwLifeComponentStruct = {
        life: DataType.I32,
    };

    function uwFetchLifeComponent(pointer: JsExternal) {
        return callFetch<IUwLifeComponent>(
            'uwFetchLifeComponent',
            options,
            UwLifeComponentStruct,
            { life: 0 },
            pointer,
        );
    }

    const UwMoveComponentStruct = {
        posStart: DataType.I32,
        posEnd: DataType.I32,
        tickStart: DataType.I32,
        tickEnd: DataType.I32,
        yawStart: DataType.Double,
        yawEnd: DataType.Double,
    };

    function uwFetchMoveComponent(pointer: JsExternal) {
        return callFetch<IUwMoveComponent>(
            'uwFetchMoveComponent',
            options,
            UwMoveComponentStruct,
            {
                posStart: 0,
                posEnd: 0,
                tickStart: 0,
                tickEnd: 0,
                yawStart: 0,
                yawEnd: 0,
            },
            pointer,
        );
    }

    const UwAimComponentStruct = {
        target: DataType.I32,
    };

    function uwFetchAimComponent(pointer: JsExternal) {
        return callFetch<IUwAimComponent>(
            'uwFetchAimComponent',
            options,
            UwAimComponentStruct,
            {
                target: 0,
            },
            pointer,
        );
    }

    const UwRecipeComponentStruct = {
        recipe: DataType.I32,
    };

    function uwFetchRecipeComponent(pointer: JsExternal) {
        return callFetch<IUwRecipeComponent>(
            'uwFetchRecipeComponent',
            options,
            UwRecipeComponentStruct,
            {
                recipe: 0,
            },
            pointer,
        );
    }

    const UwUpdateTimestampComponentStruct = {
        timestamp: DataType.I32,
    };

    function uwFetchUpdateTimestampComponent(pointer: JsExternal) {
        return callFetch<IUwUpdateTimestampComponent>(
            'uwFetchUpdateTimestampComponent',
            options,
            UwUpdateTimestampComponentStruct,
            {
                timestamp: 0,
            },
            pointer,
        );
    }

    const UwRecipeStatisticsComponentStruct = {
        timestamps: arrayConstructor({
            type: DataType.I32Array,
            length: 3,
            dynamicArray: false,
        }),
        completed: DataType.I32,
    };

    function uwFetchRecipeStatisticsComponent(pointer: JsExternal) {
        return callFetch<IUwRecipeStatisticsComponent>(
            'uwFetchRecipeStatisticsComponent',
            options,
            UwRecipeStatisticsComponentStruct,
            {
                timestamps: [0, 0, 0],
                completed: 0,
            },
            pointer,
        );
    }

    const UwPriorityComponentStruct ={
        priority: DataType.I32,
    };

    function uwFetchPriorityComponent(pointer: JsExternal) {
        return callFetch<IUwPriorityComponent>(
            'uwFetchPriorityComponent',
            options,
            UwPriorityComponentStruct,
            {
                priority: 0,
            },
            pointer,
        );
    }

    const UwAmountComponentStruct = {
        amount: DataType.I32,
    };

    function uwFetchAmountComponent(pointer: JsExternal) {
        return callFetch<IUwAmountComponent>(
            'uwFetchAmountComponent',
            options,
            UwAmountComponentStruct,
            {
                amount: 0,
            },
            pointer,
        );
    }

    const UwAttachmentComponentStruct = {
        target: DataType.I32,
    };

    function uwFetchAttachmentComponent(pointer: JsExternal) {
        return callFetch<IUwAttachmentComponent>(
            'uwFetchAttachmentComponent',
            options,
            UwAttachmentComponentStruct,
            {
                target: 0,
            },
            pointer,
        );
    }

    const UwPlayerComponentStruct = {
        name: arrayConstructor({
            length: 28,
            dynamicArray: false,
            type: DataType.U8Array,
        }),
        nameLength: DataType.I32,
        steamUserId: DataType.I64,
        force: DataType.I32,
        progress: DataType.Double,
        ping: DataType.I32,
        state: DataType.I32,
        playerConnectionClass: DataType.I32,
    };

    function uwFetchPlayerComponent(pointer: JsExternal): IUwPlayerComponent | null {
        const fnName = 'uwFetchPlayerComponent';
        const structType = UwPlayerComponentStruct;
        const structData = {
            name: Buffer.alloc(28, '\0'),
            nameLength: 0,
            steamUserId: 0,
            force: 0,
            progress: 0,
            ping: 0,
            state: 0,
            playerConnectionClass: 0,
        };

        const structPointer = createPointer({
            paramsType: [structType],
            paramsValue: [structData],
        });
        let hasComponent = load({
            ...options,
            funcName: fnName,
            retType: DataType.Boolean,
            paramsType: [DataType.External, DataType.External],
            paramsValue: [pointer, unwrapPointer(structPointer)[0]],
            runInNewThread: false,
        });

        if (options.errno) {
            console.log(hasComponent);
            // @ts-ignore
            hasComponent = hasComponent.value as boolean;
        }

        type rawData = Omit<IUwPlayerComponent, 'name'> & { name: Buffer };
        let data: IUwPlayerComponent | null = null;
        if (hasComponent) {
            const rawData = restorePointer({
                retType: [structType],
                paramsValue: structPointer,
            })[0] as unknown as rawData;

            data = {
                ...rawData,
                name: rawData.name.toString('utf-8', 0, rawData.nameLength),
            }
        }
        freePointer({
            paramsType: [structType],
            paramsValue: structPointer,
            pointerType: PointerType.RsPointer,
        });

        return data;
    }

    const UwForceComponentStruct = {
        color: arrayConstructor({
            type: DataType.I32Array,
            length: 3,
            dynamicArray: false,
        }),
        score: DataType.I64,
        killCount: DataType.I32,
        lossCount: DataType.I32,
        finishTimestamp: DataType.I32,
        team: DataType.I32,
        state: DataType.I32,
    };

    function uwFetchForceComponent(pointer: JsExternal) {
        return callFetch<IUwForceComponent>(
            'uwFetchForceComponent',
            options,
            UwForceComponentStruct,
            {
                color: [0, 0, 0],
                score: 0,
                killCount: 0,
                lossCount: 0,
                finishTimestamp: 0,
                team: 0,
                state: 0,
            },
            pointer,
        );
    }

    const UwForceDetailsComponentStruct = {
        killValue: DataType.I64,
        lossValue: DataType.I64,
        startingPosition: DataType.I32,
    };

    function uwFetchForceDetailsComponent(pointer: JsExternal) {
        return callFetch<IUwForceDetailsComponent>(
            'uwFetchForceDetailsComponent',
            options,
            UwForceDetailsComponentStruct,
            {
                killValue: 0,
                lossValue: 0,
                startingPosition: 0,
            },
            pointer,
        );
    }

    const UwForeignPolicyComponentStruct = {
        forces: arrayConstructor({
            type: DataType.I32Array,
            length: 2,
            dynamicArray: false,
        }),
        policy: DataType.I32,
    };

    function uwFetchForeignPolicyComponent(pointer: JsExternal) {
        return callFetch<IUwForeignPolicyComponent>(
            'uwFetchForeignPolicyComponent',
            options,
            UwForeignPolicyComponentStruct,
            {
                forces: [0, 0],
                policy: 0,
            },
            pointer,
        );
    }

    const UwDiplomacyProposalComponentStruct = {
        offeror: DataType.I32,
        offeree: DataType.I32,
        proposal: DataType.I32,
    };

    function uwFetchDiplomacyProposalComponent(pointer: JsExternal) {
        return callFetch<IUwDiplomacyProposalComponent>(
            'uwFetchDiplomacyProposalComponent',
            options,
            UwDiplomacyProposalComponentStruct,
            {
                offeror: 0,
                offeree: 0,
                proposal: 0,
            },
            pointer,
        );
    }

    return {
        uwEntityPointer,
        uwEntityId,
        uwFetchProtoComponent,
        uwFetchOwnerComponent,
        uwFetchControllerComponent,
        uwFetchPositionComponent,
        uwFetchUnitComponent,
        uwFetchLifeComponent,
        uwFetchMoveComponent,
        uwFetchAimComponent,
        uwFetchRecipeComponent,
        uwFetchUpdateTimestampComponent,
        uwFetchRecipeStatisticsComponent,
        uwFetchPriorityComponent,
        uwFetchAmountComponent,
        uwFetchAttachmentComponent,
        uwFetchPlayerComponent,
        uwFetchForceComponent,
        uwFetchForceDetailsComponent,
        uwFetchForeignPolicyComponent,
        uwFetchDiplomacyProposalComponent,
    };

}


export default createFetchComponentApi;
