import React, { useState } from 'react';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_mountains.png';

const OneLetsGo = ( props: any ) => 
{
    const handleLetsGo = () => 
    {
        props.navigation.navigate('OneSetPhysical');
    };

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={MainStyles.container}>
                <Text style={[ MainStyles.h1, MainStyles.textSerif]}>There are 168 hours in a week.</Text>
                <Text style={ MainStyles.h5}>Let's see how we can find the right balanced schedule for you.</Text>
                <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={ handleLetsGo }>
                    <Text style={MainStyles.buttonText}>Lets Go</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default OneLetsGo;