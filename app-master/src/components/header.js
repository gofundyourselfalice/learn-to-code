import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { isAuthenticated } from "../utils/auth"
import logo from "../images/logo.webp"

const Header = function({ siteTitle }) {
  const debtProps = ({location}) => {
    if (location.pathname === '/user/debt') {
      return {className: "btn btn-link p-0 text-primary"}
    } else if (location.pathname === '/user/debt-plan' || location.pathname === '/user/budget' || location.pathname === '/user/results') {
      return {className: "btn btn-link p-0"}
    }
  }

  const debtPlanProps = ({location}) => {
    if (location.pathname === '/user/debt-plan') {
      return {className: "btn btn-link p-0 text-primary"}
    } else if (location.pathname === '/user/budget' || location.pathname === '/user/results') {
      return {className: "btn btn-link p-0"}
    }
  }

  const budgetProps = ({location}) => {
    if (location.pathname === '/user/budget') {
      return {className: "btn btn-link p-0 text-primary"}
    } else if (location.pathname === '/user/results') {
      return {className: "btn btn-link p-0"}
    }
  }

  const resultsProps = ({location}) => {
    if (location.pathname === '/user/results') {
      return {className: "btn btn-link p-0 text-primary"}
    } else if (location.pathname === '/user/debt' || location.pathname === '/user/debt-plan' || location.pathname === '/user/budget' ) {
      return {className: "btn btn-link p-0 disabled"}
    }
  }

  const LoginLogout = () => {
    if (isAuthenticated()) {
      return (<Link to="/logout" className="ml-auto text-dark">Logout</Link>)
    } else {
      return (<Link to="/login" className="ml-auto text-dark">Login</Link>)
    }
  }

  return (
  <header>
    <nav className="navbar navbar-expand-lg navbar-light text-light bg-info justify-content-between">    
      <Link to="/" className="nav-brand text-light">
        <img alt={siteTitle} style={{height: "50px"}} src={logo} />  
      </Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarText">
        {LoginLogout()}
      </div>
    </nav>

    <nav className="bg-light container" aria-label="breadcrumb">
        <ol className="breadcrumb bg-light">
          <li className="breadcrumb-item"><Link to="/user/debt" getProps={debtProps} className="btn btn-link p-0 disabled">Debt</Link></li>
          <li className="breadcrumb-item"><Link to="/user/debt-plan" getProps={debtPlanProps} className="btn btn-link p-0 disabled">Debt Plan</Link></li>
          <li className="breadcrumb-item"><Link to="/user/budget" getProps={budgetProps} className="btn btn-link p-0 disabled">Budget</Link></li>
          <li className="breadcrumb-item disabled"><Link to="/user/results" getProps={resultsProps} className="btn btn-link p-0 disabled">Results</Link></li>
        </ol>
    </nav>
  </header>
)}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
