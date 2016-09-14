import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
} from 'react-native';

var Dimensions = require('Dimensions');
var {width} = Dimensions.get('window');

var NavigatorBar = React.createClass({
    
    render() {
        return (
            <View style={styles.navOutViewStyle}>
                <TouchableOpacity onPress={()=>{this.props.navigator.pop()}} style={styles.leftViewStyle}>
                    <Image source={{uri: 'icon_shop_local'}} style={styles.navImageStyle}/>
                </TouchableOpacity>
                    <View style={styles.contentViewStyle}>
                        <Text style={styles.textStyle}>扫雷</Text>
                    </View>
                <TouchableOpacity onPress={()=>{alert('点了!')}} style={styles.rightViewStyle}>
                    <Image source={{uri: 'icon_shop_search'}} style={styles.navImageStyle}/>
                </TouchableOpacity>
            </View>
        );
    },
})



const styles = StyleSheet.create({
    navImageStyle:{
        width:Platform.OS == 'ios' ? 28: 24,
        height:Platform.OS == 'ios' ? 28: 24,
    },

    leftViewStyle:{
        // 绝对定位
        position:'absolute',
        left:10,
        bottom:Platform.OS == 'ios' ? 15:13,
        backgroundColor:'green',
    },

    rightViewStyle:{
        // 绝对定位
        position:'absolute',
        right:10,
        bottom:Platform.OS == 'ios' ? 15:13,
        backgroundColor:'yellow',
    },

    navOutViewStyle:{
        // 绝对定位
        position:'absolute',
        left:0,
        top:0,
        height: Platform.OS == 'ios' ? 64 : 44,
        backgroundColor:'rgba(255,96,0,1.0)',
        width:width,
        // 设置主轴的方向
        flexDirection:'row',
        // 垂直居中 ---> 设置侧轴的对齐方式
        alignItems:'center',
        // 主轴方向居中
        justifyContent:'center'
    },
    textStyle:{
        color:'white',
        fontSize:16,
        fontWeight:'bold',
        textAlign:'center',
        backgroundColor:'green',
    },
    contentViewStyle:{
        backgroundColor:'red',
        height:44,
        width:120,
        alignItems:'center',
        alignSelf:'flex-end',
        justifyContent:'center',
    }
});

// 输出组件类
module.exports = NavigatorBar;