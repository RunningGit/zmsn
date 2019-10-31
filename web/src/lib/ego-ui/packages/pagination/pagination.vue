<template>
  <div class="dy-pagination">
    <!-- 数据总数 -->
    <div v-if="showTotal"
      class="dy-pagination-layout dy-pagination-total">
      共 {{total}} 条记录
    </div>
    <!-- 每页显示数量 -->
    <div v-if="showPageSize"
      class="dy-pagination-layout dy-pagination-select">
      <dy-select v-model="defaultPageSize"
        @change="initTotalPages"
        :width="pageSizeWidth"
        :up="up">
        <dy-select-option v-for="count in pageSizeOptions"
          :key="count"
          :value="count"
          :label="`${count} 条/页`">
        </dy-select-option>
      </dy-select>
    </div>
    <!-- 分页导航 -->
    <div class="dy-pagination-layout dy-pagination-navigation">
      <ul>
        <!-- 上一页 -->
        <li class="dy-pagination-navigation-prev">
          <a href="javascript:void(0)"
            :class="{'dy-pagination-disabled': +total === 0 || +current === 1}"
            @click="jumpToPrevPage">
            <i class="dy-icon icon-angle-single-left"></i>
            <!-- 上一页 -->
          </a>
        </li>
        <!-- 第一页 -->
        <li v-show="backward"
          class="dy-pagination-navigation-first">
          <a href="javascript:void(0)"
            @click="jumpToPage(1)">
            1
          </a>
        </li>
        <!-- 后退 -->
        <li v-show="backward"
          class="dy-pagination-navigation-more">
          <a href="javascript:void(0)"
            @click="jumpMorePrevPage">
            <span>···</span>
            <i class="dy-icon iconfont icon-angle-double-left"></i>
          </a>
        </li>
        <!-- 页码 -->
        <li v-for="(page, i) in pageNavigation"
          class="dy-pagination-navigation-num"
          :class="{'dy-pagination-simplify': backward && i < 2 && simplify}"
          :key="page.value">
          <a href="javascript:void(0)"
            :class="{'dy-current': page.current}"
            @click="jumpToPage(page.value)">
            {{page.value}}
          </a>
        </li>
        <!-- 前进 -->
        <li v-show="forward"
          class="dy-pagination-navigation-more">
          <a href="javascript:void(0)"
            @click="jumpMoreNextPage">
            <span>···</span>
            <i class="dy-icon iconfont icon-angle-double-right"></i>
          </a>
        </li>
        <!-- 最后一页 -->
        <li v-show="forward"
          class="dy-pagination-navigation-first">
          <a href="javascript:void(0)"
            @click="jumpToPage(totalPages)">
            {{totalPages}}
          </a>
        </li>
        <!-- 下一页 -->
        <li class="dy-pagination-navigation-next">
          <a href="javascript:void(0)"
            :class="{'dy-pagination-disabled': +total === 0 || +current === totalPages}"
            @click="jumpToNextPage">
            <!-- 下一页 -->
            <i class="dy-icon icon-angle-single-right"></i>
          </a>
        </li>
      </ul>
    </div>
    <!-- 页码跳转 -->
    <div v-if="showQuickJumper"
      class="dy-pagination-layout dy-pagination-quick-jump">
      前往
      <dy-input type="number"
        width="50"
        min="1"
        :max="totalPages"
        v-model.number="quickJumpPage"
        @keyup.enter="quickJumpToPage" /> 页
    </div>
  </div>
</template>

