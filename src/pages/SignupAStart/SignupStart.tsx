import React, { useState } from 'react';
import DbProfile from '../../services/DbProfile';
import { Alert } from 'react-native';
import { ImageBackground, View, TextInput, Button, TouchableOpacity } from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
import { CheckBox, Text } from '@ui-kitten/components';
import backgroundImage from '../../assets/images/app_bg_sky.png';
import MainStyles from '../../assets/MainStyles';

const SignupStart = ( props: any ) => 
{
    const[firstName, setFirstName] = useState('Bruce');
    const[lastName, setLastName] = useState('Banner');
    const[email, setEmail] = useState('bruce@gmail.com');
    const[password, setPassword] = useState('123456');
    const[confirmPassword, setConfirmPassword] = useState('123456');
    const [isSelected, setSelection] = React.useState(false);
    const [remoteId, setRemoteId] = useState(0);

    const [errors, setErrors] = useState<{ firstName?: string, lastName?: string, email? : string, password?: string, confirmPassword?: string, isSelected?: string }>({});

    const validateForm = () => 
	{
        let tempErrors = {};

        if (!firstName) {
        tempErrors = { ...tempErrors, firstName: 'First name is required' };
        }

        if (!lastName) {
        tempErrors = { ...tempErrors, lastName: 'Last name is required' };
        }

        if (!email) {
        tempErrors = { ...tempErrors, email: 'Email is required' };
        } else if (!/\S+@\S+\.\S+/.test(email)) {
        tempErrors = { ...tempErrors, email: 'Email is not valid' };
        }

        if (!password) {
        tempErrors = { ...tempErrors, password: 'Password is required' };
        } else if (password.length < 6) {
        tempErrors = { ...tempErrors, password: 'Password must be at least 6 characters' };
        }

        if (password !== confirmPassword) {
        tempErrors = { ...tempErrors, confirmPassword: 'Passwords do not match' };
        }

        if (!isSelected) {
            tempErrors = { ...tempErrors, isSelected: 'You must agree to the terms.' };
          }

        setErrors(tempErrors);

        // Only proceed with handleSignUp if there are no errors
        if (Object.keys(tempErrors).length === 0) 
        {
            checkUesrExists();
        }
    };

    const checkUesrExists = async () => 
    {
        try 
        {
            let response = await fetch('http://192.168.1.28/one/' + 'api/auth_controller/check_user', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                }),
            });

            let data = await response.json();

            if (data.status) 
            {
                // Success
                console.log(data.message);
                handleSignUp();
            } 
            else 
            {
                // Show that there was an error
                Alert.alert(
                  'Signup error',
                  'User already exists. Please login or use a different email.',
                  [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ],
                  {cancelable: false},
                );
            }
        } 
        catch (error) 
        {
            console.error(error);
        } 
        finally 
        {
            // setIsLoading(false);
        }
    }

    const handleSignUp = () => 
    {
        registerUser(email, password, firstName, lastName);
    };

    const registerUser = async (email: string, password: string, firstName: string, lastName: string) => 
    {
        try {
            const response = await fetch('http://192.168.1.28/one/' + 'api/auth_controller/register', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                cred_one: email,
                cred_two: password
                }),
            });

            const res = await response.json()
            .then (res => 
			{
                if (res.status)
                {
                    // Success
					const remote_id = res.remote_id;
					console.log('Remote ID: ' + remote_id);
                    updateProfile(remote_id);
                }
                else 
                {
                    // Show that there wasa an error
                    console.log(res.message);
                }
            });
            
        } 
        catch (error) 
        {
            console.error(error);
        } 
        finally 
        {
            
        }
    }

    const updateProfile = (remote_id: number) => 
    {
        let acceptTerms = '0';
        if (isSelected) { acceptTerms = '1'; }

        DbProfile.updateProfile(remote_id, 1, 0, firstName, lastName, email, "", 1, 0, "")
        .then((value: unknown) => 
        {
			const result = value as number;
            if (result == 1)
            {
                props.navigation.navigate('SignupDone', { credOne: email, credTwo: password, token: ''});
            }
            else 
            {
                // Show that there was a an error
            }
        })
        .catch((error) => 
        {
            console.error('Failed to fetch profile:', error);
        });
    }

    const handleTerms = () => 
    {
        props.navigation.navigate('TermsConditions');
    }
  
    const handleLogin = () => 
    {
        props.navigation.navigate('Login');
    }

  return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={MainStyles.container}>
            <Text style={[MainStyles.h1, MainStyles.textSerif, MainStyles.textLeft, MainStyles.w_100]}>Sign up with ONE</Text>
            <TextInput style={[MainStyles.input]} placeholder="First Name" value={firstName} onChangeText={text => setFirstName(text)} />
            {errors.firstName && <Text style={[MainStyles.errorText]}>{errors.firstName}</Text>}
            <TextInput style={MainStyles.input} placeholder="Last Name" value={lastName} onChangeText={text => setLastName(text)} />
            {errors.lastName && <Text style={[MainStyles.errorText]}>{errors.lastName}</Text>}
            <TextInput style={MainStyles.input} placeholder="Email" value={email} onChangeText={text => setEmail(text)} />
            {errors.email && <Text style={[MainStyles.errorText]}>{errors.email}</Text>}
            <TextInput style={MainStyles.input} placeholder="Password" secureTextEntry value={password} onChangeText={text => setPassword(text)} />
            {errors.password && <Text style={[MainStyles.errorText]}>{errors.password}</Text>}
            <TextInput style={MainStyles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={text => setConfirmPassword(text)} />
            {errors.confirmPassword && <Text style={[MainStyles.errorText]}>{errors.confirmPassword}</Text>}
            <View style={ MainStyles.formGroupRow}>
                {/* <CheckBox value={isSelected} onValueChange={setSelection} /> */}
                <CheckBox checked={isSelected} onChange={setSelection} />
                <Text style={[MainStyles.text, {paddingStart: 10}]}>I agree to the </Text>
                <TouchableOpacity onPress={handleTerms}>
                    <Text style={MainStyles.textUnderline}>Terms of Agreement</Text>
                </TouchableOpacity>
            </View>
            {errors.isSelected && <Text style={[MainStyles.errorText, { marginTop: 0}]}>{errors.isSelected}</Text>}
            <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_4]} onPress={validateForm}>
                <Text category='p1' style={[MainStyles.buttonText]}>Sign Up</Text>
            </TouchableOpacity>
            <Text style={MainStyles.mt_3}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
                <Text style={ MainStyles.textUnderline}>Sign in</Text>
            </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

export default SignupStart;