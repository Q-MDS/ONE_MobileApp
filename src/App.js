import React, { useState, useEffect } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import SettingsContext from './services/SettingsContext';
import NotificationUtils from './services/NotificationUtils';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DbHelper from './services/DbHelper';
import DbSetup from './services/DbSetup';
import DbProfile from './services/DbProfile';
import DBSettings from './services/DBSettings';

import FsOne from './utils/FsOne';
import OnboardingOne from './pages/OnboardingOne/OnboardingOne';
import OnboardingTwo from './pages/OnboardingTwo/OnboardingTwo';
import OnboardingThree from './pages/OnboardingThree/OnboardingThree';
import Login from './pages/Login/Login';
import SignupStart from './pages/SignupAStart/SignupStart';
import SignupDone from './pages/SignupDone/SignupDone';
import SignupPlans from './pages/SignupATPlans/SignupPlans'; // Not used
import SignupOptionFree from './pages/SignupBOptionFree/SignupOptionFree';// Not used
import SignupOptionCoaching from './pages/SignupCOptionCoaching/SignupOptionCoaching';// Not used
import SignupCoachingOptions from './pages/SignupDCoachingOptions/SignupCoachingOptions';// Not used
import SignupCoachingPayment from './pages/SignupECoachingPayment/SignupCoachingPayment';// Not used
import SignupCoachingPaymentDone from './pages/SignupFCoachingPaymentDone/SignupCoachingPaymentDone';// Not used
import FsTwo from './utils/FsTwo';
import PurposeListIntro from './pages/PurposeListAInto/PurposeListInto';
import PurposeListPhysical from './pages/PurposeListBPhysical/PurposeListPhysical';
import PurposeListEmotional from './pages/PurposeListCEmotional/PurposeListEmotional';
import PurposeListMental from './pages/PurposeListDMental/PurposeListMental';
import PurposeListSpiritual from './pages/PurposeListESpiritual/PurposeListSpiritual';
import PurposeListSetup from './pages/PurposeListFSetup/PurposeListSetup';
import SetLater from './pages/SetLater/SetLater';
import MainScreen from './pages/MainScreen/MainScreen';
import OneIntro from './pages/OneAInto/OneIntro';
import SetupStart from './pages/OneAInto/SetupStart';
import SetupDefaults from './pages/OneAInto/SetupDefaults';
import OneWorkSchedule from './pages/OneBWorkSchedule/OneWorkSchedule';
import OneClassSchedule from './pages/OneCClassSchedule/OneClassSchedule';
import OneSleepSchedule from './pages/OneDSleepSchedule/OneSleepSchedule';
import OneEatingSchedule from './pages/OneEEatingSchedule/OneEatingSchedule';
import OnePrepSchedule from './pages/OneFPrepSchedule/OnePrepSchedule';
import OneCommuteSchedule from './pages/OneGCommuteSchedule/OneCommuteSchedule';
import OneLetsGo from './pages/OneHLetsGo/OneLetsGo';
import OneSetPhysical from './pages/OneISetPhysical/OneSetPhysical';
import OneSetEmotional from './pages/OneJSetEmotional/OneSetEmotional';
import OneSetMental from './pages/OneKSetMental/OneSetMental';
import FsThree from './utils/FsThree';
import OneSetSpiritual from './pages/OneLSetSpiritual/OneSetSpiritual';
import OneSetCoaching from './pages/OneMSetCoaching/OneSetCoaching';
import OneSetReminders from './pages/OneNSetReminders/OneSetReminders';
import ProfileManage from './pages/ProfileAManage/ProfileManage';
import ProfileCancel from './pages/ProfileBCancel/ProfileCancel';
import ProfileDelete from './pages/ProfileCDelete/ProfileDelete';
import MessagesQuotes from './pages/MessagesQuotes/MessagesQuotes';
import MessagesPurpose from './pages/MessagesPurpose/MessagesPurpose';
import AnalysisOverall from './pages/AnalysisAOverall/AnalysisOverall';
import AnalysisPhysical from './pages/AnalysisBPhysical/AnalysisPhysical';
import AnalysisEmotional from './pages/AnalysisCEmotional/AnalysisEmotional';
import AnalysisMental from './pages/AnalysisDMental/AnalysisMental';
import AnalysisSpiritual from './pages/AnalysisESpiritual/AnalysisSpiritual';
import AccountabilityScore from './pages/AnalysisFCommon/AccountabilityScore';
import BalanceLevel from './pages/AnalysisFCommon/BalanceLevel';
import BalanceLevelMore from './pages/AnalysisFCommon/BalanceLevelMore';
import Rewards from './pages/AnalysisFCommon/Rewards';
import NotificationList from './pages/NotificationAList/NotificationList';
import NotificationAccountability from './pages/NotificationBAccountability/NotificationAccountability';
import NotificationAccountabilityResult from './pages/NotificationBAccountability/NotificationAccountabilityResult';
import NotificationVerification from './pages/NotificationCVerification/NotificationVerification';
import NotificationVerificationResult from './pages/NotificationCVerification/NotificationVerificationResult';
import AddActivity from './pages/MainScreen/AddActivity';
import ManageActivity from './pages/MainScreen/ManageActivity';
import ManagePemsActivity from './pages/MainScreen/ManagePemsActivity';
import PopQuiz from './pages/PopQuiz/PopQuiz';
import PopQuizDisagree from './pages/PopQuiz/PopQuizDisagree';
import OverallAccountabilityScore from './pages/AnalysisAOverall/OverallAccountabilityScore';
import OverallBalanceLevel from './pages/AnalysisAOverall/OverallBalanceLevel';
import OverallRewards from './pages/AnalysisAOverall/OverallRewards';
import TermsConditions from './pages/SignupAStart/TermConditions';
import StartWeek from './pages/StartWeek/StartWeek';
import CopyDiary from './pages/CopyDiary/CopyDiary';

