<!-- 回复主题帖以及回复的 -->
<template>
    <div class="main">
        <header class="header">
            <div class="pull-left" @click="back"></div>
        </header>
        <div class="details">
            <div class="userInfo">
                <div class="userpic">
                    <img :src="downImg.url" style="height:50px;width:50px;border-radius:50%;margin-left:1rem;">
                </div>
                <div class="comment">
                    <div class="user">
                        <div class="userName">
                            {{ comment.nickname }}
                        </div>
                        <div class="commentTime">
                            {{ comment.edittime?comment.edittime.slice(5,-3):'' }}
                        </div>
                        <div class="content">
                            {{ comment.content }}
                        </div>
                    </div>
                </div>
                <div class="wrap">
                    <div class="wrap1">
                        <div class="praise" v-if="this.$route.name == 'detail' || 'actionDetails'" @click='Praise(comment)'>
                        </div>
                        <div class="">{{ comment.up }}</div>
                    </div>
                </div>
            </div>
            <div class="repaly">回复</div>
            <comment-list v-ref:list></comment-list>
        </div>
        <group v-if='showBtn'>
            <x-button @click='reply' text='回帖' type="warn"></x-button>
        </group>
        <div class="foot" v-if='showCom'>
            <group title='评论主题帖'>
                <x-textarea :max="200" placeholder="请输入您的评论" :value.sync='message' required></x-textarea>
                <x-button @click='fSubmit' text="发表" mini type="warn"></x-button>
            </group>
        </div>
    </div>
    <toast :show.sync="show1" type="warn" width="9.6rem" :time='1500'>请输入文字后再发送</toast>
    <toast :show.sync="show2" type="warn" width="9.6rem" :time='1500'>您还没登陆，请登陆</toast>

</template>
<script type="text/javascript">
var _reid, markID, count = 0;
var geturl = '';
var addurl = '';
var getdata = {},
    adddata = {};
import CommentList from './commentList.vue';
import {
    Group,
    Divider,
    XInput,
    XButton,
    XTextarea,
    Toast
} from 'vux/src/components'
import {
    SetAjax,
    getCookie
} from './setAjax.js';
import {
    URL_USER_GetGardenReply,
    URL_USER_AddRemark,
    URL_USER_AddReply,
    URL_USER_AddEstimate,
    bucket,
    downLoadUrl
} from './api.js';
export default {
    components: {
        CommentList,
        Group,
        Divider,
        XInput,
        XButton,
        Toast,
        XTextarea
    },
    data() {
        return {
            comment: '',
            showBtn: true,
            message: '',
            show1: false,
            show2:false,
            showCom: false,
            token:'',
            downImg:{
                'url':''
            },
            key:'u/',
            oldPra:0,
            newPra:0,
            flag:true
        }
    },
    events: {
        'show1': function() {
            // console.log('son say daddy')
            this.show1 = true;
        }
    },
    methods: {
        back() {
            // console.log(this.newPra+'|'+this.oldPra);
            if (this.oldPra*1 === this.newPra*1 - 1) {
                // console.warn(this.newPra+'||'+this.$route.params.id );
                this.$http.post(URL_USER_AddEstimate,{'tid':this.$route.params.id,'flor_token':this.token}).then((response)=>{
                    // console.log(response)
                    this.flag = false;
                },(response)=>{

                });
            }
            count = 0;
            window.history.back(-1);
            this.showCom = false;
            this.showBtn = true;
        },
        reply() {
            if (!this.token) {
                this.show2 = true;
            }else{
                this.showBtn = false;
                this.showCom = true;
            }
        },
        Praise(comment) {
            // console.log(this.oldPra)
            if (!this.token) {
                this.show2 = true;
            }else{
                if (this.flag) {
                    if (count % 2 == 0) {
                        comment.up++;
                        this.newPra = parseInt(this.oldPra) + 1;
                    } else {
                        comment.up--;
                        this.newPra = parseInt(this.oldPra) - 1;
                    }
                    count++;
                }
            }
        },
        imgurl(key) {
            // console.log(key);
            this.$http.post(downLoadUrl,{'data': {'url': 'http://' + bucket + '/' + key + '?imageView2/2/h/50'}}).then(
                (r) => {
                    this.downImg=r.body;
                    // console.log(this.downImg)
                },
                (r) => {

                }
            )
        },
        fSubmit() {
            var noteID = JSON.parse(localStorage.getItem('obj')).id; //帖子 id
            addurl = URL_USER_AddReply
            adddata = {
                'reply': {
                    tid: noteID,
                    content: this.message
                },
                'flor_token':this.token
            };
            //alert(addurl+'||'+JSON.stringify(adddata));
            if (this.message.trim().length > 0) {
                // console.log(this.message)
                this.$broadcast('parent-msg',{msg:this.message,id:noteID});
                    //console.log('  adddata: '+JSON.stringify(adddata));
                    SetAjax('post', addurl, adddata, (response) => {
                        // console.log(response);
                        _reid = response.data;
                    }, (response) => {
                        //console.log('from commit error'+JSON.stringify(response));
                    }) 
                    this.showBtn = true; 
                    this.message = ''; 
                    addurl = ''; 
                    adddata = ''; 
                    this.showCom = false;
                }
                else {
                    this.show1 = true;
                }
            }
        },
        route: {
            data(t) {
                this.token = getCookie('token');
                count = 0;
                var _id = this.$route.params.id;
                this.$refs.list.get(URL_USER_GetGardenReply, {
                    tid: _id
                });

                var m = window.localStorage.getItem('obj');
                this.comment = JSON.parse(m);
                // alert('route yeah');
                window.location.href = window.location.href;
                this.imgurl('u/'+this.comment.uid);
                // console.log(this.comment);
                this.oldPra = this.comment.up;
                t.next();
            }
        }
    }
