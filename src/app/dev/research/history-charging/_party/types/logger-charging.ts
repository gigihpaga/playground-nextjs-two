type HistoryBatteryCycle = {
    OriginalCapacity: number; //3224
    BatteryHealth: number; //96
    AnalyticTimestamp: string; //'29/04/23 07.00'
    AverageTemperature: number; //29
    CycleCount: number; //189
    PowerUtilCalculatedBatteryHealth: number; //94.879999999999995
    CurrentCapacity: number; //3059
};

type StatusBattery = {
    currentBatterCapacity: number; //12
    checkBatteryCapacityDate: string; //'23/05/23 19.29'
};

type HistoryCharging = {
    fullyCharging: boolean; //false
    startChargingDate: string; //'28/06/23 09.24'
    startChargingCapacity: number; //41
    endChargingCapacity: number; //41
    loggerBatteryCapacity: StatusBattery[]; //[]
    endChargingDate: string; //'28/06/23 09.24'
    fullyChargingDate: string; //'-'
};

export type LoggerCharging = {
    createAt: string;
    updateAt: string;
    nameApp: string;
    description: string;
    dataCharging: HistoryCharging[];
    historyBatteryCycle: HistoryBatteryCycle[];
};
