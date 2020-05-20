// Ducks https://github.com/erikras/ducks-modular-redux
import produce from 'immer'

export const colours = [
  '#00a8ff',
  '#9c88ff',
  '#fbc531',
  '#4cd137',
  '#487eb0',
];

// Initial
const initialState = {
    budget: {
      income: 0,
      needs: {
        amount: '',
        percent: 50
      },
      wants: {
        amount: '',
        percent: 30
      },
      goals: {
        amount: '',
        percent: 20
      },
      total: {
        amount: 0,
        percent: 100
      }
    }
  };

// Actions
const UPDATE_INCOME = 'UPDATE_INCOME';
const UPDATE_NEEDS = 'UPDATE_NEEDS';
const UPDATE_WANTS = 'UPDATE_WANTS';
const UPDATE_GOALS = 'UPDATE_GOALS';

// Reducer
//export default function reducer(state = initialState, action = {}) {
export default (state = initialState, action) => 
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_INCOME:
        draft.budget.income = action.income
        draft.budget.needs.amount = draft.budget.income * draft.budget.needs.percent / 100
        draft.budget.wants.amount = draft.budget.income * draft.budget.wants.percent / 100
        draft.budget.goals.amount = draft.budget.income * draft.budget.goals.percent / 100
        break

      case UPDATE_NEEDS:
        draft.budget.needs.amount = action.amount
        draft.budget.needs.percent = Math.round(100 * draft.budget.needs.amount / draft.budget.income)
        break

      case UPDATE_WANTS:
        draft.budget.wants.amount = action.amount
        draft.budget.wants.percent = Math.round(100 * draft.budget.wants.amount / draft.budget.income)
        break

      case UPDATE_GOALS:
        draft.budget.goals.amount = action.amount
        draft.budget.goals.percent = Math.round(100 * draft.budget.goals.amount / draft.budget.income)
        break

      default:
        return draft
      }

      draft.budget.total.amount = draft.budget.needs.amount + draft.budget.wants.amount + draft.budget.goals.amount
      draft.budget.total.percent = Math.round(100 * draft.budget.total.amount / draft.budget.income)
})


export const updateIncome = function(income) {
  return {
    type: UPDATE_INCOME,
    income: income
  }
};

export const updateNeeds = function(amount) {
  return {
    type: UPDATE_NEEDS,
    amount: amount
  }
};

export const updateWants = function(amount) {
  return {
    type: UPDATE_WANTS,
    amount: amount
  }
};

export const updateGoals = function(amount) {
  return {
    type: UPDATE_GOALS,
    amount: amount
  }
};
