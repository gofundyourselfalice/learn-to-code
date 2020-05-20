import React from "react"

import Layout from "../../components/layout"
import { Link } from "gatsby"
import BudgetForm from "../../components/budget/budgetForm"
import {isAuthenticated, login} from "../../utils/auth"

const BudgetPage = () => {
  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }

  return (
  <Layout>
    <h2>Your budget</h2>
    <BudgetForm></BudgetForm>
    <div className="text-center mt-5 mb-5">
      <Link to="/user/results" className="btn btn-primary">Calculate your way out of debt</Link>
    </div>
  </Layout>
  )
}
export default BudgetPage
