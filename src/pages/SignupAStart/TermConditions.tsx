import React from 'react';
import MainStyles from '../../assets/MainStyles';
import BackButton from '../../components/BackButton/BackButton';
import { View, ScrollView, Text } from 'react-native';

const TermsConditions = () => {
  return (
    <View style={[MainStyles.container, { paddingTop: 10}]}>
        <BackButton/>
        <ScrollView>
        <Text style={[MainStyles.h2, MainStyles.textCenter, MainStyles.textSerif]}>Terms & Conditions</Text>
        <Text style={[MainStyles.h6, MainStyles.textLeft]}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam adipisci harum nihil dolore deserunt quaerat sapiente, tempore eveniet architecto rem cumque quisquam repellendus, expedita placeat doloribus voluptates nisi maxime debitis?</Text>
        <Text style={[MainStyles.h6, MainStyles.textLeft, MainStyles.textBold, MainStyles.mb_2]}>These will ensure that:</Text>
        <Text style={[MainStyles.h6, MainStyles.textLeft]}>Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</Text>
        <Text style={[MainStyles.h6, MainStyles.textLeft]}>Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.</Text>
        <Text style={[MainStyles.h6, MainStyles.textLeft]}>Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere.</Text>
        <Text style={[MainStyles.h6, MainStyles.textLeft]}>Praesent id metus massa, ut blandit odio. Proin quis tortor orci.</Text>
        <Text style={[MainStyles.h6, MainStyles.textLeft, MainStyles.textBold, MainStyles.mb_2]}>The tiny tiny tiny fineprint (lol):</Text>
        <Text style={[MainStyles.h6, MainStyles.textLeft]}>Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet.</Text>
        <Text style={[MainStyles.h6, MainStyles.textLeft]}>Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse delectus sequi dolorem ex facere nemo pariatur sunt adipisci nobis quos ducimus nam laboriosam ipsa aliquam rerum perspiciatis illo, a nostrum. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reiciendis ullam aliquid voluptate eveniet accusantium, fugiat, impedit velit doloribus illo eligendi corrupti debitis corporis porro! Vero unde nesciunt quod sit eveniet!</Text>
        <Text style={[MainStyles.h6, MainStyles.textLeft]}>In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor. Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae voluptatem eaque reprehenderit! Doloribus accusantium laboriosam, facere debitis saepe autem, similique, deserunt ea omnis odit minima cumque molestiae repudiandae nulla. Veniam.</Text>
        </ScrollView>
    </View>
  );
};

export default TermsConditions;