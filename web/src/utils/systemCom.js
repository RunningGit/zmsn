/**
 * 列表页面公用方法
 * @author zhangpf
 * **/
export const tableBase = {
  data() {
    return {
      multipleList: []
    }
  },
  mounted() {
    // 默认携带分页参数
    this.init(this.form)
  },
  methods: {
    // 初始化
    init(params) {
      this.multipleList = []
      this.loadDataTable(params)
    },
    // 根据名称查询
    searchListByName() {
      this.form.page = 1
      this.pager.currentPage = 1
      this.init(this.form)
    },
    // 表格变化数据更新
    getTableData({ currentPage, pageSize }) {
      this.form.page = currentPage
      this.form.limit = pageSize
      this.loading = true
      this.init(this.form)
    },
    // 全选
    selectAll(isChecked, tableData) {
      this.hasCheckedAll = !this.hasCheckedAll
      if (this.hasCheckedAll) {
        this.dataTable.map(item => {
          item.checked = true
          this.multipleList.push(item)
        })
      } else {
        this.dataTable.map(item => {
          item.checked = false
          this.multipleList = []
        })
      }
    },
    // 单个选择
    handleSelectionChange(val) {
      val.checked = !val.checked
      this.multipleList = []
      var checkedItem = []
      // 判读复选框是否已被选中
      if (val.checked) {
        this.dataTable.map(item => {
          if (item.checked) checkedItem.push(item.checked)
        })
        this.hasCheckedAll = checkedItem.length === this.dataTable.length
      } else {
        this.hasCheckedAll = false
      }
      // 循环所有的复选框，将被选中的复选框放入到一个集合中
      this.dataTable.map(item => {
        if (item.checked) this.multipleList.push(item)
      })
    },
    // 单个删除
    del(id, name) {
      let arr = [id]
      this.$confirm(`是否删除"${name}"?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delData(arr)
        })
        .catch(() => {})
    },
    // 批量删除, 可能后台主键不是id，需要传递过来
    delAll(name, id = 'id') {
      if (this.multipleList.length === 0) {
        this.$ego.alertMsg(`请选择至少一个${name}`, 'warning', 1000)
      } else {
        let arr = []
        // 对所选的数据进行去重
        Array.from(new Set(this.multipleList), item => {
          arr.push(item[id])
        })
        this.$confirm(`是否删除所选${name}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.delData(arr)
          })
          .catch(() => {})
      }
    },
    // 单个执行(定时任务)
    runThis(id) {
      let arr = [id]
      this.dataFunction(arr, 'run')
    },
    // 批量执行(定时任务)
    runAll(name, id = 'id') {
      if (this.multipleList.length === 0) {
        this.$ego.alertMsg(`请选择至少一个${name}`, 'warning', 1000)
      } else {
        let arr = []
        // 对所选的数据进行去重
        Array.from(new Set(this.multipleList), item => {
          arr.push(item[id])
        })
        this.$confirm(`是否执行所选${name}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.dataFunction(arr, 'run')
          })
          .catch(() => {})
      }
    },
    // 单个暂停(定时任务)
    stopThis(id) {
      let arr = [id]
      this.dataFunction(arr, 'stop')
    },
    // 批量暂停(定时任务)
    stopAll(name, id = 'id') {
      if (this.multipleList.length === 0) {
        this.$ego.alertMsg(`请选择至少一个${name}`, 'warning', 1000)
      } else {
        let arr = []
        // 对所选的数据进行去重
        Array.from(new Set(this.multipleList), item => {
          arr.push(item[id])
        })
        this.$confirm(`是否暂停所选${name}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.dataFunction(arr, 'stop')
          })
          .catch(() => {})
      }
    },
    // 单个恢复(定时任务)
    resumeThis(id) {
      let arr = [id]
      this.dataFunction(arr, 'resume')
    },
    // 批量恢复(定时任务)
    resumeAll(name, id = 'id') {
      if (this.multipleList.length === 0) {
        this.$ego.alertMsg(`请选择至少一个${name}`, 'warning', 1000)
      } else {
        let arr = []
        // 对所选的数据进行去重
        Array.from(new Set(this.multipleList), item => {
          arr.push(item[id])
        })
        this.$confirm(`是否恢复所选${name}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.dataFunction(arr, 'resume')
          })
          .catch(() => {})
      }
    },
    // 分页页面个数
    handleSizeChange(val) {
      this.multipleList = [] // 翻页时将全选的数组置空
      this.pager.pageSize = val.pageSize
      this.pager.currentPage = val.currentPage
      this.form.limit = val.pageSize
      this.form.page = val.currentPage
      this.init(this.form)
    },
    // 分页翻页
    handleCurrentChange(val) {
      this.pager.currentPage = val
      this.form.page = val
      this.form.limit = this.pager.pageSize
      this.init(this.form)
    }
  }
}
