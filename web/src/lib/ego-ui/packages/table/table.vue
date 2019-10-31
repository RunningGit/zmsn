<template>
  <div class="dy-table"
    :class="{'dy-table-border': border && !noBorder, 'dy-table-no-border': noBorder && !border}"
    :style="{width: this.width}"
    @drop="handleEndDrag">
    <div class="dy-table-wrapper"
      v-dyloading="{isLoading: loading, title: '数据加载中...'}">
      <div class="dy-table-header">
        <table :class="{'dy-table-fixed': scrollY}">
          <colgroup>
            <col v-if="draggable"
              width="50" />
            <col v-if="selectable"
              width="50" />
            <col v-for="(col, colIndex) in columns"
              :key="col.dataIndex"
              :width="endFixed && colIndex === columns.length - 1 ? 88 : columnWidth" />
          </colgroup>
          <thead>
            <tr v-clickoutside="handleClose">
              <th v-if="draggable"
                width="50"
                class="dy-table-dragger"
                :style="{padding: 0}"
                align="center">
              </th>
              <th v-if="selectable"
                width="50"
                :style="{padding: 0}"
                align="center">
                <dy-checkbox v-model="allChecked"
                  :disabled="!tableData.length"
                  @change="handleCheckAll" />
              </th>
              <th v-for="(col, colIndex) in columns"
                :key="col.dataIndex"
                :style="{paddingLeft: endFixed && colIndex === columns.length - 1 ? 0 : '30px', paddingRight: endFixed && colIndex === columns.length - 1 ? '30px' : 0}"
                :width="endFixed && colIndex === columns.length - 1 ? 88 : columnWidth"
                :align="endFixed && colIndex === columns.length - 1 ? 'right' : 'left'">
                <span class="dy-table-title"
                  :style="setTableHeaderStyle(col)"
                  @click="handleDropdown(colIndex, col)">
                  <slot name="head"
                    :column="col"
                    :index="colIndex">
                    {{col.title}}
                  </slot>
                  <dy-icon v-if="col.dropdownMenu"
                    type="caret-down"
                    :class="{'dy-visible': dropdownMenu[colIndex].visible}" />
                  <div class="dy-table-dropdown"
                    v-if="col.dropdownMenu"
                    v-show="dropdownMenu[colIndex].visible">
                    <ul class="dy-table-dropdown-menu">
                      <li v-for="(menu, menuIdx) in col.dropdownMenu"
                        :key="menuIdx"
                        :class="{'dy-active': dropdownMenu[colIndex].activeIndex === menuIdx}"
                        @click="handleSelectMenu(menu, col, colIndex, menuIdx)">
                        {{menu.title}}
                      </li>
                    </ul>
                  </div>
                </span>
                <span v-if="col.sortedBy"
                  class="dy-table-sortable"
                  @click="handleSort(col)">
                  <dy-icon type="angle-single-up"
                    :class="{'dy-ascend': col.sortedBy === 'ascend'}" />
                  <dy-icon type="angle-single-down"
                    :class="{'dy-descend': col.sortedBy === 'descend'}" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody v-if="!scrollY && tableData.length <= 0">
            <tr>
              <td :colspan="calcColspan"
                class="dy-table-empty">
                暂无数据
              </td>
            </tr>
          </tbody>
          <tbody is="transition-group"
            v-if="!scrollY && tableData.length > 0"
            tag="tbody"
            name="table-flip">
            <tr v-for="(item, idx) in tableData"
              :key="idx"
              :class="{'dy-selected': rowsChecked[idx].checked}"
              :draggable="draggable && dragger.index === idx"
              @dragstart="e => handleStartDrag(e, item, idx)"
              @dragenter="handleRowDragging"
              @dragend="handleEndDrag">
              <td v-if="draggable"
                width="50"
                class="dy-table-dragger"
                :style="{padding: 0}"
                align="center">
                <span @mousedown="dragger.index = idx">
                  <dy-icon type="draggable" />
                </span>
              </td>
              <td v-if="selectable"
                width="50"
                :style="{padding: 0}"
                align="center">
                <dy-checkbox v-model="rowsChecked[idx].checked"
                  @change="handleCheckList(idx)" />
              </td>
              <td v-for="(col, i) in columns"
                :key="col.dataIndex"
                :style="{paddingLeft: endFixed && i === columns.length - 1 ? 0 : '30px', paddingRight: endFixed && i === columns.length - 1 ? '30px' : 0}"
                :width="endFixed && i === columns.length - 1 ? 88 : columnWidth"
                :align="endFixed && i === columns.length - 1 ? 'right' : 'left'">
                <render-node v-if="typeof col.render === 'function'"
                  :render-content="col.render"
                  :node="{data: item, column: col, rowIndex: idx, colIndex: i}"
                  :key="idx" />
                <slot v-else
                  name="body"
                  :column="col"
                  :data="item"
                  :rowIndex="idx"
                  :colIndex="i">
                  <div :class="{'dy-ellipsis': endFixed && i === columns.length - 1 ? false : true}"
                    :title="initTitleProp(item, col)">
                    {{col.formatter ? col.formatter(item[col.dataIndex], item) : item[col.dataIndex]}}
                    <!-- <span v-else
                                            v-html="col.formatter ? col.formatter(item[col.dataIndex]) : item[col.dataIndex]">
                                        </span> -->
                  </div>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 固定表头 -->
      <div v-if="scrollY"
        ref="fixedTable"
        class="dy-table-body"
        :style="{height: scrollY}">
        <table :class="{'dy-table-fixed': scrollY}">
          <colgroup>
            <col v-if="draggable"
              width="50" />
            <col v-if="selectable"
              width="50" />
            <col v-for="(col, colIndex) in columns"
              :key="col.dataIndex"
              :width="endFixed && colIndex === columns.length - 1 ? 88 : columnWidth" />
          </colgroup>
          <tbody v-if="tableData.length <= 0">
            <tr>
              <td :colspan="calcColspan"
                class="dy-table-empty">
                暂无数据
              </td>
            </tr>
          </tbody>
          <tbody is="transition-group"
            tag="tbody"
            name="table-flip">
            <tr v-for="(item, idx) in tableData"
              :key="idx"
              :class="{'dy-selected': rowsChecked[idx].checked}"
              :draggable="draggable && dragger.index === idx"
              @dragstart="e => handleStartDrag(e, item, idx)"
              @dragenter="handleRowDragging"
              @dragend="handleEndDrag">
              <td v-if="draggable"
                width="50"
                class="dy-table-dragger"
                :style="{padding: 0}"
                align="center">
                <span @mousedown="dragger.index = idx">
                  <dy-icon type="draggable" />
                </span>
              </td>
              <td v-if="selectable"
                width="50"
                :style="{padding: 0}"
                align="center">
                <dy-checkbox v-model="rowsChecked[idx].checked"
                  @change="handleCheckList(idx)" />
              </td>
              <td v-for="(col, i) in columns"
                :key="col.dataIndex"
                :style="{paddingLeft: endFixed && i === columns.length - 1 ? 0 : '30px', paddingRight: endFixed && i === columns.length - 1 ? '30px' : 0}"
                :width="endFixed && i === columns.length - 1 ? 88 : columnWidth"
                :align="endFixed && i === columns.length - 1 ? 'right' : 'left'">
                <render-node v-if="typeof col.render === 'function'"
                  :render-content="col.render"
                  :node="{data: item, column: col, rowIndex: idx, colIndex: i}"
                  :key="idx" />
                <slot v-else
                  name="body"
                  :column="col"
                  :data="item"
                  :rowIndex="idx"
                  :colIndex="i">
                  <div :class="{'dy-ellipsis': endFixed && i === columns.length - 1 ? false : true}"
                    :title="initTitleProp(item, col)">
                    {{col.formatter ? col.formatter(item[col.dataIndex], item) : item[col.dataIndex]}}
                    <!-- <span v-else
                                            v-html="col.formatter ? col.formatter(item[col.dataIndex]) : item[col.dataIndex]">
                                        </span> -->
                  </div>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="dy-table-footer">
      <dy-pagination v-if="tableData.length > 0 && pagination"
        :up="pagination.up"
        :total="pagination.total"
        :current-page="pagination.currentPage"
        :show-total="pagination.showTotal"
        :page-size-options="pagination.pageSizeOptions"
        :page-size="pagination.pageSize"
        :show-page-size="pagination.showPageSize"
        :show-quick-jumper="pagination.showQuickJumper"
        @page-change="handleChangePage" />
    </div>
  </div>
