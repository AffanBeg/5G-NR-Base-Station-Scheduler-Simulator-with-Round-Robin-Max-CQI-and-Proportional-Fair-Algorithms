#pragma once
#include <vector>
#include "UE.h"

class Scheduler {
public:
    virtual void schedule(std::vector<UE>& ueList, int totalRBs) = 0;
    virtual ~Scheduler() = default;
};
