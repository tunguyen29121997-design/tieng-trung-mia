import { DictWord } from './hsk1';

export interface AdvWord {
  h: string;
  p: string;
  hv: string;
  ps: string;
  vi: string;
  ex: string;
}

export interface AdvGrammar {
  gr: string;
  cat: string;
  cn: string;
  py: string;
  vi: string;
  eg: string[];
}

export const HSK4_ALL: AdvWord[] = [
  {h:"啊",p:"ā",hv:"a",ps:"Thán",vi:"a/à (trợ từ cảm thán)",ex:"啊？(hả?) / 好啊 (được thôi!) / 原来啊 (ra là vậy à)"},
  {h:"爱情",p:"àiqíng",hv:"ái tình",ps:"Danh",vi:"tình yêu (nam nữ)",ex:"爱情故事 (chuyện tình) / 爱情电影 (phim tình cảm) / 爱情观 (quan điểm tình yêu)"},
  {h:"爱心",p:"àixīn",hv:"ái tâm",ps:"Danh",vi:"lòng nhân ái",ex:"献爱心 (quyên góp) / 爱心活动 (hoạt động thiện nguyện)"},
  {h:"按",p:"àn",hv:"án",ps:"Động/Giới",vi:"ấn; theo",ex:"按按钮 (ấn nút) / 按规定 (theo quy định) / 按顺序 (theo thứ tự)"},
  {h:"安检",p:"ānjiǎn",hv:"an kiểm",ps:"Động",vi:"kiểm tra an ninh",ex:"安检口 (cổng an ninh) / 过 an kiểm (qua kiểm tra)"},
  {h:"安排",p:"ānpái",hv:"an bài",ps:"Động",vi:"sắp xếp",ex:"安排时间 (sắp xếp thời gian) / 安排工作 (sắp xếp công việc)"},
  {h:"按时",p:"ànshí",hv:"án thời",ps:"Phó",vi:"đúng giờ",ex:"按时到达 (đến đúng giờ) / 按时完成 (hoàn thành đúng hạn)"},
  {h:"按照",p:"ànzhào",hv:"án chiếu",ps:"Giới",vi:"theo, căn cứ theo",ex:"按照计划 (theo kế hoạch) / 按照要求 (theo yêu cầu)"},
  {h:"白酒",p:"báijiǔ",hv:"bạch tửu",ps:"Danh",vi:"rượu trắng",ex:"喝白酒 (uống rượu trắng) / 一瓶白酒 (một chai rượu)"},
  {h:"棒",p:"bàng",hv:"bổng",ps:"Tính/Danh",vi:"giỏi; cây gậy",ex:"很棒 (rất giỏi) / 棒极了 (giỏi quá)"},
  {h:"办公",p:"bàngōng",hv:"bạn công",ps:"Động",vi:"làm việc văn phòng",ex:"办公时间 (giờ làm việc) / 办公地点 (địa điểm làm việc)"},
  {h:"办理",p:"bànlǐ",hv:"bạn lý",ps:"Động",vi:"làm thủ tục, xử lý",ex:"办理手续 (làm thủ tục) / 办理业务 (xử lý nghiệp vụ)"},
  {h:"办事",p:"bànshì",hv:"bạn sự",ps:"Động",vi:"làm việc, xử lý việc",ex:"办事效率 (hiệu suất làm việc) / 办事处 (văn phòng đại diện)"},
  {h:"抱",p:"bào",hv:"bão",ps:"Động",vi:"bế, ôm",ex:"抱孩子 (bế em bé) / 抱一下 (ôm một cái)"},
  {h:"保护",p:"bǎohù",hv:"bảo hộ",ps:"Động",vi:"bảo vệ",ex:"保护环境 (bảo vệ môi trường) / 保护自己 (bảo vệ bản thân)"},
  {h:"报考",p:"bàokǎo",hv:"báo khảo",ps:"Động",vi:"đăng ký dự thi",ex:"报考大学 (đăng ký thi ĐH) / 报考条件 (điều kiện dự thi)"},
  {h:"报名",p:"bàomíng",hv:"báo danh",ps:"Động",vi:"đăng ký",ex:"报名参加 (đăng ký tham gia) / 报名表 (đơn đăng ký)"},
  {h:"抱歉",p:"bàoqiàn",hv:"bão khiểm",ps:"Tính",vi:"xin lỗi (lịch sự)",ex:"很抱歉 (rất xin lỗi) / 抱歉打扰 (xin lỗi làm phiền)"},
  {h:"保证",p:"bǎozhèng",hv:"bảo chứng",ps:"Động/Danh",vi:"bảo đảm, cam kết",ex:"质量保证 (bảo đảm chất lượng) / 保证完成 (cam kết hoàn thành)"},
  {h:"倍",p:"bèi",hv:"bội",ps:"Lượng",vi:"lần (gấp … lần)",ex:"两倍 (gấp đôi) / 三倍价格 (giá gấp 3)"},
  {h:"背",p:"bēi",hv:"bối",ps:"Động",vi:"đeo, vác (trên lưng)",ex:"背孩子 (cõng em bé) / 背包 (đeo ba lô)"},
  {h:"背包",p:"bēibāo",hv:"bối bao",ps:"Danh",vi:"ba lô",ex:"旅行背包 (ba lô du lịch) / 背包里 (trong ba lô)"},
  {h:"北部",p:"běibù",hv:"bắc bộ",ps:"Danh",vi:"miền Bắc",ex:"北部地区 (khu vực miền Bắc) / 北部城市 (thành phố miền Bắc)"},
  {h:"笨",p:"bèn",hv:"bổn",ps:"Tính",vi:"ngốc, vụng",ex:"有点笨 (hơi ngốc) / 笨办法 (cách vụng)"},
  {h:"本科",p:"běnkē",hv:"bản khoa",ps:"Danh",vi:"đại học (bậc cử nhân)",ex:"本科生 (sinh viên ĐH) / 本科毕业 (tốt nghiệp ĐH)"},
  {h:"本来",p:"běnlái",hv:"bản lai",ps:"Phó/Tính",vi:"vốn dĩ",ex:"本来想去 (vốn định đi) / 本来就是 (vốn là)"},
  {h:"便于",p:"biànyú",hv:"tiện vu",ps:"Động",vi:"tiện cho…",ex:"便于管理 (tiện quản lý) / 便于理解 (tiện hiểu)"},
  {h:"表",p:"biǎo",hv:"biểu",ps:"Danh/Động",vi:"bảng; đồng hồ; bày tỏ",ex:"手表 (đồng hồ đeo tay) / 表格 (bảng biểu)"},
  {h:"表格",p:"biǎogé",hv:"biểu cách",ps:"Danh",vi:"bảng/biểu mẫu",ex:"填写表格 (điền biểu mẫu) / 表格内容 (nội dung bảng)"},
  {h:"表示",p:"biǎoshì",hv:"biểu thị",ps:"Động",vi:"biểu thị, bày tỏ",ex:"表示同意 (bày tỏ đồng ý) / 表示感谢 (bày tỏ cảm ơn)"},
  {h:"表现",p:"biǎoxiàn",hv:"biểu hiện",ps:"Động",vi:"thể hiện",ex:"表现很好 (thể hiện tốt) / 工作表现 (thể hiện công việc)"},
  {h:"表扬",p:"biǎoyáng",hv:"biểu dương",ps:"Động",vi:"khen ngợi",ex:"表扬学生 (khen học sinh) / 得到表扬 (được khen)"},
  {h:"标准",p:"biāozhǔn",hv:"tiêu chuẩn",ps:"Danh/Tính",vi:"tiêu chuẩn",ex:"国家标准 (tiêu chuẩn quốc gia) / 标准答案 (đáp án chuẩn)"},
  {h:"并",p:"bìng",hv:"tịnh",ps:"Liên/Phó",vi:"và; đồng thời",ex:"并不 (hoàn toàn không) / 并没有 (cũng không hề)"},
  {h:"饼",p:"bǐng",hv:"bính",ps:"Danh",vi:"bánh tròn",ex:"吃饼 (ăn bánh) / 饼干 (bánh quy)"},
  {h:"饼干",p:"bǐnggān",hv:"bính can",ps:"Danh",vi:"bánh quy",ex:"吃饼干 (ăn bánh quy) / 一盒饼干 (một hộp bánh)"},
  {h:"并且",p:"bìngqiě",hv:"tịnh thả",ps:"Liên",vi:"hơn nữa, và còn",ex:"并且还… (và còn…) / 不但…并且… (không những… mà còn…)"},
  {h:"笔试",p:"bǐshì",hv:"bút thí",ps:"Động",vi:"thi viết",ex:"参加笔试 (tham gia thi viết) / 笔试成绩 (điểm thi viết)"},
  {h:"毕业",p:"bìyè",hv:"tất nghiệp",ps:"Động",vi:"tốt nghiệp",ex:"大学毕业 (tốt nghiệp ĐH) / 毕业典礼 (lễ tốt nghiệp)"},
  {h:"毕业生",p:"bìyèshēng",hv:"tất nghiệp sinh",ps:"Danh",vi:"sinh viên tốt nghiệp",ex:"应届毕业生 (tốt nghiệp mới) / 毕业生就业 (việc làm SV tốt nghiệp)"},
  {h:"鼻子",p:"bízi",hv:"tị tử",ps:"Danh",vi:"mũi",ex:"鼻子疼 (đau mũi) / 流鼻涕 (chảy nước mũi)"},
  {h:"播放",p:"bōfàng",hv:"bá phóng",ps:"Động",vi:"phát (nhạc/video)",ex:"播放音乐 (phát nhạc) / 播放视频 (phát video)"},
  {h:"博士",p:"bóshì",hv:"bác sĩ",ps:"Danh",vi:"tiến sĩ",ex:"博士学位 (học vị TS) / 博士论文 (luận án TS)"},
  {h:"步",p:"bù",hv:"bộ",ps:"Danh",vi:"bước",ex:"走一步 (đi một bước) / 进一步 (thêm một bước)"},
  {h:"部",p:"bù",hv:"bộ",ps:"Danh/Lượng",vi:"bộ/phần; (lượng) máy/xe",ex:"东部 (phần phía Đông) / 一部手机 (một chiếc điện thoại)"}
];

