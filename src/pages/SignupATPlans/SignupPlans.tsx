import React from 'react';
import Datapool from '../../services/Datapool';
import MainStyles from '../../assets/MainStyles';
import BackButton from '../../components/BackButton/BackButton';
import { ImageBackground, View, Text, TouchableOpacity, Image } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';

const dp = Datapool.getInstance();

const SignupPlans = ( props: any ) => 
{
    const handleFree = () => 
    {
        dp.set('signupPlanType', "0");
        props.navigation.navigate('SignupOptionFree')    
    }

    const handleCoaching = () => 
    {
        dp.set('signupPlanType', "1");
        props.navigation.navigate('SignupOptionCoaching')
    }

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={[MainStyles.container, { paddingTop: 10 }]}>
                <BackButton/>
                <Text style={MainStyles.h1}>Service Options</Text>
                <Text style={[ MainStyles.h6]}>Tap on option find out more</Text>
                <TouchableOpacity style={[MainStyles.w_100, MainStyles.mb_4]} onPress={handleFree} >
                    <View style={[MainStyles.card, MainStyles.w_100, {minHeight: 150, justifyContent: 'center', alignItems: 'center'}]} >
                        <Image source={require('../../assets/images/icon_plan.png')} style={{ width: 40, height: 40 }}  />
                        <Text style={[MainStyles.h2, MainStyles.textSerif, MainStyles.textCenter, MainStyles.w_100, MainStyles.mt_3, MainStyles.mb_0]}>Free Plan</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[MainStyles.w_100]} onPress={handleCoaching} >
                    <View style={[MainStyles.card, MainStyles.w_100, {minHeight: 150, justifyContent: 'center', alignItems: 'center'}]}>
                    <Image source={require('../../assets/images/icon_plan.png')}  style={{ width: 40, height: 40 }} />
                    <Text style={[MainStyles.h2, MainStyles.textSerif, MainStyles.textCenter, MainStyles.w_100, MainStyles.mt_3, MainStyles.mb_0]}>Coaching Plan</Text>
                        <Text style={[MainStyles.h6, MainStyles.textSubtle, MainStyles.w_100]}>Start 21 Day Free Trial</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default SignupPlans;