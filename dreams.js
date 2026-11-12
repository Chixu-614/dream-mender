'use strict';
window.ATELIER_DREAMS = [
{title:'掉进湖里的月亮',tag:'月光委托',desc:'今晚，我的窗前没有月光了。',hint:'把散落的三片月光找回来吧。',image:'moon',reward:22,cost:4,letter:'有时候，我们缺的不是一整轮月亮，\n只是一点点被找回的光。',finish:'月亮回到了窗前。今晚，可以安心睡了。',review:'窗前又有月光了。今晚终于能好好睡一觉。'},
{title:'忘记回家路的星星',tag:'星星委托',desc:'那条熟悉的银河，在哪里呢？',hint:'按一、二、三的顺序，为星星照亮回家的路。',image:'star',mode:'sequence',reward:26,cost:5,letter:'走得再远的小星星，\n也值得有一盏为它亮着的灯。',finish:'星星找到回家的路了。',review:'顺着你们点亮的星光，我找到回家的路了。'},
{title:'不敢盛开的花',tag:'花园委托',desc:'如果我开得不够好看呢？',hint:'收集三束暖光，让小花慢慢长大。',image:'flower',reward:24,cost:4,letter:'不必成为最漂亮的那一朵，\n按照自己的节奏盛开就好。',finish:'小花终于愿意盛开了。',review:'花开得小小的，可我真的很喜欢。谢谢你们等它。'},
{title:'失去浪声的海',tag:'海风委托',desc:'我梦里的海不响了，瓶子也变得好安静。',hint:'找回三枚声音贝壳。',image:'sea',reward:25,cost:4,letter:'安静不是永远，\n海风会把声音带回来。',finish:'听，海又在轻轻说话了。',review:'回家路上听了听瓶子，海还在里面。谢谢你们。'},
{title:'一直下雨的野餐',tag:'晴日委托',desc:'我准备了点心，可雨一直不肯停。',hint:'按顺序点亮三束阳光，让雨慢慢停。',image:'picnic',mode:'sequence',reward:27,cost:5,letter:'总有一个晴天，\n留给没能赴约的我们。',finish:'雨停了，朋友们都来了。',review:'梦里终于不下雨了。这一次，朋友们都来赴约了。'},
{title:'停在午夜的列车',tag:'远行委托',desc:'车站的钟不走了，我还没来得及说再见。',hint:'依次点亮车站的三盏灯。',image:'train',mode:'sequence',reward:28,cost:5,letter:'告别不是消失，\n是把想念带往下一站。',finish:'列车出发了，窗外有新的晨光。',review:'这次我赶上了列车，也好好说了再见。'},
{title:'没有倒影的湖',tag:'湖畔委托',desc:'我站在湖边，可水里没有我的影子。',hint:'找到三对相同的倒影。',image:'lake',mode:'pair',reward:25,cost:4,letter:'你一直都在，\n只是水面需要一点时间平静。',finish:'湖水认出了你的模样。',review:'水里的我也挥了挥手。原来我一直都在。'},
{title:'找不到教室的走廊',tag:'校园委托',desc:'门都长得一样，我是不是又走错了？',hint:'把三对相同的门牌配在一起。',image:'hall',mode:'pair',reward:26,cost:4,letter:'走错的路，\n也可以通往愿意等你的人。',finish:'教室里，有人替你留了座位。',review:'没有人笑话我走错路。新教室里真的给我留了位置。'},
{title:'不再漂浮的纸船',tag:'纸船委托',desc:'我的小船沉下去了，信还没有送到。',hint:'依次点亮三道水波，托起纸船。',image:'boat',mode:'sequence',reward:24,cost:4,letter:'小小的船，\n也能载着很重要的心意。',finish:'纸船又出发了，带着那封信。',review:'小船漂得慢慢的，可这次信一定能送到了。'},
{title:'丢失颜色的彩虹',tag:'雨后委托',desc:'雨停了，彩虹却变得灰灰的。',hint:'找回散落的三束颜色。',image:'rainbow',reward:25,cost:4,letter:'不必一下子灿烂，\n先找回一种喜欢的颜色。',finish:'雨后的天空又有颜色了。',review:'我画了一道彩虹送给你们，颜色和梦里一样。'},
{title:'忘记旋律的音乐盒',tag:'旋律委托',desc:'盒子还在转，可那首歌不见了。',hint:'把三对相同的音符配在一起。',image:'music',mode:'pair',reward:28,cost:5,letter:'有些陪伴，\n藏在一首记得你的歌里。',finish:'熟悉的旋律又轻轻响起。',review:'音乐盒又唱起那首歌了。我跟着哼了好久。'},
{title:'不会飘的晚安信',tag:'晚安委托',desc:'写给远方的晚安，怎么也飞不起来。',hint:'按顺序点亮三阵晚风。',image:'letter',mode:'sequence',reward:26,cost:4,letter:'认真写下的晚安，\n会找到想念的人。',finish:'晚安信乘着风，飞向远方。',review:'收到了回信。原来那边也有人正在想我。'},
{title:'找不到脚印的雪地',tag:'初雪委托',desc:'雪把路盖住了，我不知道该往哪里走。',hint:'找回雪地里的三枚暖光。',image:'snow',reward:27,cost:5,letter:'没有脚印也没关系，\n我们一起走出新的路。',finish:'雪地里多了两排并肩的脚印。',review:'这次雪地里不是我一个人的脚印了。'},
{title:'睡不着的小云朵',tag:'云间委托',desc:'越想睡着，脑袋里的事情就越多。',hint:'为三对相同的云朵找到彼此。',image:'cloud',mode:'pair',reward:24,cost:4,letter:'暂时放下也没关系，\n明天还有柔软的天空。',finish:'小云朵终于打起了轻轻的呼噜。',review:'昨晚睡得好软好软，像躺在云朵里。'},
{title:'没有灯的萤火森林',tag:'森林委托',desc:'森林太黑了，萤火虫们找不到彼此。',hint:'找回三点温暖的萤光。',image:'forest',reward:26,cost:4,letter:'一点点光，\n也能成为彼此的方向。',finish:'森林的晚灯，一盏一盏亮了。',review:'萤火虫送我到森林外。小小的灯，真的很亮。'}
];
