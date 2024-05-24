import React, { useState } from 'react';
import BackTextHelpTopBar from '../../components/BackTextHelpTopBar/BackTextHelpTopBar';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, ScrollView, View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';

const ManageActivity = ( props: any ) => 
{
    const date = new Date();
    const options = { weekday: 'long' as const, year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const };
    const dateString = date.toLocaleDateString(undefined, options);
    const currentDate = new Date().toLocaleDateString();
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');

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
                    <Text style={[MainStyles.h4, MainStyles.textBold, MainStyles.w_100, MainStyles.textLeft, MainStyles.mt_5, MainStyles.mb_2]}>Standard: Work</Text>
                        <Text style={[MainStyles.h6, MainStyles.mb_2]}>{dateString}</Text>
                        <Text style={MainStyles.h6}>From 10:00 to 11:00</Text>
                        <Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.mt_3]}>Work Schedule Hours</Text>
                        <Text style={MainStyles.h6}>6 hour</Text>
                        <Text style={styles.boldText}>Change your work hours</Text>
                        <View style={[MainStyles.formGroupRow, MainStyles.mt_3, {justifyContent: 'space-between'}]}>
                            <TextInput style={[styles.timeBox, { flex: 1 }]} selectTextOnFocus onChangeText={setStartTime}>{startTime}</TextInput>
                            <Text style={styles.colon}>{'>'}</Text>
                            <TextInput style={[styles.timeBox, { flex: 1 }]} selectTextOnFocus onChangeText={setEndTime}>{endTime}</TextInput>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    margin: 5,
  },
  timeBox: {
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 5,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
},
colon: {
    marginHorizontal: 10,
    fontSize: 24
  },
});

export default ManageActivity;