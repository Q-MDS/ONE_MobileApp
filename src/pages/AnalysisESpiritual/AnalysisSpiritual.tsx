import React, { useState, useRef } from 'react';
import ProgressCircle from 'progress-circle-react-native';
import * as Progress from 'react-native-progress';
import { ImageBackground, ScrollView, View, Text, PanResponder } from 'react-native';
import { PageIndicator } from 'react-native-page-indicator';
import TabStyleButtonGroup from '../../components/TabStyleButtonGroup/TabStyleButtonGroup';
import AppMenu from '../../components/AppMenu/AppMenu';
import MainStyles from '../../assets/MainStyles';
import backgroundImage from '../../assets/images/app_bg_mountains.png';

const AnalysisSpiritual = ( props: any) => 
{
    const [tabIndex, setTabindex] = useState(0);

    // PanResponder
    const [isScrollEnabled, setIsScrollEnabled] = useState(true);

    const panResponder = useRef(
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponder: (_, gestureState) => 
          {
            // Determine if horizontal swipe, disable scroll if so
            const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
            setIsScrollEnabled(!isHorizontalSwipe);
            return isHorizontalSwipe;
          },
          onPanResponderMove: (_, gestureState) => 
          {
            if (gestureState.dx > 0 && gestureState.dx > 50)
            {
                props.navigation.navigate('AnalysisMental')
            }
          },
          onPanResponderRelease: () => 
          {
            setIsScrollEnabled(true); // Re-enable scroll on release
          },
        })
      ).current;

    return (    
        <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1, }}>
            <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
                <ScrollView 
                {...panResponder.panHandlers}
                scrollEnabled={isScrollEnabled}
                >
                <View style={MainStyles.container}>
                <Text style={[ MainStyles.h2, MainStyles.textSerif, MainStyles.textLeft, MainStyles.w_100]}>Analysis</Text>
                
                    <TabStyleButtonGroup
                        tabs={['Activity Time', 'Accountability Score', 'Balance Level', 'Rewards']}
                        activeIndex={tabIndex}
                        toggleIndex={setTabindex} 
                        navigation={ props.navigation }
                        navTo={['AnalysisOverall','AccountabilityScore', 'BalanceLevel', 'Rewards']}
                        />
                        <Text style={[MainStyles.h6, MainStyles.bt, MainStyles.mt_3, MainStyles.textRight, MainStyles.w_100, {paddingTop: 8}]}>18-24 August</Text>
                        <ProgressCircle
                            percent={94}
                            radius={100}
                            borderWidth={20}
                            color="#4A4A4A"
                            shadowColor="#eceff3"
                            bgColor="#f6fafd"
                        >
                            <Text style={[MainStyles.h1, MainStyles.mb_0]}>{'94%'}</Text>
                        </ProgressCircle>

                        <Text style={[MainStyles.h2, MainStyles.textBold, MainStyles.mt_3, MainStyles.mb_2]}>Spiritual</Text>
                        <Text style={[MainStyles.h6, MainStyles.mb_5]}>You completed 94% of your Spiritual activities.</Text>
                        <Text style={[MainStyles.h6, MainStyles.textBold, MainStyles.w_100, MainStyles.textLeft, MainStyles.mb_2]}>Hours Completed</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', columnGap: 10 }}>
                            <View style={{flex:1}}>
                            <Progress.Bar progress={(4.15/5)} width={null}  color={'#4A4A4A'} height={20} unfilledColor={'#c9cbd1'} borderRadius={10} />
                            </View>
                            <View>
                            <Text style={[MainStyles.h6, MainStyles.mb_0]}>4.15/5</Text>
                            </View>
                        </View>
                        <Text style={[MainStyles.h6, MainStyles.textBold, MainStyles.w_100, MainStyles.textLeft, MainStyles.mb_2, MainStyles.mt_3]}>Activities Completed</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', columnGap: 10 }}>
                            <View style={{flex:1}}>
                            <Progress.Bar progress={(6/8)} width={null}  color={'#4A4A4A'} height={20} unfilledColor={'#c9cbd1'} borderRadius={10} />
                            </View>
                            <View>
                            <Text style={[MainStyles.h6, MainStyles.mb_0]}>6/8</Text>
                            </View>
                        </View>
                        <PageIndicator
                        style={[MainStyles.pageIndicator, MainStyles.mt_3]}
                        count={5}
                        current={4}/>
                    </View>
                </ScrollView>
                <AppMenu navigation={ props.navigation } activeItem={1} />
                </ImageBackground>
        </View>
  )
}

export default AnalysisSpiritual