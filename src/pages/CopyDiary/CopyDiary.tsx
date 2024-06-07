import React, { useState, useEffect } from 'react';
import MainStyles from '../../assets/MainStyles';
import DBSettings from '../../services/DBSettings';
import DateUtils from '../../services/DateUtils';
import DbCalendar from '../../services/DbCalendar';
import DbNotification from '../../services/DbNotification';
import DbVerify from '../../services/DbVerify';
import DbAccountability from '../../services/DbAccountabilty';
import { SafeAreaView, ImageBackground, TouchableOpacity, Text, View } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';
import moment from 'moment';

const CopyDiary = (props:any) => 
{
	const [weekNum, setWeekNum] = useState(0);
	const [dayNum, setDayNum] = useState(0);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => 
	{
		const currentWeekNumber = DateUtils.getCurrentWeekNumber();
		const currentDayOfWeek = DateUtils.getCurrentDayOfWeek();

		setWeekNum(currentWeekNumber);
		setDayNum(currentDayOfWeek);
	}, []);

	const handleCreateDiary = async () => 
	{
		setIsReady(true);
	}

	const copyDiary = async () =>
	{
		await DbCalendar.copyCalendar(weekNum);
		await DBSettings.setDiaryMode(0);
		await DBSettings.setWeekNumber(weekNum);
		await DBSettings.setStartDay(dayNum);
		// ??? set daynum in settings ?
		await DbNotification.truncTable();

		const timesOne = [32400, 36000, 39600, 43200, 46800, 50400];
		const timesTwo = [61200, 64800, 68400, 72000];
		
		let createDate = moment().unix();
		for (let i = 0; i < 7; i++)
		{
			// Get time 1 and time 2
			const r1 = Math.floor(Math.random() * timesOne.length);
			const randomOne = timesOne[r1];
			const r2 = Math.floor(Math.random() * timesTwo.length);
			const randomTwo = timesOne[r2];
			
			// Accountability
			DbNotification.addRecord(createDate, weekNum, i, 4, 'Accountability Time!', 'Time to boost your accountability score', randomOne, 1, 0)
			.then((value: unknown) => 
			{
				console.log('Record added');
				const notiId = value as number;
				DbAccountability.addMasterRecord(notiId, 0, 0, 0, 0, weekNum, i, 0, 0).then(() => console.log('Done?'));
			})
			.catch((error) => 
			{
				console.log('Error adding record', error);
			});
			DbNotification.addRecord(createDate, weekNum, i, 4, 'Accountability Time!', 'Time to boost your accountability score', randomTwo, 1, 0)
			.then((value: unknown) => 
			{
				console.log('Record added');
				const notiId = value as number;
				DbAccountability.addMasterRecord(notiId, 0, 0, 0, 0, weekNum, i, 0, 0).then(() => console.log('Done?'));
			})
			.catch((error) => 
			{
				console.log('Error adding record', error);
			});

			// Verify Noti
			DbNotification.addRecord(createDate, weekNum, i, 3, 'Verification Time!', 'Check-off your completed daily activities', 64800, 1, 0)
			.then((value: unknown) => 
			{
				// Verify Master
				const notiId = value as number;
				console.log('Record added', notiId);
				DbVerify.addMasterRecord(notiId, 0, 0, 0, 0, weekNum, i, 0, 0).then(() => console.log('Done?'));

			})
			.catch((error) => 
			{
				console.log('Error adding record', error);
			});

			props.navigation.navigate('OneSetCoaching');

			// 07-05-2024 Notes or verify/analysis
			// Here we add the master record to verify_master
			// When the user clicks on the noti, a popup shows VERIFY NOW OR REMIND ME LATER
			// If the click on Verify THEN fetch the activities etc for that daya and add them to verify_detials. When I pull the records in I need to count the seconds from each. If user ticks then that will be added to total
			// When the user tick Y/N then we update the verify_details record
		}

		// Need to add noti records: verify, accountability
		// Other notis are:
		// POPUP QUIZ - mainscreen cos it is based on score
		// ACTIVITY reminders - PAge where user is asked if they want reminders
		// plan your week - Plan your week page


		// Need to add records to verify_master
		   // Add records to notifications and then use the insert_id for verify_master records
		// Need to add records to allocation_master
		// How do I handle show notifications for activities?
		// When copy is done we need to show then when next reminder page
		   // This page will add a reminder to the noti queue - 1 hour prior
		// Dev note: Noti's are cleared every week
		// Only get noti's for the current day
		// With the When would you like to do the next setup, also change the setting weeknum and day so that

		// DO YOU WANT TO SET REMINDERS
		// PLAN YOUR NEXT THINGY: SET SETTINGS
		// ADDING RECORDS TO NOTIFICATIONS, VERIFY_MASTER, ALLOCATION_MASTER

		// props.navigation.navigate('OneSetCoaching');
	}

	useEffect(() => 
	{
		if (isReady)
		{
			copyDiary();
		}
	}, [isReady]);

	const handleBack = () => 
	{
		props.navigation.navigate('StartWeek');
	}

  	return (
	<SafeAreaView style={{ flex: 1 }}>
		<ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
			<View style={MainStyles.container}>
				<Text style={[ MainStyles.h1, MainStyles.mb_1, MainStyles.textSerif]}>Use  Current Diary</Text> 
				<Text style={[MainStyles.h5, MainStyles.mb_3, MainStyles.mt_3]}>Select Copy Diary to continue or Back to return to the diary setup options.</Text>
				<TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={handleCreateDiary}>
					<Text style={[MainStyles.buttonText]}>Copy Diary</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[MainStyles.button_secondary, MainStyles.mt_4]} onPress={handleBack}>
				<Text style={[MainStyles.buttonText, { color: '#000000'}]}>Back</Text>
				</TouchableOpacity>
			</View>
		</ImageBackground>
	</SafeAreaView>
  	)
}

export default CopyDiary;