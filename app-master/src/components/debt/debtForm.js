import React from "react";
import DebtDetails from "./debtDetails"
import { connect } from "react-redux"
import { addDebt } from "../../state/debt"
import CurrencyFormat from 'react-currency-format';

const DebtForm = ({debts, dispatch}) => {

    //const [inputList, setInputList] = useState([<DebtDetails key="0" />]);
  
    const onAddBtnClick = event => {
        event.preventDefault();
        dispatch(addDebt())

        //setInputList(inputList.concat(<DebtDetails key={inputList.length} />))
    };
  
    return (
        <form className="mt-5">
          <div className="card text-dark bg-light w-100 mt-5">
              <div className="card-header text-center">Your Debts</div>
              <div className="card-body">
                  {debts.details.map(debt => (
                    <DebtDetails debt={debt} key={debt.id} />
                  ))}          
                  <div className="form-row mt-5 pt-4 pb-2 pr-1 pl-3 ">
                    <div className="col-md-3 mb-2">
                      <b>Total</b>
                    </div>
                    <div className="col-md-3 mb-2">
                      <b><CurrencyFormat value={debts.total.amount} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} /></b> 
                      <small className="form-text text-muted">
                        (Amount)
                      </small>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-2 mb-2">
                      <b><CurrencyFormat value={debts.total.minPayment} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} /></b>
                      <small className="form-text text-muted">
                        (Min Payment)
                      </small>
                    </div>
                    <div className="col-md-2">
                      <button className="btn btn-primary" onClick={onAddBtnClick}>+ Add another debt</button>
                    </div>
                  </div>
              </div>
          </div>
            
        </form>
    )
}

export default connect(state => ({ debts: state.debt.debts }))(DebtForm)

