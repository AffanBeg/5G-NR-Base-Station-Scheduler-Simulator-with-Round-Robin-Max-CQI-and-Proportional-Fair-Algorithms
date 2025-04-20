import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SchedulerState, SchedulerType, UE } from './types';
import { SchedulerEngine } from './schedulers';

const initialConfig = {
    totalRBs: 20,
    maxRBsPerUE: 5,
    numTTIs: 10,
    initialUEs: [
        { id: 1, cqi: 12 },
        { id: 2, cqi: 8 },
        { id: 3, cqi: 5 },
        { id: 4, cqi: 10 },
        { id: 5, cqi: 6 }
    ]
};

function App() {
    const [state, setState] = useState<SchedulerState>({
        currentTTI: 0,
        isRunning: false,
        ueList: initialConfig.initialUEs.map(ue => ({
            ...ue,
            avgThroughput: 0,
            lastAssignedRBs: 0,
            throughputHistory: [0]
        })),
        totalRBs: initialConfig.totalRBs,
        maxRBsPerUE: initialConfig.maxRBsPerUE,
        schedulerType: 'PF'
    });

    const stepSimulation = useCallback(() => {
        setState(prev => {
            if (prev.currentTTI >= initialConfig.numTTIs) {
                return { ...prev, isRunning: false };
            }

            const newUEList = [...prev.ueList];
            SchedulerEngine.schedule(newUEList, prev.totalRBs, prev.maxRBsPerUE, prev.schedulerType);
            SchedulerEngine.updateThroughput(newUEList);

            return {
                ...prev,
                currentTTI: prev.currentTTI + 1,
                ueList: newUEList
            };
        });
    }, []);

    useEffect(() => {
        let interval: number;
        if (state.isRunning) {
            interval = window.setInterval(stepSimulation, 1000);
        }
        return () => clearInterval(interval);
    }, [state.isRunning, stepSimulation]);

    const handleSchedulerChange = (type: SchedulerType) => {
        setState(prev => ({
            ...prev,
            schedulerType: type,
            currentTTI: 0,
            ueList: initialConfig.initialUEs.map(ue => ({
                ...ue,
                avgThroughput: 0,
                lastAssignedRBs: 0,
                throughputHistory: [0]
            }))
        }));
    };

    const resetSimulation = () => {
        setState(prev => ({
            ...prev,
            currentTTI: 0,
            isRunning: false,
            ueList: initialConfig.initialUEs.map(ue => ({
                ...ue,
                avgThroughput: 0,
                lastAssignedRBs: 0,
                throughputHistory: [0]
            }))
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        5G NR Scheduler Visualization
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Visualize and analyze how different scheduling algorithms distribute network resources among users in real-time.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Controls Panel */}
                    <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-[0_0_15px_rgba(167,139,250,0.1)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(167,139,250,0.2)] border border-purple-500/20">
                        <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Controls</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Scheduler Type</label>
                                <select
                                    value={state.schedulerType}
                                    onChange={(e) => handleSchedulerChange(e.target.value as SchedulerType)}
                                    className="mt-1 block w-full rounded-lg bg-slate-800 border-purple-500/30 text-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500/20 transition-all duration-200"
                                >
                                    <option value="PF">Proportional Fair</option>
                                    <option value="RR">Round Robin</option>
                                    <option value="MaxCQI">Max CQI</option>
                                </select>
                            </div>
                            
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setState(prev => ({ ...prev, isRunning: !prev.isRunning }))}
                                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex-1 ${
                                        state.isRunning 
                                            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                                            : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                    }`}
                                >
                                    {state.isRunning ? 'Pause' : 'Start'}
                                </button>
                                <button
                                    onClick={stepSimulation}
                                    disabled={state.isRunning}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 flex-1 shadow-[0_0_15px_rgba(147,51,234,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Step
                                </button>
                                <button
                                    onClick={resetSimulation}
                                    className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-lg font-medium transition-all duration-300 flex-1 shadow-[0_0_15px_rgba(71,85,105,0.3)]"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* UE List */}
                    <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-[0_0_15px_rgba(167,139,250,0.1)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(167,139,250,0.2)] border border-purple-500/20">
                        <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">UE Status</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-purple-500/20">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">UE ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">CQI</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Throughput</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Assigned RBs</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-purple-500/20">
                                    {state.ueList.map(ue => (
                                        <tr key={ue.id} className="hover:bg-purple-500/10 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{ue.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ue.cqi}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ue.avgThroughput.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{ue.lastAssignedRBs}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Throughput Chart */}
                <div className="mt-8 backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-[0_0_15px_rgba(167,139,250,0.1)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(167,139,250,0.2)] border border-purple-500/20">
                    <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Throughput Over Time</h2>
                    <p className="text-gray-300 mb-6">
                        This graph shows how the data rate (throughput) changes for each user over time. 
                        Higher values mean better performance. The scheduler tries to balance fairness 
                        and efficiency across all users.
                    </p>
                    <div className="bg-slate-900/50 p-6 rounded-xl backdrop-blur-sm">
                        <LineChart
                            width={1000}
                            height={600}
                            data={Array.from({ length: state.currentTTI + 1 }, (_, i) => ({
                                TTI: i,
                                ...state.ueList.reduce((acc, ue) => ({
                                    ...acc,
                                    [`UE${ue.id}`]: ue.throughputHistory[i] || 0
                                }), {})
                            }))}
                            margin={{ top: 20, right: 150, left: 50, bottom: 30 }}
                        >
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="rgba(167, 139, 250, 0.1)" 
                                horizontal={true}
                                vertical={true}
                            />
                            <XAxis 
                                dataKey="TTI" 
                                label={{ value: 'Time (TTI)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
                                stroke="#94a3b8"
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                domain={[0, initialConfig.numTTIs]}
                            />
                            <YAxis 
                                label={{ 
                                    value: 'Throughput (Mbps)', 
                                    angle: -90, 
                                    position: 'insideLeft',
                                    offset: -35,
                                    fill: '#94a3b8'
                                }}
                                stroke="#94a3b8"
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                domain={[0, 'auto']}
                                padding={{ top: 50 }}
                                tickCount={10}
                            />
                            <Tooltip 
                                formatter={(value: number) => [`${value.toFixed(2)} Mbps`, 'Throughput']}
                                labelFormatter={(label) => `Time: ${label} TTI`}
                                contentStyle={{ 
                                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                                    border: '1px solid rgba(167, 139, 250, 0.2)',
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                                    fontSize: '12px',
                                    color: '#e2e8f0'
                                }}
                                isAnimationActive={false}
                            />
                            <Legend 
                                layout="vertical" 
                                align="right" 
                                verticalAlign="middle"
                                wrapperStyle={{
                                    paddingLeft: '20px',
                                    fontSize: '12px',
                                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                                    borderRadius: '4px',
                                    padding: '12px',
                                    border: '1px solid rgba(167, 139, 250, 0.2)',
                                    color: '#e2e8f0'
                                }}
                            />
                            {state.ueList.map((ue, index) => {
                                const colors = [
                                    '#f43f5e', // Rose
                                    '#10b981', // Emerald
                                    '#3b82f6', // Blue
                                    '#f59e0b', // Amber
                                    '#a855f7'  // Purple
                                ];
                                return (
                                    <Line
                                        key={ue.id}
                                        type="monotone"
                                        dataKey={`UE${ue.id}`}
                                        name={`UE ${ue.id} (CQI: ${ue.cqi})`}
                                        stroke={colors[index]}
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: colors[index], strokeWidth: 2, stroke: 'rgba(30, 41, 59, 0.9)' }}
                                        activeDot={{ r: 7, fill: colors[index], strokeWidth: 2, stroke: 'rgba(30, 41, 59, 0.9)' }}
                                        connectNulls={true}
                                        isAnimationActive={false}
                                    />
                                );
                            })}
                        </LineChart>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
