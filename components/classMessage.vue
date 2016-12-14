<!-- 班级消息推送页面 -->
<template>
    <div class="box-header">
        <p class="ch3">班级消息推送</p>
    </div>
    <div class="form-horizontal" role="form">
        <div>
            <label style="font-size:1.5rem;color:grey;">选择班级</label>
            <select class="btn btn-default" v-model="item.crid">
                <option :value="list.crid" v-for="list of lists">{{list.crname}}</option>
            </select>
        </div>
        <div>
            <label style="font-size:1.5rem;color:grey;">
                <p class="text-right">(向用户发送消息)</p>
            </label>
            <x-textarea :max='140' placeholder="班级消息" :value.sync="item.crnews"></x-textarea>
        </div>
        <x-button  @click="pushMessage" mini text="推送" type='warn'></x-button>
    </div>
     <toast :show.sync="show" width="50%" type="text">
        <p style="color:#fff;">{{msg}}</p>
    </toast>
</template>
<script>
    import {
        PushMessage,
        GetTeacherClassroom
    } from './api';
    import {
        getCookie
    } from './setAjax';
    import{
      XButton,
      Toast,
      XTextarea
    } from 'vux/src/components'
    export default {
      components: {
        XButton,
        Toast,
        XTextarea
      },
        data() {
                return {
                    item: {},
                    msg: '',
                    lists: [],
                    show: false,
                    data: {
                        'flor_token':getCookie('token')
                      },
                }
            },
            ready() {
                this.getTeacherClassroom();// 获取班主任班级
            },
            methods: {
                // 获取班主任班级
                getTeacherClassroom() {
                    this.$http.post(GetTeacherClassroom, this.data).then(
                        (r) => {
                            r.data != 'auth error' && [this.lists = r.data];
                        });
                },
                // 推送消息
                pushMessage() {
                    this.data.data = this.item;
                    this.$http.post(PushMessage, this.data).then(
                        (r) => {
                            // console.info(r)
                            if (r.data == "crid is error") {
                                this.msg = '请选择自己是班主任的那个班';
                            } else {
                                this.msg = '消息推送成功！';
                            }
                            this.show = true;
                            if(this.show){
                                clearTimeout(goback);
                               var goback = setTimeout(()=>{
                                    this.$router.go('/gIndex/gAction')
                                 },1000);
                            } 
                        });
                }
            }
      }

</script>
<style scoped>
.ch3{
  font-size: 2rem;
  font-weight: bold;
}
.box-header {
    margin-top: .5rem;
    padding: 1rem;
    font-size: 1.2rem;
    background: #fff;
    color: #f97355;
}

.form-horizontal {
    padding: 1rem;
    background: #fff;
}

.form-control {
    width: 100%;
}
.text-right{
  margin-top: .5rem;
}
.form-control{
  margin-top: .5rem;
}
</style>
