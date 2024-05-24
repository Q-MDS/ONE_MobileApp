import React, { useState, useEffect } from 'react';
import MainStyles from '../../assets/MainStyles';
import DbCalendar from '../../services/DbCalendar';
import DBSettings from '../../services/DBSettings';
import DateUtils from '../../services/DateUtils';
import { ImageBackground, TouchableOpacity, Text, View } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_mountains.png';

const StartWeek = (props:any) => 
{
	/**
	 * POA for SKIP button
	 * Clear calendar_master
	 * Notifications: No verify, no accountability, no activity reminders. Just the Plan Schedule reminder which is set on next screen
	 * Notifications: clear all records
	 * Verify_master: Clear all records
	 * Accountability_master: Clear all records
	 * Set diary_mode to 1 so that in the UI and in profile manage we can switch off/disable:
	 * - Quotes
	 * - Quiz mode
	 * - Analytics
	 * - Notifications stays on
	 * - Set activity reminders to 0
	 * After SKIP has been pressed
	 * - Not going to show Set Reminder screen which then goes to Activity reminders as activty reminders is def not needed
	 * - User can at any point do the ONE Plan setup and all is normal, else in a week the start week screen will pop up again
	 * QUESTION: Do we only remove schedule and allocated PEMS or do we remove all activities?
	 * When it comes to SKIP - clear all
	 * When it comes to COPY - copy all as is
	 */
	
	const [weekNum, setWeekNum] = useState(0);
	const [dayNum, setDayNum] = useState(0);

	useEffect(() => 
	{
		DBSettings.getWeekNumber()
		.then((weekNumber: number) => 
		{
			setWeekNum(weekNumber);
		})
		.catch((error: Error) => 
		{
			console.log('Error getting week number', error);
		});

		DBSettings.getDayNumber()
		.then((dayNumber: number) => 
		{
			setDayNum(dayNumber);
		})
		.catch((error: Error) => 
		{
			console.log('Error getting day number', error);
		});
	}, []);


	const handleCopyDiary = () => 
	{
		console.log('Copy the diary');
		props.navigation.navigate('CopyDiary');
		// Set the week number to current
	}

	const handleNewDiary = () =>
	{
		console.log('Create a new diary');
		props.navigation.navigate('OneIntro');
		// No config - go straight to ONE PLan setup
	}

	const handleSkip = async () => 
	{
		console.log('Skip the diary setup');

		// Clear diary table
		await DbCalendar.truncCalendar();
		await DBSettings.setDiaryMode(1);

		const weekNumber = DateUtils.getCurrentWeekNumber();
		const dayNumber = DateUtils.getCurrentDayOfWeek();
		await DBSettings.setWeekNumber(weekNumber);
		await DBSettings.setDayNumber(dayNumber);
		await DBSettings.setActivtyReminders(0);

		props.navigation.navigate('MainScreen');
	}
	
	return (
	<ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
		<View style={MainStyles.container}>
		<Text style={[ MainStyles.h1, MainStyles.textSerif]}>Time to plan your diary for the week</Text>  
			{weekNum > 0 || dayNum > 0 ? (
				<TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, { paddingStart: 30, paddingEnd: 30}]} onPress={handleCopyDiary}>
					<Text style={[MainStyles.buttonText]}>Use current diary setup</Text>
				</TouchableOpacity>
			)
			:
			(
				<TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, { paddingStart: 30, paddingEnd: 30, opacity: 0.2}]} onPress={handleCopyDiary} disabled={true}>
					<Text style={[MainStyles.buttonText, {color: '#000000'}]}>Use current diary setup</Text>
				</TouchableOpacity>
			)}
			<Text style={MainStyles.mt_3}>This will keep your diary setup the same. Any activities that were added after the ONE Plan setup will be removed.</Text>
			<TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, {width: '100%'}]} onPress={handleNewDiary}>
				<Text style={[MainStyles.buttonText]}>Setup new diary for the week</Text>
			</TouchableOpacity>
			<Text style={MainStyles.mt_3}>Go through the ONE Plan setup wizard to create a new diary.</Text>
			<TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={handleSkip}>
				<Text style={[MainStyles.buttonText]}>Skip</Text>
			</TouchableOpacity>
			<Text style={MainStyles.mt_3}>If you select skip then you will have an empty diary. You can add your own activities but the quotes, quiz mode and analytics will be disabled.</Text>
		</View>
	</ImageBackground>
	)
}

export default StartWeek
