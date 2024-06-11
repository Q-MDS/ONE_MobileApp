import React, { useEffect, useState } from 'react';
import DBSettings from '../../services/DBSettings';
import DbSchedule from '../../services/DbSchedule';
import DbCalendar from '../../services/DbCalendar';
import Accordion from 'react-native-collapsible/Accordion';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackButton from '../../components/BackButton/BackButton';
import MainStyles from '../../assets/MainStyles';
import { SafeAreaView, StyleSheet, ImageBackground, ScrollView, View, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
import { CheckBox } from '@ui-kitten/components';
import backgroundImage from '../../assets/images/app_bg_sky.png';
import openIcon from '../../assets/images/icon_open.png';
import closeIcon from '../../assets/images/icon_close.png';
import { Icon } from '@ui-kitten/components';

interface ResultSet 
{
    rows: 
	{
        length: number;
        item(index: number): Record;
    };
}

interface Record 
{
    id: number;
    day_num: number;
    active: number;
    start_time: number;
    end_time: number;
    roll_over: number;
}

interface StartEndTimes 
{
    from: Date;
    to: Date;
}

type CommuteRecord = {
	id: number;
	dayNum: number;
	active: number;
	startTime: number;
	endTime: number;
	rollOver: number;
	from: Date;
	to: Date;
};

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const OneCommuteSchedule = ( props: any ) => 
{
    const [check, setCheck] = useState([true, true, true, true, true, true, true]);
    const [refresh, setRefresh] = useState(false);
    const [activeSections, setActiveSections] = useState<number[]>([]);
    const [currentPicker, setCurrentPicker] = useState<string>("");
    const [currentDay, setCurrentDay] = useState<number | null>(0);
    const [showPicker, setShowPicker] = useState(false);

	const [weekNum, setWeekNum] = useState(0);
	const [commuteRecords, setCommuteRecords] = useState<CommuteRecord[]>([]);
	const [isReady, setIsReady] = useState(false);
	const [filter, setFilter] = useState<CommuteRecord>();

	const getWeekNum = async () => 
	{
		await DBSettings.getWeekNumber()
		.then((value: unknown) => 
		{
			const result = value as number;
			setWeekNum(result);
		})
		.catch(error => 
		{
			console.error(error);
		});
	}

	useEffect(() => 
	{
		getWeekNum();
	}, []);

	const getRecords = async () => 
	{
		await DbSchedule.getCommuteRecords()
		.then((value: unknown) => 
		{
			const records = value as ResultSet;
			const data = [];

			for (let i = 0; i < records.rows.length; i++) 
			{
				let id = records.rows.item(i).id;
				let dayNum = records.rows.item(i).day_num;
				let active = records.rows.item(i).active;
				let startTime = records.rows.item(i).start_time;
				let endTime = records.rows.item(i).end_time;
				let rollOver = records.rows.item(i).roll_over;

				let cnvSt = convertSecondsToHours(startTime);
				const fromTime = new Date();
				fromTime.setHours(cnvSt[0], cnvSt[1], 0, 0);

				let cnvEt = convertSecondsToHours(endTime);
				const toTime = new Date();
				toTime.setHours(cnvEt[0], cnvEt[1], 0, 0);

				let from = new Date(fromTime);
				let to = new Date(toTime);

				const record = {id, dayNum, active, startTime, endTime, rollOver, from, to};
				
				data.push(record);
			}
			
			setCommuteRecords(data);
			setIsReady(true);
		})
		.catch(error => 
		{
			console.error(error);
		});
	}

	useEffect(() => 
	{
		getRecords();
	}, [refresh]);

	useEffect(() => 
	{
		if (isReady)
		{
			// let recIds: number[] = [];
			let activeChecks: boolean[] = [];
			// let defaultTimes: StartEndTimes[] = [];

			for (let i = 0; i < commuteRecords.length; i++) 
			{
				// Get record id
				// let id = commuteRecords[i].id;
				// recIds.push(id);

				// Get active status
				let active = commuteRecords[i].active;
				if (active === 0)
				{
					activeChecks.push(false);
				} 
				else 
				{
					activeChecks.push(true);
				}
			}

			setCheck(activeChecks);
			setIsReady(false);
		}

	}, [isReady]);

    const handleSaveCheck = async (recId: number, isChecked: boolean) => 
	{
		let active = 0;
		if (isChecked) { active = 1; }

		await DbSchedule.setCommuteActive(recId, active)
		.then((result) => 
		{
			console.log('Result: ', result);
			setRefresh(!refresh);
		});

		// If user unchecked the day then any records in calendar must be removed
		if (active === 0)
		{
			await DbCalendar.clearRecords(6, recId)
			.then((result) => 
			{
				console.log('Result from clear records: ', result);
			});
			await DbSchedule.setCommuteTimes(recId, 0, 0, 1)
			.then((result) => 
			{
				console.log('Result: ', result);
				setRefresh(!refresh);
			});
		}
	}

    const handleSaveTime = async (index: number, filterRecord: any) => 
	{
		// Need to clear any records for this schedule type and day
		console.log('Filter ', filterRecord);
		const recId = filterRecord['id'];
		await DbCalendar.clearRecords(6, recId)
		.then((result) => 
		{
			console.log('Result from clear records: ', result);
		});

		// let stFullDate1 = newTimes[index]['from'].toLocaleTimeString();
		let stFullDate = filterRecord['from'].toLocaleTimeString();
		let stBits = stFullDate.split(":");
		let stHour: number = parseInt(stBits[0]);
		let stMins: number = parseInt(stBits[1]);
		let stTimestamp = (stHour * 3600) + (stMins * 60);
		
		let etFullDate = filterRecord['to'].toLocaleTimeString();
		let etBits = etFullDate.split(":");
		let etHour: number = parseInt(etBits[0]);
		let etMins: number = parseInt(etBits[1]);
		let etTimestamp = (etHour * 3600) + (etMins * 60);

		let rollover = 0;
		if (etTimestamp < stTimestamp)
		{
			rollover = 1;
		}
		
		await DbSchedule.setCommuteTimes(recId, stTimestamp, etTimestamp, rollover)
		.then((result) => 
		{
			console.log('Result: ', result);
			setRefresh(!refresh);
		});

		const calendarPromises = [];
		let diff = 0;
		let totHours = 0;
		let dayOneHours = 0;
		let dayTwoHours = 0;

		if (rollover === 0)
		{
			diff = etTimestamp - stTimestamp;
			totHours = diff / 3600;
			dayOneHours = totHours;
		} 
		else 
		{
			diff = (86400 - stTimestamp) + etTimestamp;
			totHours = diff / 3600;
			dayOneHours = (86400 - stTimestamp) / 3600;
			dayTwoHours = totHours - dayOneHours;
		}

		for (let i = 0; i < dayOneHours; i++)
		{
			let hourNum = stHour + i;
			const promise = DbCalendar.addRecord(weekNum, index, hourNum, 6, 'Commute', 'Commute description', 0, recId, 0);	
			calendarPromises.push(promise);
		}

		for (let i = 0; i < dayTwoHours; i++)
		{
			let hourNum = 0 + i;
			const promise = DbCalendar.addRecord(weekNum, index + 1, hourNum, 6, 'Commute', 'Commute description', 0, recId, 0);	
			calendarPromises.push(promise);
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
		
		// console.log('Week num: ', diff, " >>> ", totHours, " >>> ", dayOneHours, " >>> ", dayTwoHours, " >>> ", stHour);
	}

    const handleAdd = async (day_number: number) => 
	{
		await DbSchedule.initCommuteSchedule(day_number,0,0,0,0)
		.then((result) => 
		{
			console.log('Added new commute record: ', result);
			setRefresh(!refresh);
		});
	}

	const handleRemove = async (recId: number) => 
	{
		await DbSchedule.delCommuteRecord(recId)
		.then((result) => 
		{
			console.log('Delete records result: ', result);
			setRefresh(!refresh);
		})
	}

    const renderHeader = (section: any, _: any, isActive: boolean) => 
	{
		return (
			<View style={[styles.buttonHeader, { flexDirection: 'row', justifyContent: 'space-between' }]}>
				<Text style={[ MainStyles.h6, MainStyles.textBold, MainStyles.mb_0, { paddingLeft: 5 }]}>{section}</Text>
				{isActive ? <Image source={openIcon} /> : <Image source={closeIcon} />}
				</View>
		);
	};

    const renderContent = (section: any, index: number) => 
	{
		const record = commuteRecords[index];
		const filteredRecords = commuteRecords.filter(record => record.dayNum === index);

		console.log('records: ', filteredRecords);
		return (
		<View>
			<View style={MainStyles.formGroupRow}>
				<CheckBox checked={check[index]} onChange={(newValue) => 
				{ 
					const newCheck = [...check]; 
					newCheck[index] = newValue; 
					setCheck(newCheck); 
					handleSaveCheck(record.id, newCheck[index] )
				}} />
				<Text style={[MainStyles.h6, MainStyles.mb_0, {paddingStart: 10}]}>I commute on a {section}</Text>
				
			</View>
			{check[index] && filteredRecords.map((item, recIndex) =>
			{
				// console.log('Time id FRAK: ', recIndex, " >>> ", item.id, " >>> ", item.from, " >>> ", item.to, " >>> ", filteredRecords.length);
				return (
				<View key={recIndex} style={[styles.buttonContainer]}>
					<TouchableOpacity style={[MainStyles.buttonBasic, styles.buttonColor]} onPress={ () => { setCurrentDay(index); setCurrentPicker('from'); setShowPicker(true); setFilter(item) } }>
						<Text style={[ MainStyles.h7, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, MainStyles.textSubtle, {textAlign: 'center'}]}>FROM</Text>
						<Text style={[ MainStyles.h2, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, {textAlign: 'center'}]}>{`${filteredRecords[recIndex].from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[MainStyles.buttonBasic, styles.buttonColor ]} onPress={() => { setCurrentDay(index); setCurrentPicker('to'); setShowPicker(true); setFilter(item) }}>
						<Text style={[ MainStyles.h7, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, MainStyles.textSubtle, {textAlign: 'center'}]}>TO</Text>
						<Text style={[ MainStyles.h2, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, {textAlign: 'center'}]}>{`${filteredRecords[recIndex].to.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
					</TouchableOpacity>
					{recIndex === 0 ? 
					<TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 30, height: 30, borderRadius:20, backgroundColor: '#4a4a4abf'  }} onPress={ () => handleAdd(item.dayNum) }>
						<View><Text style={{ color:'#ffffff', fontSize: 24, lineHeight: 28 }}>+</Text></View> 
					</TouchableOpacity>
					: 
					<TouchableOpacity style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: 30, height: 30, borderRadius:20, backgroundColor: '#4a4a4abf'  }} onPress={ () => handleRemove(item.id) }>
						<View><Text style={{ color:'#ffffff', fontSize: 24, lineHeight: 28 }}>—</Text></View> 
					</TouchableOpacity>
					}
				</View>
				);
			})}

			{showPicker && currentDay === index && (
				<DateTimePicker
				// value={filter[currentPicker]}
				value={filter && (currentPicker === 'from' || currentPicker === 'to') ? filter[currentPicker] : new Date()}
				mode="time"
				is24Hour={true}
				display="spinner"
				// onChange={(event, selectedDate) => {
				// 	const recId = filter['id'];
				// 	const updatedFilter = { ...filter };
				// 	updatedFilter[currentPicker] = selectedDate || filter[currentPicker];
				// 	setFilter(updatedFilter);
				// 	setShowPicker(false);
				// 	handleSaveTime(index, updatedFilter);
				// }}
				onChange={(event, selectedDate) => {
					if (filter && (currentPicker === 'from' || currentPicker === 'to')) {
					  const recId = filter['id'];
					  const updatedFilter = { ...filter };
					  updatedFilter[currentPicker] = selectedDate || filter[currentPicker];
					  setFilter(updatedFilter);
					  setShowPicker(false);
					  handleSaveTime(index, updatedFilter);
					}
				  }}
				/>
			)}
		</View>
		);
	};

    function convertSecondsToHours(seconds: number): [number, number] 
    {
        let hours = Math.floor(seconds / 3600);
        let remainingMinutes = Math.floor((seconds % 3600) / 60);

        return [hours, remainingMinutes];
    }

	const handleHome = () =>
	{
		props.navigation.navigate('SetupStart', {from: 'MainScreen'});
	}

	const handleNext = () => 
	{
		props.navigation.navigate('OneLetsGo')
	};

	const handleClose = () => 
	{
		props.navigation.navigate('MainScreen');
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
        	<ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
			<BackButton/>
			<ScrollView style={{ marginBottom: 20 }}>
				<View style={[MainStyles.container, { justifyContent: 'flex-start', marginTop: 60}]}>
                	<Text style={[ MainStyles.h2, MainStyles.textSerif, MainStyles.textLeft]}>Let us know your typical commute schedule:</Text>
					<View style={ [MainStyles.w_100, MainStyles.bb]}>
						<Accordion
							sections={daysOfWeek}
							activeSections={activeSections}
							renderHeader={renderHeader}
							renderContent={renderContent}
							onChange={setActiveSections}
							touchableProps={{ underlayColor: '#00000040' }}  />
					</View>
				</View>
			</ScrollView>
			<View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 12, paddingTop: 0, paddingStart: 24, paddingEnd: 24 }}>
				<TouchableOpacity style={[MainStyles.button_flex, MainStyles.mt_4, {paddingStart: 15, paddingEnd: 15}]} onPress={ handleHome }>
					<Icon name="home-outline" width={32} height={32} fill="#ffffff"/>
				</TouchableOpacity>
				<TouchableOpacity style={[MainStyles.button_flex, MainStyles.mt_4, {flex: 1, marginStart: 10, marginEnd: 10}]} onPress={ handleNext }>
					<Text style={MainStyles.buttonText}>Next</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[MainStyles.button_flex, MainStyles.mt_4, {paddingStart: 15, paddingEnd: 15}]} onPress={ handleClose }>
				<Icon name="close-square-outline" width={32} height={32} fill="#ffffff"/>
				</TouchableOpacity>
			</View>
        </ImageBackground>
		</SafeAreaView>
    );
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

export default OneCommuteSchedule;