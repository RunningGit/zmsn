let APP_TYPE = '/wx'

/*--------相关接口-----------*/

//1 获取有赞邀请模板图片列表
export const GET_YZ_INVITE_IMG = APP_TYPE + '/getYzInviteImg';

// 答题卡
export const GER_ANSWER_SHEET = APP_TYPE + '/getAnswerSheet';

// 获取验证码
export const GET_VERIFY_CODE = APP_TYPE + '/getRegisterCode';

// 添加选手信息
export const USER_ADD_INFO = APP_TYPE + '/addPlayer';

// 获取选手列表
export const USER_LIST = APP_TYPE + '/getPlayerList';

// 获取赛区
export const GET_DIVISION_LIST = APP_TYPE + '/getDivisionList';

// 微信用户绑定手机号
export const POST_MOBILE_REGISTER = APP_TYPE + '/mobileRegister';

// 添加选手真实信息
export const ADD_PLAYER = APP_TYPE + '/addPlayer';

//  获取单个选手详细信息
export const GET_PLAYER = APP_TYPE + '/getPlayer';

