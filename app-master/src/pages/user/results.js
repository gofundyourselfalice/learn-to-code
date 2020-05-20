import React from "react"
import { connect } from "react-redux"

import Layout from "../../components/layout"
import '../../../node_modules/react-vis/dist/style.css';
import ResultsOverview from "../../components/results/resultsOverview"
import BudgetGraph from "../../components/results/budgetGraph"
import PaymentTable from "../../components/debtPlan/paymentTable"
import {isAuthenticated, login} from "../../utils/auth"

const ResultsPage = ({debts, budget, dispatch}) => {
  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }
  
  return (
  <Layout>
    <h2>Go Fund Yourself Results</h2>
    <div className="card text-dark bg-light w-100 mt-5 mb-5">
        <div className="card-header text-center">Your Debt & Budget Plan</div>
        <div className="card-body">
          <div className="card-text">
            ...
          </div>
          <div className="card-deck mt-5">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Your Overview</h5>
                <ResultsOverview></ResultsOverview>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Your Budget</h5>
                <div className="pb-5 overflow-auto">
                  <BudgetGraph></BudgetGraph>
                </div>
              </div>
            </div>
          </div>
          <div className="card-text mt-5">
            <div className="card">
              <div className="card-body overflow-auto">
              <PaymentTable></PaymentTable>
              </div>
            </div>
          </div>
        </div>
    </div>

  </Layout>
  )
}

export default connect(state => ({ debts: state.debt.debts, budget: state.budget.budget }))(ResultsPage)
