/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

// 导入组件类
var Main = require('./Component/QXYMain');

class SweepMine extends Component {
  render() {
    return (
        <Main/>
    );
  }
}

AppRegistry.registerComponent('SweepMine', () => SweepMine);
