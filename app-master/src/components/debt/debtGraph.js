import React from "react";
import '../../../node_modules/react-vis/dist/style.css';
import {VerticalBarSeries, XYPlot, XAxis, YAxis} from 'react-vis';
import CurrencyFormat from 'react-currency-format';

const DebtGraph = ({debt}) => {
    let graph = <div style={{height: "300px"}}></div>;
    let months = 0;
    let header = ''
    if (debt.ifMinPaymentsMade.totalMonths > 0) {
        graph = <XYPlot height={300} width={debt.ifMinPaymentsMade.totalMonths * 50} xType="ordinal" title={debt.creditor} stackBy="y" margin={{left: 80, bottom: 60, top: 10}}>
            <VerticalBarSeries data={debt.ifMinPaymentsMade.graph.principal } color={debt.colour} />
            <VerticalBarSeries data={debt.ifMinPaymentsMade.graph.interest } color="red" />
            <XAxis title={"Month"} orientation={"bottom"} height={50} top={270} position={"middle"} />
            <YAxis title={"Min Payment (£)"} orientation={"left"} left={0} width={50} position={"middle"} />
        </XYPlot>
        months = debt.ifMinPaymentsMade.totalMonths

        header = <>
            <h4>Minimum Payment for { debt.creditor }</h4>
            <p> 
                <span className="badge" style={{backgroundColor: debt.colour}}>
                    <CurrencyFormat value={debt.amount} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} /> (principal) 
                </span>
                &nbsp;+&nbsp;
                <span className="badge" style={{backgroundColor: "red"}}>
                    <CurrencyFormat value={debt.ifMinPaymentsMade.totalInterest} displayType={'text'} decimalScale={2} thousandSeparator={true} prefix={'£'} /> (interest) 
                </span>
                &nbsp;
                over <span className="badge bg-primary">{months}</span> months
            </p>
        </>
    }

    return (<div className="mt-5 overflow-auto">
        {header}
        {graph}
    </div>
    )   
}

export default DebtGraph
