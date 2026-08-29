const pinyinStr = "Tài hǎo le, wǒ zuì xǐhuan chī Běijīng kǎoyā le!";

const regex = /([bcdfghjklmnpqrstwxyzBCDFGHJKLMNPQRSTWXYZ]*(?:[aāáǎàeēéěèiīíǐìoōóǒòuūúǔùvǖǘǚǜüĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙǕǗǙǛÜ]+)(?:ng|n|r|NG|N|R)?)/g;

const matches = pinyinStr.match(regex);
console.log(matches);
