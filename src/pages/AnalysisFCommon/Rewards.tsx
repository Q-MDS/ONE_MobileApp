import React, { useState } from 'react';
import AppMenu from '../../components/AppMenu/AppMenu';
import TabStyleButtonGroup from '../../components/TabStyleButtonGroup/TabStyleButtonGroup';
import MainStyles from '../../assets/MainStyles';
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import backgroundImage from '../../assets/images/app_bg_mountains.png';

type Props = {
    navigation: any;
    navTo: string[];
    score: number;
};

const Rewards = ( props: any ) => 
{
    // Can you use a css card in react native?
    const [tabIndex, setTabindex] = useState(3);
    
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
                    <Image source={require('../../assets/images/rewards.png')}  />
                    <Text style={[MainStyles.h02, MainStyles.textBold]}>{props.score}</Text>
                    <Text style={[MainStyles.h6]}>Your total score combines your balance level and acivities completed.</Text>

                    <View style={[styles.card]}>
                        <CheckBox value={true} />
                        <Text style={[MainStyles.h6, MainStyles.mb_0]}>Total Daily Activitues Completed</Text>
                        <Text style={[MainStyles.h4, MainStyles.textBold, MainStyles.mb_0]}>150</Text>
                    </View>
                </View>
            </View>
            <AppMenu navigation={ props.navigation } activeItem={1} />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    card: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
        backgroundColor: '#fff',
        padding: 20,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
        margin: 10,
    },
    });

export default Rewards