import React, { useEffect, useRef, useState } from 'react';
import DbAllocate from '../../services/DbAllocate';
import DbCalendar from '../../services/DbCalendar';
import DateUtils from '../../services/DateUtils';
import BackHelpTopBar from '../../components/BackHelpTopBar/BackHelpTopBar';
import { PageIndicator } from 'react-native-page-indicator';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, ScrollView, View, Text, TouchableOpacity, Image, TextInput, StyleSheet, PanResponder } from 'react-native';
import AllocateInput from '../../components/AllocateInput';
import backgroundImage from '../../assets/images/app_bg_sky.png';

interface Record 
{
    id: number;
    activity: number;
    activity_note: number;
    tot_hours: number;
}

const totHours = 168; // 168 hours in a week

const OneSetPhysical = ( props: any ) => 
{
	const [remainingHours, setRemainingHours] = useState(0); // [hours, setHours] = useState(0);
    const [hours, setHours] = useState(0);
    const [mins, setMins] = useState(0);
    const [checkedItems, setCheckedItems] = useState([]);
    const [otherNote, setOtherNote] = useState("");
	const [isReady, setIsReady] = useState(false);
	
    const [refresh, setRefresh] = useState(false);
	const [weekNum, setWeekNum] = useState(0);
	const [physicalRecords, setPhysicalRecords] = useState([]);
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
		await DbAllocate.getPhysicalRecords()
		.then((records: Record[]) => 
		{
			let total = 0;
			for (let i = 0; i < records.length; i++)
			{
				let tot_hours = records[i].tot_hours;
				total += tot_hours;
			}

			setPhysicalRecords(records);
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
		// const total = physicalRecords.reduce((sum, record) => sum + record.tot_hours, 0);
		console.log('Rec Id: ', recId, 'New Value: ', activityName);
		
		await DbAllocate.updPhysicalHour(recId, newValue).then(() => setRefresh(!refresh));

		// Clear existing records
		try 
		{
			await DbAllocate.delPhysicalRecords(7, recId).then((result) => console.log('Result: ', result));
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
				case 'Sports':
					hourNum = 6;
					activityDesc = 'Sports:' + ' ' + activityNote;
				break;
				case 'Workout':
					hourNum = 6;
					activityDesc = 'Workout:' + ' ' + activityNote;
				break;
				case 'Cardio':
					hourNum = 17;
					activityDesc = 'Cardio:' + ' ' + activityNote;
				break;
				case 'Other':
					hourNum = 17;
					activityDesc = 'Other:' + ' ' + activityNote;
				break;
			}

			const promise = DbCalendar.addRecord(weekNum, dayNum, hourNum, 7, 'Physical Activity', activityDesc, 1, recId, 0);	
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

		await DbAllocate.updPhysicalNote(recId, newNote).then(() => setRefresh(!refresh));

		// Update activity_desc in calendar
		switch (activityName)
		{
			case 'Sports':
				activityDesc = 'Sports:' + ' ' + newNote;
			break;
			case 'Workout':
				activityDesc = 'Workout:' + ' ' + newNote;
			break;
			case 'Cardio':
				activityDesc = 'Cardio:' + ' ' + newNote;
			break;
			case 'Other':
				activityDesc = 'Other:' + ' ' + newNote;
			break;
		}
		
		try 
		{
			await DbCalendar.updActivityDesc(7, recId, activityDesc).then((result) => console.log('Result: ', result));
		} 
		catch (error) 
		{
			console.log('An error occurred while updating the records:', error);
		}
	};

    const handleNext = () => 
    {
        props.navigation.navigate('OneSetEmotional')
    };

    return (
        <View style={MainStyles.backContainer} >
            <BackHelpTopBar navigation={props.navigation} />
            <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            	<ScrollView>
					<View style={MainStyles.container}>
						<Image source={require('../../assets/images/physical.png')} style={{width: 67, height: 70}} />
						<Text style={[ MainStyles.h1, MainStyles.textSerif]}>Physical</Text>
						<Text style={MainStyles.h5}>The purpose of Physical Health is to work on the physical form, to provide body mobility and its function.</Text>
						<View style={ { flexDirection: 'row', alignItems: 'center' } }>
							<Image source={require('../../assets/images/icon_allocate.png')} style={{width: 32, height: 32, marginRight: 5}} />
							<Text style={[MainStyles.h4, MainStyles.mb_0]}>{remainingHours} hours remaining in your week</Text>
						</View>
						<View style={[MainStyles.bb, MainStyles.mt_3, MainStyles.mb_3]}></View>
						<Text style={MainStyles.h4}>How much time do you want to allocate to your Physical goal in a week?</Text>
						{physicalRecords.map((record, index) => (
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
                    current={0}/>
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