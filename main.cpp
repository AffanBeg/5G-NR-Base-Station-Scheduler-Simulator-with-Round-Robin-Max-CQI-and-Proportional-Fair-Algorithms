#include <iostream>
#include <vector>
#include <memory>
#include <iomanip>
#include "UE.h"
#include "Scheduler.h"
#include "ProportionalFairScheduler.h"

void printUEMetrics(const std::vector<UE>& ueList) {
    std::cout << "\nUE Metrics:" << std::endl;
    std::cout << std::setw(5) << "UE ID" << std::setw(8) << "CQI" << std::setw(15) << "Avg Throughput" << std::endl;
    std::cout << std::string(30, '-') << std::endl;
    
    for (const auto& ue : ueList) {
        std::cout << std::setw(5) << ue.getId() 
                  << std::setw(8) << ue.getCQI()
                  << std::setw(15) << std::fixed << std::setprecision(2) << ue.getAvgThroughput()
                  << std::endl;
    }
}

int main() {
    std::vector<UE> ueList = {
        UE(1, 12, 0),
        UE(2, 8, 0),
        UE(3, 5, 0),
        UE(4, 10, 0),
        UE(5, 6, 0)
    };

    int totalRBs = 20;
    int numTTIs = 10;

    std::unique_ptr<Scheduler> scheduler = std::make_unique<ProportionalFairScheduler>();

    std::cout << "Initial UE Metrics:" << std::endl;
    printUEMetrics(ueList);

    for (int tti = 1; tti <= numTTIs; ++tti) {
        std::cout << "\n[TTI " << tti << "]" << std::endl;
        scheduler->schedule(ueList, totalRBs);

        for (auto& ue : ueList) {
            ue.updateAverageThroughput();
        }

        printUEMetrics(ueList);
    }

    return 0;
}
