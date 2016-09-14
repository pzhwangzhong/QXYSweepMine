import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    ListView,
} from 'react-native';

// 引入计时器类库
var TimerMixin = require('react-timer-mixin');

var MineMenuView = React.createClass({
    // 注册计时器
    mixins: [TimerMixin],
    
    getDefaultProps(){
        return{
            // 回调函数
            menuSelect : null,

            popToView : null,

            // 地雷数
            mineCountStr : '',
            // 计时器
            timerStr:'',
            // 难度
            grade:''
        }
    },
    render() {
        return (
            <Image style={styles.topMenuImageStyle} source={{uri:'button'}}>
                <View style={styles.contentViewStyle}>
                    {/*左边*/}
                    <TouchableOpacity activeOpacity={0.8} onPress={()=>this.popToView()}>
                        <Image style={styles.leftBtnImageStyle}>
                            <Text style={{color:'white',fontSize:15}}>返回</Text>
                        </Image>
                    </TouchableOpacity>

                    {/*格子总数和地雷数*/}
                    <Text style={{
                    backgroundColor:'rgba(0,0,0,0)',
                    fontSize:16,
                    color:'white'
                    }}>{this.props.mineCountStr}</Text>

                    {/*计时*/}
                    <View style={{width:80,alignItems:'center'}}>
                        <Text style={{
                        backgroundColor:'rgba(0,0,0,0)',
                        fontSize:25,
                        color:'red'
                        }}>
                            {this.props.timerStr}
                        </Text>
                    </View>

                    {/*当前难度*/}
                    <Text style={{
                    backgroundColor:'rgba(0,0,0,0)',
                    fontSize:16,
                    color:'yellow'
                    }}>{this.props.grade}</Text>

                    {/*右边*/}
                    <TouchableOpacity activeOpacity={0.8} onPress={()=>this.menuClicked()}>
                        <Image style={styles.rightBtnImageStyle}>
                            <Text style={{color:'white',fontSize:15}}>菜单</Text>
                        </Image>
                    </TouchableOpacity>
                    {/*其他*/}
                </View>
            </Image>
        );
    },

    componentDidMount(){
    },

    // 点击了菜单
    menuClicked(){
        if (this.props.menuSelect==null)return;

        // 执行回调函数
        this.props.menuSelect();
    },

    // 返回
    popToView(){
        if(this.props.popToView==null)return;
        this.props.popToView();
    }

})



const styles = StyleSheet.create({
    // 菜单样式
    topMenuImageStyle:{
        width:window.qxy_width,
        height:64,
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    // 菜单按钮样式
    leftBtnImageStyle:{
        width:50,
        height:30,
        backgroundColor:'rgba(0,0,0,0.2)',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        marginLeft:10,
    },
    rightBtnImageStyle:{
        width:50,
        height:30,
        backgroundColor:'rgba(0,0,0,0.2)',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        marginRight:10,
    },

    contentViewStyle:{
        width:window.qxy_width,
        height:44,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        position:'absolute',
        marginTop:20
    }

});

// 输出组件类
module.exports = MineMenuView;