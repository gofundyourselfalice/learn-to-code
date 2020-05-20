import React from "react";
import '../../../node_modules/react-vis/dist/style.css';
import {VerticalBarSeries, XYPlot, XAxis, YAxis} from 'react-vis';
import {getSelectedMethod} from '../../state/debt'

const TotalDebtGraph = ({debts}) => {
    if (getSelectedMethod(debts).installments.length === 0) {
        return (<></>)
    }

    return (<div className="overflow-auto">
        <h3>Total Debts</h3>
        <XYPlot height={300} width={getSelectedMethod(debts).installments.length * 50} xType="ordinal" stackBy="y"margin={{left: 80, bottom: 60, top: 10}}>
            <XAxis title={"Month"} orientation={"bottom"} height={50} top={270} position={"middle"} />
            <YAxis title={"Principal"} orientation={"left"} left={0} width={50} position={"middle"} />

            {getSelectedMethod(debts).installmentsByCreditor.map(creditorInstallment => (
                <VerticalBarSeries key={creditorInstallment.id} data={creditorInstallment.data} color={creditorInstallment.colour} />
            ))}          
        </XYPlot>
    </div>
    )   
}

export default TotalDebtGraph
