import React, { useEffect, useState } from 'react';
import DBSettings from '../../services/DBSettings';
import DbSchedule from '../../services/DbSchedule';
import DbCalendar from '../../services/DbCalendar';
import Accordion from 'react-native-collapsible/Accordion';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackButton from '../../components/BackButton/BackButton';
import MainStyles from '../../assets/MainStyles';
import { SafeAreaView, ScrollView, StyleSheet, ImageBackground, View, TouchableOpacity, Image, Text } from 'react-native';
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

type SleepRecord = {
	id: number;
	dayNum: number;
	active: number;
	startTime: number;
	endTime: number;
	rollOver: number;
};

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Code below is to setup default times. New process skips this...
const fromTime = new Date();
fromTime.setHours(22, 0, 0, 0);
const toTime = new Date();
toTime.setHours(6, 0, 0, 0);
const defaultTimes = daysOfWeek.map(() => ({ from: new Date(fromTime), to: new Date(toTime) }));

const OneSleepSchedule = ( props: any ) => 
{
    const [refresh, setRefresh] = useState(false);
    const [check, setCheck] = useState([true, true, true, true, true, true, true]);
    const [activeSections, setActiveSections] = useState<number[]>([]);
    const [showPicker, setShowPicker] = useState(false);
    const [times, setTimes] = useState(defaultTimes);
    const [currentDay, setCurrentDay] = useState<number | null>(0);
    const [currentPicker, setCurrentPicker] = useState<string>("");
    const [recordId, setRecordId] = useState<number[]>([]);

	const [weekNum, setWeekNum] = useState(0);
	const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
	const [isReady, setIsReady] = useState(false);

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
		await DbSchedule.getSleepRecords()
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

				const record = {id, dayNum, active, startTime, endTime, rollOver};
				
				data.push(record);
			}
			
			setSleepRecords(data);
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
			let recIds: number[] = [];
			let activeChecks: boolean[] = [];
			let defaultTimes: StartEndTimes[] = [];

			for (let i = 0; i < sleepRecords.length; i++) 
			{
				// Get record id
				let id = sleepRecords[i].id;
				recIds.push(id);

				// Get active status
				let active = sleepRecords[i].active;
				if (active === 0)
				{
					activeChecks.push(false);
				} 
				else 
				{
					activeChecks.push(true);
				}

				// Get start and end times
				let getSt = sleepRecords[i].startTime;
				let cnvSt = convertSecondsToHours(getSt);
				const fromTime = new Date();
				fromTime.setHours(cnvSt[0], cnvSt[1], 0, 0);

				let getEt = sleepRecords[i].endTime;
				let cnvEt = convertSecondsToHours(getEt);
				const toTime = new Date();
				toTime.setHours(cnvEt[0], cnvEt[1], 0, 0);

				defaultTimes.push({ "from": new Date(fromTime), "to": new Date(toTime) });
			}

			setRecordId(recIds);
			setCheck(activeChecks);
			setTimes(defaultTimes);
			setIsReady(false);
		}

	}, [isReady]);

    // useEffect(() => 
    // {
    //     DbCalendar.chkTable(3)
    //     .then((result: any) => 
    //     {
    //         let recIds: number[] = [];

    //         for (let i = 0; i < result.rows.length; i++)
    //         {
    //             let x = result.rows.item(i).id;
    //             recIds.push(x);
    //         }

    //         setRecordId(recIds);

    //         let activeChecks: boolean[] = [];

    //         for (let i = 0; i < result.rows.length; i++)
    //         {
    //             let x = result.rows.item(i).activity_active;
                
    //             if (x === 0)
    //             {
    //                 activeChecks.push(false);
    //             } 
    //             else 
    //             {
    //                 activeChecks.push(true);
    //             }
    //         }

    //         setCheck(activeChecks);

    //         let defaultTimes: StartEndTimes[] = [];

    //         for (let i = 0; i < result.rows.length; i++)
    //         {
    //             let getSt = result.rows.item(i).activity_start;
    //             let cnvSt = convertSecondsToHours(getSt);
    //             const fromTime = new Date();
    //             fromTime.setHours(cnvSt[0], cnvSt[1], 0, 0);

    //             let getEt = result.rows.item(i).activity_end;
    //             let cnvEt = convertSecondsToHours(getEt);
    //             const toTime = new Date();
    //             toTime.setHours(cnvEt[0], cnvEt[1], 0, 0);

    //             defaultTimes.push({ "from": new Date(fromTime), "to": new Date(toTime) });
    //         }

    //         setTimes(defaultTimes);
    //     })
    //     .catch((error) => 
    //     {
    //         // Result: fail
    //     });
    // }, [refresh]);

    const handleSaveCheck = async (recId: number, isChecked: boolean) => 
	{
		let active = 0;
		if (isChecked) { active = 1; }

		await DbSchedule.setSleepActive(recId, active)
		.then((result) => 
		{
			console.log('Result: ', result);
			setRefresh(!refresh);
		});

		// If user unchecked the day then any records in calendar must be removed
		if (active === 0)
		{
			await DbCalendar.clearRecords(3, recId)
			.then((result) => 
			{
				console.log('Result from clear records: ', result);
			});
			await DbSchedule.setSleepTimes(recId, 0, 0, 1)
			.then((result) => 
			{
				console.log('Result: ', result);
				setRefresh(!refresh);
			});
		}
	}

    const handleSaveTime = async (index: number, recId: number, newTimes: StartEndTimes[]) => 
	{
		// Need to clear any records for this schedule type and day
		await DbCalendar.clearRecords(3, recId)
		.then((result) => 
		{
			console.log('Result from clear records: ', result);
		});

		let stFullDate = newTimes[index]['from'].toLocaleTimeString();
		let stBits = stFullDate.split(":");
		let stHour: number = parseInt(stBits[0]);
		let stMins: number = parseInt(stBits[1]);
		let stTimestamp = (stHour * 3600) + (stMins * 60);
		
		let etFullDate = newTimes[index]['to'].toLocaleTimeString();
		let etBits = etFullDate.split(":");
		let etHour: number = parseInt(etBits[0]);
		let etMins: number = parseInt(etBits[1]);
		let etTimestamp = (etHour * 3600) + (etMins * 60);

		let rollover = 0;
		if (etTimestamp < stTimestamp)
		{
			rollover = 1;
		}
		
		await DbSchedule.setSleepTimes(recId, stTimestamp, etTimestamp, rollover)
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
			const promise = DbCalendar.addRecord(weekNum, index, hourNum, 3, 'Sleep', 'Sleep description', 0, recId, 0);	
			calendarPromises.push(promise);
		}

		for (let i = 0; i < dayTwoHours; i++)
		{
			let hourNum = 0 + i;
			const promise = DbCalendar.addRecord(weekNum, index + 1, hourNum, 3, 'Sleep', 'Sleep description', 0, recId, 0);	
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

    const renderHeader = (section: any, _: any, isActive:boolean) => 
	{
		return (
			<View style={[styles.buttonHeader, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
				<Text style={[ MainStyles.h6, MainStyles.textBold, MainStyles.mb_0, { paddingLeft: 5 }]}>{section}</Text>
				{isActive ? <Image source={openIcon} /> : <Image source={closeIcon} />}
			</View>
		);
	};

	const renderContent = (section: any, index: number, isActive: boolean) => 
	{
		const record = sleepRecords[index];
		
		return (
		<View>
			<View style={MainStyles.formGroupRow}>
				<CheckBox checked={check[index]} onChange={(newValue) =>
					{
						const newCheck = [...check]; 
						const getRecid = [...recordId]; 
						newCheck[index] = newValue; 
						setCheck(newCheck); 
						handleSaveCheck(record.id, newCheck[index] )
					}
				} />
				<Text style={[MainStyles.h6, MainStyles.mb_0, {paddingStart: 10}]}>I sleep on {section}</Text>
			</View>
			{check[index] && (
				<View style={[styles.buttonContainer]}>
					<TouchableOpacity style={[MainStyles.buttonBasic, styles.buttonColor]} onPress={ () => { setCurrentDay(index); setCurrentPicker('from'); setShowPicker(true); } }>
						<Text style={[ MainStyles.h7, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, MainStyles.textSubtle, {textAlign: 'center'}]}>FROM</Text>
						<Text style={[ MainStyles.h2, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, {textAlign: 'center'}]}>{`${times[index].from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[MainStyles.buttonBasic, styles.buttonColor ]} onPress={() => { setCurrentDay(index); setCurrentPicker('to'); setShowPicker(true); }}>
						<Text style={[ MainStyles.h7, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, MainStyles.textSubtle, {textAlign: 'center'}]}>TO</Text>
						<Text style={[ MainStyles.h2, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, {textAlign: 'center'}]}>{`${times[index].to.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
					</TouchableOpacity>
					{showPicker && currentDay === index && (
						<DateTimePicker
						// value={times[currentDay][currentPicker]}
						value={currentPicker === 'from' || currentPicker === 'to' ? times[currentDay][currentPicker] : new Date()}
						mode="time"
						is24Hour={true}
						display="default"
						onChange={(event, selectedDate) => {
							const newTimes = [...times];
							const getRecid = [...recordId]; 
							// newTimes[currentDay][currentPicker] = selectedDate || times[currentDay][currentPicker];
							if (currentPicker === 'from' || currentPicker === 'to') 
							{
								newTimes[currentDay][currentPicker] = selectedDate || times[currentDay][currentPicker];
							}
							setTimes(newTimes);
							setShowPicker(false);
							handleSaveTime(index, getRecid[index], newTimes)
						}}
						/>
					)}
				</View>
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
		props.navigation.navigate('OneEatingSchedule')
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
					<Text style={[ MainStyles.h2, MainStyles.textSerif, MainStyles.textLeft]}>Let us know your typical sleep schedule:</Text>
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

export default OneSleepSchedule;