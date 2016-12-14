<!-- 班级活动管理页（班主任） -->
<template>
    <div class="blank">
        <div class="ssg">
            <div class="btn-group">
                <x-button text="新建活动" @click="openAddModal" type='warn' mini></x-button>
                <x-button text="查看活动" @click="showGg = true" type='warn' mini></x-button>
            </div>
        </div>
    </div>
    <!-- 活动查看板块 -->
    <div class="Sclass" v-show="showGg">
        <p style="margin-left:1rem;">请选择班级:</p>
        <div v-for="list of lists">
            <a @click="item=list.action" style="font-size:1.2rem;margin-left:1rem;">{{list.crname}}</a>
        </div>
    </div>
    <!-- 选中班级活动表 -->
    <card :header="{title:'班级活动'}">
        <div slot="content" class="card-demo-flex card-demo-content01" v-for="list of item">
            <div class="vux-1px-l vux-1px-r">
                <span>活动名称</span>
                <br/> {{list.actionname}}
            </div>
            <div class="vux-1px-r">
                <span>活动内容</span>
                <br/> {{list.actioncontent}}
            </div>
            <div class="vux-1px-r">
                <span>创建时间</span>
                <br/> {{list.createtime}}
            </div>
            <div>
                <span>操作</span>
                <br/>
                <x-button @click="openEditModal(list)" text="编辑" type='primary' mini></x-button>
                <x-button @click="openDelModal(list)" text="删除" type='warn' mini></x-button>
            </div>
        </div>
    </card>
    <!-- 添加班级活动模态框 -->
    <popup  :show.sync="addClassActionModal" height="80%">
        <div role="document">
            <div>
                <div class="modal-header">
                    <h4 class="modal-title" >添加班级活动</h4>
                </div>
                <div class="modal-body">
                    <form>
                        <div>
                            <label style="color:#f95377;font-size:1.2rem;">班级名称:</label>
                            <div>
                                <select v-model="newAction.crid">
                                    <option v-for='list of lists' :value="list.crid">{{list.crname}}</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label style="color:#f95377;font-size:1.2rem;">活动名称:</label>
                            <div>
                                <x-input title="活动名称:" type="text" placeholder="请输入活动名称" :value.sync="newAction.actionname" style='border:1px dotted grey;'>
                            </div>
                        </div>
                        <div>
                            <label style="color:#f95377;font-size:1.2rem;">活动内容:</label>
                            <div class="col-sm-8">
                                <x-textarea type="text" :max="200" placeholder="请输入活动内容" :value.sync="newAction.actioncontent" style='border:1px dotted grey;'></x-textarea>
                            </div>
                        </div>
                        <p style="color:red;text-align:center;">{{msg}}</p>
                    </form>
                </div>
                <div class="modal-footer">
                    <x-button @click="addClassRoomAction" type="primary" mini>确认</x-button>
                    <x-button type="warn" @click="closeClassRoomAction" mini>关闭</x-button>
                </div>
            </div>
        </div>
    </popup>
    <!-- 编辑班级活动模态框 -->
    <popup  :show.sync="editClassActionModal" height="100%">
        <div role="document">
            <div>
                <div class="modal-header">
                    <h4 class="modal-title">编辑班级活动</h4>
                </div>
                <div class="modal-body">
                    <form>
                        <div>
                            <label style="color:#f95377;font-size:1.2rem;">活动名称:</label>
                            <div class="col-sm-8">
                                <x-input title="活动名称" :show-clear="false" placeholder="请输入活动名称" :value.sync="action.actionname">
                            </div>
                        </div>
                        <div>
                            <label style="color:#f95377;font-size:1.2rem;">活动内容:</label>
                            <x-textarea :max="200" placeholder="请输入活动内容" :value.sync="action.actioncontent"></x-textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <x-button type="primary" @click="editClassRoomAction(1)" mini>确认</x-button>
                    <x-button type="warn" @click="closeClassRoomAction" mini>关闭</x-button>
                </div>
            </div>
        </div>
    </popup>
    <!-- 删除班级活动模态框 -->
    <popup  :show.sync="delClassActionModal" height="100%">
        <div role="document">
            <div>
                <div class="modal-header">
                    <h4 class="modal-title">确认删除班级活动？</h4>
                </div>
                <div class="modal-footer">
                    <x-button @click="editClassRoomAction(2)" type="primary" mini>确认</x-button>
                    <x-button type="warn" @click="closeClassRoomAction" mini>关闭</x-button>
                </div>
            </div>
        </div>
    </popup>
    <!-- 警告提示框 -->
    <toast :show.sync="showClass" type="warn" width="9.6rem" :time='2000'>{{warngg}}</toast>
