#pragma once
#include <string>

class UE {
private:
    int id;
    int cqi;
    double avgThroughput;
    int lastAssignedRBs;

public:
    UE(int id, int cqi, double avgThroughput);
    int getId() const;
    int getCQI() const;
    double getAvgThroughput() const;
    void assignRBs(int numRBs);
    void updateAverageThroughput();
};
