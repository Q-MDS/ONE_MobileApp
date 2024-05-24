import { StyleSheet } from 'react-native';

const MainStyles = StyleSheet.create({
    root: {
        flex: 1,
    },
    // Containers
    pageContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    backContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    imageBackground: {
        flex: 1,
        width: '100%',
    },
    swiperContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
    },
    // Elements
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5,
        // margin: 10,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
      },
    cardContent: {
        marginTop: 10,
    },
    cardAltBorder: {
        borderColor: '#00000040',
        borderWidth: 1,
    },
    cardRowBox: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        width: '100%', 
        backgroundColor: '#fefefe', 
        padding: 10, 
        borderRadius: 8
    },
    cardColumnBox: {
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between', 
        width: '100%', 
        backgroundColor: '#fefefe', 
        padding: 10, 
        borderRadius: 8
    },
    profilePicSml: {
        width: 38,
        height: 38,
        borderRadius: 32,
    },

    // Text style
    h0: {
        fontSize: 64,
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
    },
    h01: {
        fontSize: 80,
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
    },
    h02: {
        fontSize: 96,
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
    },
    h03: {
        fontSize: 112,
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
    },
    h04: {
        fontSize: 128,
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
    },
    h1: {
        fontSize: 32,
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
    },
    h2: {
        fontSize: 24,
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
    },
    h3: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginBottom: 15,
    },
    h4: {
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
        marginBottom: 15,
    },
    h5: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        marginBottom: 15,
    },
    h6: {
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
        marginBottom: 15,
    },
    h7: {
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
        marginBottom: 15,
    },
    textSerif: {
        fontFamily: 'serif',
    },
    textLeft: {
        textAlign: 'left',
        justifyContent: 'flex-start',
    },
    textRight: {
        textAlign: 'right',
        justifyContent: 'flex-end',
    },
    textCenter: {
        textAlign: 'center',
    },
    textBold: {
        fontWeight: 'bold',
    },
    textUnderline: {
        textDecorationLine: 'underline',
    },
    textUppercase: {
        textTransform: 'uppercase',
    },
    textSubtle: {
        color: '#00000040',
    },
    errorText: {
        color: '#ff0000',
        textAlign: 'left',
        marginTop: -15,
        width: '100%',
        marginBottom: 5,
    },

    // Form
    input: {
        width: '100%',
        height: 40,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginBottom: 20,
    },
    
    label: {
        fontSize: 12,
        color: '#333',
        marginBottom: 5,
      },

    // Button style
    buttonBasic: {
        backgroundColor: '#4D4D4D',
        padding: 10,
        borderRadius: 15,
        alignItems: 'center', 
        flex: 1
    },
    buttonBasicRow: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 15,
        alignItems: 'center', 
    },
    button_primary: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#4D4D4D',
        minWidth: 200,
        height: 54,
        padding: 0,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center', 
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    button_secondary: {
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'center',
        height: 54,
        minWidth: 200,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
        color: '#000',
    },
    buttonFull: {
        marginLeft:  24,
        marginRight:  24,
    },

    // CSS Utils
    div: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    formGroupRow: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        width: '100%',
		paddingBottom: 10,
    },
    formGroupRowEnd: {
        flex: 1, 
        flexDirection: 'row', 
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    formGroupRowCenter: {
        flexDirection: 'row', 
        justifyContent: 'center'
    },
    fcg_10: {
        columnGap: 10
    },
    w_100:
    {
        width: '100%',
    },
    mt_0: {
        marginTop: 0,
    },
    mt_1: {
        marginTop: 4,
    },
    mt_2: {
        marginTop: 8,
    },
    mt_3: {
        marginTop: 16,
    },
    mt_4: {
        marginTop: 24,
    },
    mt_5: {
        marginTop: 48,
    },
    mb_0: {
        marginBottom: 0,
    },
    mb_1: {
        marginBottom: 4,
    },
    mb_2: {
        marginBottom: 8,
    },
    mb_3: {
        marginBottom: 16,
    },
    mb_4: {
        marginBottom: 24,
    },
    mb_5: {
        marginBottom: 48,
    },

    // Utils
    fs_bg: {
        backgroundColor: '#E5C28C',
        height: '100%',
    },
    rb: {
        borderWidth: 1,
        borderColor: 'red',
    },
    rg: {
        borderWidth: 1,
        borderColor: 'green',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        columnGap:10
      },
    col: {
        flex: 1,
    },
    bb: {
        borderBottomColor: '#00000040',
        borderBottomWidth: 1,
        width: '100%',
    },
    bt: {
        borderTopColor: '#00000040',
        borderTopWidth: 1,
        width: '100%',
    },

    // Temp
    page: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    pageIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        
    },
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        fontFamily: 'serif',
        marginTop: 24   
    },
    description: {
        fontSize: 16,
        fontFamily: 'Times',
        textAlign: 'center',
    },
    
    textInput: {
        backgroundColor: '#FFFFFF',
        minWidth: 200,
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',   
    },
    textArea: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        padding: 10,
        borderRadius: 15,
        alignItems: 'flex-start',textAlignVertical: 'top'
    },
    txt_16: {
        fontFamily: 'serif',
        fontSize: 16,
    },
      button: {
        backgroundColor: '#b45ed6',
        padding: 15,
        borderRadius: 4,
      },
});

export default MainStyles;