<!-- 活动页 -->
<template>
    <!-- 置顶活动 -->
    <div class="F-action" v-for="list in lists">
        <group :timeChange="timeChange(list)">
            <divider>{{ list.cont }}</divider>
            <cell>
            <!-- 活动倒计时 -->
                <clocker :time='list.toptime' slot="value" style='font-size:1.25rem'>
                    <span style="color:red">%D 天</span>
                    <span style="color:red">%H 小时</span>
                    <span style="color:red">%M 分 %S 秒</span>
                </clocker>
            </cell>
        </group>
        <!-- 置顶活动的内容 -->
        <div class="actions" track-by='$index' v-link="'/actionDetail/'+list.id" id="{{list.id}}">
            <div class="left">
                <div class="actionname">{{ list.actionname }}</div>
                <div class="icons">
                    <div class="icon">
                        <div class="icon2"></div>
                        {{list.replys}}
                        <div class="applynums">人数上限: {{ list.applynum }} </div>
                    </div>
                </div>
                <div class="info">{{list.intro}}</div>
                <div class="actiontime"> 开始时间：{{ list.begintime.substring(0,10) }} </div>
                <div class="actiontime"> 结束时间：{{ list.endtime.substring(0,10) }} </div>
            </div>
            <div class="right">
                <div class="actBgm"></div>
                <span v-show="(list.acoord+'').length<5">距离：{{list.acoord}}米</span>
            </div>
        </div>
    </div>
    <!-- 普通活动 -->
    <div class="h-action">
        <div class="F-action" v-for="aList in AllLists">
            <div class="simple-actions" track-by='$index' v-link="'/actionDetail/'+aList.id" id="{{aList.id}}">
                <div class="left">
                    <div class="actionname">{{ aList.actionname }}</div>
                    <div class="icons">
                        <div class="icon">
                            <div class="icon2"></div>
                            {{aList.replys}}
                            <div class="applynums">人数上限:{{ aList.applynum }} </div>
                        </div>
                    </div>
                    <div class="info">{{aList.intro}}</div>
                </div>
                <div class="right">
                    <div class="actBgm"></div>
                    <div v-show="(aList.acoord+'').length<5">距离:{{aList.acoord}}米</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    SetAjax
} from './setAjax.js'
import {
    Group,
    Cell,
    Clocker,
    Divider
} from 'vux/src/components'
import {
    getTop,
    URL_GET_ACTION
} from './api.js'
export default {
    components: {
        Group,
        Cell,
        Clocker,
        Divider
    },
    data() {
        return {
            lists: [],
            aLists: [],
            AllLists: []
        }
    },
    vuex:{
        getters:{
            distance:state=>state.distance
        }
    },
    ready() {
        // this.getTopAction(); // 获取置顶活动
        this.getAction().then(values=>{
            const response1 = values[0];
            const response2 = values[1];
            // console.log(2);
            response1.data.length!=0&&[this.lists=response1.data];
            // 置顶活动;
            response2.data.forEach((c,i)=>{
                response1.data.forEach(v=>{
                    c.id == v.id && [response2.data.splice(i,1)];
                })
            })
            this.AllLists = response2.data;
        });    // 获取普通活动
        // console.log(3);
    },
    methods: {
        // 获取活动
        getAction: function() {
          // console.log(1);
            return Promise.all([
                    this.$http.post(getTop,{ulat:this.distance}),
                    this.$http.post(URL_GET_ACTION,{ulat:this.distance})
                ]);
        },
        //  置顶活动 时间
        timeChange: function(list) {
            var _data = +(new Date()) * 1;
            var _begintime = (+new Date(list.begintime)) * 1;
            var _endtime = (+new Date(list.endtime)) * 1;
            if (_data > _begintime) {
                list.cont = "距活动结束还剩"
                list.toptime = list.endtime

            } else {
                list.cont = "距活动开始还剩"
                list.toptime = list.begintime
            }
        }
    }
}
</script>
<style>
.h-action {
    margin-bottom: 12.5rem;
}

.F-action .weui_cell {
    padding: .4167px;
}

.F-action .weui_cell_bd {
    display: none;
}

.F-action .weui_cell_ft {
    margin: auto;
}

.F-action .vux-divider:after,
.vux-divider:before {
    width: 30%;
}

.F-action .vux-divider {
    margin: auto;
    padding-top: 10px;
    padding-bottom: 0;
    font-size: .8333rem;
    color: #333;
}

.F-action .weui_cell:before {
    display: none;
}

.F-action .weui_cells:after {
    display: none;
}

.F-action .vux-no-group-title {
    margin-top: .8333rem;
}

.actions {
    display: flex;
    justify-content: space-between;
    background: #fff;
    border-bottom: .8333rem solid #eee;
}

.simple-actions {
    display: flex;
    justify-content: space-between;
    background-color: rgba(255, 255, 255, 0.7);
    border-bottom: .8333rem solid #eee;
}

.left {
    margin-left: 1rem;
}

.right {
    margin-right: 1rem;
}

.actiontime {
    color: tomato;
    text-align: center;
    font-size: .8333rem;
}

.icon {
    display: inline-block;
    padding: .2rem;
    display: flex;
    flex-flow: row;
    width: 100%;
}

.icon2 {
    display: flex;
    width: 1.2rem;
    height: 1.2rem;
    background: url('../assets/home_bubble@2x_0.png') no-repeat;
}

.applynums {
    display: flex;
    margin-left: 2rem;
}

.actionname {
    margin-top: .2rem;
    font-size: 1.5rem;
    color: #f95377;
    text-align: center;
}

.actBgm {
    width: 13.3333rem;
    height: 7.0833rem;
    margin: 1rem 0;
    background: url('../assets/home_act_pic@1x.png');
}

.info {
    height: 3rem;
    text-indent: .8333rem;
    font-size: 1rem;
    overflow: hidden;
    color: #999;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>
