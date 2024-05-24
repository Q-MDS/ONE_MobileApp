import React, { useState } from 'react';
import Datapool from '../../services/Datapool';
import { TextInputMask } from 'react-native-masked-text';
import { ImageBackground, View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import backgroundImage from '../../assets/images/app_bg_sky.png';
import MainStyles from '../../assets/MainStyles';

const dp = Datapool.getInstance();

const SignupCoachingPayment = ( props: any ) => 
{
    const[cardNumber, setCardNumber] = useState('1234 5678 9012 3456');
    const[cardName, setCardName] = useState('Harry Potter');
    const[cardExpiry, setCardExpiry] = useState('1224');
    const[cardCvv, setCardCvv] = useState('123');
    const [isSaveCard, setIsSaveCard] = useState(false);

    const [errors, setErrors] = useState<{ cardNumber?: string, cardName?: string, cardExpiry?: String, cardCvv?: String}>({});

    const validateForm = () => {
        let tempErrors = {};

        if (!cardNumber) {
        tempErrors = { ...tempErrors, cardNumber: 'Card number is required' };
        }

        if (cardNumber.length < 19) 
        {
            tempErrors = { ...tempErrors, cardNumber: 'Card number must be 16 digits long' };
        }

        if (!cardName) {
        tempErrors = { ...tempErrors, cardName: 'Name on card is required' };
        }

        if (!cardExpiry) {
        tempErrors = { ...tempErrors, cardExpiry: 'Expiry date is required' };
        }

        if (!cardCvv) {
        tempErrors = { ...tempErrors, cardCvv: 'CVV is required' };
        }

        setErrors(tempErrors);

        // Only proceed with handleSignUp if there are no errors
        if (Object.keys(tempErrors).length === 0) 
        {
            handleConfirm();
        }
    };

    const handleConfirm = () => 
    {
        dp.set('signupCardNumber', cardNumber);
        dp.set('signupCardName', cardName);
        dp.set('signupCardExpiry', cardExpiry);
        dp.set('signupCardCvv', cardCvv);

        let saveCard = '0';
        if (isSaveCard) { saveCard = '1'; }
        dp.set('signupIsSaveCard', saveCard);

        props.navigation.navigate('SignupCoachingPaymentDone');
    };

  return (
    <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
        <View style={MainStyles.container}>
            <Text style={[MainStyles.h0, MainStyles.textBold]}>$126</Text>
            <Image source={require('../../assets/images/credit_cards.png')} style={{ width: 75 }} />
            <Text style={[MainStyles.h5, MainStyles.mt_4]}>Pay securely with your Bank Account using Visa or Mastercard</Text>
            <Text style={[MainStyles.label, MainStyles.w_100]}>Credit Card Number *</Text>
            <TextInputMask type={'custom'} options={{  mask: '9999 9999 9999 9999' }} value={cardNumber} style={MainStyles.input} placeholder='XXXX-XXXX-XXXX-XXXX' onChangeText={text => setCardNumber(text)} />
            {errors.cardNumber && <Text style={[MainStyles.errorText]}>{errors.cardNumber}</Text>}
            <Text style={[MainStyles.label, MainStyles.w_100]}>Name on Card *</Text>
            <TextInput placeholder="Name on Card" style={MainStyles.input} value={cardName} onChangeText={text => setCardName(text)} />
            {errors.cardName && <Text style={[MainStyles.errorText]}>{errors.cardName}</Text>}            
            <View style={MainStyles.row}>
                <View style={MainStyles.col}>
                    <Text style={[MainStyles.label, MainStyles.w_100]}>Expiry Date (MM/YY) *</Text>
                    {/* <TextInput placeholder="Expiry Date (MM/YY)" style={MainStyles.input} value={cardExpiry} onChangeText={text => setCardExpiry(text)} /> */}
                    <TextInputMask 
                    type={'custom'} 
                    options={{ mask: '99/99' }} 
                    style={MainStyles.input} 
                    placeholder="MM/YY"  
                    value={cardExpiry} 
                    onChangeText={text => 
                        {
                        const month = parseInt(text.substring(0, 2));
                        
                        if (month > 0 && month <=12)
                        {
                            setCardExpiry(text);
                        } 
                        else 
                        {
                            setCardExpiry('');
                        }
                    }} />
                    {errors.cardExpiry && <Text style={[MainStyles.errorText]}>{errors.cardExpiry}</Text>}     
                </View>
                <View style={MainStyles.col}>
                    <Text style={[MainStyles.label, MainStyles.w_100]}>CVV Code *</Text>
                    <TextInputMask type={'custom'}  options={{ mask: '999' }} style={MainStyles.input} placeholder="CVV" value={cardCvv} onChangeText={text => setCardCvv(text)} />
                    {errors.cardCvv && <Text style={[MainStyles.errorText]}>{errors.cardCvv}</Text>} 
                </View>
            </View>
            <View style={MainStyles.formGroupRow}>
                <CheckBox value={isSaveCard} onValueChange={setIsSaveCard} />
                <Text>Save card for future payments</Text>
            </View>
            <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={validateForm}>
                <Text style={[MainStyles.buttonText]}>Confirm</Text>
            </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

export default SignupCoachingPayment;