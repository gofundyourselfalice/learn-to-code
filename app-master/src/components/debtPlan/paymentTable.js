import React from "react";
import { connect } from "react-redux"
import {getSelectedMethod} from "../../state/debt"
import CurrencyFormat from 'react-currency-format';

const PaymentTable = ({debts}) => {
    if (typeof getSelectedMethod(debts).installments === 'undefined' || getSelectedMethod(debts).installments.length === 0) {
        return (<></>)
    }

    return (<>
    <h3 className="text-center">Your Payment Schedule</h3>
    <table className="table table-striped">
        <thead>
            <tr>
                <th>Month</th>
                {debts.details.map(detail => (
                    <th key={detail.id}>{detail.creditor}</th>
                ))}
            </tr>
        </thead>
        <tbody>
        {getSelectedMethod(debts).installments.map(installment => (
            <tr key={installment.installmentNumber}>
                <td>{installment.installmentNumber + 1}</td>
                {debts.details.map(debtDetail => {
                    var combined = installment.details.map(installmentDetail => {
                        if (debtDetail.id === installmentDetail.id) {
                            return <td key={installmentDetail.id + ':' + debtDetail.id }>
                                <CurrencyFormat value={installmentDetail.combined} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} />
                                </td>
                        }
                        return null
                    }).filter(function (el) { return el })
                    console.log(combined)
                    return typeof combined[0] !== 'undefined' ? combined : <td key={debtDetail.id }></td>
                })}
            </tr>
        ))}          
        </tbody>
    </table>
  </>
    )   
}
export default connect(state => ({ debts: state.debt.debts }))(PaymentTable)
