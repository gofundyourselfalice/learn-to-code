import {interestOnly,numberOfPayments, amortization, multiAmortization, nper, monthlyRate, METHOD_HIGHEST_INTEREST, METHOD_SNOWBALL} from "../loan"
describe("loan", () => {
  it("interestOnly", () => {
    //expect(interestOnly(1000, 24)).toBe(18.09)
    expect(interestOnly(1000, 24)).toBe(20)
  })

  it("numberOfPayments", () => {
    // https://money.stackexchange.com/questions/64639/how-to-calculate-the-number-of-months-until-a-loan-is-paid-off-given-principal
    // 21.97 is expected value (rounded to 2dp)
    expect(numberOfPayments(10000, 10, 500)).toBe(22)
  })

  it("monthlyRate", () => {
    expect(monthlyRate(7)).toBe(0.005833333333333334)
    //expect(monthlyRate(7)).toBe(0.005654145387405274)
  })

  it("nper", () => {
    expect(nper(0.07/12, -150, 8000)).toBe(64.07334877066187)
  })

  it("amortization", () => {
    var results = amortization(4400, 13, 100)
    //console.log(JSON.stringify(results.installments))
    expect(results.amount).toBe(4400)
    expect(results.total.interest).toBe(1609.67)
    expect(results.total.capital).toBe(4400)
    expect(results.total.combined).toBe(6009.67)
    expect(results.total.months).toBe(61)
  })

  it("multiAmortization METHOD_HIGHEST_INTEREST", () => {
    var debts = {
      details: [
        {amount: 4400, rate: 13, minPayment: 50, id:0, creditor: 'a'},
        {amount: 6200, rate: 22, minPayment: 120, id:1, creditor: 'b'}
      ], repayment: {payment: 300}, total: {minPayment: 170}
    }
    var results = multiAmortization(debts, METHOD_HIGHEST_INTEREST)
    //console.log(JSON.stringify(results.installments))
    expect(results.amount).toBe(10600)
    expect(results.total.interest).toBe(4119.63)
    expect(results.total.capital).toBe(10600)
    expect(results.total.months).toBe(50)
    expect(results.total.combined).toBe(14719.63)
  })

  it("multiAmortization METHOD_SNOWBALL", () => {
    var debts = {
      details: [
        {amount: 4400, rate: 13, minPayment: 50, id:0, creditor: 'a'},
        {amount: 6200, rate: 22, minPayment: 120, id:1, creditor: 'b'}
      ], repayment: {payment: 300}, total: {minPayment: 170}
    }
    var results = multiAmortization(debts, METHOD_SNOWBALL)
    //console.log(JSON.stringify(results.installments))
    expect(results.amount).toBe(10600)
    expect(results.total.interest).toBe(5452.59)
    expect(results.total.capital).toBe(10600)
    expect(results.total.months).toBe(54)
    expect(results.total.combined).toBe(16052.59)
  })
})
