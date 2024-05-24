import React, { useEffect, useState } from 'react';
import DbProfile from '../../services/DbProfile';
import { PageIndicator } from 'react-native-page-indicator';
import TabStyleButtonGroup from '../../components/TabStyleButtonGroup/TabStyleButtonGroup';
import AppMenu from '../../components/AppMenu/AppMenu';
import MainStyles from '../../assets/MainStyles';
import settings from '../../../settings';
import { ImageBackground, View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';

interface Quote {
    id: string;
    quote_desc: string;
    quote_by: string;
    quote_image: string;
}

const MessagesQuotes = ( props: any ) => 
{
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [tabIndex, setTabindex] = useState(0);
    const [token, setToken] = useState('');
    const [quotes, setQuotes] = useState<Quote[]>([{id: '0', quote_desc: '', quote_by: '', quote_image: ''}]);

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
            fetch('192.168.1.28/api/api_controller/getQuotes', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          .then(response => response.json())
          .then(result => {
            let data = JSON.parse(result);
            let quotes: Quote[] = data.data;
            setQuotes(quotes);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
        }
    }, [token]);

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
                if (currentQuoteIndex < quotes.length - 1) 
                {
                    setCurrentQuoteIndex(currentQuoteIndex + 1);
                }
            }
            else if ((finalGestureX - initialGestureX) > swipeThreshold) 
            {
                if (currentQuoteIndex > 0) 
                {
                    setCurrentQuoteIndex(currentQuoteIndex - 1);
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
                         <View key={quotes[currentQuoteIndex].id} style={[styles.card, {minWidth: '100%'}]}>
                            <Image source={{uri: '192.168.1.28/pictures/messages/' + quotes[currentQuoteIndex].quote_image}} style={ styles.image } />
                            <Image source={require('../../assets/images/icon_quote.png')} style={{ marginTop: 20, marginLeft: 20 }}  />
                            <Text style={[MainStyles.h5, MainStyles.mt_3, { padding: 20, paddingTop: 0, paddingBottom: 5}]}>{quotes[currentQuoteIndex].quote_desc}</Text>
                            <Text style={[MainStyles.h6 ]}>{quotes[currentQuoteIndex].quote_by}</Text>
                        </View> 
                    </View>
                    <PageIndicator style={[MainStyles.mt_4]} count={4} current={currentQuoteIndex}/>
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

export default MessagesQuotes