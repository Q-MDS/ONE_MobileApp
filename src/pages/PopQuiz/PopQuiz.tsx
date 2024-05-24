import React, { useState } from 'react';
import DBQuestions from '../../services/DBQuestions';
import BackTextTopBar from '../../components/BackTextTopBar/BackTextTopBar';
import MainStyles from '../../assets/MainStyles';
import { ImageBackground, View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import backgroundImage from '../../assets/images/app_bg_sky.png';

const PopQuiz = ( props: any) => 
{
    const questions = [ 
        { question: 'The overall goal is to achieve balance'},
        { question: 'The purpose of Physical Health is to work on the Physical form, to provide body mobility and its function'},
        { question: 'The purpose of Emotional Health is to build better communication with others and yourself.'},
        { question: 'The purpose of Mental Health is to improve your intelligence.'},
        { question: 'The purpose of Spiritual Health is to be able to remain present with your entire being.'}
    ];

    const id = props.route.params.id;
    const [popQuestion, setPopQuestion] = useState(questions[id]);

    const handleAgree = () => 
    {
        // Need to have id of quiz_control and then set done to 1
        // *** NEW Need to record the answer
        // And then return to main screen
        DBQuestions.saveAnswer(id, popQuestion.question, "Agree").then((result) => 
        {
            quizWeekDone(0);
        });
        // props.navigation.navigate('MainScreen');
    }

    const handleDisagree = () => 
    {
        // Need to have id of quiz_control and then set done to 1
        // *** NEW Need to record the answer
        // And then return to main screen
        DBQuestions.saveAnswer(id, popQuestion.question, "Disagree").then((result) => 
        {
            quizWeekDone(1);
        });
        
        // props.navigation.navigate('PopQuizDisagree');
    }

    const quizWeekDone = (navto: number) => 
    {
        DBQuestions.setWeekDone(id).then((result) => 
        {
            console.log('Week done: ', result);
            if (navto === 0)
            {
                props.navigation.navigate('MainScreen');
            } 
            else 
            {
                props.navigation.navigate('PopQuizDisagree');
            }
        });
    }

    return (
        <ImageBackground source={backgroundImage} style={MainStyles.imageBackground}>
            <View style={MainStyles.backContainer} >
                <BackTextTopBar navigation={props.navigation} title="Pop Quiz" />
                <Text style={[MainStyles.h3, { paddingLeft: 24, paddingRight: 24 }]}>{popQuestion.question}</Text>
                <TouchableOpacity style={[MainStyles.button_primary, MainStyles.mt_2, MainStyles.mt_3, { marginLeft: 24, marginRight: 24}]} onPress={handleAgree}>
                    <Text style={MainStyles.buttonText}>Agree</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[MainStyles.button_secondary, MainStyles.mt_2, MainStyles.mt_3, { marginLeft: 24, marginRight: 24}]} onPress={handleDisagree}>
                    <Text style={{fontSize: 16}}>Disagree</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
    };

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default PopQuiz;