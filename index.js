import React, { useEffect } from 'react';
import { AppRegistry } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import App from './src/App';

const AppWithSplashScreen = () => 
{
    useEffect(() => 
    {
        if (SplashScreen)
        {
            SplashScreen.hide();
        }
    }, []);

    return <App />;
};

// registerRootComponent(AppWithSplashScreen);
AppRegistry.registerComponent('ONE_MobileApp', () => AppWithSplashScreen);