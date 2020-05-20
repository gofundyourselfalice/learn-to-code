import React from "react"
import { connect } from "react-redux"

import Layout from "../../components/layout"
import PaymentTable from "../../components/debtPlan/paymentTable"
import TotalDebtGraph from "../../components/debtPlan/totalDebtGraph"
import DebtPlanForm from "../../components/debtPlan/debtPlanForm"
import { Link } from "gatsby"
import {isAuthenticated, login} from "../../utils/auth"

const CalculatorPage = ({debts, budget, dispatch}) => {
  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }

  return (
  <Layout>
    <h2>See how increasing your monthly payments can reduce your debt!</h2>
    <DebtPlanForm></DebtPlanForm>

    <div className="text-center mt-5 mb-5">
      <Link to="/user/budget" className="btn btn-primary">On to your budget</Link>
    </div>
    <PaymentTable></PaymentTable>
    <TotalDebtGraph debts={debts} />

  </Layout>
  )
}


export default connect(state => ({ debts: state.debt.debts, budget: state.budget.budget }))(CalculatorPage)
