import React from 'react';
import BackButton from '../../components/BackButton/BackButton';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_mountains.png';
import DbProfile from '../../services/DbProfile';

const ProfileCancel = ( props: any ) => 
{
    const handleCancel = () => 
    {
        DbProfile.updateOnePlan(0)
        .then((result: number) => 
        {
            console.log('Result:', result); 
            if (result == 1)
            {
                console.log('One plan updated successfully');
                props.navigation.navigate('MainScreen');
                // TODO: Must clear one plan setup data
            }           
        })
        .catch((error) => 
        {
          console.error('Failed to fetch profile:', error);
        });
        
    }
    
    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={MainStyles.container} >
                    <BackButton />
                <Text style={[MainStyles.h2, MainStyles.textSerif]}>Are you sure you want to cancel your subscription?</Text>
                <Text style={MainStyles.h5}>Cancelling the subscription will mean you loose all your data from your schedule.</Text>

                <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_2, MainStyles.mt_3, { marginLeft: 24, marginRight: 24}]} onPress={handleCancel}>
                    <Text style={MainStyles.buttonText}>Cancel Plan</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

export default ProfileCancel