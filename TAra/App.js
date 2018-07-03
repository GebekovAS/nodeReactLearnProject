import React, {Component} from 'react';
import {AsyncStorage , CheckBox, View, Image, Text, ActivityIndicator,Button, TouchableOpacity, TextInput,
        ScrollView, Alert} from 'react-native';

var base64 = require('base-64');
var utf8 = require('utf8');

var styles=require('./styles/mainStyle');
var logo=require('./media/tara.png');



export default class Main extends Component { 
  generateUniqueID=()=>{
    return Math.round(new Date().getTime() + (Math.random() * 100));
  }

  _onCommandPress=(id,cmdName,cmdValue)=>{
    let url=this.state.server+'/ara_api/PushCommand';
    let btoaString=this.state.login+':'+this.state.pass;
    btoaString=utf8.encode(btoaString);
    btoaString=base64.encode(btoaString);
    let result={'Name':id,'Title':cmdName,'Value':cmdValue};

    return fetch(url,{
      method: 'POST',
      headers: {          
        "Accept": 'application/json',
        "Content-Type": 'application/json',
        "Authorization": 'Basic '+btoaString
      },
      body: JSON.stringify(result)
    })
    .then((response) => Alert.alert('Команда помещена в очередь на выполнение'))
    .catch((err)=>{Alert.alert('Ошибка при обработке запроса!'); console.error(err)})    
  };

  _loadAllAtr(){    
    let url=this.state.server+'/ara_api/GetAllStats?v='+this.generateUniqueID();
    let btoaString=this.state.login+':'+this.state.pass;
    btoaString=utf8.encode(btoaString);
    btoaString=base64.encode(btoaString);

    return fetch(url,{
      headers: {
        headers: {          
          "Accept": 'application/json',
          "Content-Type": 'application/json',
          "Authorization": 'Basic '+btoaString
        }
      }
    })
    .then((response) => response.json())
    .then((response) => {
      let cpuArray=this.state.cpuArray;
      for (let key in cpuArray) {
        let item=cpuArray[key];   
        item.values=[];     
        if (response[item.id]){          
          let resItem=response[item.id];
          item.title=resItem.NetName;          
          for (let atrKey in resItem.attributes){            
            let atrItem=resItem.attributes[atrKey];
            if (atrItem.Name=='connectionStatus') {
              item.isOnline=atrItem.Value=='Ok'?true:false;
            }
            if (item.atrs[atrItem.Name]) {
              item.values.push({id:item.id, name:atrItem.Name, title:atrItem.Title, value:atrItem.Value, type:atrItem.Type});             
            }            
          }
          cpuArray[key]=item;
        }
      }
      //console.log(cpuArray);
      this.setState({appStep:2,cpuArray:cpuArray});
    })
    .catch((error) => {
      this.setState({appStep:0,error:error});
    });
  }

  _loadConfig(){
    let url=this.state.server+'/ara_api/GetConfig?v='+this.generateUniqueID();

    let btoaString=this.state.login+':'+this.state.pass;  
    btoaString=utf8.encode(btoaString);
    btoaString=base64.encode(btoaString);

    return fetch(url,{
      headers: {
        headers: {          
          "Accept": 'application/json',
          "Content-Type": 'application/json',
          "Authorization": 'Basic '+btoaString
        }
      }
    })
    .then((response) => {console.log(response); return response.json()})
    .then((responseJson) => {
      var cpuArray=[];
      var timeOut=20000;
      for (let key in responseJson) { 
        let item=responseJson[key]; 
        if (key=='system') {
          timeOut=item.timeOut;
        }  else {      
          let atrs={};
          for (let subKey in item) {            
            let subItem=item[subKey];
            if (subItem.type!='pb'&&subItem.id.indexOf('disks_info')<0)
              atrs[subItem.id.split('>')[1]]={type:subItem.type};
          }
          
          cpuArray.push({
            isOnline:false,
            title:key,
            id:key,
            atrs:atrs,
            values:[]         
          });
        }
      }
      this.setState({cpuArray:cpuArray,status:'Загрузка данных...'});
      this._loadAllAtr();
      setInterval(()=>{
        this._loadAllAtr()
      },timeOut)
    })
    .catch((error) => {
      console.error(error);
      this.setState({appStep:0,error:error});
    });
  };

  constructor(e){
    super(e);    
    this.state={
      error:'',
      status:'Загрузка структуры...',
      isSavePass:false,
      appStep:0,
      server:'',
      login:'',
      pass:'',
      cpuArray:[],           
      cpuCurrent:0
    };    
  }

