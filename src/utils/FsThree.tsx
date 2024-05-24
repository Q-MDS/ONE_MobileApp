import React from 'react';
import { View, TextInput, Button } from 'react-native';
import MainStyles from '../assets/MainStyles';

const FsThree = ( props: any ) => {
  return (
    <View style={MainStyles.fs_bg}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Did the user subscrive to the coaching plan?"
      />
      <Button
        title="Yes - Goto set planning time..."
        onPress={() => {
            props.navigation.navigate('OneSetCoaching')
        }}
      />
      <Button
        title="No -return to main screen"
        onPress={() => {
            props.navigation.navigate('MainScreen')
        }}
      />
    </View>
  );
};

export default FsThree;