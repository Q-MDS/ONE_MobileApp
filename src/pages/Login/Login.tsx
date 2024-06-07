import React, { useState, useEffect, useContext } from 'react';
import { login } from '../../services/auth';
import DateUtils from '../../services/DateUtils';
import DbQuestions from '../../services/DbQuestions';
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
        setFirstLogin(props.route.params.firstTimeLogin);
    }, [props]);

    // Get questions
    const getQuestions = async () => 
    {
		console.log('Got CCC');
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
				const currentWeekNumber = DateUtils.getCurrentWeekNumber();
				// const currentWeekNumber: number = 25;
				
				const currentDayOfWeek = DateUtils.getCurrentDayOfWeek();
				// const currentDayOfWeek: number = 3;
				
				console.log('Current day number (CCC): ', diaryWeek, diaryStartDay, currentWeekNumber, currentDayOfWeek);

				if (diaryWeek == 0 || diaryStartDay == 1) 
				{
					// This code will run if the user CLOSES the app after onboarding goes to SETP DIARY screen: weeknum and daynum not set yet
					props.navigation.navigate('StartWeek');
				} 
				else if(typeof diaryWeek === 'number' && typeof diaryStartDay === 'number')
				{
					// Main logic:START
					if (diaryStartDay == 6)
					{
						// It is a Sat/Sun scenario where 0 > 6...
						if (currentWeekNumber > diaryWeek + 1)
						{
							// Check if it is more than a week ahead
							props.navigation.navigate('StartWeek');
						}
						else if (currentWeekNumber > diaryWeek && currentDayOfWeek < diaryStartDay)
						{
							// Week and day fall within the current week
							handleNavMainScreen();
						}
						else 
						{
							// Week and day dont fall within the current week
							props.navigation.navigate('StartWeek');
						}
					}
					else 
					{
						// Logic below deals with scenarios that dont start on a Sat/SUn rollover
						if (currentWeekNumber > diaryWeek + 1)
						{
							// More than a week ahead
							props.navigation.navigate('StartWeek');
						}
						else if ((currentWeekNumber > diaryWeek) && (currentDayOfWeek >= diaryStartDay))
						{
							// Week and day are over a week old
							props.navigation.navigate('StartWeek');	
						} 
						else 
						{
							// Week and day are still within the current week
							handleNavMainScreen();
						}
					}
				}
				else 
				{
					console.log('Handle diaryWeek and diaryStartDay are not numbers');
				}
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

				// Set token
				if (apiToken != '' && apiToken != null) 
				{
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
						// showAlert('Subscription', 'Your free trial will expire in 3 days', getQuestions());
						simpleAlert('Subscription', 'Your free trial will expire in 3 days');
					}
					else 
					{
						// showAlert('Subscription', 'Your subscription will expire in 3 days', getQuestions());
						simpleAlert('Subscription', 'Your subscription will expire in 3 days');
					}
				}

				// Set settings based on plan type
				if (planType == 0)
				{
					await DBSettings.setFreePlan();	
				}
				else 
				{
					console.log('Got AAA');
					await DBSettings.setCoachingPlan();
				}
				console.log('Got BBB');
				setIsReady(true);
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

    const handleNavPurposeList = () => 
	{
        props.navigation.navigate('PurposeListIntro');
    }

    const handleNavMainScreen = () => {
        props.navigation.navigate('MainScreen');
    }

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={MainStyles.container}>
                <Text style={[MainStyles.h1, MainStyles.textSerif, MainStyles.textLeft]}>Sign in to your ONE account</Text>
                <TextInput style={MainStyles.input} placeholder="Email" placeholderTextColor="#808080" value={email} onChangeText={text => setEmail(text)} />
                {errors.email && <Text style={[MainStyles.errorText]}>{errors.email}</Text>}
                <TextInput style={MainStyles.input} placeholder="Password" placeholderTextColor="#808080"  secureTextEntry value={password} onChangeText={text => setPassword(text)} />
                {errors.password && <Text style={[MainStyles.errorText]}>{errors.password}</Text>}
                <View style={MainStyles.formGroupRow}>
                    <Text style={MainStyles.text}>Forgot password? </Text>
                    <Text style={MainStyles.textUnderline}>Reset</Text>
                </View>
                {/* <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={handleLogin}> */}
                <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, { width: '100%' }]} onPress={validateForm}>
                    <Text style={[MainStyles.buttonText]}>Sign In</Text>
                </TouchableOpacity>
                {errors.loginResult && <Text style={[MainStyles.errorText, MainStyles.w_100, MainStyles.textCenter, MainStyles.mt_2]}>{errors.loginResult}</Text>}
                <View style={[MainStyles.formGroupRowCenter, MainStyles.mt_3]}>
                    <Text style={MainStyles.text}>Dont have an account? </Text>
                    <TouchableOpacity onPress={handleSignUp}>
                        <Text style={MainStyles.textUnderline}>Sign up?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

export default Login;