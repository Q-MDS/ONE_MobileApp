import React, { useState, useEffect, useContext } from 'react';
import DBSettings from '../../services/DBSettings';
import DbNotification from '../../services/DbNotification';
import DbAccountability from '../../services/DbAccountabilty';
import DbSchedule from '../../services/DbSchedule';
import DbAllocate from '../../services/DbAllocate';
import DbVerify from '../../services/DbVerify';
import DateUtils from '../../services/DateUtils';
import moment from 'moment';
import MainStyles from '../../assets/MainStyles';
import { SafeAreaView, ScrollView, ImageBackground, View, Text, TouchableOpacity, ActivityIndicator, Switch, Image } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_mountains.png';
import { Card, Icon } from '@ui-kitten/components';

const SetupStart = (props:any) =>
{
	console.log('Props: ', props.route.params.from);
	const [from, setFrom] = useState('');
	const [saMode, setSAMode] = useState(0);
	const [setupDone, setSetupDone] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [reminders, setReminders] = useState<boolean[]>([]);
	const [swWork, setSwWork] = useState(false);
	const [swClass, setSwClass] = useState(false);
	const [swSleep, setSwSleep] = useState(false);
	const [swEat, setSwEat] = useState(false);
	const [swPrep, setSwPrep] = useState(false);
	const [swCommute, setSwCommute] = useState(false);
	const [swPhy, setSwPhy] = useState(true);
	const [swEmo, setSwEmo] = useState(true);
	const [swMen, setSwMen] = useState(true);
	const [swSpi, setSwSpi] = useState(true);
	const [isEnabled, setIsEnabled] = useState(false);
	const toggleWork = () => { setSwWork(previousState => !previousState); toggleReminder(0); }
	const toggleClass = () => { setSwClass(previousState => !previousState); toggleReminder(1); }
	const toggleSleep = () => {setSwSleep(previousState => !previousState); toggleReminder(2); }
	const toggleEat = () => { setSwEat(previousState => !previousState); toggleReminder(3); }
	const togglePrep = () => { setSwPrep(previousState => !previousState); toggleReminder(4); }
	const toggleCommute = () => { setSwCommute(previousState => !previousState); toggleReminder(5); }
	const togglePhy = () => { setSwPhy(previousState => !previousState); toggleReminder(6); }
	const toggleEmo = () => { setSwEmo(previousState => !previousState); toggleReminder(7); }
	const toggleMen = () => { setSwMen(previousState => !previousState); toggleReminder(8); }
	const toggleSpi = () => { setSwSpi(previousState => !previousState); toggleReminder(9); }
	const [weekNum, setWeekNum] = useState(0);
	const [dayNum, setDayNum] = useState(0);
	const workPromises: Promise<any>[] = [];
	const classPromises: Promise<any>[] = [];
	const sleepPromises: Promise<any>[] = [];
	const eatingPromises: Promise<any>[] = [];
	const preparePromises: Promise<any>[] = [];
	const commutePromises: Promise<any>[] = [];
	const physicalPromises: Promise<any>[] = [];
	const emotionalPromises: Promise<any>[] = [];
	const mentalPromises: Promise<any>[] = [];
	const spiritualPromises: Promise<any>[] = [];

	const toggleReminder = (index: number) => 
	{
		setReminders(prevReminders => 
		{
		  const newReminders = [...prevReminders];
		  newReminders[index] = !newReminders[index];
		  return newReminders;
		});
	};

	useEffect(() => 
	{
		const fromPage = props.route.params.from;
		setFrom(fromPage);
		DBSettings.getSAMode()
		.then((value: unknown) => 
		{
			setSAMode(value as number);
		})
		.catch((error: Error) => 
		{
			console.log('Error getting week number', error);
		});

		DBSettings.getReminders()
		.then((value: unknown) => 
		{
			const array = JSON.parse(value as string);
			setReminders(array);
		})
		.catch((error: Error) => 
		{
			console.log('Error getting week number', error);
		});

		const currentWeekNumber = DateUtils.getCurrentWeekNumber();
		const currentDayOfWeek = DateUtils.getCurrentDayOfWeek();

		setWeekNum(currentWeekNumber);
		setDayNum(currentDayOfWeek);
	}, []);

	useEffect(() =>
	{
		if (reminders.length > 0)
		{
			setSwWork(reminders[0]);
			setSwClass(reminders[1]);
			setSwSleep(reminders[2]);
			setSwEat(reminders[3]);
			setSwPrep(reminders[4]);
			setSwCommute(reminders[5]);
			setSwPhy(reminders[6]);
			setSwEmo(reminders[7]);
			setSwMen(reminders[8]);
			setSwSpi(reminders[9]);
		}
	}, [reminders]);

	useEffect(() => 
	{
		const jsonString = JSON.stringify(reminders);
		DBSettings.setReminders(jsonString);
	  }, [reminders]);

	const handleStart = async () =>
	{
		console.log('SAMode: ', saMode);
		if (saMode === 0)
		{
			// Edit mode
			// Just go to OneWorkSchedule
			props.navigation.navigate('OneWorkSchedule');
		}
		else 
		{
			// New mode
			// Clear all records and create defaults
			// When done set SAMode to 0
			setupDiary();
		}
	}
	
	const setupDiary = async () => 
	{
		setIsLoading(true);
		// await DbCalendar.truncCalendar();

		await DBSettings.setDiaryMode(0);
		await DBSettings.setWeekNumber(weekNum);
		await DBSettings.setStartDay(dayNum);
		await DbNotification.truncTable();

		await addWorkRecords();
		await addClassRecords();
		await addSleepRecords();
		await addEatingrecords();
		await addPrepareRecords();
		await addCommuteRecords();
		await addAllocatePhysical();
		await addAllocateEmotional();
		await addAllocateMental();
		await addAllocateSpiritual();

		// Do verify and acc & noti records add here
		const timesOne = [32400, 36000, 39600, 43200, 46800, 50400];
		const timesTwo = [61200, 64800, 68400, 72000];
		let createDate = moment().unix();

		for (let i = 0; i < 7; i++)
		{
			// Get time 1 and time 2
			const r1 = Math.floor(Math.random() * timesOne.length);
			const randomOne = timesOne[r1];
			const r2 = Math.floor(Math.random() * timesTwo.length);
			const randomTwo = timesOne[r2];
			
			// Accountability
			await DbNotification.addRecord(createDate, weekNum, i, 4, 'Accountability Time!', 'Time to boost your accountability score', randomOne, 1, 0).then((value: unknown) => 
			{
				console.log('Notification: accountability 1 - added');
				const notiId = value as number;
				DbAccountability.addMasterRecord(notiId, 0, 0, 0, 0, weekNum, i, 0, 0).then(() => console.log('Done?'));
			})
			.catch((error) => 
			{
				console.log('Error adding record', error);
			});
			await DbNotification.addRecord(createDate, weekNum, i, 4, 'Accountability Time!', 'Time to boost your accountability score', randomTwo, 1, 0).then((value: unknown) => 
			{
				console.log('Notification: accountability 2 - Record added');
				const notiId = value as number;
				DbAccountability.addMasterRecord(notiId, 0, 0, 0, 0, weekNum, i, 0, 0).then(() => console.log('Done?'));
			})
			.catch((error) => 
			{
				console.log('Error adding record', error);
			});

			// Verify Noti
			await DbNotification.addRecord(createDate, weekNum, i, 3, 'Verification Time!', 'Check-off your completed daily activities', 64800, 1, 0).then((value: unknown) => 
			{
				// Verify Master
				const notiId = value as number;
				console.log('Verify notification - Record added', notiId);
				DbVerify.addMasterRecord(notiId, 0, 0, 0, 0, weekNum, i, 0, 0).then(() => console.log('Done?'));

			})
			.catch((error) => 
			{
				console.log('Error adding record', error);
			});
		}
	
		setIsLoading(false);
		setSetupDone(true);
		setFrom('MainScreen');
	}

	const addWorkRecords = async () => 
	{
		const truncPromise = DbSchedule.truncWorkSchedule();
		workPromises.push(truncPromise);

		for (let i = 0; i < 7; i++)
		{
			const promise = DbSchedule.initWorkSchedule(i, 0, 0, 0, 0);	
			workPromises.push(promise);
		}

		try 
		{
			await Promise.all(workPromises);
			console.log('All work records added successfully');
		} 
		catch (error) 
		{
			console.log('An error occurred while adding records:', error);
		}
	}

	const addClassRecords = async () => 
	{
		const truncPromise = DbSchedule.truncClassSchedule();
		classPromises.push(truncPromise);

		for (let i = 0; i < 7; i++)
		{
			const promise = DbSchedule.initClassSchedule(i, 0, 0, 0, 0);	
			classPromises.push(promise);
		}

		try 
		{
			await Promise.all(classPromises);
			console.log('All class records added successfully');
		} 
		catch (error) 
		{
			console.log('An error occurred while adding records:', error);
		}
	}

	const addSleepRecords = async () => 
	{
		const truncPromise = DbSchedule.truncSleepSchedule();
		sleepPromises.push(truncPromise);

		for (let i = 0; i < 7; i++)
		{
			const promise = DbSchedule.initSleepSchedule(i, 0, 0, 0, 0);	
			sleepPromises.push(promise);
		}

		try 
		{
			await Promise.all(sleepPromises);
			console.log('All sleep records added successfully');
		} 
		catch (error) 
		{
			console.log('An error occurred while adding records:', error);
		}
	}

	const addEatingrecords = async () => 
	{
		const truncPromise = DbSchedule.truncEatSchedule();
		eatingPromises.push(truncPromise);

		for (let i = 0; i < 7; i++)
		{
			const promise = DbSchedule.initEatSchedule(i, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);	
			eatingPromises.push(promise);
		}

		try 
		{
			await Promise.all(eatingPromises);
			console.log('All eating records added successfully');
		} 
		catch (error) 
		{
			console.log('An error occurred while adding records:', error);
		}
	}

	const addPrepareRecords = async () => 
	{
		const truncPromise = DbSchedule.truncPrepareSchedule();
		preparePromises.push(truncPromise);

		for (let i = 0; i < 7; i++)
		{
			const promise = DbSchedule.initPrepareSchedule(i, 0, 0, 0, 0);	
			preparePromises.push(promise);
		}

		try 
		{
			await Promise.all(preparePromises);
			console.log('All prepare records added successfully');
		} 
		catch (error) 
		{
			console.log('An error occurred while adding records:', error);
		}

	}

	const addCommuteRecords = async () => 
	{
		const truncPromise = DbSchedule.truncCommuteSchedule();
		commutePromises.push(truncPromise);

		for (let i = 0; i < 7; i++)
		{
			const promise = DbSchedule.initCommuteSchedule(i, 0, 0, 0, 0);	
			commutePromises.push(promise);
		}

		try 
		{
			await Promise.all(commutePromises);
			console.log('All commute records added successfully');
		} 
		catch (error) 
		{
			console.log('An error occurred while adding records:', error);
		}
	}

	const addAllocatePhysical = async () => 
	{
		const truncPhysical = DbAllocate.truncAllocatePhysical();
		physicalPromises.push(truncPhysical);

		const sports = DbAllocate.addPhysicalRecord("Sports", "", 0);	
		physicalPromises.push(sports);
		const workout = DbAllocate.addPhysicalRecord("Workout", "", 0);	
		physicalPromises.push(workout);
		const cardio = DbAllocate.addPhysicalRecord("Cardio", "", 0);	
		physicalPromises.push(cardio);
		const other = DbAllocate.addPhysicalRecord("Other", "", 0);	
		physicalPromises.push(other);

		try 
		{
			await Promise.all(physicalPromises);
			console.log('All physical records added successfully');
		} 
		catch (error) 
		{
			console.log('An error occurred while adding records:', error);
		}
	}

	const addAllocateEmotional = async () => 
	{
		const truncEmotional = DbAllocate.truncAllocateEmotional();
		emotionalPromises.push(truncEmotional);

		const sports = DbAllocate.addEmotionalRecord("Significant other time", "", 0);	
		emotionalPromises.push(sports);
		const family = DbAllocate.addEmotionalRecord("Family time", "", 0);	
		emotionalPromises.push(family);
		const music = DbAllocate.addEmotionalRecord("Music", "", 0);	
		emotionalPromises.push(music);
		const social = DbAllocate.addEmotionalRecord("Social event", "", 0);	
		emotionalPromises.push(social);
		const dancing = DbAllocate.addEmotionalRecord("Dancing", "", 0);	
		emotionalPromises.push(dancing);
		const team = DbAllocate.addEmotionalRecord("Team building event", "", 0);	
		emotionalPromises.push(team);
		const friends = DbAllocate.addEmotionalRecord("Friends gathering", "", 0);	
		emotionalPromises.push(friends);
		const night = DbAllocate.addEmotionalRecord("Night out", "", 0);	
		emotionalPromises.push(night);
		const dateNight = DbAllocate.addEmotionalRecord("Date night", "", 0);	
		emotionalPromises.push(dateNight);
		const gameNight = DbAllocate.addEmotionalRecord("Game night", "", 0);	
		emotionalPromises.push(gameNight);
		const other = DbAllocate.addEmotionalRecord("Other", "", 0);	
		emotionalPromises.push(other);

		try 
		{
			await Promise.all(emotionalPromises);
			console.log('All emotional records added successfully');
		} 
		catch (error) 
		{
			console.log('An error occurred while adding records:', error);
		}
	}

	const addAllocateMental = async () => 
	{
		const truncMental = DbAllocate.truncAllocateMental();
		mentalPromises.push(truncMental);

		const reading = DbAllocate.addMentalRecord("Reading", "", 0);	
		mentalPromises.push(reading);
		const studying = DbAllocate.addMentalRecord("Studying", "", 0);	
		mentalPromises.push(studying);
		const learning = DbAllocate.addMentalRecord("Learning", "", 0);	
		mentalPromises.push(learning);
		const other = DbAllocate.addMentalRecord("Other", "", 0);	
		mentalPromises.push(other);

		try 
		{
			await Promise.all(mentalPromises);
			console.log('All mental records added successfully');
		} 
		catch (error) 
		{
			console.log('An error occurred while adding records:', error);
		}
	}

	const addAllocateSpiritual = async () => 
	{
		const truncSpiritual = DbAllocate.truncAllocateSpiritual();
		spiritualPromises.push(truncSpiritual);

		const yoga = DbAllocate.addSpiritualRecord("Yoga", "", 0);	
		spiritualPromises.push(yoga);
		const meditation = DbAllocate.addSpiritualRecord("Meditation", "", 0);	
		spiritualPromises.push(meditation);
		const praying = DbAllocate.addSpiritualRecord("Praying", "", 0);	
		spiritualPromises.push(praying);
		const religious = DbAllocate.addSpiritualRecord("Religious Practice", "", 0);	
		spiritualPromises.push(religious);
		const other = DbAllocate.addSpiritualRecord("Other", "", 0);	
		spiritualPromises.push(other);

		try 
		{
			await Promise.all(spiritualPromises);
			console.log('All spiritual records added successfully');
		} 
		catch (error) 
		{
			console.log('An error occurred while adding records:', error);
		}
	}

	useEffect(() => 
	{
		if (setupDone)
		{
			DBSettings.setSAMode(0)
			.then((value: unknown) => 
			{
				setSAMode(0);
				props.navigation.navigate('OneWorkSchedule');
			})
			.catch((error: Error) => 
			{
				console.log('Error getting week number', error);
			});
		}
	}, [setupDone]);

	const handleClose = () =>
	{
		console.log('SAMode: ', saMode, ' from ', from);
		if (from === 'StartWeek')
		{
			props.navigation.navigate('StartWeek');
		}
		else if(from === 'MainScreen')
		{
			props.navigation.navigate('MainScreen');
		}
		//props.navigation.navigate('MainScreen');
	}

	const handleWork = () => 
	{
		// console.log('Reminders: ', reminders);
		props.navigation.navigate('OneWorkSchedule');
	}

	const handleClass = () => 
	{
		props.navigation.navigate('OneClassSchedule');
	}

	const handleSleep = () => 
	{
		props.navigation.navigate('OneSleepSchedule');
	}

	const handleEat = () => 
	{
		props.navigation.navigate('OneEatingSchedule');
	}

	const handlePrepare = () => 
	{
		props.navigation.navigate('OnePrepSchedule');
	}

	const handleCommute = () => 
	{
		props.navigation.navigate('OneCommuteSchedule');
	}

	const handlePhysical = () => 
	{
		props.navigation.navigate('OneSetPhysical');
	}

	const handleEmotional = () => 
	{
		props.navigation.navigate('OneSetEmotional');
	}

	const handleMental = () => 
	{
		props.navigation.navigate('OneSetMental');
	}

	const handleSpiritual = () => 
	{
		props.navigation.navigate('OneSetSpiritual');
	}

	if (isLoading) 
	{
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}
	
	
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
			<View style={MainStyles.container} >
				<View style={{marginTop: 30, marginBottom:20, width: '100%', flex: 1}}>
					<Text style={[ MainStyles.h1, MainStyles.textSerif, MainStyles.mb_2]}>Plan ONE: Setup</Text>
					<Text style={ [MainStyles.h4, { paddingStart:20, paddingEnd: 20}]}>It's time to plan your week's schedule.</Text>

					<TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_2, MainStyles.w_100]} onPress={handleStart}>
						<Text style={MainStyles.buttonText}>Start</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[MainStyles.button_secondary, MainStyles.mt_2, MainStyles.w_100]} onPress={handleClose}>
						<Text style={[MainStyles.buttonText, { color: '#000000'}]}>Close</Text>
					</TouchableOpacity>
					{saMode === 0 ? (
						<>
						<Text style={ [MainStyles.h5, { textAlign: 'left', marginTop: 20}]}>Tap on the setup step below to go to that part of the setup. Switch reminders on or off for each category.</Text>
						<ScrollView>
						<View style={{ flexDirection: 'column', flex: 1, alignItems: 'center', justifyContent: 'flex-start', width: '100%', rowGap: 5 }} >
								<Card style={{ flexDirection: 'row', alignItems: 'center', width: '100%', borderRadius: 10 }} onPress={handleWork}>
									<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} >
										{/* <Icon name='stop-circle-outline' width={32} height={32} fill='#7b90af' /> */}
										<Image source={require('../../assets/images/cal_1.png')} style={{ width: 38, height: 38 }} />
										<Text style={[MainStyles.h5, MainStyles.mb_0, { flex: 1,textAlign: 'left', paddingStart: 10 }]} >Work schedule</Text>
										<View style={{  flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
											<Text style={[MainStyles.h7, MainStyles.mb_0]}>Reminders</Text>
											<Switch
											trackColor={{false: '#808080', true: '#deded7'}}
											thumbColor={swWork ? '#7b90af' : '#f4f3f4'}
											ios_backgroundColor="#3e3e3e"
											onValueChange={toggleWork}
											value={swWork}
											/>
										</View>
									</View>
								</Card>
							<Card style={{ flexDirection: 'row', alignItems: 'center', width: '100%', borderRadius: 10 }} onPress={handleClass}>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} >
										<Image source={require('../../assets/images/cal_2.png')} style={{ width: 38, height: 38 }} />
										<Text style={[MainStyles.h5, MainStyles.mb_0, { flex: 1,textAlign: 'left', paddingStart: 10 }]} >Class schedule</Text>
										<View style={{  flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
										<Text style={[MainStyles.h7, MainStyles.mb_0]}>Reminders</Text>
										<Switch
										trackColor={{false: '#808080', true: '#deded7'}}
										thumbColor={swClass ? '#7b90af' : '#f4f3f4'}
										ios_backgroundColor="#3e3e3e"
										onValueChange={toggleClass}
										value={swClass}
										/>
									</View>
								</View>
							</Card>
							<Card style={{ flexDirection: 'row', alignItems: 'center', width: '100%', borderRadius: 10 }} onPress={handleSleep}>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} >
										<Image source={require('../../assets/images/cal_3.png')} style={{ width: 38, height: 38 }} />
										<Text style={[MainStyles.h5, MainStyles.mb_0, { flex: 1,textAlign: 'left', paddingStart: 10 }]} >Sleep schedule</Text>
										<View style={{  flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
										<Text style={[MainStyles.h7, MainStyles.mb_0]}>Reminders</Text>
										<Switch
										trackColor={{false: '#808080', true: '#deded7'}}
										thumbColor={swSleep ? '#7b90af' : '#f4f3f4'}
										ios_backgroundColor="#3e3e3e"
										onValueChange={toggleSleep}
										value={swSleep}
										/>
									</View>
								</View>
							</Card>
							<Card style={{ flexDirection: 'row', alignItems: 'center', width: '100%', borderRadius: 10 }} onPress={handleEat}>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} >
										<Image source={require('../../assets/images/cal_4.png')} style={{ width: 38, height: 38 }} />
										<Text style={[MainStyles.h5, MainStyles.mb_0, { flex: 1,textAlign: 'left', paddingStart: 10 }]} >Eat schedule</Text>
										<View style={{  flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
										<Text style={[MainStyles.h7, MainStyles.mb_0]}>Reminders</Text>
										<Switch
										trackColor={{false: '#808080', true: '#deded7'}}
										thumbColor={swEat ? '#7b90af' : '#f4f3f4'}
										ios_backgroundColor="#3e3e3e"
										onValueChange={toggleEat}
										value={swEat}
										/>
									</View>
								</View>
							</Card>
							<Card style={{ flexDirection: 'row', alignItems: 'center', width: '100%', borderRadius: 10 }} onPress={handlePrepare}>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} >
										<Image source={require('../../assets/images/cal_5.png')} style={{ width: 38, height: 38 }} />
										<Text style={[MainStyles.h5, MainStyles.mb_0, { flex: 1,textAlign: 'left', paddingStart: 10 }]} >Prepare schedule</Text>
										<View style={{  flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
										<Text style={[MainStyles.h7, MainStyles.mb_0]}>Reminders</Text>
										<Switch
										trackColor={{false: '#808080', true: '#deded7'}}
										thumbColor={swPrep ? '#7b90af' : '#f4f3f4'}
										ios_backgroundColor="#3e3e3e"
										onValueChange={togglePrep}
										value={swPrep}
										/>
									</View>
								</View>
							</Card>
							<Card style={{ flexDirection: 'row', alignItems: 'center', width: '100%', borderRadius: 10 }} onPress={handleCommute}>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} >
										<Image source={require('../../assets/images/cal_6.png')} style={{ width: 38, height: 38 }} />
										<Text style={[MainStyles.h5, MainStyles.mb_0, { flex: 1,textAlign: 'left', paddingStart: 10 }]} >Commute schedule</Text>
										<View style={{  flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
										<Text style={[MainStyles.h7, MainStyles.mb_0]}>Reminders</Text>
										<Switch
										trackColor={{false: '#808080', true: '#deded7'}}
										thumbColor={swCommute ? '#7b90af' : '#f4f3f4'}
										ios_backgroundColor="#3e3e3e"
										onValueChange={toggleCommute}
										value={swCommute}
										/>
									</View>
								</View>
							</Card>
							<Card style={{ flexDirection: 'row', alignItems: 'center', width: '100%', borderRadius: 10 }} onPress={handlePhysical}>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} >
									<Image source={require('../../assets/images/cal_7.png')} style={{ width: 38, height: 38 }} />
									<Text style={[MainStyles.h5, MainStyles.mb_0, { flex: 1,textAlign: 'left', paddingStart: 10 }]} >Allocate Physical</Text>
									<View style={{  flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
										<Text style={[MainStyles.h7, MainStyles.mb_0]}>Reminders</Text>
										<Switch
										trackColor={{false: '#808080', true: '#deded7'}}
										thumbColor={swPhy ? '#7b90af' : '#f4f3f4'}
										ios_backgroundColor="#3e3e3e"
										onValueChange={togglePhy}
										value={swPhy}
										/>
									</View>
								</View>
							</Card>
							<Card style={{ flexDirection: 'row', alignItems: 'center', width: '100%', borderRadius: 10 }} onPress={handleEmotional}>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} >
									<Image source={require('../../assets/images/cal_8.png')} style={{ width: 38, height: 38 }} />
									<Text style={[MainStyles.h5, MainStyles.mb_0, { flex: 1,textAlign: 'left', paddingStart: 10 }]} >Allocate Emotional</Text>
									<View style={{  flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
										<Text style={[MainStyles.h7, MainStyles.mb_0]}>Reminders</Text>
										<Switch
										trackColor={{false: '#808080', true: '#deded7'}}
										thumbColor={swEmo ? '#7b90af' : '#f4f3f4'}
										ios_backgroundColor="#3e3e3e"
										onValueChange={toggleEmo}
										value={swEmo}
										/>
									</View>
								</View>
							</Card>
							<Card style={{ flexDirection: 'row', alignItems: 'center', width: '100%', borderRadius: 10 }} onPress={handleMental}>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} >
									<Image source={require('../../assets/images/cal_9.png')} style={{ width: 38, height: 38 }} />
									<Text style={[MainStyles.h5, MainStyles.mb_0, { flex: 1,textAlign: 'left', paddingStart: 10 }]} >Allocate Mental</Text>
									<View style={{  flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
									<Text style={[MainStyles.h7, MainStyles.mb_0]}>Reminders</Text>
									<Switch
									trackColor={{false: '#808080', true: '#deded7'}}
									thumbColor={swMen ? '#7b90af' : '#f4f3f4'}
									ios_backgroundColor="#3e3e3e"
									onValueChange={toggleMen}
									value={swMen}
									/>
								</View>
								</View>
							</Card>
							<Card style={{ flexDirection: 'row', alignItems: 'center', width: '100%', borderRadius: 10 }} onPress={handleSpiritual}>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }} >
									<Image source={require('../../assets/images/cal_10.png')} style={{ width: 38, height: 38 }} />
									<Text style={[MainStyles.h5, MainStyles.mb_0, { flex: 1,textAlign: 'left', paddingStart: 10 }]} >Allocate Spiritual</Text>
									<View style={{  flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
										<Text style={[MainStyles.h7, MainStyles.mb_0]}>Reminders</Text>
										<Switch
										trackColor={{false: '#808080', true: '#deded7'}}
										thumbColor={swSpi ? '#7b90af' : '#f4f3f4'}
										ios_backgroundColor="#3e3e3e"
										onValueChange={toggleSpi}
										value={swSpi}
										/>
									</View>
								</View>
							</Card>
						</View>
						</ScrollView>
						</>
					) : null }
					
				</View>
				</View>
		</ImageBackground>
	</SafeAreaView>
	);
};

export default SetupStart;