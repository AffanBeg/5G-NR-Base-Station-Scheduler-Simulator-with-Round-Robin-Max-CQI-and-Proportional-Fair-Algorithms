#pragma once
#include "Scheduler.h"

class ProportionalFairScheduler : public Scheduler {
public:
    void schedule(std::vector<UE>& ueList, int totalRBs) override;
};
