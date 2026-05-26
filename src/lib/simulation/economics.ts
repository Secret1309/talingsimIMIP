
import { ECONOMIC_DEFAULTS, ENERGY_CONSTANTS, TailingType, TAILING_TYPES, DEFAULT_TAILING } from './constants';
import { MassBalanceResult } from './massBalance';

export interface EconomicInput {
    massBalance: MassBalanceResult;
    tailingType: TailingType;
    inputMassTonPerDay: number;
    binderRatioPercent: number;
    curingTempC: number;
}

export interface FinancialMetrics {
    capex: number;
    npv: number;
    irr: number;
    paybackPeriod: number;
    cashFlows: number[];
    cumulativeCashFlows: number[];
}

export interface EconomicResult {
    // Cost Breakdown
    capexTotal: number;
    capexBreakdown: {
        mixer: number;
        molder: number;
        curingChamber: number;
        siloConveyor: number;
        neutralizationUnit: number;  // BARU: Unit netralisasi asam
        installation: number;
    };
    annualOpex: number;
    opexBreakdown: {
        binderCost: number;
        limeCost: number;        // BARU: Biaya kapur netralisasi asam
        energyCost: number;
        laborCost: number;
        maintenance: number;
        preTreatmentCost: number;
    };

    // Revenue
    annualRevenue: number;
    revenueBreakdown: {
        productSales: number;
        tippingFee: number;
    };

    // Profitability
    grossProfit: number;
    netProfit: number;

    // Financial Metrics
    metrics: FinancialMetrics;

    // Additional
    productPricePerTon: number;
    costPerTonProduct: number;
}

