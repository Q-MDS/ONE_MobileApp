import React, { useState, useEffect, useContext } from 'react';
import { login } from '../../services/auth';
import DateUtils from '../../services/DateUtils';
import DbQuestions from '../../services/DBQuestions';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, View, TextInput, Button, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';
import DbProfile from '../../services/DbProfile';
import DBSettings from '../../services/DBSettings';

interface Question {
    id: string;
    question_desc: string;
    question_answer_one: string;
    question_answer_two: string;
}

interface Profile {
	id: number;
	remote_id: number;
	first_time_use: number;
	first_time_login: number;
	first_name: string;
	last_name: string;
	cred_1: string;
	token: string;
	plan_type: number;
	card_info_save: number;
	card_info_data: string;
};

const Login = (props: any) => 
{
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('123456');
    const [firstLogin, setFirstLogin] = useState(0);
    const [token, setToken] = useState('');
    const [errors, setErrors] = useState<{ email?: string, password?: string, loginResult?: string, token?: string, firstTimeLogin?: number }>({});
	const [isReady, setIsReady] = useState(false);

	const getProfile = async () =>
	{
		const profile = await DbProfile.getProfile() as Profile;
		setEmail(profile.cred_1);
	}

    useEffect(() => 
    {
		if (isReady) { setIsReady(false); }
		getProfile();
        // setEmail(props.route.params.email);
        // setPassword(props.route.params.password);
        // setPassword("123456");
        setFirstLogin(props.route.params.firstTimeLogin);
    }, [props]);

    // Get questions
    const getQuestions = async () => 
    {
		const diaryWeek = await DBSettings.getWeekNumber();
		const diaryStartDay = await DBSettings.getStartDay();

        fetch('http://192.168.1.28/one/api/auth_controller/get_questions', 
        {
            method: 'GET',
            headers: 
            {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(result => 
        {
            const obj = JSON.parse(result);
            DbQuestions.truncQuestions();

            obj.data.map((item: { question_desc: string; question_answer_1: string; question_answer_2: string; }) => 
            {
                DbQuestions.addQuestion(item.question_desc, item.question_answer_1, item.question_answer_2)
                .then((value: unknown) => 
                {
					const result = value as boolean;
                    console.log('Calendar: Add questions records: ', result);
                })
                .catch((error) => 
                {
                    // console.log('Calendar: Add records error: ', error);
                });
            });

            if (firstLogin == 0)
            {
                handleNavPurposeList();
            }
            else 
            {
				// const currentWeekNumber = DateUtils.getCurrentWeekNumber();
				const currentWeekNumber: number = 20;
				
				// const currentDayOfWeek = DateUtils.getCurrentDayOfWeek();
				const currentDayOfWeek: number = 4;
				
				console.log('Current day number (CCC): ', diaryWeek, diaryStartDay, currentWeekNumber, currentDayOfWeek);

				if (diaryWeek == 0 || diaryStartDay == 1) 
				{
					// Show the setup diary screen
					console.log('Show the setup diary screen: first time use week # = 0 so only show Setup New Diary and Skip options');
					props.navigation.navigate('StartWeek');
				} 
				else if(typeof diaryWeek === 'number' && typeof diaryStartDay === 'number')
				{
					// 19 - 2 Tues
					// 19 - 3 Wed
					// 19 - 4 Thu
					// 19 - 5 Fri
					// 19 - 6 Sat
					// 20 - 0 Sun
					// 20 - 1 Mon
					// 20 - 2 Tue
					// 20 - 3 Wed x
					// 20 - 4 Thu
					// 20 - 5 Fri
					// 20 - 6 Sat if diaryStartDay = 6 then we will have a > 7 issue. Week is 2 x bigger
					// 21 - 0 Sun x
					// 21 - 1 Mon
					// 21 - 2 Tue
					// 21 - 3 Wed

					// Handle diary being set up on a Saturday
					if (((diaryWeek + 2) === currentWeekNumber) && (currentDayOfWeek === 0))
					{
						console.log('Dems is a Saturday scenario');
						props.navigation.navigate('StartWeek');
					}
					else if ((currentWeekNumber > diaryWeek) && (currentDayOfWeek > diaryStartDay))
					{
						console.log('Show the setup diary screen: Diary has been setup before: Show all options');
						props.navigation.navigate('StartWeek');	
					} 
					else 
					{
						handleNavMainScreen();
					}
				}
				else 
				{
					// Handle diaryWeek and diaryStartDay are not numbers
					console.log('Handle diaryWeek and diaryStartDay are not numbers');
				}

				// WHEN USER LOGS IN PART OF THE RETURNED DATA IS HIS SUBSCRIPTION PLAN, EG. IF HE HASN'T PAID THEN IT WILL BE 0. LAO CAN MANAGE THIS WITH THE BACKEND
				// If the plan_type is 0 (free) then the user cannot change quotes, quiz switches
				// If the user signs up their plan type is paid version (1) for 28 days - free trial period.
				// If the user joins/pays the backend will send 1 at login
				// If user doesn't pay any more does the app revert to free version or is the login disabled? 

				// Need to check settings what day the calendar was started - 1 to 7
				// Need to get current day of the week (class/utils to get current day of the week)
				//* Update settings
				// Need to get the current week number (class/utils to get current week number)
				//* Update settings

				// If current day > cal start day go to page with the following: If the calendar has never been setup then cal start will be 0
				   // Message : "Time to plan your ONE Diary for the week"
				   // This screen is only shown after login, and is shown always, skip & can carry on
				   // 3 options: Use the diary from last week, Create a new diary and Skip
				   // If user skips then they must go to home with an empty diary
				   // If this is the first time (cal start = 0 [after setup val will be 1 to 7]) then only the Create new diary/one plan
				   // Else if diary exists and user choose last week then update the diary week number AND remove the adhoc entries
				   // If user chooses to create new CLEAR the table and goto the first SCHEDULE screen - Start that process
				// Other things to setup
				   // Must add 7 noti for verification per day at a certain time verify_master (??? Push and app ???)
				   // Must add random 1-2 noti per day random time to accountability nitification (??? Push and app ???)
				   // Noti, quiz and quotes are set yo off (TODO: Adjust GUI to show this) if user went skip and has a blank diary
				   
				// After clone diary or new diary present the WHEN WOULD YOU LIKE TO SET A REMINDER TO SETUP YOUR DIARY - auto suggest 7 days from now and same time to the hour
					// This will generate the one plan setup reminder push noti and app noti
				// SCREENS INVOLVED: Ask about setup diary (clone, new, skip) NEW > Reminder date and time (exists) > ScheduleWork  > Home
				// TABLES: settings, diary_master, noit, verify_master, accountability_master

				// Step 1 : create utils class to get the week and day number - CHECK
				// With the option main screen to setup PLAN ONE, user must go to the workschedule screen on the Plan Now etc one or create a dummy screen
            }
        })
        .catch((error) => 
        {
            console.error('Error:', error);
        });

		setIsLoading(false);
    }

	const loginFail = () => 
	{
		let tempErrors = {};
		tempErrors = { ...tempErrors, loginResult: 'Invalid login details. Please try again.' };
		setErrors(tempErrors);
		// setEmail('');
		setPassword('');
	}

    const handleLogin = async () => 
    {
        setIsLoading(true);

        try 
		{
			const res = await login(email, password);
			const status = res.status;

			if (status)
			{
				const apiToken = res.token;
				const subscribed = res.subscribed;
				const planType = res.plan_type;

				console.log('Plan type 1: ', isReady);
				// Set token
				if (apiToken != '' && apiToken != null) 
				{
					console.log('Plan type: 2');
					await DbProfile.setLoginToken(apiToken);
					setToken(apiToken);
				}
				else 
				{
					loginFail();
				}

				await DBSettings.setSubscribed(subscribed);
				// Check trial or sub expiry
				if (res.days_left < 0) 
				{
					if (subscribed == 0)
					{
						simpleAlert('Subscription', 'Your free trial has expired. You can continue to use ONE as a free user. If you would like to upgrade back to the coaching plan go to Pricing Plan under your profile settings.');
					} 
					else 
					{
						simpleAlert('Subscription', 'Your subscription has expired. You can continue to use ONE as a free user. If you would like to upgrade back to the coaching plan go to Pricing Plan under your profile settings.');
					}
				}
				else if (res.days_left === 3) 
				{
					if (subscribed == 0)
					{
						showAlert('Subscription', 'Your free trial will expire in 3 days', getQuestions());
					}
					else 
					{
						showAlert('Subscription', 'Your subscription will expire in 3 days', getQuestions());
					}
				}

				// Set settings based on plan type
				if (planType == 0)
				{
					await DBSettings.setFreePlan();	
				}
				else 
				{
					await DBSettings.setCoachingPlan();
				}
				console.log('Plan  type: 3');
				setIsReady(true);
				console.log('Plan type: 4', isReady);
				setIsLoading(false);
			} 
			else 
			{
				loginFail();
			}
		} 
		catch (error) 
		{
            console.error(error);
            loginFail();
        }
        finally 
		{
            setIsLoading(false);
        }
    };

	useEffect(() => 
	{
		console.log('Plan type: 6', isReady);
		if (isReady) 
		{
			
			getQuestions();
		}
	}, [isReady]);

    const handleSignUp = () => {
        props.navigation.navigate('SignupStart')
    }

    const validateForm = () => {
        let tempErrors = {};

        if (!email) {
            tempErrors = { ...tempErrors, email: 'Email is required' };
        }
        else if (!/\S+@\S+\.\S+/.test(email)) {
            tempErrors = { ...tempErrors, email: 'Email is not valid' };
        }

        if (!password) {
            tempErrors = { ...tempErrors, password: 'Password is required' };
        }

        setErrors(tempErrors);

        if (Object.keys(tempErrors).length === 0) 
        {
            handleLogin();
        }
    };

    const showAlert = (title: string, message: string | undefined, nav: Promise<void>) => 
	{
        Alert.alert(
            title,
            message,
            [
                { text: 'OK', onPress: () => nav },
            ],
            { cancelable: false },
        );
    }

    const simpleAlert = (title: string, message: string | undefined) => 
	{
        Alert.alert(
            title,
            message,
            [
                { text: 'OK' },
            ],
            { cancelable: false },
        );
    }

    const handleNavPurposeList = () => {
        props.navigation.navigate('PurposeListIntro');
    }

    const handleNavMainScreen = () => {
        props.navigation.navigate('MainScreen');
    }

    const handleSubscribe = () => {
        console.log("Take the user to the select coaching plan options > paymnet > paygate > thank you screen > main screen")
    }

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={MainStyles.container}>
                <Text style={[MainStyles.h1, MainStyles.textSerif, MainStyles.textLeft]}>Sign in to your ONE account</Text>
                <TextInput style={MainStyles.input} placeholder="Email" value={email} onChangeText={text => setEmail(text)} />
                {errors.email && <Text style={[MainStyles.errorText]}>{errors.email}</Text>}
                <TextInput style={MainStyles.input} placeholder="Password" secureTextEntry value={password} onChangeText={text => setPassword(text)} />
                {errors.password && <Text style={[MainStyles.errorText]}>{errors.password}</Text>}
                <View style={MainStyles.formGroupRow}>
                    <Text>Forgot password? </Text>
                    <Text style={MainStyles.textUnderline}>Reset</Text>
                </View>
                {/* <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={handleLogin}> */}
                <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, { width: '100%' }]} onPress={validateForm}>
                    <Text style={[MainStyles.buttonText]}>Sign In</Text>
                </TouchableOpacity>
                {errors.loginResult && <Text style={[MainStyles.errorText, MainStyles.w_100, MainStyles.textCenter, MainStyles.mt_2]}>{errors.loginResult}</Text>}
                <View style={[MainStyles.formGroupRowCenter, MainStyles.mt_3]}>
                    <Text>Dont have an account? </Text>
                    <TouchableOpacity onPress={handleSignUp}>
                        <Text style={MainStyles.textUnderline}>Sign up?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

export default Login;