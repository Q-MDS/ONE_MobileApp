import React from 'react'
import MainStyles from '../../assets/MainStyles';
import { SafeAreaView } from 'react-native'
import { ImageBackground, View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';
import CheckBox from '@react-native-community/checkbox';

const SignupDone = ({route, navigation}) => 
{
    const [isSelected1, setSelection1] = React.useState(true);
    const [isSelected2, setSelection2] = React.useState(true);
    const [isSelected3, setSelection3] = React.useState(true);
    const [isSelected4, setSelection4] = React.useState(true);

    console.log('Props:', route);

    const handlegetStarted = () => 
    {
        const { credOne, credTwo, token } = route.params;
        navigation.navigate('Login', { email: credOne, password: credTwo, token: token});
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
                <View style={MainStyles.container}>
                    <Text style={[MainStyles.h1, MainStyles.textSerif, MainStyles.textCenter, MainStyles.w_100, MainStyles.mb_1]}>Welcome to ONE</Text>
                    <Text style={[MainStyles.h2, MainStyles.textCenter, MainStyles.w_100, MainStyles.mb_5]}>Thank you for signing up!</Text>
                    <Text style={[MainStyles.h4, MainStyles.textCenter, MainStyles.w_100, MainStyles.mb_4]}>Tap on Lets Get Started to begin your 21 day FREE trial of the Coaching Plan</Text>
                    <Text style={[ MainStyles.h2, MainStyles.textBold, MainStyles.mb_1]}>Coaching Version</Text>
                    <Text style={[ MainStyles.h5, MainStyles.textSubtle, MainStyles.mb_4]}>Includes 21 day free trial</Text>
                    <Text style={[ MainStyles.h2, MainStyles.textBold, MainStyles.textLeft, MainStyles.w_100]}>Features:</Text>
                    <View style={ [ MainStyles.bb, MainStyles.mb_2 ] } />
                    <View style={ MainStyles.formGroupRow}>
                        <CheckBox
                        value={isSelected1}
                        onValueChange={setSelection1}
                        />
                        <Text style={[ MainStyles.h5, MainStyles.mb_0, MainStyles.w_100, MainStyles.textLeft ]}>Activity Recommendations</Text>
                    </View>
                    <View style={ [ MainStyles.bb, MainStyles.mt_2, MainStyles.mb_2 ] } />
                    <View style={ MainStyles.formGroupRow}>
                        <CheckBox
                        value={isSelected2}
                        onValueChange={setSelection2}
                        />
                        <Text style={[ MainStyles.h5, MainStyles.mb_0, MainStyles.w_100, MainStyles.textLeft ]}>Quotes</Text>
                    </View>
                    <View style={ [ MainStyles.bb, MainStyles.mt_2, MainStyles.mb_2 ] } />
                    <View style={ MainStyles.formGroupRow}>
                        <CheckBox
                        value={isSelected3}
                        onValueChange={setSelection3}
                        />
                        <Text style={[ MainStyles.h5, MainStyles.mb_0, MainStyles.w_100, MainStyles.textLeft ]}>Pop Quizzes</Text>
                    </View>
                    <View style={ [ MainStyles.bb, MainStyles.mt_2, MainStyles.mb_2 ] } />
                    <View style={ MainStyles.formGroupRow}>
                        <CheckBox
                        value={isSelected4}
                        onValueChange={setSelection4}
                        />
                        <Text style={[ MainStyles.h5, MainStyles.mb_0, MainStyles.w_100, MainStyles.textLeft ]}>Analysis Plan</Text>
                    </View>
                    <View style={ [ MainStyles.bb, MainStyles.mt_2, MainStyles.mb_2 ] } />
                    <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_3]} onPressIn={handlegetStarted} >
                        <Text style={[MainStyles.buttonText]}>Lets Get Started</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default SignupDone