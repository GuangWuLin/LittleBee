<template>
    <!-- 轮播图 -->
    <div class="swiper" v-link="'/around'">
        <swiper :list="imglist" :min-moving-distance="20" auto="" dots-position="center" height="13.3333rem"></swiper>
    </div>
    <!-- 3个图标 -->
    <div class="Zcenter">
        <a href="javascript: ;" @click="showSign">
            <div class="b2"></div>
            <span>快速签到</span>
        </a>
        <a href="javascript: ;" @click='enter'>
            <div class="b3"></div>
            <span>幼儿园</span>
        </a>
    </div>
    <!-- 活动 -->
    <div class="F-action" v-for="list in lists">
        <group :timeChange="timeChange(list)">
            <divider>{{ list.cont }}</divider>
            <cell>
                <clocker :time='list.toptime' slot="value" style='font-size:1.25rem'>
                    <span style="color:red">%D 天</span>
                    <span style="color:red">%H 小时</span>
                    <span style="color:red">%M 分 %S 秒</span>
                </clocker>
            </cell>
        </group>
        <div class="actions" track-by='$index' v-link="'/actionDetail/'+list.id" id="{{list.id}}">
            <div class="left">
                <div class="actionname">{{ list.actionname }}</div>
                <div class="icons">
                    <div class="icon">
                        <div class="icon2"></div>
                        <span>{{list.replys}}</span>
                        <div class="applynums">人数上限: {{ list.applynum }} </div>
                    </div>
                </div>
                <div class="info">{{list.intro}}</div>
                <div class="actiontime"> 开始时间：{{ list.begintime.substring(0,10) }} </div>
                <div class="actiontime"> 结束时间：{{ list.endtime.substring(0,10) }} </div>
            </div>
            <div class="right">
                <div class="actBgm"></div>
            </div>
        </div>
    </div>
    <!-- banner与周边 -->
    <div class="F-banner">
        <div class="banner">
            <swiper :list="imglist" auto="" :show-dots="false" height="14.5833rem" ></swiper>
        </div>
        <div class="around">
            <p class="saround">发现周边</p>
            <hr style="margin-top: 0px; margin-bottom:0px;">
            <div class="around-list" v-for="school in schools | limitBy 5" track-by='$index' @click="routes(school)">
                <div id="home-aroundpic"></div>
                <div class="content">
                    <div class="gardenname">{{ school.gardenname }}</div>
                    <div class="star">
                        <rater :value=5 :max=5 :font-size=15 active-color="#FF9900" :disabled=true></rater>
                        <div class="dec" v-show="(school.coord+'').length<5">距离:{{school.coord}}米</div>
                    </div>
                    <div class="gardenAddress" id="{{id}}">地址:{{ school.adname }}{{school.site}}</div>
                </div>
            </div>
        </div>
    </div>
    <toast :show.sync="show1" type="warn" width="9.6rem" :time='1500'>
        <p v-if='enterGarden'>您还未登陆或未绑定学校，无法进入园区</p>
        <p v-else>您还未登陆,无法签到</p>
    </toast>
    <toast :show.sync="show" width="50%" type="text">
        <p style="color:#fff;">{{signMess}}</p>
        <p style="color:#fff;">{{signAlertTitle}}</p>
        <p style="color:#fff;">{{signAlertContent}}</p>
    </toast>
