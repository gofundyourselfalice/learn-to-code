import React, {useState} from "react";
import { connect } from "react-redux"
import { updateNeeds, updateWants, updateGoals } from "../../state/budget"
import CurrencyFormat from 'react-currency-format';
import {colours} from "../../state/budget"

const BudgetForm = ({budget, dispatch}) => {
  const [needs, setNeeds] = useState(budget.needs.amount);
  const [wants, setWants] = useState(budget.wants.amount);
  const [goals, setGoals] = useState(budget.goals.amount);

  const onNeedsChange = values => {
    setNeeds(values.floatValue || 0)
  }

  const onNeedsBlur = event => {
    dispatch(updateNeeds(needs))
  }

  const onWantsChange = values => {
    setWants(values.floatValue || 0)
  }

  const onWantsBlur = event => {
    dispatch(updateWants(wants))
  }

  const onGoalsChange = values => {
    setGoals(values.floatValue || 0)
  }

  const onGoalsBlur = event => {
    dispatch(updateGoals(goals))
  }

  let budgetClass = "form-control"
  let needsPaymentDisplay = ""
  let wantsPaymentDisplay = ""
  let goalsPaymentDisplay = ""
  if (budget.total.amount !== budget.income ) {
    budgetClass = "form-control is-invalid"
    needsPaymentDisplay = <small className="form-text text-danger">
      (Your total income is &nbsp;
      <CurrencyFormat value={budget.income} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} />.
      To reach a consistent amount, you need to adjust your needs to <CurrencyFormat value={budget.income - budget.wants.amount - budget.goals.amount} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} />
      )
      </small>
    wantsPaymentDisplay = <small className="form-text text-danger">
      (Your total income is &nbsp;
      <CurrencyFormat value={budget.income} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} />.
      To reach a consistent amount, you need to adjust your wants to <CurrencyFormat value={budget.income - budget.needs.amount - budget.goals.amount} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} />
      )
    </small>
    goalsPaymentDisplay = <small className="form-text text-danger">
      (Your total income is &nbsp;
      <CurrencyFormat value={budget.income} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} />.
      To reach a consistent amount, you need to adjust your goals to <CurrencyFormat value={budget.income - budget.needs.amount - budget.wants.amount} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} />
      )
      </small>

  }

  return (<>
    <form>
      <div className="card text-dark bg-light w-100 mt-5">
          <div className="card-header text-center">Budgeting</div>
          <div className="card-body">
            <div className="card-text">
              50:30:20 Method
            </div>

            <div className="card-deck bg-light text-dark p-5">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title" style={{color:colours[0]}}>Needs</h5>
                  <div className="card-text">Examples: <ul><li>Housing</li></ul></div>
                  <p className="card-text">
                    <CurrencyFormat className={budgetClass} value={needs} displayType={'input'} decimalScale={0} thousandSeparator={true} prefix={'£'} onValueChange={onNeedsChange} onBlur={onNeedsBlur}  />
                    {needsPaymentDisplay}
                  </p>
                  <p className="card-text text-center">
                    <span className="badge badge-primary">{budget.needs.percent}%</span>
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title" style={{color:colours[1]}}>Wants</h5>
                  <div className="card-text">Examples: <ul><li>Eating out</li></ul></div>
                  <p className="card-text">
                    <CurrencyFormat className={budgetClass} value={wants} displayType={'input'} decimalScale={0} thousandSeparator={true} prefix={'£'} onValueChange={onWantsChange} onBlur={onWantsBlur} />
                    {wantsPaymentDisplay}
                  </p>
                  <p className="card-text text-center">
                    <span className="badge badge-primary">{budget.wants.percent}%</span>
                  </p>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title" style={{color:colours[2]}}>Goals</h5>
                  <div className="card-text">Examples: <ul><li>Building up savings</li></ul></div>
                  <p className="card-text">
                    <CurrencyFormat className={budgetClass} value={goals} displayType={'input'} decimalScale={0} thousandSeparator={true} prefix={'£'} onValueChange={onGoalsChange} onBlur={onGoalsBlur}  />
                    {goalsPaymentDisplay}
                  </p>
                  <p className="card-text text-center">
                    <span className="badge badge-primary">{budget.goals.percent}%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </form>
    </>
  )
}

export default connect(state => ({ budget: state.budget.budget }))(BudgetForm)

