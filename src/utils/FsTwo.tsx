import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MainStyles from '../assets/MainStyles';

const FsTwo = ( props: any ) => 
{
    const handleFirstTime = () => 
    {
        props.navigation.navigate('PurposeListIntro')
    };

    const handleMainScreen = () => 
    {
        props.navigation.navigate('MainScreen');
    
    }
    const handlePopQuiz = () => 
    {
        let randomNumber = Math.floor(Math.random() * 5);
        props.navigation.navigate('PopQuiz', { randomNumber: randomNumber});
    }

    return (
        <View style={[MainStyles.container, MainStyles.fs_bg]}>
            <Text style={[MainStyles.h3, MainStyles.textCenter]}>Is this the first time the user is logging in?</Text>
            <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, MainStyles.buttonFull]} onPress={ handleFirstTime }>
                <Text style={MainStyles.buttonText}>First Time</Text>
            </TouchableOpacity>
            <Text style={[MainStyles.h3, MainStyles.textCenter, MainStyles.mt_5]}>The user has logged in before, go to the Main Screen.</Text>
            <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, MainStyles.buttonFull]} onPress={ handleMainScreen }>
                <Text style={MainStyles.buttonText}>Go to Main Screen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, MainStyles.buttonFull]} onPress={ handlePopQuiz }>
                <Text style={MainStyles.buttonText}>View PopQuiz</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FsTwo;