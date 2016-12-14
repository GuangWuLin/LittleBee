<!-- 审核子女绑定 -->
<template>
    <div>
        <group title='历史纪录'>
            <cell :title="op.crname" :value.sync="op.edittime" v-for='(index,op) in ops'>
                <icon type="success" v-if="op.edittime.charAt(0)==='E'"></icon>
                <icon type="cancel" v-else></icon>
                <x-button text='点我修改' @click="change(op)" type="warn" mini></x-button>
            </cell>
        </group>
        <group title="待审核">
            <p style='text-align:center;' v-if="lists.length=='0'">暂时没有关联信息。</p>
            <x-input v-for='(index,list) in lists' readonly :title='list.crname' :inline-desc="list.nickname" @click='show(index)'>
                <x-button type='primary' mini @click.stop='check(index)' text='通过'></x-button>
                <x-button type='warn' mini @click.stop='refuse(index)' text='拒绝'></x-button>
            </x-input>
        </group>
        <dialog :show.sync="showNoScroll" class="dialog-demo" :scroll="false">
            <p class="dialog-title">关联信息</p>
            <div class="img-box">
                <group>
                    <cell title="班级:" :value.sync="showAll.crname"></cell>
                    <cell title="昵称:" :value.sync="showAll.nickname"></cell>
                    <cell title="生日:" :value.sync="showAll.birthday"></cell>
                    <cell title="家长姓名:" :value.sync="showAll.parentname"></cell>
                    <cell title="家长电话:" :value.sync="showAll.parentphone"></cell>
                </group>
            </div>
            <x-button @click="showNoScroll=false">关闭</x-button>
        </dialog>
    </div>
</template>
<script type="text/javascript">
import {
    Group,
    Cell,
    XInput,
    XButton,
    Dialog,
    Icon,
    XHeader
} from 'vux/src/components';
import {
    VerifyParent,
    PushParent
} from './api.js';
import {
    getCookie
} from './setAjax.js'
export default {
    components: {
        Group,
        Cell,
        Icon,
        XInput,
        XButton,
        Dialog,
        XHeader
    },
    data() {
        return {
            lists: [],
            ops: [],
            showNoScroll: false,
            num: 0,
            showAll: {},
            token: ''
        }
    },
    route: {
        //获取客户端推送过来的子女绑定信息

        data(t) {
            var eid = this.$route.params.id;
            this.token = getCookie('token');
            this.$http.post(PushParent, {
                'flor_token': this.token
            }).then((response) => {
                // console.log(response);
                // console.log(response.data[eid]);
                var _this = this;
                if (response.data[eid]) {
                    response.data[eid].forEach((c) => {
                        // console.log(c);
                        if (c.edittime.charAt(0) !== '0') {
                            // console.log(c);
                            // console.log(this.ops);
                            _this.ops.push(c);
                        } else {
                            // console.log(this.ops);
                            _this.lists.push(c);
                        }
                    });
                }
                // console.log(_this.lists);
                // console.log(_this.ops);
            }, (response) => {
                // console.log(response);
            });
            t.next();
        }
    },
    methods: {
        change(op) {
            // console.log(op);
            //E开头为审核通过的 R开头驳回
            if (op.edittime.charAt(0) === 'E') {
                this.$http.post(VerifyParent, {
                    'data': {
                        a: {
                            'id': op.id,
                            'staus': 'reject'
                        }
                    },
                    'flor_token': this.token
                }).then((response) => {
                    // console.log(response);
                    op.edittime = 'R' + op.edittime;
                }, (response) => {
                    console.log(response);
                });
            } else {
                this.$http.post(VerifyParent, {
                    'data': {
                        a: {
                            'id': op.id,
                            'staus': 'examine'
                        }
                    },
                    'flor_token': this.token
                }).then((response) => {
                    // console.log(response);
                    op.edittime = 'E' + op.edittime;
                }, (response) => {
                    console.log(response);
                });
            }
        },
        check(index) {
            // console.log(this.lists[index]);
            this.$http.post(VerifyParent, {
                'data': {
                    a: {
                        'id': this.lists[index].id,
                        'staus': 'examine'
                    }
                },
                'flor_token': this.token
            }).then((response) => {

                // this.lists.splice(index,1);
                // console.log(this.ops);
            }, (response) => {
                // console.log(response);
            });
            this.lists[index].edittime = 'E' + this.lists[index].edittime;
            this.ops.push(this.lists[index]);
            this.lists.splice(index, 1);
        },
        refuse(index) {
            console.log(index);
            this.$http.post(VerifyParent, {
                'data': {
                    a: {
                        'id': this.lists[index].id,
                        'staus': 'reject'
                    }
                },
                'flor_token': this.token
            }).then((response) => {

                // console.log(console.log(this.ops));
            }, (response) => {
                // console.log(response);
            });
            this.lists[index].edittime = 'R' + this.lists[index].edittime;
            this.ops.push(this.lists[index]);
            this.lists.splice(index, 1);
        },
        show(index) {
            this.showNoScroll = true;
            this.showAll = this.lists[index];
        }
    }
}
</script>
<style type="text/css" scoped>
.dialog-demo {
    .weui_dialog {
        border-radius: 8px;
        padding-bottom: 8px;
    }
    .dialog-title {
        line-height: 30px;
        font-size: 1.2rem;
        color: orange;
        color: #666;
    }
    .img-box {
        height: 350px;
        overflow: hidden;
    }
}

.weui_cell_bd,
.weui_cell_primary {
    text-align: left;
}
</style>
