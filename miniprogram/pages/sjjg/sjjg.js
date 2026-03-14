// let coors;
// // 引入SDK核心类
let QQMapWX = require('../utils/qqmap-wx-jssdk.min');

// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: '73CBZ-CN2K3-IS73P-RNXHF-QQMIJ-DJBX5'
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openNav: true,
    showBuildingPicker: false,
    buildings: [
      {name: '我的位置', lat: 0, lng: 0, isMyLocation: true},
      {name: '图书馆', lat: 31.31647711773884, lng:121.39232987720413 },
      {name: '教学楼A楼', lat: 31.313350222799865, lng: 121.39546720452415},
      {name: '教学楼B楼', lat: 31.313801204689483, lng: 121.39504989440661},
      {name: '教学楼C楼', lat: 31.31423053693607, lng: 121.39471955923432},
      {name: '教学楼D楼', lat: 31.31467753625267, lng: 121.39438137711977},
      {name: '教学楼J楼', lat: 31.315564231025824, lng: 121.39401420989861},
      {name: '教学楼E楼', lat: 31.3158126103853, lng: 121.3943652698548},
      {name: '教学楼F楼', lat: 31.31635547674291, lng: 121.39391959783234},
      {name: '教学楼G楼', lat: 31.316781358300837, lng: 121.39351268165808},
      {name: '教学楼AJ楼', lat: 31.31376725622319, lng: 121.39639476087018},
      {name: '教学楼BJ楼', lat: 31.31418088948825, lng: 121.3960489325018},
      {name: '教学楼CJ楼', lat: 31.314635145377473, lng: 121.39575497833823},
      {name: '教学楼DJ楼', lat: 31.31507831976423, lng: 121.39543508703059},
      {name: '教学楼EJ楼', lat: 31.31604391025143, lng: 121.39479144691995},
      {name: '教学楼FJ楼', lat: 31.316509236285338, lng: 121.39443264992201},
      {name: '教学楼GJ楼', lat: 31.316930243582, lng: 121.39409979001789},
      {name: '行政楼', lat: 31.31346943853311, lng: 121.39705152331896},
      {name: '上海大学基础化学实验中心(HA楼)', lat: 31.31655992181008, lng: 121.39658292109345},
      {name: 'HB楼', lat: 31.316283284114366, lng: 121.39660866807128},
      {name: 'HC楼', lat: 31.315642222918925, lng: 121.39672282463414},
      {name: '工程技术训练中心（HD楼）', lat: 31.315688160354036, lng: 121.39607931382216},
      {name: '力学与工程科学学院（HE楼）', lat: 31.315096222346938, lng: 121.39652438505652},
      {name: '钱伟长学院', lat: 31.315096222346938, lng: 121.39652438505652},
      {name: '校史馆（旧）', lat: 31.312909176161803, lng: 121.39719760843491},
      {name: '溯圆', lat: 31.312360397712364, lng: 121.39685210803657},
      {name: '益新食堂（一食堂）', lat: 31.316232374151646, lng: 121.38917143528852},
      {name: '招待餐厅', lat: 31.316232374151646, lng: 121.38917143528852},
      {name: '尔美食堂（二食堂）', lat: 31.319240948456706, lng: 121.39134498972385},
      {name: '西餐厅', lat: 31.319240948456706, lng: 121.39134498972385},
      {name: '山明食堂（三食堂）', lat: 31.31776871827142, lng: 121.38884524437776},
      {name: '水秀食堂（四食堂）', lat: 31.316257982549136, lng: 121.39566249324753},
      {name: '吾馨食堂（五食堂）', lat: 31.310785179798803, lng: 121.38927669200552},
      {name: '留韵食堂（六食堂）', lat: 31.314894360224176, lng: 121.39852523912214},
      {name: '高水平科技大楼', lat: 31.317138233406983, lng: 121.39571903261913},
      {name: '伟长楼', lat: 31.318094535068944, lng: 121.39547256677622},
      {name: '美术学院', lat: 31.31263116470961, lng: 121.39386269644683},
      {name: '泮池', lat: 31.31429402837642, lng: 121.39211263348022},
      {name: '停车场', lat: 31.312202770961026, lng: 121.38901698312691},
      {name: '后勤基建大楼', lat: 31.31242591014489, lng: 121.38904411878286},
      {name: '高尔夫球场', lat: 31.31274844067907, lng: 121.38861956294909},
      {name: '足球场', lat: 31.31319895426313, lng: 121.38894921342614},
      {name: '篮球场（靠近西南门）', lat: 31.313056380399438, lng: 121.38899287124116},
      {name: '篮球场（靠近西门）', lat: 31.315207550793794, lng: 121.3884713229155},
      {name: '篮球场（靠近北门）', lat: 31.317599207489216, lng: 121.38794356121127},
      {name: '西门教育超市', lat: 31.315831604101135, lng: 121.3880518233683},
      {name: '校内1号楼', lat: 31.31539604789643, lng: 121.38906401376698},
      {name: '校内2号楼', lat: 31.31497598277299, lng: 121.38922359878882},
      {name: '校内3号楼', lat: 31.314600133421504, lng: 121.38955139522773},
      {name: '校内4号楼', lat: 31.315042309000834, lng: 121.39028462411659},
      {name: '校内5号楼', lat: 31.314651720670362, lng: 121.39033638146475},
      {name: '学生公寓北区', lat: 31.31559612361829, lng: 121.3902213909048},
      {name: '菜鸟驿站', lat: 31.316315758405498, lng: 121.38771126104973},
      {name: '校内浴室', lat: 31.31616616855369, lng: 121.3885760085808},
      {name: '玄陵网球馆', lat: 31.319074786698202, lng: 121.3882848928605},
      {name: '上海大学出版大楼', lat: 31.319820958429197, lng: 121.38771633896022},
      {name: '校医院', lat: 31.32006567244296, lng: 121.38866596393927},
      {name: '乐乎新楼', lat: 31.32032714757141, lng: 121.39065434334498},
      {name: '可持续能源研究院', lat: 31.320503821122035, lng: 121.39413828703528},
      {name: '复合材料研究中心', lat: 31.320512827273568, lng: 121.39466541060233},
      {name: '档案馆', lat: 31.317189968061246, lng: 121.39167575937563},
      {name: '音乐学院', lat: 31.31837481358191, lng: 121.39406240158189},
      {name: '1号体育场', lat: 31.319770543101587, lng: 121.39582404098894},
      {name: '体育馆', lat: 31.31948371916784, lng: 121.39535707677078},
      {name: '游泳馆', lat: 31.319403122926037, lng: 121.3940580360561},
      {name: '塑胶运动场', lat: 31.319768788288275, lng: 121.39274335342827},
      {name: '风雨操场', lat: 31.31979068695637, lng: 121.39255878817926},
      {name: 'M楼', lat: 31.316156528434227, lng: 121.39002635559041},
      {name: 'N楼', lat: 31.31652872240017, lng: 121.390167109181},
      {name: 'P楼', lat: 31.316806435432312, lng: 121.39026094492942},
      {name: 'Q楼', lat: 31.317118503753107, lng: 121.39027099876137},
      {name: 'R楼', lat: 31.317430571012107, lng: 121.3900732734794},
      {name: 'O楼', lat: 31.31808619523153, lng: 121.38977836120785},
      {name: 'I楼', lat: 31.31780276000832, lng: 121.38994927628028},
      {name: 'K楼', lat: 31.318492737163165, lng: 121.38964766148774},
      {name: 'L楼', lat: 31.318790485084495, lng: 121.38936615428634},
      {name: 'V楼', lat: 31.318103371615134, lng: 121.38870727889844},
      {name: 'X楼', lat: 31.31812254681113, lng: 121.39100078545403},
      {name: 'Y楼', lat: 31.31844033668474, lng: 121.39100748800001},
      {name: 'Z楼', lat: 31.318858328949858, lng: 121.39067571167743},
      {name: 'U楼', lat: 31.31837257095148, lng: 121.39183813096179},
      {name: '德馨公寓', lat: 31.31864455261646, lng: 121.3919353178876},
      {name: '南区1号楼', lat: 31.30823574759404, lng: 121.38956498519451},
      {name: '南区2号楼', lat: 31.30828389821148, lng: 121.38876272501886},
      {name: '南区3号楼', lat: 31.30860639451666, lng: 121.38949297803163},
      {name: '南区4号楼', lat: 31.308640258927586, lng: 121.38875039007178},
      {name: '南区5号楼', lat: 31.308977311295326, lng: 121.38961873892379},
      {name: '南区6号楼', lat: 31.30892349627205, lng: 121.3887733821208},
      {name: '南区7号楼', lat: 31.309368177176136, lng: 121.38947618868326},
      {name: '南区8号楼', lat: 31.309305865305078, lng: 121.38875349142882},
      {name: '南区9号楼', lat: 31.30975620913652, lng: 121.38941983158293},
      {name: '南区10号楼', lat: 31.309693897538683, lng: 121.38864740750842},
      {name: '南区11号楼', lat: 31.310213599273663, lng: 121.38939832113874},
      {name: '南区12号楼', lat: 31.310392035944908, lng: 121.38845682576164},
      {name: '南区14号楼', lat: 31.31079540536103, lng: 121.38854633411756},
      {name: '青年教师宿舍', lat: 31.321267318375924, lng: 121.40027830001418},
      {name: '博士后公寓', lat: 31.321075791969147, lng: 121.40043993231075},
      {name: '专家公寓', lat: 31.32085755835789, lng: 121.3982842733983},
      {name: '高温合金叶片技术研究中心', lat: 31.320039020301774, lng: 121.39848905781753},
      {name: '转化医学研究院', lat: 31.319847727983895, lng: 121.39924055847064},
      {name: '生命科学学院', lat: 31.320006164322958, lng: 121.39989926931298},
      {name: '生物医工实验大楼', lat: 31.31898589836817, lng: 121.39835473462585},
      {name: '环境与化学工程学院', lat: 31.319231318376932, lng: 121.39940305823211},
      {name: '环化楼', lat: 31.319278680034884, lng: 121.39993730011793},
      {name: '东区', lat: 31.31841296231475, lng: 121.39886377652306},
      {name: '永福庵', lat: 31.31756905203898, lng: 121.39807753383297},
      {name: '材料科学与工程学院-A楼', lat: 31.31830859727513, lng: 121.3995276486371},
      {name: '材料科学与工程学院-B楼', lat: 31.317916782376265, lng: 121.39987036975799},
      {name: '计算机工程与科学学院', lat: 31.31738287802399, lng: 121.39977964941704},
      {name: '翔英大楼（东区14号楼）', lat: 31.31738287802399, lng: 121.39977964941704},
      {name: '先进凝固技术中心（东区13号楼）', lat: 31.316977704479342, lng: 121.39863685717319},
      {name: '通信与信息工程学院（东区12号楼）', lat: 31.316482459745227, lng: 121.39863285834849},
      {name: '泮溪书店', lat: 31.315970076039534, lng: 121.39925782051796},
      {name: '土木工程楼（东区11号楼）', lat: 31.31601743937056, lng: 121.39865805849809},
      {name: '通用实验楼（东区10号楼）', lat: 31.31549213581706, lng: 121.39851693803212},
      {name: '机电工程与自动化学院（东区9号楼）', lat: 31.31650829414283, lng: 121.39950982131757},
      {name: '日新楼（东区8号楼）', lat: 31.31541058426294, lng: 121.40010436920056},
      {name: '材料基因组工程研究院大楼（东区7号楼）', lat: 31.314997062929894, lng: 121.39974807900353},
      {name: '中欧工程技术学院（东区6号楼）', lat: 31.314768855153456, lng: 121.40033272093785},
      {name: '钱伟长图书馆', lat: 31.314290908859633, lng: 121.39953135828216},
      {name: '文学院（东区5号楼）', lat: 31.31435980227077, lng: 121.40040865725769},
      {name: '法学院（东区4号楼）', lat: 31.31397227669858, lng: 121.40053465769631},
      {name: '研究院大楼（东区3号楼）', lat: 31.313653740646025, lng: 121.3987102285023},
      {name: '马克思主义学院（东区2号楼）', lat: 31.313638254012375, lng: 121.39962653734051},
      {name: '经济学院&管理学院（经管大楼）', lat: 31.313274823952746, lng: 121.39904790966875},
      {name: '西南门', lat: 31.311390996953808, lng: 121.38934782715296},
      {name: '南门', lat: 31.31195427288134, lng: 121.39586144891518},
      {name: '东门', lat: 31.318349473096184, lng: 121.39715403125581},
      {name: '北2门', lat: 31.320928873183416, lng: 121.39431655152657},
      {name: '西北1门', lat: 31.32071083263201, lng: 121.39067446217405},
      {name: '北门', lat: 31.320263450439295, lng: 121.38917652831594},
      {name: '西门', lat: 31.31565249713695, lng: 121.38765714737644},
    ],
    startBuilding: '',
    endBuilding: '',
    startBuildingIndex: 0,
    endBuildingIndex: 0,
    selectingStart: true,
    resultDistance: '请先选择起点和终点',
    walkingTime: '',
    cyclingTime: '',
    searchText: '',
    filteredBuildings: [],
    pickerHeight: '80vh',
    pickerScrollTop: 0,
    showScrollHint: true,
    myLocation: {
      lat: 0,
      lng: 0,
      name: '我的位置'
    },
    // 导航相关数据
    isNavigating: false,
    traveledPath: [], // 已走过的路径（灰色直线）
    remainingPath: [], // 剩余路径（从当前位置到终点）
    locationUpdateInterval: null,
    currentLocation: {
      lat: 0,
      lng: 0
    },
    previousLocation: { // 新增：上一秒的位置
      lat: 0,
      lng: 0
    },
    destination: {
      lat: 0,
      lng: 0
    },
    searchTimer: null,
    navigationStartTime: null,
    // 新增：存储完整的原始路径，用于重新规划
    originalPath: [],
    // 新增：是否显示预览路径
    showPreviewPath: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _page = this;

    // 设置默认坐标为上海大学宝山校区中心
    _page.setData({
      latitude: 31.315826693526557,
      longitude: 121.39345223345799,
      scale: 15,
      filteredBuildings: this.data.buildings
    });

    // 获取用户当前位置
    this.getMyLocation();

    wx.clearStorageSync('latlngstart');
    wx.clearStorageSync('latlngend');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.stopNavigation();
  },

  /**
   * 获取我的位置
   */
  getMyLocation: function() {
    let _page = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        console.log('获取到当前位置:', res);
        _page.setData({
          myLocation: {
            lat: res.latitude,
            lng: res.longitude,
            name: '我的位置'
          },
          currentLocation: {
            lat: res.latitude,
            lng: res.longitude
          },
          previousLocation: { // 初始化上一秒位置
            lat: res.latitude,
            lng: res.longitude
          },
          'buildings[0].lat': res.latitude,
          'buildings[0].lng': res.longitude
        });
      },
      fail: function(res) {
        console.error('获取位置失败:', res);
        wx.showToast({
          title: '获取位置失败，请检查权限',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 选择起点
   */
  chooseStart: function() {
    this.setData({
      showBuildingPicker: true,
      selectingStart: true,
      currentPickerIndex: this.data.startBuildingIndex,
      searchText: '',
      filteredBuildings: this.data.buildings,
      pickerScrollTop: 0,
      showScrollHint: true
    });
  },

  /**
   * 选择终点
   */
  chooseEnd: function() {
    this.setData({
      showBuildingPicker: true,
      selectingStart: false,
      currentPickerIndex: this.data.endBuildingIndex,
      searchText: '',
      filteredBuildings: this.data.buildings,
      pickerScrollTop: 0,
      showScrollHint: true
    });
  },

  /**
   * 搜索输入
   */
  onSearchInput: function(e) {
    const searchText = e.detail.value;
    this.setData({
      searchText: searchText
    });
    
    // 防抖搜索
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.filterBuildings(searchText);
    }, 300);
  },

  /**
   * 过滤建筑列表
   */
  filterBuildings: function(searchText) {
    if (searchText) {
      const filtered = this.data.buildings.filter(building => 
        building.name.includes(searchText)
      );
      this.setData({
        filteredBuildings: filtered
      });
    } else {
      this.setData({
        filteredBuildings: this.data.buildings
      });
    }
  },

  /**
   * 清除搜索
   */
  clearSearch: function() {
    this.setData({
      searchText: '',
      filteredBuildings: this.data.buildings
    });
  },

  /**
   * 选择建筑
   */
  selectBuilding: function(e) {
    const index = e.currentTarget.dataset.index;
    const building = this.data.filteredBuildings[index];
    
    // 获取选择地点的经纬度
    let selectedLat, selectedLng;
    if (building.isMyLocation) {
      selectedLat = this.data.myLocation.lat;
      selectedLng = this.data.myLocation.lng;
    } else {
      selectedLat = building.lat;
      selectedLng = building.lng;
    }
    
    // 如果是我的位置，使用实时位置
    if (building.isMyLocation) {
      if (this.data.selectingStart) {
        this.setData({
          startBuilding: building.name
        });
        wx.setStorageSync('latlngstart', {
          lat: this.data.myLocation.lat,
          lng: this.data.myLocation.lng
        });
      } else {
        this.setData({
          endBuilding: building.name
        });
        wx.setStorageSync('latlngend', {
          lat: this.data.myLocation.lat,
          lng: this.data.myLocation.lng
        });
      }
    } else {
      // 普通建筑选择
      if (this.data.selectingStart) {
        this.setData({
          startBuilding: building.name,
          startBuildingIndex: index
        });
        wx.setStorageSync('latlngstart', {
          lat: building.lat,
          lng: building.lng
        });
      } else {
        this.setData({
          endBuilding: building.name,
          endBuildingIndex: index
        });
        wx.setStorageSync('latlngend', {
          lat: building.lat,
          lng: building.lng
        });
      }
    }
    
    this.closeBuildingPicker();
    
    // 立即将地图中心移动到选择的地点
    this.setData({
      latitude: selectedLat,
      longitude: selectedLng,
      scale: 16
    });
    
    // 检查是否两个地点都已选择
    if (this.data.startBuilding && this.data.endBuilding) {
      this.setData({
        openNav: false
      });
      // 立即规划路径并显示
      this.planPreviewRoute();
    }
  },

  /**
   * 关闭建筑选择器
   */
  closeBuildingPicker: function() {
    this.setData({
      showBuildingPicker: false,
      searchText: '',
      filteredBuildings: this.data.buildings,
      showScrollHint: true
    });
  },

  /**
   * 滚动事件
   */
  onPickerScroll: function(e) {
    const scrollTop = e.detail.scrollTop;
    if (scrollTop > 50) {
      this.setData({
        showScrollHint: false
      });
    }
  },

  /**
   * 清除起点
   */
  clearStart: function() {
    this.stopNavigation();
    this.setData({
      startBuilding: '',
      startBuildingIndex: 0,
      openNav: true,
      resultDistance: '请先选择起点和终点',
      walkingTime: '',
      cyclingTime: '',
      isNavigating: false,
      traveledPath: [],
      remainingPath: [],
      originalPath: [],
      showPreviewPath: false
    });
    wx.removeStorageSync('latlngstart');
    this.clearMap();
  },

  /**
   * 清除终点
   */
  clearEnd: function() {
    this.stopNavigation();
    this.setData({
      endBuilding: '',
      endBuildingIndex: 0,
      openNav: true,
      resultDistance: '请先选择起点和终点',
      walkingTime: '',
      cyclingTime: '',
      isNavigating: false,
      traveledPath: [],
      remainingPath: [],
      originalPath: [],
      showPreviewPath: false
    });
    wx.removeStorageSync('latlngend');
    this.clearMap();
  },

  /**
   * 清除地图路线和标记
   */
  clearMap: function() {
    this.setData({
      polyline: [],
      markers: []
    });
  },

  /**
   * 规划预览路径（选择完起点终点后立即显示）
   */
  planPreviewRoute: function() {
    let _page = this;

    // 起点经纬度
    let startData = wx.getStorageSync('latlngstart');
    let endData = wx.getStorageSync('latlngend');
    
    if (!startData || !endData) {
      return;
    }

    let latStart = startData.lat;
    let lngStart = startData.lng;
    let latEnd = endData.lat;
    let lngEnd = endData.lng;

    // 设置目的地
    this.setData({
      destination: {
        lat: latEnd,
        lng: lngEnd
      }
    });

    // 设置地图中心点为起点和终点的中间点
    let centerLat = (latStart + latEnd) / 2;
    let centerLng = (lngStart + lngEnd) / 2;

    _page.setData({
      latitude: centerLat,
      longitude: centerLng,
      scale: 15,
      markers: [{
        id: 0,
        latitude: latStart,
        longitude: lngStart,
        iconPath: '/image/location.png',
        title: _page.data.startBuilding,
        width: 30,
        height: 30,
        callout: {
          content: '起点：' + _page.data.startBuilding,
          color: '#000',
          fontSize: 14,
          borderRadius: 5,
          bgColor: '#fff',
          padding: 5,
          display: 'ALWAYS'
        }
      },
      {
        id: 1,
        latitude: latEnd,
        longitude: lngEnd,
        iconPath: '/image/location.png',
        title: _page.data.endBuilding,
        width: 30,
        height: 30,
        callout: {
          content: '终点：' + _page.data.endBuilding,
          color: '#000',
          fontSize: 14,
          borderRadius: 5,
          bgColor: '#fff',
          padding: 5,
          display: 'ALWAYS'
        }
      }]
    });

    // 规划步行路线
    this.planWalkingRouteForPreview(latStart, lngStart, latEnd, lngEnd);
  },

  /**
   * 规划步行路线（预览用）
   */
  planWalkingRouteForPreview: function(latStart, lngStart, latEnd, lngEnd) {
    let _page = this;
    
    console.log('开始规划预览路径');

    let opt = {
      url: `https://apis.map.qq.com/ws/direction/v1/walking/?from=${latStart},${lngStart}&to=${latEnd},${lngEnd}&key=${qqmapsdk.key}`,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log('预览路径规划API返回:', res);
        let ret = res.data;
        if (ret.status === 0 && ret.result && ret.result.routes && ret.result.routes.length > 0) {
          let coors = ret.result.routes[0].polyline;
          let pl = [];
          
          console.log('原始polyline数据:', coors);
          
          // 坐标解压
          let kr = 1000000;
          for (let i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          
          // 将解压后的坐标放入点串数组
          for (let i = 0; i < coors.length; i += 2) {
            pl.push({
              latitude: coors[i],
              longitude: coors[i + 1]
            });
          }
          
          console.log('解压后的路径点数量:', pl.length);
          
          // 存储完整的原始路径
          _page.setData({
            originalPath: pl,
            showPreviewPath: true
          });
          
          // 显示预览路径（蓝色虚线）
          _page.setData({
            polyline: [{
              points: pl,
              color: '#1890FF',
              width: 6,
              dottedLine: true,
              arrowLine: false
            }]
          });
          
          // 更新距离显示
          if (ret.result.routes[0].distance) {
            let distance = ret.result.routes[0].distance;
            let displayDistance = distance >= 1000 ? 
              (distance / 1000).toFixed(2) + '公里' : 
              Math.round(distance) + '米';
            _page.setData({
              resultDistance: displayDistance
            });
            
            // 计算旅行时间
            _page.calculateActualTravelTime(distance);
          }
          
          wx.showToast({
            title: '路径规划完成',
            icon: 'success',
            duration: 1000
          });
          
        } else {
          console.error('预览路径规划失败:', ret);
          _page.handleError('路线规划失败', () => {
            _page.drawStraightLine(latStart, lngStart, latEnd, lngEnd);
          });
        }
      },
      fail: function (res) {
        console.error('预览路径规划请求失败:', res);
        _page.handleError('网络请求失败', () => {
          _page.drawStraightLine(latStart, lngStart, latEnd, lngEnd);
        });
      }
    };
    
    wx.request(opt);
  },

  /**
   * 开始导航
   */
  driving: function () {
    let _page = this;

    // 检查是否已选择起点和终点
    if (!this.data.startBuilding || !this.data.endBuilding) {
      wx.showToast({
        title: '请先选择起点和终点',
        icon: 'none'
      });
      return;
    }

    // 起点经纬度
    let startData = wx.getStorageSync('latlngstart');
    
    if (!startData) {
      wx.showToast({
        title: '位置信息获取失败',
        icon: 'none'
      });
      return;
    }

    let latStart = startData.lat;
    let lngStart = startData.lng;

    // 将地图中心设置到起点位置
    _page.setData({
      latitude: latStart,
      longitude: lngStart,
      scale: 16
    });

    // 开始导航（使用之前规划的路径）
    this.startNavigationWithExistingPath();
  },

  /**
   * 使用现有路径开始导航
   */
  startNavigationWithExistingPath: function() {
    // 设置导航状态
    this.setData({
      isNavigating: true,
      navigationStartTime: Date.now(),
      remainingPath: this.data.originalPath, // 使用之前规划的路径
      traveledPath: [],
      showPreviewPath: false // 隐藏预览路径
    });
    
    // 更新地图显示为导航模式
    this.updateNavigationDisplay();
    
    // 开始位置更新（每秒更新）
    this.startLocationUpdates();
    
    wx.showToast({
      title: '开始导航',
      icon: 'success'
    });
  },

  /**
   * 更新导航显示（灰色直线连接 + 重新规划的绿色路径）
   */
  updateNavigationDisplay: function() {
    const polyline = [];
    
    // 已走过的路径（灰色直线）
    if (this.data.traveledPath.length > 1) {
      polyline.push({
        points: this.data.traveledPath,
        color: '#CCCCCC',
        width: 6,
        arrowLine: false
      });
    }
    
    // 剩余路径（绿色）- 从当前位置到目的地的重新规划路径
    if (this.data.remainingPath.length > 0) {
      polyline.push({
        points: this.data.remainingPath,
        color: '#52C41A',
        width: 6,
        arrowLine: true,
        borderColor: '#FFFFFF',
        borderWidth: 2
      });
    }
    
    this.setData({
      polyline: polyline
    });
  },

  /**
   * 开始位置更新（每秒更新）
   */
  startLocationUpdates: function() {
    let _page = this;
    
    // 清除之前的定时器
    if (this.data.locationUpdateInterval) {
      clearInterval(this.data.locationUpdateInterval);
    }
    
    // 每秒更新一次位置
    const interval = setInterval(() => {
      _page.updateCurrentLocation();
    }, 1000);
    
    this.setData({
      locationUpdateInterval: interval
    });
  },

  /**
   * 更新当前位置（每秒更新）
   */
  updateCurrentLocation: function() {
    let _page = this;
    
    // 检查是否在导航状态
    if (!this.data.isNavigating) return;
    
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        const newLocation = {
          lat: res.latitude,
          lng: res.longitude
        };
        
        // 更新当前位置
        _page.setData({
          currentLocation: newLocation,
          'markers[2].latitude': newLocation.lat,
          'markers[2].longitude': newLocation.lng
        });
        
        // 更新已走过的路径（用灰色直线连接）
        _page.updateTraveledPathWithStraightLine(newLocation);
        
        // 从当前位置重新规划路线到终点
        _page.replanRouteFromCurrentLocation(newLocation);
        
        // 检查是否到达目的地
        _page.checkArrival(newLocation);
      },
      fail: function(res) {
        console.error('更新位置失败:', res);
      }
    });
  },

  /**
   * 更新已走过的路径（用灰色直线连接上一秒和当前位置）
   */
  updateTraveledPathWithStraightLine: function(newLocation) {
    const traveledPath = [...this.data.traveledPath];
    const previousLocation = this.data.previousLocation;
    
    // 如果是第一次更新，添加起点
    if (traveledPath.length === 0) {
      // 获取起点位置
      const startData = wx.getStorageSync('latlngstart');
      if (startData) {
        traveledPath.push({
          latitude: startData.lat,
          longitude: startData.lng
        });
      }
    }
    
    // 用直线连接上一秒位置和当前位置
    if (previousLocation.lat !== 0 && previousLocation.lng !== 0) {
      traveledPath.push({
        latitude: newLocation.lat,
        longitude: newLocation.lng
      });
    }
    
    this.setData({
      traveledPath: traveledPath,
      previousLocation: newLocation // 更新上一秒位置
    });
  },

  /**
   * 从当前位置重新规划路线到终点
   */
  replanRouteFromCurrentLocation: function(currentLocation) {
    let _page = this;
    
    const destination = this.data.destination;
    
    // 如果当前位置和终点位置相同，不需要重新规划
    if (currentLocation.lat === destination.lat && currentLocation.lng === destination.lng) {
      return;
    }
    
    console.log('从当前位置重新规划路线');
    
    let opt = {
      url: `https://apis.map.qq.com/ws/direction/v1/walking/?from=${currentLocation.lat},${currentLocation.lng}&to=${destination.lat},${destination.lng}&key=${qqmapsdk.key}`,
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        console.log('重新规划路线API返回:', res);
        let ret = res.data;
        if (ret.status === 0 && ret.result && ret.result.routes && ret.result.routes.length > 0) {
          let coors = ret.result.routes[0].polyline;
          let pl = [];
          
          // 坐标解压
          let kr = 1000000;
          for (let i = 2; i < coors.length; i++) {
            coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
          }
          
          // 将解压后的坐标放入点串数组
          for (let i = 0; i < coors.length; i += 2) {
            pl.push({
              latitude: coors[i],
              longitude: coors[i + 1]
            });
          }
          
          console.log('重新规划后的路径点数量:', pl.length);
          
          // 更新剩余路径
          _page.setData({
            remainingPath: pl
          });
          
          // 更新地图显示
          _page.updateNavigationDisplay();
          
          // 更新剩余距离
          if (ret.result.routes[0].distance) {
            let distance = ret.result.routes[0].distance;
            let displayDistance = distance >= 1000 ? 
              (distance / 1000).toFixed(2) + '公里' : 
              Math.round(distance) + '米';
            _page.setData({
              resultDistance: displayDistance
            });
            
            // 更新剩余时间
            _page.calculateActualTravelTime(distance);
          }
          
        } else {
          console.error('重新规划路线失败:', ret);
        }
      },
      fail: function (res) {
        console.error('重新规划路线请求失败:', res);
      }
    };
    
    wx.request(opt);
  },

  /**
   * 更新剩余距离
   */
  updateRemainingDistance: function() {
    if (this.data.remainingPath.length === 0) return;
    
    // 计算剩余路径的总距离
    let totalDistance = 0;
    for (let i = 0; i < this.data.remainingPath.length - 1; i++) {
      const point1 = this.data.remainingPath[i];
      const point2 = this.data.remainingPath[i + 1];
      totalDistance += this.calculateDistance(
        point1.latitude, point1.longitude,
        point2.latitude, point2.longitude
      );
    }
    
    const displayDistance = totalDistance >= 1000 ? 
      (totalDistance / 1000).toFixed(2) + '公里' : 
      Math.round(totalDistance) + '米';
    
    this.setData({
      resultDistance: displayDistance
    });
    
    // 更新剩余时间
    this.calculateActualTravelTime(totalDistance);
  },

  /**
   * 检查是否到达目的地
   */
  checkArrival: function(currentLocation) {
    const destination = this.data.destination;
    const distanceToDestination = this.calculateDistance(
      currentLocation.lat, currentLocation.lng,
      destination.lat, destination.lng
    );
    
    // 如果距离目的地小于20米，认为已到达
    if (distanceToDestination < 20) {
      wx.showToast({
        title: '已到达目的地！',
        icon: 'success'
      });
      
      this.stopNavigation();
      
      this.setData({
        resultDistance: '已到达目的地',
        walkingTime: '',
        cyclingTime: ''
      });
    }
  },

  /**
   * 停止导航
   */
  stopNavigation: function() {
    if (this.data.locationUpdateInterval) {
      clearInterval(this.data.locationUpdateInterval);
    }
    
    if (this.data.navigationStartTime) {
      const navigationTime = Date.now() - this.data.navigationStartTime;
      console.log(`导航结束，总时长: ${Math.round(navigationTime / 1000)}秒`);
    }
    
    this.setData({
      isNavigating: false,
      locationUpdateInterval: null,
      navigationStartTime: null
    });
    
    wx.showToast({
      title: '导航已结束',
      icon: 'success'
    });
  },

  /**
   * 计算两点间距离（米）
   */
  calculateDistance: function(lat1, lng1, lat2, lng2) {
    const rad = (d) => d * Math.PI / 180.0;
    
    const radLat1 = rad(lat1);
    const radLat2 = rad(lat2);
    const a = radLat1 - radLat2;
    const b = rad(lng1) - rad(lng2);
    
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + 
                    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    
    const EARTH_RADIUS = 6378137;
    return s * EARTH_RADIUS;
  },

  /**
   * 计算实际旅行时间（步行和骑行）
   */
  calculateActualTravelTime: function(distance) {
    // 步行速度：1.2米/秒
    const walkingTimeInSeconds = distance / 1.2;
    const walkingTime = this.formatTime(walkingTimeInSeconds);
    
    // 骑行速度：4米/秒
    const cyclingTimeInSeconds = distance / 4;
    const cyclingTime = this.formatTime(cyclingTimeInSeconds);
    
    this.setData({
      walkingTime: walkingTime,
      cyclingTime: cyclingTime
    });
  },

  /**
   * 格式化时间显示
   */
  formatTime: function(seconds) {
    if (seconds < 60) {
      return Math.round(seconds) + '秒';
    } else if (seconds < 3600) {
      const minutes = Math.round(seconds / 60);
      return minutes + '分钟';
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.round((seconds % 3600) / 60);
      if (minutes === 0) {
        return hours + '小时';
      } else {
        return hours + '小时' + minutes + '分钟';
      }
    }
  },

  /**
   * 绘制直线（备用方案）
   */
  drawStraightLine: function(latStart, lngStart, latEnd, lngEnd) {
    let _page = this;
    
    let pl = [
      { latitude: latStart, longitude: lngStart },
      { latitude: latEnd, longitude: lngEnd }
    ];
    
    _page.setData({
      polyline: [{
        points: pl,
        color: '#1890FF',
        width: 4,
        dottedLine: true
      }]
    });
    
    wx.showToast({
      title: '使用直线路径',
      icon: 'none'
    });
  },

  /**
   * 统一的错误处理方法
   */
  handleError: function(error, fallbackAction) {
    console.error('导航错误:', error);
    wx.showToast({
      title: '导航服务暂时不可用',
      icon: 'none'
    });
    
    if (fallbackAction && typeof fallbackAction === 'function') {
      fallbackAction();
    }
  }
})