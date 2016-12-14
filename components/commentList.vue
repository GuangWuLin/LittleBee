<template>
    <div>
        <ul :page='page' v-show='lists.length !== 0' class="List">
            <li v-for="comment in lists | orderBy 'edittime' -1" track-by='$index' class="single_comment" @click='link(comment)' id="{{ comment.id }}">
                <div class="userInfo">
                    <!-- {{ comment | json }} -->
                    <div class="userpic">
                        <!-- <div class="userIcon"></div> -->
                        <img :src="downImg['u/'+comment.uid]" class="userIcon">
                    </div>
                    <div class="comment">
                        <div class="user">
                            <div class="userName">
                                {{ comment.nickname }}
                            </div>
                            <div class="commentTime">
                                {{ comment.edittime?comment.edittime.slice(5,-3):''}}
                            </div>
                            <div class="content">
                                {{ comment.content }}
                            </div>
                        </div>
                    </div>
                    <div class="wrap">
                        <div class="wrap1" v-if="this.$route.name=='detail'">
                            <div class="praise">
                            </div>
                            <div style="display:flex;align-self:center;">{{ comment.up }}
                            </div>
                        </div>
                        <div class="wrap2" v-if="this.$route.name =='detail'">
                            回复<span> {{ comment.count }} </span>
                        </div>
                        <group v-if="this.$route.name=='commentDetails'">
                            <x-button @click='markshow' text='回复' mini style="width:5.4rem" type='primary'></x-button>
                        </group>
                    </div>
                </div>
                <!-- <input name="replyMark" @keyup.enter = "submit(comment)" placeholder="请输入回复内容" v-model='message' autofocus> -->
                <group style="display:none;">
                    <x-textarea placeholder="请输入回复内容" :value.sync='message'></x-textarea>
                    <x-button @click='submit(comment)' text="发表" mini type="primary"></x-button>
                </group>
                <div v-show="comment.mark" style="text-align:center; background:#fff; color:red;" @click='toggle(e)' v-if="this.$route.name == 'commentDetails'">
                    <!-- <div class="pullTrigle" @click='toggle' v-if="this.$route.name == 'commentDetails'"></div> -->
                    点击查看{{ comment.count }}回复
                </div>
                <div class="mark">
                    <ul class="markList">
                        <li v-for="mark in comment.mark | orderBy 'edittime' -1">
                            <div class="userInfoMark">
                                <div class="userNameMark"> {{ mark.Mnickname }} </div>
                                <div class="contentMark"> {{ mark.remarkcontent }} </div>
                                <div class="commentTimeMark"> {{ mark.edittime }} </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
        <div v-show='this.lists.length===0' :style="{ color: activeColor, fontSize: fontSize + 'rem',textAlign:textAlign,lineHeight:lineHeight +'rem',margin:'.5rem auto' }">此处暂时没有评论，请登录后抢占沙发！
        </div>
    </div>
</template>
<script type="text/javascript">
var arr = [];
var geturl = '';
var addurl = '';
var getdata = {},
    adddata = {};
