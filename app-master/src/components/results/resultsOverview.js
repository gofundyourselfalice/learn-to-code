import React from "react";
import { connect } from "react-redux"
import CurrencyFormat from 'react-currency-format';
import {getSelectedMethod} from "../../state/debt"

const ResultsOverview = ({debts, budget, dispatch}) => {

    return (<>
      <p className="card-text">
        Monthly Income: <CurrencyFormat value={budget.income} displayType={'text'} decimalScale={0} thousandSeparator={true} prefix={'£'} />
      </p>
      <p className="card-text">
        Total Debts: <CurrencyFormat value={debts.total.amount} displayType={'text'} decimalScale={0} thousandSeparator={true} prefix={'£'} /> 
      </p>
      <p className="card-text">
        Repayment method: {debts.repayment.method}
      </p>
      <p className="card-text">
        Monthly payment towards debt: <CurrencyFormat value={debts.repayment.payment} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} />
      </p>
      <p className="card-text">
        Total Interest Payable: <CurrencyFormat value={getSelectedMethod(debts).total.interest} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} />
        </p>
      <p className="card-text">
        Number of Months to be debt free: {getSelectedMethod(debts).total.months}
      </p>
  </>
    )   
}

export default connect(state => ({ debts: state.debt.debts, budget: state.budget.budget }))(ResultsOverview)