</template>
<script type="text/javascript">
import Swiper from 'vux/src/components/swiper'
import {
    Group,
    Cell,
    Clocker,
    Divider,
    Rater,
    Confirm,
    Toast
} from 'vux/src/components'
import {
    URL_GET_GardenLIST,
    getTop,
    SetSignins,
    GetSignins,
    GetGardenInfo,
    bucket,
    downLoadUrl,
    getImageListUrl
} from './api.js'
import {
    getCookie
} from './setAjax.js';
export default {
    components: {
        Swiper,
        Group,
        Cell,
        Clocker,
        Divider,
        Rater,
        Confirm,
        Toast
    },
    data() {
        return {
            imglist: [],
            imgList:{},
            lists: [],
            schools: [],
            page: 1,
            signMess: "",
            show: false,
            show1: false,
            show2: false,
            enterGarden:false,
            token: '',
            signAlertTitle: "",
            signAlertContent: "",
            mySign: '我的签到',
             key: '',
            preList:[{img:require('../assets/home_swiper@1x_0.jpg')}]
        }
    },
    vuex: {
        getters: {
            'teacher': state => state.teacherUser,
            'distance': state => state.distance,
            'sign': state => state.sign //签到信息   
        }
    },
    ready() {
        this.$set('key','a/out/');//定义key值
        this.token = getCookie('token');
        this.getTopAction();
        this.getAround();
        // this.getSign();
        this.getImgList().then(values=>{
                // console.log(values);
                // console.log(values.body);
                if(values.body.length>0 && typeof values.body!=="String"){
                  // console.log('is am here')
                  values.body.forEach(c=>{
                    this.imgList[c]='http://'+bucket+'/'+c+'?';
                  });
                  // console.log(this.imgList);
                  return Promise.resolve(this.$http.post(downLoadUrl,{'data':this.imgList}));
                }
                return Promise.reject();
              },(reject)=>{
                // console.log(reject);
              }).then(values=>{
                // console.log(values.body);
                for(o in values.body){
                  this.imglist.push({img:values.body[o]});
                }
                // this.list = values.body;
                // console.log(this.imglist);
              },(reject)=>{
                // console.log(reject);
                this.imglist = this.preList;
                // console.log(this.imglist);
              }).catch(e=>{
                // console.log(e);
              });
            },
    methods: {
        routes(school){
            // console.warn(school);
            this.$store.dispatch('NAME',school.gardenname);
            this.$router.go('/detail/'+school.id);
        },
        // 获取置顶的活动
        getTopAction: function() {
            this.$http.get(getTop).then(
                (r) => {
                    if (r.data.length > 1) {
                        var _this = this
                        r.data.forEach(function(c) {
                            if (c.typename != "默认置顶活动") {
                                _this.lists.push(c)
                            }
                        })
                    } else {
                        this.lists = r.data;
                    }
                },
                (r) => {
                    console.log("没进来")
                })
        },
        // 获取周边
        getAround: function() {
            // console.log(this.distance);
            this.$http.post(URL_GET_GardenLIST,{
                page:'1,9999999',
                ulat:this.distance
            }).then(
                (r) => {
                    this.schools = r.data;
                    this.$store.dispatch('GARDENS', r.data);
                });
        },
       getImgList:function(){
            if(this.key!=''){
              // console.log(this.key);
              return Promise.resolve(this.$http.post(getImageListUrl,{"key":this.key}))
                    }
            return Promise.reject();
          },
        // 活动倒计时
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
        },
        // 签到（显示 签到信息 及签到）
        showSign() {
            if (!this.token) {
                this.show1 = true; //
                this.enterGarden = false;
            } else {
                this.setSign();
                this.show = true;
            }
        },
        // 签到
         setSign( ) {

      this.$http.post( SetSignins, {
          'flor_token': this.token
        } ).then(
          ( r ) => {
            this.show = true;
            if ( !r.data ) {
              this.signMess = "你已签到！"
              this.signAlertTitle = "请不要重复签到！";
            } else {
              if ( this.sign.festival ) {
                this.signMess = '节日签到，积分+' + this.sign.festival;
              }
              if ( r.data.first ) {
                this.signAlertContent = "首次签到成功！";
                this.$store.dispatch( 'SET_INTEGRAL', r.data.first ); // 首签
                this.$store.dispatch( 'TO_SIGN', {
                  0: {
                    count: 1,
                    signcount: 0
                  }
                } )
              }
              if ( r.data.count ) {
                this.signMess = "签到成功！"
                this.$store.dispatch( 'TO_SIGN',{0:r.data}  )
                this.$store.dispatch( 'SET_INTEGRAL', r.data.integral )
              }
            }
          },
          ( r ) => {

          } )
    },
        //进入园区（作为用户）
        enter() {
            // console.log(this.teacher);
            if (!this.token || this.teacher.User == null) {
                this.show1 = true;
                this.enterGarden = true;
            } else {
                this.$http.post(GetGardenInfo, {
                    'gid': this.teacher.User.gid,
                    'flor_token': this.token
                }).then((response) => {
                    // console.log(response.body);
                    this.$store.dispatch("GARDEN_INFO", response.body,'asUser');
                    this.$router.go('/garden');
                }, (response) => {
                    console.log(response);
                });
            }
        },

    }
}
</script>
<style>
/*3个应用 我的签到、我的积分、学校*/

.Zcenter {
    width: 100%;
    height: 5.5rem;
    display: flex;
    justify-content: space-around;
    background: #fff;
}

.Zcenter a {
    width: 120px;
    text-align: center;
    padding-top: 2px;
    color: #333;
}

.Zcenter span {
    font-size: .8333rem;
}

.Zcenter div {
    width: 3.75rem;
    height: 3.75rem;
    margin: auto;
}

.Zcenter .b1 {
    background: url('../assets/home_integral@1x_0.png') no-repeat;
}

.Zcenter .b2 {
    background: url('../assets/home_sign@1x_0.png') no-repeat;
}

.Zcenter .b3 {
    background: url('../assets/home_school@1x_0.png') no-repeat;
}


/*活动*/

.F-action .weui_cell {
    padding: .4167rem;
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

.F-banner {
    margin-bottom: 13.5rem;
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
    font-size: 1.5rem;
    color: #f95377;
    /*margin-left: .6667rem;*/
    text-align: center;
}


/*活动背景图*/

.actBgm {
    width: 13.3333rem;
    height: 7.0833rem;
    margin-top: 2rem;
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


/* 周边 */

.around {
    background: #fff;
}
.saround{
    margin-left: .9rem;
    margin-top: .5rem;
    color: #c88570;
    font-size: 2rem;
}
.around-list {
    display: flex;
    flex-flow: row;
    line-height: 1.2rem;
    padding: .8rem;
    margin-top: .5rem;
    background: #fff;
    border-bottom: 1px solid #b6b6b6;
}

/*周边图片*/

#home-aroundpic {
    width: 10rem;
    height: 5rem;
    background-color: pink;
    display: inline-block;
    margin: .3rem;
    background: url('../assets/around_pic@1x_0.png');
}

.star {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.dec {
    color: #c88570;
    font-size: 1.25rem;
}

.list {
    display: flex;
    flex-flow: column;
    flex: 1;
}

.gardenAddress,
.coord {
    font-size: 1rem;
    color: #999;
}

.gardenname {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333333;
}

.gardenname,
.gardenAddress,
.coord,
.star {
    padding: .4rem;
}

.content {
    width: 60%;
    display: flex;
    padding: .2rem;
    flex-flow: column wrap;
    justify-content: space-around;
    align-items: baseline;
    flex-grow: 1;
}
</style>
