import React from 'react'
import AccountabilityScore from '../AnalysisFCommon/AccountabilityScore'

const OverallAccountabilityScore = ( props: any ) => 
{
  return (
    <AccountabilityScore navigation={props.navigation} navTo={['AnalysisOverall','OverallAccountabilityScore', 'OverallBalanceLevel', 'OverallRewards']} score={99} />
  )
}

export default OverallAccountabilityScore