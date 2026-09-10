export const FinancialService = {
    calculateMonthlyPayment: (principal, annualRate, months) => {
        const monthlyRate = (annualRate / 12) / 100;
        if (monthlyRate === 0) return principal / months;
        return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    },

    calculateAmortizationSchedule: (principal, annualRate, months, createdAt) => {
        const monthlyRate = (annualRate / 12) / 100;
        const monthlyPayment = FinancialService.calculateMonthlyPayment(principal, annualRate, months);
        let balance = principal;
        let schedule = [];

        for (let i = 1; i <= months; i++) {
            const interest = balance * monthlyRate;
            const principalPart = monthlyPayment - interest;
            balance -= principalPart;

            schedule.push({
                month: i,
                payment: monthlyPayment,
                interest: interest,
                principal: principalPart,
                balance: Math.max(0, balance)
            });
        }
        return schedule;
    },

    calculateCurrentPayoff: (principal, annualRate, months, createdAt, paidMonths) => {
        const schedule = FinancialService.calculateAmortizationSchedule(principal, annualRate, months, createdAt);
        
        // 1. Identificar el saldo de capital actual (tras el último mes pagado)
        const lastPaidMonth = paidMonths.length > 0 ? Math.max(...paidMonths) : 0;
        const currentPrincipalBalance = lastPaidMonth === 0 ? principal : schedule[lastPaidMonth - 1].balance;

        // 2. Calcular intereses devengados desde el último pago hasta hoy
        const monthlyRate = (annualRate / 12) / 100;
        const lastPaymentDate = lastPaidMonth === 0 ? new Date(createdAt) : new Date(new Date(createdAt).getFullYear(), new Date(createdAt).getMonth() + lastPaidMonth, 5);
        const today = new Date();
        
        const diffTime = Math.max(0, today - lastPaymentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const dailyRate = monthlyRate / 30;
        const accruedInterest = currentPrincipalBalance * dailyRate * diffDays;

        return currentPrincipalBalance + accruedInterest;
    }
};
