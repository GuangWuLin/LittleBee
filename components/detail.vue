<!-- 详情页 -->
<template>
    <div class="page" @click='hide'>
        <div class="home-top">
            <x-header :left-options="{showBack: false}" style="background:#f95377">
                <p class="gdetil">{{news.gardenname}}</p >
                <div class="header_left" @click="back"></div>
                <div></div>
            </x-header>
        </div>
        <div id="container">
            <div class="flex-item">
                <div class="main">

                  <div class="gardenBgm">
                      <swiper :list="list" :min-moving-distance="20" auto="" dots-position="center" height="228px"></swiper>
                  </div>

                    <!-- <div class="gardenBgm"></div> -->
                    <div class="content">
                        <div class="title">学校简介</div>
                        <!-- <div class="title">学校简介</div> -->
                        <div class="gardenInfo gardenInfo_">{{ news.intro }}</div>
                    </div>
                    <div class="comment">
                        <!-- <div class="title">评论</div> -->
                        <div class="title">评价</div>
                        <div class="userComments">
                            <comment-component v-ref:commentlist></comment-component>
                        </div>
                    </div>
                    <div class="ttt" v-if='Textarea'>
                        <div class="ttt_heard">
                            <div @click="del" class="left">
                                取消
                            </div>
                            <div @click="submit" class="right">
                                发送
                            </div>
                        </div>
                        <group>
                            <x-textarea :max="200" placeholder="请输入您的评论" :value.sync='msg'></x-textarea>
                        </group>
                    </div>
                </div>
            </div>
        </div>
        <toast :show.sync="show1" type="warn" width="9.6rem" :time='1500'>请输入文字后再发送</toast>
        <toast :show.sync="show2" type="warn" width="9.6rem" :time='1500'>您还没登陆，请登陆</toast>
        <footer class="footers" v-if='showFooter'>
            <div class="login" @click="gLogin" v-if="token == '' ||
            this.$route.params.id != (this.teacher.User ? this.teacher.User.gid :0)">小蜜蜂</div>
            <div class="login" @click="gLogin" v-else>进入园区</div>
            <div class="footTitle" @click='comment' v-show="Login">评论</div>
            <div class="footTitle" v-else @click='dLogin'>登录</div>
        </footer>
    </div>
</template>
<script>
import {
    SetAjax,
    getCookie
} from './setAjax.js'
import {
    XTextarea,
    Group,
    XHeader,
    Toast,
    Swiper,
    Divider
} from 'vux/src/components'
import commentComponent from './commentList.vue'
import {
    URL_USER_AddComment,
    URL_GET_GardenLIST,
    URL_USER_GetGardenTopic,
    URL_USER_AddReply,
    bucket,
    downLoadUrl,
    getImageListUrl
} from './api.js'
var noteID = undefined;
export default {
    components: {
        commentComponent,
        XTextarea,
        Group,
        Swiper,
        Toast,
        XHeader,
        Divider
    },
    data() {
        return {
            news: {},
            Textarea: false,
            showFooter: true,
            msg: '',
            list:[],
            preList:[{img:require('../assets/school_pic@1x_0.png')}],
            key:'',
            imgList:{},
            show1: false,
            show2: false,
            token: '',
            Login: true
        }
    },
    vuex: {
        getters: {
            teacher: state => state.teacherUser,
            name: state => state.name
        }
    },
    methods: {
        back() {
            window.history.back(-1);
        },
        dLogin() {
            this.$router.go('/register/login');
        },
        getImgList:function(){
          if(this.key!=''){
            // console.log(this.key);
            return Promise.resolve(this.$http.post(getImageListUrl,{"key":this.key}))
          }
          return Promise.reject();
        },
        pull(e) {
            // console.error(e.target.parentNode.children[0]);
            var node = e.target.parentNode.children[0];
            if (clicks % 2 == 0) {
                node.style.display = 'inline';
                clicks++;
            } else {
                node.style.display = '-webkit-box';
                clicks++;
            }
            // console.log(clicks)
        },
        hide(e) {
            this.display = 'none';
        },
        comment(e) {
            e.stopPropagation();
            if (!this.token) {
                this.show2 = true;
                this.Login = false;
            } else {
                this.Textarea = true;
                this.showFooter = false;
            }
        },
        gLogin() {
            if (!this.token) {
                this.show2 = true;
            } else {
                if (this.teacher.User.gid == this.$route.params.id) {
                    this.$router.go('/garden');
                }
            }
        },
        submit() {
            //console.log(URL_USER_AddCOMMENT);
            //添加主题帖
            // console.log(this.msg);
            let _id = this.$route.params.id;
            var message = this.msg;
            if (this.msg.trim().length > 0) {
                SetAjax('post', URL_USER_AddComment, {
                    content: {
                        gid: _id,
                        content: this.msg
                    },
                    'flor_token': this.token
                }, (response) => {
                    // console.log(response);
                    noteID = response.data.tid;
                    // console.log(noteID, message);
                    this.$broadcast('parent-msg', {
                        msg: message,
                        id: noteID
                    });
                }, (response) => {
                    // console.log('from commit error' + response);
                });
                // console.log(noteID)
                this.msg = '';
                this.display = 'none';
                this.Textarea = false;
                this.showFooter = true;
            } else {
                // alert('您尚未输入任何东西哟~');
                this.show1 = true;
            }


        },
        del() {
            this.Textarea = false;
            this.showFooter = true;
        }
    },
    route: {
        data(t) {
            this.$set('key','g/in/'+this.$route.params.id+'/');
            this.token = getCookie('token');
            this.news = {};
            var vm = this;
            let _id = this.$route.params.id;
            this.$refs.commentlist.get(URL_USER_GetGardenTopic, {
                gid: _id
            });
            /* alert('detail\'s route!');*/
            this.$http.post(URL_GET_GardenLIST, {
                select: {
                    name: this.name
                }
            }).then((response) => {
                // console.log(response);
                response.data.forEach(function(c) {
                    if (c.id === _id) {
                        vm.news = c;
                    }
                });
            });
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
                  this.list.push({img:values.body[o]});
                }
                // this.list = values.body;
                // console.log(this.list);
              },(reject)=>{
                // console.log(reject);
                this.list = this.preList;
                // console.log(this.list);
              }).catch(e=>{
                // console.log(e);
              });
            t.next();
        }
    }
}
</script>
<!-- scoped 只在当前组件应用样式 -->
<style scoped>
.header_left {
    position: absolute;
    top: 1rem;
    left: 1.4rem;
    width: 1rem;
    height: 2rem;
    background: url('../assets/back@1x_0.png') no-repeat;
}
.vux-slider{
  width: 100%;
}
.gdetil{
    font-size: 2rem;
    font-weight: bold;
}
.page,
.main,
.userComments,
.comment {
    display: flex;
    flex-flow: column;
}

