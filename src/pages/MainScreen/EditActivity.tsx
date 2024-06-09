import React, { useState, useEffect } from 'react';
import MainStyles from '../../assets/MainStyles';
import DbCalendar from '../../services/DbCalendar';
import DbSchedule from '../../services/DbSchedule';
import DbAllocate from '../../services/DbAllocate';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackTextHelpTopBar from '../../components/BackTextHelpTopBar/BackTextHelpTopBar';
import { SafeAreaView, ImageBackground, View, ScrollView, Text, Button, StyleSheet, TouchableOpacity, Platform } from 'react-native';
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
	const [record, setRecord] = useState<RecordType>({id: 0, activity_desc: '', activity_title: '', activity_type: 0, day_num: 0, hour_num: 0, reminder: 0, sa_id: 0, sa_type: 0});
	const [standard, setStandard] = useState<StandardType>({id: 0, day_num: 0, active: 0, start_time: 0, end_time: 0, roll_over: 0});
	const [standardExtra, setStandardExtra] = useState<StandardTypeExtra>({id: 0, day_num: 0, breakfast_active: 0, breakfast_start: 0, breakfast_end: 0, breakfast_roll_over: 0, lunch_active: 0, lunch_start: 0, lunch_end: 0, lunch_roll_over: 0, dinner_active: 0, dinner_start: 0, dinner_end: 0, dinner_roll_over: 0});
	const [allocate, setAllocate] = useState<AllocateType>({id: 0, activity: '', activity_note: '', tot_hours: 0});
	const [standardHours, setStandardHours] = useState(0);

	const [isReady, setIsReady] = useState(false);
	const [category, setCategory] = useState('');
	const [activity, setActivity] = useState('');
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const [saId, setSaId] = useState(0);
	const [saType, setSaType] = useState(0);
	const [showStartDp, setShowStartDp] = useState(false);
	const [showEndDp, setShowEndDp] = useState(false);
	const [dpStartTime, setDpStartTime] = useState<Date>(new Date());
	const [dpEndTime, setDpEndTime] = useState<Date>(new Date);
	

	const getActivity = async (id: number) =>
	{
		await DbCalendar.getActivity(id)
		.then((res: any) => 
		{
			const data: RecordType = res.rows.item(0);
			setRecord(data);

			const activityType: number = data.activity_type;
			const saId: number = data.sa_id;
			const saType: number = data.sa_type;
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
					getWorkDetail(saId);
				break;
				case 8:
					getWorkDetail(saId);
				break;
				case 9:
					getWorkDetail(saId);
				break;
				case 10:
					getWorkDetail(saId);
				break;
			}
			
			setIsReady(true);
		});	
	}

	const getWorkDetail = async (id: number) =>
	{
		await DbSchedule.getWorkRecord(id)
		.then((res: any) => 
		{
			const data: StandardType = res.rows.item(0);
			setStandard(data);
		});	
	}

	const getClassDetail = async (id: number) =>
	{
		await DbSchedule.getClassRecord(id)
		.then((res: any) => 
		{
			const data: StandardType = res.rows.item(0);
			setStandard(data);
		});	
	}

	const getSleepDetail = async (id: number) =>
	{
		await DbSchedule.getSleepRecord(id)
		.then((res: any) => 
		{
			const data: StandardType = res.rows.item(0);
			setStandard(data);
		});	
	}

	const getEatDetail = async (id: number) =>
	{
		await DbSchedule.getEatRecord(id)
		.then((res: any) => 
		{
			const data: StandardTypeExtra = res.rows.item(0);
			setStandardExtra(data);
		});	
	}

	const getPrepareDetail = async (id: number) =>
	{
		await DbSchedule.getPrepareRecord(id)
		.then((res: any) => 
		{
			const data: StandardType = res.rows.item(0);
			setStandard(data);
		});	
	}

	const getCommuteDetail = async (id: number) =>
	{
		await DbSchedule.getCommuteRecord(id)
		.then((res: any) => 
		{
			const data: StandardType = res.rows.item(0);
			setStandard(data);
		});	
	}

	const getPhysicalDetail = async (id: number) =>
	{
		await DbAllocate.getPhysicalRecord(id)
		.then((res: any) => 
		{
			const data: AllocateType = res.rows.item(0);
			setAllocate(data);
		});	
	}

	const getEmotionalDetail = async (id: number) =>
	{
		await DbAllocate.getEmotionalRecord(id)
		.then((res: any) => 
		{
			const data: AllocateType = res.rows.item(0);
			setAllocate(data);
		});	
	}

	const getMentalDetail = async (id: number) =>
	{
		await DbAllocate.getMentalRecord(id)
		.then((res: any) => 
		{
			const data: AllocateType = res.rows.item(0);
			setAllocate(data);
		});	
	}

	const getSpiritualDetail = async (id: number) =>
	{
		await DbAllocate.getSpiritualRecord(id)
		.then((res: any) => 
		{
			const data: AllocateType = res.rows.item(0);
			setAllocate(data);
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
					startTime = standard.start_time;
					rollover = standard.roll_over;
					getStartTime = secondsToTime(startTime);
					shm = getStartTime[0] + ':' + getStartTime[1];
					endTime = standard.end_time;
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
					// Shit balls
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

	const handleSave = () => 
	{
		console.log('Record saved!! ', record);
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
			<BackTextHelpTopBar navigation={props.navigation} title="Activity Details" />
				<View style={MainStyles.backContainer} >
					<ScrollView style={{ width: '100%' }}>
					<View style={[MainStyles.container, { justifyContent: 'flex-start', paddingTop: 0}]}>
						<Text style={MainStyles.h6}>{props.route.params.date}</Text>
							<View style={{ alignItems: 'flex-start', width: '100%', marginTop: 20 }} >
								<View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '100%' }}>
									<Text style={[MainStyles.h4, MainStyles.textBold, MainStyles.textLeft, MainStyles.mb_1]}>{category}:</Text>
									<Text style={[MainStyles.h4, MainStyles.textBold, MainStyles.textLeft, MainStyles.mb_1, {paddingStart: 10}]}>{activity}</Text>
								</View>
								<Text style={[MainStyles.h6, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1]}>{props.route.params.activityDate}</Text>
								<View style={{ flexDirection: 'row', justifyContent: 'flex-start', columnGap: 5, width: '100%' }}>
									<Text style={[MainStyles.h6, MainStyles.textLeft, MainStyles.mb_1]}>from</Text>
									<Text style={[MainStyles.h6, MainStyles.textLeft, MainStyles.mb_1]}>{startTime}:</Text>
									<Text style={[MainStyles.h6, MainStyles.textLeft, MainStyles.mb_1]}>to</Text>
									<Text style={[MainStyles.h6, MainStyles.textLeft, MainStyles.mb_1]}>{endTime}</Text>
								</View>

								{saType == 1 ?  
								(
									<View>
										<Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.mt_3]}>Recommended Time</Text>
										<Text style={MainStyles.h6}>1 hour</Text>
										<Text style={[MainStyles.h5, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.mt_2]}>Select a time slot or multiple time slots</Text>
									</View>
								)
								:
								(
									<View style={{ width: '100%' }}>
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
							<Text style={MainStyles.buttonText}>Delete</Text>
					</TouchableOpacity>
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