const Stack = createStackNavigator();

export default function App() 
{
    NotificationUtils.registerTask();

    const [defaultRoute, setDefaultRoute] = useState('OnboardingOne');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [firstTimeLogin, setFirstTimeLogin] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [settings, setSettings] = useState(null);
    const [settingsUpdated, setSettingsUpdated] = useState(true);
    
    useEffect(() => 
    {
        if (settingsUpdated) 
        {
            DBSettings.getSettings().then(setSettings);
            setSettingsUpdated(false);
        }
    }, [settingsUpdated]);

    useEffect(() => 
    {
        // DbSetup.dbReset();
        DbSetup.dbCheck()
        .then((result) => 
        {
            console.log('DbSetup.dbCheck result:', result);
            //let result = await DbProfile.getFirstTimeUse();
            DbProfile.getFirstTimeUse()
            .then((result) => 
            {
                console.log('DbProfile.getFirstTimeUse result:', result.rows.length);
                if (result.rows.length === 0) 
                {
                    setIsLoading(false);
                    setDefaultRoute('OnboardingOne');
                } 
                else 
                {
                    if (result.rows.item(0).first_time_use === 1)
                    {
                        setDefaultRoute('Login');
                        setEmail(result.rows.item(0).cred_1);
                        setFirstTimeLogin(result.rows.item(0).first_time_login);
                        
                        const getToken = result.rows.item(0).token;
    
                        if (getToken !== null || getToken !== '')
                        {
                            setToken(getToken);
                        } 

                        setIsLoading(false);
                    } 
                    else 
                    {
                        // Can handle first_time_use being set to 0 if at a later time in the app it is changed to 0
                    }
                }
            })
        });
    }, []);

    if (isLoading) 
    {
        return null;
    }

    return (
		<>
		<IconRegistry icons={EvaIconsPack} />
		<ApplicationProvider {...eva} theme={eva.light}>
        <SettingsContext.Provider value={{settings, setSettingsUpdated}}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName={defaultRoute} screenOptions={{ headerShown: false }}>
                <Stack.Screen name="FsOne" component={FsOne} />
                <Stack.Screen name="OnboardingOne" component={OnboardingOne} />
                <Stack.Screen name="OnboardingTwo" component={OnboardingTwo} />
                <Stack.Screen name="OnboardingThree" component={OnboardingThree} />
                <Stack.Screen name="Login" component={Login} initialParams={{ email, password: '', token, firstTimeLogin }} />
                <Stack.Screen name="SignupStart" component={SignupStart} />
                <Stack.Screen name="SignupDone" component={SignupDone} />
                <Stack.Screen name="TermsConditions" component={TermsConditions} />
                <Stack.Screen name="SignupPlans" component={SignupPlans} /> 
                <Stack.Screen name="SignupOptionFree" component={SignupOptionFree} />
                <Stack.Screen name="SignupOptionCoaching" component={SignupOptionCoaching} />
                <Stack.Screen name="SignupCoachingOptions" component={SignupCoachingOptions} />
                <Stack.Screen name="SignupCoachingPayment" component={SignupCoachingPayment} />
                <Stack.Screen name="SignupCoachingPaymentDone" component={SignupCoachingPaymentDone} />
                <Stack.Screen name="FsTwo" component={FsTwo} />
                <Stack.Screen name="PurposeListIntro" component={PurposeListIntro} />
                <Stack.Screen name="PurposeListPhysical" component={PurposeListPhysical} />
                <Stack.Screen name="PurposeListEmotional" component={PurposeListEmotional} />
                <Stack.Screen name="PurposeListMental" component={PurposeListMental} />
                <Stack.Screen name="PurposeListSpiritual" component={PurposeListSpiritual} />
                <Stack.Screen name="PurposeListSetup" component={PurposeListSetup} />
                <Stack.Screen name="SetLater" component={SetLater} />
                <Stack.Screen name="MainScreen" component={MainScreen} />
                <Stack.Screen name="OneIntro" component={OneIntro} />
				<Stack.Screen name="SetupStart" component={SetupStart} />
				<Stack.Screen name="SetupDefaults" component={SetupDefaults} />
                <Stack.Screen name="OneWorkSchedule" component={OneWorkSchedule} />
                <Stack.Screen name="OneClassSchedule" component={OneClassSchedule} />
                <Stack.Screen name="OneSleepSchedule" component={OneSleepSchedule} />
                <Stack.Screen name="OneEatingSchedule" component={OneEatingSchedule} />
                <Stack.Screen name="OnePrepSchedule" component={OnePrepSchedule} />
                <Stack.Screen name="OneCommuteSchedule" component={OneCommuteSchedule} />
                <Stack.Screen name="OneLetsGo" component={OneLetsGo} />
                <Stack.Screen name="OneSetPhysical" component={OneSetPhysical} />
                <Stack.Screen name="OneSetEmotional" component={OneSetEmotional} />
                <Stack.Screen name="OneSetMental" component={OneSetMental} />
                <Stack.Screen name="OneSetSpiritual" component={OneSetSpiritual} />
                <Stack.Screen name="FsThree" component={FsThree} />
                <Stack.Screen name="OneSetCoaching" component={OneSetCoaching} />
                <Stack.Screen name="OneSetReminders" component={OneSetReminders} />
                <Stack.Screen name="ProfileManage" component={ProfileManage} />
                <Stack.Screen name="ProfileCancel" component={ProfileCancel} />
                <Stack.Screen name="ProfileDelete" component={ProfileDelete} />
                <Stack.Screen name="MessagesQuotes" component={MessagesQuotes} />
                <Stack.Screen name="MessagesPurpose" component={MessagesPurpose} />
                <Stack.Screen name="AnalysisOverall" component={AnalysisOverall} />
                <Stack.Screen name="OverallAccountabilityScore" component={OverallAccountabilityScore} />
                <Stack.Screen name="OverallBalanceLevel" component={OverallBalanceLevel} />
                <Stack.Screen name="OverallRewards" component={OverallRewards} />
                <Stack.Screen name="AnalysisPhysical" component={AnalysisPhysical} />
                <Stack.Screen name="AnalysisEmotional" component={AnalysisEmotional} />
                <Stack.Screen name="AnalysisMental" component={AnalysisMental} />
                <Stack.Screen name="AnalysisSpiritual" component={AnalysisSpiritual} />
                <Stack.Screen name="AccountabilityScore" component={AccountabilityScore} />
                <Stack.Screen name="BalanceLevel" component={BalanceLevel} />
                <Stack.Screen name="BalanceLevelMore" component={BalanceLevelMore} />
                <Stack.Screen name="Rewards" component={Rewards} />
                <Stack.Screen name="NotificationList" component={NotificationList} />
                <Stack.Screen name="NotificationAccountability" component={NotificationAccountability} />
                <Stack.Screen name="NotificationAccountabilityResult" component={NotificationAccountabilityResult} />
                <Stack.Screen name="NotificationVerification" component={NotificationVerification} />
                <Stack.Screen name="NotificationVerificationResult" component={NotificationVerificationResult} />
                <Stack.Screen name="AddActivity" component={AddActivity} />
                <Stack.Screen name="ManageActivity" component={ManageActivity} />
                <Stack.Screen name="ManagePemsActivity" component={ManagePemsActivity} />
                <Stack.Screen name="PopQuiz" component={PopQuiz} />
                <Stack.Screen name="PopQuizDisagree" component={PopQuizDisagree} />
                <Stack.Screen name="StartWeek" component={StartWeek} />
                <Stack.Screen name="CopyDiary" component={CopyDiary} />
                
                {/* <Stack.Screen name="SignupOptions" component={SignupOptions} /> */}
                </Stack.Navigator>
                <Toast />
            </NavigationContainer>
        </SettingsContext.Provider>
		</ApplicationProvider>
		</>
    );
}
