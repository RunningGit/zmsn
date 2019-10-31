<template>
  <div class="dy-table">
    <!-- 被拖数据 -->
    <div v-if="draggable && dragger.data"
      class="dy-table-dragging"
      :style="dragger.style">
      <table :style="{width: tableWidth}">
        <colgroup v-if="scrollY">
          <col v-if="draggable"
            width="50" />
          <col v-if="selectable"
            width="50" />
          <col v-for="(col, colIndex) in columns"
            :key="col.dataIndex"
            :width="endFixed && colIndex === columns.length - 1 ? 88 : columnWidth" />
        </colgroup>
        <tbody>
          <tr :class="{'dy-selected': rowsChecked[dragger.index].checked}">
            <td v-if="draggable"
              width="50"
              class="dy-table-dragger"
              :style="{padding: 0}"
              align="center">
              <span>
                <dy-icon type="dragable" />
              </span>
            </td>
            <td v-if="selectable"
              width="50"
              :style="{padding: 0}"
              align="center">
              <dy-checkbox v-model="rowsChecked[dragger.index].checked" />
            </td>
            <td v-for="(col, i) in columns"
              :key="col.dataIndex"
              :style="{paddingLeft: endFixed && i === columns.length - 1 ? 0 : '30px', paddingRight: endFixed && i === columns.length - 1 ? '30px' : 0}"
              :width="endFixed && i === columns.length - 1 ? 88 : columnWidth"
              :align="endFixed && i === columns.length - 1 ? 'right' : 'left'">
              <render-node v-if="typeof col.render === 'function'"
                :render-content="col.render"
                :node="{data: dragger.data, column: col, rowIndex: dragger.index, colIndex: i}"
                :key="dragger.index" />
              <div v-else
                :class="{'dy-ellipsis': endFixed && i === columns.length - 1 ? false : true}"
                :title="col.formatter ? col.formatter(dragger.data[col.dataIndex], dragger.data) : dragger.data[col.dataIndex]">
                <slot name="body"
                  :column="col"
                  :data="dragger.data"
                  :rowIndex="dragger.index"
                  :colIndex="i">
                  {{col.formatter ? col.formatter(dragger.data[col.dataIndex], dragger.data) : dragger.data[col.dataIndex]}}
                </slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 表格数据 -->
    <div class="dy-table-wrapper"
      v-dyloading="{isLoading: loading, title: '数据加载中...'}">
      <div class="dy-table-header">
        <table :class="{'dy-table-fixed': scrollY}">
          <colgroup v-if="scrollY">
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
          <tbody v-if="!scrollY">
            <tr v-if="tableData && tableData.length < 1">
              <td :colspan="selectable ? columns.length + 1 : columns.length"
                class="dy-table-empty">
                暂无数据
              </td>
            </tr>
            <tr v-for="(item, idx) in tableData"
              :key="idx"
              :class="{'dy-selected': rowsChecked[idx].checked}"
              @mousemove="handleTableDragging">
              <td v-if="draggable"
                width="50"
                class="dy-table-dragger"
                :style="{padding: 0}"
                align="center">
                <span @mousedown="e => handleStartDrag(e, item, idx)">
                  <dy-icon type="dragable" />
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
                <div v-else
                  :class="{'dy-ellipsis': endFixed && i === columns.length - 1 ? false : true}"
                  :title="col.formatter ? col.formatter(item[col.dataIndex], item) : item[col.dataIndex]">
                  <slot name="body"
                    :column="col"
                    :data="item"
                    :rowIndex="idx"
                    :colIndex="i">
                    {{col.formatter ? col.formatter(item[col.dataIndex], item) : item[col.dataIndex]}}
                    <!-- <span v-else
                                            v-html="col.formatter ? col.formatter(item[col.dataIndex]) : item[col.dataIndex]">
                                        </span> -->
                  </slot>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 固定表头 -->
      <div v-if="scrollY"
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
          <tbody>
            <tr v-if="tableData && tableData.length <= 0">
              <td :colspan="selectable ? columns.length + 1 : columns.length"
                class="dy-table-empty">
                暂无数据
              </td>
            </tr>
            <tr v-for="(item, idx) in tableData"
              :key="idx"
              :class="{'dy-selected': rowsChecked[idx].checked}"
              @mousemove="handleTableDragging">
              <td v-if="draggable"
                width="50"
                class="dy-table-dragger"
                :style="{padding: 0}"
                align="center">
                <span @mousedown="e => handleStartDrag(e, item, idx)">
                  <dy-icon type="dragable" />
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
                :class="{'dy-ellipsis': endFixed && i === columns.length - 1 ? false : true}"
                :style="{paddingLeft: endFixed && i === columns.length - 1 ? 0 : '30px', paddingRight: endFixed && i === columns.length - 1 ? '30px' : 0}"
                :width="endFixed && i === columns.length - 1 ? 88 : columnWidth"
                :align="endFixed && i === columns.length - 1 ? 'right' : 'left'"
                :title="col.formatter ? col.formatter(item[col.dataIndex], item) : item[col.dataIndex]">
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
                  {{col.formatter ? col.formatter(item[col.dataIndex], item) : item[col.dataIndex]}}
                  <!-- <span v-else
                                            v-html="col.formatter ? col.formatter(item[col.dataIndex]) : item[col.dataIndex]">
                                        </span> -->
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
        const { data, column } = node
        return this.renderContent.call(this._renderProxy, h, {
          context: this.$vnode.context,
          node,
          data,
          column
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
      }
    },
    // 表格数据
    dataSource: {
      type: Array,
      default() {
        return []
      }
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
    endFixed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [...this.dataSource],
      allChecked: false,
      rowsChecked: this.dataSource.map(item => ({
        ...item,
        checked: false
      })),
      // dropdownMenuVisible: this.columns.map(col => false)
      dropdownMenu: this.columns.map(col => ({
        visible: false,
        activeIndex: null
      })),
      tableWidth: 0,
      columnWidth: 0,
      dragger: {
        data: null,
        index: null,
        style: {},
        target: {}
      }
    }
  },
  methods: {
    /**
     * 开始拖曳
     */
    handleStartDrag(e, data, index) {
      e.preventDefault()
      let halfHeight = e.target.offsetParent.offsetHeight / 2
      let halfWidth = e.target.offsetParent.offsetWidth / 2
      let top = e.pageY - halfHeight
      let left = e.pageX - halfWidth
      let style = {
        top: `${top}px`,
        left: `${left}px`
      }
      this.dragger = {
        data,
        index,
        style,
        target: {
          halfWidth,
          halfHeight
        }
      }
    },
    /**
     * 页面 mousemove
     */
    handleDocDragging(e) {
      e.preventDefault()
      if (this.dragger.data) {
        let { halfWidth, halfHeight } = this.dragger.target
        let top = e.pageY - halfHeight
        let left = e.pageX - halfHeight
        let style = {
          top: `${top}px`,
          left: `${left}px`
        }
        this.dragger.style = style
      }
    },
    /**
     * 页面 mouseup
     */
    handleEndDocDrag(e) {
      e.preventDefault()
      this.dragger.data = null
      this.dragger.index = null
    },
    /**
     * 表格 mousemove
     */
    handleTableDragging(e) {
      e.preventDefault()
      const { data, index } = this.dragger
      if (!data) return
      let rowIndex = e.currentTarget.rowIndex
      console.log(2, rowIndex)
      if (index !== rowIndex) {
        let tableData = [...this.tableData]
        ;[tableData[index], tableData[rowIndex]] = [
          tableData[rowIndex],
          tableData[index]
        ]
        this.tableData = [...tableData]
        this.dragger.index = rowIndex
      }
    },
    /**
     * 计算列宽（减去前后固定宽度后剩余平分）
     */
    calcTableWidth() {
      const draggerWidth = 50
      const checkboxWidth = 50
      const endColumnWidth = 88
      const { draggable, selectable, endFixed, columns } = this
      let columnWidth = null
      let tableWidth = (this.$el && this.$el.offsetWidth) || 0
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
      this.columnWidth = columnWidth
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
     * @param rows{Array} 选中的数据
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
     */
    handleSelectMenu(menu, col, colIndex, menuIdx) {
      this.dropdownMenu[colIndex].activeIndex = menuIdx
      menu.fun && menu.fun(col)
    },
    /**
     * click-outside事件
     */
    handleClose() {
      // this.dropdownMenuVisible = this.columns.map(col => false)
      this.dropdownMenu = this.dropdownMenu.map(menu => {
        menu.visible = false
        return menu
      })
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
    }
  },
  mounted() {
    this.calcTableWidth()
    bindEvent(window, 'resize', this.calcTableWidth)
    bindEvent(window, 'mousemove', this.handleDocDragging)
    bindEvent(window, 'mouseup', this.handleEndDocDrag)
  },
  beforeDestroy() {
    removeEvent(window, 'resize', this.calcTableWidth)
    removeEvent(window, 'mousemove', this.handleDocDragging)
    removeEvent(window, 'mouseup', this.handleEndDocDrag)
    // this.$refs.table.removeEventListener('resize', this.calcTableWidth)
  }
}
</script>
