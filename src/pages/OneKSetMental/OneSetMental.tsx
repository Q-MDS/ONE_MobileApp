import React, { useEffect, useState } from 'react';
import DbAllocate from '../../services/DbAllocate';
import DbCalendar from '../../services/DbCalendar';
import DateUtils from '../../services/DateUtils';
import BackHelpTopBar from '../../components/BackHelpTopBar/BackHelpTopBar';
import { PageIndicator } from 'react-native-page-indicator';
import MainStyles from '../../assets/MainStyles';
import AllocateInput from '../../components/AllocateInput';
import { ImageBackground, ScrollView, View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';

interface Record 
{
    id: number;
    activity: number;
    activity_note: number;
    tot_hours: number;
}

const totHours = 168;

const OneSetMental = ( props: any ) => 
{
    const [remainingHours, setRemainingHours] = useState(0); // [hours, setHours] = useState(0);
	const [isReady, setIsReady] = useState(false);
    const [refresh, setRefresh] = useState(false);
	const [weekNum, setWeekNum] = useState(0);
	const [mentalRecords, setMentalRecords] = useState([]);
	const [scheduleHours, setScheduleHours] = useState(0);
	const [allocatedHours, setAllocatedHours] = useState(0);

	const getScheduleHours = async () => 
	{
		await DbAllocate.getTotScheduleHours().then((count: number) => 
		{
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
		await DbAllocate.getMentalRecords()
		.then((records: Record[]) => 
		{
			let total = 0;
			for (let i = 0; i < records.length; i++)
			{
				let tot_hours = records[i].tot_hours;
				total += tot_hours;
			}

			setMentalRecords(records);
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
		
		await DbAllocate.updMentalHour(recId, newValue).then(() => setRefresh(!refresh));

		// Clear existing records
		try 
		{
			await DbAllocate.delMentalRecords(9, recId).then((result) => console.log('Result: ', result));
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
				case 'Reading':
					hourNum = 6;
					activityDesc = 'Reading:' + ' ' + activityNote;
				break;
				case 'Studying':
					hourNum = 6;
					activityDesc = 'Studying:' + ' ' + activityNote;
				break;
				case 'Learning':
					hourNum = 17;
					activityDesc = 'Learning:' + ' ' + activityNote;
				break;
				case 'Other':
					hourNum = 17;
					activityDesc = 'Other:' + ' ' + activityNote;
				break;
			}

			const promise = DbCalendar.addRecord(weekNum, dayNum, hourNum, 9, 'Mental Activity', activityDesc, 1, recId, 0);	
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

		await DbAllocate.updMentalNote(recId, newNote).then(() => setRefresh(!refresh));

		// Update activity_desc in calendar
		switch (activityName)
		{
			case 'Reading':
				activityDesc = 'Reading:' + ' ' + newNote;
			break;
			case 'Studying':
				activityDesc = 'Studying:' + ' ' + newNote;
			break;
			case 'Learning':
				activityDesc = 'Learning:' + ' ' + newNote;
			break;
			case 'Other':
				activityDesc = 'Other:' + ' ' + newNote;
			break;
		}
		
		try 
		{
			await DbCalendar.updActivityDesc(9, recId, activityDesc).then((result) => console.log('Result: ', result));
		} 
		catch (error) 
		{
			console.log('An error occurred while updating the records:', error);
		}
	};

	const handleNext = () => 
	{
		props.navigation.navigate('OneSetSpiritual')
	};

	return (
        <View style={[MainStyles.backContainer]} >
            <BackHelpTopBar navigation={props.navigation} />
            <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            	<ScrollView style={{ flex: 1 }}>
					<View style={[MainStyles.container]}>
						<Image source={require('../../assets/images/mental.png')} style={{width: 55, height: 72}} />
						<Text style={[ MainStyles.h1, MainStyles.textSerif]}>Mental</Text>
						<Text style={MainStyles.h5}>The purpose of Mental Health is to improve your intelligence.</Text>
						<View style={ { flexDirection: 'row', alignItems: 'center' } }>
							<Image source={require('../../assets/images/icon_allocate.png')} style={{width: 32, height: 32, marginRight: 5}} />
							<Text style={[MainStyles.h4, MainStyles.mb_0]}>{remainingHours} hours remaining in your week</Text>
						</View>
						<View style={[MainStyles.bb, MainStyles.mt_3, MainStyles.mb_3]}></View>
						<Text style={MainStyles.h4}>How much time do you want to allocate to your Mental goal in a week?</Text>
						{mentalRecords.map((record, index) => (
							<AllocateInput 
								key={index} 
								title={record.activity} 
								value={record.tot_hours} 
								note={record.activity_note} 
								onchange={(newValue) => handleInputHours(record.id, newValue, record.activity, record.activity_note)} 
								saveNote={(newNote) => handleInputNote(record.id, newNote, record.activity)}
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

export default OneSetMental