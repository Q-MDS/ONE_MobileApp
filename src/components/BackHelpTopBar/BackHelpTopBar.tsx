import React from 'react';

import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';

const BackHelpTopBar = (props: any) => 
{
    //const navigation = useNavigation();

    return (
        <View style={[styles.container]}>
            <TouchableOpacity style={[styles.backButton]} onPress={() => props.navigation.goBack()}>
                <Image source={require('../../assets/images/icon_back_arrow.png')}  />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.backImage]} onPress={() => props.navigation.goBack()}>
                <Image source={require('../../assets/images/icon_help.png')}   />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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

export default BackHelpTopBar;