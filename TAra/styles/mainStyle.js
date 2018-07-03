import {StyleSheet} from 'react-native';

module.exports={
    main: StyleSheet.create({
            viewCenter:{
                flex: 1,
                flexDirection:'row',
                alignItems:'center',
                flexDirection: 'column',
                justifyContent: 'center'
            },
            textInput: {
                height:40,
                width:200
            },
            buttonMain:{
                marginTop: 20,
                width: 200,
                alignItems: 'center',
                backgroundColor: '#2196F3'
            },
            buttonText:{
                color:'white',
                margin:10
            },
            checkBoxView:{
               // flex:1, 
                flexDirection:'column'
            }
        }),
    view: StyleSheet.create({
        main:{
            flex: 1,
            backgroundColor:'#ddd'
        },
        head:{
            height:20, 
            backgroundColor:'#555'
        },
        content:{
            flex:1,
            backgroundColor:'#eee',
            padding:5
        },
        toolBar:{
            flexDirection:'column',
            minHeight:64,
            backgroundColor:'white',
            marginTop:1
        },
        toolBarButton:{
            minHeight:64,
            width:90,
            marginLeft:2,
            padding:10,
            marginLeft:5,
            marginRight:5,
            alignItems:'center',
            borderColor:'#fff',
            borderLeftWidth :1,
            borderRightWidth :1
        },
        toolBarButtonFocused:{
            backgroundColor:'#eee',
            minHeight:64,
            width:90,
            marginLeft:2,
            padding:10,
            marginLeft:5,
            marginRight:5,
            alignItems:'center',
            borderColor:'#ddd',
            borderLeftWidth :1,
            borderRightWidth :1
        },
        cpuButton:{
            padding:10
        },
        cpuAtr:{
            alignItems:'center', 
            fontSize:16
        }
    })
};