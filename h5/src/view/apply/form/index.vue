<template>
  <div>
    <es-title type='1'/>
      <es-top-info/>
    <div class="form-cont">
      <div class="title">{{formTitle}}</div>
      <es-upload :attr="inputMap.photo" :val="formData.name" @input="setInputVal" :lock="inputLock"/>

      <es-input :attr="inputMap.name" :val="formData.name" @input="setInputVal" :lock="inputLock"/>
      <es-select :attr="inputMap.idCardType" :val="formData.idCard" @input="setInputVal" :lock="inputLock"/>
      <es-input :attr="inputMap.idCard" :val="formData.idCard" @input="setInputVal" :lock="inputLock"/>
      <es-select :attr="inputMap.sex" :val="formData.sex" @input="setInputVal" :lock="inputLock"/>
      <es-select :attr="inputMap.birthday" :val="formData.birthday" @input="setInputVal" :lock="inputLock"/>
      <es-select :attr="inputMap.type" :val="formData.type" @input="setInputVal" :lock="inputLock"/>
      <es-select :attr="inputMap.nation" :val="formData.nation" @input="setInputVal" :lock="inputLock"/>
      <es-input :attr="inputMap.phone" :val="formData.name" @input="setInputVal" :lock="inputLock"/>
      <es-select :attr="inputMap.city" :val="formData.city" @input="setInputVal" :lock="inputLock"/>
      <es-select :attr="inputMap.school" :val="formData.school" @input="setInputVal" :lock="inputLock"/>
      <es-select :attr="inputMap.joinTime" :val="formData.joinTime" @input="setInputVal" :lock="inputLock"/>
      <es-select :attr="inputMap.voluteeTime" :val="formData.voluteeTime" @input="setInputVal" :lock="inputLock"/>
      <es-input :attr="inputMap.unit" :val="formData.unit" @input="setInputVal" :lock="inputLock"/>
      <es-select :attr="inputMap.honor" :val="formData.honor" @input="setInputVal" :lock="inputLock"/>
      <es-input :attr="inputMap.level" :val="formData.level" @input="setInputVal" :lock="inputLock"/>
      <es-input :attr="inputMap.levelName" :val="formData.levelName" @input="setInputVal" :lock="inputLock"/>

      <es-input :attr="inputMap.comment" :val="formData.comment" @input="setInputVal" :lock="inputLock"/>
      <es-input :attr="inputMap.resume" :val="formData.resume" @input="setInputVal" :lock="inputLock"/>
      <es-input :attr="inputMap.situation" :val="formData.situation" @input="setInputVal" :lock="inputLock"/>

      <div class="botom-btns-cont">
        <ul class="bottom-btns">
          <li class="btn">取消</li>
          <li class="btn">保存草稿</li>
          <li class="btn cur" @click="commit">提交</li>

          <!-- <li class="btn">编辑</li>
          <li class="btn cur" @click="commit">确认申报</li> -->
        </ul>
      </div>

      <div class="other-btns">
        <div class="link link-1">
          <router-link to='/activity/details'>  活动<br/>详情 </router-link>
        </div>
        <div class="link link-2">
          <router-link to='/activity/help'>  帮助<br/>指南 </router-link>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import inputMap from '@/unit/inputMap';
import Title from '../components/formTitle';
import Input from '../../../component/input';
import Select from '../../../component/select';
import UploadImage from '../../../component/uploadImage';
import TopInfo from '../components/topInfo';

export default {
  components: {
    'es-title': Title,
    'es-input': Input,
    'es-select': Select,
    'es-upload': UploadImage,
    'es-top-info': TopInfo
  },
  data() {
    return {
      inputLock: false,
      formTitle: '请确认申报信息',
      inputMap,
      formType: {

      },
      formData: {
        name: '',
        idCard: ''
      }
    }
  },
  props: ['showNav'],
  created(){
    import(`./${this.$isDesktop ? 'desktop': 'mobile'}.less`)
  },
  mounted() {
  },
  methods: {
    setInputVal(data) {
      const { val, key } = data;
      this.formData[key] = val;
    },

    commit() {
    }
  },
}
</script>

<style lang="less" scoped>

</style>