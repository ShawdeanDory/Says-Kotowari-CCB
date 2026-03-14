/**
 * 腾讯位置服务API请求封装
 * 路径完全按照腾讯官方文档硬编码，杜绝拼接错误
 */
export const requestTencentAPI = (apiName, params = {}) => {
  // ########## 第一步：替换为你的腾讯WebService API Key ##########
  const TENCENT_KEY = '73CBZ-CN2K3-IS73P-RNXHF-QQMIJ-DJBX5'; // 必须是WebService类型，不是小程序SDK Key

  // ########## 第二步：腾讯官方标准API路径（一字不差） ##########
  const OFFICIAL_API = {
    geocoder: 'https://apis.map.qq.com/ws/geocoder/v1/',   // 地址解析
    direction: 'https://apis.map.qq.com/ws/direction/v1/' // 路线规划
  };

  // 校验Key格式
  
  // 校验API名称是否合法
  if (!OFFICIAL_API[apiName]) {
    return Promise.reject(new Error(`不支持的API：${apiName}，仅支持 geocoder/direction`));
  }

  // 拼接参数（Key强制添加，避免遗漏）
  const requestParams = {
    key: TENCENT_KEY,
    output: 'json', // 固定返回JSON格式
    ...params
  };

  return new Promise((resolve, reject) => {
    wx.request({
      url: OFFICIAL_API[apiName], // 直接使用官方硬编码URL，无拼接
      method: 'GET',
      data: requestParams,        // 参数单独传递，不拼接在URL中
      timeout: 10000,
      success: (res) => {
        console.log('腾讯API返回：', res.data); // 调试用：查看完整返回结果
        if (res.statusCode === 200) {
          const { status, message, result } = res.data;
          if (status === 0) {
            resolve(result);
          } else {
            // 腾讯错误码精准解析
            const errMap = {
              311: 'Key格式错误（请使用WebService API Key，不是小程序SDK Key）',
              112: 'Key被禁用（腾讯控制台启用WebService API）',
              104: 'IP白名单错误（调试填0.0.0.0/0）',
              100: '参数错误（地址/坐标格式不对）',
              403: 'Key无该API权限（腾讯控制台检查权限）',
              404: 'API路径错误（请核对是否为腾讯官方URL）'
            };
            reject(new Error(errMap[status] || `[错误码${status}]${message}`));
          }
        } else {
          reject(new Error(`HTTP错误：状态码${res.statusCode}，请检查网络`));
        }
      },
      fail: (err) => {
        if (err.errMsg.includes('url not in domain list')) {
          reject(new Error('域名未配置：微信后台添加 https://apis.map.qq.com 到request合法域名'));
        } else if (err.errMsg.includes('timeout')) {
          reject(new Error('请求超时：请检查网络或腾讯API是否可用'));
        } else {
          reject(new Error(`请求失败：${err.errMsg}`));
        }
      }
    });
  });
};