import React from "react"
import { connect } from "react-redux"
import { Link } from "gatsby"
import CurrencyFormat from 'react-currency-format';

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import DebtForm from "../../components/debt/debtForm"
import DebtGraph from "../../components/debt/debtGraph"
import {isAuthenticated, login} from "../../utils/auth"

const DebtPage = ({debts, dispatch}) => {
  if (!isAuthenticated()) {
    login()
    return <p>Redirecting to login...</p>
  }

  let link = ""
  let minPayment = ''
  if (debts.total.interestIfOnlyMinPayment > 0) {
    link = <Link to="/user/debt-plan" className="btn btn-primary p-3 mt-5">Create a plan to get out of debt!</Link>
    minPayment = <div>
        <h3 className="mt-5">What happens when you only make the minimum payment?</h3>
        <p>
          You'll be paying <b><CurrencyFormat value={debts.total.interestIfOnlyMinPayment} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} /></b> in interest
          over the lifetime of debt!
        </p>
      </div>
  }

  return (
    <Layout>
      <SEO title="Debt Calculator" />
      <h2>We need to know a bit more about your debt</h2>
      <DebtForm></DebtForm>
      
      {minPayment}
      <div className="text-center">
        { link }
      </div>

      {debts.details.map(debt => (
        <DebtGraph debt={debt} key={debt.id} />
      ))}     

    </Layout>
  )
}

export default connect(state => ({ debts: state.debt.debts }))(DebtPage)
