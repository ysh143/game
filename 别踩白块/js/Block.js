function Block(container) {
    this.container = container;                                    //定义容器div
    this.mainW = this.container.parentNode.clientWidth;            //定义父元素宽度
    this.mainH = this.container.parentNode.clientHeight;           //定义父元素高度
    this.scale = 1.58;                                             //黑块儿的高宽比
    this.height = parseInt(this.mainW/4*this.scale);               //定义黑块儿高度
    this.top = -this.height;
    this.speed = 2;                                                //定义速度
    this.maxSpeed = 20;                                            //定义最大速度
    this.timer = null;                                             //定时器id
    this.state = true;                                             //游戏状态
    this.sum = 0;                                                  //分数
}

Block.prototype = {

    init:function(){
        var _t = this;
        _t.mark();                                                 //显示初始分数
        _t.container.addEventListener("click",function(e){
            if(!_t.state){
                return false;
            }
            e = e || window.event;                                 //获取事件对象
            var target = e.target || e.srcElement;                 //获取触发事件的元素
            if(target.className.indexOf('block')!=-1){
                _t.sum++;                                          //分数加1
                //显示分数
                document.getElementsByClassName("mark")[0].innerHTML = _t.sum;
                target.className = 'blank';                        //设置类名
            }else{
                _t.state = false;                                  //变量赋值
                clearInterval(_t.timer);                           //停止移动
                _t.end();                                          //游戏结束
                return false;
            }
        });
    },

    //显示分数
    mark:function(){
        var oMark = document.createElement("div");                 //创建div
        oMark.className = "mark";                                  //设置类名
        oMark.innerHTML = this.sum;                                //设置HTML
        this.container.parentNode.appendChild(oMark);               //添加元素
    },

    addRow:function(){
        var oRow = document.createElement('div');    //创建div元素
        oRow.className = 'row';                     //设置类名
        oRow.style.height = this.height + 'px';     //设置元素高度
        var blanks = ['blank','blank','blank','blank'];  //定义数组
        var s = Math.floor(Math.random()*4);        //获取0~3的随机数
        blanks[s] = "blank block";                  //为指定下标的数组元素赋值
        var oBlank = null;
        for (var i=0; i<4; i++) {
            oBlank = document.createElement('div'); //创建div元素
            oBlank.className = blanks[i];           //设置类名
            oRow.appendChild(oBlank);               //添加元素
        }
        var fChild = this.container.firstChild;     //获取第一个子元素
        if( fChild == null ){
            this.container.appendChild(oRow);       //在末尾添加元素
        }else{
            this.container.insertBefore(oRow , fChild);  //在最前面添加元素
        }
    },

    // 22.5.2 游戏界面向下移动
    move:function(){
        this.top += this.speed;
        this.container.style.top = this.top + 'px';
    },

// 22.5.3 判断游戏状态
    judge:function(){
        var _t = this;
        if(_t.top >= 0){
            _t.top = -this.height;
            _t.container.style.top = _t.top + 'px';
            _t.addRow();
        }
        _t.speed = (parseInt(_t.sum/5)+1)*2;
        if(_t.speed >= _t.maxSpeed ){
            _t.speed = _t.maxSpeed;
        }
        var blocks = document.getElementsByClassName('block');
        for (var j=0; j<blocks.length; j++){
            if ( blocks[j].offsetTop >= _t.mainH ){
                _t.state = false;
                clearInterval(_t.timer);
                _t.end();
            }
        }
    },

// 22.5.4 开始游戏
    start:function(){
        var _t = this;
        for( var i=0; i<4; i++ ){
            _t.addRow();
        }
        _t.timer = setInterval(function(){
            _t.move();
            _t.judge();
        },30);
    },

    end:function(){
        var _t = this;
        if( !document.getElementById("result") ){
            var result = document.createElement('div');
            result.className = 'result';
            result.id = 'result';
            result.innerHTML = '<h1>GAME OVER</h1><h2 id="score">分数: '+_t.sum+'</h2><span id="restart">重新开始</span>';
            _t.container.parentNode.appendChild(result);
        }else{
            var result = document.getElementById("result");
            result.style.display = "block";
            var score = document.getElementById("score");
            score.innerHTML = "分数:"+_t.sum;
        }
        var restart = document.getElementById("restart");
        restart.onclick = function(){
            _t.again();
            result.style.display = "none";
            return false;
        }
    },

    again:function(){
        // 1. 先清除旧的定时器（防止残留逻辑继续跑）
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        // 2. 清空容器里所有旧的色块行（关键！解决界面错乱）
        this.container.innerHTML = "";
        // 3. 隐藏游戏结束界面（如果存在）
        var result = document.getElementById("result");
        if (result) {
            result.style.display = "none";
        }
        // 4. 重新初始化所有属性
        this.mainW = this.container.parentNode.clientWidth;
        this.mainH = this.container.parentNode.clientHeight;
        this.scale = 1.58;
        this.height = parseInt(this.mainW/4*this.scale);
        this.top = -this.height;
        this.speed = 2;
        this.state = true;
        this.sum = 0;
        var _t = this;
        // 5. 重置分数显示
        document.getElementsByClassName('mark')[0].innerHTML = _t.sum;
        // 6. 重新开始游戏
        _t.start();
    }
}