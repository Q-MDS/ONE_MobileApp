import React, { useState } from 'react';
import BackTextHelpTopBar from '../../components/BackTextHelpTopBar/BackTextHelpTopBar';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, View, ScrollView, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { RadioButton, IconButton } from 'react-native-paper';
import backgroundImage from '../../assets/images/app_bg_sky.png';

const goals = ['Physical', 'Emotional', 'Mental', 'Spiritual'];
const activities = ['Sports', 'Workout', 'Cardio', 'Other'];
const times = ['15', '30', '45', '1h'];
const availableTimes = ['6-7', '7-8', '8-9', '9-10', '10-11', '11-12'];

const AddActivity = ( props: any ) => 
{
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedAvailableTime, setSelectedAvailableTime] = useState('');

    const handleSave = () => 
    {
        props.navigation.navigate('MainScreen'); 
    }

  return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
        <View style={MainStyles.backContainer} >
            <BackTextHelpTopBar navigation={props.navigation} title="Add New Activity" />
            <ScrollView>
            <View style={[MainStyles.container, { justifyContent: 'flex-start', paddingTop: 0}]}>
                <Text style={MainStyles.h6}>Thursday, 21 May</Text>
                    <View style={{ alignItems: 'flex-start', width: '100%' }} >
                        <Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1]}>Select Goal</Text>
                        {goals.map(goal => (
                        <View key={goal} style={styles.row}>
                            <RadioButton
                                value={goal}
                                status={selectedGoal === goal ? 'checked' : 'unchecked'}
                                onPress={() => setSelectedGoal(goal)}
                            />
                            <Text>{goal}</Text>
                        </View>
                        ))}
                
                        <Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.mt_3]}>Recommended Time</Text>
                        <Text style={MainStyles.h6}>1 hour</Text>
                        <Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1]}>Select Activity</Text>

                        {activities.map(activity => (
                        <View key={activity} style={styles.row}>
                            <RadioButton
                                value={activity}
                                status={selectedActivity === activity ? 'checked' : 'unchecked'}
                                onPress={() => setSelectedActivity(activity)}
                            />
                            <Text>{activity}</Text>
                        </View>
                        ))}
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
                    <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, MainStyles.buttonFull]} onPress={ handleSave }>
                            <Text style={MainStyles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
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

export default AddActivity;