const pinyins = ["Jīntiān", "yīnwèi", "yìqǐ", "xuéshēng", "diànhuà", "zàijiàn", "Xiǎoyǔ", "nǐhǎo", "péngyou"];
const regex = /([bcdfghjklmnpqrstwxyzBCDFGHJKLMNPQRSTWXYZ]*(?:[aāáǎàeēéěèiīíǐìoōóǒòuūúǔùvǖǘǚǜüĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙǕǗǙǛÜ]+)(?:ng|n|r|NG|N|R)?)/g;

pinyins.forEach(p => console.log(p, '->', p.match(regex)));
