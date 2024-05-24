import React from 'react';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, TouchableOpacity, Text, View } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';

/**
 * Can remove this file/page
 */
const DiarySetup = () => 
{
	const handleCopyDiary = () => 
	{
		console.log('Copy the diary');
	}

	const handleNewDiary = () =>
	{
		console.log('Create a new diary');
	}

	const handleSkip = () => 
	{
		console.log('Skip the diary setup');
	}

  return (
	<ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
		<View style={MainStyles.container}>
			<TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={handleCopyDiary}>
				<Text style={[MainStyles.buttonText]}>Use current diary setup</Text>
			</TouchableOpacity>
			<Text style={MainStyles.mt_3}>This will keep your diary setup the same. Any activities that were added after the ONE Plan setup will be removed.</Text>
			<TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={handleNewDiary}>
				<Text style={[MainStyles.buttonText]}>Setup new diary for the week</Text>
			</TouchableOpacity>
			<Text style={MainStyles.mt_3}>Go thru the ONE Plan setup wizard to create a new diary.</Text>
			<TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={handleSkip}>
				<Text style={[MainStyles.buttonText]}>Skip</Text>
			</TouchableOpacity>
			<Text style={MainStyles.mt_3}>If you skip then you will have an empty diary. You can add your own activities but the quotes, quiz mode and analytics will be disabled.</Text>
		</View>
	</ImageBackground>
  )
}

export default DiarySetup
