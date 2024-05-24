import React, { useState } from 'react';
import MainStyles from '../../assets/MainStyles';
import BackButton from '../../components/BackButton/BackButton';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';

const NotificationAccountabilityResult = ( props: any ) => 
{
    const [accountabilityScore, setAccountabilityScore] = useState(999);
    const [isVisible, setIsVisible] = useState(false);

    const handlePress = () => 
    {
        setIsVisible(!isVisible);
    };

    const handleClose = () => 
    {
        props.navigation.navigate('MainScreen')
    };

  return (
    <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
        <BackButton/>
        <View style={[MainStyles.container] }>
            <Text style={[MainStyles.h6, MainStyles.mb_2, MainStyles.textSubtle]}>You selected:</Text>
            <Text style={[MainStyles.h3]}> {props.route.params.selectedValue}</Text>
            <Text style={[MainStyles.h5, MainStyles.mb_0]}>You Scored</Text>
            <Text style={[MainStyles.textBold, { fontSize: 100 }]}>3</Text>
            <Text style={[MainStyles.h3, MainStyles.textBold]}>Accountability Points</Text>
            {isVisible && <Text style={[MainStyles.h5, MainStyles.mb_0]}>Total Points</Text>}
            {isVisible && <Text style={[ MainStyles.h1]}>{accountabilityScore}</Text>}
            <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_0]} onPress={handlePress} >
                <Text style={MainStyles.buttonText}>View Accountability Score</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={handleClose} >
                <Text style={MainStyles.buttonText}>Go Back to Calendar</Text>
            </TouchableOpacity>
        </View>
    </ImageBackground>
  )
}

export default NotificationAccountabilityResult