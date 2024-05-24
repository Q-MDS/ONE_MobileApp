import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { TouchableOpacity } from 'react-native';

type TabStyleButtonGroupProps = {
  tabs: Array<string>;
  activeIndex: number;
  toggleIndex: (index: number) => void;
  navigation: any;
  navTo: string[];
};

function TabStyleButtonGroup(props: TabStyleButtonGroupProps): JSX.Element {
  return (
    <View style={styles.container}>
      {props.tabs.length > 0 &&
        props.tabs.map((item, index) => {
          let tabStyle =
            index === props.activeIndex ? styles.tabItemActive : styles.tabItem;

          return (
            <View
                key={index} 
              style={{
                flex: 1,
              }}>
              <TouchableOpacity
                key={index}
                // onPress={() => props.toggleIndex(index)}>
                onPress={() => props.navigation.navigate(props.navTo[index])}>
                <Text style={tabStyle}>{item}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 35,
    alignSelf: 'center',
    alignItems: 'center',
    columnGap: 3,
  },
  tabItem: {
    color: '#000000',
    backgroundColor: '#cccccc',
    fontWeight: '600',
    fontSize: 11,
    lineHeight: 24,
    verticalAlign: 'middle',
    alignContent: 'center',
    width: '100%',
    textAlign: 'center',
    padding: 4,
    borderRadius: 15,
  },
  tabItemActive: {
    backgroundColor: '#4A4A4A',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 11,
    lineHeight: 24,
    verticalAlign: 'middle',
    alignContent: 'center',
    width: '100%',
    flexGrow: 1,
    textAlign: 'center',
    padding: 4,
    borderRadius: 15,
  },
});

export default TabStyleButtonGroup;
