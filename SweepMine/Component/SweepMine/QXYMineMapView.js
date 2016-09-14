import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ListView,
} from 'react-native';

// 创建数据源
var ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2});

var MineMapView = React.createClass({
    getDefaultProps(){
        return{
            // 数据源
            dataArr:[],
            // 列数
            maxCols:0,
            // 点击了cell
            onPressFunc:null,
            // 长按
            onLongPressFunc:null
        }
    },

    render() {
        // console.log('map---'+this.props.dataArr);
        if (this.props.dataArr.length==0)return(<View><Text></Text></View>);

        let allData = [];
        for (let tepArr of this.props.dataArr){
            for (let cell of tepArr){
                allData.push(cell);
            }
        }
        return (
            <ListView
                dataSource={ds.cloneWithRows(allData)}
                renderRow={this.renderRow}
                contentContainerStyle={styles.listViewStyle}
                bounces={false}
                // scrollEnabled={false}

                // 设置每次渲染的行数
                pageSize={20}

                renderFooter={this.renderFooter}
            />
        );
    },
    //表尾
    renderFooter(){
        return(
            <Image style={{
                height:64,
                width:window.qxy_width,
                justifyContent:'center',
                marginTop:2

            }}
                   source={{uri:'button'}}
            >
                <Text style={{
                    color:'yellow',
                    backgroundColor:'rgba(0,0,0,0)',
                    marginLeft:10,
                    fontSize:12
                }}>
                    温馨提示:{'\n'}
                    1.长按可以标记地雷或取消标记{'\n'}
                    2.每局的前两次点击具有保护功能{'\n'}
                    3.正确标记地雷或减少游戏总时间可有效提高得分
                </Text>
            </Image>
        )
    },
    componentDidMount(){
    },

    renderRow(cell){
        // cell的宽高
        let cellWH = window.qxy_width / this.props.maxCols;


        return(
            <TouchableOpacity onPress={()=>this.onPressFunc(cell)}
                              onLongPress={()=>this.onLongPressFunc(cell)}
                              activeOpacity={1}
                              style={{
                                // 设置cell的宽高
                                 width:cellWH,
                                 height:cellWH
                              }}
            >
                {this.renderCell(cell)}

            </TouchableOpacity>
        )
    },

    // 返回一个cell
    renderCell(cell){
        // console.log(cell);
        let cellWH = window.qxy_width / this.props.maxCols;
        if (cell.isShow){// 显示状态
            if (cell.isMine){// 是地雷
                return(
                    <Image
                        style={{
                        backgroundColor:'green',
                        width:cellWH,
                        height:cellWH,
                        borderWidth:1,
                        borderColor:'gray',

                        }}
                        source={{uri:'mine'}}
                    />
                )
            }else { // 不是地雷
                return(
                    <Image
                        style={{
                        width:cellWH,
                        height:cellWH,
                        borderWidth:1,
                        borderColor:'gray',
                        justifyContent:'center',
                        alignItems:'center'
                        }}
                        source={{uri:'show_num'}}
                    >
                        <Text style={{backgroundColor:'rgba(0,0,0,0)'}}>{cell.title}</Text>
                    </Image>
                )
            }
        }else {// 未显示
            if (cell.isWarning){// 标记
                return(
                    <Image
                        style={{
                        backgroundColor:'yellow',
                        width:cellWH,
                        height:cellWH,
                        borderWidth:1,
                        borderColor:'gray',
                        }}
                        source={{uri:'warning'}}
                    />
                )
            }else {// 未标记
                return(
                    <Image
                        style={{
                        backgroundColor:'blue',
                        width:cellWH,
                        height:cellWH,
                        borderWidth:1,
                        borderColor:'gray',
                        }}
                        source={{uri:'normal'}}
                    />
                )
            }


            
        }
    },
    
    // 单击击了一行
    onPressFunc(cell){
        if (this.props.onPressFunc==null)return;
        // 执行函数
        this.props.onPressFunc(cell);
    },
    // 长按
    onLongPressFunc(cell){
        if (this.props.onLongPressFunc==null)return;
        // 执行函数
        this.props.onLongPressFunc(cell);
    }
})



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    listViewStyle:{
        // 设置主轴的方向
        flexDirection:'row',
        // 多个cell在同一行显示
        flexWrap:'wrap',
        width:window.qxy_width,
    },
    cellStyle:{
        flex:1,
        backgroundColor:'#e8e8e8',
        // 水平居中和垂直居中
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderColor:'gray',
    }
});

// 输出组件类
module.exports = MineMapView;