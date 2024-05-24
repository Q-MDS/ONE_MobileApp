import React, { useState } from 'react';
import AppMenu from '../../components/AppMenu/AppMenu';
import TabStyleButtonGroup from '../../components/TabStyleButtonGroup/TabStyleButtonGroup';
import MainStyles from '../../assets/MainStyles';
import ProgressCircle from 'progress-circle-react-native';
import { ImageBackground, View, Text, TouchableOpacity, Button } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_mountains.png';

type Props = {
    navigation: any;
    navTo: string[];
    score: number;
};

const BalanceLevel = ( props: any ) => 
{
    const [tabIndex, setTabindex] = useState(2);

    const handleLearnMore = () => 
    {
        props.navigation.navigate('BalanceLevelMore')
    }

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
                    <ProgressCircle
                        percent={props.score}
                        radius={100}
                        borderWidth={20}
                        color="#4A4A4A"
                        shadowColor="#eceff3"
                        bgColor="#f6fafd"
                    >
                        <Text style={[MainStyles.h1, MainStyles.mb_0]}>{`${props.score} %`}</Text>
                    </ProgressCircle>
                    <Text style={[MainStyles.h2, MainStyles.mt_3]}>Balance Level</Text>
                    <Text style={[MainStyles.h5]}>Your balance level is {`${props.score} %`}</Text>
                    <Text style={[MainStyles.h6]}>Want to know more about what your balance level means</Text>
                    <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, MainStyles.w_100]} onPress={handleLearnMore}>
                        <Text style={[MainStyles.buttonText]}>Learn more about balance level</Text>
                    </TouchableOpacity>
                </View>
            </View>
        <AppMenu navigation={ props.navigation } activeItem={1} />
        </ImageBackground>
    )
}

export default BalanceLevel