export const HSK5_ALL: AdvWord[] = [
  {h:"唉",p:"ài",hv:"ai",ps:"叹",vi:"ôi, than thở",ex:"唉，真麻烦 / 唉呀一声 / 唉，算了"},
  {h:"哎",p:"āi",hv:"ai",ps:"叹",vi:"ê, này…",ex:"哎，你好 / 哎，等等 / 哎？怎么了"},
  {h:"爱护",p:"àihù",hv:"ái hộ",ps:"动",vi:"yêu quý, bảo vệ",ex:"爱护环境 / 爱护chè chở / 爱护身体"},
  {h:"哎呀",p:"āiyā",hv:"ai nha",ps:"叹",vi:"ôi trời, ôi chao",ex:"哎呀，忘了 / 哎呀，好疼 / 哎呀，太好了"},
  {h:"暗",p:"àn",hv:"ám",ps:"形",vi:"tối, âm u",ex:"房间很暗 / 暗色衣服 / 天快暗了"},
  {h:"安",p:"ān",hv:"an",ps:"形/动",vi:"yên, an toàn; lắp/đặt (ít gặp)",ex:"平安 / 安静 / 安心"},
  {h:"安全带",p:"ānquándài",hv:"an toàn đới",ps:"名",vi:"dây an toàn",ex:"系安全带 / 安全带扣 / 解开安全带"},
  {h:"安慰",p:"ānwèi",hv:"an ủi",ps:"动/形",vi:"an ủi; lời an ủi",ex:"安慰朋友 / 受到安慰 / 安慰的话"},
  {h:"安装",p:"ānzhuāng",hv:"an trang",ps:"动",vi:"lắp đặt",ex:"安装软件 / 安装空调 / 安装设备"},
  {h:"熬夜",p:"áoyè",hv:"ngao dạ",ps:"动",vi:"thức khuya",ex:"经常熬夜 / 熬夜学习 / 熬夜加班"},
  {h:"白",p:"bái",hv:"bạch",ps:"形/副",vi:"trắng; uổng, vô ích",ex:"白色 / 白跑一趟 / 白白浪费"},
  {h:"傍晚",p:"bàngwǎn",hv:"bàng vãn",ps:"名",vi:"chiều tối",ex:"今天傍晚 / 傍晚时分 / 傍晚回家"},
  {h:"半夜",p:"bànyè",hv:"bán dạ",ps:"名/数量",vi:"nửa đêm",ex:"半夜醒来 / 半夜三更 / 半夜出门"},
  {h:"薄",p:"báo",hv:"bạc",ps:"形",vi:"mỏng",ex:"薄衣服 / 纸很薄 / 薄薄一层"},
  {h:"宝",p:"bǎo",hv:"bảo",ps:"名",vi:"báu, quý",ex:"国宝 / 宝贝 / 宝物"},
  {h:"保",p:"bǎo",hv:"bảo",ps:"动/名",vi:"bảo vệ; giữ; bảo đảm",ex:"保密 / 保持 / 保障"},
  {h:"保安",p:"bǎo’ān",hv:"bảo an",ps:"名/动",vi:"bảo vệ, an ninh",ex:"小区保安 / 当保安 / 保安人员"},
  {h:"宝贝",p:"bǎobèi",hv:"bảo bối",ps:"名",vi:"báu vật; (gọi thân mật)",ex:"我的宝贝 / 宝贝女儿 / 宝贝儿"},
  {h:"保持",p:"bǎochí",hv:"bảo trì",ps:"动",vi:"duy trì, giữ vững",ex:"保持安静 / 保持距离 / 保持联系"},
  {h:"保存",p:"bǎocún",hv:"bảo tồn",ps:"动",vi:"lưu giữ, bảo quản",ex:"保存文件 / 保存照片 / 保存实力"},
  {h:"报到",p:"bàodào",hv:"báo đáo",ps:"动",vi:"đến trình diện",ex:"新生报到 / 按时报到 / 报到处"},
  {h:"报道",p:"bàodào",hv:"báo đạo",ps:"动/名",vi:"đưa tin; bản tin",ex:"新闻报道 / 媒体报道 / 现场报道"},
  {h:"报告",p:"bàogào",hv:"báo cáo",ps:"动/名",vi:"báo cáo",ex:"写报告 / 工作报告 / 听报告"},
  {h:"宝贵",p:"bǎoguì",hv:"bảo quý",ps:"形",vi:"quý giá",ex:"宝贵时间 / 宝贵经验 / 宝贵机会"},
  {h:"包裹",p:"bāoguǒ",hv:"bao quả",ps:"动/名",vi:"bưu kiện; gói",ex:"寄包裹 / 打开包裹 / 快递包裹"},
  {h:"包含",p:"bāohán",hv:"bao hàm",ps:"动",vi:"bao gồm",ex:"包含内容 / 包含费用 / 包含在内"},
  {h:"报警",p:"bàojǐng",hv:"báo cảnh",ps:"动",vi:"báo cảnh sát",ex:"lập tức报警 / 报警电话 / 报警处理"},
  {h:"包括",p:"bāokuò",hv:"bao quát",ps:"动",vi:"bao gồm",ex:"包括我 / 包括费用 / 包括在内"},
  {h:"保留",p:"bǎoliú",hv:"bảo lưu",ps:"动",vi:"giữ lại",ex:"保留意见 / 保保留权利 / 保留原样"},
  {h:"保险",p:"bǎoxiǎn",hv:"bảo hiểm",ps:"名/形",vi:"bảo hiểm; an toàn",ex:"买保险 / 医疗保险 / 保险公司"}
];

