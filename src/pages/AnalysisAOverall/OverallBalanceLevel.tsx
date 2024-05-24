import React from 'react';
import BalanceLevel from '../AnalysisFCommon/BalanceLevel';

const OverallBalanceLevel = ( props: any) => 
{
  return (
    <BalanceLevel navigation={props.navigation} navTo={['AnalysisOverall','OverallAccountabilityScore', 'OverallBalanceLevel', 'OverallRewards']} score={67} />
  )
}

export default OverallBalanceLevel