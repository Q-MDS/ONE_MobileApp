import React, { useState, useEffect } from 'react';
import DbCalendar from '../../services/DbCalendar';
import DBSettings from '../../services/DBSettings';
import DbAllocate from '../../services/DbAllocate';
import BackTextHelpTopBar from '../../components/BackTextHelpTopBar/BackTextHelpTopBar';
import MainStyles from '../../assets/MainStyles';
import { SafeAreaView, ImageBackground, View, ScrollView, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { RadioButton, IconButton } from 'react-native-paper';
import backgroundImage from '../../assets/images/app_bg_sky.png';

const goals = ['Physical', 'Emotional', 'Mental', 'Spiritual'];
const physical = ['Sports', 'Workout', 'Cardio', 'Other'];
const emotional = ['Significant other time', 'Family time', 'Music', 'Social event', 'Dancing', 'Team building event', 'Friends gathering', 'Night out', 'Date night', 'Game night', 'Other'];
const mental = ['Reading', 'Studying', 'Learning', 'Other'];
const spiritual = ['Yoga', 'Meditation', 'Praying', 'Religious practice', 'Other'];

const AddActivity = ( props: any ) => 
{
	const [weekNum, setWeekNum] = useState(0);
	const [dayNum, setDayNum] = useState(props.route.params.dayNumber);
	const [selectedGoal, setSelectedGoal] = useState('Physical');
	// const [selectedActivity, setSelectedActivity] = useState('');
	const [selectedActivity, setSelectedActivity] = useState('');
	const allHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
	const [todoHours, setTodoHours] = useState<number[]>([]);
	const [availableHours, setAvailableHours] = useState<number[]>([]); // your array of available hours
  	const [selectedHours, setSelectedHours] = useState<number[]>([]);

	useEffect(() => 
	{
		DBSettings.getWeekNumber()
		.then((value: unknown) => 
		{
			const weekNumber = value as number;
			setWeekNum(weekNumber);
		})
		.catch((error: Error) => 
		{
			console.log('Error getting week number', error);
		});

		let data = [];
		for (let i = 0; i < props.route.params.todos.length; i++)
		{
			data.push(props.route.params.todos[i].hourNum);
		}
		setTodoHours(data);
		setAvailableHours(allHours.filter((hour) => !data.includes(hour)));
		setSelectedActivity('Sports');
	}, []);

	let activities: any[];
	
	switch (selectedGoal) 
	{
		case 'Physical':
		  activities = physical;
		//   setSelectedActivity('Sports');
		  break;
		case 'Emotional':
		  activities = emotional;
		  break;
		case 'Mental':
		  activities = mental;
		  break;
		case 'Spiritual':
		  activities = spiritual;
		  break;
		default:
		  activities = [];
	}

	const handleSelectGoal = (goal: any) =>
	{
		setSelectedGoal(goal);

		switch (goal) 
		{
			case 'Physical':
				setSelectedActivity('Sports');
			break;
			case 'Emotional':
				setSelectedActivity('Significant other time');
			break;
			case 'Mental':
				setSelectedActivity('Reading');
			break;
			case 'Spiritual':
				setSelectedActivity('Yoga');
			break;
			default:
				setSelectedActivity('');
		}
		
	}

	const handleSelectHour = (hour: number) => 
	{
		setSelectedHours([...selectedHours, hour]);
		setTodoHours([...todoHours, hour]);
	};

	const handleDeselectHour = (hour: number) => 
	{
		setTodoHours(todoHours.filter((h) => h !== hour));
		setSelectedHours(selectedHours.filter(item => item !== hour));
	};

	const handleSave = async () => 
	{

		console.log('Save the activity: ', weekNum, dayNum);
		// Get contents of selectedHours
		const goal = selectedGoal;
		const activity = selectedActivity;
		const goalTypes: { [key: string]: number } = {'Physical' : 7, 'Emotional' : 8, 'Mental' : 9, 'Spiritual' : 10};
		const saIdPhysical: { [key: string]: number } = {'Sports' : 1, 'Workout' : 2, 'Cardio' : 3, 'Other' : 4};
		const saIdEmaotional: { [key: string]: number } = {'Significant other time' : 1, 'Family time' : 2, 'Music' : 3, 'Social event' : 4, 'Dancing' : 5, 'Team building event' : 6, 'Friends gathering' : 7, 'Night out' : 8, 'Date night' : 9, 'Game night' : 10, 'Other' : 11};
		const saIdMental: { [key: string]: number } = {'Reading' : 1, 'Studying' : 2, 'Learning' : 3, 'Other' : 4};
		const saIdSpiritual: { [key: string]: number } = {'Yoga' : 1, 'Meditation' : 2, 'Praying' : 3, 'Religious practice' : 4, 'Other' : 5};
		
		let saId = 0;
		if (goal == "Physical")
		{
			saId = saIdPhysical[activity];
		} 
		else if (goal == "Emotional")
		{
			saId = saIdEmaotional[activity];
		}
		else if (goal == "Mental")
		{
			saId = saIdMental[activity];
		}
		else 
		{
			saId = saIdSpiritual[activity];
		}
		
		const activityType = goalTypes[goal];
		const activityTitle = goal + ' Activity';
		
		selectedHours.map((hourNum) => 
		{
			console.log('Hour: ', hourNum, ' >> ' , goal , ' >> ' , activity , ' >> ' , activityType);
			
			// Save to calender
			saveRecord(weekNum, dayNum, hourNum, activityType, activityTitle, activity, saId, 0);

			// Save to alloc table
			updateHours(goal, saId);

		});
		
		props.navigation.navigate('MainScreen'); 
	}

	async function saveRecord(weekNum: number, dayNum: number, hourNum: number, activityType: number, activityTitle: string, activityDesc: string, saId: number, recId: number)
	{
		await DbCalendar.addRecord(weekNum, dayNum, hourNum, activityType, activityTitle, activityDesc, 1, saId, 0);
	}

	async function updateHours(goal: string, saId: number)
	{
		// Update the hours in the allocate table
		switch (goal)
		{
			case 'Physical':
				await DbAllocate.addToPhysicalHour(saId).then((result) => console.log('Result: ', result));
			break;
			case 'Emotional':
				await DbAllocate.addToEmotionalHour(saId).then((result) => console.log('Result: ', result));
			break;
			case 'Mental':
				await DbAllocate.addToMentalHour(saId).then((result) => console.log('Result: ', result));
			break;
			case 'Spiritual':
				await DbAllocate.addToSpiritualHour(saId).then((result) => console.log('Result: ', result));
			break;
		}
	}


  	return (
		<SafeAreaView style={{ flex: 1 }}>
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
        <View style={MainStyles.backContainer} >
            <BackTextHelpTopBar navigation={props.navigation} title="Add New Activity" />
            <ScrollView>
				<View style={[MainStyles.container, { justifyContent: 'flex-start', paddingTop: 0}]}>
					<Text style={MainStyles.h6}>{props.route.params.date}</Text>
						<View style={{ alignItems: 'flex-start', width: '100%', marginTop: 20 }} >
							<Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1]}>Select Goal</Text>
							{goals.map(goal => (
							<View key={goal} style={styles.row}>
								<RadioButton
									value={goal}
									status={selectedGoal === goal ? 'checked' : 'unchecked'}
									// onPress={() => setSelectedGoal(goal)}
									onPress={() => handleSelectGoal(goal)}
								/>
								<Text style={[MainStyles.h6, MainStyles.mb_0]}>{goal}</Text>
							</View>
							))}
					
							<Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.mt_3]}>Recommended Time</Text>
							<Text style={MainStyles.h6}>1 hour</Text>
							<Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1]}>Select Activity</Text>

							{activities.map((activity) => (
								<View key={activity} style={styles.row}>
									<RadioButton
										key={activity}
										value={activity}
										status={selectedActivity === activity ? 'checked' : 'unchecked'}
										onPress={() => setSelectedActivity(activity)}
									/>
									<Text style={[MainStyles.h6, MainStyles.mb_0]}>{activity}</Text>
								</View>
								))}
							<Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.mt_2]}>Select a time slot or multiple time slots</Text>
							{/* Do a map of the times showing start to end + 86400... */}
							<View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: 5, rowGap:5, marginTop: 15 }}>
							{availableHours.map((hour, index) => (
								<View style={{ width: '22%' }}>
								<Button
									key={hour}
									title={`${hour.toString().padStart(2, '0')}:00`}
									onPress={() => {
									if (todoHours.includes(hour)) {
										handleDeselectHour(hour);
									} else {
										handleSelectHour(hour);
									}
									}}
									color={todoHours.includes(hour) ? '#7b90af' : 'gray'}
								/>
								</View>
							))}
							</View>
						</View>
						<TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_5, MainStyles.buttonFull]} onPress={ handleSave }>
								<Text style={MainStyles.buttonText}>Save</Text>
						</TouchableOpacity>
					</View>
            </ScrollView>
        </View>
    </ImageBackground>
	</SafeAreaView>
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