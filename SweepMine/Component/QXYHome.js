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

// 导入外部json数据
var HomeMenuData = require('../LocalData/QXYHomeMenu.json');

// 导入外部组件
var SweepMine = require('./SweepMine/QXYSweepMine');

// 菜单的尺寸
var MenuW = 180;
var MenuH = 200;

// 每一个菜单按钮的尺寸
// 上部菜单宽度
var MenuRowTopW = 120;
// 下部菜单宽度
var MenuRowBottomW = 80;
var MenuRowH = 35;


var Home = React.createClass({

    render() {
        return (
            <Image style={styles.bgImageStyle} source={{uri:'bg'}}>
                {/*标题*/}
                <View style={styles.titleViewStyle}>
                    <Text style={{color:'white',fontSize:25}}>
                        天天游戏
                    </Text>
                </View>
                {/*创建菜单*/}
                <View style={styles.menuViewStyle}>
                    {/*上部菜单*/}
                    {this.renderTopMenu()}
            
                    {/*下部菜单*/}
                    <View style={styles.bottomViewStyle}>
                        {this.renderBottomMenu()}
                    </View>
                </View>
            </Image>
        );
    },
    // 获取上半部分菜单
    renderTopMenu(){
        // 获取上部分菜单
        var titleArr = HomeMenuData.topMenu;
        // alert(titleArr);
        var menuArr = [];
        for (let i=0;i<titleArr.length;i++){
            let title = titleArr[i];
            menuArr.push(
                <TouchableOpacity style={styles.touchableStyle}
                                  activeOpacity={0.8}
                                  key={i}
                                  onPress={() => this.btnClick(title)}
                >

                    <Image style={styles.topImageStyle}
                           source={{uri:'button'}}
                    >
                        <Text style={styles.textStyle}>{title}</Text>
                    </Image>
                </TouchableOpacity>
            )
        }
        return menuArr;
    },



    // 下半部分菜单
    renderBottomMenu(){
        // 获取下部分菜单
        var titleArr = HomeMenuData.bottomMenu;
        // 菜单数组

        var menuArr = [];
         for (let i=0;i<titleArr.length;i++){
             let title = titleArr[i];
             menuArr.push(
                 <TouchableOpacity style={styles.touchableStyle}
                                   activeOpacity={0.8}
                                   key={i}
                                   onPress={() => this.btnClick(title)}
                 >

                     <Image style={styles.bottomImageStyle}
                            source={{uri:'button'}}
                     >
                         <Text style={styles.textStyle}>{title}</Text>
                     </Image>
                 </TouchableOpacity>
             )
         }
        return menuArr;
    },

    // 按钮的点击事件
    btnClick(title){
        let component;
        if (title=='扫雷'){
            component = SweepMine;
        }else if(title=='挑战'){
            alert('敬请期待');
        }
        else if(title=='打谱'){
            alert('敬请期待');
        }else if(title=='联网'){
            alert('敬请期待');
        }else if(title=='联机'){
            alert('敬请期待');
        };

        // alert(title);

        // 如果为空,则直接返回
        if (component==null)return;
        // 跳转
        this.props.navigator.push({
            // 要跳转的版块
            component:component,
            title:'扫雷',

        });


    },
})



const styles = StyleSheet.create({
    bgImageStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuViewStyle:{
        width:MenuW,
        height:MenuH,
        justifyContent:'space-between',
        alignItems:'center',
    },
    topImageStyle:{
        width:MenuRowTopW,
        height:MenuRowH,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:3,
    },
    textStyle:{
        color:'white',
        fontSize:17,
    },
    touchableStyle:{

    },
    bottomImageStyle:{
        width:MenuRowBottomW,
        height:MenuRowH,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:3,
    },
    bottomViewStyle:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:MenuW,
    },
    titleViewStyle:{
        // 绝对定位
        position:'absolute',
        top:window.qxy_height*0.157,
        width:window.qxy_width,
        alignItems:'center',
        // 设置一个透明的背景色
        backgroundColor:'rgba(0,0,0,0)',
    }
});

// 输出组件类
module.exports = Home;