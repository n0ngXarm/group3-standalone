const fs = require('fs');
const glob = require('glob');

const pinyinMap = {
  "王一飞跟谁打招呼？": "Wáng Yīfēi gēn shéi dǎ zhāohu?",
  "学生们怎样跟老师打招呼？": "Xuéshēngmen zěnyàng gēn lǎoshī dǎ zhāohu?",
  "王一雪家有几口人？": "Wáng Yīxuě jiā yǒu jǐ kǒu rén?",
  "王一雪晚上几点下班？": "Wáng Yīxuě wǎnshang jǐ diǎn xiàbān?",
  "白家月买了什么颜色的衣服？": "Bái Jiāyuè mǎi le shénme yánsè de yīfu?",
  "大家约好明天在哪里见？": "Dàjiā yuē hǎo míngtiān zài nǎli jiàn?",
  "李文今天请大家吃什么？": "Lǐ Wén jīntiān qǐng dàjiā chī shénme?",
  "刘明准备了什么美味午饭？": "Liú Míng zhǔnbèi le shénme měiwèi wǔfàn?",
  "刘明去买什么饮品？": "Liú Míng qù mǎi shénme yǐnpǐn?",
  "爸爸妈妈送给小雪什么生日礼物？": "Bàba māma sòng gěi Xiǎoxuě shénme shēngrì lǐwù?",
  "白家月觉得这个菜的味道怎么样？": "Bái Jiāyuè juéde zhège cài de wèidao zěnmeyàng?",
  "在高铁上有什么便捷的服务？": "Zài gāotiě shàng yǒu shénme biànjié de fúwù?",
  "杨同乐帮王一雪解决了什么问题？": "Yáng Tónglè bāng Wáng Yīxuě jiějué le shénme wèntí?",
  "过年的时候大家一起做什么？": "Guònián de shíhou dàjiā yìqǐ zuò shénme?"
};

const files = glob.sync('src/surfaces/group-3-8104/content/lessons/**/*.js');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  for (const [zh, pinyin] of Object.entries(pinyinMap)) {
    const zhLine = `"zh": "${zh}",`;
    if (content.includes(zhLine) && !content.includes(`"pinyin": "${pinyin}"`)) {
      content = content.replace(zhLine, `${zhLine}\n        "pinyin": "${pinyin}",`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
