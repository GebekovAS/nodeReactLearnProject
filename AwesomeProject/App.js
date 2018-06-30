import React, {Component} from 'react';
import {Image,Alert, View, Text, Button, TextInput, StyleSheet} from 'react-native';

class Blink extends Component{
  constructor(e){
    super(e);
    this.state={isShowingText:true};

    setInterval(()=>{
      this.setState(e=>{
        return {isShowingText:!e.isShowingText};
      })
    },1000);
  }

  render(){
    let title=this.state.isShowingText?this.props.text:'';
    return (
      <Text style={{color:'white'}}>{title}</Text>
    );
  }
}

export default class Main extends Component {
  _onPressButtonApply=()=>{
    this.setState({
      Status:this.state.ModerationStatus
    });
    Alert.alert('Обновлено состояние: '+this.state.ModerationStatus);
  }

  constructor(e){
    super(e);
    this.state={Status:'GebekovAS', ModerationStatus:''};    
  }

  render() {     
    return (
      <View style={{flex:1}}>        
        <View style={styles.viewHead}>
         <Blink text={this.state.Status} />         
        </View>
        <View style={styles.viewContent}>
          <View style={styles.viewMainContainer}>
            <TextInput style={styles.inputText}
            onChangeText={(text)=>this.setState({ModerationStatus:text})} />
            <Button 
              onPress={this._onPressButtonApply}
              title='Apply'
            />            
            

          </View>
        </View>
      </View>
    );
  }
}

const styles=StyleSheet.create({
  viewHead:{
    alignItems:'center', backgroundColor:'steelblue',height:20
  },
  viewContent:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },  
  viewMainContainer:{
    alignItems:'center'
  },
  inputText:{
    height:40,
    width:200
  }
});
