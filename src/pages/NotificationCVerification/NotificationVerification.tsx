import React, { useState } from 'react';
import MainStyles from '../../assets/MainStyles';
import BackButton from '../../components/BackButton/BackButton';
import { ImageBackground, View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { RadioButton } from 'react-native-paper';
import backgroundImage from '../../assets/images/app_bg_sky.png';

const hours = Array.from({length: 12}, (_, i) => ({hour: `0${7 + i}:00`, checked: false, description: `Activity at 0${7 + i}:00`}));

const NotificationVerification = ( props: any ) => 
{
  const [data, setData] = useState(hours);
  const today = new Date();

  const handleCheck = (index: number) => 
  {
    setData(data.map((item, i) => i === index ? {...item, checked: !item.checked} : item));
  };

  const handleNext = () => 
    {
        props.navigation.navigate('NotificationVerificationResult')
    };

  return (
    <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
        <BackButton/>
        <View style={[MainStyles.container] }>
            <Text style={[MainStyles.h2, MainStyles.textCenter, MainStyles.textSerif, MainStyles.mt_5]}>Verify Daily Activities</Text>
            <Text style={[MainStyles.h6, MainStyles.w_100,MainStyles.textLeft, MainStyles.textBold]}>{today.toDateString()}</Text>
            <FlatList
                style={[MainStyles.w_100]}
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <RadioButton
                    value={item.description}
                    status={item.checked ? 'checked' : 'unchecked'}
                    onPress={() => handleCheck(index)}
                    />
                    <Text style={{ width: 50 }}>{item.hour}</Text>
                    <Text style={[ MainStyles.textLeft, { flex: 1, textAlign: 'right', paddingLeft: 10  }]}>{item.description}</Text>
                </View>
                )}
            />
            <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4, MainStyles.buttonFull]} onPress={ handleNext }>
                <Text style={MainStyles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

export default NotificationVerification;