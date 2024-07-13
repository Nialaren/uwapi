// THIS FILE IS GENERATED BY SCRIPT
// DO NOT MODIFY

using System;
using System.Runtime.InteropServices;

namespace Unnatural
{
    public static class Interop
    {
#if UW_USE_OPTIMIZED_LIBRARY
        // non-hard library may crash the program if used incorrectly
        const string LibName = "unnatural-uwapi";
#else
        // hardened library contains additional checks to verify proper use of the api
        const string LibName = "unnatural-uwapi-hard";
#endif

        [StructLayout(LayoutKind.Sequential)]
        public struct UwIds
        {
            public IntPtr ids;
            public uint count;
        }

        public enum UwPrototypeTypeEnum
        {
            None = 0,
            Resource = 1,
            Recipe = 2,
            Construction = 3,
            Unit = 4,
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAllPrototypes(ref UwIds data);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern UwPrototypeTypeEnum uwPrototypeType(uint prototypeId);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr uwPrototypeJson(uint prototypeId);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr uwDefinitionsJson();

        [StructLayout(LayoutKind.Sequential)]
        public struct UwMapInfo
        {
            public IntPtr name;
            public IntPtr guid;
            public IntPtr path;
            public uint maxPlayers;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwMapInfo(ref UwMapInfo data);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern uint uwTilesCount();

        [StructLayout(LayoutKind.Sequential)]
        public struct UwTile
        {
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)] public float[] position;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)] public float[] up;
            public IntPtr neighborsIndices;
            public uint neighborsCount;
            public byte terrain;
            [MarshalAs(UnmanagedType.I1)] public bool border;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwTile(uint index, ref UwTile data);

