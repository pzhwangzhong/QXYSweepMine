

// 创建类
const SweepMineClass = {
    // 构造格子对象
    CellClass : Cell = function () {
        this.title = '';
        this.isMine = false;
        this.isShow = false;
        this.indexRow = 0;
        this.indexCol = 0;
        // 标识地雷
        this.isWarning = false;
        // 格子总数
        this.maxCellNum = 0;
    },
    
    // 构造游戏对象
    GameClass : Game = function () {
        // 是否失败
        this.isFail = false;
        // 是否胜利
        this.isWin = false;
        // 所有格子
        this.cells = [];
        // 所有地雷
        this.mines = [];
        // 记录已展示的格子数量
        this.cellShowNum = 0;
        this.maxCellNum = 0;
        this.maxRows = 0;
        this.maxCols = 0;
        this.maxMineNum = 0;

        // 得分
        this.score = 0;

        // 初始化方法
        this.create = function(maxCellNum,maxMineNum,maxCols) {
            // 清空cell数组
            this.cells = [];
            this.mines = [];
            this.maxCellNum = maxCellNum;

            // 总行数
            let maxRows = maxCellNum/maxCols;
            this.maxRows = maxRows;
            this.maxCols = maxCols;
            this.maxMineNum = maxMineNum;

            // 生成格子
            for(let i=0;i<maxRows;i++){
                let tempArr = [];
                for(let j=0;j<maxCols;j++){
                    let cell = new Cell();
                    tempArr.push(cell);
                    cell.indexRow = i;
                    cell.indexCol = j;
                }
                this.cells.push(tempArr);
            }

            // 生成地雷
            for(let i=0;i<maxMineNum;i++){
                let indexR = Math.floor(Math.random()*maxRows);
                let indexC = Math.floor(Math.random()*maxCols);
                let cell = this.cells[indexR][indexC];
                if (this.mines.indexOf(cell)!=-1){
                    i--;
                }else {
                    this.mines.push(cell);
                    cell.isMine = true;
                }
            }

            // 生成其他数字
            for(let i=0;i<maxRows;i++){
                for(let j=0;j<maxCols;j++){
                    let cell = this.cells[i][j];
                    if (!cell.isMine){// 不是地雷
                        let count = 0;

                        //判定是否出界
                        if(j-1>=0&&this.cells[i][j-1].isMine){//左
                            count++;
                        }
                        if (i-1>=0&&j-1>=0&&this.cells[i-1][j-1].isMine) {//左上
                            count++;
                        }
                        if (i-1>=0&&this.cells[i-1][j].isMine) {//上
                            count++;
                        }
                        if(i-1>=0&&j+1<maxCols&&this.cells[i-1][j+1].isMine){//右上
                            count++;
                        }
                        if(j+1<maxCols&&this.cells[i][j+1].isMine){//右
                            count++;
                        }
                        if(i+1<maxRows&&j+1<maxCols&&this.cells[i+1][j+1].isMine){//右下
                            count++;
                        }
                        if(i+1<maxRows&&this.cells[i+1][j].isMine){//下
                            count++;
                        }
                        if(i+1<maxRows&&j-1>=0&&this.cells[i+1][j-1].isMine){//左下
                            count++;
                        }

                        cell.title = count==0?null:count;
                    }
                }
            }

        };

        // 点击了cell
        this.tapCellOfIndex = function(cell) {

            // 已显示的cell不检测
            if (cell.isShow==false){
                cell.isShow = true;
                this.cellShowNum++;
            }

            // 游戏胜利或者失败 显示地图
            if (this.gameWin()||this.gameFalid(cell)){
                this.showMap();
            }else {
                this.checkTapPoint(cell);
            }

        };

        // 游戏胜利
        this.gameWin = function () {
            // 胜利
            // console.log(`已显示:${this.cellShowNum},总数:${this.maxCellNum},地雷数:${this.maxMineNum}`);
            if (this.cellShowNum>=this.maxCellNum-this.maxMineNum){
                this.isWin = true;

            }
            return this.isWin;
        };

        // 游戏失败
        this.gameFalid = function (cell) {
            if (cell.isMine){
                this.isFail = true;
            }
            return this.isFail;
        };

        // 显示全地图
        this.showMap=function () {
            for (let cellArr of this.cells){
                for (let cell of cellArr){
                    cell.isShow = true;
                }
            }
        };

        // 得分
        this.getScore = function (baseScore,warningScore,time) {
            // 基础分
            let score= baseScore;
            
            // 标记地雷得分
            let warningOne = warningScore;
            for (let cellArr of this.cells){
                for (let cell of cellArr){
                    if (cell.isWarning==true&&cell.isMine==true){
                        score += warningOne;
                    }
                }
            }
            // console.log(baseScore,warningOne,time);
            // 用时得分
            score -= time;
            if (score<=0)score=0;
            this.score = score;
            return score;
        };


        // 金手指(点击之后显示周围9格区域所有不是地雷的格子)
        this.goldenFinger=function(cell){

            let i = cell.indexRow;
            let j = cell.indexCol;

            //判定是否出界
            if (j-1>=0){
                let cell1 = this.cells[i][j-1];
                if(cell1.isMine==false&&cell1.isShow==false){//左
                    cell1.isShow=true;
                    this.cellShowNum++;
                    if (cell1.title==null)this.goldenFinger(cell1);
                }
            }

            if (i-1>=0&&j-1>=0){
                let cell2 = this.cells[i-1][j-1];
                if (cell2.isMine==false&&cell2.isShow==false) {//左上
                    cell2.isShow=true;
                    this.cellShowNum++;
                    if (cell2.title==null)this.goldenFinger(cell2);
                }
            }

            if (i-1>=0){
                let cell3 = this.cells[i-1][j];
                if (cell3.isMine==false&&cell3.isShow==false) {//上
                    cell3.isShow=true;
                    this.cellShowNum++;
                    if (cell3.title==null)this.goldenFinger(cell3);
                }
            }

            if (i-1>=0&&j+1<this.maxCols){
                let cell4 = this.cells[i-1][j+1];
                if(cell4.isMine==false&&cell4.isShow==false){//右上
                    cell4.isShow=true;
                    this.cellShowNum++;
                    if (cell4.title==null)this.goldenFinger(cell4);
                }
            }

            if (j+1<this.maxCols){
                let cell5 = this.cells[i][j+1];
                if(cell5.isMine==false&&cell5.isShow==false){//右
                    cell5.isShow=true;
                    this.cellShowNum++;
                    if (cell5.title==null)this.goldenFinger(cell5);
                }
            }

            if (i+1<this.maxRows&&j+1<this.maxCols){
                let cell6 = this.cells[i+1][j+1];
                if(cell6.isMine==false&&cell6.isShow==false){//右下
                    cell6.isShow=true;
                    this.cellShowNum++;
                    if (cell6.title==null)this.goldenFinger(cell6);
                }
            }

            if (i+1<this.maxRows){
                let cell7 = this.cells[i+1][j];
                if(cell7.isMine==false&&cell7.isShow==false){//下
                    cell7.isShow=true;
                    this.cellShowNum++;
                    if (cell7.title==null)this.goldenFinger(cell7);
                }
            }

            if (i+1<this.maxRows&&j-1>=0){
                let cell8 = this.cells[i+1][j-1];
                if(cell8.isMine==false&&cell8.isShow==false){//左下
                    cell8.isShow=true;
                    this.cellShowNum++;
                    if (cell8.title==null)this.goldenFinger(cell8);
                }
            }


            if(cell.isMine==false&&cell.isShow==false){//自己
                cell.isShow=true;
                this.cellShowNum++;
            }

            // 游戏是否胜利
            if (this.gameWin()){
                this.showMap();
            }
        };

        // 检测目标点
        this.checkTapPoint = function (cell){
            let i = cell.indexRow;
            let j = cell.indexCol;

            if (cell.isShow==false){
                cell.isShow=true;
                this.cellShowNum++;
            }
            if (cell.title!=null)return;

            //判定是否出界
            if (j-1>=0){

                let cell1 = this.cells[i][j-1];
                if(cell1.isMine==false&&cell1.isShow==false){//左
                    cell1.isShow=true;
                    this.cellShowNum++;
                    if (cell1.title==null)this.checkTapPoint(cell1);
                }
            }

            if (i-1>=0&&j-1>=0){
                let cell2 = this.cells[i-1][j-1];
                if (cell2.isMine==false&&cell2.isShow==false) {//左上
                    cell2.isShow=true;
                    this.cellShowNum++;
                    if (cell2.title==null)this.checkTapPoint(cell2);
                }
            }

            if (i-1>=0){
                let cell3 = this.cells[i-1][j];
                if (cell3.isMine==false&&cell3.isShow==false) {//上
                    cell3.isShow=true;
                    this.cellShowNum++;
                    if (cell3.title==null)this.checkTapPoint(cell3);
                }
            }

            if (i-1>=0&&j+1<this.maxCols){
                let cell4 = this.cells[i-1][j+1];
                if(cell4.isMine==false&&cell4.isShow==false){//右上
                    cell4.isShow=true;
                    this.cellShowNum++;
                    if (cell4.title==null)this.checkTapPoint(cell4);
                }
            }

            if (j+1<this.maxCols){
                let cell5 = this.cells[i][j+1];
                if(cell5.isMine==false&&cell5.isShow==false){//右
                    cell5.isShow=true;
                    this.cellShowNum++;
                    if (cell5.title==null)this.checkTapPoint(cell5);
                }
            }

            if (i+1<this.maxRows&&j+1<this.maxCols){
                let cell6 = this.cells[i+1][j+1];
                if(cell6.isMine==false&&cell6.isShow==false){//右下
                    cell6.isShow=true;
                    this.cellShowNum++;
                    if (cell6.title==null)this.checkTapPoint(cell6);
                }
            }

            if (i+1<this.maxRows){
                let cell7 = this.cells[i+1][j];
                if(cell7.isMine==false&&cell7.isShow==false){//下
                    cell7.isShow=true;
                    this.cellShowNum++;
                    if (cell7.title==null)this.checkTapPoint(cell7);
                }
            }

            if (i+1<this.maxRows&&j-1>=0){
                let cell8 = this.cells[i+1][j-1];
                if(cell8.isMine==false&&cell8.isShow==false){//左下
                    cell8.isShow=true;
                    this.cellShowNum++;
                    if (cell8.title==null)this.checkTapPoint(cell8);
                }
            }
        }
    }
};



// 输出组件类
module.exports = SweepMineClass;

