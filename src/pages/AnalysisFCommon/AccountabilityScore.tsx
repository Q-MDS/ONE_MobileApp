import React, { useState } from 'react';
import AppMenu from '../../components/AppMenu/AppMenu';
import TabStyleButtonGroup from '../../components/TabStyleButtonGroup/TabStyleButtonGroup';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, View, Text } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_mountains.png';

type Props = {
    navigation: any;
    navTo: string[];
    score: number;
};

const AccountabilityScore = ( props: any ) => 
{
    const [tabIndex, setTabindex] = useState(1);
    
    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={{ flexDirection: 'column', flex: 1, padding: 24, marginBottom: 20 }}>
                <Text style={[ MainStyles.h2, MainStyles.textSerif, MainStyles.textLeft, MainStyles.w_100]}>Analysis</Text>
                <TabStyleButtonGroup
                        tabs={['Activity Time', 'Acc. Score', 'Balance Lvl', 'Rewards']}
                        activeIndex={tabIndex}
                        toggleIndex={setTabindex} 
                        navigation={ props.navigation }
                        navTo={props.navTo}
                        />
                <View style={[MainStyles.bt, MainStyles.mt_3]}></View>
                <View style={[MainStyles.container]}>
                    <Text style={[MainStyles.h04, MainStyles.textBold]}>{props.score}</Text>
                    <Text style={MainStyles.h2}>Weekly Score</Text>
                    <Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.mb_2]}>Congratulations!</Text>
                    <Text style={[MainStyles.h5]}>Keep up the good work!</Text>
                </View>
            </View>
        <AppMenu navigation={ props.navigation } activeItem={1} />
        </ImageBackground>
    )
}

export default AccountabilityScore