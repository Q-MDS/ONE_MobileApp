import React from 'react';
import settings from '../../../settings';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_mountains.png';

const PurposeListSetup = ( props: any ) => 
{
    // Manage screen left/right swipe and tap
    // const [isSwiping, setIsSwiping] = React.useState(false);
    // const [initialGestureX, setInitialGestureX] = React.useState(0);
    // const [finalGestureX, setFinalGestureX] = React.useState(0);
    // const swipeThreshold = settings.swipeThreshold; 

    const handlePlanNow = () => 
    {
        props.navigation.navigate('OneWorkSchedule');
    };

    const handleSetLater = () => 
    {
        props.navigation.navigate('SetLater');
    };

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={MainStyles.container} >
                <View style={{marginBottom:80}}>
                    <Text style={[ MainStyles.h1, MainStyles.textSerif]}>Plan ONE</Text>
                    <Text style={ [MainStyles.h5, { marginBottom: 0, paddingStart:20, paddingEnd: 20}]}>It's time to plan your week schedule.</Text>
                    <Text style={ [MainStyles.h5, { marginTop: 0, paddingStart:40, paddingEnd: 40}]}>Set 1 to 2 hours to plan your ONE journey.</Text>
                </View>

                <View style={[MainStyles.div, { position: 'absolute', width: '100%', bottom: 0, marginBottom: 55}]}>
                    <TouchableOpacity style={[MainStyles.button_primary, { width: '100%'}]} onPress={handlePlanNow}>
                        <Text style={MainStyles.buttonText}>Plan Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[MainStyles.button_secondary, MainStyles.mt_3, { width: '100%'}]} onPress={handleSetLater}>
                        <Text style={[MainStyles.buttonText, { color: '#000000'}]}>Set a Time for Later</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ImageBackground>
    );
};

export default PurposeListSetup;