export const getIndexConifg = {
  id: 1,
  title: '寻找最美活动系列寻找最美活动系列寻找最美活动系列',
  noticeOn: true,
  noticeContent: 'noticeContent',
  link: 'https://www.baidu.com',
  noticeTextColor: 'red',
  photoUrl: 'http://img4.imgtn.bdimg.com/it/u=2915669764,4139817696&fm=214&gp=0.jpg',
  buttonColor: 'red',
  buttonText: 'buttonText',
  buttonTextColor: 'white'
}

export const getActivityConfig = {
  list: [{
    id: 1,
    title: '寻找最美活动系列寻找最美',
    activityCover: 'http://img4.imgtn.bdimg.com/it/u=2915669764,4139817696&fm=214&gp=0.jpg',
    buttonColor: 'red',
    buttonText: 'buttonText',
    buttonTextColor: 'white',
    endDate: new Date()
  }, {
    id: 2,
    title: '寻找最美活动系列寻找最美活动系列寻找最美活动系列',
    activityCover: 'http://img4.imgtn.bdimg.com/it/u=2915669764,4139817696&fm=214&gp=0.jpg',
    buttonColor: 'white',
    buttonText: 'buttonText',
    buttonTextColor: 'black',
    endDate: new Date()
  }]
}

export const getActivityList = {
  currPage: 1,
  pageSize: 10,
  totalCount: 10,
  totalPage: 1,
  list: [{
    activityName: '第五届寻找“最美南粤少年”活动',
    activityType: 0,
    create_time: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    status: 1,
    id: 1
  }, {
    activityName: '第五届寻找“最美南粤少年”活动',
    activityType: 1,
    create_time: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    status: 1,
    id: 2
  }]
}

export const getActivityGroup = {
  list: [{
    id: 1,
    templateName: '分组1'
  }]
}
