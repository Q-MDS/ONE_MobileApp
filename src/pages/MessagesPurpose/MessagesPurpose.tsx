import React, { useEffect, useState } from 'react';
import DbProfile from '../../services/DbProfile';
import { PageIndicator } from 'react-native-page-indicator';
import TabStyleButtonGroup from '../../components/TabStyleButtonGroup/TabStyleButtonGroup';
import AppMenu from '../../components/AppMenu/AppMenu';
import MainStyles from '../../assets/MainStyles';
import settings from '../../../settings';
import { ImageBackground, View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';

interface Purpose {
    id: string;
    purpose_desc: string;
    purpose_image: string;
}

const MessagesPurpose = ( props: any ) => 
{
    const [token, setToken] = useState('');
    const [purposes, setPurposes] = useState<Purpose[]>([{id: '0', purpose_desc: '', purpose_image: ''}]);

    useEffect(() => 
    {
        DbProfile.getToken()
        .then((value: unknown) => 
        {
			const token = value as string;
            setToken(token);
        })
        .catch((error) => 
        {
          console.error('Failed to fetch profile:', error);
        });
    }
    , []);

    useEffect(() => 
    {
        console.log('Token numnum ', token);
        if (token)
        {
            fetch('192.168.1.28/api/api_controller/getPurposes', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          .then(response => response.json())
          .then(result => {
            let data = JSON.parse(result);
            let records: Purpose[] = data.data;
            setPurposes(records);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        }
    }, [token]);

    const purposesOld = [
        {
          id: 1,
          quote: "The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well.",
          penned: "Antoine de Saint-Exupery",
          image: require('../../assets/images/quotes/p1.png')
        },
        {
          id: 2,
          quote: "The purpose of life is to live it, to taste experience to the utmost, to reach out eagerly and without fear for newer and richer experience.",
          penned: "Antoine de Saint-Exupery",
          image: require('../../assets/images/quotes/p2.png')
        },
        {
          id: 3,
          quote: "The purpose of life is to contribute in some way to making things better.",
          penned: "Antoine de Saint-Exupery",
          image: require('../../assets/images/quotes/p3.png')
        },
        {
          id: 4,
          quote: "The purpose of life is to discover your gift. The work of life is to develop it. The meaning of life is to give your gift away.",
          penned: "Antoine de Saint-Exupery",
          image: require('../../assets/images/quotes/p4.png')
        },
    ];

    const [currentPurposeIndex, setCurrentPurposeIndex] = useState(0);
    const [tabIndex, setTabindex] = useState(1);
    const { width } = Dimensions.get('window');

    // Manage screen left/right swipe and tap
    const [isSwiping, setIsSwiping] = React.useState(false);
    const [initialGestureX, setInitialGestureX] = React.useState(0);
    const [finalGestureX, setFinalGestureX] = React.useState(0);
    const swipeThreshold = settings.swipeThreshold; 

    const handleStart = (event: any) => 
    {
        setIsSwiping(false);
        setInitialGestureX(event.nativeEvent.pageX);
    };

    const handleMove = (event: any) => 
    {
        setIsSwiping(true);
        const currentGestureX = event.nativeEvent.pageX;
        setFinalGestureX(currentGestureX);
    };

    const handleRelease = (event: any) => 
    {
        if (isSwiping) 
        {
            if ((initialGestureX - finalGestureX) > swipeThreshold) 
            {
                if (currentPurposeIndex < purposes.length - 1) 
                {
                    setCurrentPurposeIndex(currentPurposeIndex + 1);
                }
            }
            else if ((finalGestureX - initialGestureX) > swipeThreshold) 
            {
                if (currentPurposeIndex > 0) 
                {
                    setCurrentPurposeIndex(currentPurposeIndex - 1);
                }
            } 
        }
    };
    
    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View
            style={MainStyles.pageContainer}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={handleStart}
            onResponderMove={handleMove}
            onResponderRelease={handleRelease}
            >
                <View style={[MainStyles.backContainer, { padding: 24, flexDirection: 'column', justifyContent: 'flex-start'}]}>
                <Text style={[ MainStyles.h2, MainStyles.textSerif, MainStyles.textLeft, MainStyles.w_100]}>Messages</Text>
                    <TabStyleButtonGroup
                        tabs={['Quotes', 'Purpose List']}
                        activeIndex={tabIndex}
                        toggleIndex={setTabindex} 
                        navigation={ props.navigation }
                        navTo={['MessagesQuotes', 'MessagesPurpose']}
                        />
                    <View style={{ marginTop: 24 }}>
                        <View key={purposes[currentPurposeIndex].id} style={[styles.card, {minWidth: '100%'}]}>
                            <Image source={{uri: '192.168.1.28/pictures/messages/' + purposes[currentPurposeIndex].purpose_image}} style={ styles.image } />
                            <Text style={[MainStyles.h5, MainStyles.mt_3, { padding: 20, paddingTop: 40, paddingBottom: 40}]}>{purposes[currentPurposeIndex].purpose_desc}</Text>
                        </View>
                    </View>
                    <PageIndicator style={[MainStyles.mt_4]} count={4} current={currentPurposeIndex}/>
                </View>
                <AppMenu navigation={ props.navigation } activeItem={2} />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
    image: {
      width: '100%',
      height: 200,
    },
    text: {
      padding: 10,
      fontSize: 16,
    },
});

export default MessagesPurpose