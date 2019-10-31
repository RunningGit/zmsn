<template>
  <div class="defineDict">
    <div v-if="type === 'select'">
      <dy-select :list="dataList"
        @change="setSex"
        v-model="defaultValue">
        <dy-select-option v-for="option in dataList"
          :key="option.id"
          :value="option.dtCode"
          :label="option.dtDesc">
        </dy-select-option>
      </dy-select>
    </div>
    <div v-if="type === 'radio'">
      <dy-radio-group v-model="defaultValue"
        @change="setSex">
        <dy-radio v-for="(item, index) in dataList"
          :key="index"
          :data="parseInt(item.dtCode)">{{item.dtDesc}}</dy-radio>
      </dy-radio-group>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import systemManage from '../../api' // 引入API

export default {
  name: 'defineDict',
  props: {
    /**
     * 使用的字典类型
     */
    type: {
      type: String,
      default: 'select'
    },
    /**
     * 字典的值类型
     */
    dictType: {
      type: String,
      default: ''
    },
    /**
     * 选中值
     */
    selectedData: {
      type: [String, Number, Boolean, Array],
      default: ''
    }
  },
  data() {
    return {
      dataList: [],
      defaultValue: Number
    }
  },
  created() {
    this.defaultValue = this.selectedData
    this.dictTaglib()
  },
  methods: {
    dictTaglib() {
      let params = {
        dicCode: this.dictType,
        dtId: ''
      }
      systemManage.taglib(params).then(response => {
        if (response.data.code === 0) {
          this.dataList = response.data.data
        }
      })
    },
    setSex() {
      this.$emit('changeSex', this.defaultValue)
    }
  },
  watch: {
    selectedData(newVal, oldVal) {
      this.defaultValue = newVal
    }
  }
}
</script>
