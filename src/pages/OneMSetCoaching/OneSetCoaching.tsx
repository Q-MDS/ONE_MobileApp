import React, { useState } from 'react';
import DateUtils from '../../services/DateUtils';
import DbNotification from '../../services/DbNotification';
import DBSettings from '../../services/DBSettings';
import IconRightTopBar from '../../components/IconRightTopBar/IconRightTopBar';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import backgroundImage from '../../assets/images/app_bg_mountains.png';
import moment from 'moment';

const OneSetCoaching = ( props: any ) => 
{
	// POA
	/**
	 * All this does is create a noti...
	 * Change the dropdown to the each day of the week. Make current day the default. This will
	 * Clicking on the noti will trigger a pop up saying time to do the plan thingy. GO - goes to setup diary, SKIP closes the noti
	 * ADD A CANCEL BUTTON IF THE USER GET TO SETUP DIARY FROM A NOTI BUT IF WEEK IS UPP CANCEL BUTTON NOT THERE
	 * 
	 * If a user selects a day and time, create a notification for that day and time (weeknum and daynum)
	 * The create new diary plan will set new week and day nums
	 * 
	 * If user doesn't seta reminder user will be forced to do the plan in a week. Setting a date and time remider allow the user to change the daynum
	 */

    const currentTime = moment().format('HH:00');
    const currentDay = moment().format('d');
    
    const [selectedDay, setSelectedDay] = useState(currentDay);
    const [selectedTime, setSelectedTime] = useState(currentTime);

    const handleSave = async () => 
    {
        let createDate = moment().unix();
        // let dueDate = moment().add(7, 'days').unix();
        // let trigger = dueDate - 3600;

		let st = selectedTime.split(":");
		let notiDue: number = Number(st[0]) * 3600;
		
		let currentWeekNumber = DateUtils.getCurrentWeekNumber();
		const currentDayOfWeek = DateUtils.getCurrentDayOfWeek();
		await DBSettings.setStartDay(currentDayOfWeek);
		await DBSettings.setWeekNumber(currentWeekNumber);
		await DBSettings.setDayNumber(currentDayOfWeek);

		if (Number(selectedDay) === 0)
		{
			currentWeekNumber = currentWeekNumber + 1;	
		}

		DbNotification.addRecord(createDate, currentWeekNumber, Number(selectedDay), 2, 'Plan ONE Reminder', 'Time to plan next week schedule', notiDue, 1, 0)
		.then((value: unknown) => 
		{
			const notiId = value as number;
			console.log('Record added');
		})
		.catch((error) => 
		{
			console.log('Error adding record', error);
		});

        // Temporay disable for dev: 
		props.navigation.navigate('OneSetReminders');
    }

    const handleLater = () => 
    {
        // Create a notification when user selects remind me later
        props.navigation.navigate('MainScreen');
    }

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <IconRightTopBar navigation={props.navigation} />
                <View style={MainStyles.container} >
                    <Text style={[MainStyles.h1, MainStyles.textSerif]}>Set Mandatory Weekly Planning Time</Text>
                    <Text style={[MainStyles.h5]}>We will send you a reminder a few hours before it's time to plan your schedule.</Text>
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }} >
                        <Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_2, MainStyles.mt_4]}>Choose day</Text>
                        <Picker
                            style={styles.pickerBox}
                            selectedValue={selectedDay}
                            onValueChange={(itemValue, itemIndex) => setSelectedDay(itemValue)}
                            >
                            <Picker.Item label="Sunday" value="0" />
                            <Picker.Item label="Monday" value="1" />
                            <Picker.Item label="Tuesday" value="2" />
                            <Picker.Item label="Wednesday" value="3" />
                            <Picker.Item label="Thursday" value="4" />
                            <Picker.Item label="Friday" value="5" />
                            <Picker.Item label="Saturday" value="6" />
                        </Picker>
                        <Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_2, MainStyles.mt_3]}>Choose time</Text>
                        <Picker
                            style={styles.pickerBox}
                            selectedValue={selectedTime}
                            onValueChange={(itemValue, itemIndex) => setSelectedTime(itemValue)}
                        >
                            <Picker.Item label="00:00" value="00:00" />
                            <Picker.Item label="01:00" value="01:00" />
                            <Picker.Item label="02:00" value="02:00" />
                            <Picker.Item label="03:00" value="03:00" />
                            <Picker.Item label="04:00" value="04:00" />
                            <Picker.Item label="05:00" value="05:00" />
                            <Picker.Item label="06:00" value="06:00" />
                            <Picker.Item label="07:00" value="07:00" />
                            <Picker.Item label="08:00" value="08:00" />
                            <Picker.Item label="09:00" value="09:00" />
                            <Picker.Item label="10:00" value="10:00" />
                            <Picker.Item label="11:00" value="11:00" />
                            <Picker.Item label="12:00" value="12:00" />
                            <Picker.Item label="13:00" value="13:00" />
                            <Picker.Item label="14:00" value="14:00" />
                            <Picker.Item label="15:00" value="15:00" />
                            <Picker.Item label="16:00" value="16:00" />
                            <Picker.Item label="17:00" value="17:00" />
                            <Picker.Item label="18:00" value="18:00" />
                            <Picker.Item label="19:00" value="19:00" />
                            <Picker.Item label="20:00" value="20:00" />
                            <Picker.Item label="21:00" value="21:00" />
                            <Picker.Item label="22:00" value="22:00" />
                            <Picker.Item label="23:00" value="23:00" />
                        </Picker>
                    </View>
                    <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_2, MainStyles.w_100, MainStyles.mt_3, { marginLeft: 24, marginRight: 24}]} onPress={handleSave}>
                        <Text style={MainStyles.buttonText}>Save Plan ONE Schedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[MainStyles.button_secondary, MainStyles.mt_2, MainStyles.w_100, MainStyles.mt_3, { marginLeft: 24, marginRight: 24}]} onPress={handleLater}>
                        <Text>Set A Time Later</Text>
                    </TouchableOpacity>
                </View>
        </ImageBackground>
        
    );
};

const styles = StyleSheet.create({
    pickerBox: {
        backgroundColor: '#fefefe',
        borderRadius: 10,
        width: '100%',
    },
    imageButton: {
        marginRight: 15,
    },
});

export default OneSetCoaching