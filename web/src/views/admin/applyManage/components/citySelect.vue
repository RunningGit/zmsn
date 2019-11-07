<template>
  <div :class="$style.content">
    <!-- <div :class="$style.box">
      <span :class="$style.box_span">省 :</span>
      <dy-select v-model="addressValue.province">
        <dy-select-option
          v-for="(item, index) in provinceList"
          :key="'province'+item.name"
          :label="item.name"
          :value="index"
        ></dy-select-option>
      </dy-select>
    </div>-->
    <div :class="$style.box">
      <span :class="$style.box_span">市 :</span>
      <dy-select v-model="addressValue.city" v-if="!!cityList.length">
        <dy-select-option
          v-for="(item, index) in cityList"
          :key="item.name"
          :label="item.name"
          :value="index"
        ></dy-select-option>
      </dy-select>
    </div>

    <div :class="$style.box">
      <span :class="$style.box_span">县 :</span>
      <dy-select v-model="addressValue.area" v-if="!!areaList.length">
        <dy-select-option
          v-for="(item, index) in areaList"
          :key="item"
          :label="item"
          :value="index"
        ></dy-select-option>
      </dy-select>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProjectList',
  data() {
    return {
      provinceList: provinceList,
      addressValue: this.address || {
        province: 0,
        city: 0,
        area: 0
      }
    }
  },
  props: {
    address: {
      type: Object
    }
  },
  computed: {
    cityList() {
      try {
        return this.provinceList[this.addressValue.province].cityList || []
      } catch (e) {
        return []
      }
    },
    areaList() {
      try {
        return this.cityList[this.addressValue.city].areaList || []
      } catch (e) {
        return []
      }
    }
  },
  watch: {
    addressValue: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {}
}

export const provinceList = [
  {
    name: '广东',
    cityList: [
      { name: '请选择', areaList: [] },
      {
        name: '广州市',
        areaList: [
          '请选择',
          '市辖区',
          '东山区',
          '荔湾区',
          '越秀区',
          '海珠区',
          '天河区',
          '芳村区',
          '白云区',
          '黄埔区',
          '番禺区',
          '花都区',
          '增城市',
          '从化市'
        ]
      },
      {
        name: '韶关市',
        areaList: [
          '请选择',
          '市辖区',
          '武江区',
          '浈江区',
          '曲江区',
          '始兴县',
          '仁化县',
          '翁源县',
          '乳源瑶族自治县',
          '新丰县',
          '乐昌市',
          '南雄市'
        ]
      },
      {
        name: '深圳市',
        areaList: [
          '请选择',
          '市辖区',
          '罗湖区',
          '福田区',
          '南山区',
          '宝安区',
          '龙岗区',
          '盐田区'
        ]
      },
      {
        name: '珠海市',
        areaList: ['请选择', '市辖区', '香洲区', '斗门区', '金湾区']
      },
      {
        name: '汕头市',
        areaList: [
          '请选择',
          '市辖区',
          '龙湖区',
          '金平区',
          '濠江区',
          '潮阳区',
          '潮南区',
          '澄海区',
          '南澳县'
        ]
      },
      {
        name: '佛山市',
        areaList: [
          '请选择',
          '市辖区',
          '禅城区',
          '南海区',
          '顺德区',
          '三水区',
          '高明区'
        ]
      },
      {
        name: '江门市',
        areaList: [
          '请选择',
          '市辖区',
          '蓬江区',
          '江海区',
          '新会区',
          '台山市',
          '开平市',
          '鹤山市',
          '恩平市'
        ]
      },
      {
        name: '湛江市',
        areaList: [
          '请选择',
          '市辖区',
          '赤坎区',
          '霞山区',
          '坡头区',
          '麻章区',
          '遂溪县',
          '徐闻县',
          '廉江市',
          '雷州市',
          '吴川市'
        ]
      },
      {
        name: '茂名市',
        areaList: [
          '请选择',
          '市辖区',
          '茂南区',
          '茂港区',
          '电白县',
          '高州市',
          '化州市',
          '信宜市'
        ]
      },
      {
        name: '肇庆市',
        areaList: [
          '请选择',
          '市辖区',
          '端州区',
          '鼎湖区',
          '广宁县',
          '怀集县',
          '封开县',
          '德庆县',
          '高要市',
          '四会市'
        ]
      },
      {
        name: '惠州市',
        areaList: [
          '请选择',
          '市辖区',
          '惠城区',
          '惠阳区',
          '博罗县',
          '惠东县',
          '龙门县'
        ]
      },
      {
        name: '梅州市',
        areaList: [
          '请选择',
          '市辖区',
          '梅江区',
          '梅　县',
          '大埔县',
          '丰顺县',
          '五华县',
          '平远县',
          '蕉岭县',
          '兴宁市'
        ]
      },
      {
        name: '汕尾市',
        areaList: ['请选择', '市辖区', '城　区', '海丰县', '陆河县', '陆丰市']
      },
      {
        name: '河源市',
        areaList: [
          '请选择',
          '市辖区',
          '源城区',
          '紫金县',
          '龙川县',
          '连平县',
          '和平县',
          '东源县'
        ]
      },
      {
        name: '阳江市',
        areaList: ['请选择', '市辖区', '江城区', '阳西县', '阳东县', '阳春市']
      },
      {
        name: '清远市',
        areaList: [
          '请选择',
          '市辖区',
          '清城区',
          '佛冈县',
          '阳山县',
          '连山壮族瑶族自治县',
          '连南瑶族自治县',
          '清新县',
          '英德市',
          '连州市'
        ]
      },
      { name: '东莞市', areaList: ['请选择', '东莞市'] },
      { name: '中山市', areaList: ['请选择', '中山市'] },
      {
        name: '潮州市',
        areaList: ['请选择', '市辖区', '湘桥区', '潮安县', '饶平县']
      },
      {
        name: '揭阳市',
        areaList: [
          '请选择',
          '市辖区',
          '榕城区',
          '揭东县',
          '揭西县',
          '惠来县',
          '普宁市'
        ]
      },
      {
        name: '云浮市',
        areaList: [
          '请选择',
          '市辖区',
          '云城区',
          '新兴县',
          '郁南县',
          '云安县',
          '罗定市'
        ]
      }
    ]
  }
]
</script>
<style lang="less" module>
.content {
  display: inline;
  .box {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    .box_span {
      padding-right: 10px;
    }
  }
}
</style>
