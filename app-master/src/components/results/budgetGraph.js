import React from "react";
import { connect } from "react-redux"
import {RadialChart, DiscreteColorLegend} from 'react-vis';
import {colours} from "../../state/budget"

const BudgetGraph = ({budget, dispatch}) => {

    return (<RadialChart
      colorType="literal"
      data={[
        {angle: budget.needs.percent, label: 'Needs: ' + budget.needs.percent + '%', color: colours[0]}, 
        {angle: budget.wants.percent, label: 'Wants: ' + budget.wants.percent + '%', color: colours[1]}, 
        {angle: budget.goals.percent, label: 'Goals: ' + budget.goals.percent + '%', color: colours[2]}
      ]}
      width={320}
      height={400} 
      showLabels={true}
      radius={65}
      innerRadius={30}
      labelsRadiusMultiplier={2.4}
      >
        <DiscreteColorLegend orientation="horizontal" height={50} items={[
          {title:'Needs', color: colours[0]},
          {title:'Wants', color: colours[1]},
          {title:'Goals', color: colours[2]}
        ]} />
      </RadialChart>
    
    )   
}

export default connect(state => ({ budget: state.budget.budget }))(BudgetGraph)
