import React, { useState } from 'react';
import { connect } from "react-redux"
import { updateRepayment, sortDebt } from "../../state/debt";
import { METHOD_SNOWBALL, METHOD_HIGHEST_INTEREST } from "../../utils/loan";
import { updateIncome, updateGoals } from "../../state/budget"
import CurrencyFormat from 'react-currency-format';

const DebtPlanForm = ({debts, budget, dispatch}) => {
  const [income, setIncome] = useState(budget.income > 0 ? budget.income : '');
  const [repayment, setRepayment] = useState(debts.repayment.payment > 0 ? debts.repayment.payment : budget.goals.amount > 0 ? budget.goals.amount : '');

  const onRepaymentChange = values => {
    setRepayment(values.floatValue || 0)
  }

  const onRepaymentBlur = event => {
    //console.log(repayment)    
    if (repayment > 0) {
      dispatch(updateRepayment(repayment))

      //console.log(budget)
      dispatch(updateGoals(repayment))
    }
  }

  /*
  const getDefaultPayment = () => {
    return debts.repayment.payment > 0 ? debts.repayment.payment : budget.goals.amount > 0 ? budget.goals.amount : ''
  }
  */

  const onMethodChange = event => {
    dispatch(sortDebt(event.target.value))
  }
  const onIncomeChange = values => {
    setIncome(values.floatValue)
  }

  const onIncomeBlur = event => {
    dispatch(updateIncome(income))
    //console.log(income)
    //console.log(debts.repayment)
    if (debts.repayment.payment === 0 && income > 0) {
      var newRepayment = Math.round(income * budget.goals.percent / 100)
      //console.log(repayment)
      setRepayment(newRepayment)
      dispatch(updateRepayment(newRepayment))
    }
  }

  /*
  useEffect(() => {
    //dispatch(updatePayment(parseFloat(getDefaultPayment()) || 0))
  }, []);
  */

  let minPaymentDisplay = '\u00A0'
  if (debts.total.minPayment > 0) {
    minPaymentDisplay = <small className="form-text text-dark">
          Note that your minimum monthly payments must be at least: 
          <CurrencyFormat value={debts.total.minPayment} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} />
          </small>
  }

  let minPaymentClass = "w-25 form-control"
  if (repayment < debts.total.minPayment) {
    minPaymentClass = "w-25 form-control is-invalid"
    minPaymentDisplay = <small className="form-text text-danger">
          Note that your minimum monthly payments must be at least: 
          <CurrencyFormat value={debts.total.minPayment} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} />
          </small>
  }

  return (<>
    <form className="form-inline">
      <div className="form-row mt-5">
        <div className="card text-dark bg-light w-100 mb-3">
          <div className="card-header">1. Income</div>
          <div className="card-body">
            <div className="card-text">
            First things, tell me how much you earn each month, post-tax: 
              <CurrencyFormat placeholder="Income per Month" value={income}
               displayType={'input'} decimalScale={0} thousandSeparator={true} prefix={'£'} onValueChange={onIncomeChange} onBlur={onIncomeBlur}  />
            </div>
            <div className="card-text mt-3">
              <svg className="bi bi-exclamation-triangle mr-2" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.938 2.016a.146.146 0 00-.054.057L1.027 13.74a.176.176 0 00-.002.183c.016.03.037.05.054.06.015.01.034.017.066.017h13.713a.12.12 0 00.066-.017.163.163 0 00.055-.06.176.176 0 00-.003-.183L8.12 2.073a.146.146 0 00-.054-.057A.13.13 0 008.002 2a.13.13 0 00-.064.016zm1.044-.45a1.13 1.13 0 00-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" clipRule="evenodd"/>
                <path d="M7.002 12a1 1 0 112 0 1 1 0 01-2 0zM7.1 5.995a.905.905 0 111.8 0l-.35 3.507a.552.552 0 01-1.1 0L7.1 5.995z"/>
              </svg>
              Action Point: Now Reflect on your spending and think about how much you could realistically contribute towards your debt, every month
            </div>
          </div>
        </div>

        <div className="card text-dark bg-light w-100 mb-3">
          <div className="card-header">2. Monthly Payment</div>
          <div className="card-body">
            <div className="card-text">
              For the moment, lets say you contribute <span className="badge badge-primary">{ budget.goals.percent }%</span> of your post-tax income towards your debt.
              This will be &nbsp;
              <CurrencyFormat placeholder="Monthly Payment" value={repayment} className={minPaymentClass}
               displayType={'input'} decimalScale={0} thousandSeparator={true} prefix={'£'} onValueChange={onRepaymentChange} onBlur={onRepaymentBlur}  />              
              &nbsp; a month. Don't worry, you can change this figure later on.
              <br />
              { minPaymentDisplay }
            </div>
          </div>
        </div>

        <div className="card text-dark bg-light w-100 mb-3">
          <div className="card-header">3. Repayment method</div>
          <div className="card-body">
            <div className="card-text">
              There are two methods. Carefully read pros and cons.
            </div>

            <div className="card-deck mt-5">
              <div className="card bg-light text-center">
                <div className="card-body">
                  <h5 className="card-title">Snowball</h5>
                  <div className="card-text">              
                    <div className="form-check form-check-inline">
                      <input type="radio" id="method-snowball" className="form-check-input"  name="method" value={ METHOD_SNOWBALL } onChange={onMethodChange} />
                      <label className="form-check-label" htmlFor="method-snowball">Snowball</label>
                    </div>
                    <div className="col-md-12 mt-3">      
                      Total Interest Payable: <CurrencyFormat value={debts.repayment.snowball.total.interest} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} />
                    </div>
                    <div className="col-md-12 mt-3">      
                      Number of Months: {debts.repayment.snowball.total.months}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-light text-center">
                <div className="card-body">
                <h5 className="card-title">Highest Interest</h5>
                  <div className="card-text">              
                    <div className="form-check form-check-inline">
                      <input type="radio" id="method-highest-interest" className="form-check-input" name="method" value={ METHOD_HIGHEST_INTEREST } onChange={onMethodChange} defaultChecked="true" />
                      <label className="form-check-label" htmlFor="method-highest-interest">Highest Interest</label>
                    </div>
                    <div className="col-md-12 mt-3">      
                      Total Interest Payable: <CurrencyFormat value={debts.repayment.highestInterest.total.interest} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} />
                    </div>
                    <div className="col-md-12 mt-3">      
                      Number of Months: {debts.repayment.highestInterest.total.months}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    </>
  )
}

export default connect(state => ({ debts: state.debt.debts, budget: state.budget.budget }))(DebtPlanForm)

