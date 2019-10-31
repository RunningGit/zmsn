<template>
  <div class="dy-table">
    <div class="dy-table-wrapper"
      v-dyloading="{isLoading: loading, title: '数据加载中...'}">
      <div class="dy-table-header">
        <table :class="{'dy-table-fixed': scrollY}">
          <colgroup v-if="scrollY">
            <col v-if="selectable"
              width="50" />
            <col v-for="col in columns"
              :key="col.dataIndex"
              :width="col.width || 'auto'" />
          </colgroup>
          <thead>
            <tr v-clickoutside="handleClose">
              <th v-if="selectable"
                width="50"
                align="left">
                <dy-checkbox v-model="allChecked"
                  :disabled="!dataSource.length"
                  @change="handleCheckAll" />
              </th>
              <th v-for="(col, colIndex) in columns"
                :key="col.dataIndex"
                :width="col.width || 'auto'"
                :align="col.align || 'left'">
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
            <tr v-if="dataSource && dataSource.length < 1">
              <td :colspan="selectable ? columns.length + 1 : columns.length"
                class="dy-table-empty">
                暂无数据
              </td>
            </tr>
            <tr v-for="(item, idx) in dataSource"
              :key="idx"
              :class="{'dy-selected': rowsChecked[idx].checked}">
              <td v-if="selectable"
                width="50"
                align="left">
                <dy-checkbox v-model="rowsChecked[idx].checked"
                  @change="handleCheckList(idx)" />
              </td>
              <td v-for="(col, i) in columns"
                :key="col.dataIndex"
                :width="col.width || 'auto'"
                :align="col.align || 'left'"
                :title="col.formatter ? col.formatter(item[col.dataIndex]) : item[col.dataIndex]">
                <render-node v-if="typeof col.render === 'function'"
                  :render-content="col.render"
                  :node="{data: item, column: col, rowIndex: idx, colIndex: i}"
                  :key="i" />
                <div v-else
                  :class="{'dy-ellipsis': col.ellipsis}">
                  <slot name="body"
                    :column="col"
                    :data="item"
                    :rowIndex="idx"
                    :colIndex="i">
                    {{col.formatter ? col.formatter(item[col.dataIndex]) : item[col.dataIndex]}}
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
            <col v-if="selectable"
              width="50" />
            <col v-for="col in columns"
              :key="col.dataIndex"
              :width="col.width || 'auto'" />
          </colgroup>
          <tbody>
            <tr v-if="dataSource && dataSource.length <= 0">
              <td :colspan="selectable ? columns.length + 1 : columns.length"
                class="dy-table-empty">
                暂无数据
              </td>
            </tr>
            <tr v-for="(item, idx) in dataSource"
              :key="idx"
              :class="{'dy-selected': rowsChecked[idx].checked}">
              <td v-if="selectable"
                width="50"
                align="left">
                <dy-checkbox v-model="rowsChecked[idx].checked"
                  @change="handleCheckList(idx)" />
              </td>
              <td v-for="(col, i) in columns"
                :key="col.dataIndex"
                :class="{'dy-ellipsis': col.ellipsis}"
                :width="col.width || 'auto'"
                :align="col.align || 'left'"
                :title="col.formatter ? col.formatter(item[col.dataIndex]) : item[col.dataIndex]">
                <render-node v-if="typeof col.render === 'function'"
                  :render-content="col.render"
                  :node="{data: item, column: col, rowIndex: idx, colIndex: i}"
                  :key="i" />
                <slot v-else
                  name="body"
                  :column="col"
                  :data="item"
                  :rowIndex="idx"
                  :colIndex="i">
                  {{col.formatter ? col.formatter(item[col.dataIndex]) : item[col.dataIndex]}}
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
      <dy-pagination v-if="dataSource.length > 0 && pagination"
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
    }
  },
  data() {
    return {
      //   tableData: [...this.dataSource],
      allChecked: false,
      rowsChecked: this.dataSource.map(item => ({
        ...item,
        checked: false
      })),
      // dropdownMenuVisible: this.columns.map(col => false)
      dropdownMenu: this.columns.map(col => ({
        visible: false,
        activeIndex: null
      }))
    }
  },
  methods: {
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
      // const visible = this.dropdownMenuVisible[idx]
      // this.dropdownMenuVisible = this.columns.map(col => false)
      // if (this.columns[idx].dropdownMenu && !visible) {
      //   this.dropdownMenuVisible.splice(idx, 1, !visible)
      // }
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
      this.allChecked = false
      this.rowsChecked = newDataSource.map(item => ({
        ...item,
        checked: false
      }))
    }
  }
}
</script>
