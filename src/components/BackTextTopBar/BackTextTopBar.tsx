import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import MainStyles from '../../assets/MainStyles';

const BackTextTopBar = (props: any) => 
{
    //const navigation = useNavigation();

    return (
        <View style={[styles.container]}>
            <TouchableOpacity style={[styles.backButton, { flex: 1}]} onPress={() => props.navigation.goBack()}>
                <Image source={require('../../assets/images/icon_back_arrow.png')} style={{ marginLeft: 15 }}  />
            </TouchableOpacity>
            <Text style={[ MainStyles.h2, MainStyles.textSerif, MainStyles.mb_0, {flex: 1}]}>{props.title}</Text>
            <Text style={{ flex: 1 }}></Text>
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
        marginLeft: 0,
    },
});

export default BackTextTopBar;