import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Navigator,
} from 'react-native';

// 定义一些全局常量
var Dimensions = require('Dimensions');
qxy_width = Dimensions.get('window').width;
qxy_height = Dimensions.get('window').height;


// 导入外部引用
var Home = require('./QXYHome');

var Main = React.createClass({

    render() {
        return (
            // 通用模板  component需要传入一个类
        <Navigator
            initialRoute={{name:'my',component:Home}}
            // 设置页面切换动画
            configureScene={()=>{
                        // 动画方式 PushFromRight  FloatFromBottom
                             return Navigator.SceneConfigs.PushFromRight;
                        }}
            renderScene={(route,navigator)=>{
                           let Component = route.component;
                           return <Component {...route.passProps} navigator={navigator}/>;
                        }}
        />
        );
    },
})


// 输出组件类
module.exports = Main;