<template>
    <x-header :left-options="{showBack: false}" style="background:#f95377">
        <h3>我的签到</h3>
        <div class="header_left" @click="back"></div>
        <div></div>
    </x-header>
    <div class="mySign">
	    <inline-calendar :highlight-weekend="true" :weeks-list="weeksList"></inline-calendar>
    </div>
</template>
<script type="text/javascript">
import {
    InlineCalendar,
    XHeader
} from 'vux/src/components'
export default {
    components: {
        InlineCalendar,
        XHeader
    },
    data() {
        return {
            weeksList: ['日', '一', '二', '三', '四', '五', '六 ']
        }
    },
    methods:{
    	back(){
    		window.history.back(-1)
    	}
    }
}
</script>
<style type="text/css" scoped>
.header_left {
    position: absolute;
    top: 1rem;
    left: 1.4rem;
    width: 1rem;
    height: 2rem;
    background: url('../assets/back@1x_0.png') no-repeat;
}
.mySign{
	margin-top: 1rem;
}
</style>
