import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import DbCalendar from '../../services/DbCalendar';
import DbDiary from '../../services/DbDiary';
import DbQuestions from '../../services/DbQuestions';
import DBSettings from '../../services/DBSettings';
import { SafeAreaView, ImageBackground, View, Image, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import AppMenu from '../../components/AppMenu/AppMenu';
import MainStyles from '../../assets/MainStyles';
import backgroundImage from '../../assets/images/app_bg_mountains.png';
import { Alert } from 'react-native';

// Brown: #E9D9CC80
// Purple: #CED0DF80

interface Record 
{
    id: number;
    week_num: number;
    day_num: number;
    hour_num: number;
	time: string;
    activity_type: number;
    activity_title: string;
    activity_desc: string;
    sa_type: number;
    sa_id: number;
    reminder: number;
}

type Todo = {
	id: number;
	activityType: number;
	hourNum: number;
	time: string;
	activityTitle: string;
	activityDesc: string;
	icon: any;
};

type Group = {
	[key: number]: Todo[];
  };

//Del
// const todos = [
//     { id: '1', time: '10:00', text: 'Todo 1', icon: require('../../assets/images/cal_1.png') },
//     { id: '2', time: '10:00', text: 'Todo 2', icon: require('../../assets/images/cal_2.png') },
//     { id: '3', time: '11:00', text: 'Todo 3', icon: require('../../assets/images/cal_3.png') },
//     // Add more todos as needed
// ];

const MainScreen = (props: any) => 
{
	/**
	 * POA
	 * Must use settings to enable/disable, hide/show UI elements
	 * - Analytics: Add an alert saying disabled + reason else behave as normal
	 * - Quotes: Add an alert saying disabled + reason else behave as normal
	 */

	// Mini calendar at the top: setup
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const dayNames = ['Su', 'Mo', 'Tu', 'Wed', 'Th', 'Fr', 'Sa'];
    const today = new Date();
    const getDayNum = today.getDay();
    today.setHours(0, 0, 0, 0);
	let options: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: 'long' };
	let formattedDate = date.toLocaleDateString('en-US', options);

	const [dayNumber, setDayNumber] = useState(getDayNum); // Wrong data issue???
	const [chkPopQuiz, setChkPopQuiz] = useState(false);

	const [diaryData, setDiaryData] = useState<Record[]>([]); // Del
	const [todos, setTodos] = useState<Todo[]>([]);
	const [diaryMode, setDiaryMode] = useState(0);
	const getWeekDates = () => 
	{
		const now = new Date();
		const dayOfWeek = now.getDay();
		const numDay = now.getDate();

		const start = new Date(now);
		start.setDate(numDay - dayOfWeek);
		start.setHours(0, 0, 0, 0);

		const dates = [...Array(7)].map((_, i) => 
		{
			const date = new Date(start);
			date.setDate(start.getDate() + i);
			return date;
		});
console.log('Dates 1: ', dates);
		return dates;
	};
	const weekDates = getWeekDates();

	const [calendarRecords, setCalendarRecords] = useState<Record[]>([]);

	const getRecords = async () => 
	{
		console.log('DNDNDND: ', dayNumber);
		await DbCalendar.getCalendarRecords(dayNumber)
		.then((value: unknown) => 
		{
			const records = value as Record[];
			setCalendarRecords(records);
			return;
		})
		.catch(error => 
		{
			console.error(error);
		});
	}

	// useEffect(() => 
	// {
	// 	try 
	// 	{
	// 		getRecords();	
	// 	} 
	// 	catch (error) 
	// 	{
	// 		console.error(error);
	// 	}
	// }, [dayNumber]);

	useFocusEffect(React.useCallback(() => 
	{
		try 
		{
			getRecords();	
		} 
		catch (error) 
		{
			console.error(error);
		}
	}, [dayNumber]));


	useEffect(() => 
	{
		let data = [];
		// console.log('Diary Data: ', calendarRecords);

		for (let i = 0; i < calendarRecords.length; i++) 
		{
			//console.log("Diary Data: ", diaryData[i].activity_time);
			let id = calendarRecords[i].id;
			let weekNum = calendarRecords[i].week_num;
			let dayNum = calendarRecords[i].day_num;
			let hourNum = calendarRecords[i].hour_num;
			let activityType = calendarRecords[i].activity_type;
			let activityTitle = calendarRecords[i].activity_title;
			let activityDesc = calendarRecords[i].activity_desc;
			let saType = calendarRecords[i].sa_type;
			let saId = calendarRecords[i].sa_id;
			let reminders = calendarRecords[i].reminder;
			let icon = require('../../assets/images/cal_2.png');

			switch (activityType) 
			{
				case 1:
					icon = require('../../assets/images/cal_1.png');
				break;
				case 2:
					icon = require('../../assets/images/cal_2.png');
				break;
				case 3:
					icon = require('../../assets/images/cal_3.png');
				break;
				case 4:
					icon = require('../../assets/images/cal_4.png');
				break;
				case 5:
					icon = require('../../assets/images/cal_5.png');
				break;
				case 6:
					icon = require('../../assets/images/cal_6.png');
				break;
				case 7:
					icon = require('../../assets/images/cal_7.png');
				break;
				case 8:
					icon = require('../../assets/images/cal_8.png');
				break;
				case 9:
					icon = require('../../assets/images/cal_9.png');
				break;
				case 10:
					icon = require('../../assets/images/cal_10.png');
				break;
			}

			// Convert hourNum to a time
			let time = '';
			if (hourNum < 10)
			{
				time = '0' + hourNum + ':00';
			}
			else 
			{
				time = hourNum + ':00';
			}

			data.push({ id, activityType, hourNum, time, activityTitle, activityDesc, icon });
			// for (let j = 0; j < Math.ceil(duration / 3600); j ++)
			// {
			// 	let hhmm = convertSecondsToHours(start + (j * 3600));
			// 	let hh = hhmm[0];
			// 	let mm = hhmm[1];
			// 	let new_time = String(hh).padStart(2, '0') + ":" + String(mm).padStart(2, '0');
			// 	otherNote = "Test";
			// 	time = new_time;
				
			// }
			// data.push({ type, time, title, description, otherNote, icon });
		}
		
		setTodos(data);

	}, [calendarRecords]);

	useEffect(() => 
	{
		const getDiaryMode = async () =>
		{
			const mode = await DBSettings.getDiaryMode();
			if (mode == 0)
			{
				setChkPopQuiz(true);
			}
			else 
			{
				setChkPopQuiz(false);
			}
		}

		getDiaryMode();
	
	}, []);

    const groupedTodos = todos.reduce((groups: Group = {}, todo) => 
    {
		// let groups: Group = {};
        (groups[todo.hourNum] = groups[todo.hourNum] || []).push(todo);
        return groups;
    }, {});

    const todoGroups = Object.keys(groupedTodos).map(key => {
		const hourNum = Number(key);
		return {
			hourNum,
			time: groupedTodos[hourNum][0].time,
			todos: groupedTodos[hourNum],
		};
	});
	
    const handleError = (error: any) => 
    {
        console.error(error);
        Alert.alert('An error occurred while loading the image.');
    }

	const handleEditActivity = (id: number) => 
	{
		console.log('Edit Activity: ', weekDates[dayNumber]);
		const thisDay: Date = weekDates[dayNumber];
		const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		const dateString: string = thisDay.toLocaleDateString('en-US', options);

		props.navigation.navigate('EditActivity', {id: id, activityDate: dateString, dayNum: dayNumber});
	}

    function convertSecondsToHours(seconds: number): [number, number] 
    {
        let hours = Math.floor(seconds / 3600);
        let remainingMinutes = Math.floor((seconds % 3600) / 60);

        return [hours, remainingMinutes];
    }

    function getCurrentWeekNumber() 
    {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const firstThursday = start.getDay() < 4 ? start : new Date(start.setDate(start.getDate() + (7 - start.getDay() + 4) % 7));
        const diffInMilliseconds = now.getTime() - firstThursday.getTime();
        const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        
        return Math.floor(diffInMilliseconds / oneWeekInMilliseconds) + 1;
    }

    useEffect(() =>
    {
        if (!chkPopQuiz) { return; }

        //PopQuiz.
        const weekNumber = getCurrentWeekNumber();
        DbQuestions.getWeekQuestion(weekNumber)
        .then((records: any) => 
        {
            console.log("DDD: ", records.rows.length);
            if (records.rows.length > 0)
            {
                console.log("DDD: ", records.rows.item(0));
                let id = records.rows.item(0).id;
                let days = records.rows.item(0).day_array;
                const dayArray = JSON.parse(days);
                if (dayArray[dayNumber - 1] === 0)
                {
                    console.log("Show popup ");
                    Alert.alert(
                        'Pop Quiz',
                        'Take a pop quiz to help you understand ONE and how to improve your goals',
                        [
                        {
                            text: 'Skip',
                            onPress: () => skipPopQuiz(id),
                            style: 'cancel',
                        },
                        { text: 'Take the quiz', onPress: () => takePopQuiz(id) },
                        ],
                        { cancelable: false },
                    );
                } 
    
                console.log("DDD 2223: ", dayArray);
            } 
            else 
            {
				if (DbQuestions)
				{
					DbQuestions.resetQuizControl()
					.then((result) => 
					{
						if (result)
						{
							console.log("Reset Quiz Control");
						}
					});
				}
            }
        })
        .catch((error) => 
        {
            // If no records are found then we need trunc table and 5 new reords with new wekk numbs
            
        });

    }, [chkPopQuiz]);

    const skipPopQuiz = (id: number) => 
    {
        const today = new Date();
        const getDayNum = today.getDay();
        let dayArray;

        switch (getDayNum)
        {
            case 0:
                dayArray = [1, 0, 0, 0, 0, 0, 0];
            break;
            case 1:
                dayArray = [1, 1, 0, 0, 0, 0, 0];
            break;
            case 2:
                dayArray = [1, 1, 1, 0, 0, 0, 0];
            break;
            case 3:
                dayArray = [1, 1, 1, 1, 0, 0, 0];
            break;
            case 4:
                dayArray = [1, 1, 1, 1, 1, 0, 0];
            break;
            case 5:
                dayArray = [1, 1, 1, 1, 1, 1, 0];
            break; 
            case 6:
                dayArray = [1, 1, 1, 1, 1, 1, 1];
            break; 
        }
        
        DbQuestions.updDayArray(id, JSON.stringify(dayArray));
    }

    const takePopQuiz = (id:  number) => 
    {
        props.navigation.navigate('PopQuiz', { id: id });
    }

    return (
        <SafeAreaView style={MainStyles.root}>
            <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
                <View style={[MainStyles.container, { padding: 0 }]}>
                    <View style={[MainStyles.formGroupRow, MainStyles.mb_4, { padding: 24, paddingBottom: 0}]}>
                        <Text style={[MainStyles.h2, MainStyles.textSerif, MainStyles.mb_0]}>{`${month} ${year}`}</Text>
                        <View style={[MainStyles.formGroupRowEnd, MainStyles.fcg_10]}>
                            <TouchableOpacity onPress={() => props.navigation.navigate('SetupStart', {from: "MainScreen"})}>
                                <Image source={require('../../assets/images/plan_one.png')} style={{ width: 32, height: 32 }} onError={handleError} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => props.navigation.navigate('NotificationList')}>
                                <Image source={require('../../assets/images/notifications.png')} style={{ width: 32, height: 32 }} onError={handleError} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => props.navigation.navigate('ProfileManage')}>
                                <Image source={require('../../assets/images/profile_pic.png')} style={MainStyles.profilePicSml} onError={handleError} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.weekRow, { paddingStart: 24, paddingEnd: 24}]}>
                        {weekDates.map((date, index) => (
                            <TouchableOpacity key={index} onPress={() => { setDayNumber(index) }}>
                                <View style={styles.weekDay}>
                                    {/* <Text style={[styles.weekDayNumber, date.getTime() === today.getTime() ? styles.currentTop : styles.otherTop]}>{date.getDate()}</Text> */}
                                    <Text style={[styles.weekDayNumber, index === dayNumber ? styles.currentTop : styles.otherTop]}>{date.getDate()}</Text>
                                    <Text style={[styles.weekDayName, index === dayNumber ? styles.currentBottom : styles.otherBottom]}>{dayNames[index]}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={[MainStyles.h5, MainStyles.mb_3, MainStyles.textLeft, MainStyles.w_100, MainStyles.textBold, { paddingStart: 24 }]}>Schedule Today</Text>
                    <View style={{ flex: 1, width: '100%' }}>
                        <FlatList
                            data={todoGroups}
                            style={{marginBottom: 40, flex: 1,}}
                            keyExtractor={(item) => item.hourNum.toString()}
                            renderItem={({ item }) => (
                                <View style={{ paddingTop: 0, paddingBottom: 0 }}>
									<View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'rgba(77, 77, 77, 0.2)', paddingStart: 10 }}>
										<Image source={require('../../assets/images/cal_clock.png')} style={{ width: 24, height: 24, marginStart: 10, marginEnd: 0 }} />
										<Text style={{ color: '#000000',fontWeight: 'bold', fontSize: 16, padding: 15, paddingTop: 10, paddingBottom: 10, paddingStart: 8, paddingEnd: 24 }}>{item.time}</Text>
									</View>

                                    {item.todos.map((todo, index) => (
                                        <TouchableOpacity key={index} style={{  paddingTop: 10, paddingBottom: 10, paddingStart: 10, backgroundColor: index % 2 === 0 ? 'rgba(233, 217, 204, 0.5)' : 'rgba(206, 208, 233, 0.5)' }} onPress={() => handleEditActivity(todo.id)}>
                                            
                                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginStart: 10 }}>
                                                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#E9D9CC80', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 5 }}>
                                                    <Image source={todo.icon} style={{ width: 48, height: 48, marginEnd: 5, marginTop:6 }} />
                                                </View>
                                                <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                                                    <Text style={[MainStyles.h5, MainStyles.mb_0]}>{todo.activityTitle}</Text>
                                                    <Text style={[MainStyles.h6, MainStyles.mb_0]}>{todo.activityDesc}</Text>
                                                </View>

                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        />
                    </View>
					<TouchableOpacity style={styles.fab} onPress={() => { props.navigation.navigate('AddActivity', {date: formattedDate, todos: todoGroups, dayNumber: dayNumber}) }}>
                    	<Text style={styles.fabIcon}>+</Text>
                	</TouchableOpacity>
                </View>
            </ImageBackground>
            <AppMenu navigation={props.navigation} activeItem={0} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    weekRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 20,
        columnGap: 5
    },
    weekDay: {
        alignItems: 'center',
    },
    weekDayNumber: {
        fontSize: 16,
        fontWeight: 'bold',
		color: '#4D4D4D'
    },
    weekDayName: {
        fontSize: 13,
		color: '#4D4D4D'
    },
    otherTop: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        paddingTop: 10,
        textAlign: 'center',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderColor: '#4D4D4D',
        borderWidth: 1,
        borderBottomWidth: 0
    },
    otherBottom: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        paddingBottom: 10,
        textAlign: 'center',
        borderColor: '#4D4D4D',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderWidth: 1,
        borderTopWidth: 0
    },
    currentTop: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        backgroundColor: '#4D4D4D',
        paddingTop: 10,
        width: 40,
        color: 'white',
        textAlign: 'center'
    },
    currentBottom: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4D4D4D',
        color: 'white',
        width: 40,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        paddingBottom: 10,
        textAlign: 'center'
    },
    fab: {
		flexDirection: 'row',
        position: 'absolute',
        right: 20,
        bottom: 60,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8f8ca3',
        borderRadius: 30,
        elevation: 8
    },
    fabIcon: {
		flex: 1,
        fontSize: 40,
		lineHeight: 48,
		textAlign: 'center',
        color: 'white',
		margin: 0,
		padding: 0,
		opacity: 0.8
    },
    list: {
        flex: 1,
        marginTop: 20,
    },
});

export default MainScreen;