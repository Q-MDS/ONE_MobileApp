import React, { useState } from 'react';
import NotificationUtils from '../../services/NotificationUtils';
import MainStyles from '../../assets/MainStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView, StyleSheet, Button, Platform, View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_mountains.png';

const SetLater = (props: any) => 
{
    const today = new Date();
    const currentDay = today.getDay();
    const daysUntilNextSunday = (7 - currentDay) % 7 || 7;
    const nextSunday = new Date(today.getTime() + daysUntilNextSunday * 24 * 60 * 60 * 1000);
    nextSunday.setHours(18);
    nextSunday.setMinutes(0);
    nextSunday.setSeconds(0);
    const defaultDate = new Date(nextSunday);
    const [date, setDate] = useState(defaultDate);
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [show, setShow] = useState(false);

    const showMode = (currentMode: any) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };
      
      const showTimepicker = () => {
        showMode('time');
    };

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        console.log('Mode: ', mode);
    };

    const handleSetDate = () => 
    {
        const timestamp = date.getTime();
        NotificationUtils.scheduleNotification(timestamp);
        props.navigation.navigate('MainScreen');
    };

    const handleClose = () => 
    {
        const defaultTimestamp = nextSunday.getTime();
        NotificationUtils.scheduleNotification(defaultTimestamp);
        props.navigation.navigate('MainScreen');
    }

    return (
        <SafeAreaView style={MainStyles.root}>
            <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
                <View style={MainStyles.container}>
                    {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                    )}
                    <Text style={[ MainStyles.h1, MainStyles.textSerif]}>Pick a Date and Time</Text>    
                    <Text style={MainStyles.h5}>Please select a date</Text>
                    <TouchableOpacity style={[MainStyles.buttonBasicRow]} onPress={showDatepicker}>
                        <Text style={[MainStyles.h3, MainStyles.mb_0, {width: 200, paddingTop : 10, paddingEnd: 35, paddingStart: 35, paddingBottom: 10}]}>{date.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    <Text style={[MainStyles.h5, MainStyles.mt_4]}>Please select a time</Text>
                    <TouchableOpacity style={[MainStyles.buttonBasicRow]} onPress={showTimepicker}>
                        <Text style={[MainStyles.h3, MainStyles.mb_0, { width: 200, paddingTop : 10, paddingEnd: 35, paddingStart: 35, paddingBottom: 10}]}>{date.toLocaleTimeString()}</Text>
                    </TouchableOpacity>
                    {/* <View style={[MainStyles.div, { position: 'absolute', width: '100%', bottom: 0, marginBottom: 55}]}> */}
                        <TouchableOpacity style={[MainStyles.button_primary, { width: '100%', marginTop: 25}]} onPress={handleSetDate}>
                            <Text style={MainStyles.buttonText}>Set This Date & Time</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[MainStyles.button_secondary, MainStyles.mt_3, { width: '100%'}]} onPress={handleClose}>
                            <Text style={[MainStyles.buttonText, { color: '#000000'}]}>Close</Text>
                        </TouchableOpacity>
                        <Text style={[MainStyles.h7, MainStyles.mt_2]}>Please note: If you dont set a date the deafult will be Sunday at 18:00:00.</Text>
                    {/* </View> */}
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 10
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

export default SetLater