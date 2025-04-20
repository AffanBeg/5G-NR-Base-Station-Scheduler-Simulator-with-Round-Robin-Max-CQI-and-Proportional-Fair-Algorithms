# 5G NR Resource Scheduler Simulator

This project simulates a simplified 5G New Radio (NR) uplink/downlink scheduler using C++. It models how a base station assigns Resource Blocks (RBs) to multiple UEs (User Equipments) every millisecond using a Proportional Fair scheduling algorithm.

## Files
- `main.cpp`: Runs the scheduler over multiple time intervals.
- `UE.h/.cpp`: Defines the UE class with CQI, throughput, and buffer updates.
- `Scheduler.h`: Abstract base class for schedulers.
- `ProportionalFairScheduler.h/.cpp`: Implements the Proportional Fair scheduling logic.

## How to Compile
```bash
g++ -o scheduler_simulator main.cpp UE.cpp ProportionalFairScheduler.cpp -std=c++17
```

## How to Run
```bash
./scheduler_simulator
```

## Project Structure
- Each UE has:
  - Unique ID
  - Channel Quality Indicator (CQI)
  - Average throughput
  - Last assigned RBs

- The scheduler:
  - Runs every 1ms (TTI)
  - Has 20 total RBs to allocate
  - Assigns max 5 RBs per UE
  - Uses Proportional Fair algorithm: CQI / Average Throughput

## Why This Project
This demonstrates understanding of:
- Real-time C++ development
- 3GPP-like scheduling logic
- Wireless systems simulation
- Object-oriented design

Great for showcasing readiness for roles like Ericsson's Baseband Software Developer.
