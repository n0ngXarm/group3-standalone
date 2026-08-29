const words = (value) => Object.freeze(value.trim().split(/\s+/));

export const SCENE_MEDIA_SOURCES = Object.freeze({
  "hsk1-l3-s1": Object.freeze({ lessonNumber: 3, sceneNumber: 2 }),
  "hsk1-l3-s2": Object.freeze({ lessonNumber: 3, sceneNumber: 4 }),
  "hsk2-l1-s2": Object.freeze({ lessonNumber: 1, sceneNumber: 3 }),
  "hsk2-l2-s2": Object.freeze({ lessonNumber: 2, sceneNumber: 3 }),
  "hsk3-l1-s2": Object.freeze({ lessonNumber: 1, sceneNumber: 3 }),
  "hsk3-l2-s1": Object.freeze({ lessonNumber: 2, sceneNumber: 3 }),
  "hsk3-l2-s2": Object.freeze({ lessonNumber: 18, sceneNumber: 2 }),
});

export const VOCABULARY_HANZI_BY_LESSON = Object.freeze({
  "hsk1-l1": words(`
    你好 王老师 大家 好 学生 们 老师 您 你们 谢谢 不客气 同学 再见
    请问 你 叫 什么 名字 我 不 是 对不起 没关系 没事 很 高兴 认识 也
  `),
  "hsk1-l3": words(`
    售货员 这边 钱 这些 块 那些 这儿 水果 少 斤 苹果 便宜 商店 衣服 件
    元 怎么样 贵 穿 女 男 那儿 爱 哪个 去年 男朋友 几 年 好玩儿 飞机
    小时 家人 时间 机场 接 住 早 那 西安 北京 大兴机场 时候 开车 车 在
  `),
  "hsk2-l1": words(`
    接 不客气 次 旅游 帮忙 不好意思 已经 介绍 北京烤鸭 机场 再见 打车
    酒店 礼物 准备 客气 前边 快 进来 爷爷 奶奶 给 让 跟 走 公交车 车站
    远 票 出发 到 欢迎 吃 饭馆 朋友 家 午饭 好吃
  `),
  "hsk3-l1": words(`
    菜单 又 饿 渴 客气 饮料 好久 服务 筷子 勺子 碗 马上 热情 尝 记 外卖
    方便 不用 打算 高铁 行 还 路口 小心 迟到 红绿灯 后来 急 如果 以前 耳机
    充电宝 常用 越 分开 检查 刷 检票 电梯 放假 选择 必须 饭馆 味道 菜
  `),
  "hsk3-l2": words(`
    新年 一块儿 会议 经理 开会 后天 地点 会议室 发 笔记本 电脑 或者 声音
    看来 办法 解决 只能 别人 请假 同事 休假 怕 邮箱 愿意 生活 城市 离开
    机会 为 或 最后 相信 然后 工作 问题 帮助 家人 快乐
  `),
});

export const LESSON_CONTENT_OVERRIDES = Object.freeze({
  "hsk3-l1": Object.freeze({
    title: Object.freeze({
      zh: "饭馆美食与高铁之旅",
      pinyin: "Fànguǎn měishí yǔ gāotiě zhī lǚ",
      en: "Restaurant Food and High-Speed Train Journey",
      thAid: "อาหารในร้านและทริปรถไฟความเร็วสูง",
    }),
  }),
});

export const SCENE_CONTENT_OVERRIDES = Object.freeze({
  "hsk1-l2-s1": Object.freeze({ qtePromptTh: "ครอบครัวของหวังอี้เสวี่ยมีกี่คน?" }),
  "hsk1-l2-s2": Object.freeze({ qtePromptTh: "หวังอี้เสวี่ยเลิกงานตอนกี่โมง?" }),
  "hsk1-l3-s1": Object.freeze({ qtePromptTh: "ไป๋เจียเยว่ซื้อเสื้อผ้าสีอะไร?" }),
  "hsk1-l3-s2": Object.freeze({ qtePromptTh: "ทุกคนนัดกันว่าพรุ่งนี้จะเจอกันที่ไหน?" }),
  "hsk2-l2-s1": Object.freeze({
    context: "在商场里挑选红色衣服和书包，并在门口买杯奶茶。",
    qtePromptTh: "หลิวหมิงไปซื้อเครื่องดื่มอะไร?",
  }),
  "hsk2-l2-s2": Object.freeze({ qtePromptTh: "คุณพ่อคุณแม่ให้ของขวัญวันเกิดอะไรแก่เสี่ยวเสวี่ย?" }),
  "hsk3-l2-s1": Object.freeze({ qtePromptTh: "หยางถงเล่อช่วยหวังอี้เสวี่ยแก้ปัญหาอะไร?" }),
  "hsk3-l2-s2": Object.freeze({ qtePromptTh: "ช่วงปีใหม่ทุกคนทำอะไรด้วยกัน?" }),
});

export const BUILDER_PINYIN_BY_SCENE = Object.freeze({
  "hsk1-l1-s1": words("Wáng_lǎoshī, nǐ_hǎo!"),
  "hsk1-l1-s2": words("Lǎoshī, nín_hǎo!"),
  "hsk1-l2-s1": words("Wǒ_jiā_yǒu sì_kǒu_rén."),
  "hsk1-l2-s2": words("Wǒ_wǎnshang liù_diǎn_bàn_xiàbān."),
  "hsk1-l3-s1": words("Zhēn_piàoliang, wǒ_mǎi_zhè_jiàn!"),
  "hsk1-l3-s2": words("Míngtiān_shàngwǔ, Dàxīng_jīchǎng_jiàn!"),
  "hsk2-l1-s1": words("Jīntiān_wǒ_qǐng_nǐmen chī_Běijīng_kǎoyā."),
  "hsk2-l1-s2": words("Huānyíng_lái_wǒ_jiā_zuòkè, kuài_qǐng_jìn!"),
  "hsk2-l2-s1": words("Nǐ_chuān_hóngsè_de hěn_hǎokàn."),
  "hsk2-l2-s2": words("Xiǎoxuě, shēngrì_kuàilè!"),
  "hsk3-l1-s1": words("Zhège_cài_de_wèidào hǎo_jí_le!"),
  "hsk3-l1-s2": words("Jiàqī_wǒmen zuò_gāotiě_qù_Shànghǎi_ba."),
  "hsk3-l2-s1": words("Tài_xièxie_nǐ_le, wèntí_jiějué_le!"),
  "hsk3-l2-s2": words("Wǒ_xuéhuì_le bāo_jiǎozi!"),
});

export function builderPinyin(sceneId) {
  return (BUILDER_PINYIN_BY_SCENE[sceneId] || []).map((part) => part.replaceAll("_", " "));
}
