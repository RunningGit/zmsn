const map = {
  name: {
    label: '姓名',
    placeholder: '请输入',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  idCardType: {
    label: '身份证类型',
    placeholder: '请选择',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  idCard: {
    label: '身份证号码',
    placeholder: '请输入',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  sex: {
    label: '性别',
    placeholder: '请选择',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  birthday: {
    label: '出生年月日',
    placeholder: '请选择',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  type: {
    label: '类型',
    placeholder: '请选择',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  nation: {
    label: '民族',
    placeholder: '请选择',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  phone: {
    label: '联系电话',
    placeholder: '请输入',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  parentPhone: {
    label: '家长联系电话',
    placeholder: '请输入',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  parentName: {
    label: '家长姓名',
    placeholder: '请输入',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  city: {
    label: '所在城市',
    placeholder: '请选择',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  school: {
    label: '就读学校',
    placeholder: '请选择',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  joinTime: {
    label: '入团时间',
    placeholder: '请选择',
    type: 'date',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  voluteeTime: {
    label: '成为注册志愿者年月',
    placeholder: '请选择',
    type: 'date',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  unit: {
    label: '所在团支部/中队/班级 ',
    placeholder: '请输入',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  honor: {
    label: '申报荣誉类别',
    placeholder: '请选择',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  level: {
    label: '近三年获取荣誉级别 ',
    placeholder: '请选择',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  levelName: {
    label: '近三年获取荣誉名称 ',
    placeholder: '请输入',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  comment: {
    label: '2018年度团员教育评议等次 ',
    placeholder: '请输入',
    type: 'textarea',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  resume: {
    label: '学习和工作简历 ',
    placeholder: '从小学填起，包括出国留学、进修等经历',
    type: 'textarea',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  situation: {
    label: '学参加三会两制一课情况',
    placeholder: '请输入',
    type: 'textarea',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  photo: {
    label: '照片',
    placeholder: '请上传一寸证件照',
    type: 'upload',
    isRequire: true,
    rules: {
      require: true,
    }
  },
  honorPhoto: {
    label: '',
    placeholder: '上传荣誉证书（最多10张）',
    type: 'upload',
    isRequire: false,
    rules: {
      require: true,
    }
  }
}

const conbineMap = obj => {
  const m = {};
  Object.keys(obj).forEach(item => {
    m[item] = {
      ...obj[item],
      key: item
    }
  })
  return m
}

export default conbineMap(map)