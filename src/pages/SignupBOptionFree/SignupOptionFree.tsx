import React, { useState } from 'react';
import DbSetup from '../../services/DbSetup';
import Datapool from '../../services/Datapool';
import DbProfile from '../../services/DbProfile';
import BackButton from '../../components/BackButton/BackButton';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import backgroundImage from '../../assets/images/app_bg_sky.png';

const dp = Datapool.getInstance();

const SignupOptionFree = ( props: any ) => 
{
    const [isLoading, setIsLoading] = useState(true);
    const [remoteId, setRemoteId] = useState(0);

    const handleGetStarted = () => 
    {
        let email = dp.get('signupEmail');
        let password = dp.get('signupPassword');
        let firstName = dp.get('signupFirstName');
        let lastName = dp.get('signupLastName');

        registerUser(email, password, firstName, lastName);

        // props.navigation.navigate('Login');
    };

    const registerUser = async (email: string, password: string, firstName: string, lastName: string) => 
    {
        setIsLoading(true);
        try {
            // Free plan so notification, quotes, quiz and package are all 0    
            const response = await fetch('http://192.168.1.28/one/' + 'api/auth_controller/register', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
                notifications: 0,
                quotes: 0,
                quiz_mode: 0,
                accept_tc: 1,
                one_package: 0
                }),
            });

            const data = await response.json()
            
            .then (data => {
                if (data.status)
                {
                    // Success
                    console.log(data.message);
                    setRemoteId(data.remote_id);
                    updateProfile();
                }
                else 
                {
                    // Show that there wasa an error
                    console.log(data.message);
                }
            });

            // If all good then run the add profile to database method (TODO)
        } 
        catch (error) 
        {
            console.error(error);
        } 
        finally 
        {
            setIsLoading(false);
        }
    }

    const updateProfile = () => 
    {
		/*
		* New version: commented it out
		*
        console.log('remoteId: ' + remoteId);
        DbProfile.updateProfile(remoteId, 1, 0, dp.get('signupFirstName'), dp.get('signupLastName'), dp.get('signupEmail'), dp.get('signupPassword'), "", 0, 0, 0, 0, dp.get('signupAcceptTerms'), 0, 0, 0, "")
        .then((value: unknown) => 
        {
			const result =value as number;
            if (result == 1)
            {
                // Success
                props.navigation.navigate('Login', { email: dp.get('signupEmail'), password: dp.get('signupPassword'), token: ''});
            }
            else 
            {
                // Show that there wasa an error
            }
        })
        .catch((error) => 
        {
        console.error('Failed to fetch profile:', error);
        });*/

    }

    const handleViewCoaching = () => 
    {
        props.navigation.navigate('SignupOptionCoaching')
    };

    const [isSelected, setSelection] = React.useState(true);

    return (
    // <View>
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={MainStyles.container}>
                <BackButton />
                <Text style={[ MainStyles.h5, MainStyles.textSubtle, MainStyles.textUppercase]}>Pricing</Text>
                <Text style={MainStyles.h1}>Service Options</Text>
                <Text style={[ MainStyles.h6, MainStyles.textCenter]}>Unlock the powerof Plan ONE, where you can experience the questionaire to help create your schedule based on your goals and current schedule, view your calendar.</Text>
                <Text style={[ MainStyles.h2, MainStyles.textSubtle, MainStyles.mb_2]}>$0</Text>
                <Text style={[ MainStyles.h2, MainStyles.textBold]}>Free Version</Text>
                <Text style={[ MainStyles.h2, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100]}>Features:</Text>
                <View style={ [ MainStyles.bb, MainStyles.mb_3 ] } />
                <View style={ MainStyles.formGroupRow}>
                    <CheckBox
                    value={isSelected}
                    onValueChange={setSelection}
                    />
                    <Text style={[ MainStyles.h5, MainStyles.mb_0, MainStyles.w_100, MainStyles.textLeft ]}>Plan your schedule with ONE</Text>
                </View>
                <View style={ [MainStyles.bb, MainStyles.mt_3] } />
                <TouchableOpacity style={[MainStyles.button_secondary, MainStyles.mt_4]} onPressIn={handleViewCoaching} >
                    <Text>View Coaching Plan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPressIn={handleGetStarted} >
                    <Text style={[MainStyles.buttonText]}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    // </View>
    );
};

export default SignupOptionFree;