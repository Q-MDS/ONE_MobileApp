import React, { useState, useEffect } from 'react';
import MainStyles from '../../assets/MainStyles';
import DbCalendar from '../../services/DbCalendar';
import DbSchedule from '../../services/DbSchedule';
import DbAllocate from '../../services/DbAllocate';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackTextHelpTopBar from '../../components/BackTextHelpTopBar/BackTextHelpTopBar';
import BackTextDeleteTopBar from '../../components/BackTextDeleteTopBar/BackTextDeleteTopBar';
import { SafeAreaView, ImageBackground, View, ScrollView, Text, Button, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';

type RecordType = {
	id: number,
	activity_desc: string,
	activity_title: string,
	activity_type: number,
	day_num: number,
	hour_num: number,
	reminder: number,
	sa_id: number,
	sa_type: number,
};
type StandardType = {
	id: number,
	day_num: number,
	active: number,
	start_time: number,
	end_time: number,
	roll_over: number,
};

type StandardTypeExtra = {
	id: number,
	day_num: number,
	breakfast_active: number,
	breakfast_start: number,
	breakfast_end: number,
	breakfast_roll_over: number,
	lunch_active: number,
	lunch_start: number,
	lunch_end: number,
	lunch_roll_over: number,
	dinner_active: number,
	dinner_start: number,
	dinner_end: number,
	dinner_roll_over: number,
};

type AllocateType = {
	id: number,
	activity: string,
	activity_note: string,
	tot_hours: number,
};

const EditActivity = (props: any) => 
{
	console.log('EditActivity id: ', props.route.params.id);
	const dayNum = props.route.params.dayNum;
	const [record, setRecord] = useState<RecordType>({id: 0, activity_desc: '', activity_title: '', activity_type: 0, day_num: 0, hour_num: 0, reminder: 0, sa_id: 0, sa_type: 0});
	const [standard, setStandard] = useState<StandardType>({id: 0, day_num: 0, active: 0, start_time: 0, end_time: 0, roll_over: 0});
	const [standardExtra, setStandardExtra] = useState<StandardTypeExtra>({id: 0, day_num: 0, breakfast_active: 0, breakfast_start: 0, breakfast_end: 0, breakfast_roll_over: 0, lunch_active: 0, lunch_start: 0, lunch_end: 0, lunch_roll_over: 0, dinner_active: 0, dinner_start: 0, dinner_end: 0, dinner_roll_over: 0});
	const [allocate, setAllocate] = useState<RecordType[]>([{id: 0, activity_desc: '', activity_title: '', activity_type: 0, day_num: 0, hour_num: 0, reminder: 0, sa_id: 0, sa_type: 0}]);
	const [standardHours, setStandardHours] = useState(0);

	const [isReady, setIsReady] = useState(false);
	const [category, setCategory] = useState('');
	const [activity, setActivity] = useState('');
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const [activityType, setActivityType] = useState(0);
	const [activityDesc, setActivityDesc] = useState('');
	const [saId, setSaId] = useState(0);
	const [saType, setSaType] = useState(0);
	const [showStartDp, setShowStartDp] = useState(false);
	const [showEndDp, setShowEndDp] = useState(false);
	const [dpStartTime, setDpStartTime] = useState<Date>(new Date());
	const [dpEndTime, setDpEndTime] = useState<Date>(new Date);

	const allHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
	const [todoHours, setTodoHours] = useState<number[]>([]);
  	const [selectedHours, setSelectedHours] = useState<number[]>([]);

	const getActivity = async (id: number) =>
	{
		await DbCalendar.getActivity(id)
		.then((res: any) => 
		{
			const data: RecordType = res.rows.item(0);
			setRecord(data);

			const activityType: number = data.activity_type;
			const activityDesc: string = data.activity_desc;
			const saId: number = data.sa_id;
			const saType: number = data.sa_type;

			setActivityType(activityType);
			setActivityDesc(activityDesc);
			setSaId(saId);
			setSaType(saType);
			
			switch (activityType)
			{
				case 1:
					getWorkDetail(saId);
				break;
				case 2:
					getClassDetail(saId);
				break;
				case 3:
					getSleepDetail(saId);
				break;
				case 4:
					getEatDetail(saId);
				break;
				case 5:
					getPrepareDetail(saId);
				break;
				case 6:
					getCommuteDetail(saId);
				break;
				case 7:
				case 8:
				case 9:
				case 10:
					getAllocDetail(activityType, dayNum);
				break;
			}
		});	
	}

	const getWorkDetail = async (id: number) =>
	{
		await DbSchedule.getWorkRecord(id)
		.then((res: any) => 
		{
			const data: StandardType = res.rows.item(0);
			setStandard(data);
			setIsReady(true);
		});	
	}

	const getClassDetail = async (id: number) =>
	{
		await DbSchedule.getClassRecord(id)
		.then((res: any) => 
		{
			const data: StandardType = res.rows.item(0);
			setStandard(data);
			setIsReady(true);
		});	
	}

	const getSleepDetail = async (id: number) =>
	{
		await DbSchedule.getSleepRecord(id)
		.then((res: any) => 
		{
			const data: StandardType = res.rows.item(0);
			setStandard(data);
			setIsReady(true);
		});	
	}

	const getEatDetail = async (id: number) =>
	{
		await DbSchedule.getEatRecord(id)
		.then((res: any) => 
		{
			console.log('EAT: ', res.rows.item(0));
			const data: StandardTypeExtra = res.rows.item(0);
			setStandardExtra(data);
			setIsReady(true);
		});	
	}

	const getPrepareDetail = async (id: number) =>
	{
		await DbSchedule.getPrepareRecord(id)
		.then((res: any) => 
		{
			const data: StandardType = res.rows.item(0);
			setStandard(data);
			setIsReady(true);
		});	
	}

	const getCommuteDetail = async (id: number) =>
	{
		await DbSchedule.getCommuteRecord(id)
		.then((res: any) => 
		{
			const data: StandardType = res.rows.item(0);
			setStandard(data);
			setIsReady(true);
		});	
	}

	const getAllocDetail = async (activityType: number, dayNum: number) =>
	{
		await DbCalendar.getAllocateRecords(activityType, dayNum)
		.then((res: any) => 
		{
			const data: RecordType[] = res;

			let allocHours = [];
			for (let i = 0; i < data.length; i++)
			{
				allocHours.push(data[i].hour_num);
			}
			setTodoHours(allocHours);

			setIsReady(true);
		});	
	}

	useEffect(() => 
	{
		getActivity(props.route.params.id);
	}, []);

	useEffect(() => 
	{
		if (isReady)
		{
			console.log('IS Ready Block AAA');
			const activityType: number = record.activity_type;
			const activityDesc: string = record.activity_desc;
			const hourNum: number = record.hour_num;

			let startTime: number = 0;
			let getStartTime = [];
			let shm = '';
			let endTime: number = 0;
			let getEndTime = [];
			let ehm = '';
			let totalHours: number = 0;
			let rollover: number = 0
			const defaultStartTime = new Date();
			const defaultEndTime = new Date();

			switch (activityType)
			{
				case 1:
					console.log('IS Ready Block BBB');
					setCategory('Standard');
					setActivity('Work');
					startTime = standard.start_time;
					rollover = standard.roll_over;
					getStartTime = secondsToTime(startTime);
					shm = getStartTime[0] + ':' + getStartTime[1];
					endTime = standard.end_time;
					getEndTime = secondsToTime(endTime);
					ehm = getEndTime[0] + ':' + getEndTime[1];
					if (rollover == 1)
					{
						totalHours = ((86400 - startTime) + endTime) / 3600;
					} 
					else
					{
						totalHours = (endTime - startTime) / 3600;
					}
					defaultStartTime.setHours(parseInt(getStartTime[0], 10));
					defaultStartTime.setMinutes(parseInt(getStartTime[1], 10));
					defaultEndTime.setHours(parseInt(getEndTime[0], 10));
					defaultEndTime.setMinutes(parseInt(getEndTime[1], 10));
					setDpStartTime(defaultStartTime);
					setDpEndTime(defaultEndTime);
					setStartTime(shm);
					setEndTime(ehm);
					setStandardHours(totalHours);
					console.log('standard A: ', standard);
				break;
				case 2:
					setCategory('Standard');
					setActivity('Class');
					startTime = standard.start_time;
					rollover = standard.roll_over;
					getStartTime = secondsToTime(startTime);
					shm = getStartTime[0] + ':' + getStartTime[1];
					endTime = standard.end_time;
					getEndTime = secondsToTime(endTime);
					ehm = getEndTime[0] + ':' + getEndTime[1];
					if (rollover == 1)
					{
						totalHours = ((86400 - startTime) + endTime) / 3600;
					} 
					else
					{
						totalHours = (endTime - startTime) / 3600;
					}

					defaultStartTime.setHours(parseInt(getStartTime[0], 10));
					defaultStartTime.setMinutes(parseInt(getStartTime[1], 10));
					defaultEndTime.setHours(parseInt(getEndTime[0], 10));
					defaultEndTime.setMinutes(parseInt(getEndTime[1], 10));
					setDpStartTime(defaultStartTime);
					setDpEndTime(defaultEndTime);
					setStartTime(shm);
					setEndTime(ehm);
					setStandardHours(totalHours);
				break;
				case 3:
					setCategory('Standard');
					setActivity('Sleep');
					startTime = standard.start_time;
					rollover = standard.roll_over;
					getStartTime = secondsToTime(startTime);
					shm = getStartTime[0] + ':' + getStartTime[1];
					endTime = standard.end_time;
					getEndTime = secondsToTime(endTime);
					ehm = getEndTime[0] + ':' + getEndTime[1];
					if (rollover == 1)
					{
						totalHours = ((86400 - startTime) + endTime) / 3600;
					} 
					else
					{
						totalHours = (endTime - startTime) / 3600;
					}
					defaultStartTime.setHours(parseInt(getStartTime[0], 10));
					defaultStartTime.setMinutes(parseInt(getStartTime[1], 10));
					defaultEndTime.setHours(parseInt(getEndTime[0], 10));
					defaultEndTime.setMinutes(parseInt(getEndTime[1], 10));
					setDpStartTime(defaultStartTime);
					setDpEndTime(defaultEndTime);
					setStartTime(shm);
					setEndTime(ehm);
					setStandardHours(totalHours);
				break;
				case 4:
					setCategory('Standard');
					setActivity('Eat');
					if (activityDesc == 'Breakfast')
					{
						startTime = standardExtra.breakfast_start;
						endTime = standardExtra.breakfast_end;
						rollover = standardExtra.breakfast_roll_over;
					}
					else if (activityDesc == 'Lunch')
					{
						startTime = standardExtra.lunch_start;
						endTime = standardExtra.lunch_end;
						rollover = standardExtra.lunch_roll_over;
					} 
					else 
					{
						startTime = standardExtra.dinner_start;
						endTime = standardExtra.dinner_end;
						rollover = standardExtra.dinner_roll_over;
					}
					
					getStartTime = secondsToTime(startTime);
					shm = getStartTime[0] + ':' + getStartTime[1];
					getEndTime = secondsToTime(endTime);
					ehm = getEndTime[0] + ':' + getEndTime[1];
					//a
					if (rollover == 1)
					{
						totalHours = ((86400 - startTime) + endTime) / 3600;
					} 
					else
					{
						totalHours = (endTime - startTime) / 3600;
					}
					defaultStartTime.setHours(parseInt(getStartTime[0], 10));
					defaultStartTime.setMinutes(parseInt(getStartTime[1], 10));
					defaultEndTime.setHours(parseInt(getEndTime[0], 10));
					defaultEndTime.setMinutes(parseInt(getEndTime[1], 10));
					setDpStartTime(defaultStartTime);
					setDpEndTime(defaultEndTime);
					setStartTime(shm);
					setEndTime(ehm);
					setStandardHours(totalHours);
				break;
				case 5:
					setCategory('Standard');
					setActivity('Prepare');
					startTime = standard.start_time;
					rollover = standard.roll_over;
					getStartTime = secondsToTime(startTime);
					shm = getStartTime[0] + ':' + getStartTime[1];
					endTime = standard.end_time;
					getEndTime = secondsToTime(endTime);
					ehm = getEndTime[0] + ':' + getEndTime[1];
					if (rollover == 1)
					{
						totalHours = ((86400 - startTime) + endTime) / 3600;
					} 
					else
					{
						totalHours = (endTime - startTime) / 3600;
					}
					defaultStartTime.setHours(parseInt(getStartTime[0], 10));
					defaultStartTime.setMinutes(parseInt(getStartTime[1], 10));
					defaultEndTime.setHours(parseInt(getEndTime[0], 10));
					defaultEndTime.setMinutes(parseInt(getEndTime[1], 10));
					setDpStartTime(defaultStartTime);
					setDpEndTime(defaultEndTime);
					setStartTime(shm);
					setEndTime(ehm);
					setStandardHours(totalHours);
				break;
				case 6:
					setCategory('Standard');
					setActivity('Commute');
					startTime = standard.start_time;
					rollover = standard.roll_over;
					getStartTime = secondsToTime(startTime);
					shm = getStartTime[0] + ':' + getStartTime[1];
					endTime = standard.end_time;
					getEndTime = secondsToTime(endTime);
					ehm = getEndTime[0] + ':' + getEndTime[1];
					if (rollover == 1)
					{
						totalHours = ((86400 - startTime) + endTime) / 3600;
					} 
					else
					{
						totalHours = (endTime - startTime) / 3600;
					}
					defaultStartTime.setHours(parseInt(getStartTime[0], 10));
					defaultStartTime.setMinutes(parseInt(getStartTime[1], 10));
					defaultEndTime.setHours(parseInt(getEndTime[0], 10));
					defaultEndTime.setMinutes(parseInt(getEndTime[1], 10));
					setDpStartTime(defaultStartTime);
					setDpEndTime(defaultEndTime);
					setStartTime(shm);
					setEndTime(ehm);
					setStandardHours(totalHours);
				break;
				case 7:
					setCategory('Physical');
					setActivity(activityDesc);
				break;
				case 8:
					setCategory('Emotional');
					setActivity(activityDesc);
				break;
				case 9:
					setCategory('Mental');
					setActivity(activityDesc);
				break;
				case 10:
					setCategory('Spiritual');
					setActivity(activityDesc);
				break;
			}
		}
	}, [isReady]);

	const showStartTimepicker = () => 
	{
		setShowStartDp(true);
	};

	const showEndTimepicker = () => 
	{
		setShowEndDp(true);
	};

	const onStartChange = (event: any, selectedDate?: Date) => 
	{
		const currentDate = selectedDate || dpStartTime;
		setShowStartDp(Platform.OS === 'ios');
		setDpStartTime(currentDate);
	};
	
	const onEndChange = (event: any, selectedDate?: Date) => 
	{
		const currentDate = selectedDate || dpEndTime;
		setShowEndDp(Platform.OS === 'ios');
		setDpEndTime(currentDate);
	};

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

	const handleDelete = async () => 
	{
		// console.log('Record deleted!!');
		console.log('Arbsicle: ', activity);
		Alert.alert(
			"Confirm Delete",
			"Are you sure you want to delete this record?",
			[
				{
				text: "Ok",
				onPress: () => 
					{
						console.log('Code to delete record: ', props.route.params.id);
						console.log('SA Id: ', saId);
						console.log('Activity Type: ', activityType);
						console.log('Blobberty: ', activityDesc);

						switch (activityType)
						{
							case 1:
								deleteActivity(saId,"schedule_work", 0);
							break;
							case 2:
								deleteActivity(saId,"schedule_class", 0);
							break;
							case 3:
								deleteActivity(saId,"schedule_sleep", 0);
							break;
							case 4:
								console.log('DESC: ', activityDesc);
								if (activityDesc == 'Breakfast')
								{
									deleteEatActivity(saId, "schedule_eat", 0, "breakfast_active", "breakfast_start", "breakfast_end");
								}
								else if (activityDesc == 'Lunch')
								{
									deleteEatActivity(saId, "schedule_eat", 0, "lunch_active", "lunch_start", "lunch_end");
								} 
								else {
									deleteEatActivity(saId, "schedule_eat", 0, "dinner_active", "dinner_start", "dinner_end");
								}
							break;
							case 5:
								deleteActivity(saId,"schedule_prepare", 0);
							break;
							case 6:
								deleteActivity(saId,"schedule_commute", 0);
							break;
							case 7:
								// setScheduleActive("allocate_physical", saId, 0);
							break;
							case 8:
								// setScheduleActive("allocate_emotional", saId, 0);
							break;
							case 9:
								// setScheduleActive("allocate_mental", saId, 0);
							break;
							case 10:
								// setScheduleActive("allocate_spiritual", saId, 0);
							break;
						}
						// Delete calendar record
						// Do I need to update the sched/alloc tables? - Schedule - make sa_id, active = 0
						// - Allocate - tothours = tothours - params abcdefg
					}
				},
				{ 
					text: "Cancel", 
					onPress: () => 
					{
						console.log("Cancel Pressed.")
					},
					style: "cancel"
			 	}
			]
		);
	}

	async function deleteActivity(saId: number, table: string, active: number)
	{
		try 
		{
			await Promise.all([DbCalendar.deleteActivity(saId), DbSchedule.setActive(table, saId, active)]);
			props.navigation.navigate('MainScreen');
		} 
		catch(error)
		{
			console.error('Error in database calls:', error);
		}
	}

	async function deleteEatActivity(saId: number, table: string, active: number, activeName: string, activeStart: string, activeEnd: string)
	{
		try 
		{
			await Promise.all([DbCalendar.deleteActivity(saId), DbSchedule.setEatActive(table, saId, active, activeName, activeStart, activeEnd)]);
			props.navigation.navigate('MainScreen');
		} 
		catch(error)
		{
			console.error('Error in database calls:', error);
		}
	}

	const handleSave = () => 
	{
		console.log('Record saved!! ', saType);

		// Schedule activity
		if (saType == 0)
		{
			// need to get the type of schedule
			// need the start and end times
			// need activity id & sa_id
			// CALENDAR
			// need to DELETE all activity records WHERE sa_id = saId AND activity_type = 4 for example (EAT)
			// then add new calender records FROM - TO
			// SCHEDULE TABLE
			// Will need to pass the relevant table name: CREATE ARRAY
			// UPDATE start_time & end_time... WHERE id = saId

			// TOMORROW:
			// 1. Do save for schedule and allocate: We might need to do notification records as well
				// 1. EXTRA: Add an activity might need to add a notification record
			// 2. Need to fix EAT lunch/dinner times going wonky and wrong or zero/null time being saved as end time. Maybe wonky isn't causing kak cos start is 100% ok
			// 3. Prepare & commute with multiple times might also be making kak
			// 4. Need to run thru login to start week: 3 options. Scenario where you go to Start week and choose COPY, it copies but then it goes to START WEEK again after you login
			// NEXT STEPS: Look into noti system.
			// NEXT STEPS: Reminders and Firebase/Push Noti's
			// NEXT STEPS: Tomorrow night get ONE onto CodeMagic
			// NEXT STEPS: Wed, bug fix and make TestFlight
			// NEXT STEPS: Ask Andre for server time for ONE backend
			// NEXT STEPS: Ask Marcel if MDS has server for testing etc


			

			/*switch (activityType)
			{
				case 1:
					saveWork();
				break;
				case 2:
					saveClass();
				break;
				case 3:
					saveSleep();
				break;
				case 4:
					saveEat();
				break;
				case 5:
					savePrepare();
				break;
				case 6:
					saveCommute();
				break;
				case 7:
				case 8:
				case 9:
				case 10:
					saveAllocate();
				break;
			}*/	
		}
	}

	const handleClose = () => 
	{
		props.navigation.navigate('MainScreen');
	} 

	function secondsToTime(seconds: number): [string, string] 
    {
        let hours = Math.floor(seconds / 3600);
        let remainingMinutes = Math.floor((seconds % 3600) / 60);
		let fmtHours = hours.toString().padStart(2, '0');
		let fmtMinutes = remainingMinutes.toString().padStart(2, '0');

        return [fmtHours, fmtMinutes];
    }

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
			<BackTextDeleteTopBar navigation={props.navigation} title="Activity Details" ondelete={handleDelete} />
				<View style={MainStyles.backContainer} >
					<ScrollView style={{ width: '100%' }}>
					<View style={[MainStyles.container, { justifyContent: 'flex-start', paddingTop: 0}]}>
						<Text style={MainStyles.h6}>{props.route.params.date}</Text>
							<View style={{ alignItems: 'flex-start', width: '100%' }} >
								<View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '100%' }}>
									<Text style={[MainStyles.h4, MainStyles.textBold, MainStyles.textLeft, MainStyles.mb_1]}>{category}:</Text>
									<Text style={[MainStyles.h4, MainStyles.textBold, MainStyles.textLeft, MainStyles.mb_1, {paddingStart: 10}]}>{activity != 'Eat' ? activity : `${activity} ${activityDesc}`}</Text>
								</View>
								<Text style={[MainStyles.h6, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1]}>{props.route.params.activityDate}</Text>

								{saType == 1 ?  
								(
									<View style={{ width: '100%' }}>
										<Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.mt_3]}>Recommended Time</Text>
										<Text style={[MainStyles.h6, MainStyles.w_100, MainStyles.textLeft]}>1 hour</Text>
										<Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.mt_2]}>Select a time slot or multiple time slots</Text>
										<View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: 5, rowGap:5, marginTop: 15 }}>
										{allHours.map((hour, index) => (
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
									
								)
								:
								(
									<View style={{ width: '100%' }}>
										<View style={{ flexDirection: 'row', justifyContent: 'flex-start', columnGap: 5, width: '100%' }}>
											<Text style={[MainStyles.h6, MainStyles.textLeft, MainStyles.mb_1]}>from</Text>
											<Text style={[MainStyles.h6, MainStyles.textLeft, MainStyles.mb_1]}>{startTime}</Text>
											<Text style={[MainStyles.h6, MainStyles.textLeft, MainStyles.mb_1]}>to</Text>
											<Text style={[MainStyles.h6, MainStyles.textLeft, MainStyles.mb_1]}>{endTime}</Text>
										</View>
										<Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.mt_4]}>{activity} Schedule Hours</Text>
										<Text style={[MainStyles.h6, MainStyles.w_100, MainStyles.textLeft]}>{standardHours} hour(s)</Text>

										<Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_3, MainStyles.mt_3]}>Change Your {activity} Hours</Text>
										<View style={[styles.buttonContainer]}>
											<TouchableOpacity style={[MainStyles.buttonBasic, styles.buttonColor]} onPress={showStartTimepicker}>
												<Text style={[ MainStyles.h7, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, MainStyles.textSubtle, {textAlign: 'center'}]}>FROM</Text>
												<Text style={[ MainStyles.h2, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, {textAlign: 'center'}]}>{dpStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
											</TouchableOpacity>

											{showStartDp && (
											<DateTimePicker
												testID="dateTimePicker"
												value={dpStartTime}
												mode={'time'}
												is24Hour={true}
												display="default"
												onChange={onStartChange}
											/>
											)}

											<TouchableOpacity style={[MainStyles.buttonBasic, styles.buttonColor]} onPress={showEndTimepicker}>
											<Text style={[ MainStyles.h7, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, MainStyles.textSubtle, {textAlign: 'center'}]}>TO</Text>
											<Text style={[ MainStyles.h2, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, {textAlign: 'center'}]}>{dpEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
											</TouchableOpacity>

											{showEndDp && (
											<DateTimePicker
												testID="dateTimePicker"
												value={dpEndTime}
												mode={'time'}
												is24Hour={true}
												display="default"
												onChange={onEndChange}
											/>
											)}
										</View>
									</View>
								)}
								
							</View>
						</View>
				</ScrollView>
			</View>	
				<View style={{ width: '100%', marginBottom: 24 }}>
					<TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_5, MainStyles.buttonFull]} onPress={ handleSave }>
							<Text style={MainStyles.buttonText}>Save</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_2, MainStyles.buttonFull]} onPress={ handleClose }>
							<Text style={MainStyles.buttonText}>Close</Text>
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


export default EditActivity
