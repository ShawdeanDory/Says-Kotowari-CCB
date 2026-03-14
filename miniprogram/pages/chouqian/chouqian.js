// index.js
const app = getApp();

// 完整的64卦数据
// lines: 0=阴爻(dashed), 1=阳爻(solid)，顺序从初爻(底)到上爻(顶)
const HEXAGRAMS = [
  { name: '乾为天', symbol: '乾上乾下', nature: '上上签', lines: [1,1,1,1,1,1], explain: '困龙得水之象。大吉大利，充满力量，适合大展宏图。', yi: '开业, 投资, 演讲, 进取', ji: '傲慢, 独断, 冲动' },
  { name: '坤为地', symbol: '坤上坤下', nature: '上签', lines: [0,0,0,0,0,0], explain: '厚德载物之象。包容顺从，以静制动，跟随贵人有肉吃。', yi: '合作, 听从, 守成, 只有', ji: '冒进, 争领头, 强出头' },
  { name: '水雷屯', symbol: '坎上震下', nature: '下下签', lines: [1,0,0,0,1,0], explain: '万物始生之象。困难重重，如萌芽破土，需耐心等待时机。', yi: '休整, 规划, 积蓄力量', ji: '远行, 开业, 大动作' },
  { name: '山水蒙', symbol: '艮上坎下', nature: '中下签', lines: [0,1,0,0,0,1], explain: '迷蒙初开之象。时机未熟，智慧未开，切勿盲目行动。', yi: '请教, 学习, 咨询', ji: '决策, 投资, 逞强' },
  { name: '水天需', symbol: '坎上乾下', nature: '中上签', lines: [1,1,1,0,1,0], explain: '云在天上之象。时机未到，需耐心等待饮食宴乐。', yi: '等待, 聚餐, 养生', ji: '冒险, 涉水, 急进' },
  { name: '天水讼', symbol: '乾上坎下', nature: '中下签', lines: [0,1,0,1,1,1], explain: '二龙争珠之象。意见不合，易生争执，退一步海阔天空。', yi: '和解, 避让, 找中间人', ji: '打官司, 争吵, 签合同' },
  { name: '地水师', symbol: '坤上坎下', nature: '中上签', lines: [0,1,0,0,0,0], explain: '行军打仗之象。需严正法纪，选对带头人才能成功。', yi: '整顿, 管理, 听从指挥', ji: '散漫, 内斗, 优柔寡断' },
  { name: '水地比', symbol: '坎上坤下', nature: '上上签', lines: [0,0,0,0,1,0], explain: '众星拱月之象。亲密无间，朋友互助，人际关系极佳。', yi: '交友, 合作, 团建', ji: '孤僻, 背叛, 迟疑' },
  { name: '风天小畜', symbol: '巽上乾下', nature: '下签', lines: [1,1,1,0,1,1], explain: '密云不雨之象。力量有限，稍作积蓄，不宜有大动作。', yi: '储蓄, 整理, 小修小补', ji: '远行, 扩张, 借贷' },
  { name: '天泽履', symbol: '乾上兑下', nature: '中签', lines: [1,1,0,1,1,1], explain: '如履薄冰之象。虽有惊险，但小心谨慎可保平安。', yi: '请教长辈, 谨言慎行', ji: '狂妄, 越级, 粗心' },
  { name: '地天泰', symbol: '坤上乾下', nature: '上上签', lines: [1,1,1,0,0,0], explain: '三阳开泰之象。阴阳调和，事事通达，顺风顺水。', yi: '开张, 婚嫁, 沟通', ji: '闭塞, 拒绝交流' },
  { name: '天地否', symbol: '乾上坤下', nature: '下下签', lines: [0,0,0,1,1,1], explain: '虎落平阳之象。闭塞不通，小人当道，宜退守保身。', yi: '独处, 读书, 隐忍', ji: '求职, 求人, 强求' },
  { name: '天火同人', symbol: '乾上离下', nature: '上上签', lines: [1,0,1,1,1,1], explain: '仙人指路之象。志同道合，大家一起努力，必能成功。', yi: '合作, 组队, 公共事务', ji: '自私, 独占, 分裂' },
  { name: '火天大有', symbol: '离上乾下', nature: '上上签', lines: [1,1,1,1,0,1], explain: '金玉满堂之象。如日中天，收获满满，运势极旺。', yi: '收获, 庆功, 施舍', ji: '挥霍, 骄傲, 吝啬' },
  { name: '地山谦', symbol: '坤上艮下', nature: '上上签', lines: [0,0,1,0,0,0], explain: '低调做人之象。内心高山，外表平地，谦虚则吉。', yi: '谦让, 学习, 隐退', ji: '炫耀, 自满, 争功' },
  { name: '雷地豫', symbol: '震上坤下', nature: '中上签', lines: [0,0,0,1,0,0], explain: '春雷发动之象。快乐安逸，顺应时势，利于建功立业。', yi: '娱乐, 享受, 顺势而为', ji: '沉溺, 懈怠, 乐极生悲' },
  { name: '泽雷随', symbol: '兑上震下', nature: '中上签', lines: [1,0,0,1,1,0], explain: '顺水推舟之象。随时变通，跟随大势，不要固执己见。', yi: '跳槽, 改变, 随缘', ji: '固执, 死磕, 守旧' },
  { name: '山风蛊', symbol: '艮上巽下', nature: '中下签', lines: [0,1,1,0,0,1], explain: '推车靠崖之象。内部腐败，需刮骨疗毒，大力整顿。', yi: '改革, 治病, 纠错', ji: '拖延, 姑息, 视而不见' },
  { name: '地泽临', symbol: '坤上兑下', nature: '上上签', lines: [1,1,0,0,0,0], explain: '发号施令之象。时机成熟，居高临下，正好大展身手。', yi: '管理, 视察, 亲临现场', ji: '遥控, 松懈, 缺席' },
  { name: '风地观', symbol: '巽上坤下', nature: '中上签', lines: [0,0,0,0,1,1], explain: '云卷云舒之象。静观其变，多看少动，展示良好形象。', yi: '旅游, 考察, 展示', ji: '盲动, 琐碎, 不修边幅' },
  { name: '火雷噬嗑', symbol: '离上震下', nature: '中平签', lines: [1,0,0,1,0,1], explain: '咬碎硬骨之象。遇到阻碍，必须采取强硬手段清除。', yi: '执法, 惩罚, 解决难题', ji: '软弱, 逃避, 和稀泥' },
  { name: '山火贲', symbol: '艮上离下', nature: '中上签', lines: [1,0,1,0,0,1], explain: '锦上添花之象。重视外表修饰，小事吉利，大事需重实。', yi: '美容, 装修, 约会', ji: '虚荣, 只有表面, 铺张' },
  { name: '山地剥', symbol: '艮上坤下', nature: '下下签', lines: [0,0,0,0,1,0], explain: '墙倒屋塌之象。根基动摇，小人得势，宜隐忍待时。', yi: '防守, 止损, 隐蔽', ji: '投资, 露富, 出头' },
  { name: '地雷复', symbol: '坤上震下', nature: '中上签', lines: [1,0,0,0,0,0], explain: '春回大地之象。黑暗过去，生机重现，可以重新开始。', yi: '复职, 康复, 重新开张', ji: '急躁, 贪快, 半途而废' },
  { name: '天雷无妄', symbol: '乾上震下', nature: '中上签', lines: [1,0,0,1,1,1], explain: '石中蕴玉之象。顺其自然，不要有妄想，脚踏实地。', yi: '务实, 勤劳, 守本分', ji: '投机, 幻想, 意外之财' },
  { name: '山天大畜', symbol: '艮上乾下', nature: '上上签', lines: [1,1,1,0,0,1], explain: '积谷防饥之象。积蓄丰厚，既有实力又有资源，大吉。', yi: '投资, 储蓄, 养精蓄锐', ji: '挥霍, 坐吃山空' },
  { name: '山雷颐', symbol: '艮上震下', nature: '上签', lines: [1,0,0,0,0,1], explain: '龙吞猛虎之象。关注饮食言语，颐养身心，祸从口出。', yi: '吃饭, 养生, 说话谨慎', ji: '吵架, 暴饮暴食, 乱吃' },
  { name: '泽风大过', symbol: '兑上巽下', nature: '下签', lines: [0,1,1,1,1,0], explain: '独木难支之象。压力过大，负担过重，需量力而行。', yi: '减负, 独立, 非常手段', ji: '硬撑, 墨守成规' },
  { name: '坎为水', symbol: '坎上坎下', nature: '下下签', lines: [0,1,0,0,1,0], explain: '重重险阻之象。进退两难，险象环生，宜守不宜进。', yi: '修身, 习水性, 忍耐', ji: '涉险, 远行, 投资' },
  { name: '离为火', symbol: '离上离下', nature: '中上签', lines: [1,0,1,1,0,1], explain: '日附丽天之象。光明美丽，但需依附正道，切忌急躁。', yi: '文书, 美容, 依附贵人', ji: '急躁, 独行, 玩火' },
  { name: '泽山咸', symbol: '兑上艮下', nature: '上上签', lines: [0,0,1,1,1,0], explain: '心心相印之象。感应迅速，感情和睦，诸事皆通。', yi: '恋爱, 结婚, 合作', ji: '花心, 强求, 虚情' },
  { name: '雷风恒', symbol: '震上巽下', nature: '上签', lines: [0,1,1,1,0,0], explain: '细水长流之象。长久坚持，不改初衷，必有善果。', yi: '坚持, 守旧, 婚嫁', ji: '变动, 浮躁, 朝令夕改' },
  { name: '天山遁', symbol: '乾上艮下', nature: '下签', lines: [0,0,1,1,1,1], explain: '退隐山林之象。小人得势，君子退避，不宜出头。', yi: '退让, 隐居, 辞职', ji: '争官, 露面, 强出头' },
  { name: '雷天大壮', symbol: '震上乾下', nature: '中上签', lines: [1,1,1,1,0,0], explain: '气势如虹之象。壮大强盛，但不可依仗强势盲目冲动。', yi: '运动, 壮大声势', ji: '冲撞, 欺负人, 莽撞' },
  { name: '火地晋', symbol: '离上坤下', nature: '上上签', lines: [0,0,0,1,0,1], explain: '旭日东升之象。步步高升，前途光明，得到赏识。', yi: '求职, 升迁, 拜访', ji: '懈怠, 遮掩, 阻挡' },
  { name: '地火明夷', symbol: '坤上离下', nature: '下下签', lines: [1,0,1,0,0,0], explain: '日落西山之象。光明受损，才华被埋没，宜韬光养晦。', yi: '藏拙, 忍耐, 这里的黎明静悄悄', ji: '表现, 揭发, 炫耀' },
  { name: '风火家人', symbol: '巽上离下', nature: '上签', lines: [1,0,1,0,1,1], explain: '由于家庭之象。家庭和睦，内外配合，万事兴旺。', yi: '回家, 聚会, 关爱家人', ji: '外遇, 离家, 冷战' },
  { name: '火泽睽', symbol: '离上兑下', nature: '下签', lines: [1,1,0,1,0,1], explain: '背道而驰之象。人心不合，互相猜忌，小事可成大事难。', yi: '求同存异, 小事', ji: '强行合作, 大事' },
  { name: '水山蹇', symbol: '坎上艮下', nature: '下下签', lines: [0,0,1,0,1,0], explain: '高山流水之象。前有水后有山，进退两难，宜修身养德。', yi: '反省, 停止, 求助', ji: '冒进, 强行突围' },
  { name: '雷水解', symbol: '震上坎下', nature: '中上签', lines: [0,1,0,1,0,0], explain: '冰消雪融之象。困难缓解，机会出现，宜早做行动。', yi: '解决问题, 赦免, 行动', ji: '拖延, 纠结过去' },
  { name: '山泽损', symbol: '艮上兑下', nature: '中签', lines: [1,1,0,0,0,1], explain: '损下益上之象。牺牲小我，顾全大局，先失后得。', yi: '奉献, 投资, 舍得', ji: '吝啬, 计较, 占便宜' },
  { name: '风雷益', symbol: '巽上震下', nature: '上上签', lines: [1,0,0,1,1,0], explain: '枯木逢春之象。损上益下，利益增加，大胆前行。', yi: '公益, 施舍, 进取', ji: '自私, 剥削, 停滞' },
  { name: '泽天夬', symbol: '兑上乾下', nature: '中签', lines: [1,1,1,1,1,0], explain: '决堤泄洪之象。必须果断清除小人或坏习惯，不可手软。', yi: '决断, 公布, 清除', ji: '犹豫, 隐瞒, 妥协' },
  { name: '天风姤', symbol: '乾上巽下', nature: '中签', lines: [0,1,1,1,1,1], explain: '他乡遇友之象。意外相遇，但阴长阳消，小心烂桃花。', yi: '邂逅, 社交, 发布', ji: '结婚, 长久合作' },
  { name: '泽地萃', symbol: '兑上坤下', nature: '上上签', lines: [0,0,0,1,1,0], explain: '鲤登龙门之象。精英荟萃，资源聚集，利于成就大事。', yi: '聚集, 聚会, 参拜', ji: '分散, 孤立' },
  { name: '地风升', symbol: '坤上巽下', nature: '上上签', lines: [0,1,1,0,0,0], explain: '指日高升之象。如树木生长，顺势而上，积小成大。', yi: '晋升, 求学, 积攒', ji: '急躁, 拔苗助长' },
  { name: '泽水困', symbol: '兑上坎下', nature: '下签', lines: [0,1,0,1,1,0], explain: '龙游浅水之象。才智难展，处境困窘，宜坚守正道。', yi: '守信, 沉默, 忍耐', ji: '辩解, 强求, 夸大' },
  { name: '水风井', symbol: '坎上巽下', nature: '中签', lines: [0,1,1,0,1,0], explain: '枯井生泉之象。修身养性，如井水养人，互通有无。', yi: '服务, 互助, 修缮', ji: '废弃, 独占, 封闭' },
  { name: '泽火革', symbol: '兑上离下', nature: '中上签', lines: [1,0,1,1,1,0], explain: '豹变为虎之象。顺天应人，由于旧事已去，必须变革。', yi: '改革, 创新, 换装', ji: '守旧, 犹豫' },
  { name: '火风鼎', symbol: '离上巽下', nature: '上上签', lines: [0,1,1,1,0,1], explain: '三足鼎立之象。稳重图变，去故取新，易成大事。', yi: '合作, 宴请, 维新', ji: '倾覆, 不稳, 轻浮' },
  { name: '震为雷', symbol: '震上震下', nature: '中签', lines: [1,0,0,1,0,0], explain: '震惊百里之象。虽然有惊恐，但能惊醒戒备，因祸得福。', yi: '反省, 修整, 警惕', ji: '恐慌, 盲动, 丢三落四' },
  { name: '艮为山', symbol: '艮上艮下', nature: '中签', lines: [0,0,1,0,0,1], explain: '重山阻隔之象。宜止则止，安分守己，不可强行逾越。', yi: '静止, 休息, 思考', ji: '冒进, 强行, 登山' },
  { name: '风山渐', symbol: '巽上艮下', nature: '上上签', lines: [0,0,1,0,1,1], explain: '鸿雁高飞之象。循序渐进，步步为营，好事多磨。', yi: '嫁娶, 入职, 慢进', ji: '急躁, 跳级, 闪婚' },
  { name: '雷泽归妹', symbol: '震上兑下', nature: '下签', lines: [1,1,0,0,0,1], explain: '错位之象。感情用事，位置不当，长久难以如意。', yi: '安分, 回家, 听从', ji: '主动, 强求, 进取' },
  { name: '雷火丰', symbol: '震上离下', nature: '上签', lines: [1,0,1,1,0,0], explain: '日中则昃之象。丰大光明，成果丰硕，但需防盛极必衰。', yi: '成果, 交易, 光明', ji: '遮掩, 官司, 黑暗' },
  { name: '火山旅', symbol: '离上艮下', nature: '中下签', lines: [0,0,1,1,0,1], explain: '鸟焚其巢之象。羁旅在外，不安定，小事吉大事凶。', yi: '旅游, 写作, 探索', ji: '定居, 纠纷, 大事' },
  { name: '巽为风', symbol: '巽上巽下', nature: '中上签', lines: [0,1,1,0,1,1], explain: '飓风覆船之象。柔顺而入，反复申命，凡事需顺势。', yi: '顺从, 传达, 奔波', ji: '刚愎自用, 逆势' },
  { name: '兑为泽', symbol: '兑上兑下', nature: '上上签', lines: [1,1,0,1,1,0], explain: '趁水和泥之象。喜悦沟通，朋友讲习，利于和谐。', yi: '谈判, 聊天, 娱乐', ji: '争吵, 愁眉苦脸' },
  { name: '风水涣', symbol: '巽上坎下', nature: '中下签', lines: [0,1,0,0,1,1], explain: '顺水推舟之象。人心涣散，需要信仰或领袖来凝聚。', yi: '祭祀, 救灾, 聚众', ji: '分裂, 独断' },
  { name: '水泽节', symbol: '坎上兑下', nature: '中上签', lines: [1,1,0,0,1,0], explain: '船行风滩之象。适可而止，节制欲望，建立制度。', yi: '节约, 制度, 约束', ji: '放纵, 挥霍, 过度' },
  { name: '风泽中孚', symbol: '巽上兑下', nature: '上上签', lines: [1,1,0,0,1,1], explain: '鹤鸣子和之象。诚信感物，信守诺言，无往不利。', yi: '签约, 许诺, 诚实', ji: '欺诈, 背信, 虚伪' },
  { name: '雷山小过', symbol: '震上艮下', nature: '中下签', lines: [0,0,1,1,0,0], explain: '飞鸟遗音之象。稍微过分，小事可成，大事不可为。', yi: '小事, 丧葬, 下行', ji: '大事, 上行, 登高' },
  { name: '水火既济', symbol: '坎上离下', nature: '上中签', lines: [1,0,1,0,1,0], explain: '金榜题名之象。事情已成，初吉终乱，需防患未然。', yi: '庆功, 守成, 防守', ji: '开创, 扩张, 大意' },
  { name: '火水未济', symbol: '离上坎下', nature: '中签', lines: [0,1,0,1,0,1], explain: '太公钓鱼之象。阴阳失调，虽未成功，但充满新希望。', yi: '辨别, 计划, 重新开始', ji: '盲动, 结束' }
];

