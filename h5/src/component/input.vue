<template>
  <div class="input-cont" :type="type" :lock="lock">
    <p class="label">
      {{attr.label}}
      <i class="is-require" v-show="attr.isRequire && type !== 'row'">*</i>
    </p>
    <input
      type="text"
      class="input"
      @input="handleInput"
      v-model="msg"
      v-show="attr.type !== 'textarea'"
      :placeholder="attr.placeholder"
      :disabled="lock === true"
    />
    <textarea
      v-show="attr.type === 'textarea'"
      rows="3"
      cols="20"
      :placeholder="attr.placeholder"
      class="textarea"
      :disabled="lock === true"
    />
  </div>
</template>

<script>
export default {
  props: {
    attr: {
      type: [Object],
      default: {
        label: "",
        isRequire: true
      }
    },
    val: {
      type: [String],
      default: ""
    },
    lock: {
      type: [Boolean],
      default: false
    }, 
    type: {
      type: [String],
      default: ""
    }
  },
  data() {
    return {
      msg: this.val,
      attrState: this.attr
    };
  },
  watch: {
    val: function(curVal) {
      this.msg = curVal;
    },
    attr: function(curVal) {
      this.attrState = curVal;
    }
  },
  methods: {
    handleInput() {
      this.$emit("input", {
        key: this.attrState.key,
        val: this.msg
      });
    }
  }
};
</script>

<style lang="less" scoped>
@inputPlaceholderColor: #333;

.input-cont {
  font-size: 28px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  margin-top: 30px;

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

    .input {
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
    color: #ff0000;
    font-size: 30px;
  }

  .input,
  .textarea {
    width: 100%;
    border: 2px solid rgba(238, 238, 238, 1);
    border-radius: 8px;
    margin-top: 20px;
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 28px;

    &:disabled {
      background: rgba(250, 250, 250, 1);
    }
  }

  .input {
    height: 70px;
  }

  .textarea {
    height: 140px;
    padding: 20px;
  }
}

textarea::-webkit-input-placeholder,
input::-webkit-input-placeholder {
  color: @inputPlaceholderColor;
}

textarea:-moz-placeholder,
input:-moz-placeholder {
  color: @inputPlaceholderColor;
}

textarea::-moz-placeholder,
input::-moz-placeholder {
  color: @inputPlaceholderColor;
}

textarea::-ms-input-placeholder,
input::-ms-input-placeholder {
  color: @inputPlaceholderColor;
}
</style>