<script type="text/javascript">
import '../theme-default/pagination.less'
import DyInput from '../input/input'
import DySelect from '../select/select'
import DySelectOption from '../select/select-option'
export default {
  name: 'dy-pagination',
  components: {
    DyInput,
    DySelect,
    DySelectOption
  },
  props: {
    // 简版分页
    simplify: {
      type: Boolean,
      default: false
    },
    // 总数据量
    total: {
      type: [String, Number],
      default: 10
    },
    // 分页器宽度
    pageSizeWidth: {
      type: [String, Number],
      default: 110
    },
    // 是否向上
    up: {
      type: Boolean,
      default: false
    },
    // 分页器
    pageSizeOptions: {
      type: Array,
      default() {
        return [10, 20, 50]
      }
    },
    // 分页器默认每页显示条数
    pageSize: {
      type: [String, Number],
      default: null
    },
    // 当前页码
    currentPage: {
      type: [Number, String],
      default: 1
    },
    // 是否显示总数据量
    showTotal: {
      type: Boolean,
      default: false
    },
    // 是否显示分页器
    showPageSize: {
      type: Boolean,
      default: false
    },
    // 是否显示快速跳转
    showQuickJumper: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 当前页码
      current: this.currentPage ? +this.currentPage : 1,
      // 每页显示数量
      defaultPageSize: this.pageSizeOptions.includes(this.pageSize)
        ? this.pageSize
        : this.pageSizeOptions[0],
      // 总页数
      totalPages: null,
      // 后退 ···
      backward: false,
      // 前进 ···
      forward: false,

      pageNavigation: [],
      // 快速跳转值
      quickJumpPage: ''
    }
  },
  methods: {
    /**
     * 跳转页码
     */
    jumpToPage(page) {
      page = +page
      if (isNaN(page)) return
      if (page < 1 || page > this.totalPages) return
      this.current = page
      this.initPageNavigation()
      this.$emit('page-change', {
        currentPage: page,
        pageSize: this.defaultPageSize
      })
    },
    /**
     * 跳转上一页
     */
    jumpToPrevPage() {
      this.jumpToPage(this.current - 1)
    },
    /**
     * 跳转下一页
     */
    jumpToNextPage() {
      this.jumpToPage(this.current + 1)
    },
    /**
     * 跨页数向前跳转
     */
    jumpMorePrevPage() {
      let current = this.current
      let page = current - 5 < 1 ? 1 : current - 5
      this.jumpToPage(page)
    },
    /**
     * 跨页数向后跳转
     */
    jumpMoreNextPage() {
      let { current, totalPages } = this
      let page = current + 5 > totalPages ? totalPages : current + 5
      this.jumpToPage(page)
    },
    /**
     * 快速跳转页码
     */
    quickJumpToPage() {
      if (+this.quickJumpPage > this.totalPages) {
        this.quickJumpPage = this.totalPages
      }
      this.$nextTick(() => {
        this.jumpToPage(this.quickJumpPage)
        this.quickJumpPage = ''
      })
    },
    /**
     * 计算总页数
     */
    initTotalPages(initCurrent = true) {
      this.totalPages = Math.ceil(+this.total / +this.defaultPageSize)
      if (initCurrent) {
        this.jumpToPage(1)
      } else {
        // this.current = 1
        this.initPageNavigation()
      }
    },
    /**
     * 初始分页
     */
    initPageNavigation() {
      this.pageNavigation = []
      let currentPage =
        this.current > this.totalPages ? this.totalPages : this.current
      let totalPages = this.totalPages
      let startPage, endPage

      if (currentPage > 4) {
        startPage = currentPage - 2
        endPage = currentPage + 2
        this.backward = true
        if (totalPages > 7) {
          this.forward = true
        }
      } else {
        // currentPage <= 4
        startPage = 1
        if (totalPages > 6) {
          endPage = 6
        } else {
          endPage = totalPages
          this.backward = false
          this.forward = false
        }
      }

      if (currentPage >= totalPages - 3) {
        if (totalPages > 7) {
          startPage = totalPages - 5
          this.backward = true
        } else {
          startPage = 1
          this.backward = false
        }
        endPage = totalPages
        this.forward = false
      } else {
        // currentPage < totalPages - 3
        if (currentPage > 4) {
          this.backward = true
          this.forward = true
        } else {
          this.backward = false
          this.forward = true
          if (totalPages < 7) {
            this.forward = false
          }
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        this.pageNavigation.push({
          value: i,
          current: i === currentPage
        })
      }

      if (+this.total === 0) {
        this.pageNavigation = [
          {
            value: 1,
            current: true
          }
        ]
      }
    }
  },
  created() {
    this.initTotalPages(0)
  },
  mounted() {
    this.initPageNavigation()
  },
  watch: {
    total() {
      this.initTotalPages(0)
    },
    currentPage() {
      this.current = this.currentPage
      this.initPageNavigation()
    },
    defaultPageSize() {
      this.initPageNavigation()
    }
  }
}
</script>
