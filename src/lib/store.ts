
import { create } from 'zustand';
import { TailingType, TAILING_TYPES, DEFAULT_TAILING } from '@/lib/simulation/constants';
import { runMassBalance, MassBalanceResult, MassBalanceState } from '@/lib/simulation/massBalance';
import { calculateEconomics, EconomicResult } from '@/lib/simulation/economics';

interface SimulationStore {
    // Inputs
    tailingType: TailingType;
    inputMass: number;        // ton/day (100-5000)
    binderRatio: number;      // % (5-30)
    curingTemp: number;       // °C (25-80)

    // Results
    isSimulating: boolean;
    massBalanceResult: MassBalanceResult | null;
    processData: MassBalanceState[];
    economicResults: EconomicResult | null;

    // Actions
    setTailingType: (type: TailingType) => void;
    setParams: (params: Partial<SimulationStore>) => void;
    runSimulation: () => Promise<void>;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
    tailingType: TAILING_TYPES.HPAL_RAW,
    inputMass: 500,
    binderRatio: 15,
    curingTemp: 25,

    isSimulating: false,
    massBalanceResult: null,
    processData: [],
    economicResults: null,

    setTailingType: (type) => set({ tailingType: type }),
    setParams: (params) => set((state) => ({ ...state, ...params })),

    runSimulation: async () => {
        set({ isSimulating: true });

        // Artificial delay for simulation feel
        await new Promise(resolve => setTimeout(resolve, 1200));

        const { tailingType, inputMass, binderRatio, curingTemp } = get();
        const tailing = DEFAULT_TAILING[tailingType];

        // Run Mass Balance
        const mbResult = runMassBalance(tailing, inputMass, binderRatio, curingTemp);

        // Run Economics
        const econResults = calculateEconomics({
            massBalance: mbResult,
            tailingType,
            inputMassTonPerDay: inputMass,
            binderRatioPercent: binderRatio,
            curingTempC: curingTemp,
        });

        set({
            isSimulating: false,
            massBalanceResult: mbResult,
            processData: mbResult.processData,
            economicResults: econResults,
        });
    }
}));
