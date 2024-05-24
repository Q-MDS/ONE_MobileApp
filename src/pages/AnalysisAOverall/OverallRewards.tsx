import React from 'react';
import Rewards from '../AnalysisFCommon/Rewards';

const OverallRewards = ( props: any) => 
{
  return (
    <Rewards navigation={props.navigation} navTo={['AnalysisOverall','OverallAccountabilityScore', 'OverallBalanceLevel', 'OverallRewards']} score={105}  />
  )
}

export default OverallRewards