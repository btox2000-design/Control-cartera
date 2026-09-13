/**
 * Servicio de Cálculos Financieros
 * Implementación del Sistema de Amortización Francés
 */

export const FinancialService = {
  
  /**
   * Calcula la tasa de interés anual necesaria para un pago mensual dado.
   * Utiliza el método de búsqueda binaria.
   */
  calculateRateFromPayment(principal, targetPayment, months) {
    let low = 0;
    let high = 1000; // Tasa máxima razonable de 1000% anual
    let rate = 0;

    // Búsqueda binaria para encontrar la tasa
    for (let i = 0; i < 100; i++) { // 100 iteraciones son suficientes para alta precisión
      rate = (low + high) / 2;
      const payment = this.calculateMonthlyPayment(principal, rate, months);
      
      if (Math.abs(payment - targetPayment) < 0.01) break;

      if (payment < targetPayment) {
        low = rate;
      } else {
        high = rate;
      }
    }
    return parseFloat(rate.toFixed(2));
  },

  /**
   * Calcula la cuota mensual constante (Sistema Francés)
   * @param {number} principal - Monto del préstamo
   * @param {number} annualRate - Tasa de interés anual (ej. 24)
   * @param {number} months - Plazo en meses
   * @returns {number} Cuota mensual
   */
  calculateMonthlyPayment(principal, annualRate, months) {
    if (annualRate === 0) return principal / months;
    
    const monthlyRate = (annualRate / 100) / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    return payment;
  },

  /**
   * Genera el cronograma de amortización con fechas límite
   * @param {Date} startDate - Fecha de inicio del crédito
   */
  calculateAmortizationSchedule(principal, annualRate, months, startDate) {
    const payment = this.calculateMonthlyPayment(principal, annualRate, months);
    const monthlyRate = (annualRate / 100) / 12;
    let balance = principal;
    const schedule = [];

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principalPayment = payment - interest;
      const previousBalance = balance;
      balance -= principalPayment;
      
      // Fecha límite (simplificación: 5to día del mes siguiente)
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i);
      dueDate.setDate(5);
      
      schedule.push({
        month: i,
        payment: payment,
        interest: interest,
        principal: principalPayment,
        balance: Math.max(0, balance),
        previousBalance: previousBalance,
        dueDate: dueDate
      });
    }
    
    return schedule;
  },

  /**
   * Calcula el saldo deudor actual: Capital insoluto + intereses devengados hasta hoy.
   */
  calculateTotalPayoffAtDate(principal, annualRate, months, startDate, paidMonths) {
    const schedule = this.calculateAmortizationSchedule(principal, annualRate, months, startDate);
    const today = new Date();
    
    // 1. Identificar el último mes pagado
    const lastPaidMonth = Math.max(0, ...paidMonths);
    
    // 2. Capital insoluto: Balance después del último mes pagado
    let capitalInsoluto = (lastPaidMonth === 0) ? principal : schedule[lastPaidMonth - 1].balance;
    
    // 3. Intereses devengados desde el último pago hasta hoy
    const monthlyRate = (annualRate / 100) / 12;
    
    // Días transcurridos desde el último pago (o inicio) hasta hoy
    const lastPaymentDate = (lastPaidMonth === 0) ? new Date(startDate) : schedule[lastPaidMonth - 1].dueDate;
    const diffTime = Math.max(0, today - lastPaymentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Interés diario aproximado
    const dailyRate = monthlyRate / 30;
    const interesesDevengados = capitalInsoluto * dailyRate * diffDays;
    
    return capitalInsoluto + interesesDevengados;
  },

  /**
   * Calcula el pago total necesario para liquidar el crédito hoy
   */
  calculateCurrentPayoff(principal, annualRate, months, startDate, paidMonths) {
    const schedule = this.calculateAmortizationSchedule(principal, annualRate, months);
    let remainingBalance = 0;
    
    // Sumar las cuotas de los meses no pagados
    schedule.forEach((row, i) => {
      if (!paidMonths.includes(row.month)) {
        remainingBalance += row.payment;
      }
    });
    
    return remainingBalance;
  }
};
