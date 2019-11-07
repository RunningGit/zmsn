<template>
  <div>
    <option-top leftTitleText="nnnn蛸" rightTitleText="nnnn蛸" leftTipsText="nnnn蛸" rightTipsText="sfs">
        <div>
            <city-select v-model="address"></city-select> {{address}}
            <dy-input></dy-input>
        </div>
        <div>slot0 这里的0 1 2 3 等跟左边导航的长度一致，从0开始</div>
    </option-top>
  </div>
</template>
<script>
import OptionTop from '../components/optionTop'
import CitySelect from '../components/citySelect'
export default {
  name: '',
  components: {
    OptionTop, CitySelect
  },
  props: {},
  vuex: {},
  data() {
    return {
      address: {
        city: 0,
        area: 0
      }
    }
  },
  computed: {},
  watch: {},
  methods: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {}
}
</script>
<style lang="less">
</style>
