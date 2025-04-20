export interface UE {
    id: number;
    cqi: number;
    avgThroughput: number;
    lastAssignedRBs: number;
    throughputHistory: number[];
}

export type SchedulerType = 'PF' | 'RR' | 'MaxCQI';

export interface SchedulerState {
    currentTTI: number;
    isRunning: boolean;
    ueList: UE[];
    totalRBs: number;
    maxRBsPerUE: number;
    schedulerType: SchedulerType;
}

export interface SchedulerConfig {
    totalRBs: number;
    maxRBsPerUE: number;
    numTTIs: number;
    initialUEs: {
        id: number;
        cqi: number;
    }[];
} 