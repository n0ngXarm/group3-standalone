const pinyins = ["Xī'ān", "nǚhái", "yīnyuè", "ài", "Er"];
const regex = /([bcdfghjklmnpqrstwxyzBCDFGHJKLMNPQRSTWXYZ]*(?:[aāáǎàeēéěèiīíǐìoōóǒòuūúǔùvǖǘǚǜüAĀÁǍÀEĒÉĚÈIĪÍǏÌOŌÓǑÒUŪÚǓÙVǕǗǙǛÜ]+)(?:ng|n|r|NG|N|R)?)/g;

pinyins.forEach(p => console.log(p, '->', p.match(regex)));
