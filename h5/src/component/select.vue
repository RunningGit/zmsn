<template>
<div class="es-select-cont" :type="type" :lock="lock">
  <p class="label">{{attr.label}} <i class="is-require" v-show="attr.isRequire && type !== 'row'">*</i></p>
  <select name="public-choice" v-model="selectedValState" class="select" @change="handleInput" :disabled="lock === true" >
    <option value="" disabled selected>{{attr.placeholder}}</option>  
    <option :value="item.value" v-for="(item, index) in options" :key="index">
      {{item.name}}
    </option>
  </select>
    <i class="icon-arrow" v-show="type === 'row' && lock !== true"/>
</div>
</template>

<script>
export default {
  props: {
    options: {
      type: [Array],
      default: () => [{
        value: 'value1',
        name: 'name1'
      },{
        value: 'value2',
        name: 'name2'
      }]
    },
    selectedVal: '',
    attr: {
      type: [Object],
      default: {
        label: '',
        isRequire: true,
      }
    },
    lock: {
      type: [Boolean],
      default: false
    },
    type: {
      type: [String],
      default: '',
    }
  },
  data() {
    return {
      selectedValState: '',
      attrState: this.attr
    }
  },
  watch: {
    selectedVal: function(curVal) {
      this.selectedValState = curVal
    },
    attr: function(curVal) {
      this.attrState = curVal;
    }
  },
  methods: {
    handleInput() {
      this.$emit('input', {
        key: this.attrState.key,
        val: this.selectedValState
      })
    }
  }
}
</script>


<style lang="less" scoped>
.es-select-cont {
  font-size: 28px;
  font-weight:500;
  color:rgba(51,51,51,1);
  margin-top: 30px;
  position: relative;

  &[lock='true'] {
    margin-top: 0;
  }

  &[type='row'] {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    font-weight: normal;

    .label {
      width: 280px;
    }

    .select {
      margin-top: 0px;
      margin-left: 40px;

      &:disabled {
        background: rgba(250, 250, 250, 1);
        border: none;
        background: none;
      }
    }
  }

  .label {
    font-size: 30px;
  }

  .is-require {
    color: #FF0000;
    font-size:30px;
  }

  .select {
    width: 100%;
    height: 70px;
    border:2px solid rgba(238,238,238,1);
    border-radius:8px;
    margin-top: 20px;
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 28px;
    color: #333;

    &[disabled] {
      background:rgba(250,250,250,1);
    }

    &:focus {
      outline-offset: none;
    }
  }

  .icon-arrow {
    display: inline-block;
    height: 25px;
    width: 25px;
    background: url(../assets/down.png) no-repeat;
    background-size: 100% 100%;
    right: 22px;
    bottom: 18px;
    position: absolute;
  }
}
</style>