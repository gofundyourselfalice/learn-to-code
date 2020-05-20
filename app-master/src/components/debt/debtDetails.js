import React, {useState} from "react";
import { connect } from "react-redux"
import { updateDebt, removeDebt } from "../../state/debt"
import CurrencyFormat from 'react-currency-format';

const DebtDetails = ({debt, dispatch}) => {
    const [amount, setAmount] = useState(debt.amount);
    const [minPayment, setMinPayment] = useState(debt.minPayment);

    const onCreditorChange = event => {
        dispatch(updateDebt({...debt, creditor: event.target.value }))
    }

    const onAmountChange = values => {
        setAmount(values.floatValue || 0)
    }

    const onAmountBlur = event => {
        dispatch(updateDebt({...debt, amount: amount }))
    }
    
    const onMinPaymentChange = values => {
        setMinPayment(values.floatValue || 0)
    }

    const onMinPaymentBlur = event => {
        dispatch(updateDebt({...debt, minPayment: minPayment }))
    }

    const onRateChange = event => {
        dispatch(updateDebt({...debt, rate: (parseFloat(event.target.value)  || 0) }))
    }

    const onRemoveButtonClick = event => {
        event.preventDefault();
        dispatch(removeDebt(debt))
    }

    let interestDisplay = '\u00A0'
    if (debt.amount > 0 && debt.rate > 0) {
        interestDisplay = <small className="form-text text-light">
            (Interest Only Payment: 
            <CurrencyFormat value={debt.interestOnlyPayment} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} />)
            </small>
    }

    let minMonthlyPaymentClass = "form-control"
    if (debt.amount > 0 && debt.rate > 0 && debt.minPayment.amount < debt.interestOnlyPayment) {
        minMonthlyPaymentClass = "form-control is-invalid"
    }

    return (<div className="form-row mt-3 pt-4 pb-2 pr-1 pl-3 rounded" style={{backgroundColor: debt.colour}}>
        <div className="col-md-3 mb-2">
            <input type="text" className="form-control" placeholder="Creditor" defaultValue={debt.creditor} onBlur={onCreditorChange}></input>
        </div>
        <div className="col-md-3 mb-2">
            <CurrencyFormat placeholder="Balance" value={amount} className="form-control"
                displayType={'input'} decimalScale={0} thousandSeparator={true} prefix={'£'} onValueChange={onAmountChange} onBlur={onAmountBlur}  />
        </div>
        <div className="col-md-2 mb-2">
            <input type="text" className="form-control" placeholder="Interest Rate (APR)"  defaultValue={debt.rate} onBlur={onRateChange}></input>
        </div>
        <div className="col-md-3 mb-2">
            <CurrencyFormat placeholder="Min Monthly Payment" value={minPayment} className={minMonthlyPaymentClass}
                displayType={'input'} decimalScale={0} thousandSeparator={true} prefix={'£'} onValueChange={onMinPaymentChange} onBlur={onMinPaymentBlur}  />
            {interestDisplay}
        </div>
        <div className="col-md-1 mb-2">
            <button className="btn btn-danger" onClick={onRemoveButtonClick}>-</button>
        </div>
    </div>
    )   
}

export default connect()(DebtDetails)
