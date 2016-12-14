
<template>
    <div class="top">
        <x-button text="添加活动" @click='addAction' style="background:#f97355;color:#fff;margin-left:1rem;" v-show="mark=='asTeacher'&&class_id[0]==='班主任'" mini></x-button>
        <x-button text="消息推送" @click='addMessage' style="background:#f97355;color:#fff;margin-left:1rem;" v-show="mark=='asTeacher'&&class_id[0]==='班主任'" mini></x-button>
    </div>
    <div class="gCom" v-for="(index,classroom) in classrooms">
        <div class="allAct">
            <div class="gActi">
                {{classroom.actionname}}
            </div>
            <div class="gTit">
                <div class="gTime">
                    {{classroom.crname}}
                </div>
                <div class="gClassroom">
                    {{classroom.createtime.substring(0,10)}}
                </div>
            </div>
            <div class="gInfo">
                {{classroom.actioncontent}}
            </div>
            <div class="gPic">
                <div class="g1"></div>
                <div class="g2"></div>
                <div class="g3"></div>
            </div>
            <div class="gSay" v-show=" mark != 'asTeacher'">
                <div class="smile" @click="red(index)">
                    <div class="gGood">
                        <img :src="showNum[index] == index ?smilePic2:smilePic1" height="35px">
                        <!-- <img src="../assets/g_redSmile@1x.png" v-else> -->
                        <p>优秀 &nbsp;{{classroom.A}}</p>
                    </div>
                </div>
                <div class="simple" @click="redTwo(index)">
                    <div class="gCommon">
                        <img :src="showNum2[index] == index?sadPic2:sadPic1" height="35px">
                        <!-- <img src="../assets/g_red@1x.png" v-else> -->
                        <p>一般 &nbsp;{{classroom.B}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <popup :show.sync="show" height="10%">
        <div class="popup0">
            <p>确定</p>
            <p>取消</p>
        </div>
    </popup>
    <toast :show.sync="isComment" type="warn" width="9.6rem" :time='1500'>您已经评过了~无法再评</toast>
</template>
<script>
import {
    addClassRoomAssess,
    getMyClassRoomAction
} from './api.js'
import {
    Popup,
    XButton,
    Toast
} from 'vux/src/components'

import {
    getCookie
} from './setAjax'
import Vue from 'vue';
export default {
    data() {
            return {
                classrooms: [],
                token: '',
                show: false,
                showNum: {},
                showNum2: {},
                isComment: false,
                smilePic1: require('../assets/g_smile@1x.png'),
                smilePic2: require('../assets/g_redSmile@1x.png'),
                sadPic1: require('../assets/g_d@1x.png'),
                sadPic2: require('../assets/g_red@1x.png'),
            }
        },
        components: {
            Popup,
            XButton,
            Toast
        },
        vuex: {
            getters: {
                teacher: state => state.teacherUser,
                mark: state => state.mark,
                class_id: state => state.class_id
            }
        },
        route: {
            data(t) {
                console.log(this.class_id);
                this.$set('classrooms', []);
                this.token = getCookie('token')
                    // console.log(this.teacher);
                    // console.log(this.token);
                    // console.log(this.mark);
                this.getMessage();
                t.next();
            }
        },
        methods: {
            // 跳转添加活动的页面
            addAction() {
                this.$router.go('/gIndex/classAction');
                // console.log(this.class_id)
            },
            // 跳转添加消息推送的页面
            addMessage() {
                this.$router.go('/gIndex/classMessage');
            },
            // 
            getMessage() {
                this.$http.post(getMyClassRoomAction, {
                    'gid': this.mark == 'asTeacher' ? this.teacher.teacher.gid : this.teacher.User.gid,
                    'flor_token': this.token
                }).then(
                    (r) => {
                        if (r.body) {
                            // console.info(this.class_id[1]);
                            r.body[this.mark == 'asTeacher' ? 'teacher' : 'user'].forEach((c) => {
                                this.mark == 'asTeacher' ? (c.id == this.class_id[1] ? this.classrooms.push(c) : []) : this.classrooms.push(c);
                            });
                            // console.info(this.classrooms);
                        }
                    });
            },
            setRate() {
                this.$http.post(addClassRoomAssess, {
                    'id': this.mark == 'asTeacher' ? this.teacher.teacher.id : this.teacher.User.id,
                    'flor_token': this.token
                }).then(
                    (r) => {
                        console.log(r);
                    });
            },
            // 优秀
            red(index) {
                Vue.set(this.showNum, index, index);
                Vue.set(this.showNum2, index, -1);
                this.$http.post(addClassRoomAssess, {
                        'data': {
                            'aid': this.classrooms[index].actionid,
                            'type': 'A'
                        },
                        'flor_token': this.token
                    }).then(
                        (r) => {
                            console.info(r);
                            if (r.body == 'Action or auth error') {
                                this.show = true;
                                this.$broadcast('isShow', 'fromGAction'); // 告诉popup 的index.vue 只上升一丢丢
                            } else {
                                if (r.body) {
                                    this.classrooms[index].A = this.classrooms[index].A * 1 + 1;
                                } else {
                                    this.isComment = true;
                                }
                            }
                        });
            },
            // 良好
            redTwo(index) {
                Vue.set(this.showNum2, index, index);
                Vue.set(this.showNum, index, -1);
                this.$http.post(addClassRoomAssess, {
                        'data': {
                            'aid': this.classrooms[index].actionid,
                            'type': 'B'
                        },
                        'flor_token': this.token
                    }).then(
                        (r) => {
                            if (r.body == 'Action or auth error') {
                                this.show = true;
                                this.$broadcast('isShow', 'fromGAction');
                            } else {
                                if (r.body) {
                                    this.classrooms[index].B = this.classrooms[index].B * 1 + 1;
                                } else {
                                    this.isComment = true;
                                }
                            }
                        })
            }
        }

}
</script>
<style scoped>
.top{
    margin-top: 1rem;
    background: #fff;
    padding-bottom: 1rem;
}
.gCom {
    margin-top: 1rem;
}

.allAct {
    background-color: rgba(255, 255, 255, 0.8);
}

.popup0 {
    display: flex;
    justify-content: space-around;
    font-size: 1.5rem;
    color: #999;
}

.gTit {
    display: flex;
    font-size: 1.2rem;
    flex-flow: row;
    justify-content: space-around;
    color: #f97355;
    font-family: '冬青黑体简体中文 W3';
    padding-top: .5rem;
}

.gTime {
    margin-left: 1rem;
}

.gClassroom {
    margin-right:.5rem;
    text-align: right;
}

.gActi {
    text-align: center;
    font-size: 1.5rem;
    color: #333;
}

.gInfo {
    margin: 0rem 1rem 0rem 1rem;
    text-indent: 2em;
    color: #999;
}

.gPic {
    padding-bottom: 1rem;
    display: flex;
    justify-content: space-around;
    margin-top: 1rem;
}

.gPic div {
    width: 100px;
    height: 100px;
}

.g1 {
    background: url('../assets/g_a1@1x.png');
}

.g2 {
    background: url('../assets/g_a2@1x.png');
}

.g3 {
    background: url('../assets/g_a3@1x.png');
}

.gSay {
    display: flex;
    justify-content: space-around;
    margin-left: 1rem;
    margin-top: 1rem;
    padding-bottom: .5rem;
}

.gGood,
.gCommon {
    display: flex;
}

.gSay p {
    font-size: 1.5rem;
    margin-left: 1rem;
    line-height: 35px;
    color: #999;
}

.noAct {
    text-align: center;
}
</style>
