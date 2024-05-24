import React, { useState } from 'react';
import Datapool from '../../services/Datapool';
import DbProfile from '../../services/DbProfile';
import BackButton from '../../components/BackButton/BackButton';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import backgroundImage from '../../assets/images/app_bg_sky.png';

const dp = Datapool.getInstance();

const SignupOptionCoaching = ( props: any ) => 
{
    const [isLoading, setIsLoading] = useState(true);
    const [remoteId, setRemoteId] = useState(0);
    
    const handleStartTrial = () => 
    {
        let email = dp.get('signupEmail');
        let password = dp.get('signupPassword');
        let firstName = dp.get('signupFirstName');
        let lastName = dp.get('signupLastName');

        registerUser(email, password, firstName, lastName);
    };

    const registerUser = async (email: string, password: string, firstName: string, lastName: string) => 
    {
        setIsLoading(true);
        try {
            // 21 coaching plan so notification, quotes, quiz and package must be set    
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
                notifications: 1,
                quotes: 1,
                quiz_mode: 1,
                accept_tc: 1,
                one_package: 1
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
        DbProfile.updateProfile(remoteId, 1, 0, dp.get('signupFirstName'), dp.get('signupLastName'), dp.get('signupEmail'), dp.get('signupPassword'), "", 1, 1, 1, 0, dp.get('signupAcceptTerms'), 1, 0, 0, "")
        .then((result: number) => 
        {
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
        });
    }

    const handleViewFree = () => 
    {
        props.navigation.navigate('SignupOptionFree');
    };

    const [isSelected1, setSelection1] = React.useState(true);
    const [isSelected2, setSelection2] = React.useState(true);
    const [isSelected3, setSelection3] = React.useState(true);
    const [isSelected4, setSelection4] = React.useState(true);

    return (
            <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
                <View style={MainStyles.container}>
                    <BackButton />
                    <Text style={[ MainStyles.h5, MainStyles.textSubtle, MainStyles.textUppercase]}>Pricing</Text>
                    <Text style={MainStyles.h1}>Service Options</Text>
                    <Text style={[ MainStyles.h6, MainStyles.textCenter]}>Upgrade to our Coaching version for personalized activity recommendations, motivational quotes, pop-quizzes and progress analysis for a balanced life.</Text>
                    <Text style={[ MainStyles.h2, MainStyles.textSubtle, MainStyles.mb_2]}>$15/month</Text>
                    <Text style={[ MainStyles.h3, MainStyles.textSubtle, MainStyles.mb_2]}>$126/year</Text>
                    <Text style={[ MainStyles.h2, MainStyles.textBold, MainStyles.mb_1]}>Coaching Version</Text>
                    <Text style={[ MainStyles.h5, MainStyles.textSubtle, MainStyles.mb_4]}>Includes 21 day free trial</Text>
                    <Text style={[ MainStyles.h2, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100]}>Features:</Text>
                    <View style={ [ MainStyles.bb, MainStyles.mb_2 ] } />
                    <View style={ MainStyles.formGroupRow}>
                        <CheckBox
                        value={isSelected1}
                        onValueChange={setSelection1}
                        />
                        <Text style={[ MainStyles.h5, MainStyles.mb_0, MainStyles.w_100, MainStyles.textLeft ]}>Activity Recommendations</Text>
                    </View>
                    <View style={ [ MainStyles.bb, MainStyles.mt_2, MainStyles.mb_2 ] } />
                    <View style={ MainStyles.formGroupRow}>
                        <CheckBox
                        value={isSelected2}
                        onValueChange={setSelection2}
                        />
                        <Text style={[ MainStyles.h5, MainStyles.mb_0, MainStyles.w_100, MainStyles.textLeft ]}>Quotes</Text>
                    </View>
                    <View style={ [ MainStyles.bb, MainStyles.mt_2, MainStyles.mb_2 ] } />
                    <View style={ MainStyles.formGroupRow}>
                        <CheckBox
                        value={isSelected3}
                        onValueChange={setSelection3}
                        />
                        <Text style={[ MainStyles.h5, MainStyles.mb_0, MainStyles.w_100, MainStyles.textLeft ]}>Pop Quizzes</Text>
                    </View>
                    <View style={ [ MainStyles.bb, MainStyles.mt_2, MainStyles.mb_2 ] } />
                    <View style={ MainStyles.formGroupRow}>
                        <CheckBox
                        value={isSelected4}
                        onValueChange={setSelection4}
                        />
                        <Text style={[ MainStyles.h5, MainStyles.mb_0, MainStyles.w_100, MainStyles.textLeft ]}>Analysis Plan</Text>
                    </View>
                    <View style={ [ MainStyles.bb, MainStyles.mt_2, MainStyles.mb_2 ] } />
                    <TouchableOpacity style={[MainStyles.button_secondary, MainStyles.mt_2]} onPressIn={handleViewFree} >
                        <Text>View Free Plan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_3]} onPressIn={handleStartTrial} >
                        <Text style={[MainStyles.buttonText]}>Start 21 Day Free Trial</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
    );
};

export default SignupOptionCoaching;