export const HSK6_ALL: AdvWord[] = [
  {h:"岸",p:"àn",hv:"ngạn",ps:"名",vi:"bờ",ex:"河岸 / 靠岸 / 海岸"},
  {h:"昂贵",p:"ángguì",hv:"ngẩng quý",ps:"形",vi:"đắt đỏ",ex:"昂贵商品 / 价格昂贵 / 昂贵费用"},
  {h:"案例",p:"ànlì",hv:"án lệ",ps:"名",vi:"trường hợp, ví dụ",ex:"实际案例 / 成功案例 / 经典案例"},
  {h:"按摩",p:"ànmó",hv:"án ma",ps:"动",vi:"mát-xa",ex:"按摩身体 / 按摩服务 / 足底按摩"},
  {h:"暗示",p:"ànshì",hv:"ám thị",ps:"动",vi:"ám chỉ",ex:"语言暗示 / 明显暗示 / 心理暗示"},
  {h:"败",p:"bài",hv:"bại",ps:"动",vi:"thua",ex:"战败 / 失败 / 击败"},
  {h:"摆",p:"bǎi",hv:"bãi",ps:"动",vi:"bày, đặt",ex:"摆桌子 / 摆姿势 / 摆商品"},
  {h:"白白",p:"báibái",hv:"bạch bạch",ps:"副",vi:"uổng công",ex:"白白浪费 / 白白错过 / 白白努力"},
  {h:"拜访",p:"bàifǎng",hv:"bái phỏng",ps:"动",vi:"thăm viếng",ex:"拜访客户 / 拜访老师 / 正式拜访"},
  {h:"摆放",p:"bǎifàng",hv:"bãi phóng",ps:"动",vi:"sắp xếp",ex:"摆放整齐 / 摆放位置 / 商品摆放"},
  {h:"百分点",p:"bǎifēndiǎn",hv:"bách phân điểm",ps:"名",vi:"điểm %",ex:"增加百分点 / 降低百分点 / 利率百分点"},
  {h:"百货",p:"bǎihuò",hv:"bách hóa",ps:"名",vi:"bách hóa",ex:"百货商店 / 百货公司 / 日用百货"},
  {h:"白领",p:"báilǐng",hv:"bạch lĩnh",ps:"名",vi:"nhân viên văn phòng",ex:"白领阶层 / 白领工作 / 城市白领"},
  {h:"拜年",p:"bàinián",hv:"bái niên",ps:"动",vi:"chúc Tết",ex:"上门拜年 / 拜年sự cố / 拜年活动"},
  {h:"摆脱",p:"bǎituō",hv:"bãi thoát",ps:"动",vi:"thoát khỏi",ex:"摆脱困境 / 摆脱压力 / 摆脱控制"},
  {h:"版",p:"bǎn",hv:"bản",ps:"名/量",vi:"bản",ex:"第一版 / 原版书 / 修订版"},
  {h:"版本",p:"bǎnběn",hv:"bản bản",ps:"名",vi:"phiên bản",ex:"最新版本 / 软件版本 / 正式版本"},
  {h:"棒球",p:"bàngqiú",hv:"bổng cầu",ps:"名",vi:"bóng chày",ex:"打棒球 / 棒球比赛 / 职业棒球"},
  {h:"榜样",p:"bǎngyàng",hv:"bảng dạng",ps:"名",vi:"tấm gương",ex:"学习榜样 / 好榜样 / 榜样作用"},
  {h:"伴随",p:"bànsuí",hv:"bạn tùy",ps:"动",vi:"đi kèm",ex:"伴随出现 / 伴随发展 / 风险伴随"},
  {h:"扮演",p:"bànyǎn",hv:"giả diễn",ps:"动",vi:"đóng vai",ex:"扮演角色 / 扮演重要角色 / 扮演父母"},
  {h:"爆",p:"bào",hv:"bạo",ps:"动",vi:"nổ",ex:"爆炸 / 爆满 / 爆发"},
  {h:"爆发",p:"bàofā",hv:"bạo phát",ps:"动",vi:"bùng nổ",ex:"疾病爆发 / 冲突爆发 / 情绪爆发"},
  {h:"保管",p:"bǎoguǎn",hv:"bảo quản",ps:"动",vi:"bảo quản",ex:"保管文件 / 妥善保管 / 负责保管"},
  {h:"保健",p:"bǎojiàn",hv:"bảo kiện",ps:"动",vi:"chăm sóc sức khỏe",ex:"保健食品 / 保健意识 / 医疗保健"},
  {h:"报刊",p:"bàokān",hv:"báo khan",ps:"名",vi:"báo chí",ex:"报刊杂志 / 报刊发行 / 报刊媒体"},
  {h:"暴力",p:"bàolì",hv:"bạo lực",ps:"名",vi:"bạo lực",ex:"暴力行为 / 家庭暴力 / 校园暴力"},
  {h:"暴露",p:"bàolù",hv:"bạo lộ",ps:"动",vi:"phơi bày",ex:"暴露问题 / 暴露缺点 / 身份暴露"},
  {h:"保暖",p:"bǎonuǎn",hv:"bảo noãn",ps:"动",vi:"giữ ấm",ex:"注意保暖 / 保暖衣物 / 冬季保暖"},
  {h:"报社",p:"bàoshè",hv:"báo xã",ps:"名",vi:"tòa soạn",ex:"报社记者 / 报社编辑 / 新闻报社"}
];