</template>

<script>
import '../theme-default/table.less'
import clickoutside from '../directives/clickoutside'
import { bindEvent, removeEvent } from '../utils/common'
import DyCheckbox from '../checkbox/checkbox'
import DyPagination from '../pagination/pagination'
export default {
  name: 'dy-table',
  directives: {
    clickoutside
  },
  components: {
    DyPagination,
    DyCheckbox,
    RenderNode: {
      name: 'render-node',
      props: {
        renderContent: {
          type: Function,
          default: null
        },
        node: {
          require: true
        }
      },
      render(h) {
        if (!this.renderContent) return null
        const node = this.node
        const { data, column, rowIndex, colIndex } = node
        return this.renderContent.call(this._renderProxy, h, {
          context: this.$vnode.context,
          node,
          data,
          column,
          rowIndex,
          colIndex
        })
      }
    }
  },
  props: {
    // 表格列目
    columns: {
      type: Array,
      default() {
        return []
      },
      require: true
    },
    // 表格数据
    dataSource: {
      type: Array,
      default() {
        return []
      },
      require: true
    },
    // 带边框
    border: {
      type: Boolean,
      default: false
    },
    // 无边框
    noBorder: {
      type: Boolean,
      default: false
    },
    // 表格宽度
    width: {
      type: String,
      default: null
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 可否拖曳
    draggable: {
      type: Boolean,
      default: false
    },
    // 是否可选
    selectable: {
      type: Boolean,
      default: false
    },
    // 分页显示
    pagination: {
      type: Object,
      default: null
    },
    // 表格出现滚动条高度
    scrollY: {
      type: String,
      default: null
    },
    // 特殊需求，最后一列是否为操作
    endFixed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表格数据，不直接操作dataSource
      tableData: [...this.dataSource],
      // 是否全选
      allChecked: false,
      // 表格数据行checkbox状态
      rowsChecked: this.dataSource.map(item => ({
        ...item,
        checked: false
      })),
      // 表格下拉菜单
      dropdownMenu: this.columns.map(col => ({
        // 显示隐藏
        visible: false,
        // 选中菜单选项
        activeIndex: null
      })),
      // 表格宽
      tableWidth: 0,
      // 列宽
      columnWidth: 0,
      // 拖动行数据
      dragger: {
        data: null,
        index: null
      }
    }
  },
  computed: {
    /**
     * 暂无数据时单元格占列
     */
    calcColspan() {
      let colspan = this.columns.length
      this.selectable && colspan++
      this.draggable && colspan++
      return colspan
    }
  },
  methods: {
    /**
     * 设置title属性
     */
    initTitleProp(data, column) {
      if (column.formatter) {
        return column.formatter(data[column.dataIndex], data)
      } else {
        return data[column.dataIndex]
      }
    },
    /**
     * 开始拖曳
     */
    handleStartDrag(e, data, index) {
      if (!this.draggable) return
      this.dragger = {
        data,
        index
      }
      this.$emit('start-drag', e, data, index)
    },
    /**
     * 结束拖曳
     */
    handleEndDrag(e) {
      if (!this.draggable) return
      e.preventDefault()
      const { data, index } = this.dragger
      this.$emit('end-drag', data, index)
      this.$nextTick(() => {
        this.dragger = {
          data: null,
          index: null
        }
      })
    },
    /**
     * 拖曳中...
     */
    handleRowDragging(e) {
      if (!this.draggable) return
      e.preventDefault()
      let { data, index } = this.dragger
      if (!data) return
      // 表格行索引
      let rowIndex = e.currentTarget.rowIndex - 1
      if (index !== rowIndex) {
        let tableData = [...this.tableData]
        ;[tableData[index], tableData[rowIndex]] = [
          tableData[rowIndex],
          tableData[index]
        ]
        this.tableData = [...tableData]
        this.dragger.index = rowIndex
      }
      this.$emit('dragging', e, data, index)
    },
    /**
     * 有 下拉或排序 则宽度自动
     * 否则继承父元素宽度
     * 用于文本溢出...
     * @param {Object} column
     */
    setTableHeaderStyle(column) {
      let width = column.dropdownMenu || column.sortedBy ? 'auto' : 'inherit'
      let overflow = column.dropdownMenu ? 'visible' : 'overflow'
      return {
        width,
        overflow
      }
    },
    /**
     * 特殊需求
     * 计算列宽（减去前后固定宽度后剩余平分）
     */
    calcTableWidth() {
      const draggerWidth = 50
      const checkboxWidth = 50
      const endColumnWidth = 88
      const cellPadding = 30
      const { draggable, selectable, endFixed, columns } = this
      let columnWidth = null
      let tableWidth = this.width || (this.$el && this.$el.offsetWidth) || 0
      if (!selectable) {
        if (!endFixed) {
          if (!draggable) {
            columnWidth = tableWidth / columns.length
          } else {
            columnWidth = (tableWidth - draggerWidth) / columns.length
          }
        } else {
          if (!draggable) {
            columnWidth = (tableWidth - endColumnWidth) / columns.length
          } else {
            columnWidth =
              (tableWidth - endColumnWidth - draggerWidth) / columns.length
          }
        }
      } else {
        if (!endFixed) {
          if (!draggable) {
            columnWidth = (tableWidth - checkboxWidth) / columns.length
          } else {
            columnWidth =
              (tableWidth - checkboxWidth - draggerWidth) / columns.length
          }
        } else {
          if (!draggable) {
            columnWidth =
              (tableWidth - checkboxWidth - endColumnWidth) / columns.length
          } else {
            columnWidth =
              (tableWidth - checkboxWidth - draggerWidth - endColumnWidth) /
              columns.length
          }
        }
      }
      this.tableWidth = tableWidth + 'px'
      this.columnWidth = columnWidth - cellPadding
    },
    /**
     * 分页事件
     * @param pageArgs {currentPage, pageSize}
     */
    handleChangePage(pageArgs) {
      this.$emit('page-change', pageArgs)
    },
    /**
     * 全(不?)选
     */
    handleCheckAll() {
      this.rowsChecked.forEach(item => {
        item.checked = this.allChecked
      })
      this.$emit('checked-all', this.allChecked, this.rowsChecked)
    },
    /**
     * 供外部调用
     * 取消全选状态
     * @param {Boolean} isAllChecked
     */
    toggleCheckAll(isAllChecked = false) {
      this.allChecked = isAllChecked
      for (let item of this.rowsChecked) {
        item.checked = isAllChecked
      }
    },
    /**
     * 供外部调用
     * 默认选中行
     * @param {Array} rows 选中的数据
     * @param {String} query 唯一索引
     */
    toggleCheckRows(rows, query) {
      if (rows && rows instanceof Array) {
        let isAllChecked = true
        for (let item of this.rowsChecked) {
          for (let row of rows) {
            row.checked = item.checked
            if (item[query] === row[query]) {
              item.checked = !item.checked
            }
          }
          if (!item.checked) {
            isAllChecked = false
          }
        }
        this.allChecked = isAllChecked
      } else {
        this.toggleCheckAll()
      }
    },
    /**
     * 选择列表项
     * @param idx{Number} 选中行索引
     */
    handleCheckList(idx) {
      let isAllChecked = true
      for (let item of this.rowsChecked) {
        if (!item.checked) {
          isAllChecked = false
          break
        }
      }
      this.allChecked = isAllChecked
      this.$emit('checked-change', this.rowsChecked[idx], this.rowsChecked)
    },
    /**
     * 升降排序事件
     * @param column 列数据
     */
    handleSort(column) {
      const sortedMap = {
        none: 'ascend',
        ascend: 'descend',
        descend: 'none'
      }
      const nextSortedBy = column.sortedBy
      column.sortedBy = sortedMap[nextSortedBy]
      this.$emit('sort-change', column, sortedMap[nextSortedBy])
    },
    /**
     * 表头下拉菜单
     * @param idx 列索引
     * @param column 列数据
     */
    handleDropdown(idx, column) {
      if (!column.dropdownMenu) return
      const visible = this.dropdownMenu[idx].visible
      this.handleClose()
      if (!visible) {
        this.dropdownMenu[idx].visible = !visible
      }
    },
    /**
     * 表头下拉菜单选择事件
     * @param {Object} menu
     * @param {Object} col
     * @param {Number} colIndex
     * @param {Number} menuIdx
     */
    handleSelectMenu(menu, col, colIndex, menuIdx) {
      this.dropdownMenu[colIndex].activeIndex = menuIdx
      menu.fun && menu.fun(col)
    },
    /**
     * click-outside事件
     */
    handleClose() {
      this.dropdownMenu = this.dropdownMenu.map(menu => {
        menu.visible = false
        return menu
      })
    },
    /**
     * 防止ie下拖动时选中内容
     * @param {event} e
     */
    preventSelectInIE(e) {
      for (let el = e.target; el; el = el.parentNode) {
        if (el.attributes && el.attributes['draggable']) {
          e.preventDefault()
          e.stopImmediatePropagation()
          el.dragDrop()
          return false
        }
      }
    }
  },
  watch: {
    dataSource(newDataSource) {
      this.tableData = [...newDataSource]
      this.allChecked = false
      this.rowsChecked = newDataSource.map(item => ({
        ...item,
        checked: false
      }))
      if (this.scrollY) {
        this.$nextTick(() => {
          this.$refs.fixedTable.scrollTop = 0
        })
      }
    }
  },
  mounted() {
    this.calcTableWidth()
    bindEvent(window, 'resize', this.calcTableWidth)
    // ie9 拖动兼容
    if (document.doctype && navigator.appVersion.indexOf('MSIE 9') > -1) {
      bindEvent(document, 'selectstart', this.preventSelectInIE)
    }
  },
  beforeDestroy() {
    removeEvent(window, 'resize', this.calcTableWidth)
    removeEvent(document, 'selectstart', this.preventSelectInIE)
  }
}
</script>
