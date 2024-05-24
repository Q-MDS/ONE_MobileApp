import React, { useEffect } from 'react';
import { PageIndicator } from 'react-native-page-indicator';
import settings from '../../../settings';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_mountains.png';

const OnboardingOne = ( props: any ) => 
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

    // Handle next button
    const handleNext = () => 
    {
        props.navigation.navigate('OnboardingTwo');
    }

    return (
        <View
        style={MainStyles.pageContainer}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleStart}
        onResponderMove={handleMove}
        onResponderRelease={handleRelease}
        >
            <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
                <View style={MainStyles.container }>
                    <Text style={ MainStyles.h5}>Seamlessly schedule your mental, physical, emotional and spiritual activities, tailoring your time to your well-being.</Text>
                    <View style={MainStyles.div}>
                        <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPressIn={handleStart} onPressOut={handleEnd} >
                            <Text style={MainStyles.buttonText}>Next</Text>
                        </TouchableOpacity>
                        <PageIndicator style={[MainStyles.mt_4]} count={3} current={0}/>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

export default OnboardingOne;