Page({
  data: {
    hasDrawn: false,      // 是否已抽
    isAnimating: false,   // 是否正在动画
    result: null,         // 抽签结果
    todayStr: '',         // 今日日期
    isShowTip: true       // 显示摇一摇提示
  },

  onLoad() {
    this.checkDailyStatus();
  },

  onUnload() {
    // 页面卸载时停止监听，省电
    wx.stopAccelerometer();
  },

  onHide() {
    // 页面隐藏时也停止
    wx.stopAccelerometer();
  },

  onShow() {
    // 页面回来如果没抽过，继续监听
    if (!this.data.hasDrawn) {
      this.initShake();
    }
  },

  // 1. 检查今日状态
  checkDailyStatus() {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    this.setData({ todayStr: dateStr });

    const savedData = wx.getStorageSync('DAILY_FORTUNE_64');
    
    // 如果今天已经抽过
    if (savedData && savedData.date === dateStr) {
      this.setData({
        hasDrawn: true,
        result: savedData.result,
        isShowTip: false
      });
    } else {
      // 没抽过，开启摇一摇
      this.initShake();
    }
  },

  // 2. 初始化摇一摇
  initShake() {
    // 检查是否支持
    if (!wx.onAccelerometerChange) return;

    wx.startAccelerometer({ interval: 'game' }); // game模式频率较高，灵敏

    // 监听加速度数据
    wx.onAccelerometerChange((res) => {
      // 设定阈值，超过1.5g认为是在摇动
      if (!this.data.isAnimating && !this.data.hasDrawn) {
        if (Math.abs(res.x) > 1.2 || Math.abs(res.y) > 1.2) {
          this.startDivination();
        }
      }
    });
  },

  // 3. 开始抽签（点击或摇一摇触发）
  startDivination() {
    if (this.data.hasDrawn || this.data.isAnimating) return;

    // 震动反馈
    wx.vibrateShort({ type: 'heavy' });

    // 停止监听加速度，防止重复触发
    wx.stopAccelerometer();

    this.setData({ isAnimating: true, isShowTip: false });

    // 动画持续1.5秒
    setTimeout(() => {
      this.generateResult();
    }, 1500);
  },

  // 4. 生成结果
  generateResult() {
    const randomIndex = Math.floor(Math.random() * HEXAGRAMS.length);
    const fortune = HEXAGRAMS[randomIndex];

    this.setData({
      isAnimating: false,
      hasDrawn: true,
      result: fortune
    });

    // 存入缓存
    wx.setStorageSync('DAILY_FORTUNE_64', {
      date: this.data.todayStr,
      result: fortune
    });
    
    // 结果出来后再震动一次
    wx.vibrateShort({ type: 'medium' });
  }
});