export const HSK79_ALL: AdvWord[] = [
  {h:"挨",p:"ái",hv:"ai",ps:"动",vi:"chịu, bị (điều xấu)",ex:"挨打 (bị đánh) ; 挨mắng (bị mắng) ; 挨饿 (chịu đói)"},
  {h:"癌",p:"ái",hv:"nham",ps:"名",vi:"ung thư",ex:"肺癌 (ung thư phổi) ; 胃癌 (ung thư dạ dày) ; 癌细胞 (tế bào ung thư)"},
  {h:"挨",p:"āi",hv:"ai",ps:"动/介",vi:"sát, liền kề; lần lượt",ex:"挨着坐 (ngồi sát nhau) ; 挨家 (từng nhà) ; 挨次 (theo thứ tự)"},
  {h:"爱不释手",p:"àibúshìshǒu",hv:"ái bất thích thủ",ps:"成语",vi:"rất yêu thích, không nỡ rời",ex:"爱不释手的书 (quyển sách mê mẩn) / Yêu mến không nỡ rời"},
  {h:"爱戴",p:"àidài",hv:"ái đới",ps:"动",vi:"kính yêu, yêu mến (bề trên)",ex:"受到爱戴 (được kính yêu) ; 爱戴领导 (kính trọng lãnh đạo)"},
  {h:"挨家挨户",p:"āijiā-āihù",hv:"ai gia ai hộ",ps:"成语",vi:"từng nhà một",ex:"挨家挨户检查 (kiểm tra từng nhà) / Đi gõ cửa từng nhà"},
  {h:"暧昧",p:"àimèi",hv:"ám muội",ps:"形",vi:"mập mờ, không rõ ràng",ex:"态度暧昧 (thái độ mập mờ) / Quan hệ mập mờ"},
  {h:"爱慕",p:"àimù",hv:"ái mộ",ps:"动",vi:"ngưỡng mộ (thường mang tình cảm)",ex:"爱慕之情 (tình cảm ngưỡng mộ) / Thầm thương trộm nhớ"},
  {h:"哀求",p:"āiqiú",hv:"ai cầu",ps:"动",vi:"van xin, cầu khẩn",ex:"哀求原谅 (van xin tha thứ) / Cầu khẩn xin giúp đỡ"},
  {h:"碍事",p:"àishì",hv:"ngại sự",ps:"动/形",vi:"vướng víu, gây phiền",ex:"不碍事 (không sao đâu) / Rất vướng víu cản trở"},
  {h:"爱惜",p:"àixī",hv:"ái tích",ps:"动",vi:"trân trọng, giữ gìn",ex:"爱惜时间 (quý trọng thời gian) / Trân trọng sinh mạng"},
  {h:"癌症",p:"áizhèng",hv:"nham chứng",ps:"名",vi:"bệnh ung thư",ex:"得癌症 (mắc ung thư) / Bệnh nhân ung thư"},
  {h:"艾滋病",p:"àizībìng",hv:"ái tư bệnh",ps:"名",vi:"AIDS",ex:"预防艾滋病 (phòng chống AIDS)"},
  {h:"暗地里",p:"àndìlǐ",hv:"ám địa lý",ps:"副",vi:"trong bí mật",ex:"暗地里调查 (điều tra ngầm) / Ngấm ngầm ủng hộ"},
  {h:"安定",p:"āndìng",hv:"an định",ps:"形/动",vi:"ổn định; làm ổn định",ex:"社会安定 (xã hội ổn định) / Tâm thần an định"},
  {h:"安抚",p:"ānfǔ",hv:"an phủ",ps:"动",vi:"trấn an, xoa dịu",ex:"安抚情绪 (trấn an cảm xúc) / Xoa dịu lòng dân"},
  {h:"案件",p:"ànjiàn",hv:"án kiện",ps:"名",vi:"vụ án, vụ việc",ex:"刑事案件 (vụ án hình sự) / Phá án thành công"},
  {h:"按理",p:"ànlǐ",hv:"án lý",ps:"副",vi:"theo lý mà nói",ex:"按理说 (theo lý mà nói) / Lẽ ra phải như vậy"},
  {h:"安眠药",p:"ānmiányào",hv:"an miên dược",ps:"名",vi:"thuốc ngủ",ex:"吃安眠药 (uống thuốc ngủ)"},
  {h:"安宁",p:"ānníng",hv:"an ninh",ps:"形",vi:"yên bình, thanh thản",ex:"生活安宁 (cuộc sống yên bình) / Tâm hồn an tĩnh"},
  {h:"按钮",p:"ànniǔ",hv:"án nữu",ps:"名",vi:"nút bấm",ex:"按下按钮 (ấn nút) ; 紧急按钮 (nút khẩn cấp)"},
  {h:"按说",p:"ànshuō",hv:"án thuyết",ps:"副",vi:"theo lẽ ra",ex:"按说不该 (lẽ ra không nên) / Thường lý mà nói"},
  {h:"安稳",p:"ānwěn",hv:"an ổn",ps:"形",vi:"ổn định, yên ổn",ex:"睡得安稳 (ngủ yên giấc) / Cuộc sống êm đềm"},
  {h:"安详",p:"ānxiáng",hv:"an tường",ps:"形",vi:"điềm tĩnh, hiền hòa",ex:"神情安详 (vẻ mặt điềm tĩnh) / Điềm đạm tự tại"},
  {h:"安心",p:"ānxīn",hv:"an tâm",ps:"形",vi:"yên tâm",ex:"放心安心 (cảm thấy yên tâm) / An tâm làm việc"},
  {h:"安逸",p:"ānyì",hv:"an dật",ps:"形",vi:"nhàn nhã, an nhàn",ex:"生活安逸 (cuộc sống nhàn nhã) / Ham thích nhàn hạ"},
  {h:"安置",p:"ānzhì",hv:"an trí",ps:"动",vi:"sắp xếp, bố trí",ex:"安置人员 (bố trí nhân sự) / Sắp xếp ổn thỏa"},
  {h:"暗中",p:"ànzhōng",hv:"ám trung",ps:"副",vi:"ngầm, bí mật",ex:"暗中观察 (quan sát ngầm) / Bí mật giúp đỡ"},
  {h:"熬",p:"áo",hv:"ngao",ps:"动",vi:"chịu đựng (thời gian, khó khăn)",ex:"熬夜 (thức khuya) / Cố gắng vượt qua thời kỳ khó khăn"},
  {h:"傲",p:"ào",hv:"ngạo",ps:"形",vi:"kiêu ngạo",ex:"高傲 (cao ngạo) / Kiêu căng ngạo mạn"}
];

