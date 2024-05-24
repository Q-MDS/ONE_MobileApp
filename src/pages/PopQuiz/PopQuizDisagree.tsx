import React, { useState } from 'react';
import BackButton from '../../components/BackButton/BackButton';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';

const PopQuizDisagree = ( props: any) => 
{
    const handleClose = () => 
    {
        props.navigation.navigate('MainScreen');
    }

  return (
    <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
        <BackButton/>
        <View style={MainStyles.backContainer} >
            <Text style={[MainStyles.h1, MainStyles.textSerif]}>Oh no!</Text>
            <Text style={[MainStyles.h5, { paddingLeft: 24, paddingRight: 24 }]}>Remember, the overall goal is to achieve balance. If you disagree, don't worry!</Text>
            <Text style={[MainStyles.h5, { paddingLeft: 24, paddingRight: 24 }]}>We're here to guide you on your journey. Tap 'Agree' to embark on the path of balance'</Text>
            <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_2, MainStyles.mt_3, { marginLeft: 24, marginRight: 24}]} onPress={handleClose}>
                    <Text style={MainStyles.buttonText}>Agree</Text>
            </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default PopQuizDisagree;