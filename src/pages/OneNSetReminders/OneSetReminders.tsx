import React, { useState } from 'react';
import MainStyles from '../../assets/MainStyles';
import DbCalendar from '../../services/DbCalendar';
import DBSettings from '../../services/DBSettings';
import { ImageBackground, View, Text, Button, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_mountains.png';

const OneSetReminders = ( props: any ) => 
{
	// POA
	/**
	 * If the user chooses yes then set the reminder flag to 1 in the calendar for allocate items
	 * Add records to notifications table
	 */
    const handleAllow = async () => 
    {
		await DBSettings.setActivtyReminders(1);

		try 
		{
			await DbCalendar.updAllAllocateReminder(1)
		}
		catch (error)
		{
			console.error(error);
		}

        props.navigation.navigate('MainScreen');
    }

    const handleSkip = async () => 
    {
		await DBSettings.setActivtyReminders(0);
        props.navigation.navigate('MainScreen');
    }

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={MainStyles.container} >
                <Text style={[MainStyles.h1, MainStyles.textSerif]}>Reminders</Text>
                <Text style={[MainStyles.h5]}>Would you like to allow notifications to be sent to you as reminders of your activities throughout the day.</Text>
                <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_2, MainStyles.w_100, MainStyles.mt_3, { marginLeft: 24, marginRight: 24}]} onPress={handleAllow}>
                    <Text style={MainStyles.buttonText}>Allow Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[MainStyles.button_secondary, MainStyles.mt_2, MainStyles.w_100, MainStyles.mt_3, { marginLeft: 24, marginRight: 24}]} onPress={handleSkip}>
                    <Text style={{ color: '#000000' }}>Skip For Now</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default OneSetReminders