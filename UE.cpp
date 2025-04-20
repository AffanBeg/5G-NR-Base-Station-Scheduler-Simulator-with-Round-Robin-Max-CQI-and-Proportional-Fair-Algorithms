#include "UE.h"

UE::UE(int id, int cqi, double avgThroughput)
    : id(id), cqi(cqi), avgThroughput(avgThroughput), lastAssignedRBs(0) {}

int UE::getId() const {
    return id;
}

int UE::getCQI() const {
    return cqi;
}

double UE::getAvgThroughput() const {
    return avgThroughput;
}

void UE::assignRBs(int numRBs) {
    lastAssignedRBs = numRBs;
}

void UE::updateAverageThroughput() {
    avgThroughput = 0.8 * avgThroughput + 0.2 * lastAssignedRBs;
}
