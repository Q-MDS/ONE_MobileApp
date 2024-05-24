import React, { useState } from 'react';
import BackTextHelpTopBar from '../../components/BackTextHelpTopBar/BackTextHelpTopBar';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, ScrollView, View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';

const ManagePemsActivity = (props: any) => 
{
    const eventData = props.route.params.eventData;
    const date = new Date();
    const options = { weekday: 'long' as const, year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const };
    const dateString = date.toLocaleDateString(undefined, options);

    const times = ['15', '30', '45', '1h'];
    const [selectedTime, setSelectedTime] = useState('');
    const availableTimes = ['6-7', '7-8', '8-9', '9-10', '10-11', '11-12'];
    const [selectedAvailableTime, setSelectedAvailableTime] = useState('');

    const handleUpdate = () => 
    {
        props.navigation.navigate('MainScreen'); 
    }

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={[MainStyles.backContainer]} >
                <BackTextHelpTopBar navigation={props.navigation} title="Activity Details" />
                <ScrollView style={MainStyles.w_100}>
                    <View style={[MainStyles.container, { flex: 1, alignItems: 'flex-start', paddingTop: 0}]}>
                        <Text style={[MainStyles.h4, MainStyles.textBold, MainStyles.w_100, MainStyles.textLeft, MainStyles.mt_5, MainStyles.mb_2]}>Physical: Yoga</Text>
                        <Text style={[MainStyles.h6, MainStyles.mb_2]}>{dateString}</Text>
                        <Text style={MainStyles.h6}>From 10:00 to 11:00</Text>
                        <Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.mt_3]}>Recommended Time</Text>
                        <Text style={MainStyles.h6}>1 hour</Text>
                        <Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.mt_2]}>Select how much time</Text>
                        <View style={[styles.row]}>
                            {times.map(time => (
                            <TouchableOpacity
                                key={time}
                                style={[ styles.timeButton, selectedTime === time && styles.selectedTimeButton ]}
                                onPress={() => setSelectedTime(time)}
                            >
                                <Text style={[styles.timeTextBlack, selectedTime === time && styles.timeTextWhite]}>{time}</Text>
                            </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.mt_2]}>Select available time</Text>
                        <View style={styles.timeList}>
                            {availableTimes.map(time => (
                            <TouchableOpacity
                                key={time}
                                style={[styles.timeItem, selectedAvailableTime === time && styles.selectedTimeItem ]}
                                onPress={() => setSelectedAvailableTime(time)}
                                >
                                <Text style={[styles.timeTextBlack, selectedAvailableTime === time && styles.timeTextWhite]}>{time}</Text>
                            </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, MainStyles.buttonFull]} onPress={ handleUpdate }>
                        <Text style={MainStyles.buttonText}>Update</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    timeButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 1,
        margin: 5,
        padding: 5,
        backgroundColor: '#fefefe',
        borderRadius: 5,
    },
    selectedTimeButton: {
        backgroundColor: '#7b90af',
    },
    timeTextBlack: {
        color: 'black',
        fontSize: 20
    },
    timeTextWhite: {
        color: 'white', 
        fontSize: 20
    },
    timeList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    timeItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '30%',
        margin: 5,
        padding: 5,
        backgroundColor: '#fefefe',
        borderRadius: 5,
    },
    selectedTimeItem: {
        backgroundColor: '#7b90af',
    },
});

export default ManagePemsActivity;