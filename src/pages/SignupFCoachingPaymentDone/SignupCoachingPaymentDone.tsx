import React, { useState } from 'react';
import { PUBLIC_KEY } from '@env';
import JSEncrypt from 'jsencrypt';
import Datapool from '../../services/Datapool';
import DbProfile from '../../services/DbProfile';
import { ImageBackground, View, Text, TouchableOpacity, Image } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';
import MainStyles from '../../assets/MainStyles';

const dp = Datapool.getInstance();

const SignupCoachingPaymentDone = ( props: any ) => 
{
    const publicKey = PUBLIC_KEY.replace(/(.{64})/g, '$1\n');
    const [isLoading, setIsLoading] = useState(true);

    const handleClose = async () => 
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
                
            const response = await fetch('http://41.76.209.115/one/' + 'api/auth_controller/register', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
                }),
            });

            const data = await response.json()
            
            .then   (data => {
                if (data.status)
                {
                    // Success
                    updateProfile();
                }
                else 
                {
                    // Show that there wasa an error
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
        let saveInfo = dp.get('signupIsSaveCard');
        let cardData: String | false = '';

        if (saveInfo == '1')
        {
            let cd = [];
            cd[0] = dp.get('signupCardNumber');
            cd[1] = dp.get('signupCardName');
            cd[2] = dp.get('signupCardExpiry');
            cd[3] = dp.get('signupCardCvv');

            let cardinfo = JSON.stringify(cd);

            const encrypt = new JSEncrypt();
            encrypt.setPublicKey(publicKey);
            cardData = encrypt.encrypt(cardinfo);
        }
        
        DbProfile.updateProfile(dp.get('signupFirstName'), dp.get('signupLastName'), dp.get('signupEmail'), dp.get('signupPassword'), dp.get('signupAcceptTerms'), dp.get('signupPlanType'),  dp.get('signupSubscriptionType'), dp.get('signupIsSaveCard'), cardData.toString())
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

    // const handleFjb = () => {
    //     props.navigation.navigate('Login', { email: dp.get('signupEmail'), password: dp.get('signupPassword'), token: ''});
    // }

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={MainStyles.container}>
                <Image source={require('../../assets/images/icon_success.png')} style={{width: 100, height: 100}} />
                <Text style={[MainStyles.h1, MainStyles.mt_5]}>Thank you for your subscription!</Text>
                <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={handleClose}>
                    <Text style={[MainStyles.buttonText]}>Close</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={handleFjb}>
                    <Text style={[MainStyles.buttonText]}>FJB</Text>
                </TouchableOpacity> */}
            </View>
        </ImageBackground>
    );
};

export default SignupCoachingPaymentDone;