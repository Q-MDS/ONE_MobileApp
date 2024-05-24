import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import MainStyles from '../assets/MainStyles';
// import SQLite from 'react-native-sqlite-storage';
// import Database from '../services/Database';

const FsOne = ( props: any ) => 
{
    // // Database testing START
    // useEffect(() => {
    //     createUserTable(); //create the table
    //   })
      
    const handleFirstTime = () => 
    {
        props.navigation.navigate('OnboardingOne');
    };

    const handleLogin = () => 
    {
        props.navigation.navigate('Login');
    }

    // const handleDatabase = () => {
    //     Database.listUsers();
    // }

    return (
    <View style={[MainStyles.container, MainStyles.fs_bg]}>
        <Text style={[MainStyles.h3, MainStyles.textCenter]}>If this is the first time the app is being run, please click the button below to start the onboarding process.</Text>

        <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, MainStyles.buttonFull]} onPress={ handleFirstTime }>
            <Text style={MainStyles.buttonText}>First Time</Text>
        </TouchableOpacity>

        <Text style={[MainStyles.h3, MainStyles.textCenter, MainStyles.mt_5]}>If you have already completed the onboarding process, please click the button below to login.</Text>

        <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, MainStyles.buttonFull]} onPress={ handleLogin }>
            <Text style={MainStyles.buttonText}>Go to Login</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, MainStyles.buttonFull]} onPress={ handleDatabase}>
            <Text style={MainStyles.buttonText}>Add Record</Text>
        </TouchableOpacity> */}
    </View>
    );
};

export default FsOne;