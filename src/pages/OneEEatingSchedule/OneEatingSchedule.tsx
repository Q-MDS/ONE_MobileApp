import React, { useEffect, useState } from 'react';
import DBSettings from '../../services/DBSettings';
import DbSchedule from '../../services/DbSchedule';
import DbCalendar from '../../services/DbCalendar';
import Accordion from 'react-native-collapsible/Accordion';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackButton from '../../components/BackButton/BackButton';
import MainStyles from '../../assets/MainStyles';
import { StyleSheet, ImageBackground, View, TouchableOpacity, Image, Text, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import backgroundImage from '../../assets/images/app_bg_sky.png';
import openIcon from '../../assets/images/icon_open.png';
import closeIcon from '../../assets/images/icon_close.png';

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
    breakfast_active: number;
    breakfast_start: number;
    breakfast_end: number;
    breakfast_roll_over: number;
    lunch_active: number;
    lunch_start: number;
    lunch_end: number;
    lunch_roll_over: number;
    dinner_active: number;
    dinner_start: number;
    dinner_end: number;
    dinner_roll_over: number;
}

interface StartEndTimes 
{
    from: Date;
    to: Date;
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Code below is to setup default times. New process skips this...
const fromTime = new Date();
fromTime.setHours(0, 0, 0, 0);
const toTime = new Date();
toTime.setHours(0, 0, 0, 0);
const defaultTimes = daysOfWeek.map(() => ({ from: new Date(fromTime), to: new Date(toTime) }));


const OneEatSchedule = ( props: any ) => 
{
    const [refresh, setRefresh] = useState(false);
    const [breakfastChecks, setBreakfastChecks] = useState([false, false, false, false, false, false, false]);
    const [breakfastRecIds, setBreakfastRecIds] = useState([]);
    const [breakfastTimes, setBreakfastTimes] = useState(defaultTimes);
    const [showBreakfastPicker, setShowBreakfastPicker] = useState(false);
    const [currentBreakfastPicker, setCurrentBreakfastPicker] = useState(null);

    const [lunchChecks, setLunchChecks] = useState([false, false, false, false, false, false, false]);
    const [lunchRecIds, setLunchRecIds] = useState([]);
    const [lunchTimes, setLunchTimes] = useState(defaultTimes);
    const [showLunchPicker, setShowLunchPicker] = useState(false);
    const [currentLunchPicker, setCurrentLunchPicker] = useState(null);

    const [dinnerChecks, setDinnerChecks] = useState([false, false, false, false, false, false, false]);
    const [dinnerRecIds, setDinnerRecIds] = useState([]);
    const [dinnerTimes, setDinnerTimes] = useState(defaultTimes);
    const [showDinnerPicker, setShowDinnerPicker] = useState(false);
    const [currentDinnerPicker, setCurrentDinnerPicker] = useState(null);

    const [check, setCheck] = useState([true, true, true, true, true, true, true]); //Delete afterwards
    const [activeSections, setActiveSections] = useState([]);
    const [currentDay, setCurrentDay] = useState(null); 
    const [recordId, setRecordId] = useState([]); // del
    const [times, setTimes] = useState(defaultTimes); // del
    const [timeError, setTimeError] = useState([0,0,0,0,0,0,0]);

	const [weekNum, setWeekNum] = useState(0);
	const [eatRecords, setEatRecords] = useState([]);
	const [isReady, setIsReady] = useState(false);

	const getWeekNum = async () => 
	{
		await DBSettings.getWeekNumber()
		.then((result: number) => 
		{
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
		await DbSchedule.getEatRecords()
		.then((records: ResultSet) => 
		{
			const data = [];

			for (let i = 0; i < records.rows.length; i++) 
			{
				let id = records.rows.item(i).id;
				let dayNum = records.rows.item(i).day_num;
				let breakfastActive = records.rows.item(i).breakfast_active;
				let breakfastStart = records.rows.item(i).breakfast_start;
				let breakfastEnd = records.rows.item(i).breakfast_end;
				let breakfastRollOver = records.rows.item(i).breakfast_roll_over;
				let lunchActive = records.rows.item(i).lunch_active;
				let lunchStart = records.rows.item(i).lunch_start;
				let lunchEnd = records.rows.item(i).lunch_end;
				let lunchRollOver = records.rows.item(i).lunch_roll_over;
				let dinnerActive = records.rows.item(i).dinner_active;
				let dinnerStart = records.rows.item(i).dinner_start;
				let dinnerEnd = records.rows.item(i).dinner_end;
				let dinnerRollOver = records.rows.item(i).dinner_roll_over;

				const record = {id, dayNum, breakfastActive, breakfastStart, breakfastEnd, breakfastRollOver, lunchActive, lunchStart, lunchEnd, lunchRollOver, dinnerActive, dinnerStart, dinnerEnd, dinnerRollOver};
				
				data.push(record);
			}
			
			setEatRecords(data);
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
			// let activeChecks: boolean[] = [];
			// let defaultTimes: StartEndTimes[] = [];
			
			let breakfastRecIds: number[] = [];
			let breakfastChecks: boolean[] = [];
			let breakfastTimes: StartEndTimes[] = [];
			let lunchRecIds: number[] = [];
			let lunchChecks: boolean[] = [];
			let lunchTimes: StartEndTimes[] = [];
			let dinnerRecIds: number[] = [];
			let dinnerChecks: boolean[] = [];
			let dinnerTimes: StartEndTimes[] = [];


			for (let i = 0; i < eatRecords.length; i++) 
			{
				// Get record id
				let id = eatRecords[i].id;
				recIds.push(id);

				// Get active status
				let breakfastActive = eatRecords[i].breakfastActive;
				if (breakfastActive === 0)
				{
					breakfastChecks.push(false);
				} 
				else 
				{
					breakfastChecks.push(true);
				}

				let lunchActive = eatRecords[i].lunchActive;
				if (lunchActive === 0)
				{
					lunchChecks.push(false);
				} 
				else 
				{
					lunchChecks.push(true);
				}

				let dinnerActive = eatRecords[i].dinnerActive;
				if (dinnerActive === 0)
				{
					dinnerChecks.push(false);
				} 
				else 
				{
					dinnerChecks.push(true);
				}

				// Get start and end times: Breakfast
				let getBSt = eatRecords[i].breakfastStart;
				let cnvBSt = convertSecondsToHours(getBSt);
				const fromBTime = new Date();
				fromBTime.setHours(cnvBSt[0], cnvBSt[1], 0, 0);

				let getBEt = eatRecords[i].breakfastEnd;
				let cnvBEt = convertSecondsToHours(getBEt);
				const toBTime = new Date();
				toBTime.setHours(cnvBEt[0], cnvBEt[1], 0, 0);

				breakfastTimes.push({ "from": new Date(fromBTime), "to": new Date(toBTime) });

				// Get start and end times: Lunch
				let getLSt = eatRecords[i].lunchStart;
				let cnvLSt = convertSecondsToHours(getLSt);
				const fromLTime = new Date();
				fromLTime.setHours(cnvLSt[0], cnvLSt[1], 0, 0);

				let getLEt = eatRecords[i].lunchEnd;
				let cnvLEt = convertSecondsToHours(getLEt);
				const toLTime = new Date();
				toLTime.setHours(cnvLEt[0], cnvLEt[1], 0, 0);

				lunchTimes.push({ "from": new Date(fromLTime), "to": new Date(toLTime) });

				// Get start and end times: Dinner
				let getDSt = eatRecords[i].dinnerStart;
				let cnvDSt = convertSecondsToHours(getDSt);
				const fromDTime = new Date();
				fromDTime.setHours(cnvDSt[0], cnvDSt[1], 0, 0);

				let getDEt = eatRecords[i].dinnerEnd;
				let cnvDEt = convertSecondsToHours(getDEt);
				const toDTime = new Date();
				toDTime.setHours(cnvDEt[0], cnvDEt[1], 0, 0);

				dinnerTimes.push({ "from": new Date(fromDTime), "to": new Date(toDTime) });
			}

			setRecordId(recIds);
			setBreakfastChecks(breakfastChecks);
			setBreakfastTimes(breakfastTimes);
			setLunchChecks(lunchChecks);
			setLunchTimes(lunchTimes);
			setDinnerChecks(dinnerChecks);
			setDinnerTimes(dinnerTimes);

			// setCheck(activeChecks);
			// setTimes(defaultTimes);
			setIsReady(false);
		}

	}, [isReady]);

    // useEffect(() => 
    // {
    //     // DbSchedule.truncOneSchedule();a
    //     DbCalendar.chkTable(4)
    //     .then((result: any) => 
    //     {
        
    //         let tmpBreakfastChecks: boolean[] = [];
    //         let tmpBreakfastRecIds: number[] = [];
    //         let tmpBreakfastTimes: StartEndTimes[] = [];
    //         let tmpLunchChecks: boolean[] = [];
    //         let tmpLunchRecIds: number[] = [];
    //         let tmpLunchTimes: StartEndTimes[] = [];
    //         let tmpDinnerChecks: boolean[] = [];
    //         let tmpDinnerRecIds: number[] = [];
    //         let tmpDinnerTimes: StartEndTimes[] = [];
            
    //         for (let i = 0; i < result.rows.length; i++)
    //         {
    //             if (result.rows.item(i).activity_type_name === "eat_breakfast")
    //             {
    //                 let breakfastActive = result.rows.item(i).activity_active;
    //                 // Checks
    //                 if (breakfastActive === 0)
    //                 {
    //                     tmpBreakfastChecks.push(false);
    //                 } 
    //                 else 
    //                 {
    //                     tmpBreakfastChecks.push(true);
    //                 }

    //                 // Record ids
    //                 let recId = result.rows.item(i).id;
    //                 tmpBreakfastRecIds.push(recId);

    //                 // Times
    //                 let getSt = result.rows.item(i).activity_start;
    //                 let cnvSt = convertSecondsToHours(getSt);
    //                 const fromTime = new Date();
    //                 fromTime.setHours(cnvSt[0], cnvSt[1], 0, 0);

    //                 let getEt = result.rows.item(i).activity_end;
    //                 let cnvEt = convertSecondsToHours(getEt);
    //                 const toTime = new Date();
    //                 toTime.setHours(cnvEt[0], cnvEt[1], 0, 0);

    //                 tmpBreakfastTimes.push({ "from": new Date(fromTime), "to": new Date(toTime) });
    //             }

    //             if (result.rows.item(i).activity_type_name === "eat_lunch")
    //             {
    //                 let lunchActive = result.rows.item(i).activity_active;
    //                 // Checks
    //                 if (lunchActive === 0)
    //                 {
    //                     tmpLunchChecks.push(false);
    //                 } 
    //                 else 
    //                 {
    //                     tmpLunchChecks.push(true);
    //                 }

    //                 // Record ids
    //                 let recId = result.rows.item(i).id;
    //                 tmpLunchRecIds.push(recId);

    //                 // Times
    //                 let getSt = result.rows.item(i).activity_start;
    //                 let cnvSt = convertSecondsToHours(getSt);
    //                 const fromTime = new Date();
    //                 fromTime.setHours(cnvSt[0], cnvSt[1], 0, 0);

    //                 let getEt = result.rows.item(i).activity_end;
    //                 let cnvEt = convertSecondsToHours(getEt);
    //                 const toTime = new Date();
    //                 toTime.setHours(cnvEt[0], cnvEt[1], 0, 0);

    //                 tmpLunchTimes.push({ "from": new Date(fromTime), "to": new Date(toTime) });
    //             }

    //             if (result.rows.item(i).activity_type_name === "eat_dinner")
    //             {
    //                 let dinnerActive = result.rows.item(i).activity_active;
    //                 // Checks
    //                 if (dinnerActive === 0)
    //                 {
    //                     tmpDinnerChecks.push(false);
    //                 } 
    //                 else 
    //                 {
    //                     tmpDinnerChecks.push(true);
    //                 }

    //                 // Record ids
    //                 let recId = result.rows.item(i).id;
    //                 tmpDinnerRecIds.push(recId);

    //                 // Times
    //                 let getSt = result.rows.item(i).activity_start;
    //                 let cnvSt = convertSecondsToHours(getSt);
    //                 const fromTime = new Date();
    //                 fromTime.setHours(cnvSt[0], cnvSt[1], 0, 0);

    //                 let getEt = result.rows.item(i).activity_end;
    //                 let cnvEt = convertSecondsToHours(getEt);
    //                 const toTime = new Date();
    //                 toTime.setHours(cnvEt[0], cnvEt[1], 0, 0);

    //                 tmpDinnerTimes.push({ "from": new Date(fromTime), "to": new Date(toTime) });
    //             }
    //         }
    //         setBreakfastChecks(tmpBreakfastChecks);
    //         setBreakfastRecIds(tmpBreakfastRecIds);
    //         setBreakfastTimes(tmpBreakfastTimes);
    //         setLunchChecks(tmpLunchChecks);
    //         setLunchRecIds(tmpLunchRecIds);
    //         setLunchTimes(tmpLunchTimes);
    //         setDinnerChecks(tmpDinnerChecks);
    //         setDinnerRecIds(tmpDinnerRecIds);
    //         setDinnerTimes(tmpDinnerTimes);
    //     })
    //     .catch((error) => 
    //     {
    //         // Result: fail
    //     });
    // }, [refresh]);

    const handleSaveBreakfastCheck = async (recId: number, isChecked: boolean) => 
    {
		let active = 0;
		if (isChecked) { active = 1; }

		await DbSchedule.setEatBreakfastActive(recId, active)
		.then((result) => 
		{
			console.log('Result: ', result);
			setRefresh(!refresh);
		});

		// If user unchecked the day then any records in calendar must be removed
		if (active === 0)
		{
			await DbCalendar.clearBreakfastRecords(4, recId)
			.then((result) => 
			{
				console.log('Result from clear records: ', result);
			});
			await DbSchedule.setEatBreakfastTimes(recId, 0, 0, 1)
			.then((result) => 
			{
				console.log('Result: ', result);
				setRefresh(!refresh);
			});
		}
    }

    const handleSaveLunchCheck = async (recId: number, isChecked: boolean) => 
    {
		let active = 0;
		if (isChecked) { active = 1; }

		await DbSchedule.setEatLunchActive(recId, active)
		.then((result) => 
		{
			console.log('Result: ', result);
			setRefresh(!refresh);
		});

		// If user unchecked the day then any records in calendar must be removed
		if (active === 0)
		{
			await DbCalendar.clearLunchRecords(4, recId)
			.then((result) => 
			{
				console.log('Result from clear records: ', result);
			});
			await DbSchedule.setEatLunchTimes(recId, 0, 0, 1)
			.then((result) => 
			{
				console.log('Result: ', result);
				setRefresh(!refresh);
			});
		}
    }

    const handleSaveDinnerCheck = async (recId: number, isChecked: boolean) => 
    {
		let active = 0;
		if (isChecked) { active = 1; }

		await DbSchedule.setEatDinnerActive(recId, active)
		.then((result) => 
		{
			console.log('Result: ', result);
			setRefresh(!refresh);
		});

		// If user unchecked the day then any records in calendar must be removed
		if (active === 0)
		{
			await DbCalendar.clearDinnerRecords(4, recId)
			.then((result) => 
			{
				console.log('Result from clear records: ', result);
			});
			await DbSchedule.setEatDinnerTimes(recId, 0, 0, 1)
			.then((result) => 
			{
				console.log('Result: ', result);
				setRefresh(!refresh);
			});
		}
    }

    const handleSaveBreakfastTime = async (index: number, recId: number, newTimes: StartEndTimes[]) => 
    {
        // Need to clear any records for this schedule type and day
		await DbCalendar.clearBreakfastRecords(4, recId)
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
		console.log('Data: ', recId, stTimestamp, etTimestamp);
		await DbSchedule.setEatBreakfastTimes(recId, stTimestamp, etTimestamp, rollover)
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
			totHours = Math.ceil(diff / 3600);
			dayOneHours = totHours;
		} 
		else 
		{
			diff = (86400 - stTimestamp) + etTimestamp;
			totHours = Math.ceil(diff / 3600);
			dayOneHours = (86400 - stTimestamp) / 3600;
			dayTwoHours = totHours - dayOneHours;
		}

		for (let i = 0; i < dayOneHours; i++)
		{
			let hourNum = stHour + i;
			const promise = DbCalendar.addRecord(weekNum, index, hourNum, 4, 'Eat', 'Breakfast', 0, recId, 0);	
			calendarPromises.push(promise);
		}

		for (let i = 0; i < dayTwoHours; i++)
		{
			let hourNum = 0 + i;
			const promise = DbCalendar.addRecord(weekNum, index + 1, hourNum, 4, 'Eat', 'Breakfast', 0, recId, 0);	
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
		
		console.log('Week num: ', diff, " >>> ", totHours, " >>> ", dayOneHours, " >>> ", dayTwoHours, " >>> ", stHour);
    }

    const handleSaveLunchTime = async (index: number, recId: number, newTimes: StartEndTimes[]) => 
    {
        // Need to clear any records for this schedule type and day
		await DbCalendar.clearLunchRecords(4, recId)
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
		
		await DbSchedule.setEatLunchTimes(recId, stTimestamp, etTimestamp, rollover)
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
			const promise = DbCalendar.addRecord(weekNum, index, hourNum, 4, 'Eat', 'Lunch', 0, recId, 0);	
			calendarPromises.push(promise);
		}

		for (let i = 0; i < dayTwoHours; i++)
		{
			let hourNum = 0 + i;
			const promise = DbCalendar.addRecord(weekNum, index + 1, hourNum, 4, 'Eat', 'Lunch', 0, recId, 0);	
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

    const handleSaveDinnerTime = async (index: number, recId: number, newTimes: StartEndTimes[]) => 
    {
        // Need to clear any records for this schedule type and day
		await DbCalendar.clearDinnerRecords(4, recId)
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
		
		await DbSchedule.setEatDinnerTimes(recId, stTimestamp, etTimestamp, rollover)
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
			const promise = DbCalendar.addRecord(weekNum, index, hourNum, 4, 'Eat', 'Dinner', 0, recId, 0);	
			calendarPromises.push(promise);
		}

		for (let i = 0; i < dayTwoHours; i++)
		{
			let hourNum = 0 + i;
			const promise = DbCalendar.addRecord(weekNum, index + 1, hourNum, 4, 'Eat', 'Dinner', 0, recId, 0);	
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

    const renderHeader = (section, _, isActive) => 
	{
		return (
			<View style={[styles.buttonHeader, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
				<Text style={[ MainStyles.textBold, { paddingLeft: 5 }]}>{section}</Text>
				{isActive ? <Image source={openIcon} /> : <Image source={closeIcon} />}
			</View>
		);
	};

    const renderContent = (section, index, isActive) => 
    {
		const record = eatRecords[index];
		
		return (
            <View>
                {/* Breakfast */}
                <View style={MainStyles.formGroupRow}>
                    <CheckBox value={breakfastChecks[index]} onValueChange={(newValue) => 
					{ 
						const newCheck = [...breakfastChecks]; 
						const getRecid = [...breakfastRecIds]; 
						newCheck[index] = newValue; 
						setBreakfastChecks(newCheck); 
						handleSaveBreakfastCheck(record.id, newCheck[index] )
					}} />
                    <Text>I eat breakfast</Text>
                </View>
				{breakfastChecks[index] && (
					<View style={[styles.buttonContainer]}>
						<TouchableOpacity style={[MainStyles.buttonBasic, styles.buttonColor]} onPress={ () => { setCurrentDay(index); setCurrentBreakfastPicker('from'); setShowBreakfastPicker(true); } }>
							<Text style={[ MainStyles.h6, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, MainStyles.textSubtle, {textAlign: 'center'}]}>FROM</Text>
							<Text style={[ MainStyles.h2, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, {textAlign: 'center'}]}>{`${breakfastTimes[index].from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[MainStyles.buttonBasic, styles.buttonColor ]} onPress={() => { setCurrentDay(index); setCurrentBreakfastPicker('to'); setShowBreakfastPicker(true); }}>
							<Text style={[ MainStyles.h6, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, MainStyles.textSubtle, {textAlign: 'center'}]}>TO</Text>
							<Text style={[ MainStyles.h2, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, {textAlign: 'center'}]}>{`${breakfastTimes[index].to.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
						</TouchableOpacity>
						{showBreakfastPicker && currentDay === index && (
							<DateTimePicker
							value={breakfastTimes[currentDay][currentBreakfastPicker]}
							mode="time"
							is24Hour={true}
							display="default"
							onChange={(event, selectedDate) => {
								const newTimes = [...breakfastTimes];
								const getRecid = [...recordId]; 
								newTimes[currentDay][currentBreakfastPicker] = selectedDate || breakfastTimes[currentDay][currentBreakfastPicker];
								setBreakfastTimes(newTimes);
								setShowBreakfastPicker(false);
								handleSaveBreakfastTime(index, getRecid[index], newTimes)
							}}
							/>
						)}
					</View>
				)}

                {/* Lunch */}
                <View style={MainStyles.formGroupRow}>
                    <CheckBox value={lunchChecks[index]} onValueChange={(newValue) => 
					{ 
						const newCheck = [...lunchChecks]; 
						// const getRecid = [...lunchRecIds]; 
						newCheck[index] = newValue; 
						setLunchChecks(newCheck); 
						handleSaveLunchCheck(record.id, newCheck[index] )
					}} />
                    <Text>I eat lunch</Text>
                </View>
				{lunchChecks[index] && (
					<View style={[styles.buttonContainer]}>
						<TouchableOpacity style={[MainStyles.buttonBasic, styles.buttonColor]} onPress={ () => { setCurrentDay(index); setCurrentLunchPicker('from'); setShowLunchPicker(true); } }>
							<Text style={[ MainStyles.h6, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, MainStyles.textSubtle, {textAlign: 'center'}]}>FROM</Text>
							<Text style={[ MainStyles.h2, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, {textAlign: 'center'}]}>{`${lunchTimes[index].from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[MainStyles.buttonBasic, styles.buttonColor ]} onPress={() => { setCurrentDay(index); setCurrentLunchPicker('to'); setShowLunchPicker(true); }}>
							<Text style={[ MainStyles.h6, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, MainStyles.textSubtle, {textAlign: 'center'}]}>TO</Text>
							<Text style={[ MainStyles.h2, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, {textAlign: 'center'}]}>{`${lunchTimes[index].to.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
						</TouchableOpacity>
						{showLunchPicker && currentDay === index && (
							<DateTimePicker
							value={lunchTimes[currentDay][currentLunchPicker]}
							mode="time"
							is24Hour={true}
							display="default"
							onChange={(event, selectedDate) => {
								const newTimes = [...lunchTimes];
								const getRecid = [...recordId]; 
								newTimes[currentDay][currentLunchPicker] = selectedDate || lunchTimes[currentDay][currentLunchPicker];
								setLunchTimes(newTimes);
								setShowLunchPicker(false);
								handleSaveLunchTime(index, getRecid[index], newTimes)
							}}
							/>
						)}
					</View>
				)}
				{/* Dinner */}
                <View style={MainStyles.formGroupRow}>
                    <CheckBox value={dinnerChecks[index]} onValueChange={(newValue) => 
					{ 
						const newCheck = [...dinnerChecks]; 
						// const getRecid = [...dinnerRecIds]; 
						newCheck[index] = newValue; 
						setDinnerChecks(newCheck); 
						handleSaveDinnerCheck(record.id, newCheck[index] )
					}} />
                    <Text>I eat dinner</Text>
                </View>
				{dinnerChecks[index] && (
					<View style={[styles.buttonContainer, MainStyles.bb]}>
						<TouchableOpacity style={[MainStyles.buttonBasic, styles.buttonColor]} onPress={ () => { setCurrentDay(index); setCurrentDinnerPicker('from'); setShowDinnerPicker(true); } }>
							<Text style={[ MainStyles.h6, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, MainStyles.textSubtle, {textAlign: 'center'}]}>FROM</Text>
							<Text style={[ MainStyles.h2, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, {textAlign: 'center'}]}>{`${dinnerTimes[index].from.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[MainStyles.buttonBasic, styles.buttonColor ]} onPress={() => { setCurrentDay(index); setCurrentDinnerPicker('to'); setShowDinnerPicker(true); }}>
							<Text style={[ MainStyles.h6, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, MainStyles.textSubtle, {textAlign: 'center'}]}>TO</Text>
							<Text style={[ MainStyles.h2, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_0, {textAlign: 'center'}]}>{`${dinnerTimes[index].to.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
						</TouchableOpacity>
						{showDinnerPicker && currentDay === index && (
							<DateTimePicker
							value={dinnerTimes[currentDay][currentDinnerPicker]}
							mode="time"
							is24Hour={true}
							display="default"
							onChange={(event, selectedDate) => {
								const newTimes = [...dinnerTimes];
								const getRecid = [...recordId]; 
								newTimes[currentDay][currentDinnerPicker] = selectedDate || dinnerTimes[currentDay][currentDinnerPicker];
								setDinnerTimes(newTimes);
								setShowDinnerPicker(false);
								handleSaveDinnerTime(index, getRecid[index], newTimes)
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

	const handleNext = () => 
	{
		props.navigation.navigate('OnePrepSchedule');
	};

	return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={MainStyles.container}>
                <BackButton/>
                <Text style={[ MainStyles.h2, MainStyles.textSerif, MainStyles.textLeft]}>Let us know your typical eating schedule:</Text>
                <View style={ [MainStyles.w_100, MainStyles.bb]}>
                    <Accordion
                        sections={daysOfWeek}
                        activeSections={activeSections}
                        renderHeader={renderHeader}
                        renderContent={renderContent}
                        onChange={setActiveSections}
                        touchableProps={{ underlayColor: '#00000040' }}  />
                </View>
                <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={ handleNext }>
                    <Text style={MainStyles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
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

export default OneEatSchedule;