var amount = 0;
var markID;
// var count = 0,showCount=0;
import {
    SetAjax,
    getCookie
} from './setAjax.js';
import {
    Group,
    XButton,
    XTextarea
} from 'vux/src/components'
import {
    URL_USER_AddRemark,
    URL_USER_GetGardenReply,
    URL_USER_GetGardenTopic,
    URL_USER_AddReply,
    URL_GET_ActionTopic,
    URL_USER_AddEstimate,
    bucket,
    downLoadUrl,
    getImageListUrl
} from './api.js'
export default {
    components: {
        XButton,
        XTextarea,
        Group
    },
    vuex: {
        getters: {
            userInfos: state => state.userInfo
        }
    },
    events: {
        'parent-msg': function(objs) { //获取一级评论
            // console.log(objs);
            // console.log(this.userInfos);
            this.lists.push({
                content: objs.msg,
                id: objs.id,
                uid: this.userInfos.id,
                mark: [],
                nickname: this.userInfos.nickname,
                edittime: (new Date()).toLocaleDateString().replace(/\//g, '-') + " " + (new Date()).toTimeString().substr(0, 8),
                // count: 0,
                up: 0
            });
        }
    },
    data() {
        return {
            lists: [],
            page: 1,
            imgList: {},
            token: '',
            activeColor: 'grey',
            fontSize: 1.4,
            textAlign: 'center',
            lineHeight: 1.4,
            state: false,
            mark: false,
            message: '',
            key: '',
            downImg: {}
        }
    },
    created() {
        // console.log(this.imgurl('u/1'));
        this.$set('key', 'u/');
        this.token = getCookie('token');
        var _id = this.$route.params.id;
        //console.log(this.type+'||'+noteID);
        if (this.$route.name == 'detail') {
            this.get(URL_USER_GetGardenTopic, {
                gid: _id
            });
        } else if (this.$route.name == 'actionDetail') {
            this.get(URL_GET_ActionTopic, {
                aid: _id
            });
            //console.log(this.$route.name+'lalalalalalaala'+noteID);
        } else {
            //var noteID = JSON.parse(localStorage.getItem('obj')).id; //帖子 id
            this.get(URL_USER_GetGardenReply, {
                tid: _id
            });
        }
        this.getImgList();
        // console.log(this.userInfos.id)
    },
    watch: {
        page(val) {
            // alert('commentList\'s watch!');
            this.get();
        }
    },
    methods: {
        submit(comment) {

            // console.log(comment.id);
            // console.log(comment);
            var node = event.target.parentNode.parentNode;
            var noteID = this.$route.params.id;
            var _message = this.message;
            if (this.message.trim().length > 0) {
                SetAjax('post', URL_USER_AddRemark, {
                    'data': {
                        'reid': comment.id,
                        'remarkcontent': this.message
                    },
                    'flor_token': this.token
                }, (response) => {
                    // console.log(response);
                    node.style.display = 'none';
                }, (response) => {});
                comment.mark = comment.mark || [];
                comment.mark.push({
                    remarkcontent: _message,
                    Mnickname: this.userInfos.nickname,
                    edittime: (new Date()).toLocaleDateString().replace(/\//g, '-') + " " + (new Date()).toTimeString().substr(0, 8),
                });
                // console.log(comment.mark);
                this.message = '';
            } else {
                // alert('您不能提交空信息');
                this.$dispatch('show1');
                node.style.display = 'none';
            }
        },
        imgurl() {
            var img = document.querySelectorAll('img');
            [].forEach.call(img, function(v) {
                v.onerror = function() {
                    this.src = 'http://2e.zol-img.com.cn/product/64_280x2000/410/ceneo4LyDg8c.jpg';
                }
            });
            this.$http.post(downLoadUrl, {
                'data': this.imgList
            }).then(
                (r) => {
                    // console.log(this.imgList)
                    this.downImg = r.body;
                    // console.log(this.downImg)
                },
                (r) => {

                }
            )
        },
        getImgList: function() {
            if (this.key != '') {
                this.$http.post(getImageListUrl, {
                    "key": this.key
                }).then(
                    (r) => {
                        let _this = this;
                        r.body.forEach(function(c) {
                            _this.imgList[c] = 'http://' + bucket + '/' + c + '?imageView2/2/h/50/w/50';
                        });
                        this.imgurl();
                    },
                    (r) => {

                    }
                )
            }
        },
        markshow(e) {

            var node = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
            // console.log(node.children[1]);
            node.children[1].style.display = 'block';
        },
        toggle(e) {
            // console.log(222);
            var e = e || event;
            var arr_ = [];
            // console.log(e.target.parentNode.children[])
            var parent = e.target.parentNode;
            // console.log(parent);
            for (var i = 0; i < parent.children.length; i++) {

                if (parent.children[i].nodeType == 1) {

                    arr_.push(parent.children[i]);

                }
            }
            // console.log(arr_[arr_.length-1])
            var node = arr_[arr_.length - 1];
            // console.log(node, amount);
            if (amount % 2 == 0) {
                node.style.display = 'block';
                amount++;
            } else {
                node.style.display = 'none';
                amount++;
            }
        },
        get() {
            //noteID = JSON.parse(localStorage.getItem('obj')).id; //帖子 id 
            let _id = this.$route.params.id; // 帖子 id
            /*if (localStorage.getItem('obj')) {
            	var noteID = JSON.parse(localStorage.getItem('obj')).id; //存在localstorage里面的帖子 id
            }*/
            if (arguments.length > 0) {
                geturl = arguments[0];
                getdata = arguments[1];
            }
            SetAjax('post', geturl, getdata, (response) => {
                    if (!!response.data === true) {
                        this.lists = response.data;
                        // console.log(this.lists);
                    }
                    // console.log(response);
                    if (response.data) {
                        // this.ifList = true;
                        response.data.forEach(function(c) {
                                if (c.staus == 1) {
                                    c.content = '此评论涉及违规，已被河蟹！';
                                    this.state = true;
                                }
                            })
                            /*if(response.data.nickname==null){
                            	response.data.nickname = '青青子衿';
                            }*/
                        this.ifComment = false;
                    }
                    this.lists.forEach(c => {
                        // 用户昵称为空的时候 系统默认昵称 :'LittleBee'
                        c.nickname || [c.nickname = 'LittleBee'];
                        // console.info(c);
                        if (c.mark) {
                            c.mark.forEach(v => {
                                // 备注评论的昵称为空 系统默认昵称 :'LittleBee'
                                v.nickname || [v.Mnickname = 'LittleBee'];
                            });
                        }
                    });
                },
                (response) => {});
        },
        getScroll() {
            arr.push(window.document.body.scrollTop);
        },
        //  v-link="'/commentDetails/'+comment.id" 路由跳转
        link(comment) {
            //alert(1111);
            var gardenId = this.$route.params.id;
            if (this.$route.name == 'detail') {
                if (localStorage.getItem('obj') != '') {
                    //alert('还有脏数据未清除！');
                    localStorage.removeItem('obj'); //清除obj的值
                }
                localStorage.setItem('obj', JSON.stringify(comment));
                this.$router.go('/commentDetails/' + comment.id);
            }
        },
        more() {

        }
    }
}
</script>
<style scoped>
.ttt {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
    background: #fff;
}


/*.pullTrigle{
		width: 0;
		height: 0;
		border-left: 10px solid transparent;
		border-right:10px solid transparent;
		border-top: 15px solid black;
		display: flex;
		align-self: center;		
	}*/

.ttt_heard {
    background: #fff;
    display: flex;
    justify-content: space-around;
    font-size: 1.5rem;
    color: #999;
}

ol {
    list-style: outside decimal;
    list-style: none;
    overflow-x: hidden;
    overflow-y: scroll;
}

li {
    border-bottom: 1px solid #eee;
}

.List {
    flex: 1;
    height: 100%;
    overflow: auto;
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
.coord {
    padding: .4rem;
}

.mark {
    width: 100%;
    /*height: 5rem;*/
    /*		display: flex;*/
    display: none;
}


/*@keyframe*/

.userInfo {
    margin-top: .1rem;
    background-color: rgba(255, 255, 255, 0.6);
    display: flex;
    padding: .5rem;
    justify-content: space-between;
}

.single_comment,
.user,
.userName,
.commentTime,
.list,
.wrap {
    display: flex;
    flex-flow: column;
}

.user {
    margin-left: 1rem;
}

.userpic {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
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

.userName {
    font-size: 1.2rem;
}

.wrap {
    flex: 1;
    margin-right: 1.1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.wrap1,
.wrap2 {
    justify-content: space-around;
}

.praise,
li,
.wrap1,
.wrap2 {
    display: flex;
    flex-flow: row;
}

.praise {
    background: url('../assets/school_good@1x_0.png') no-repeat;
    width: 1.5rem;
    height: 1.5rem;
    justify-content: flex-end;
    align-self: flex-start;
    margin: .5rem;
}

.userInfoMark {
    background-color: rgba(255, 255, 255, 0.8);
    width: 100%;
    display: flex;
    flex-flow: row;
    justify-content: space-around;
}

.userNameMark {
    flex: 1;
    font-size: 1.2rem;
    color: #333;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 1rem;
}

.commentTimeMark {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /*margin-right: .5rem;*/
}

.contentMark {
    flex: 3;
    font-size: 1rem;
    display: flex;
    color: #999;
    flex-direction: column;
    justify-content: center;
}
</style>
