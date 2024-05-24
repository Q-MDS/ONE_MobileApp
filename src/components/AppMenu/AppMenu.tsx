import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { ImageSourcePropType } from 'react-native';
import { Alert } from 'react-native';

type AppMenuProps = {
    navigation: any;
    activeItem: number;
};

const AppMenu = (props: AppMenuProps) => 
{
    let appMenuOneIcon: ImageSourcePropType = require('../../assets/images/app_menu_one_off.png');
    if (props.activeItem === 0) { appMenuOneIcon = require('../../assets/images/app_menu_one.png') };
    let appMenuAnalysisIcon: ImageSourcePropType = require('../../assets/images/app_menu_analysis_off.png');
    if (props.activeItem === 1) { appMenuAnalysisIcon = require('../../assets/images/app_menu_analysis.png') };
    let appMenuMessagesIcon: ImageSourcePropType = require('../../assets/images/app_menu_messages_off.png');
    if (props.activeItem === 2) { appMenuMessagesIcon = require('../../assets/images/app_menu_messages.png') };

	// Testing variables: Get from settings...
	let diaryMode:number = 1;
	let planType:number = 0;

	const handleMainScreen = () => 
	{
		props.navigation.navigate('MainScreen');
	}

	const handleAnalitics = () =>
	{
		if (planType === 1 && diaryMode === 1)
		{
			Alert.alert(
			'Disabled',
			'Please setup your diary in order to access this feature',
			[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
			],
			{cancelable: false},
			);	

		}
		else if(planType === 1 && diaryMode === 0)
		{
			props.navigation.navigate('AnalysisOverall');
		}
		else 
		{
			Alert.alert(
			'Disabled',
			'Please upgrade your plan to access this feature',
			[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
			],
			{cancelable: false},
			);	
		}
	}

	const handleQuotes = () => 
	{
		if (planType === 1 && diaryMode === 1)
		{
			Alert.alert(
			'Disabled',
			'Please setup your diary in order to access this feature',
			[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
			],
			{cancelable: false},
			);	

		}
		else if(planType === 1 && diaryMode === 0)
		{
			props.navigation.navigate('MessagesQuotes');
		}
		else 
		{
			Alert.alert(
			'Disabled',
			'Please upgrade your plan to access this feature',
			[
				{text: 'OK', onPress: () => console.log('OK Pressed')},
			],
			{cancelable: false},
			);	
		}
	}

  	return (
		<View style={styles.container}>
			<View style={ styles.btn_one }>
				<TouchableOpacity
					onPress={handleMainScreen}>
					<Image source={appMenuOneIcon} style={{width: 24, height: 24}}  />
				</TouchableOpacity>
			</View>
			{/* Removed the View and button response improved */}
				<TouchableOpacity
					onPress={handleAnalitics}>
					<Image source={appMenuAnalysisIcon} style={{width: 24, height: 24}}  />
				</TouchableOpacity>
			
			<View style={ styles.btn_messages }>
				<TouchableOpacity
					onPress={handleQuotes }>
					<Image source={appMenuMessagesIcon} style={{width: 24, height: 24}}  />
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: 45,
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    btn_one: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingStart: 20,
    },
    btn_analysis: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn_messages: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingEnd: 20,
    }
  });

export default AppMenu