        [Flags]
        public enum UwOverviewFlags
        {
            None = 0,
            Resource = 1 << 0,
            Construction = 1 << 1,
            MobileUnit = 1 << 2,
            StaticUnit = 1 << 3,
            Unit = MobileUnit | StaticUnit,
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern UwOverviewFlags uwOverviewFlags(uint position);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwOverviewIds(uint position, ref UwIds data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwOverviewExtract
        {
            public IntPtr flags;
            public uint count;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwOverviewExtract(ref UwOverviewExtract data);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAreaRange(float x, float y, float z, float radius, ref UwIds data);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAreaConnected(uint position, float radius, ref UwIds data);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAreaNeighborhood(uint position, float radius, ref UwIds data);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAreaExtended(uint position, float radius, ref UwIds data);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwTestVisible(float x1, float y1, float z1, float x2, float y2, float z2);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwTestShooting(uint shooterPosition, uint shooterProto, uint targetPosition, uint targetProto);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern float uwDistanceLine(float x1, float y1, float z1, float x2, float y2, float z2);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern float uwDistanceEstimate(uint a, uint b);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern float uwYaw(uint position, uint towards);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr uwEntityPointer(uint id);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern uint uwEntityId(IntPtr entity);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAllEntities(ref UwIds data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwProtoComponent
        {
            public uint proto;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchProtoComponent(IntPtr entity, ref UwProtoComponent data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwOwnerComponent
        {
            public uint force;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchOwnerComponent(IntPtr entity, ref UwOwnerComponent data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwControllerComponent
        {
            public uint player;
            public uint timestamp;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchControllerComponent(IntPtr entity, ref UwControllerComponent data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwPositionComponent
        {
            public uint position;
            public float yaw;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchPositionComponent(IntPtr entity, ref UwPositionComponent data);

        [Flags]
        public enum UwUnitStateFlags
        {
            None = 0,
            Shooting = 1 << 0,
            Processing = 1 << 1,
            Rebuilding = 1 << 2,
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct UwUnitComponent
        {
            public UwUnitStateFlags state;
            public uint killCount;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchUnitComponent(IntPtr entity, ref UwUnitComponent data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwLifeComponent
        {
            public int life;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchLifeComponent(IntPtr entity, ref UwLifeComponent data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwMoveComponent
        {
            public uint posStart;
            public uint posEnd;
            public uint tickStart;
            public uint tickEnd;
            public float yawStart;
            public float yawEnd;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchMoveComponent(IntPtr entity, ref UwMoveComponent data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwAimComponent
        {
            public uint target;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchAimComponent(IntPtr entity, ref UwAimComponent data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwRecipeComponent
        {
            public uint recipe;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchRecipeComponent(IntPtr entity, ref UwRecipeComponent data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwUpdateTimestampComponent
        {
            public uint timestamp;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchUpdateTimestampComponent(IntPtr entity, ref UwUpdateTimestampComponent data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwRecipeStatisticsComponent
        {
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)] public uint[] timestamps;
            public uint completed;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchRecipeStatisticsComponent(IntPtr entity, ref UwRecipeStatisticsComponent data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwAmountComponent
        {
            public uint amount;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchAmountComponent(IntPtr entity, ref UwAmountComponent data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwAttachmentComponent
        {
            public uint target;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchAttachmentComponent(IntPtr entity, ref UwAttachmentComponent data);

        [Flags]
        public enum UwPlayerStateFlags
        {
            None = 0,
            Loaded = 1 << 0,
            Pause = 1 << 1,
            Disconnected = 1 << 2,
            Admin = 1 << 3,
        }

        public enum UwPlayerConnectionClassEnum
        {
            None = 0,
            Computer = 1,
            VirtualReality = 2,
            Robot = 3,
            UwApi = 4,
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct UwPlayerComponent
        {
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 28)] public char[] name;
            public uint nameLength;
            public ulong steamUserId;
            public uint force;
            public float progress;
            public uint ping;
            public UwPlayerStateFlags state;
            public UwPlayerConnectionClassEnum playerConnectionClass;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchPlayerComponent(IntPtr entity, ref UwPlayerComponent data);

        [Flags]
        public enum UwForceStateFlags
        {
            None = 0,
            Winner = 1 << 0,
            Defeated = 1 << 1,
            Disconnected = 1 << 2,
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct UwForceComponent
        {
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)] public float[] color;
            public ulong score;
            public uint killCount;
            public uint lossCount;
            public uint finishTimestamp;
            public uint team;
            public UwForceStateFlags state;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchForceComponent(IntPtr entity, ref UwForceComponent data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwForceDetailsComponent
        {
            public ulong killValue;
            public ulong lossValue;
            public uint startingPosition;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchForceDetailsComponent(IntPtr entity, ref UwForceDetailsComponent data);

        public enum UwForeignPolicyEnum
        {
            None = 0,
            Self = 1,
            Ally = 2,
            Neutral = 3,
            Enemy = 4,
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct UwForeignPolicyComponent
        {
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 2)] public uint[] forces;
            public UwForeignPolicyEnum policy;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchForeignPolicyComponent(IntPtr entity, ref UwForeignPolicyComponent data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwDiplomacyProposalComponent
        {
            public uint offeror;
            public uint offeree;
            public UwForeignPolicyEnum proposal;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwFetchDiplomacyProposalComponent(IntPtr entity, ref UwDiplomacyProposalComponent data);

        public const uint UW_VERSION = 20;
        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwInitialize(uint version);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwDeinitialize();

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void UwExceptionCallbackType([MarshalAs(UnmanagedType.LPStr)] string message);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwSetExceptionCallback(UwExceptionCallbackType callback);

        public enum UwSeverityEnum
        {
            Note = 0,
            Hint = 1,
            Warning = 2,
            Info = 3,
            Error = 4,
            Critical = 5,
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct UwLogCallback
        {
            public IntPtr message;
            public IntPtr component;
            public UwSeverityEnum severity;
        }

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void UwLogCallbackType(ref UwLogCallback data);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwSetLogCallback(UwLogCallbackType callback);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwLog(UwSeverityEnum severity, [MarshalAs(UnmanagedType.LPStr)] string message);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwAssistConfig
        {
            [MarshalAs(UnmanagedType.I1)] public bool logistics;
            [MarshalAs(UnmanagedType.I1)] public bool aiming;
            [MarshalAs(UnmanagedType.I1)] public bool fighting;
            [MarshalAs(UnmanagedType.I1)] public bool retaliations;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwSetAssistConfig(ref UwAssistConfig config);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwSetPlayerName([MarshalAs(UnmanagedType.LPStr)] string name);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwSetPlayerColor(float r, float g, float b);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwSetConnectStartGui([MarshalAs(UnmanagedType.I1)] bool enabled, [MarshalAs(UnmanagedType.LPStr)] string extraCmdParams);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwSetConnectAsObserver([MarshalAs(UnmanagedType.I1)] bool observer);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwConnectFindLan(ulong timeoutMicroseconds);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwConnectDirect([MarshalAs(UnmanagedType.LPStr)] string address, ushort port);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwConnectLobbyId(ulong lobbyId);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwConnectNewServer(uint visibility, [MarshalAs(UnmanagedType.LPStr)] string extraCmdParams);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwTryReconnect();

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwDisconnect();

        public enum UwConnectionStateEnum
        {
            None = 0,
            Connecting = 1,
            Connected = 2,
            Disconnecting = 3,
            Error = 4,
        }

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void UwConnectionStateCallbackType(UwConnectionStateEnum state);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwSetConnectionStateCallback(UwConnectionStateCallbackType callback);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern UwConnectionStateEnum uwConnectionState();

        public enum UwGameStateEnum
        {
            None = 0,
            Session = 1,
            Preparation = 2,
            Game = 3,
            Finish = 4,
        }

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void UwGameStateCallbackType(UwGameStateEnum state);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwSetGameStateCallback(UwGameStateCallbackType callback);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern UwGameStateEnum uwGameState();

        public enum UwMapStateEnum
        {
            None = 0,
            Downloading = 1,
            Loading = 2,
            Loaded = 3,
            Unloading = 4,
            Error = 5,
        }

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void UwMapStateCallbackType(UwMapStateEnum state);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwSetMapStateCallback(UwMapStateCallbackType callback);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern UwMapStateEnum uwMapState();

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void UwUpdateCallbackType(uint tick, [MarshalAs(UnmanagedType.I1)] bool stepping);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwSetUpdateCallback(UwUpdateCallbackType callback);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwShootingUnit
        {
            public uint position;
            public uint force;
            public uint prototype;
            public uint id;
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct UwShootingData
        {
            public UwShootingUnit shooter;
            public UwShootingUnit target;
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct UwShootingArray
        {
            public IntPtr data;
            public uint count;
        }

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void UwShootingCallbackType(ref UwShootingArray data);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwSetShootingCallback(UwShootingCallbackType callback);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwMyPlayer
        {
            public uint playerEntityId;
            public uint forceEntityId;
            [MarshalAs(UnmanagedType.I1)] public bool primaryController;
            [MarshalAs(UnmanagedType.I1)] public bool admin;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwMyPlayer(ref UwMyPlayer data);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwModifiedEntities(ref UwIds data);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        [return: MarshalAs(UnmanagedType.I1)]
        public static extern bool uwTestConstructionPlacement(uint constructionPrototype, uint position);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern uint uwFindConstructionPlacement(uint constructionPrototype, uint position);

        public enum UwOrderTypeEnum
        {
            None = 0,
            Stop = 1,
            Guard = 2,
            Run = 3,
            Fight = 4,
            Load = 5,
            Unload = 6,
            SelfDestruct = 7,
        }

        [Flags]
        public enum UwOrderPriorityFlags
        {
            None = 0,
            Assistant = 1 << 0,
            User = 1 << 1,
            Enqueue = 1 << 2,
            Repeat = 1 << 3,
        }

        [StructLayout(LayoutKind.Sequential)]
        public struct UwOrder
        {
            public uint entity;
            public uint position;
            public UwOrderTypeEnum order;
            public UwOrderPriorityFlags priority;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwOrder(uint unit, ref UwOrder data);

        [StructLayout(LayoutKind.Sequential)]
        public struct UwOrders
        {
            public IntPtr orders;
            public uint count;
        }

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwOrders(uint unit, ref UwOrders data);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwCommandPlaceConstruction(uint proto, uint position, float yaw);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwCommandSetRecipe(uint unit, uint recipe);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwCommandLoad(uint unit, uint resourceType);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwCommandUnload(uint unit);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwCommandMove(uint unit, uint position, float yaw);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwCommandAim(uint unit, uint target);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwCommandRenounceControl(uint unit);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwCommandSelfDestruct(uint unit);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern ulong uwGetLobbyId();

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern ulong uwGetUserId();

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAdminKickPlayer(uint player);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAdminPlayerSetName(uint player, [MarshalAs(UnmanagedType.LPStr)] string name);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAdminPlayerJoinForce(uint player, uint force);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAdminForceJoinTeam(uint force, uint team);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAdminForceSetColor(uint force, float r, float g, float b);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAdminAddAi();

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAdminStartGame();

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAdminTerminateGame();

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAdminSetGameSpeed(float speed);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwAdminSetWeatherSpeed(float speed, float offset);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwSendCameraSuggestion(uint position);

        [DllImport(LibName, CallingConvention = CallingConvention.Cdecl)]
        public static extern void uwSendMapSelection([MarshalAs(UnmanagedType.LPStr)] string path);

    }
}