  componentDidMount(){
      AsyncStorage.getItem('server').then((result)=>{
        this.setState({server:result});
      }).done();

      AsyncStorage.getItem('login').then((result)=>{
        this.setState({login:result});
      }).done();
      AsyncStorage.getItem('pass').then((result)=>{
        this.setState({pass:result});
      }).done();

      AsyncStorage.getItem('isSavePass').then((result)=>{
        this.setState({isSavePass:JSON.parse(result)});
      }).done(); 
  }

  render(){
    switch (this.state.appStep) {
      
      case 0: {
        return (
          <View style={styles.main.viewCenter}>
            <Image source={logo} style={{height:64, width:64, marginBottom:20}} />
            <Text>Авторизация:</Text>
            <TextInput
              style={styles.main.textInput}
              placeholder='Сервер'
              value={this.state.server}
              onChangeText={(text)=>this.setState({server:text})}
            />
            <TextInput
              style={styles.main.textInput}
              placeholder='Логин'
              value={this.state.login}
              onChangeText={(text)=>this.setState({login:text})}
            />
            <TextInput
              style={styles.main.textInput}
              secureTextEntry={true}
              placeholder='Пароль'
              value={this.state.pass}
              onChangeText={(text)=>{this.setState({pass:text})}}
            />
            <View style={{flexDirection: 'column'}}>             
              <View style={{flexDirection: 'row' }}>
                <CheckBox 
                  value={this.state.isSavePass}
                  onValueChange={() => this.setState({ isSavePass: !this.state.isSavePass })}
                />
                <Text style={{marginTop: 5}}>Сохранить</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={()=>{
                this.setState({appStep:1});
                AsyncStorage.setItem('server',this.state.server);                    
                AsyncStorage.setItem('login',this.state.login);
                AsyncStorage.setItem('pass',this.state.isSavePass?this.state.pass:'');
                AsyncStorage.setItem('isSavePass',JSON.stringify(this.state.isSavePass));
                this._loadConfig();
            }}
            >
              <View style={styles.main.buttonMain}>
                <Text style={styles.main.buttonText}>Войти</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      }

      case 1:  {
          return (
            <View style={styles.main.viewCenter}>
                <Image source={logo} style={{height:64, width:64, marginBottom:20}} />
                <ActivityIndicator/>
                <Text>{this.state.server}</Text>
                <Text>{this.state.status}</Text>
            </View>
          );
        }
      
      case 2: {
        var toolBarCpuMap=this.state.cpuArray.map((item,key)=>(
          <View key={key} style={this.state.cpuCurrent==key? styles.view.toolBarButtonFocused:styles.view.toolBarButton}> 
                <TouchableOpacity key={key}
                  onPress={()=>{
                    this.setState({cpuCurrent:key});                     
                  }}
                  style={{alignItems:'center'}}
                >               
                  <Image source={item.isOnline?require('./media/cpu_on_32.png'):require('./media/cpu_off_32.png')}/>                
                  <Text style={{fontSize:10}}>{item.title}</Text>
                </TouchableOpacity>
          </View> 
        ));

        var cpuValuesMap=this.state.cpuArray.map((item,key)=>{                 
            if (key==this.state.cpuCurrent)
              return item.values.map((subItem,subKey)=>{
              if (subItem.type!='command')
                return (                                  
                  <View key={subKey} style={{flex:1, flexDirection:'column'}}><View style={{flex:1, flexDirection:'row'}}>
                    <View style={{flex:1}}><Text style={styles.view.cpuAtr}>{subItem.title}</Text></View>
                    <View style={{flex:1, alignItems:'center'}}><Text style={styles.view.cpuAtr}>{subItem.value}</Text></View>
                  </View></View>
                )
              else
                return ( 
                  <View key={subKey} style={styles.view.cpuButton}>                                 
                  <Button
                    onPress={(e)=>this._onCommandPress(subItem.id,subItem.name,subItem.value)}                    
                    color="#555"                    
                    title={subItem.title}
                  />  
                  </View>                
                )
              })   
          });          

        return(          
          <View style={styles.view.main}>
            <View style={styles.view.head}></View>
            <ScrollView style={styles.view.content}>
              {cpuValuesMap}   
            </ScrollView>
            <View style={styles.view.toolBar}>
             <ScrollView horizontal={true} style={{flexDirection:'row'}}>
              {toolBarCpuMap}          
             </ScrollView>
            </View>
          </View>
        );
      }
    }
  }
}