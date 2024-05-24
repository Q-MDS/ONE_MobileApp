import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';

const IconRightTopBar = (props: any) => 
{
    return (
        <View style={[styles.container]}>
            <TouchableOpacity style={[styles.imageButton]} onPress={() => props.navigation.goBack()}>
                <Image source={require('../../assets/images/icon_stopwatch.png')} style={{ width: 32, height: 32 }}   />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: 50,
    },
    imageButton: {
        marginRight: 15,
    },
});

export default IconRightTopBar;