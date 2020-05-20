// Ducks https://github.com/erikras/ducks-modular-redux
import produce from 'immer'
import {amortization, interestOnly, multiAmortization, METHOD_SNOWBALL, METHOD_HIGHEST_INTEREST} from '../utils/loan'

// Initial
// https://colorbrewer2.org/#type=sequential&scheme=GnBu&n=9
/*
const colours = [
  '#f7fcf0',
  '#e0f3db',
  '#ccebc5',
  '#a8ddb5',
  '#7bccc4',
  '#4eb3d3',
  '#2b8cbe',
  '#0868ac',
  '#084081',
];
*/
// https://flatuicolors.com/palette/gb
export const colours = [
  '#00a8ff',
  '#9c88ff',
  '#fbc531',
  '#4cd137',
  '#487eb0',
];

const initialState = {
    debts: {
      details: [{
        id: 0,
        colour: colours[0],
        creditor: '',
        amount: '',
        rate: '',
        minPayment: '',
        ifMinPaymentsMade: {
          totalMonths: 0,
          totalInterest: 0,
          graph: {
            principal: [],
            interest: []
          }
        }
      }],
      total: {
        amount: 0,
        minPayment: 0,
        interestIfOnlyMinPayment: 0 
      },
      repayment: {
        method: METHOD_HIGHEST_INTEREST,
        payment: 0,
        snowball: {installments: [], total: {interest:0, months:0}},
        highestInterest: {installments: [], total: {interest:0, months:0}}
      }
    }
  };

// Actions
const ADD_DEBT = 'ADD_DEBT';
const UPDATE_DEBT = 'UPDATE_DEBT';
const REMOVE_DEBT = 'REMOVE_DEBT';
const UPDATE_REPAYMENT = 'UPDATE_REPAYMENT';
const SORT_DEBT = 'SORT_DEBT';

let nextDebtId = 1

// Reducer
//export default function reducer(state = initialState, action = {}) {
export default (state = initialState, action) => 
  produce(state, draft => {
    switch (action.type) {
      case ADD_DEBT:
        draft.debts.details[action.debt.id] = action.debt
        break
      case UPDATE_DEBT:
        draft.debts.details[action.debt.id] = action.debt
        break
      case REMOVE_DEBT:
        delete draft.debts.details[action.debt.id]
        break
      case SORT_DEBT:
        draft.debts.repayment.method = action.method
        break
      case UPDATE_REPAYMENT:
        draft.debts.repayment.payment = action.repayment
        break
      default:
        return draft
      }
      draft.debts.total.amount = sumAmount(draft.debts)
      draft.debts.total.minPayment = sumMinPayments(draft.debts)
      draft.debts.total.interestIfOnlyMinPayment = sumInterestIfOnlyMinPayment(draft.debts)

      draft.debts.repayment.snowball = multiAmortization(draft.debts, METHOD_SNOWBALL)
      draft.debts.repayment.highestInterest = multiAmortization(draft.debts, METHOD_HIGHEST_INTEREST)

})

export const getSelectedMethod = (debts) => {
  if (debts.repayment.method === METHOD_HIGHEST_INTEREST) {
    return debts.repayment.highestInterest
  } else if (debts.repayment.method === METHOD_SNOWBALL) {
    return debts.repayment.snowball
  }

  return {installments: []}
}

const sumAmount = (debts) => {
  return debts.details.reduce( function(a, b){
    return a + (parseFloat(b.amount) || 0)
  }, 0)
}

const sumMinPayments = (debts) => {
  return debts.details.reduce( function(a, b){
    return a + (parseFloat(b.minPayment) || 0)
  }, 0)
}

const sumInterestIfOnlyMinPayment = (debts) => {
  return debts.details.reduce( function(a, b){
    return a + (parseFloat(b.ifMinPaymentsMade.totalInterest) || 0)
  }, 0)
}

// Action Creators
export const addDebt = () => ({
  type: ADD_DEBT,
  debt: {
    id: nextDebtId++,
    colour: colours[nextDebtId - 1],
    creditor: '',
    amount: '',
    rate: '',
    minPayment: '',
    ifMinPaymentsMade: {
      totalMonths: 0,
      totalInterest: 0,
      graph: {
        principal: [],
        interest: []
      }
    }
  }
});

export const updateDebt = function(debt) {
  var loan = {}
  var interestOnlyPayment = 0
  var ifMinPaymentsMade = {
    totalMonths: 0,
    totalInterest: 0,
    graph: {
      principal: [],
      interest: []
    }
  }
  //console.log(ifMinPaymentsMade)
  //console.log(debt)
  
  if (debt.amount > 0 && debt.rate > 0) {
    interestOnlyPayment = interestOnly(debt.amount, debt.rate)
  }

  if (debt.amount > 0 && debt.rate > 0 && debt.minPayment > 0) {    
    loan = amortization(debt.amount, debt.rate, debt.minPayment)
    //console.log(loan)
  }

  if (typeof loan.installments !== 'undefined') {
    loan.installments.forEach(function (installment, index) { 
      ifMinPaymentsMade.graph.principal.push({x: index + 1, y: installment.capital})
      ifMinPaymentsMade.graph.interest.push({x: index + 1, y: installment.interest})
      ifMinPaymentsMade.totalMonths = index + 1 > ifMinPaymentsMade.totalMonths ? index + 1 : ifMinPaymentsMade.totalMonths
      ifMinPaymentsMade.totalInterest += installment.interest
    })
  }

  //console.log(ifMinPaymentsMade)
  return {
    type: UPDATE_DEBT,
    debt: { ...debt, ifMinPaymentsMade: ifMinPaymentsMade, interestOnlyPayment: interestOnlyPayment }
  }
};

export const removeDebt = debt => ({
  type: REMOVE_DEBT,
  debt: debt
});

export const sortDebt = method => ({
  type: SORT_DEBT,
  method: method
});


export const updateRepayment = repayment => ({
  type: UPDATE_REPAYMENT,
  repayment: repayment
});