export const GRAMMAR_HSK4: AdvGrammar[] = [
  {gr:"Từ loại",cat:"Động từ năng nguyện",cn:"敢",py:"gǎn",vi:"dám (làm gì đó), dũng cảm để làm",eg:["我不敢一个人走夜路。(Tôi không dám đi đường đêm một mình.)","你敢不敢跳？(Bạn có dám nhảy không?)"]},
  {gr:"So sánh",cat:"Đại từ chỉ thị",cn:"各 vs 各位 vs 任何 vs 此",py:"gè vs gèwèi vs rènhé vs cǐ",vi:"各=mỗi (chung), 各位=các vị (lịch sự chỉ người), 任何=bất kỳ (nhấn mạnh không ngoại lệ), 此=đây/này",eg:["各国人民 (nhân dân các nước)","各位来宾 (các vị khách quý)","任何困难 (bất kỳ khó khăn nào)"]},
  {gr:"Lượng từ",cat:"Lượng từ danh từ",cn:"棵 vs 台 vs 幅",py:"kē vs tái vs fú",vi:"棵=cây, 台=chiếc (máy móc), 幅=bức (tranh/ảnh)",eg:["一棵大树 (một cây to)","一台电脑 (một chiếc máy tính)","一幅画 (một bức tranh)"]}
];

