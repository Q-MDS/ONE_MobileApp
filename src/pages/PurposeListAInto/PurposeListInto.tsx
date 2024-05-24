import React, { useRef, useState } from 'react';
import { PageIndicator } from 'react-native-page-indicator';
import settings from '../../../settings';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_mountains.png';

const PurposeListIntro = ( props: any ) => 
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
        if (isSwiping) 
        {
            if ((initialGestureX - finalGestureX) > swipeThreshold) 
            {
                handleNext();
            }
        }
    };

    const handleEnd = (event: any) => 
    {
        if (!isSwiping) 
        {
            handleNext();
        } 
    };

    const handleNext = () => 
    {
        props.navigation.navigate('PurposeListPhysical')
    };

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground} >
            <View
            style={MainStyles.container}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={handleStart}
            onResponderMove={handleMove}
            onResponderRelease={handleRelease}
            >
                <Text style={[ MainStyles.h1, MainStyles.textSerif]}>Ultimate Goal</Text>
                <Text style={ MainStyles.h5}>The ultimate goal of this application is to find your version of balance.</Text>
                <View style={MainStyles.div}>
                    <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPressIn={handleStart} onPressOut={handleEnd}>
                        <Text style={MainStyles.buttonText}>Next</Text>
                    </TouchableOpacity>
                    <PageIndicator style={[MainStyles.mt_4]} count={5} current={0}/>
                </View>
            </View>
        </ImageBackground>
    );
};

export default PurposeListIntro;