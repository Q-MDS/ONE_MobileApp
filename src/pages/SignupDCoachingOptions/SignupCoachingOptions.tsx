import React, { useState } from 'react';
import Datapool from '../../services/Datapool';
import { ImageBackground, View, Text, Button, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';
import MainStyles from '../../assets/MainStyles';

const dp = Datapool.getInstance();

const SignupCoachingOptions = ( props: any) => 
{
    // const [subscriptionType, setSubscriptionType] = useState(0);

    const handleMonthly = () => 
    {
        dp.set('signupSubscriptionType', 0);
        props.navigation.navigate('SignupCoachingPayment')
    };
    
    const handleYearly = () => 
    {
        dp.set('signupSubscriptionType', 1);
        props.navigation.navigate('SignupCoachingPayment')
    };

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={MainStyles.container}>
                <Text style={[ MainStyles.h5, MainStyles.textSubtle, MainStyles.textUppercase]}>Pricing</Text>
                <Text style={MainStyles.h1}>Coaching Options</Text>
                <Text style={[ MainStyles.h6, MainStyles.textCenter]}>Upgrade to our Coaching version for personalized activity recommendations, motivational quotes, pop-quizzes and progress analysis for a balanced life.</Text>
                <TouchableOpacity onPress={handleMonthly} style={{ width: '100%' }}>
                    <View style={[MainStyles.card, {minHeight: 120, justifyContent: 'center'}]}>
                        <View style={ [MainStyles.formGroupRow]}>
                            <Text style={[ MainStyles.h4, MainStyles.textBold, MainStyles.mb_0]}>Monthly</Text>
                            <View style={[MainStyles.formGroupRowEnd, MainStyles.textRight]}>
                                <Text style={[ MainStyles.h4, MainStyles.textBold, MainStyles.mb_0]}>$15</Text>
                                <Text> / month</Text>
                            </View>
                        </View>
                        <Text style={[ MainStyles.h7, MainStyles.textLeft, MainStyles.mb_0]}>Choose monthly billing for </Text>
                        <Text style={[ MainStyles.h7, MainStyles.textLeft, MainStyles.mb_0]}>flexibility and convienience</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '100%' }} onPress={handleYearly}>
                    <View style={[MainStyles.card, MainStyles.cardAltBorder, MainStyles.mt_4, {minHeight: 120, justifyContent: 'center'}]}>
                        <View style={ [MainStyles.formGroupRow]}>
                            <Text style={[ MainStyles.h4, MainStyles.textBold, MainStyles.mb_0]}>Yearly</Text>
                            <View style={[MainStyles.formGroupRowEnd, MainStyles.textRight]}>
                                <Text style={[ MainStyles.h4, MainStyles.textBold, MainStyles.mb_0]}>$126</Text>
                                <Text> / year</Text>
                            </View>
                        </View>
                        <Text style={[ MainStyles.h7, MainStyles.textLeft, MainStyles.textSubtle, MainStyles.mb_0]}>That's only $10.50 a month.</Text>
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={handleGetStarted}>
                    <Text style={[MainStyles.buttonText]}>Get Started</Text>
                </TouchableOpacity> */}
            </View>
        </ImageBackground>
    );
};

export default SignupCoachingOptions;