export const calculateEconomics = (input: EconomicInput): EconomicResult => {
    const { massBalance, tailingType, inputMassTonPerDay, binderRatioPercent, curingTempC } = input;
    const ED = ECONOMIC_DEFAULTS;
    const EC = ENERGY_CONSTANTS;

    // --- 1. CAPEX Calculation ---
    const scaleRatio = inputMassTonPerDay / ED.CAPEX_REF_CAPACITY;
    const scaleFactor = Math.pow(scaleRatio, ED.SCALING_FACTOR);

    const mixerCost = ED.CAPEX_MIXER_REF * scaleFactor;
    const molderCost = ED.CAPEX_MOLDER_REF * scaleFactor;
    const curingChamberCost = ED.CAPEX_CURING_CHAMBER_REF * scaleFactor;
    const siloConveyorCost = ED.CAPEX_SILO_CONVEYOR_REF * scaleFactor;
    const neutralizationUnitCost = ED.CAPEX_NEUTRALIZATION_UNIT_REF * scaleFactor; // BARU

    const equipmentCost = mixerCost + molderCost + curingChamberCost + siloConveyorCost + neutralizationUnitCost;

    // Lang factors
    const { INSTALLATION, CIVIL, ENGINEERING, CONTINGENCY } = ED.LANG_FACTORS;
    const installationCost = equipmentCost * (INSTALLATION + CIVIL + ENGINEERING + CONTINGENCY);
    const capexTotal = equipmentCost + installationCost;

    // --- 2. OPEX Calculation ---
    // Binder cost (Semen Portland): daily binder mass (ton) * 1000 (kg) * price/kg * operating days
    const annualBinderCost = massBalance.dailyBinderInput * 1000 * ED.BINDER_COST_PER_KG * EC.OPERATING_DAYS;

    // Lime cost (Kapur netralisasi): BARU untuk HPAL
    const annualLimeCost = massBalance.annualLimeInput * 1000 * ED.LIME_COST_PER_KG;

    // Energy cost: uses energy from mass balance
    const annualEnergyCost = massBalance.annualEnergyKWh * ED.ELECTRICITY_COST_KWH;

    // Labor
    const annualLaborCost = ED.LABOR_COST_PER_YEAR;

    // Maintenance (% of CAPEX)
    const annualMaintenanceCost = capexTotal * ED.OPEX_FIXED_PERCENT;

    // Pre-treatment cost (netralisasi asam / stabilisasi logam berat)
    const tailing = DEFAULT_TAILING[tailingType];
    const preTreatmentCost = massBalance.annualTailingInput * tailing.preTreatmentCostPerTon;

    const annualOpex = annualBinderCost + annualLimeCost + annualEnergyCost + annualLaborCost + annualMaintenanceCost + preTreatmentCost;

    // --- 3. Revenue Calculation ---
    // Product sales
    const productPrice = tailing.qualityGrade === 'premium'
        ? ED.PRODUCT_PRICE_PREMIUM
        : ED.PRODUCT_PRICE_STANDARD;
    const annualProductSales = massBalance.annualProductOutput * productPrice;

    // Tipping fee (for accepting tailing waste)
    const annualTippingFee = massBalance.annualTailingInput * ED.TIPPING_FEE_PER_TON;

    const annualRevenue = annualProductSales + annualTippingFee;

    // --- 4. Profitability ---
    const grossProfit = annualRevenue - annualOpex;

    // Tax calculation
    const depreciation = capexTotal / ED.PROJECT_YEARS;
    const taxableIncome = grossProfit - depreciation;
    const tax = taxableIncome > 0 ? taxableIncome * ED.TAX_RATE : 0;
    const netProfit = grossProfit - tax;
    const annualCashFlow = netProfit + depreciation;

    // --- 5. Financial Metrics ---
    const cashFlows: number[] = [-capexTotal];
    const cumulativeCashFlows: number[] = [-capexTotal];

    let npv = -capexTotal;
    for (let i = 1; i <= ED.PROJECT_YEARS; i++) {
        cashFlows.push(annualCashFlow);
        const cumVal = cumulativeCashFlows[i - 1] + annualCashFlow;
        cumulativeCashFlows.push(cumVal);
        npv += annualCashFlow / Math.pow(1 + ED.DISCOUNT_RATE, i);
    }

    // Payback Period
    let paybackPeriod = 999;
    if (annualCashFlow > 0) {
        paybackPeriod = capexTotal / annualCashFlow;
    }

    // IRR Calculation (Newton-Raphson approximation)
    let irr = 0;
    if (annualCashFlow > 0) {
        irr = 0.1; // Initial guess
        for (let iter = 0; iter < 100; iter++) {
            let npvCalc = -capexTotal;
            let derivCalc = 0;
            for (let t = 1; t <= ED.PROJECT_YEARS; t++) {
                const disc = Math.pow(1 + irr, t);
                npvCalc += annualCashFlow / disc;
                derivCalc -= t * annualCashFlow / Math.pow(1 + irr, t + 1);
            }
            if (Math.abs(derivCalc) < 1e-10) break;
            const newIrr = irr - npvCalc / derivCalc;
            if (Math.abs(newIrr - irr) < 1e-8) {
                irr = newIrr;
                break;
            }
            irr = newIrr;
        }
        // Clamp IRR to reasonable range (-99% to 1000%)
        irr = Math.max(-0.99, Math.min(10, irr));
    } else {
        irr = -1.0; // -100% if cash flow is negative or zero
    }

    // Cost per ton of product
    const costPerTonProduct = massBalance.annualProductOutput > 0
        ? annualOpex / massBalance.annualProductOutput
        : 0;

    return {
        capexTotal,
        capexBreakdown: {
            mixer: mixerCost,
            molder: molderCost,
            curingChamber: curingChamberCost,
            siloConveyor: siloConveyorCost,
            neutralizationUnit: neutralizationUnitCost,
            installation: installationCost,
        },
        annualOpex,
        opexBreakdown: {
            binderCost: annualBinderCost,
            limeCost: annualLimeCost,
            energyCost: annualEnergyCost,
            laborCost: annualLaborCost,
            maintenance: annualMaintenanceCost,
            preTreatmentCost,
        },
        annualRevenue,
        revenueBreakdown: {
            productSales: annualProductSales,
            tippingFee: annualTippingFee,
        },
        grossProfit,
        netProfit,
        metrics: {
            capex: capexTotal,
            npv,
            irr: irr * 100, // Convert to percentage
            paybackPeriod,
            cashFlows,
            cumulativeCashFlows,
        },
        productPricePerTon: productPrice,
        costPerTonProduct,
    };
};
