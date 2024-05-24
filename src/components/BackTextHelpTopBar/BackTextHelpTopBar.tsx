import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import MainStyles from '../../assets/MainStyles';

// const BackTextHelpTopBar = ({ navigation, title }) => 
const BackTextHelpTopBar = (props: any) => 
{
    //const navigation = useNavigation();

    return (
        <View style={[styles.container]}>
            <TouchableOpacity style={[styles.backButton]} onPress={() => props.navigation.goBack()}>
                <Image source={require('../../assets/images/icon_back_arrow.png')}  />
            </TouchableOpacity>
            <Text style={[ MainStyles.h2, MainStyles.textSerif, MainStyles.mb_0]}>{props.title}</Text>
            <TouchableOpacity style={[styles.backImage]} onPress={() => props.navigation.goBack()}>
                <Image source={require('../../assets/images/icon_help.png')}   />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 50,
    },
    backButton: {
        marginLeft: 15,
    },
    backImage: {
        width: 49,
        marginRight: 15,
    },
});

export default BackTextHelpTopBar;