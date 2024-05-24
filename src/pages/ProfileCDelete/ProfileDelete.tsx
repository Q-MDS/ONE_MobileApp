import React from 'react';
import BackButton from '../../components/BackButton/BackButton';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_mountains.png';

const ProfileDelete = ( props: any ) => 
{
    const handleCancel = () => 
    {
        props.navigation.navigate('Login')
    }

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={MainStyles.container} >
                <BackButton />
                <Text style={[MainStyles.h2, MainStyles.textSerif]}>Thank you for using ONE</Text>
                <Text style={MainStyles.h5}>Closing the account is an action that cannot be reveresed. Once closed, the email address is released and can be used for creating a new ONE account. Your previous data will not be stored.</Text>

                <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_2, MainStyles.mt_3, { marginLeft: 24, marginRight: 24}]} onPress={handleCancel}>
                    <Text style={MainStyles.buttonText}>Delete Account</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

export default ProfileDelete