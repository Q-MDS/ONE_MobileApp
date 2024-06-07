import React, { useEffect, useState } from 'react';
import DBSettings from '../../services/DBSettings';
import DbSchedule from '../../services/DbSchedule';
import DbCalendar from '../../services/DbCalendar';
import Accordion from 'react-native-collapsible/Accordion';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackButton from '../../components/BackButton/BackButton';
import MainStyles from '../../assets/MainStyles';
import { StyleSheet, ImageBackground, View, TouchableOpacity, Image, Text } from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
import { CheckBox } from '@ui-kitten/components';
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

type ClassRecord = {
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
fromTime.setHours(9, 0, 0, 0);
const toTime = new Date();
toTime.setHours(14, 0, 0, 0);
const defaultTimes = daysOfWeek.map(() => ({ from: new Date(fromTime), to: new Date(toTime) }));

const OneClassSchedule = ( props: any ) => 
{
    const [refresh, setRefresh] = useState(false);
    const [check, setCheck] = useState([false, false, false, false, false, false, false]);
    const [activeSections, setActiveSections] = useState<number[]>([]);
    const [showPicker, setShowPicker] = useState(false);
    const [times, setTimes] = useState(defaultTimes);
    const [currentDay, setCurrentDay] = useState<number | null>(0);
    const [currentPicker, setCurrentPicker] = useState<string>("");
    const [recordId, setRecordId] = useState<number[]>([]);
    
	const [weekNum, setWeekNum] = useState(0);
	const [classRecords, setClassRecords] = useState<ClassRecord[]>([]);
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
		await DbSchedule.getClassRecords()
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
			
			setClassRecords(data);
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

			for (let i = 0; i < classRecords.length; i++) 
			{
				// Get record id
				let id = classRecords[i].id;
				recIds.push(id);

				// Get active status
				let active = classRecords[i].active;
				if (active === 0)
				{
					activeChecks.push(false);
				} 
				else 
				{
					activeChecks.push(true);
				}

				// Get start and end times
				let getSt = classRecords[i].startTime;
				let cnvSt = convertSecondsToHours(getSt);
				const fromTime = new Date();
				fromTime.setHours(cnvSt[0], cnvSt[1], 0, 0);

				let getEt = classRecords[i].endTime;
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

	const handleSaveCheck = async (recId: number, isChecked: boolean) => 
	{
		let active = 0;
		if (isChecked) { active = 1; }

		await DbSchedule.setClassActive(recId, active)
		.then((result) => 
		{
			console.log('Result: ', result);
			setRefresh(!refresh);
		});

		// If user unchecked the day then any records in calendar must be removed
		if (active === 0)
		{
			await DbCalendar.clearRecords(2, recId)
			.then((result) => 
			{
				console.log('Result from clear records: ', result);
			});
			await DbSchedule.setClassTimes(recId, 0, 0, 1)
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
		await DbCalendar.clearRecords(2, recId)
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
		
		await DbSchedule.setClassTimes(recId, stTimestamp, etTimestamp, rollover)
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
			const promise = DbCalendar.addRecord(weekNum, index, hourNum, 2, 'Class', 'Class description', 0, recId, 0);	
			calendarPromises.push(promise);
		}

		for (let i = 0; i < dayTwoHours; i++)
		{
			let hourNum = 0 + i;
			const promise = DbCalendar.addRecord(weekNum, index + 1, hourNum, 2, 'Class', 'Class description', 0, recId, 0);	
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

    const renderHeader = (section: any, _:any, isActive: any) => 
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
		const record = classRecords[index];
		
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
				<Text style={[MainStyles.h6, MainStyles.mb_0, {paddingStart: 10}]}>I have class on a {section}</Text>
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

	const handleNext = () => 
	{
		props.navigation.navigate('OneSleepSchedule')
	};

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={MainStyles.container}>
                <BackButton/>
                <Text style={[ MainStyles.h2, MainStyles.textSerif, MainStyles.textLeft]}>Let us know your typical class schedule:</Text>
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

export default OneClassSchedule;