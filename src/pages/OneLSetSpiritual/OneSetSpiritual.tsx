import React, { useEffect, useRef, useState } from 'react';
import DbCalendar from '../../services/DbCalendar';
import DbAllocate from '../../services/DbAllocate';
import DateUtils from '../../services/DateUtils';
import BackHelpTopBar from '../../components/BackHelpTopBar/BackHelpTopBar';
import { PageIndicator } from 'react-native-page-indicator';
import MainStyles from '../../assets/MainStyles';
import AllocateInput from '../../components/AllocateInput';
import { ImageBackground, ScrollView, View, Text, TouchableOpacity, Image, TextInput, StyleSheet, PanResponder } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import backgroundImage from '../../assets/images/app_bg_sky.png';

interface Record 
{
    id: number;
    activity: number;
    activity_note: number;
    tot_hours: number;
}

const totHours = 168;

const OneSetPhysical = ( props: any ) => 
{
    const [remainingHours, setRemainingHours] = useState(0); // [hours, setHours] = useState(0);
	const [isReady, setIsReady] = useState(false);
    const [refresh, setRefresh] = useState(false);
	const [weekNum, setWeekNum] = useState(0);
	const [spiritualRecords, setSpiritualRecords] = useState<Record[]>([]);
	const [scheduleHours, setScheduleHours] = useState(0);
	const [allocatedHours, setAllocatedHours] = useState(0);

	const getScheduleHours = async () => 
	{
		await DbAllocate.getTotScheduleHours().then((value: unknown) => 
		{
			const count = value as number;
			setScheduleHours(count);
			return;
		})
		.catch(error => 
		{
			console.error(error);
		});
	}

	const getRecords = async () => 
	{
		await DbAllocate.getSpiritualRecords()
		.then((value: unknown) => 
		{
			const records = value as Record[];
			let total = 0;
			for (let i = 0; i < records.length; i++)
			{
				let tot_hours = records[i].tot_hours;
				total += tot_hours;
			}

			setSpiritualRecords(records);
			setAllocatedHours(total);
			return;
		})
		.catch(error => 
		{
			console.error(error);
		});
	}

	useEffect(() => 
	{
		setRemainingHours(totHours - (scheduleHours + allocatedHours));
		const currentWeekNumber = DateUtils.getCurrentWeekNumber();
		setWeekNum(currentWeekNumber);
	}, [allocatedHours]);

	useEffect(() => 
	{
		const fetchRecords = async () =>
		{
			await getScheduleHours();
			await getRecords();
			setIsReady(true);
		}

		fetchRecords();
	}, [refresh]);

	useEffect(() => 
	{
		if (isReady)
		{
			console.log('Schedule Hours : ', scheduleHours);
			console.log('Allocated Records: ', allocatedHours);	
		}
	}, [isReady])

	const handleInputHours = async (recId: number, newValue: number, activityName: string, activityNote: string) => 
	{
		console.log('Rec Id: ', recId, 'New Value: ', activityName);
		
		await DbAllocate.updSpiritualHour(recId, newValue).then(() => setRefresh(!refresh));

		// Clear existing records
		try 
		{
			await DbAllocate.delMentalRecords(10, recId).then((result) => console.log('Result: ', result));
		} 
		catch(error)
		{
			console.log('Oops. Could not find records to delete');
		}

		// Re-add records
		const calendarPromises = [];
		let dayNum = 0;
		let activityDesc = '';

		for (let i = 0; i < newValue; i++)
		{
			let hourNum = 0;
			switch (activityName)
			{
				case 'Yoga':
					hourNum = 6;
					activityDesc = 'Yoga:' + ' ' + activityNote;
				break;
				case 'Meditation':
					hourNum = 6;
					activityDesc = 'Meditation:' + ' ' + activityNote;
				break;
				case 'Praying':
					hourNum = 17;
					activityDesc = 'Praying:' + ' ' + activityNote;
				break;
				case 'Religious Practice':
					hourNum = 17;
					activityDesc = 'Religious Practice:' + ' ' + activityNote;
				break;
				case 'Other':
					hourNum = 17;
					activityDesc = 'Other:' + ' ' + activityNote;
				break;
			}

			const promise = DbCalendar.addRecord(weekNum, dayNum, hourNum, 10, 'Spiritual Activity', activityDesc, 1, recId, 0);	
			calendarPromises.push(promise);

			if (dayNum < 6)
			{
				dayNum++;
			}
			else 
			{
				dayNum = 0;
			}
		}

		try 
		{
			await Promise.all(calendarPromises);
			console.log('All calendar records added successfully');
		} 
		catch (error) 
		{
			console.log('An error occurred while adding records:', error);
		}
	};

	const handleInputNote = async (recId: number, newNote: string, activityName: string) => 
	{
		let activityDesc = '';

		await DbAllocate.updSpiritualNote(recId, newNote).then(() => setRefresh(!refresh));

		// Update activity_desc in calendar
		switch (activityName)
		{
			case 'Yoga':
					activityDesc = 'Yoga:' + ' ' + newNote;
			break;
			case 'Meditation':
				activityDesc = 'Meditation:' + ' ' + newNote;
			break;
			case 'Praying':
				activityDesc = 'Praying:' + ' ' + newNote;
			break;
			case 'Religious Practice':
				activityDesc = 'Religious Practice:' + ' ' + newNote;
			break;
			case 'Other':
				activityDesc = 'Other:' + ' ' + newNote;
			break;
		}
		
		try 
		{
			await DbCalendar.updActivityDesc(10, recId, activityDesc).then((result) => console.log('Result: ', result));
		} 
		catch (error) 
		{
			console.log('An error occurred while updating the records:', error);
		}
	};

	const handleNext = () => 
	{
		props.navigation.navigate('OneSetCoaching')
	};

	return (
        <View style={[MainStyles.backContainer]} >
            <BackHelpTopBar navigation={props.navigation} />
            <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            	<ScrollView style={{ flex: 1 }}>
					<View style={[MainStyles.container]}>
						<Image source={require('../../assets/images/spirtual.png')} style={{width: 75, height: 77}} />
						<Text style={[ MainStyles.h1, MainStyles.textSerif]}>Spiritual</Text>
						<Text style={MainStyles.h5}>The purpose of Spiritual Health is to be able to remain present with your entire being.</Text>
						<View style={ { flexDirection: 'row', alignItems: 'center' } }>
							<Image source={require('../../assets/images/icon_allocate.png')} style={{width: 32, height: 32, marginRight: 5}} />
							<Text style={[MainStyles.h4, MainStyles.mb_0]}>{remainingHours} hours remaining in your week</Text>
						</View>
						<View style={[MainStyles.bb, MainStyles.mt_3, MainStyles.mb_3]}></View>
						<Text style={MainStyles.h4}>How much time do you want to allocate to your Spiritual goal in a week?</Text>
						{spiritualRecords.map((record, index) => (
							<AllocateInput 
								key={index} 
								title={record.activity} 
								value={record.tot_hours} 
								note={record.activity_note} 
								onchange={(newValue: number) => handleInputHours(record.id, newValue, record.activity.toString(), record.activity_note.toString())} 
								saveNote={(newNote: string) => handleInputNote(record.id, newNote, record.activity.toString())}
							/>
						))}
					</View>
                
					<View style={{ marginTop:50 }}>
						<TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, MainStyles.buttonFull]} onPress={ handleNext }>
							<Text style={MainStyles.buttonText}>Next</Text>
						</TouchableOpacity>
						<PageIndicator
						style={[MainStyles.pageIndicator, MainStyles.mt_1]}
						count={4}
						current={2}/>
					</View>
				</ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    timeBox: {
        backgroundColor: '#fff',
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 5,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sliderBox: {
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingLeft: 4,
        paddingRight: 4,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    colon: {
      marginHorizontal: 10,
    },
});

export default OneSetPhysical