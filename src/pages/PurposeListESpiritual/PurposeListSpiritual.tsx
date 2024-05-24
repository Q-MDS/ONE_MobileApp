import React from 'react';
import DbProfile from '../../services/DbProfile';
import { PageIndicator } from 'react-native-page-indicator';
import settings from '../../../settings';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';

const PurposeListSpiritual = ( props: any ) => 
{
    // Manage screen left/right swipe and tap
    const [isSwiping, setIsSwiping] = React.useState(false);
    const [initialGestureX, setInitialGestureX] = React.useState(0);
    const [finalGestureX, setFinalGestureX] = React.useState(0);
    const swipeThreshold = settings.swipeThreshold; 

    const handleStart = (event: any) => 
    {
        setIsSwiping(false);
        setInitialGestureX(event.nativeEvent.pageX);
    };

    const handleMove = (event: any) => 
    {
        setIsSwiping(true);
        const currentGestureX = event.nativeEvent.pageX;
        setFinalGestureX(currentGestureX);
    };

    const handleRelease = (event: any) => 
    {
        if ((finalGestureX - initialGestureX) > swipeThreshold) 
        {
            props.navigation.navigate('PurposeListMental');
        } 
    };

    const handleEnd = (event: any) => 
    {
        if (!isSwiping) 
        {
            handleOkay();
        } 
    };

    const handleOkay = () => 
    {
        // Need to update profile first time login
        const firstTimeDone = async () => 
        {
            const result: any = await DbProfile.setFirstTimeLogin();
            
            console.log('result: ', result.rowsAffected);
            
            if (result.rowsAffected > 0) 
            {
                props.navigation.navigate('OneIntro');
            }
            else 
            {
                console.log('Failed to update profile: Not sure where to go from here');
            }
        };

        firstTimeDone();
        //props.navigation.navigate('MainScreen');
    };

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View
            style={MainStyles.container}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={handleStart}
            onResponderMove={handleMove}
            onResponderRelease={handleRelease} 
            >
                <Text style={[ MainStyles.h1, MainStyles.textSerif]}>Spiritual</Text>
                <Text style={ MainStyles.h5}>The purpose of Spiritual Health is to be able to remain present with your entire being.</Text>
                <View style={MainStyles.div}>
                    <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPressIn={handleStart} onPressOut={handleEnd}>
                        <Text style={MainStyles.buttonText}>Okay</Text>
                    </TouchableOpacity>
                    <PageIndicator style={[MainStyles.mt_4]} count={5} current={4}/>
                </View>
            </View>
        </ImageBackground>
    );
};

export default PurposeListSpiritual;