</script>
<style scoped>
.foot {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.8);
}
.a {
    color: red;
}

.b {
    color: grey;
}

.header {
    position: fixed;
    top: 0;
    align-items: center;
    height: 4rem;
    line-height: 3rem;
    text-align: center;
    background-color: #f95377;
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    width: 100%;
    z-index: 999;
}

.titleName {
    display: flex;
    justify-content: center;
    margin: auto;
    font-size: 1.3rem;
}

.pull-left {
    display: flex;
    background: url('../assets/back@2x_0.png') no-repeat;
    width: 1.2rem;
    height: 2.8rem;
    align-self: flex-start;
    margin-left: 1rem;
    cursor: pointer;
}

.header,
.praise,
.wrap1,
.wrap2 {
    display: flex;
    flex-flow: row;
}

.userpic {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.userInfo {
    display: flex;
    justify-content: space-between;
    border-bottom: .1667rem solid #eee;
    background: #fff;
}

.single_comment,
.user,
.userName,
.commentTime,
.details,
.wrap,
.main,
.foot,
.inp {
    display: flex;
    flex-flow: column;
}

.user {
    margin-left: 1rem;
}

.userIcon {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    margin: .3rem;
    /*background: url('../assets/hsq.png');*/
    background-size: 100%;
}

.comment {
    flex: 4;
}

.content {
    width: 100%;
    display: flex;
    flex-grow: 1;
    font-size: 1rem;
    margin: .3rem auto;
}

.wrap {
    flex: 1;
    padding: .4rem;
    margin-right: 1.1rem;
}

.wrap1 {
    display: flex;
    justify-content: space-around;
    font-size: 1.5rem;
}

.details {
    margin-top: 5rem;
    flex: 1;
    margin-bottom: 4rem;
}

.repaly {
    background: #fff;
    text-align: center;
    font-size: 1.5rem;
}

.praise {
    background: url('../assets/school_good@1x_0.png') no-repeat;
    width: 1.5rem;
    height: 1.5rem;
    justify-content: flex-end;
    align-self: flex-start;
    margin: .5rem;
}

.userName,
.commentTime {
    margin-top: .6rem;
}
</style>