export const GRAMMAR_HSK5: AdvGrammar[] = [
  {gr:"Hình vị",cat:"Hậu tố —头",cn:"—头",py:"—tou",vi:"hậu tố tạo danh từ chỉ vật cụ thể",eg:["石头 (shítou - hòn đá)","木头 (mùtou - khúc gỗ)","骨头 (gǔtou - xương)"]},
  {gr:"Từ loại",cat:"Liên từ",cn:"一旦…就…",py:"yídàn…jiù…",vi:"một khi (xảy ra) thì ngay lập tức…",eg:["一旦决定就不改变。(Một khi quyết định thì không thay đổi.)","一旦失去就回不来了。(Một khi mất đi thì không lấy lại được.)"]}
];

export const GRAMMAR_HSK6: AdvGrammar[] = [
  {gr:"Từ loại",cat:"Phó từ thời gian",cn:"日益 vs 逐渐 vs 逐步",py:"rìyì vs zhújiàn vs zhúbù",vi:"日益=ngày càng (nhanh, rõ), 逐渐=dần dần (tự nhiên), 逐步=từng bước (có kế hoạch)",eg:["环境日益恶化。(Môi trường ngày càng xấu đi.)","他逐渐习惯了新生活。(Anh ấy dần quen cuộc sống mới.)","我们要逐步实现目标。(Chúng ta từng bước đạt mục tiêu.)"]}
];

export const GRAMMAR_HSK79G: AdvGrammar[] = [
  {gr:"So sánh",cat:"Giới từ nâng cao",cn:"避让 vs 阐释 vs 随着",py:"bìràng vs chǎnshì vs suízhe",vi:"避让=tránh nhường, 阐释=giải thích rõ, 随着=theo sự thay đổi",eg:["避让车辆 (nhường xe)","阐释观点 (giải thích rõ quan điểm)","随着时间推移 (theo thời gian trôi đi)"]}
];
