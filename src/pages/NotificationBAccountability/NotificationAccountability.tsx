import React, { useState } from 'react';
import MainStyles from '../../assets/MainStyles';
import BackButton from '../../components/BackButton/BackButton';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import backgroundImage from '../../assets/images/app_bg_sky.png';

const NotificationAccountability = ( props: any ) => 
{
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        props.navigation.navigate('NotificationAccountabilityResult', { selectedValue: value });
    };

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
        <BackButton/>
            <View style={[MainStyles.container] }>
                <Text style={[MainStyles.h2, MainStyles.textCenter, MainStyles.textSerif]}>Accountability</Text>
                <View style={MainStyles.w_100}>
                    <Text style={[MainStyles.h5, MainStyles.textLeft, MainStyles.textBold, MainStyles.mt_2]}>What are you doing now?</Text>
                    <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton value="Sports" />
                    <Text>Sports</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton value="Family Time" />
                    <Text>Family Time</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton value="Yoga" />
                    <Text>Yoga</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton value="Meditation" />
                    <Text>Meditation</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton value="Work" />
                    <Text>Work</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton value="Class Time" />
                    <Text>Class Time</Text>
                    </View>
                    </RadioButton.Group>
                </View>
                <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={handleSubmit} >
                    <Text style={MainStyles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default NotificationAccountability;