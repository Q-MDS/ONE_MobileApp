import React, { useState, useEffect, useContext } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import DBSettings from '../../services/DBSettings';
import MainStyles from '../../assets/MainStyles';
import { SafeAreaView, StyleSheet, ImageBackground, View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';
import { Card, Icon } from '@ui-kitten/components';

const SetupDefaults = (props:any) =>
{
	const defaultStartTime = new Date();
	defaultStartTime.setHours(8);
	defaultStartTime.setMinutes(0);
	const defaultEndTime = new Date();
	defaultEndTime.setHours(17);
	defaultEndTime.setMinutes(0);
	const [startTime, setStartTime] = useState(defaultStartTime);
	const [endTime, setEndTime] = useState(defaultEndTime);
	const [showStartDp, setShowStartDp] = useState(false);
	const [showEndDp, setShowEndDp] = useState(false);

	const onStartChange = (event: any, selectedDate?: Date) => 
	{
		const currentDate = selectedDate || startTime;
		setShowStartDp(Platform.OS === 'ios');
		setStartTime(currentDate);
	};

	const onEndChange = (event: any, selectedDate?: Date) => 
	{
		const currentDate = selectedDate || endTime;
		setShowEndDp(Platform.OS === 'ios');
		setEndTime(currentDate);
	};

	const showStartTimepicker = () => 
	{
		setShowStartDp(true);
	};

	const showEndTimepicker = () => 
	{
		setShowEndDp(true);
	};

	let activityName: string;
	
	switch (props.route.params.shedType) 
	{
		case 1:
			activityName = 'Work schedule';
		  break;
		case 2:
			activityName = 'Class schedule';
		  break;
		case 3:
			activityName = 'Sleep schedule';
		  break;
		case 4:
			activityName = 'Eat schedule';
		  break;
		case 5:
			activityName = 'Prepare schedule';
		  break;
		case 6:
			activityName = 'Commute schedule';
		  break;
		default:
			activityName = 'Schedule Name';
	}

	const handleSave = () =>
	{
		props.navigation.navigate('SetupStart');
	}

	const handleClose = () =>
	{
		props.navigation.navigate('SetupStart');
	}

	console.log('Shed Type: ', props.route.params.shedType);
	
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
				<View style={MainStyles.container} >
				<View style={{marginTop: 30, marginBottom:20, width: '100%', flex: 1}}>
					<Text style={[ MainStyles.h1, MainStyles.textSerif, MainStyles.mb_2]}>Plan ONE: Setup</Text>
					<Text style={ [MainStyles.h5, { paddingStart:20, paddingEnd: 20}]}>Set the default start and end times for the scheduled acivity.</Text>
					<Text style={[ MainStyles.h4, MainStyles.mb_2]}>{activityName}</Text>
				</View>
				<View style={[styles.buttonContainer]}>
					<TouchableOpacity style={[MainStyles.buttonBasic, styles.buttonColor]} onPress={showStartTimepicker}>
						<Text style={[ MainStyles.h7, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, MainStyles.textSubtle, {textAlign: 'center'}]}>FROM</Text>
						<Text style={[ MainStyles.h2, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, {textAlign: 'center'}]}>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
					</TouchableOpacity>

					{showStartDp && (
					<DateTimePicker
						testID="dateTimePicker"
						value={startTime}
						mode={'time'}
						is24Hour={true}
						display="default"
						onChange={onStartChange}
					/>
					)}

					<TouchableOpacity style={[MainStyles.buttonBasic, styles.buttonColor]} onPress={showEndTimepicker}>
					<Text style={[ MainStyles.h7, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, MainStyles.textSubtle, {textAlign: 'center'}]}>FROM</Text>
					<Text style={[ MainStyles.h2, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, {textAlign: 'center'}]}>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
					</TouchableOpacity>

					{showEndDp && (
					<DateTimePicker
						testID="dateTimePicker"
						value={endTime}
						mode={'time'}
						is24Hour={true}
						display="default"
						onChange={onEndChange}
					/>
					)}
				</View>





					<TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_2, MainStyles.w_100]} onPress={handleSave}>
						<Text style={MainStyles.buttonText}>Start</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[MainStyles.button_secondary, MainStyles.mt_2, MainStyles.w_100]} onPress={handleClose}>
						<Text style={[MainStyles.buttonText, { color: '#000000'}]}>Cancel</Text>
					</TouchableOpacity>

				</View>
			</ImageBackground>
		</SafeAreaView>
	)
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 10,
        marginBottom: 10,
		columnGap: 10
    },
    buttonHeader: {
        paddingTop: 15,
        paddingBottom: 15,
        borderTopColor: '#00000040',
        borderTopWidth: 1,
    },
    buttonColor: {
        backgroundColor: 'white',
    },
    buttonText: {
        color: 'white',
    },
});

export default SetupDefaults;