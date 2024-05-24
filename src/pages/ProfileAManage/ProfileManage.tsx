import React, { useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { changeCreds } from '../../services/auth';
import DBSettings from '../../services/DBSettings';
import BackTextTopBar from '../../components/BackTextTopBar/BackTextTopBar';
import DbProfile from '../../services/DbProfile';
import Accordion from 'react-native-collapsible/Accordion';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, ScrollView, View, Text, Button, TextInput, Image, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import backgroundImage from '../../assets/images/app_bg_sky.png';
import openIcon from '../../assets/images/icon_open.png';
import closeIcon from '../../assets/images/icon_close.png';

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
}[];

const ProfileManage = ( props: any ) => 
{
    // const { settings, setSettingsUpdated } = useContext(SettingsContext);
	const [diaryMode, setDiaryMode] = useState(0);
	const [subscribed, setSubscribed] = useState(0);
	const [planType, setPlanType] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('Email Address');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [notiIsEnabled, setNotiIsEnabled] = useState(false);
    const [quotesIsEnabled, setQuotesIsEnabled] = useState(false);
    const [quizIsEnabled, setQuizIsEnabled] = useState(false);
    const notificationSwitch = () => setNotiIsEnabled(previousState => !previousState);
    const quotesSwitch = () => setQuotesIsEnabled(previousState => !previousState);
	const [quotesSwitchDisabled, setQuotesSwitchDisabled] = useState(false);
	const [quizSwitchDisabled, setQuizSwitchDisabled] = useState(false);
    const quizSwitch = () => setQuizIsEnabled(previousState => !previousState);
    
    const [isReady, setIsReady] = useState(false);
	
	//const [oldPassword, setOldPassword] = useState('');
    
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const toggleNewPasswordVisibility = () => { setIsNewPasswordVisible(!isNewPasswordVisible); };
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const toggleConfirmPasswordVisibility = () => { setIsConfirmPasswordVisible(!isConfirmPasswordVisible); };
    const [activeSections, setActiveSections] = useState([1]);
    const [activeAcSections, setActiveAcSections] = useState([1]);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [paswordMatchError, setPasswordMatchError] = useState(true);

	const getDefaults = async () =>
	{
		await DbProfile.getProfileManage()
		.then((profile: Profile) => 
		{
			console.log('Step 1');
			setFirstName(profile.first_name);
			setLastName(profile.last_name);
			setEmail(profile.cred_1);
		});
		await DBSettings.getNotifications()
		.then((notifications: number) => 
		{
			console.log('Step 2');
			setNotiIsEnabled(notifications == 1 ? true : false);
		});
		
		await DBSettings.getDiaryMode()
		.then((result: number) => 
		{
			console.log('Step 3');
			setDiaryMode(result);
		})
		
		await DBSettings.getPlanType()
		.then((result: number) => 
		{
			console.log('Step 3b');
			setPlanType(result);
		})
		
		await DBSettings.getSubscribed()
		.then((result: number) => 
		{
			console.log('Step 3c');
			setSubscribed(result);
		})
	}

	useEffect(() => 
	{
		getDefaults();
	}, []);

	const setDefaults = async () =>
	{
		await DBSettings.getQuotes()
		.then((quotes: number) => 
		{
			console.log('Step 4');
			console.log('Diary mode: ', diaryMode);
			if (diaryMode === 1)
			{
				setQuotesIsEnabled(false);
			} 
			else 
			{
				setQuotesIsEnabled(quotes == 1 ? true : false);
			}
		});

		await DBSettings.getQuizMode()
		.then((quizMode) => 
		{
			console.log('Step 5');
			if (diaryMode === 1)
			{
				setQuizIsEnabled(false);
			} 
			else 
			{
				setQuizIsEnabled(quizMode == 1 ? true : false);
			}
			
		});
	}

	useEffect(() => 
	{
		setDefaults();

		if (diaryMode == 1)
		{
			Alert.alert(
				'Disabled',
				'Motivational Quotes and Quiz Mode are disabled until you setup your diary',
				[
					{text: 'OK', onPress: () => console.log('OK Pressed')},
				],
				{cancelable: false},
			);
			setQuotesSwitchDisabled(true);
			setQuizSwitchDisabled(true);
		}
		
	}, [diaryMode]);

	/* Quicksave: First Name */
    useEffect(() => 
		{
			handleSaveFirstName();
	}, [firstName]);

	const handleSaveFirstName = () => 
	{
		if (firstName == '')
		{
			setFirstNameError(true);
		} 
		else 
		{
			setFirstNameError(false);

			DbProfile.updateFirstName(firstName)
			.then((result: number) => 
			{
				if (result == 1)
				{
					console.log('First name updated successfully');
				}           
			})
			.catch((error) => 
			{
				console.error('Failed to fetch profile:', error);
			});
		}
		
	}

	/* Quicksave: Last Name */
	useEffect(() => 
	{
		handleSaveLastName();
	}, [lastName]);

	const handleSaveLastName = () => 
	{
		if (lastName == '')
		{
			setLastNameError(true);
		} 
		else 
		{
			setLastNameError(false);

			DbProfile.updateLastName(lastName)
			.then((result: number) => 
			{
				if (result == 1)
				{
					console.log('Last name updated successfully');
				}           
			})
			.catch((error) => 
			{
			console.error('Failed to fetch profile:', error);
			});
		}
	}

	useEffect(() => 
	{
		handleNotifications();
	}, [notiIsEnabled]);

	const handleNotifications = () => 
	{
		let notifications = notiIsEnabled ? 1 : 0;
		// DBSettings.updSettings(settings.expire_warn_counter,notifications,settings.quotes,settings.quizMode,settings.planType).then(() => {
		//     setSettingsUpdated(true);
		// });
	}

	useEffect(() => 
	{
		handleQuotes();
	}, [quotesIsEnabled]);

	const handleQuotes = () => 
	{
		let quotes = quotesIsEnabled ? 1 : 0;
		// DBSettings.updSettings(settings.expire_warn_counter,settings.notifications,quotes,settings.quizMode,settings.planType).then(() => {
		//     setSettingsUpdated(true);
		// });
	}
	
	useEffect(() => 
	{
		handleQuizMode();
	}, [quizIsEnabled]);

	const handleQuizMode = () => 
	{
		let quizMode = quizIsEnabled ? 1 : 0;
		// DBSettings.updSettings(settings.expire_warn_counter,settings.notifications,settings.quotes,quizMode,settings.planType).then(() => {
		//     setSettingsUpdated(true);
		// });
	}

	useEffect(() => 
	{
		if (newPassword != confirmPassword)
		{
			setPasswordMatchError(true);
		} 
		else 
		{
			setPasswordMatchError(false);
		}
	}, [newPassword, confirmPassword]);
	
	const handleSavePassword = async () => 
	{
		console.log('Gonna do pwd php thingy');
		try 
		{
			console.log('Creds:', email, currentPassword, newPassword);
			const res = await changeCreds(email, currentPassword, newPassword);
			const status = res.status;
			const result = res.result;

			if (status)
			{
				Alert.alert(
					'Change Password',
					res.message,
					[
						{text: 'OK', onPress: () => console.log('OK Pressed')},
					],
					{cancelable: false},
				);
				setCurrentPassword('');
				setNewPassword('');
				setPasswordMatchError(false);
				setConfirmPassword('');
			} 
			else 
			{
				Alert.alert(
					'Change Password Error',
					res.message,
					[
						{text: 'OK', onPress: () => console.log('OK Pressed')},
					],
					{cancelable: false},
				);
			}
		} 
		catch(error)
		{
			console.log('Ooops, something went wrong:', error);
		}
		/**
		 * Need to do an api call
		 * Send current password and new password (validation needed to compare new & confirm password)
		 * Send to php to verify and change and receive a result
		 * Present alert if ok or not
		 */
		// if (oldPassword === currentPassword)
		// {
		//     const showToast = () => {
		//         Toast.show({
		//             type: 'success',
		//             text1: 'Success',
		//             text2: 'The password has been successfully updated 👋'
		//         });
		//     }

		//     DbProfile.savePassword(confirmPassword)
		//     .then((result: number) => 
		//     {
		//         console.log('Result:', result); 

		//         if (result == 1)
		//         {
		//             console.log('PWD Change 222');
		//             showToast();
		//             props.navigation.navigate('MainScreen');
		//             console.log('Quiz mode updated successfully');
		//         } 
		//     })
		//     .catch((error) => 
		//     {
		//         console.error('Failed to fetch profile:', error);
		//     });

		// }
		// else 
		// {
		//     console.error('Sumting wong:', oldPassword + ' > ' + currentPassword);
		// }
	}

    const handleSignOut = async () => 
    {
        DbProfile.clearToken()
        .then((result: any) => 
        {
            console.log('Result:', result.rowsAffected); 
            if (result.rowsAffected == 1)
            {
                // props.navigation.navigate('Login', { email: 'bruce@gmail.com', password: '', firstTimeLogin: 1, token: 0});
                props.navigation.navigate('Login', { email: email, password: '', firstTimeLogin: 1, token: 0});
            }           
        })
        .catch((error) => 
        {
            console.error('Failed to fetch profile:', error);
        });
    }

    const handleCloseAccount = () => 
    {
        props.navigation.navigate('ProfileDelete');
    }

    const renderHeader = (section, _, isActive) => 
    {
        return (
            <View style={[MainStyles.cardRowBox, {borderBottomStartRadius: 0, borderBottomEndRadius: 0}]}>
                <Image source={require('../../assets/images/pm_current_plan.png')} />
                <Text style={[MainStyles.textLeft, {flex: 1, paddingLeft: 10}]}>{section}</Text>
                {isActive ? <Image source={openIcon} /> : <Image source={closeIcon} />}
          </View>
        );
    };

    const renderContent = (section, index, isActive) => 
    {
        console.log('onePackage: ', planType);
        if (isActive) {
            if (planType == 1)
            {
                return (
                    <View style={[MainStyles.cardColumnBox, {borderTopStartRadius: 0, borderTopEndRadius: 0}]}>
                        <Text style={[MainStyles.h6, MainStyles.textBold, MainStyles.mb_0]}>{subscribed === 0 ? 'Coaching Plan (Trial)' : 'Coaching Plan'}</Text>
                        
                        <Text style={[MainStyles.h5, MainStyles.textSubtle, MainStyles.mb_0]}>Payment: $126 Annually</Text>
                        <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_2, MainStyles.w_100]} onPress={handleCancel}>
                            <Text style={MainStyles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
        
                        <TouchableOpacity style={[MainStyles.mt_2, MainStyles.w_100]} onPress={handleCancel}>
                            <Text style={[MainStyles.h5, MainStyles.textSubtle, MainStyles.textCenter, MainStyles.w_100, MainStyles.mt_0, MainStyles.mb_0]}>CHANGE PAYMENT DETAILS</Text>
                        </TouchableOpacity>
                    </View>
                    );
            }
            else 
            {
                return (
                    <View style={[MainStyles.cardColumnBox, {borderTopStartRadius: 0, borderTopEndRadius: 0}]}>
                        <Text style={[MainStyles.h6, MainStyles.textBold, MainStyles.mb_0]}>Free Plan</Text>
                        <Text style={[MainStyles.h4, MainStyles.textSubtle, MainStyles.textBold, MainStyles.mb_0]}>$0</Text>
                        <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_2, MainStyles.w_100]} onPress={handleCancel}>
                            <Text style={MainStyles.buttonText}>Change</Text>
                        </TouchableOpacity>
                        <Text style={[MainStyles.h5, MainStyles.textSubtle, MainStyles.textCenter, MainStyles.w_100, MainStyles.mt_2, MainStyles.mb_1]}>CHANGE PAYMENT DETAILS</Text>
                    </View>
                    );
            }
            
        } 
        else 
        {
            
        }
        return null;
    };

    const renderAccountSettingsHeader = (section, _, isActive) => 
    {
        return (
            <View style={[MainStyles.cardRowBox, {borderBottomStartRadius: 0, borderBottomEndRadius: 0}]}>
                <Image source={require('../../assets/images/pm_password.png')} />
                <Text style={[MainStyles.textLeft, {flex: 1, paddingLeft: 10}]}>{section}</Text>
                {isActive ? <Image source={openIcon} /> : <Image source={closeIcon} />}
          </View>
        );
    }

    const renderAccountSettingsContent = (section, index, isActive) => 
    {
        if (isActive) {
            return (
            <View style={[MainStyles.cardColumnBox, {borderTopStartRadius: 0, borderTopEndRadius: 0}]}>
                <Text>Current Password</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput style={MainStyles.input} value={currentPassword} placeholder="Enter current password" secureTextEntry={!isNewPasswordVisible} onChangeText={text => setCurrentPassword(text)} />
                    <TouchableOpacity onPress={toggleNewPasswordVisibility}>
                        <Feather name={isNewPasswordVisible ? 'eye-off' : 'eye'} size={20} />
                    </TouchableOpacity>
                </View>
                <Text>New Password</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput style={MainStyles.input} value={newPassword} placeholder="Enter new password" secureTextEntry={!isNewPasswordVisible} onChangeText={text => setNewPassword(text)} />
                    <TouchableOpacity onPress={toggleNewPasswordVisibility}>
                        <Feather name={isNewPasswordVisible ? 'eye-off' : 'eye'} size={20} />
                    </TouchableOpacity>
                </View>
                <Text>Confirm New Password</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput style={MainStyles.input} value={confirmPassword} placeholder="Confirm new password" secureTextEntry={!isConfirmPasswordVisible} onChangeText={text => setConfirmPassword(text)} />
                    <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                        <Feather name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={20} />
                    </TouchableOpacity>
                </View>
                {paswordMatchError && <Text style={[MainStyles.errorText]}>Passwords do not match.</Text>}
                <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_2, MainStyles.w_100]} onPress={handleSavePassword}>
                    <Text style={MainStyles.buttonText}>Save New Password</Text>
                </TouchableOpacity>
            </View>
            );
        }
        return null;
    }

    const handleCancel = () => 
    {
        props.navigation.navigate('ProfileCancel');
    }

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
                <View style={MainStyles.backContainer} >
                    <BackTextTopBar navigation={props.navigation} title="Settings" />
                    <ScrollView style={{ width: '100%' }}>
                        <View style={[MainStyles.container, { flex: 1, justifyContent: 'flex-start', paddingTop: 0}]}>
                            <Image source={require('../../assets/images/profile_pic.png')} style={{width: 72, height: 72}} />
                            <Text style={[MainStyles.h4, MainStyles.textBold, MainStyles.mt_2, MainStyles.mb_0]}>{firstName} {lastName}</Text>
                            <Text style={MainStyles.h6}>{email}</Text>

                            <Text style={[MainStyles.h6, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.textSubtle]}>GENERAL</Text>
                            <View style={[MainStyles.cardColumnBox, MainStyles.mb_4, {borderTopStartRadius: 0, borderTopEndRadius: 0}]}>
                                <Text>First Name</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput style={[MainStyles.input, MainStyles.mb_0]} placeholder="Enter first name" value={firstName} onChangeText={text => setFirstName(text)}  />
                                    <TouchableOpacity onPress={toggleNewPasswordVisibility}>
                                        <Feather name={isNewPasswordVisible ? 'eye-off' : 'eye'} size={20} />
                                    </TouchableOpacity>
                                </View>
                                {firstNameError && <Text style={[MainStyles.errorText, MainStyles.mt_2]}>First name is required.</Text>}
                                <Text style={[MainStyles.mt_3]}>Last Name</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput style={[MainStyles.input, MainStyles.mb_1]} placeholder="Enter last name" value={lastName} onChangeText={text => setLastName(text)} />
                                    <TouchableOpacity onPress={toggleNewPasswordVisibility}>
                                        <Feather name={isNewPasswordVisible ? 'eye-off' : 'eye'} size={20} />
                                    </TouchableOpacity>
                                </View>
                                {lastNameError && <Text style={[MainStyles.errorText, MainStyles.mt_2]}>Last name is required.</Text>}
                            </View>

                            <Text style={[MainStyles.h6, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.textSubtle]}>NOTIFICATIONS</Text>
                            <View style={MainStyles.cardRowBox}>
                                <Image source={require('../../assets/images/pm_notifications.png')} />
                                <Text style={[MainStyles.textLeft, {flex: 1, paddingLeft: 10}]}>Notifications</Text>
                                <Switch
                                trackColor={{ false: "#767577", true: "#c9d0e4" }}
                                thumbColor={notiIsEnabled ? "#395dc3" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={notificationSwitch}
                                value={notiIsEnabled}
                                />
                            </View>
                            <Text style={[MainStyles.h6, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.textSubtle, MainStyles.mt_4]}>MESSAGES</Text>
                            <View style={[MainStyles.cardRowBox, { borderBottomStartRadius: 0, borderBottomEndRadius: 0 }]}>
                                <Image source={require('../../assets/images/pm_quotes.png')} />
                                <Text style={[MainStyles.textLeft, {flex: 1, paddingLeft: 10}]}>Motivational Quotes</Text>
                                <Switch
                                trackColor={{ false: "#767577", true: "#c9d0e4" }}
                                thumbColor={quotesIsEnabled ? "#395dc3" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={quotesSwitch}
                                value={quotesIsEnabled}
								disabled = {quotesSwitchDisabled}
                                />
                            </View>
                            <View style={[MainStyles.cardRowBox, { borderTopStartRadius: 0, borderTopEndRadius: 0 }]}>
                                <Image source={require('../../assets/images/pm_quiz.png')} />
                                <Text style={[MainStyles.textLeft, {flex: 1, paddingLeft: 10}]}>Quiz Mode</Text>
                                <Switch
                                trackColor={{ false: "#767577", true: "#c9d0e4" }}
                                thumbColor={quizIsEnabled ? "#395dc3" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={quizSwitch}
                                value={quizIsEnabled}
								disabled = {quizSwitchDisabled}
                                />
                            </View>
                            <Text style={[MainStyles.h6, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.textSubtle, MainStyles.mt_4]}>PRICING PLAN</Text>
                            <View style={{width: '100%'}}>
                                <Accordion
                                sections={['Current Plan']}
                                activeSections={activeSections}
                                renderHeader={renderHeader}
                                renderContent={renderContent}
                                onChange={setActiveSections}
                                touchableProps={{ underlayColor: '#00000040' }}  />
                            </View>
                            <Text style={[MainStyles.h6, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100, MainStyles.mb_1, MainStyles.textSubtle, MainStyles.mt_4]}>ACCOUNT SETTINGS</Text>
                            <View style={{width: '100%'}}>
                                <Accordion
                                sections={['Password & Security']}
                                activeSections={activeAcSections}
                                renderHeader={renderAccountSettingsHeader}
                                renderContent={renderAccountSettingsContent}
                                onChange={setActiveAcSections}
                                touchableProps={{ underlayColor: '#00000040' }}  />
                            </View>
                            <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_2, MainStyles.w_100, MainStyles.mt_3, { marginLeft: 24, marginRight: 24}]} onPress={handleSignOut}>
                                <Text style={MainStyles.buttonText}>Sign Out</Text>
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={handleCloseAccount}>
                                <Text style={[MainStyles.h5, MainStyles.textSubtle, MainStyles.textCenter, MainStyles.w_100, MainStyles.mt_2, MainStyles.mb_1]}>Close Account</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
        </ImageBackground>
    );
};

export default ProfileManage;