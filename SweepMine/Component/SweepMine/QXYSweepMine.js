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
    ActionSheetIOS,
    Alert
} from 'react-native';

// 导入外部组件
var MineMapView = require('./QXYMineMapView');
var MineMenuView = require('./QXYMineMenuView');

// 引入计时器类库
var TimerMixin = require('react-timer-mixin');

// 引入类对象
require('./QXYSweepMineClass');


// 游戏
var games = null;

var SweepMine = React.createClass({

    // 注册计时器
    mixins: [TimerMixin],

    getDefaultProps(){
      return{
          // 难度选择
          levelArr:['入门','初级','中级','高级','大师','取消']
      }
    },
    getInitialState(){
      return{

          // 格子总数
          maxCellNum : 0,
          // 地雷总数
          maxMineNum : 0,
          // 每行多少个
          maxCols : 0,

          // 初始难度
          selectIndex: 0,


          // 每隔多少时间
          duration: 1000,

          // 总时间
          count:0,
          // 计时器
          timerStr:'00:00',
          // 魔法手-点击后,显示周围9格除雷以外的所有格子
          goldenFinger:0,
          // 连胜
          wins:0,
          // 地雷递增等级
          mineGrade:0,
          // 最大级数
          maxGrade:0,
          // 每级递增几个
          gradeMineCount:0,
          // 得分
          totalScore:0
      }
    },
    render() {
        // 总数与地雷之比
        let mineStr = `${this.state.maxCellNum}/${this.state.maxMineNum}`;
        // 级别
        let gradeStr = this.props.levelArr[this.state.selectIndex];
        // alert(gradeStr);
        return (
            <View style={styles.container}>
                {/*菜单选项*/}
                <MineMenuView
                    menuSelect = {() => this.menuSelect()}
                    popToView = {() => this.popToView()}
                    // 地雷数
                    mineCountStr = {mineStr}
                    grade = {gradeStr}
                    timerStr = {this.state.timerStr}
                />

                {/*雷区*/}
                <MineMapView
                    dataArr={games.cells}
                    maxCols={this.state.maxCols}
                    // 回调函数
                    onPressFunc={(cell) => this.cellClicked(cell)}
                    onLongPressFunc={(cell) => this.cellLongPress(cell)}
                />
              
            </View>
        );
    },


    popToView(){
      this.props.navigator.pop();
    },

    componentWillMount(){
        // 初始化游戏
        games = new Game();
        // 第一次进入,显示选择等级
        {this.showActionSheet()}
    },

    // 点击了每一个cell
    cellClicked(cell){

        if (games.isWin||games.isFail)return;


        if (this.state.goldenFinger<2){
            let count = this.state.goldenFinger;
            count++;
            games.goldenFinger(cell);
            this.setState({
                goldenFinger:count
            })
        }else {
            games.tapCellOfIndex(cell);

        }

        if (games.isWin){

            // 难度
            let gradeStr = this.props.levelArr[this.state.selectIndex];
            // 用时
            let timeStr = this.state.count;
            // 计算得分
            let baseScore = 100 * (this.state.selectIndex+1);
            let warningScore = 10;
            let score = games.getScore(baseScore,warningScore,timeStr);
            // 总分
            let totalScore = this.state.totalScore;
            totalScore += score;

            // 连胜
            let wins = this.state.wins;
            wins += 1;
            this.setState({
                wins:wins,
                totalScore:totalScore
            });

            // 拼接
            let winStr = '';
            let title = '';
            if (wins>=2){
                winStr = `恭喜您,获得${wins}连胜!`;
                title = `${wins}连胜!`;
            }else {
                winStr = '恭喜您,获得胜利!';
                title = '胜 利';
            }
            let message = `${winStr}\n当前难度:${gradeStr}\n总用时:${timeStr}秒\n分数:${totalScore}(本局${score})`;
            Alert.alert(
                title,
                message,
                [
                    {text: '取消'},
                    {text: '继续挑战', onPress: () => {
                        let level = this.state.selectIndex;
                        let mineGrade = this.state.mineGrade;
                        let maxGrade = this.state.maxGrade;
                        if (mineGrade<=maxGrade){
                            mineGrade += 1;
                            this.setState({
                                mineGrade:mineGrade
                            })
                            // console.log('-->'+mineGrade);
                        }else {
                            this.setState({
                                mineGrade:0
                            })
                            if(level<this.props.levelArr.length-2){
                                level ++;
                            }
                        }
                        this.startGame(level);
                        // console.log('wins:'+wins+',mineGrade:'+mineGrade+';maxGrade:'+maxGrade+';level:'+level);
                    }}
                ]
            );

            // 停止定时器
            this.gameOver(true);
        }else if(games.isFail){
            // 难度
            let gradeStr = this.props.levelArr[this.state.selectIndex];
            // 用时
            let timeStr = this.state.count;
            // 拼接
            let message = `很不幸,您踩到地雷了!\n当前难度:${gradeStr}\n总用时:${timeStr}秒`;
            Alert.alert(
                '失 败',
                message,
                [
                    {text: '取消'},
                    {text: '再玩一次', onPress: () => {
                        let level = this.state.selectIndex;
                        this.startGame(level);
                    }}
                ]
            )
            // 停止定时器
            this.gameOver(false);
        }else {

        }
        // 更新数据源
        this.setState({
            allMines:games.cells,
            maxCols:this.state.maxCols
        })
    },

    // 长按
    cellLongPress(cell){
        cell.isWarning = !cell.isWarning;
        // 更新数据源
        this.setState({
            allMines:games.cells,
            maxCols:this.state.maxCols
        })
    },

    // 选择了菜单
    menuSelect(){
        // 调用alertSheet
        {this.showActionSheet()}
    },

    // 难度选择菜单
    showActionSheet(){
        ActionSheetIOS.showActionSheetWithOptions({
                options: this.props.levelArr,
                cancelButtonIndex: this.props.levelArr.length>0?this.props.levelArr.length-1:0,
            },
            (btnIndex) => {
                this.startGame(btnIndex);
            });
    },

    startGame(grade){
        this.gameOver(true);
        // 设置等级相关参数
        // 格子总数
        let   maxCellNum = 0;
        // 地雷总数
        let   maxMineNum = 0;
        // 每行多少个
        let   maxCols = 0;
        // 同一难度下的地雷最大等级
        let maxGrade = 0;
        // 每级递增个数
        let gradeMineCount = 0;

        // 当前递增级数
        let mineGrade = this.state.mineGrade;

        // 入门
        if (grade==0) {
            maxCellNum = 42;
            maxGrade = 3;
            gradeMineCount = 2;
            maxMineNum = 6 + mineGrade * gradeMineCount;
            maxCols = 6;
        }
        // 初级
        else if (grade==1){
            maxCellNum = 60;
            maxCols = 6;
            maxGrade = 3;
            gradeMineCount = 2;
            maxMineNum = 12 + mineGrade * gradeMineCount;
        }
        // 中级
        else if (grade==2){
            maxCellNum = 80;
            maxCols = 6;
            maxGrade = 4;
            gradeMineCount = 2;
            maxMineNum = 16 + mineGrade * gradeMineCount;
        }
        // 高级
        else if (grade==3){
            maxCellNum = 120;
            maxCols = 8;
            maxGrade = 4;
            gradeMineCount = 2;
            maxMineNum = 25+ mineGrade * gradeMineCount;
        }
        // 大师
        else if (grade==4){
            maxCellNum = 160;
            maxCols = 8;
            maxGrade = 25;
            gradeMineCount = 2;
            maxMineNum = 30 + mineGrade * gradeMineCount;
        }else {
            return;
        }


        // 初始化游戏
        games = new Game();
        games.create(maxCellNum,maxMineNum,maxCols);

        // 更新数据源
        this.setState({
            selectIndex: grade,
            maxCellNum : maxCellNum,
            maxMineNum : maxMineNum,
            maxCols : maxCols,
            allMines:games.cells,
            maxGrade: maxGrade,
            gradeMineCount:gradeMineCount
        });

        let gradeStr = this.props.levelArr[grade];
        // 连胜
        let wins = this.state.wins;
        let title = '';
        if(wins>=2){
            title = '难度提升';
        }else {
            title = '游戏开始';
        }

        Alert.alert(
            '游戏开始',
            `当前难度:${gradeStr}(${mineGrade})`,
            [
                {text: '确定'}
            ]
        );

        // 开启定时器
        this.startTimer();
    },

    // 开启定时器
    startTimer(){

        // 添加定时器  this.timer --->可以理解成一个隐式的全局变量
        this.timer = this.setInterval(function () {
            let count = this.state.count;
            count++;
            // 将总时间转换时间字符串
            let second = count%60;
            let min = 0;
            if(count/60>=1){
                min=parseInt(count/60)
            }
            let timeStr = `${min}:${second}`;

            // console.log(timeStr)
            // 2.3 更新状态机
            this.setState({
                timerStr:timeStr,
                count:count
            });

        }, 1000);
    },
    // 停止定时器
    gameOver(isWin){
        // 停止定时器
        clearInterval(this.timer);
        if (isWin){
            this.setState({
                count:0,
                goldenFinger:0
            })
        }else {
            this.setState({
                count:0,
                goldenFinger:0,
                mineGrade:0,
                wins:0,
                totalScore:0
            })
        }

    }

})



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(106,137,236,1)'
    },
    scrollViewStyle:{
        width:window.qxy_width,
        height:window.qxy_height-64
    }

});

// 输出组件类
module.exports = SweepMine;