.footers,
.wrap {
    display: flex;
    flex-flow: row;
}
.title{
    margin-top: 1rem;
    margin: auto;
    text-align: center;
    font-size: 1.6rem;
    font-family: '黑体';
}
.commentArea {
    justify-content: center;
    display: flex;
    position: fixed;
    width: 100%;
    font-size: 1.3rem;
    border: 1px solid #333;
    bottom: 3rem;
}

.page {
    flex: 1;
    min-height: 100vh;
    justify-content: space-between;
    /*overflow: hidden;*/
    position: absolute;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
}

.main {
    flex: 1;
    justify-content: flex-start;
    /* margin-top: .5rem;*/
    overflow-x: hidden;
    overflow-y: auto;
    margin-bottom: 1rem;
}

.flex-item {
    /*给"子元素"赋予自由伸缩的能力*/
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    overflow-x: hidden;
}

#container {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    /*指定主轴的伸缩流方向是纵向的*/
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 100%;
    /* overflow: hidden; */
    background: #eee;
}

hr {
    filter: alpha(opacity: 100, finishopacity: 0, style: 3);
    width: 98%;
    color: #987cb9;
    size: 3;
}

.footers {
    height: 4rem;
    font-size: 1.4rem;
    z-index: 2;
    color: #fff;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 0;
    background: #f95377;
}

.login {
    display: flex;
    text-align: center;
}

.commentTitle {
    display: flex;
    text-align: center;
}

.gardenBgm {
    margin-top: 1rem;
    /*background: url('../assets/school_pic@1x_0.png') no-repeat;*/
    background-size: 100%;
    width: 100%;
    height: 19rem;
}

.gardenInfo {
    justify-content: center;
    font-size: 1.4rem;
    color: #999;
    text-indent: 2em;
    line-height: 2rem;
    margin: 1rem;
    flex: 1;
}

.content {
    width: 100%;
    justify-content: center;
    margin-top: 1rem;
    background-color: #fff;
}
.mark {
    display: flex;
    font-size: 1.2rem;
    color: #f95377;
    justify-content: center;
    margin-left: 1rem;
}

.comment {
    background-color: rgba(255, 255, 255, 0.8);
    margin-top: 1rem;
}

.ttt {
    display: flex;
    flex-direction: column;
    height: 60%;
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
    background-color: rgba(255, 255, 255, 1);
}

.ttt_heard {
    background-color: rgba(204, 204, 204, 0.2);
    display: flex;
    justify-content: space-between;
    font-size: 1.5rem;
    color: #999;
}

.ttt_heard .left,
.right {
    height: 2.5rem;
    width: 4rem;
    background: #f95377;
    text-align: center;
    margin: .5rem;
    border-radius: .2rem;
    color: #fff;
}
</style>
