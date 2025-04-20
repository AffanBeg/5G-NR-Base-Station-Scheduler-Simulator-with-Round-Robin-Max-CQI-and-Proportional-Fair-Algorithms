#include "ProportionalFairScheduler.h"
#include <algorithm>
#include <iostream>

void ProportionalFairScheduler::schedule(std::vector<UE>& ueList, int totalRBs) {
    std::vector<std::pair<double, int>> scores;

    for (size_t i = 0; i < ueList.size(); ++i) {
        double score = ueList[i].getCQI() / (ueList[i].getAvgThroughput() + 1e-5); // avoid division by zero
        scores.push_back({score, static_cast<int>(i)});
    }

    std::sort(scores.begin(), scores.end(), std::greater<>());

    int remainingRBs = totalRBs;
    for (const auto& scorePair : scores) {
        if (remainingRBs <= 0) break;

        int index = scorePair.second;
        int assigned = std::min(5, remainingRBs); // give max 5 RBs per UE
        ueList[index].assignRBs(assigned);
        remainingRBs -= assigned;

        std::cout << "UE" << ueList[index].getId() << " assigned " << assigned << " RBs (Score: " << scorePair.first << ")" << std::endl;
    }
}
