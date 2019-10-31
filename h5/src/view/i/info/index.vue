<template>
  <div class="page-wrap-i-info">
    <es-input
      :attr="inputMap.name"
      :val="formData.name"
      @input="setInputVal"
      :lock="inputLock"
      :type="inputType"
    />
    <es-select
      :attr="inputMap.idCardType"
      :val="formData.idCardType"
      @input="setInputVal"
      :lock="inputLock"
      :type="inputType"
    />
    <es-input
      :attr="inputMap.idCard"
      :val="formData.idCard"
      @input="setInputVal"
      :lock="inputLock"
      :type="inputType"
    />
    <es-select
      :attr="inputMap.birthday"
      :val="formData.birthday"
      @input="setInputVal"
      :lock="inputLock"
      :type="inputType"
    />
    <es-input
      :attr="inputMap.phone"
      :val="formData.phone"
      @input="setInputVal"
      :lock="inputLock"
      :type="inputType"
    />
    <es-select
      :attr="inputMap.school"
      :val="formData.school"
      @input="setInputVal"
      :lock="inputLock"
      :type="inputType"
    />
    <es-input
      :attr="inputMap.parentPhone"
      :val="formData.parentPhone"
      @input="setInputVal"
      :lock="inputLock"
      :type="inputType"
    />
    <es-input
      :attr="inputMap.parentName"
      :val="formData.parentName"
      @input="setInputVal"
      :lock="inputLock"
      :type="inputType"
    />
    <p class="p1" v-show="!inputLock">说明：部分不能编辑信息请前往一号通修改。</p>
    <div class="botom-btns-cont" v-show="!inputLock">
      <ul class="bottom-btns">
        <li class="btn">取消</li>
        <li class="btn cur">保存</li>
      </ul>
    </div>
    <div class="single-btn" v-show="inputLock">
      <ul class="bottom-btns">
        <li class="btn cur">编辑</li>
      </ul>
    </div>
  </div>
</template>

<script>
import inputMap from "@/unit/inputMap";
import Input from "../../../component/input";
import Select from "../../../component/select";

export default {
  components: {
    "es-input": Input,
    "es-select": Select
  },
  data() {
    return {
      inputLock: false,
      inputMap,
      inputType: "row",
      formData: {
        name: "134",
        idCardType: "sss"
      }
    };
  },
  methods: {
    setInputVal(data) {
      const { val, key } = data;
      this.formData[key] = val;
    }
  },
  created(){
    import(`./${this.$isDesktop ? 'desktop': 'mobile'}.less`)
  },
};
</script>
