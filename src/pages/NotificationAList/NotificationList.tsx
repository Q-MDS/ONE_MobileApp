import React, { useState, useEffect } from 'react';
import DbNotification from '../../services/DbNotification';
import moment from 'moment'; // import moment.js for date calculations
import { useNavigation } from '@react-navigation/native';
import MainStyles from '../../assets/MainStyles';
import BackButton from '../../components/BackButton/BackButton';
import { ImageBackground, View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';

const DATA = [
  { id: '1',  type: 1, date: 1705744417, title: 'Accountability Time!', description: 'Time to boost your accountability score' },
  { id: '2',  type: 2, date: 1705658017, title: 'Verification Time!', description: 'Description Check-off your completed daily activities' },
  { id: '3',  type: 3, date: 1705751617, title: 'Reminder', description: 'Physical: Its time to run' },
  { id: '4',  type: 4, date: 1705751617, title: 'Reminder', description: 'Emotional: Its time for family time' },
  { id: '5',  type: 5, date: 1705751617, title: 'Reminder', description: 'Mental: It\'s time for you to read' },
  { id: '6',  type: 6, date: 1705751617, title: 'Reminder', description: 'Spiritual: It\'s time to meditate!' },
  { id: '7',  type: 7, date: 1705751617, title: 'Plan ONE Reminder', description: '1 hour until it is time to plan your schedule' },
  { id: '8',  type: 8, date: 1705751617, title: 'Reminder', description: 'Preparation: It\'s time to prepare' },
  { id: '9',  type: 4, date: 1705751617, title: 'Reminder', description: 'Emmotional: Time to dance' },
  { id: '10', type: 1, date: 1705751617, title: 'Accountability Time!', description: 'Time to boost your accountability score' },
  { id: '11', type: 3, date: 1705751617, title: 'Reminder', description: 'Physical: Time for your workout' },
  { id: '12', type: 5, date: 1705751617, title: 'Reminder', description: 'Mental: Time to study' },
];

interface ResultSet {
    rows: {
        length: number;
        item(index: number): Record;
    };
}
interface Record {
    id: number;
    create_date: number;
    week_num: number;
    day_num: number;
    noti_type: string;
    noti_title: string;
    noti_desc: string;
    noti_due: number;
    active: number;
    was_done: number;
}

type ItemProps = {
	type: string; // replace with actual type
	title: string; // replace with actual type
	description: string; // replace with actual type
	notiDate: number; // replace with actual type
	active: number; // replace with actual type
	onPress: () => void; // replace with actual type
};

type NotiData = {
	notiType: string;
	notiTitle: string;
	notiDesc: string;
	notiDue: number;
	notiActive: number;
};

const Item = ({ type, title, description, notiDate, active, onPress }: ItemProps) => 
{
    // Calculate the time difference in hours
    // const hours = moment().diff(moment.unix(date), 'hours');
    /*const hours = Math.floor(date / 3600);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;*/

	// const currentTime = new Date().toLocaleTimeString();
	// const timeParts = currentTime.split(":");
	// const hours = parseInt(timeParts[0]);
	// const minutes = parseInt(timeParts[1]);
	// const seconds = parseInt(timeParts[2]);
	
	// const totalSeconds = hours * 3600 + minutes * 60 + seconds;

	// console.log('Current time in seconds: ', totalSeconds , " > ", date);
  
    // Format the time difference
	let timeDifference = '?';
    /*let timeDifference = `${hours}h`;
    if (hours > 24) {
      timeDifference = `${days}d ${remainingHours}h`;
    }*/

    let image;
    switch (type) {
        case "1":
        image = require('../../assets/images/noti_accountability.png');
        break;
        case "2":
        image = require('../../assets/images/noti_verification.png');
        break;
        case "3":
        image = require('../../assets/images/noti_remind_physical.png');
        break;
        case "4":
        image = require('../../assets/images/noti_remind_emotional.png');
        break;
        case "5":
        image = require('../../assets/images/noti_remind_mental.png');
        break;
        case "6":
        image = require('../../assets/images/noti_remind_spiritual.png');
        break;
        case "7":
        image = require('../../assets/images/noti_remind_planone.png');
        break;
        case "8":
        image = require('../../assets/images/noti_remind_preparation.png');
        break;
        // Add more cases as needed
        default:
        image = require('../../assets/images/noti_default.png');
    }
  
    return (
        <View>
            <TouchableOpacity onPress={onPress} style={[styles.item, { opacity: active === 0 ? 0.2 : 1}]}>
                <Image source={image} style={{width: 48, height: 48}} />
                <View style={[styles.textContainer]}>
                    <View style={[MainStyles.formGroupRow, MainStyles.w_100]} >
                        <Text style={styles.title}>{title}</Text>
                        <Text style={[MainStyles.formGroupRowEnd, MainStyles.textRight, MainStyles.textSubtle]}>{timeDifference}</Text>
                    </View>
                    <Text style={{ width: '100%' }}>{description}</Text>
                </View>
            </TouchableOpacity>
        <View style={MainStyles.bb}></View>
      </View>
    );
  };

  export default function NotificationList( props: any ) 
  {
    const navigation = useNavigation();
	const [notiData, setNotiData] = useState<NotiData[]>([]);

	const getNotifications = async () => 
	{
		await DbNotification.getRecords(2)
		.then((value: unknown) => 
		{
			const records = value as ResultSet;
			const data = [];
			const currentTime = new Date().toLocaleTimeString();
			const timeParts = currentTime.split(":");
			const hours = parseInt(timeParts[0]);
			const minutes = parseInt(timeParts[1]);
			const seconds = parseInt(timeParts[2]);

			// const totalSeconds: number = hours * 3600 + minutes * 60 + seconds;
			const totalSeconds: number = 44000;

			for (let i = 0; i < records.rows.length; i++) 
			{
				let notiType = records.rows.item(i).noti_type;
				let notiTitle = records.rows.item(i).noti_title;
				let notiDesc = records.rows.item(i).noti_desc;
				let notiDue = records.rows.item(i).noti_due;
				let notiActive = 0;
				// console.log('Due time: ', dueTime, ' > ', totalSeconds, ' > ', dueTime > totalSeconds);
				if (notiDue > totalSeconds) 
				{
					notiActive = 1;
				}
				const notiRow = {notiType, notiTitle, notiDesc, notiDue, notiActive};
				// data.push(records.rows.item(i));
				data.push(notiRow);
			}
			console.log('Data: ', data);
			setNotiData(data);
		})
		.catch(error => 
		{
			console.error(error);
		});
	}

	useEffect(() => 
	{
		getNotifications();

	}, []);
  
    const handlePress = (type: string) => 
    {
      if (type === "1") {
        props.navigation.navigate('NotificationAccountability');
      }
      if (type === "2") {
        props.navigation.navigate('NotificationVerification');
      }
    };
  
    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <BackButton/>
            <View style={[MainStyles.container] }>
                <Text style={[MainStyles.h2, MainStyles.textCenter, MainStyles.textSerif]}>Notifications</Text>
                <FlatList
                    style={MainStyles.w_100}
                    // data={DATA}
                    data={notiData}
                    renderItem={({ item }) => (
                    <Item 
                        type={item.notiType} 
                        notiDate={item.notiDue}
                        title={item.notiTitle} 
                        description={item.notiDesc} 
                        active={item.notiActive} 
                        onPress={() => handlePress(item.notiType)} 
                    />
                    )}
                    // keyExtractor={item => item.id}
                    keyExtractor={item => item.notiTitle}
                />
            </View>
        </ImageBackground>
    );
  }

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 0,
    marginVertical: 20,
    marginHorizontal: 0,
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});