import { UE, SchedulerType } from './types';

export class SchedulerEngine {
    static schedule(ueList: UE[], totalRBs: number, maxRBsPerUE: number, type: SchedulerType): void {
        switch (type) {
            case 'PF':
                this.proportionalFair(ueList, totalRBs, maxRBsPerUE);
                break;
            case 'RR':
                this.roundRobin(ueList, totalRBs, maxRBsPerUE);
                break;
            case 'MaxCQI':
                this.maxCQI(ueList, totalRBs, maxRBsPerUE);
                break;
        }
    }

    private static proportionalFair(ueList: UE[], totalRBs: number, maxRBsPerUE: number): void {
        const scores = ueList.map((ue, index) => ({
            score: ue.cqi / (ue.avgThroughput + 1e-5),
            index
        }));

        scores.sort((a, b) => b.score - a.score);

        let remainingRBs = totalRBs;
        for (const { index } of scores) {
            if (remainingRBs <= 0) break;

            const assigned = Math.min(maxRBsPerUE, remainingRBs);
            ueList[index].lastAssignedRBs = assigned;
            remainingRBs -= assigned;
        }
    }

    private static roundRobin(ueList: UE[], totalRBs: number, maxRBsPerUE: number): void {
        let remainingRBs = totalRBs;
        let currentIndex = 0;

        while (remainingRBs > 0) {
            const assigned = Math.min(maxRBsPerUE, remainingRBs);
            ueList[currentIndex].lastAssignedRBs = assigned;
            remainingRBs -= assigned;

            currentIndex = (currentIndex + 1) % ueList.length;
            if (currentIndex === 0 && remainingRBs === totalRBs) break; // Prevent infinite loop
        }
    }

    private static maxCQI(ueList: UE[], totalRBs: number, maxRBsPerUE: number): void {
        const sortedUEs = [...ueList].sort((a, b) => b.cqi - a.cqi);

        let remainingRBs = totalRBs;
        for (const ue of sortedUEs) {
            if (remainingRBs <= 0) break;

            const assigned = Math.min(maxRBsPerUE, remainingRBs);
            ue.lastAssignedRBs = assigned;
            remainingRBs -= assigned;
        }
    }

    static updateThroughput(ueList: UE[]): void {
        for (const ue of ueList) {
            ue.avgThroughput = 0.8 * ue.avgThroughput + 0.2 * ue.lastAssignedRBs;
            ue.throughputHistory.push(ue.avgThroughput);
        }
    }
} 