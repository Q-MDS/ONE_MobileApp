import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const AllocateInput = (props:any) => 
{
  return (
	<View style={{ flexDirection: 'column', width: '100%', backgroundColor: '#fafafa', padding: 8, borderRadius: 15, elevation: 3, marginBottom: 10 }}>
		<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', columnGap: 10 }}>
			<View style={{ flexDirection: 'row', alignItems: 'center', flex:1, backgroundColor: '#4d4d4d', borderRadius: 10, height: '100%' }}>
				<Text style={{ paddingStart: 10, color: 'white', }}>{props.title}</Text>
			</View>
			<View style={{ flex: 1 }}>
			<TextInput 
				onEndEditing={(e) => props.onchange(e.nativeEvent.text)}
				style={[styles.timeBox, { flex: 1, borderRadius: 10, backgroundColor: '#ffffff', borderColor: '#cfd0d1', borderWidth: 1, color: '#000000' }]} 
				keyboardType='numeric'  
				selectTextOnFocus>{props.value}
			</TextInput>
			</View>
		</View>
		<View style={{ marginTop: 5 }}>
			<TextInput 
				onEndEditing={(e) => props.saveNote(e.nativeEvent.text)}
				style={{ width: '100%', backgroundColor: '#ffffff', borderColor: '#cfd0d1', borderWidth: 1, borderRadius: 5, paddingStart: 5, color: '#000000' }} 
				keyboardType='default' 
				placeholder='Enter note here...'>
				{props.note}
			</TextInput>
		</View>
	</View>
  )
}

const styles = StyleSheet.create({
    timeBox: {
        backgroundColor: '#fff',
        paddingTop: 8,
        paddingBottom: 8,
        borderRadius: 5,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default AllocateInput
