// loan.js
export const METHOD_SNOWBALL = 'snowball';
export const METHOD_HIGHEST_INTEREST = 'highest';

Number.prototype.round = function() {
    return Math.round( this * 100 + Number.EPSILON ) / 100
}

export const monthlyRate = rate => {
    // https://money.stackexchange.com/questions/54757/loan-repayment-calculation-and-monthly-compounding-interest-problem
    // r = (1 + 0.07)^(1/12) - 1
    //return Math.pow((1 + rate/100), (1/12)) - 1
    return rate / 12 / 100
}

export const interestOnly = function(principal, rate) {
    return (principal * monthlyRate(rate)).round()
}

export const numberOfPayments = function(principal, rate, payment) {
    // https://en.wikipedia.org/wiki/Annual_percentage_rate
    // rate formula (simplified & solved for n)
    // https://money.stackexchange.com/questions/64639/how-to-calculate-the-number-of-months-until-a-loan-is-paid-off-given-principal
    var n = 0 - Math.log10( (1 - monthlyRate(rate) * principal / payment)) / Math.log10(1 + monthlyRate(rate))
    return Math.ceil(n)
}

export const nper = function(rate, pmt, pv, fv = 0, when = 0) {
    // based on numpty nper
    if (rate === 0) {
        return -(fv + pv) / pmt
    }

    var z = pmt * (1 + rate * when) / rate
    
    return Math.log10((-fv+z) / (pv+z)) / Math.log10(1+rate)
}

export const emi = function(principal, rate, payments) {
    // https://www.businesstoday.in/moneytoday/banking/how-to-calculate-emi-on-your-loans-formula-explanation/story/198944.html
    //  [P x R x (1+R)^N]/[(1+R)^N-1]
    //return principal * monthlyRate(rate) * Math.pow( (1 + monthlyRate(rate)), payments) / (Math.pow( (1 + monthlyRate(rate)), payments) - 1)
    // https://www.investopedia.com/terms/e/equated_monthly_installment.asp
    return principal * (rate / 100) * (1 + monthlyRate(rate)) * payments / (12 * ((1+ monthlyRate(rate)) * payments) - 1) 
}

export const amortization = function(principal, rate, payment) {
    var amortizationResults = {
        installments: [],
        amount: principal,
        total: {
            interest: 0,
            capital: 0,
            combined: 0,
            months: 0
        }
    }

    var remaining = principal
    var payments = numberOfPayments(principal, rate, payment)

    for (var i = 0; i < payments; i++) {
        var interest = (remaining * monthlyRate(rate)).round()
        var currentPayment = remaining + interest > payment ? payment : remaining + interest
        var capital = (currentPayment - interest).round()

        remaining -= capital

        amortizationResults.installments[i] = {
            installmentNumber: i,
            remain: remaining,
            interest: interest,
            capital: capital,
            combined: currentPayment
        }
    }

    updateAmortizationTotals(amortizationResults)

    return amortizationResults
}

const updateAmortizationTotals = function(amortizationResults) {
    amortizationResults.total.capital = amortizationResults.installments.reduce(function(a, b){
        return a + (parseFloat(b.capital) || 0)
    }, 0).round()
    amortizationResults.total.interest = amortizationResults.installments.reduce(function(a, b){
        return a + (parseFloat(b.interest) || 0)
    }, 0).round()
    amortizationResults.total.combined = (amortizationResults.total.capital + amortizationResults.total.interest).round()
    amortizationResults.total.months = amortizationResults.installments.length
}

const sortDebts = (debts, method) => {
    var sortedDetails = [...debts.details].sort(function(a, b) {
        if (method === METHOD_SNOWBALL) {
            return a.amount - b.amount;
        } else if (method === METHOD_HIGHEST_INTEREST) {
            return b.rate - a.rate;
        } else {
            return null
        }
    })

    return sortedDetails
}

