# 5G NR Base Station Scheduler Simulator

This project is a C++ simulation of a 5G NR base station uplink/downlink scheduler. It implements and compares three widely used scheduling algorithms:

- 🌀 **Round Robin**
- 📶 **Max CQI (Channel Quality Indicator)**
- ⚖️ **Proportional Fair**

These are used in real-world base stations (gNBs) to dynamically assign limited radio resources (Resource Blocks) to multiple UEs (User Equipments) in a fair and efficient way.

---

## 📌 Project Purpose

This simulator is designed to help understand and visualize the inner workings of a 5G NR scheduler — such as the one used in **Ericsson's UPC Scheduler** — by mimicking how scheduling decisions are made every Transmission Time Interval (TTI).

It is ideal for telecom enthusiasts, students, or professionals preparing for roles involving 5G wireless systems, baseband software, or real-time C++ development.

---

## 🧱 Features

- Simulates a base station assigning Resource Blocks to multiple UEs
- Models each UE with:
  - Channel Quality Indicator (CQI)
  - Average throughput (used for Proportional Fair)
  - ID and buffer activity
- Outputs assignment logs per TTI
- Modular scheduler design (easily extendable)

---

## 🧠 Algorithms Implemented

| Algorithm         | Description |
|------------------|-------------|
| **Round Robin** | Assigns resources in a fixed rotating order to ensure fairness |
| **Max CQI**      | Prioritizes UEs with the best signal quality (CQI) |
| **Proportional Fair** | Balances throughput and fairness by selecting UEs with the best CQI-to-throughput ratio |

---

## 📂 File Structure

```bash
.
├── main.cpp                            # Simulation loop (driver code)
├── UE.h / UE.cpp                       # UE class (User Equipment)
├── Scheduler.h                         # Abstract base class for schedulers
├── RoundRobinScheduler.h / .cpp        # Round Robin algorithm
├── MaxCQIScheduler.h / .cpp            # Max CQI algorithm
├── ProportionalFairScheduler.h / .cpp  # Proportional Fair algorithm
└── README.md                           # You're here!
