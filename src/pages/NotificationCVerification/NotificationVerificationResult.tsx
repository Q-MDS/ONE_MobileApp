import React, { useState } from 'react';
import MainStyles from '../../assets/MainStyles';
import BackButton from '../../components/BackButton/BackButton';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';

const NotificationVerificationResult = ( props: any ) => 
{
    const [rewards, setRewards] = useState(999);
    const [isVisible, setIsVisible] = useState(false);

    const handlePress = () => {
        setIsVisible(!isVisible);
        // props.navigation.navigate('MainScreen');
    };
    const handleClose = () => 
    {
        props.navigation.navigate('MainScreen')
    };

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
        <BackButton/>
            <View style={[MainStyles.container] }>
            <Text style={[MainStyles.h5, MainStyles.mb_0]}>You Scored</Text>
            <Text style={[MainStyles.textBold, { fontSize: 100 }]}>5</Text>
            <Text style={[MainStyles.h3, MainStyles.textBold]}>Daily Points</Text>
            <Text style={[MainStyles.h5 ]}>You did not complete all your recommended activities.</Text>
            {isVisible && <Text style={[MainStyles.h5, MainStyles.mb_0]}>Your rewards</Text>}
            {isVisible && <Text style={[ MainStyles.h1]}>{rewards}</Text>}
            <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_0]} onPress={handlePress} >
                <Text style={MainStyles.buttonText}>View Rewards</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={handleClose} >
                <Text style={MainStyles.buttonText}>Go Back to Calendar</Text>
            </TouchableOpacity>
        </View>
    </ImageBackground>
    );
};

export default NotificationVerificationResult