export const multiAmortization = (debts, method) => {
    var amortizationResults = {
        installments: [],
        amount: 0,
        total: {
            interest: 0,
            capital: 0,
            combined: 0,
            months: 0
        },
        installmentsByCreditor: []
    }

    var additionalMonthlyPayment = debts.repayment.payment - debts.total.minPayment
    if (additionalMonthlyPayment < 0) {
        return amortizationResults
    }
    
    var sortedDetails = sortDebts(debts, method)

    var currentMonth = 0
    var finalPaymentCarryOver = 0
    for (var i = 0; i < sortedDetails.length; i++) {
        let debt = sortedDetails[i]
        if (typeof debt === 'undefined') {
            continue;
        }
        amortizationResults.amount += debt.amount
        var debtDetail = {id: i, creditor: debt.creditor, colour: debt.colour}
        amortizationResults.installmentsByCreditor[i] = {...debtDetail, data: []}
    
        var currentDebtAmount = debt.amount
        if (currentMonth > 0) {
            var minAmortization = amortization(debt.amount, debt.rate, debt.minPayment)

            // min payments made
            for (var j = 0; j < currentMonth; j++) {
                if (minAmortization.total.months > j) {
                    // If there's a final payment carry over from previous debt, use that for the final month of the min payments
                    if (j === currentMonth - 1 && finalPaymentCarryOver > 0) {
                        minAmortization.installments[j].capital += finalPaymentCarryOver
                        minAmortization.installments[j].combined += finalPaymentCarryOver
                        minAmortization.installments[j].remain -= finalPaymentCarryOver
                        finalPaymentCarryOver = 0
                    }
                    addPaymentInstallment(amortizationResults.installmentsByCreditor[i].data, j, minAmortization.installments[j])
                    addPaymentInstallment(amortizationResults.installments, j, minAmortization.installments[j], debtDetail)
                }
            }

            if (minAmortization.installments.length > currentMonth) {
                currentDebtAmount = minAmortization.installments[currentMonth - 1].remain
            } else {
                currentDebtAmount = 0
            }
        }
        
        // adjust the starting balance to account for the min payments over x months
        var higherAmortization = amortization(currentDebtAmount, debt.rate, debt.minPayment + additionalMonthlyPayment)
    
        // adjusted (higher) payments made
        for (var k = 0; k < higherAmortization.installments.length; k++) {
            addPaymentInstallment(amortizationResults.installmentsByCreditor[i].data, k + currentMonth, higherAmortization.installments[k])
            addPaymentInstallment(amortizationResults.installments, k + currentMonth, higherAmortization.installments[k], debtDetail)
        }
    
        if (higherAmortization.installments.length > 0) {
            var finalPayment = higherAmortization.installments[higherAmortization.installments.length - 1].combined
            if (finalPayment < debt.minPayment + additionalMonthlyPayment) {
                finalPaymentCarryOver = debt.minPayment + additionalMonthlyPayment - finalPayment
            }    
        }    

        // now that this balance is used up, we can use that payment as well for the additional
        additionalMonthlyPayment += debt.minPayment
        currentMonth += higherAmortization.total.months
    }

    console.log(JSON.stringify(amortizationResults.installmentsByCreditor))
    //console.log(JSON.stringify(amortizationResults))

    updateAmortizationTotals(amortizationResults)
    
    return amortizationResults
}

const addPaymentInstallment = function(payments, installmentNumber, installment, details) {
    if (payments.length <= installmentNumber) {
        payments[installmentNumber] = {
            installmentNumber: installmentNumber,
            remain: 0,
            interest: 0,
            capital: 0,
            combined: 0,
            details: [],
            x: installmentNumber + 1,
            y: installment.remain,
        }
    }
    payments[installmentNumber].remain += installment.remain
    payments[installmentNumber].interest += installment.interest
    payments[installmentNumber].capital += installment.capital    
    payments[installmentNumber].combined += installment.capital + installment.interest    
    if (typeof details !== 'undefined') {
        details = {...details, remain: installment.remain, interest: installment.interest, capital: installment.capital, combined: installment.combined}
        payments[installmentNumber].details.push(details)    
    }
}
