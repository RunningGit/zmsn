<template>
  <div class="dy-pagination"
    :class="'dy-pagination-' + type">

    <!-- 共多少条记录 -->
    <div class="dy-pagination-count"
      v-if="content.indexOf('total') !== -1">共
      <span>{{total}}</span>条记录
    </div>

    <!-- 每页显示多少条记录 -->
    <dy-select :list="selectList"
      :selected.sync="defaultDemo.selected"
      class="margin-left-10"
      v-if="content.indexOf('sizes') !== -1">
      <dy-select-option v-for="option in selectList"
        :key="option.id"
        :value="option.id"
        :label="option.label">
      </dy-select-option>
    </dy-select>

    <!-- 分页table -->
    <ul class="dy-pagination-ul margin-left-10">
      <li :class="{'is-disabled': currentPage === 1}"
        @click="jumpToPage(1)"
        v-if="content.indexOf('first') !== -1">
        <span>
          <i class="icon iconfont icon-angle-double-left"></i>
          <template v-if="type === 'primary'">第一页</template>
        </span>
      </li>
      <li :class="{'is-disabled': currentPage === 1}"
        @click="jumpToPrev"
        v-if="content.indexOf('prev') !== -1">
        <span>
          <i class="icon iconfont icon-angle-single-left"></i>
          <template v-if="type === 'primary'">上一页</template>
        </span>
      </li>
      <li v-for="(item, index) in pager"
        :key="index"
        :class="(index+1) === currentPage ? 'is-actived' : ''"
        @click="jumpToPage(index+1)"
        v-if="content.indexOf('pager') !== -1">
        <span>{{index+1}}</span>
      </li>
      <li :class="{'is-disabled': currentPage === pager}"
        @click="jumpToNext"
        v-if="content.indexOf('next') !== -1">
        <span>
          <template v-if="type === 'primary'">下一页</template>
          <i class="icon iconfont icon-angle-single-right"></i>
        </span>
      </li>
      <li :class="{'is-disabled': currentPage === pager}"
        @click="jumpToPage(pager)"
        v-if="content.indexOf('last') !== -1">
        <span>
          <template v-if="type === 'primary'">最后一页</template>
          <i class="icon iconfont icon-angle-double-right"></i>
        </span>
      </li>
    </ul>

    <!-- 共多少页 -->
    <div class="dy-pagination-count margin-left-10">共
      <span>{{pager}}</span>页
    </div>

    <!-- 页码跳转 -->
    <div class="dy-pagination-count margin-left-10">前往
      <span class="inut">
        <dy-input placeholder=" "
          :selected.sync="jumpPager"
          ref="input"
          @handleKeyup="handleKeyup()"></dy-input>
      </span>页
    </div>

  </div>
</template>

<script type="text/javascript">
/**
 * 分页组件
 * @example
 * <dy-pagination
 *    type="primary"
 *    :currentPage.sync="pager.currentPage"
 *    :sizes="pager.sizes"
 *    :size.sync="pager.pageSize"
 *    :total="pager.total"
 *    layout="total, sizes, prev, pager, next"
 *    @size-change="handleSizeChange"
 *    @current-change="handleCurrentChange">
 * </dy-pagination>
 *
 * export default {
 *    data() {
 *      return {
 *        pager: {
 *          currentPage: 1,
 *          sizes: '[10, 20, 50]',
 *          pageSize: 10,
 *          total: 100
 *        }
 *      }
 *    }
 * }
 */
import '../theme-default/pagination.less'
import { isInteger } from '../utils/common'
export default {
  name: 'dy-pagination',
  props: {
    /**
     * 分页类型，目前仅提供两种，'default'/'primary'
     */
    type: {
      type: String,
      default: 'default'
    },
    /**
     * 当前选中页码
     */
    currentPage: {
      type: Number,
      default: 1,
      required: true
    },
    /**
     * 禁用状态
     */
    disable: {
      type: Boolean,
      default: false
    },
    /**
     * 总数量
     */
    total: {
      type: Number,
      default: 10,
      required: true
    },
    /**
     * 可选择数量范围，如 [10, 20, 30]
     */
    sizes: {
      type: [Array, Object]
    },
    /**
     * 当前选择查看的数量
     */
    size: {
      type: Number,
      required: true
    },
    /**
     * 可选择面板显示，可供 'total, sizes, prev, pager, next, jumper'
     */
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  data() {
    return {
      defaultDemo: {
        selected: 0
      },
      jumpPager: 1
    }
  },
  watch: {
    /**
     * 每页显示数量发生变化
     */
    'defaultDemo.selected'(val) {
      this.$emit('update:size', this.sizes[val])
      this.$emit('size-change', this.sizes[val])
      this.jumpToPage(1)
    }
  },
  methods: {
    /**
     * 跳转到上一页
     */
    jumpToPrev() {
      let newPage
      if (this.currentPage <= 1) {
        newPage = 1
      } else {
        newPage = this.currentPage - 1
        this.jumpToPage(newPage)
      }
    },
    /**
     * 跳转到下一页
     */
    jumpToNext() {
      let newPage
      if (this.currentPage >= this.pager) {
        newPage = this.pager
      } else {
        newPage = this.currentPage + 1
        this.jumpToPage(newPage)
      }
    },
    /**
     * 页面跳转
     */
    jumpToPage(item) {
      this.$emit('update:currentPage', item)
      this.$emit('current-change', item)
    },
    /**
     * 输入跳转页数并回车，输入范围在小数选择四舍五入，超出可选范围出现错误提示
     */
    handleKeyup() {
      // 丢弃小数，向下取整
      let number = parseInt(this.jumpPager)

      if (isInteger(number)) {
        if (number <= 0 || number > this.pager) {
          this.$ego.alertMsg('请输入正确范围', 'danger')
        } else {
          this.$refs.input.model = number
          this.jumpPager = number
          this.jumpToPage(number)
        }
      } else {
        this.$ego.alertMsg('请输入数字', 'danger')
      }
    }
  },
  computed: {
    /**
     * 例：this.sizes="[10, 20, 50]"
     * 生成对应范围的下拉选项
     */
    selectList() {
      let array = []
      for (let [key, value] of this.sizes.entries()) {
        let json = {
          id: key,
          label: `${value} 条/页`
        }
        array.push(json)
      }
      return array
    },
    /**
     * 计算当前范围的页码数
     */
    pager() {
      return Math.ceil(this.total / this.sizes[this.defaultDemo.selected])
    },
    /**
     * 需要显示的分组内容，包括 'total, sizes, first, prev, pager, next, last'
     */
    content() {
      return this.layout.split(',').map(item => item.trim())
    }
  }
}
</script>