</template>
<script>
import {
    GetTeacherClassroom,
    AddClassRoomAction,
    EditClassRoomAction
} from './api.js';
import {
    getCookie
} from './setAjax.js';
import {
    XButton,
    XInput,
    XTextarea,
    Toast,
    Card,
    Popup
} from 'vux/src/components';
export default {
    data() {
            return {
                data: {
                    'flor_token': getCookie('token')
                },
                lists: [],
                item: {},
                newAction: {},
                msg: '',
                action: {},
                showClass: false,
                warngg: '',
                addClassActionModal: false,
                editClassActionModal: false,
                delClassActionModal: false,
                showGg: false
            }
        },
        components: {
            XButton,
            XInput,
            XTextarea,
            Toast,
            Card,
            Popup
        },
        ready() {
            this.getTeacherClassroom(); // 获取担任班主任的班级
        },
        vuex: {
            getters: {
                classID: state => state.class_id //拿班级ID
            }
        },
        methods: {
            //获取班级列表
            getTeacherClassroom() {
                // console.log(this.data);
                this.$http.post(GetTeacherClassroom, this.data).then(
                    (r) => {
                        // console.log(r);
                        if (r.data != 'auth error')
                            this.lists = r.data;
                    });
            },
            //新建班级活动
            addClassRoomAction() {
                // console.log(this.data);
                if (!this.newAction.crid) return this.msg = '请选择班级！';
                if (!this.newAction.actionname) return this.msg = '请输入活动名称！';
                if (!this.newAction.actioncontent) return this.msg = '请输入活动内容！';
                this.msg = '';
                this.data.data = this.newAction;
                this.$http.post(AddClassRoomAction, this.data).then(
                    (r) => {
                        // console.info(r);
                        this.addClassActionModal = false;
                        if (r.data == "Not your classroom.") {
                            this.showClass = true;
                            this.warngg = '亲，请操作自己是班主任的那个班';
                        } else {
                            this.showClass = true;
                            this.warngg = '提交成功';
                        }
                        this.getTeacherClassroom();
                    });
            },
            // 关闭模态框
            closeClassRoomAction() {
                this.addClassActionModal = false;
                this.editClassActionModal = false,
                this.delClassActionModal = false
            },
            //编辑或者删除班级活动
            editClassRoomAction(staus) {
                this.data.data = this.action;
                this.data.data.staus = staus;
                // console.log(this.data);
                this.$http.post(EditClassRoomAction, this.data).then(
                    (r) => {
                        this.editClassActionModal = false;
                        this.delClassActionModal = false;
                        this.item = {};
                        if (r.data == "not your classroom") {
                            this.showClass = true;
                            this.warngg = '亲，请操作自己是班主任的那个班';
                        } else {
                            this.showClass = true;
                            this.warngg = '提交成功';
                        }
                        this.getTeacherClassroom();
                    });
            },
            // 打开添加模态框
            openAddModal() {
                this.addClassActionModal = true;
                this.msg = '';
            },
            // 打开编辑模态框
            openEditModal(list) {
                this.editClassActionModal = true;
                this.action = list;
            },
            // 打开删除模态框
            openDelModal(list) {
                this.delClassActionModal = true;
                this.action = list;
            }
        }
}
</script>
<style scoped>
.btn-group {
    padding-bottom: 1rem;
}

.blank {
    background: #fff;
}

.Sclass {
    display: flex;
    background: #fff;
    padding-left: 1rem;
}
 a{
    color: #333;
 }
 a:hover{
    color: #e54d12;
}
.ssg {
    margin: 1rem;
}
.card-demo-flex {
    display: flex;
}

.card-demo-content01 {
    padding: .833rem .5rem;
}

.card-padding {
    padding: 15px;
}

.card-demo-flex > div {
    flex: 1;
    text-align: center;
    font-size: 12px;
}

.card-demo-flex span {
    color: #f74c31;
}
.modal-header,.modal-body,.modal-footer{
    padding: 1rem;
    margin-top: 1rem;
    background: #fff;
}
.modal-title{
    font-size: 1.2rem;
}
</style>
