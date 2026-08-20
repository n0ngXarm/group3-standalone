#!/usr/bin/env python3
"""Generate dialogue voice assets for the Group 3 8104 lessons.

Requires edge-tts (`python -m pip install edge-tts`). Existing files are reused
only when their manifest text/profile metadata matches the current generator.
Pass ``--force`` to regenerate detected mismatches. Lesson-10/lesson-13 audio
stays untouched. Each line is written to a temporary file and promoted only
after validation. The manifest is merged by filename after every line has
completed successfully, with current generator metadata taking precedence.
"""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
from pathlib import Path
import shutil
import subprocess

import edge_tts


ROOT = Path(__file__).resolve().parents[2]
ASSET_ROOT = ROOT / "apps/frontend/public/assets/group3"
MANIFEST = ASSET_ROOT / "audio/manifest.json"
VOICE_CAST = ROOT / "apps/frontend/src/surfaces/group-3-8104/services/audio/voice-cast.json"
STAGING_ROOT = ASSET_ROOT / ".voice-persona-staging"
BACKUP_ROOT = ASSET_ROOT / ".voice-persona-backup"
MAX_CONCURRENT_REQUESTS = 3
MAX_ATTEMPTS = 3
SYNTHESIS_TIMEOUT_SECONDS = 45
MIN_AUDIO_BYTES = 1_000

VOICE_CAST_DATA = json.loads(VOICE_CAST.read_text(encoding="utf-8"))
VOICE_PROFILES = VOICE_CAST_DATA["profiles"]
LOUDNESS_TARGET_LUFS = VOICE_CAST_DATA["loudnessTargetLufs"]
MIXED_LINE_PROFILES = {"h2l5-family-greeting-02": ("bai", "annie")}

LINES = [
    ('cup-01', 'wang', '请问，有杯子吗？'),
    ('cup-02', 'shopAssistant', '有，杯子在这边。'),
    ('cup-03', 'wang', '多少钱一个？'),
    ('cup-04', 'shopAssistant', '这些五块钱一个，那些十块钱一个。'),
    ('cup-05', 'wang', '我买这个吧。'),
    ('fruit-01', 'wang', '这儿的水果真不少！'),
    ('fruit-02', 'fruitVendor', '您想买什么？'),
    ('fruit-03', 'wang', '我想买两斤苹果。'),
    ('fruit-04', 'fruitVendor', '苹果三块五一斤。这些七块二，七块钱吧。'),
    ('fruit-05', 'wang', '好的，这儿的苹果真便宜！'),
    ('clothes-01', 'wang', '这家商店衣服真多！这件一百元，怎么样？'),
    ('clothes-02', 'liu', '好看，也不贵。'),
    ('clothes-03', 'wang', '小雪能穿，买一件吧。'),
    ('clothes-04', 'liu', '好的。小明能穿吗？'),
    ('clothes-05', 'wang', '不能。这些是女孩子穿的衣服，男孩子的衣服在那儿。'),
    ('clothes-06', 'liu', '好的。'),
    ('l13-classroom-01', 'bai', '王老师，我可以再问您一个问题吗？'),
    ('l13-classroom-02', 'teacherWang', '可以。你有什么问题？'),
    ('l13-classroom-03', 'bai', '那个小店卖不卖手机？'),
    ('l13-classroom-04', 'teacherWang', '我不知道。你可以打电话问一下。'),
    ('l13-cafe-01', 'cafeServer', '女士，请坐！您喝什么？'),
    ('l13-cafe-02', 'wang', '我看一下。请给我一杯牛奶。'),
    ('l13-cafe-03', 'cafeServer', '好的。您还要什么？'),
    ('l13-cafe-04', 'wang', '我还没吃早饭，再要这个面包和鸡蛋吧。'),
    ('l13-dumplings-01', 'restaurantServer', '先生，请坐！您要什么？'),
    ('l13-dumplings-02', 'liu', '我要一斤饺子。'),
    ('l13-dumplings-03', 'restaurantServer', '好的。一斤饺子40个。'),
    ('l13-dumplings-04', 'liu', '40个太多了，我要一半吧。'),
    ('l13-dumplings-05', 'restaurantServer', '半斤20个。您想喝什么？'),
    ('l13-dumplings-06', 'liu', '请给我一杯茶吧。'),
    ('l1-airport-01', 'bai', '请问，您是王一飞老师的姐姐吗？'),
    ('l1-airport-02', 'wang', '是的，你们就是她的学生吧？'),
    ('l1-airport-03', 'bai', '对。我是白家月，她是安妮。'),
    ('l1-airport-04', 'wang', '你们好，我叫王一雪。一飞给我打电话了，让我来接你们。'),
    ('l1-airport-05', 'bai', '谢谢您！'),
    ('l1-airport-06', 'wang', '不客气。'),
    ('l1-car-01', 'wang', '你们是第一次来北京吗？'),
    ('l1-car-02', 'bai', '是的，我们都是第一次来。'),
    ('l1-car-03', 'wang', '你们是来学中文的吗？'),
    ('l1-car-04', 'annie', '不是，我们是来旅游的。'),
    ('l1-car-05', 'wang', '我这几天都不忙，你们有事就找我。'),
    ('l1-car-06', 'bai', '好的，谢谢您。'),
    ('l1-call-01', 'chen', '喂，家月，你明天有时间吗？我想请你帮个忙。'),
    ('l1-call-02', 'bai', '不好意思，天中，我已经到北京了。'),
    ('l1-call-03', 'chen', '你是什么时候到的？'),
    ('l1-call-04', 'bai', '我是今天早上到的。你有事可以叫李文帮忙，他还在学校呢。'),
    ('l1-call-05', 'chen', '好的，那我给他打个电话。'),
    ('l1-call-06', 'bai', '好，再见！'),
    ('l4-mall-01', 'liuXiaoxue', '妈妈，我们来过这家商场吗？'),
    ('l4-mall-02', 'wang', '没来过，这是新开的。'),
    ('l4-mall-03', 'liuXiaoxue', '我们进去看看吧。'),
    ('l4-mall-04', 'wang', '好啊！你想买点儿什么？'),
    ('l4-mall-05', 'liuXiaoxue', '我想买条裤子。'),
    ('l4-mall-06', 'wang', '没问题。'),
    ('l4-pants-01', 'liuXiaoxue', '妈妈，我想买这条白色的裤子。'),
    ('l4-pants-02', 'wang', '你有很多白色的衣服，为什么还买白色的？'),
    ('l4-pants-03', 'liuXiaoxue', '因为我喜欢白色啊！'),
    ('l4-pants-04', 'wang', '我觉得这条白色的不太好看，你试试那条红色的吧。'),
    ('l4-pants-05', 'liuXiaoxue', '我没穿过红色的，红色的好看吗？'),
    ('l4-pants-06', 'wang', '就是因为没穿过，所以要试试啊！'),
    ('l4-schoolbag-01', 'liuXiaoxue', '妈妈，我想买个新书包。'),
    ('l4-schoolbag-02', 'wang', '好，那边卖书包，我们过去看看吧。'),
    ('l4-schoolbag-03', 'liuXiaoxue', '这么多漂亮的书包！'),
    ('l4-schoolbag-04', 'wang', '红色的、绿色的、黑色的，你想买哪个？'),
    ('l4-schoolbag-05', 'liuXiaoxue', '绿色的吧。'),
    ('l4-schoolbag-06', 'wang', '不错，我也觉得绿色的更好看。'),
    ('l9-store-01', 'wang', '儿子的裤子坏了，我们给他买条新的吧。'),
    ('l9-store-02', 'liu', '好啊。'),
    ('l9-store-03', 'wang', '你看这条黑色的怎么样？'),
    ('l9-store-04', 'liu', '没有你上次买的那条好看。'),
    ('l9-store-05', 'wang', '旁边那个男孩儿就穿了这样的裤子，我觉得很好看啊！'),
    ('l9-store-06', 'liu', '儿子的个子没有他那么高，穿上就不会太好看了。'),
    ('l9-store-07', 'wang', '好吧，我们再去那边看看吧。'),
    ('l9-entrance-01', 'wang', '门口有家奶茶店。你想喝杯奶茶吗？'),
    ('l9-entrance-02', 'liu', '我想喝咖啡，还是去咖啡店吧。'),
    ('l9-entrance-03', 'wang', '咖啡店离这儿有点儿远。'),
    ('l9-entrance-04', 'liu', '没关系，那家店的咖啡很好喝。'),
    ('l9-entrance-05', 'wang', '那你等一下，我去买杯奶茶。'),
    ('l9-entrance-06', 'liu', '你不想喝咖啡吗？'),
    ('l9-entrance-07', 'wang', '喝了咖啡，晚上就别想睡觉了。'),
    ('l9-coffee-01', 'liu', '我们打车回去吧。'),
    ('l9-coffee-02', 'wang', '这里离家很近，还是走路吧。'),
    ('l9-coffee-03', 'liu', '要走多长时间？'),
    ('l9-coffee-04', 'wang', '走半个多小时就到了。'),
    ('l9-coffee-05', 'liu', '好的。每天上下班都坐车，今天运动运动吧。'),
    ('l11-classroom-01', 'teacherWang', '家月，都下课了，你怎么还不回家？'),
    ('l11-classroom-02', 'bai', '我头疼，不太舒服。'),
    ('l11-classroom-03', 'teacherWang', '你这几天经常头疼，去医院看看吧。'),
    ('l11-classroom-04', 'bai', '我想休息一下，现在不能动。'),
    ('l11-classroom-05', 'teacherWang', '那你在这儿坐着，我去开车，一会儿送你去医院。'),
    ('l11-classroom-06', 'bai', '谢谢王老师。'),
    ('l11-car-01', 'teacherWang', '现在路上车多，还下着雪，我开慢一点儿。'),
    ('l11-car-02', 'bai', '没问题，现在头没那么疼了。'),
    ('l11-car-03', 'teacherWang', '好。李文来电话了，你帮我接一下。'),
    ('l11-car-04', 'bai', '喂，李文，王老师开着车呢，你找她有事吗？'),
    ('l11-car-05', 'liWen', '没什么事。今天雪这么大，你们开车去哪儿啊？'),
    ('l11-car-06', 'bai', '去医院，我头有点儿疼。'),
    ('l11-car-07', 'liWen', '那我一会儿去看看你。'),
    ('l11-room-01', 'bai', '李文，快请进！'),
    ('l11-room-02', 'liWen', '家月，你怎么样了？头还疼吗？'),
    ('l11-room-03', 'bai', '不那么疼了。医生开了一些药，吃完就好多了。'),
    ('l11-room-04', 'liWen', '那就好！'),
    ('l11-room-05', 'teacherWang', '家月，你想不想吃点儿东西？你最喜欢吃中国菜，我做几个中国菜吧。'),
    ('l11-room-06', 'bai', '好的，谢谢王老师。'),
    ('l2-menu-01', 'wang', '家月、李文，你们看看菜单，想吃点儿什么？'),
    ('l2-menu-02', 'liWen', '谢谢一雪姐，我都可以，你们点吧。'),
    ('l2-menu-03', 'bai', '飞了这么远，现在还真是又饿又渴。'),
    ('l2-menu-04', 'wang', '那多点点儿，别客气。你们喝什么饮料？'),
    ('l2-menu-05', 'bai', '好久没喝中国茶，也好久没吃饺子了。我想喝绿茶、吃饺子，可以吗？'),
    ('l2-menu-06', 'wang', '没问题。你们看看还想吃什么。'),
    ('l2-restaurant-01', 'wang', '服务员，再给我们拿一双筷子、一个勺子和一个碗。'),
    ('l2-restaurant-02', 'shopServer', '好的，请等一下，我马上去拿。'),
    ('l2-restaurant-03', 'wang', '这家饭馆的服务很热情，菜也都做得很好吃。你们尝尝，看喜不喜欢这些菜。'),
    ('l2-restaurant-04', 'bai', '哪个菜都好吃。您点的这些菜真不错。'),
    ('l2-restaurant-05', 'wang', '这里的饭菜又便宜又好吃，我们经常来，服务员都记住我们爱吃的菜了。'),
    ('l2-restaurant-06', 'shopServer', '王姐，您经常来吃饭，今天送您一些水果，请慢用。'),
    ('l2-takeout-01', 'bai', '这个鸡肉饭太好吃了，我要再来吃一次。'),
    ('l2-takeout-02', 'liWen', '你可以拿走这张菜单，看看下次还吃点儿什么。'),
    ('l2-takeout-03', 'wang', '不用拿菜单，在手机上就能看到，也可以选好了让他们给你送。'),
    ('l2-takeout-04', 'bai', '他们家还能送外卖？'),
    ('l2-takeout-05', 'wang', '对，现在很多饭馆都能送外卖，想吃什么就点什么。'),
    ('l2-takeout-06', 'bai', '那真是太方便了！'),
    ('l7-bike-01', 'liu', '一雪，你来这儿干什么？'),
    ('l7-bike-02', 'wang', '我来看自行车。孩子刚学会骑自行车，想给他买一辆。'),
    ('l7-bike-03', 'liu', '这家店卖自行车吗？我看这里都是电动车。'),
    ('l7-bike-04', 'wang', '老师，那边有自行车，我们去那边看看吧。'),
    ('l7-bike-05', 'bikeShop', '您好，两位顾客，您要买自行车吗？欢迎看看我们的车，价钱便宜。'),
    ('l7-bike-06', 'wang', '那辆黄色的自行车不错。老师，您帮我看看，挑一辆吧。'),
    ('l7-skirt-01', 'liu', '这家衣服店很大，我们进去看看吧。'),
    ('l7-skirt-02', 'liu', '那条红色的裙子很好看，你穿上也一定好看。'),
    ('l7-skirt-03', 'wang', '那条红裙子比那条白的好看，也比那条蓝的便宜。'),
    ('l7-skirt-04', 'liu', '颜色和价钱都很合适。你试试吧。'),
    ('l7-skirt-05', 'wang', '好的。…我穿着这条裙子正好，也很舒服。'),
    ('l7-skirt-06', 'liu', '你穿着这条裙子也很好看，那就买这条吧。'),
    ('l7-fruit-01', 'fruitVendor', '您们好，买水果吗？我们店的水果特别好，价钱也很便宜。'),
    ('l7-fruit-02', 'liu', '这种水果叫什么名字？怎么以前没见过？'),
    ('l7-fruit-03', 'fruitVendor', '这叫葡萄，是新疆的特产。你看，这里的葡萄又大又甜。'),
    ('l7-fruit-04', 'wang', '真的很大很甜！这种葡萄不但好吃，而且价钱不贵。'),
    ('l7-fruit-05', 'liu', '而且很新鲜，我们买一些吧。'),
    ('l7-fruit-06', 'wang', '好，就买这个了。'),
    ('h1l1-office-01', 'teacherWang', 'AI小语，你好！'),
    ('h1l1-office-02', 'xiaoyu', '王老师，你好！'),
    ('h1l1-classroom-01', 'teacherWang', '大家好！'),
    ('h1l1-classroom-02', 'students', '老师，您好！'),
    ('h1l1-classroom-03', 'xiaoyu', '你们好！'),
    ('h1l1-classroom-04', 'students', '你好，小语！'),
    ('h1l1-farewell-01', 'students', '谢谢！'),
    ('h1l1-farewell-02', 'xiaoyu', '不客气！'),
    ('h1l1-farewell-03', 'teacherWang', '同学们，再见！'),
    ('h1l1-farewell-04', 'students', '老师，再见！'),
    ('h1l2-classroom-01', 'teacherWang', '请问，你叫什么名字？'),
    ('h1l2-classroom-02', 'chen', '我叫陈天中。'),
    ('h1l2-campus-01', 'chen', '你好，安妮！'),
    ('h1l2-campus-02', 'bai', '你好，陈天中！我不是安妮，我是白家月。'),
    ('h1l2-campus-03', 'chen', '对不起！'),
    ('h1l2-campus-04', 'bai', '没关系！'),
    ('h1l2-firstmeet-01', 'liWen', '你好！我叫李文。'),
    ('h1l2-firstmeet-02', 'bai', '你好！我叫白家月。'),
    ('h1l2-firstmeet-03', 'liWen', '很高兴认识你。'),
    ('h1l2-firstmeet-04', 'bai', '认识你我也很高兴。'),
    ('h1l3-campus-01', 'liWen', '我是中国人。'),
    ('h1l3-campus-02', 'bai', '我是法国人。我的中文老师也是中国人。'),
    ('h1l3-photos-01', 'annie', '这是谁？'),
    ('h1l3-photos-02', 'chen', '这是我女朋友。'),
    ('h1l3-photos-03', 'annie', '你女朋友是哪国人？'),
    ('h1l3-photos-04', 'chen', '她也是泰国人。'),
    ('h1l3-videocall-01', 'wang', '喂，一飞！'),
    ('h1l3-videocall-02', 'teacherWang', '姐姐！'),
    ('h1l3-videocall-03', 'wang', '你工作还忙吗？'),
    ('h1l3-videocall-04', 'teacherWang', '对，还很忙。你也很忙吗？'),
    ('h1l3-videocall-05', 'wang', '我不太忙。我们很想你。'),
    ('h1l3-videocall-06', 'teacherWang', '我也想你们。'),
    ('h1l4-home-01', 'liu', '一飞忙吗？'),
    ('h1l4-home-02', 'wang', '她很忙。'),
    ('h1l4-home-03', 'liu', '她有多少个学生？'),
    ('h1l4-home-04', 'wang', '她有二十个学生。'),
    ('h1l4-company-01', 'wang', '我有两个哥哥，你呢？'),
    ('h1l4-company-02', 'yang', '我没有哥哥。'),
    ('h1l4-company-03', 'wang', '你家有几口人？'),
    ('h1l4-company-04', 'yang', '我家有四口人，爸爸、妈妈、妹妹和我。'),
    ('h1l4-street-01', 'yang', '这是您儿子吗？'),
    ('h1l4-street-02', 'wang', '是的。我有两个孩子，一个儿子，一个女儿。'),
    ('h1l4-street-03', 'yang', '您儿子几岁？'),
    ('h1l4-street-04', 'wang', '他今年五岁。'),
    ('h1l4-street-05', 'yang', '您女儿多大？'),
    ('h1l4-street-06', 'wang', '她今年十二。'),
    ('h1l5-home-01', 'wang', '今天几号？'),
    ('h1l5-home-02', 'liu', '今天9月8号。'),
    ('h1l5-home-03', 'wang', '星期几？'),
    ('h1l5-home-04', 'liu', '星期日。今天我休息。'),
    ('h1l5-cooking-01', 'wang', '你会做饭吗？'),
    ('h1l5-cooking-02', 'yang', '我会做。'),
    ('h1l5-cooking-03', 'wang', '你会做什么？'),
    ('h1l5-cooking-04', 'yang', '我会做面条儿、饺子，也会做一些菜。星期天我也做饭。'),
    ('h1l5-computer-01', 'wang', '同乐，下班吗？'),
    ('h1l5-computer-02', 'yang', '下班。'),
    ('h1l5-computer-03', 'wang', '这是你的新电脑吗？'),
    ('h1l5-computer-04', 'yang', '是的，是我的新电脑。'),
    ('h1l5-computer-05', 'wang', '真好看！'),
    ('h1l5-computer-06', 'yang', '我也很喜欢它。'),
    ('h1l6-number-01', 'liWen', '家月，你的手机号是多少？'),
    ('h1l6-number-02', 'bai', '我的手机号是33601493190。'),
    ('h1l6-number-03', 'liWen', '我的手机号是8613552721160。'),
    ('h1l6-number-04', 'bai', '好的。'),
    ('h1l6-supermarket-01', 'chen', '家月，明天你去哪儿？'),
    ('h1l6-supermarket-02', 'bai', '我想去超市买东西。'),
    ('h1l6-supermarket-03', 'chen', '你去超市买什么？'),
    ('h1l6-supermarket-04', 'bai', '我想买些牛奶。'),
    ('h1l6-family-01', 'wang', '星期天我们去哪儿吃晚饭？'),
    ('h1l6-family-02', 'liu', '我还想去西安饭店。'),
    ('h1l6-family-03', 'liuXiaoxue', '那边的包子非常好吃，我想吃包子。'),
    ('h1l6-family-04', 'liuXiaoming', '妈妈，我想吃米饭，不想吃包子。'),
    ('h1l6-family-05', 'wang', '好的。我们怎么去？'),
    ('h1l6-family-06', 'liu', '坐出租车去。'),
    ('h1l7-time-01', 'bai', '现在几点？'),
    ('h1l7-time-02', 'annie', '早上八点四十。'),
    ('h1l7-time-03', 'bai', '我上午十点十分有课。'),
    ('h1l7-time-04', 'annie', '好的，我们下午两点见吧。'),
    ('h1l7-cinema-01', 'liWen', '下午我想去电影院看电影，你去吗？'),
    ('h1l7-cinema-02', 'bai', '我不想去，下午还有事。'),
    ('h1l7-cinema-03', 'liWen', '好的。明天呢？'),
    ('h1l7-cinema-04', 'bai', '我明天下午两点还上课呢，四点半下课。'),
    ('h1l7-evening-01', 'wang', '喂，你在哪儿呢？'),
    ('h1l7-evening-02', 'liu', '我在家里呢。'),
    ('h1l7-evening-03', 'wang', '我晚上六点半下班。'),
    ('h1l7-evening-04', 'liu', '我八点去医院上班。'),
    ('h1l7-evening-05', 'wang', '好的，你去店里买些菜吧。'),
    ('h1l7-evening-06', 'liu', '好，我十分钟后去。'),
    ('h1l8-cat-01', 'bai', '房间外有一只小猫。'),
    ('h1l8-cat-02', 'chen', '我没看见，它在哪儿呢？'),
    ('h1l8-cat-03', 'bai', '它在桌子下呢。'),
    ('h1l8-cat-04', 'chen', '这只小猫真漂亮！'),
    ('h1l8-bookstore-01', 'bai', '我们在哪儿见呢？'),
    ('h1l8-bookstore-02', 'liWen', '在学校书店前见吧。'),
    ('h1l8-bookstore-03', 'bai', '好的。下午两点你能到吗？'),
    ('h1l8-bookstore-04', 'liWen', '我能到。我在学校吃午饭。'),
    ('h1l8-hospital-01', 'liu', '小胡，还没吃饭呢？'),
    ('h1l8-hospital-02', 'hu', '没吃呢。'),
    ('h1l8-hospital-03', 'liu', '大医院病人多，医生非常忙。'),
    ('h1l8-hospital-04', 'hu', '是的。我爸爸也在医院工作，他也非常忙。'),
    ('h1l8-hospital-05', 'liu', '你家有两个医生？'),
    ('h1l8-hospital-06', 'hu', '对。'),
    ('h1l9-front-01', 'liWen', '学校前边有一家电影院。'),
    ('h1l9-front-02', 'bai', '对。我们晚上去那个电影院看电影吧。'),
    ('h1l9-front-03', 'liWen', '好！我们七点在电影院外边见，好吗？'),
    ('h1l9-front-04', 'bai', '好的，晚上七点见！'),
    ('h1l9-book-01', 'bai', '椅子上有一本中文书，那是谁的书？'),
    ('h1l9-book-02', 'chen', '是我的书，谢谢。这是我的第二本中文书。'),
    ('h1l9-book-03', 'bai', '不客气。你明天上午在哪儿？'),
    ('h1l9-book-04', 'chen', '我明天上午在学校学习。'),
    ('h1l9-saturday-01', 'wang', '明天星期六，你做什么？'),
    ('h1l9-saturday-02', 'yang', '我白天在家里读书，晚上和朋友们去外边唱歌。'),
    ('h1l9-saturday-03', 'wang', '你唱歌很好听。'),
    ('h1l9-saturday-04', 'yang', '谢谢！您星期六做什么？'),
    ('h1l9-saturday-05', 'wang', '我在家里做饭、看电视，和孩子们、小狗玩。'),
    ('h1l9-saturday-06', 'yang', '我也有一只小狗。'),
    ('h1l11-taxi-01', 'teacherWang', '喂，李文，你什么时候能到饭店？'),
    ('h1l11-taxi-02', 'liWen', '还不知道，正在找呢。它是不是在超市后边？'),
    ('h1l11-taxi-03', 'teacherWang', '是的。你开车没开车？'),
    ('h1l11-taxi-04', 'liWen', '我没开车，坐车呢。'),
    ('h1l11-restaurant-01', 'teacherWang', '你还在读大学吗？'),
    ('h1l11-restaurant-02', 'liWen', '对，我读大学呢，还是大学生。'),
    ('h1l11-restaurant-03', 'teacherWang', '你们学习忙不忙？'),
    ('h1l11-restaurant-04', 'liWen', '非常忙，我学医，我们的课很多。'),
    ('h1l11-brother-01', 'liu', '弟弟起床没起床呢？'),
    ('h1l11-brother-02', 'liuXiaoxue', '没起床呢，还在睡觉。'),
    ('h1l11-brother-03', 'liu', '还睡呢？他今天去不去那里？'),
    ('h1l11-brother-04', 'liuXiaoxue', '去哪里？'),
    ('h1l11-brother-05', 'liu', '去超市。'),
    ('h1l11-brother-06', 'liuXiaoxue', '我昨天问他，他对我说，他不去，他今天要和小朋友玩。'),
    ('h1l12-weather-01', 'wang', '今天天气怎么样？'),
    ('h1l12-weather-02', 'teacherWang', '这里的天不太好，下雨了。'),
    ('h1l12-weather-03', 'wang', '雨大吗？'),
    ('h1l12-weather-04', 'teacherWang', '有点儿大，我觉得很冷。'),
    ('h1l12-elevator-01', 'wang', '昨天下雪了。'),
    ('h1l12-elevator-02', 'yang', '是的，太冷了。'),
    ('h1l12-elevator-03', 'wang', '你昨天没来公司，生病了？'),
    ('h1l12-elevator-04', 'yang', '对，我昨天去医院看病了。'),
    ('h1l12-doctor-01', 'yang', '医生，我病了。'),
    ('h1l12-doctor-02', 'hu', '我看看。你觉得怎么样？'),
    ('h1l12-doctor-03', 'yang', '我很冷。'),
    ('h1l12-doctor-04', 'hu', '好的，吃一点儿药，今天休息半天吧。'),
    ('h1l12-doctor-05', 'yang', '好的。'),
    ('h1l12-doctor-06', 'hu', '回家后再喝些热水。'),
    ('h1l14-train-01', 'bai', '你们上火车后看见王老师了吗？'),
    ('h1l14-train-02', 'chen', '没看见。中午车开后，有些人在看书，有些人睡觉了。'),
    ('h1l14-train-03', 'bai', '你呢？'),
    ('h1l14-train-04', 'chen', '我看了一个电影。'),
    ('h1l14-classroom-01', 'teacherWang', '你们会说汉语了，也会写汉字了吗？'),
    ('h1l14-classroom-02', 'bai', '我们都会写了。'),
    ('h1l14-classroom-03', 'chen', '老师，我听不见。'),
    ('h1l14-classroom-04', 'teacherWang', '请大家不要说话！请听老师的问题：你们都会写哪些汉字了？'),
    ('h1l14-classroom-05', 'chen', '我会写这些字了，您看！'),
    ('h1l14-family-01', 'liu', '明年女儿上中学。'),
    ('h1l14-family-02', 'wang', '对。儿子也上小学了。'),
    ('h1l14-family-03', 'liu', '我们家有了一个中学生。'),
    ('h1l14-family-04', 'wang', '还有了一个小学生。'),
    ('h1l14-family-05', 'liu', '上学后，他们都忙了。'),
    ('h1l14-family-06', 'wang', '是的。太晚了，睡觉吧。'),
    ('h1l15-meal-01', 'liWen', '你们爱吃哪个菜？'),
    ('h1l15-meal-02', 'bai', '我喜欢这个，也喜欢那个。'),
    ('h1l15-meal-03', 'chen', '这些菜都好吃，还很好看。'),
    ('h1l15-meal-04', 'liWen', '我爱吃中国菜，也喜欢做。大家多吃点儿。'),
    ('h1l15-travel-01', 'liWen', '你们都想去哪儿？'),
    ('h1l15-travel-02', 'annie', '去年我和男朋友去了西安，今年我想去北京。'),
    ('h1l15-travel-03', 'bai', '前几年我去了西安，非常好玩儿。今年我也想去北京。'),
    ('h1l15-travel-04', 'liWen', '我和王老师都是北京人，北京非常漂亮。'),
    ('h1l15-airport-01', 'teacherWang', '你们的飞机到北京要几个小时？'),
    ('h1l15-airport-02', 'bai', '九个小时。'),
    ('h1l15-airport-03', 'teacherWang', '我家人都在北京，星期天我姐姐也有时间，她可以去机场接你们，你们也可以住我家。'),
    ('h1l15-airport-04', 'annie', '我们星期日早上八点到大兴机场，早不早？'),
    ('h1l15-airport-05', 'teacherWang', '不早。'),
    ('h1l15-airport-06', 'bai', '谢谢老师！那我们和您姐姐在大兴机场见！'),
    ('h2l2-hotel-01', 'bai', '请问，这儿有到北京大学的公交车吗？'),
    ('h2l2-hotel-02', 'hotelReceptionist', '有，但车站有点儿远。'),
    ('h2l2-hotel-03', 'bai', '这儿好打车吗？'),
    ('h2l2-hotel-04', 'hotelReceptionist', '好打车。'),
    ('h2l2-hotel-05', 'bai', '谢谢。安妮，我们还是打车去吧。'),
    ('h2l2-hotel-06', 'annie', '好，没问题。'),
    ('h2l2-campus-01', 'bai', '学校里人真多啊！'),
    ('h2l2-campus-02', 'annie', '是啊，北京大学有四万多名学生呢！'),
    ('h2l2-campus-03', 'bai', '你是怎么知道的？'),
    ('h2l2-campus-04', 'annie', '是网上说的，网上还说北京大学有三千多名外国学生。'),
    ('h2l2-campus-05', 'bai', '我也想来这儿学习。'),
    ('h2l2-campus-06', 'annie', '那边就有一间教室，我们去看一下吧。'),
    ('h2l2-cinema-01', 'annie', '家月，你看，学校里有家电影院！'),
    ('h2l2-cinema-02', 'bai', '是啊，电影院还不小。'),
    ('h2l2-cinema-03', 'annie', '他们卖的电影票也很便宜。'),
    ('h2l2-cinema-04', 'bai', '天啊！有的还不到二十块钱。'),
    ('h2l2-cinema-05', 'annie', '那你想不想去看个电影？'),
    ('h2l2-cinema-06', 'bai', '还是别看电影了，北京大学就很好看！'),
    ('h2l3-homecoming-01', 'wang', '今天回来这么晚啊！'),
    ('h2l3-homecoming-02', 'liu', '工作太多了，下班的时候没做完。'),
    ('h2l3-homecoming-03', 'wang', '菜都做好了，过来吃饭吧。'),
    ('h2l3-homecoming-04', 'liu', '我想休息一下，喝杯水。'),
    ('h2l3-homecoming-05', 'wang', '好的。'),
    ('h2l3-travel-plan-01', 'liu', '我们找个时间去旅游，怎么样？'),
    ('h2l3-travel-plan-02', 'wang', '好啊，我也很想一起出去玩。'),
    ('h2l3-travel-plan-03', 'liu', '你想去哪儿？'),
    ('h2l3-travel-plan-04', 'wang', '我还没想好呢。'),
    ('h2l3-travel-plan-05', 'liu', '那你再想一想，你想好了，我来买票。'),
    ('h2l3-xian-plan-01', 'liu', '吃个苹果吧，我都洗好了。'),
    ('h2l3-xian-plan-02', 'wang', '好的。'),
    ('h2l3-xian-plan-03', 'liu', '就在桌子上，你自己拿。'),
    ('h2l3-xian-plan-04', 'wang', '我去洗洗手。对了，我们去西安旅游，怎么样？'),
    ('h2l3-xian-plan-05', 'liu', '为什么想去西安？'),
    ('h2l3-xian-plan-06', 'wang', '我看了看网上的介绍，这个时候去西安很不错！'),
    ('h2l5-hotel-call-01', 'annie', '家月，快下来吧，第一次去中国朋友家，别晚了。'),
    ('h2l5-hotel-call-02', 'bai', '还有时间，你上来吧。'),
    ('h2l5-hotel-call-03', 'annie', '我不上去了，就在下面等你。'),
    ('h2l5-hotel-call-04', 'bai', '那我一会儿就下去。'),
    ('h2l5-hotel-call-05', 'annie', '你快点儿吧。'),
    ('h2l5-hotel-call-06', 'bai', '没事，一雪姐说11点前到就可以。'),
    ('h2l5-family-greeting-01', 'wang', '家月，安妮，快进来！我给你们介绍一下，这是孩子们的爷爷、奶奶。'),
    ('h2l5-family-greeting-02', 'bai', '你们好！'),
    ('h2l5-family-greeting-03', 'wang', '爸、妈，这是白家月，这是安妮。她们都是一飞的学生。'),
    ('h2l5-family-greeting-04', 'grandpaLiu', '家月、安妮，你们好！'),
    ('h2l5-family-greeting-05', 'bai', '这是送你们的礼物。'),
    ('h2l5-family-greeting-06', 'grandpaLiu', '你们太客气了，还拿这么多礼物来！'),
    ('h2l5-family-greeting-07', 'bai', '一雪姐，这是给孩子们准备的礼物。'),
    ('h2l5-family-greeting-08', 'wang', '谢谢！你们别客气，快坐吧！'),
    ('h2l5-family-meal-01', 'wang', '都12点了，我们吃饭吧。'),
    ('h2l5-family-meal-02', 'bai', '这么多好吃的，您太客气了！'),
    ('h2l5-family-meal-03', 'wang', '都是我自己做的，你们多吃点儿。'),
    ('h2l5-family-meal-04', 'bai', '奶茶也很好喝，是您自己做的吗？'),
    ('h2l5-family-meal-05', 'wang', '不是，奶茶是爷爷买的。'),
    ('h2l5-family-meal-06', 'bai', '在哪儿买的？我还没喝过这么好喝的奶茶。'),
    ('h2l5-family-meal-07', 'wang', '就在前边的商场，吃完饭你们可以跟我去看看。'),
    ('h2l6-gift-plan-01', 'wang', '明天就是女儿的生日了。'),
    ('h2l6-gift-plan-02', 'liu', '你不说，我还真忘了。我们给她准备个什么礼物呢？'),
    ('h2l6-gift-plan-03', 'wang', '她喜欢画画，你觉得画笔怎么样？'),
    ('h2l6-gift-plan-04', 'liu', '就送画笔吧！'),
    ('h2l6-gift-plan-05', 'wang', '那我明天上午就去买。'),
    ('h2l6-gift-plan-06', 'liu', '好的！我再给她买个大大的生日蛋糕。'),
    ('h2l6-birthday-gift-01', 'liu', '小雪，生日快乐！'),
    ('h2l6-birthday-gift-02', 'liuXiaoming', '姐姐，生日快乐！'),
    ('h2l6-birthday-gift-03', 'wang', '小雪，这是爸爸、妈妈送你的礼物。'),
    ('h2l6-birthday-gift-04', 'liu', '你打开看看喜欢不喜欢。'),
    ('h2l6-birthday-gift-05', 'liuXiaoxue', '画笔！我很喜欢！'),
    ('h2l6-birthday-gift-06', 'wang', '那你想画点儿什么？'),
    ('h2l6-birthday-gift-07', 'liuXiaoxue', '画我们的家！有爸爸、妈妈、弟弟，还有黑色的狗、白色的猫什么的。'),
    ('h2l6-birthday-gift-08', 'liuXiaoming', '那我要画一个穿白色衣服的姐姐。'),
    ('h2l6-birthday-meal-01', 'liu', '小雪，看看今天有什么好吃的。'),
    ('h2l6-birthday-meal-02', 'liuXiaoxue', '长长的面条儿，大大的蛋糕。'),
    ('h2l6-birthday-meal-03', 'liu', '你看，还有鱼啊肉啊什么的，都是你喜欢吃的。'),
    ('h2l6-birthday-meal-04', 'liuXiaoxue', '谢谢爸爸、妈妈！'),
    ('h2l6-birthday-meal-05', 'wang', '快去叫弟弟过来吃饭吧，吃完饭我们还要出去玩呢。'),
    ('h2l6-birthday-meal-06', 'liuXiaoxue', '过生日真好啊！'),
    ('h2l6-birthday-meal-07', 'wang', '是的，过生日就要吃好吃的，还要高高兴兴地玩。'),
    ('h2l7-basketball-01', 'chen', '安妮，你是什么时候从北京回来的？'),
    ('h2l7-basketball-02', 'annie', '昨天下午。天中，你怎么一下课就往外跑？'),
    ('h2l7-basketball-03', 'chen', '我跟同学说好了，一起去打篮球。'),
    ('h2l7-basketball-04', 'annie', '我也想跟你们一起玩。'),
    ('h2l7-basketball-05', 'chen', '没问题，走吧！'),
    ('h2l7-football-01', 'annie', '天中，你是不是很喜欢打篮球？'),
    ('h2l7-football-02', 'chen', '没错。'),
    ('h2l7-football-03', 'annie', '你还喜欢什么运动？'),
    ('h2l7-football-04', 'chen', '我还喜欢踢足球，一到星期天就跟朋友们去踢球。'),
    ('h2l7-football-05', 'annie', '你踢得怎么样？'),
    ('h2l7-football-06', 'chen', '我踢得还可以。'),
    ('h2l7-swimming-01', 'chen', '你篮球打得怎么样？'),
    ('h2l7-swimming-02', 'annie', '打得还可以。'),
    ('h2l7-swimming-03', 'chen', '跑步呢？你跑得快不快？'),
    ('h2l7-swimming-04', 'annie', '我跑得不快，也不太喜欢跑步。'),
    ('h2l7-swimming-05', 'chen', '那你喜欢游泳吗？'),
    ('h2l7-swimming-06', 'annie', '喜欢，但我游泳游得不快。'),
    ('h2l8-watches-01', 'wang', '你看，这两块手表怎么样？'),
    ('h2l8-watches-02', 'liu', '都不错！'),
    ('h2l8-watches-03', 'wang', '我喜欢左边这个。'),
    ('h2l8-watches-04', 'liu', '我也觉得左边的比右边的好看。'),
    ('h2l8-watches-05', 'wang', '你看看要多少钱！'),
    ('h2l8-watches-06', 'liu', '真不便宜！八千八！'),
    ('h2l8-cinema-01', 'liu', '今天有不少电影，我们看个电影吧。'),
    ('h2l8-cinema-02', 'wang', '好啊！我们看哪个？'),
    ('h2l8-cinema-03', 'liu', '我记得你喜欢看爱情片，我们看那个爱情片，怎么样？'),
    ('h2l8-cinema-04', 'wang', '还是看这个吧，我看网上说这个电影比那个爱情片更有意思。'),
    ('h2l8-cinema-05', 'liu', '好。我去买票。'),
    ('h2l8-cinema-06', 'wang', '到网上买吧，网上买比在这里买便宜。'),
    ('h2l8-birthday-01', 'liu', '您好！就要这几个菜吧，谢谢！'),
    ('h2l8-birthday-02', 'wang', '怎么点这么多菜？'),
    ('h2l8-birthday-03', 'liu', '你想想，今天是几月几号？'),
    ('h2l8-birthday-04', 'wang', '8月27号。啊！我的生日！'),
    ('h2l8-birthday-05', 'liu', '生日快乐！虽然你忘了，但是我记得。看看这是什么？'),
    ('h2l8-birthday-06', 'wang', '手表！吃饭、看电影、买手表，今天花了不少钱吧？'),
    ('h2l8-birthday-07', 'liu', '虽然花了一些钱，但是我们过了一个快乐的生日。'),
    ('h2l10-school-prep-01', 'liu', '小明，你们明天开学，你准备好了吗？'),
    ('h2l10-school-prep-02', 'liuXiaoming', '明天就开学啊？爸爸，我的书包你看见了吗？'),
    ('h2l10-school-prep-03', 'liu', '书包在门后面。'),
    ('h2l10-school-prep-04', 'liuXiaoming', '书在哪儿呢？笔呢？'),
    ('h2l10-school-prep-05', 'liu', '书在床上，笔在桌子上。'),
    ('h2l10-school-prep-06', 'liuXiaoming', '太好了！现在都准备好了。'),
    ('h2l10-school-prep-07', 'liu', '这次爸爸帮你，下次你自己准备，好不好？'),
    ('h2l10-school-prep-08', 'liuXiaoming', '好！'),
    ('h2l10-exam-review-01', 'wang', '小雪，你在做什么呢？'),
    ('h2l10-exam-review-02', 'liuXiaoxue', '明天考试，我在看书呢。'),
    ('h2l10-exam-review-03', 'wang', '这些词要好好看看。'),
    ('h2l10-exam-review-04', 'liuXiaoxue', '我看过了，意思也都懂了。'),
    ('h2l10-exam-review-05', 'wang', '你的本子呢？本子上做错的题也要看一看。'),
    ('h2l10-exam-review-06', 'liuXiaoxue', '妈妈，是您准备考试还是我准备考试？'),
    ('h2l10-homecoming-01', 'liuXiaoxue', '妈妈，我回来了！'),
    ('h2l10-homecoming-02', 'wang', '我买了奶茶，就在桌子上，自己去拿吧。'),
    ('h2l10-homecoming-03', 'liuXiaoxue', '谢谢妈妈！'),
    ('h2l10-homecoming-04', 'wang', '今天考试考得怎么样？'),
    ('h2l10-homecoming-05', 'liuXiaoxue', '我觉得比上次好。'),
    ('h2l10-homecoming-06', 'wang', '真不错！饭菜快要做好了，你叫弟弟一起去洗手吧。'),
    ('h2l10-homecoming-07', 'liuXiaoming', '妈妈，我是第一名，姐姐还没洗完呢。'),
    ('h2l10-homecoming-08', 'wang', '你洗得真快啊！'),
    ('h2l12-weather-call-01', 'wang', '喂，家月，是你啊！有什么事情吗？'),
    ('h2l12-weather-call-02', 'bai', '没什么事，就想跟您说说话。'),
    ('h2l12-weather-call-03', 'wang', '好啊。你今天没课吗？'),
    ('h2l12-weather-call-04', 'bai', '下午有课。您那里天气怎么样？'),
    ('h2l12-weather-call-05', 'wang', '北京这几天虽然是晴天，但是有点儿冷。'),
    ('h2l12-weather-call-06', 'bai', '我这里比北京冷多了，外边还正下着雪呢！'),
    ('h2l12-snow-call-01', 'wang', '喂，一飞，听家月说你那边下雪了，下得大不大？'),
    ('h2l12-snow-call-02', 'teacherWang', '今天不大，昨天比今天下得大。'),
    ('h2l12-snow-call-03', 'wang', '天气不好，你去外面的时候多穿点儿衣服。'),
    ('h2l12-snow-call-04', 'teacherWang', '这几天我在网上上课，没出去过。'),
    ('h2l12-snow-call-05', 'wang', '那就好，有事记得给我打电话。'),
    ('h2l12-snow-call-06', 'teacherWang', '好的。现在不下雪了，我出去买点儿吃的。'),
    ('h2l12-snow-call-07', 'wang', '一次多买点儿，阴天下雪什么的就少出去吧。'),
    ('h2l12-running-01', 'liWen', '喂，家月，今天天气不错，我们去跑步吧！'),
    ('h2l12-running-02', 'bai', '你跑步跑得比我快，我们能一起跑吗？'),
    ('h2l12-running-03', 'liWen', '可以的，我慢慢跑，等着你。'),
    ('h2l12-running-04', 'bai', '好吧。你真爱跑步啊！'),
    ('h2l12-running-05', 'liWen', '我从小就经常跟爸爸跑步，跑步能让人快乐！'),
    ('h2l12-running-06', 'bai', '好，那我准备一下。'),
    ('h2l12-running-07', 'liWen', '我现在坐地铁去找你，一会儿楼下见。'),
    ('h2l13-new-year-flowers-01', 'bai', '时间过得真快啊！新年就要到了。'),
    ('h2l13-new-year-flowers-02', 'chen', '这一年王老师教我们中文，每天工作都很累。'),
    ('h2l13-new-year-flowers-03', 'bai', '是啊，她教得很好。因为她，我们都非常爱上中文课。'),
    ('h2l13-new-year-flowers-04', 'chen', '我们给她准备个新年礼物吧。你觉得送给她什么好呢？'),
    ('h2l13-new-year-flowers-05', 'bai', '王老师喜欢花，就送给她花吧。'),
    ('h2l13-new-year-flowers-06', 'chen', '那我们去花店看看，现在买花的人多，希望花店还有漂亮的花。'),
    ('h2l13-classroom-characters-01', 'bai', '王老师，今天的词比昨天多了十个。'),
    ('h2l13-classroom-characters-02', 'teacherWang', '是啊！你们都学会了吗？'),
    ('h2l13-classroom-characters-03', 'annie', '学会了，没有问题。'),
    ('h2l13-classroom-characters-04', 'teacherWang', '好。现在我来说，你们在本子上面写。'),
    ('h2l13-classroom-characters-05', 'teacherWang', '同学们，“洗手间”的“间”字写错了，它的里面是“日”，不是“口”。'),
    ('h2l13-classroom-characters-06', 'bai', '“日”比“口”多一笔，写“口”就是“问题”的“问”了。'),
    ('h2l13-classroom-characters-07', 'teacherWang', '没错，你说得很对。'),
    ('h2l13-notebook-gift-01', 'annie', '家月，你觉得这个本子怎么样？'),
    ('h2l13-notebook-gift-02', 'bai', '很漂亮，多少钱一个？'),
    ('h2l13-notebook-gift-03', 'annie', '比我们一起买的那个本子贵一点儿。'),
    ('h2l13-notebook-gift-04', 'bai', '这么漂亮的本子，不可能贵一点儿吧？'),
    ('h2l13-notebook-gift-05', 'annie', '我是上网买的，真没那么贵。我买了两个，送你一个。'),
    ('h2l13-notebook-gift-06', 'bai', '谢谢！那我送给你什么呢？'),
    ('h2l13-notebook-gift-07', 'annie', '咖啡杯吧，我最喜欢喝咖啡了。'),
    ('h2l13-notebook-gift-08', 'bai', '好，那样我们就都有新年礼物了！'),
    ('h2l14-downstairs-visitor-01', 'liWen', '王老师，你家楼下站着一个人。'),
    ('h2l14-downstairs-visitor-02', 'teacherWang', '我家楼下？我看看。'),
    ('h2l14-downstairs-visitor-03', 'liWen', '那个人穿着黑色的裤子，手里还拿着一个黑色的包。'),
    ('h2l14-downstairs-visitor-04', 'teacherWang', '我看见那个人了，他是我男朋友。'),
    ('h2l14-downstairs-visitor-05', 'liWen', '那我们快过去吧。'),
    ('h2l14-friends-reunion-01', 'teacherWang', '同乐，真是你啊！上次打电话，你说有时间过来看我，没想到这么快就来了！'),
    ('h2l14-friends-reunion-02', 'yang', '就要过年了，你一个人在这儿多没意思啊，所以我就早早过来了。'),
    ('h2l14-friends-reunion-03', 'teacherWang', '你能来，我太高兴了！'),
    ('h2l14-friends-reunion-04', 'yang', '一飞，你旁边这位是？'),
    ('h2l14-friends-reunion-05', 'teacherWang', '同乐，这是李文，他在我们医学院学医。李文，这是我男朋友杨同乐。'),
    ('h2l14-friends-reunion-06', 'yang', '李文，很高兴认识你！'),
    ('h2l14-friends-reunion-07', 'liWen', '认识你我也很高兴！我家就在前面那个楼，有时间来玩。'),
    ('h2l14-apartment-neighbors-01', 'yang', '一飞，你住的房子真不错，很大，离学校也不远。'),
    ('h2l14-apartment-neighbors-02', 'teacherWang', '是啊！我楼下还住着一家中国人，他们人很好。'),
    ('h2l14-apartment-neighbors-03', 'yang', '这样你有事情就可以找他们帮忙。'),
    ('h2l14-apartment-neighbors-04', 'teacherWang', '对，我也帮他们家的小孩儿学中文。'),
    ('h2l14-apartment-neighbors-05', 'yang', '我记得你跟我说过，是个女孩儿，学得也很好。'),
    ('h2l14-apartment-neighbors-06', 'teacherWang', '没错，她经常跑上来找我玩。'),
    ('h2l14-apartment-neighbors-07', 'yang', '你问问他们什么时候有时间，我请他们吃个饭。'),
    ('h2l15-exam-plans-01', 'teacherWang', '考试就要开始了，请大家写上姓名，写好后就可以做题了。'),
    ('h2l15-exam-plans-02', 'bai', '老师，我做完了。'),
    ('h2l15-exam-plans-03', 'chen', '老师，我也做完了。'),
    ('h2l15-exam-plans-04', 'teacherWang', '……对了，你们考完试想做什么？'),
    ('h2l15-exam-plans-05', 'bai', '我很想去中国，虽然去过一次，但是很想再去一次。'),
    ('h2l15-exam-plans-06', 'teacherWang', '不错，到中国后你就可以经常说中文了。'),
    ('h2l15-beijing-trip-01', 'bai', '考完试了，我现在可以出国旅游了。'),
    ('h2l15-beijing-trip-02', 'liWen', '你要去哪儿？'),
    ('h2l15-beijing-trip-03', 'bai', '我要再去一次北京。'),
    ('h2l15-beijing-trip-04', 'liWen', '为什么还去北京？'),
    ('h2l15-beijing-trip-05', 'bai', '因为我想再吃一次烤鸭，再喝一次奶茶，再去北京大学看一次电影……'),
    ('h2l15-beijing-trip-06', 'liWen', '你想做的事情很多啊！'),
    ('h2l15-beijing-trip-07', 'bai', '是啊，你看，我还在网上买好颐和园的门票了呢。'),
    ('h2l15-beijing-trip-08', 'liWen', '我的高中同学就在颐和园上班，可以让他给你好好介绍介绍。'),
    ('h2l15-beijing-trip-09', 'bai', '太好了！出门旅游，多个朋友多条路。'),
    ('h2l15-airport-memory-01', 'bai', '李文，你有一年没回国了吧？'),
    ('h2l15-airport-memory-02', 'liWen', '不到一年。我六月的时候回去了一次。'),
    ('h2l15-airport-memory-03', 'bai', '我怎么忘了？还是我送你去的机场呢。'),
    ('h2l15-airport-memory-04', 'liWen', '是啊。'),
    ('h2l15-airport-memory-05', 'bai', '我记得你那次的机票很便宜。'),
    ('h2l15-airport-memory-06', 'liWen', '没错，可能因为那个时候去北京的人不多吧。'),
    ('h2l15-airport-memory-07', 'bai', '这次的机票虽然有点儿贵，但想到就要飞北京了，我还是很高兴的。'),
    ('h3l1-home-01', 'liu', '这是杨同乐吗？他怎么跟白家月在一起？'),
    ('h3l1-home-02', 'wang', '他不是杨同乐，他叫李文，是白家月的好朋友。'),
    ('h3l1-home-03', 'liu', '我还以为是同乐呢，他们看上去有点儿像。'),
    ('h3l1-home-04', 'wang', '是长得有点儿像，但是他比同乐高，身高有一米八。'),
    ('h3l1-home-05', 'liu', '看起来也比同乐瘦一点儿。'),
    ('h3l1-home-06', 'wang', '下个星期家月和李文要来北京，我去机场接他们。'),
    ('h3l1-home-07', 'liu', '他们哪天到北京？我跟你一起去机场接他们吧。'),
    ('h3l1-baggage-01', 'bai', '我的行李怎么还没出来？是不是丢了？'),
    ('h3l1-baggage-02', 'liWen', '你的行李箱是什么样的？'),
    ('h3l1-baggage-03', 'bai', '是一个黑色的箱子，上面写着我的名字和电话号码。'),
    ('h3l1-baggage-04', 'liWen', '我好像在哪儿看到过这个箱子，是不是有人拿错了？'),
    ('h3l1-baggage-05', 'bai', '我们快找谁问一下吧，箱子里有不少重要的东西。'),
    ('h3l1-baggage-06', 'liWen', '别着急，我们拿着护照和机票，去服务台问问吧。'),
    ('h3l1-arrival-01', 'liu', '飞机早就到了，你看见白家月他们了吗？'),
    ('h3l1-arrival-02', 'wang', '没有，他们应该快出来了。'),
    ('h3l1-arrival-03', 'liu', '我们站到中间去吧，这样他们好找一些。'),
    ('h3l1-arrival-04', 'wang', '你看那个高个子的人是李文吗？'),
    ('h3l1-arrival-05', 'liu', '你说的是哪个？那个穿着黑衣服的短头发的年轻人？'),
    ('h3l1-arrival-06', 'wang', '对，那个人就是李文！你看，家月在他后面呢。'),
    ('h3l3-neighborhood-01', 'wang', '小雪的初中离家有点儿远，咱们换一个近点儿的房子吧。'),
    ('h3l3-neighborhood-02', 'liu', '好啊，我上网看看。你觉得这个小区怎么样？'),
    ('h3l3-neighborhood-03', 'wang', '环境挺好的，离地铁站还不远。'),
    ('h3l3-neighborhood-04', 'liu', '房子里面也不错，空调和洗衣机都是新的。'),
    ('h3l3-neighborhood-05', 'wang', '是不错，但是我不喜欢住一层。'),
    ('h3l3-neighborhood-06', 'liu', '这个一层带一个小花园，我觉得咱们可以去看看。'),
    ('h3l3-new-home-01', 'wang', '我今天早上来的时候，灯还开着。'),
    ('h3l3-new-home-02', 'liu', '我这几天忙坏了，可能走的时候忘关了。'),
    ('h3l3-new-home-03', 'wang', '冰箱不能用，这些吃的东西放在哪儿？'),
    ('h3l3-new-home-04', 'liu', '不可能吧？冰箱是新买的，我来看看。'),
    ('h3l3-new-home-05', 'wang', '洗衣机也坏了吗？'),
    ('h3l3-new-home-06', 'liu', '没坏，但是卫生间没打扫好，还不能洗衣服。'),
    ('h3l3-new-home-07', 'wang', '星期天我们真的能搬家吗？'),
    ('h3l3-bank-01', 'wang', '这个月花了不少钱。'),
    ('h3l3-bank-02', 'liu', '是的，我们买了很多搬家时要用的东西。'),
    ('h3l3-bank-03', 'wang', '咱们办张信用卡吧，花的钱可以慢慢还。听说中国银行的服务不错，办了信用卡买东西还能便宜。'),
    ('h3l3-bank-04', 'liu', '好啊！中国银行很近，走路几分钟就能到。咱们什么时候去？'),
    ('h3l3-bank-05', 'wang', '今天下午？'),
    ('h3l3-bank-06', 'liu', '我下午要去医院，很晚才能回来。'),
    ('h3l3-bank-07', 'wang', '那我下午自己去吧。'),
    ('h3l4-grassland-01', 'yang', '这个假期咱们去哪儿玩玩吧。'),
    ('h3l4-grassland-02', 'teacherWang', '好啊，你想去哪儿，咱们就去哪儿。'),
    ('h3l4-grassland-03', 'yang', '你喜欢海，找个海边住几天，怎么样？'),
    ('h3l4-grassland-04', 'teacherWang', '现在去海边有点儿冷。'),
    ('h3l4-grassland-05', 'yang', '那去草原吧？草原一点儿也不冷。'),
    ('h3l4-grassland-06', 'teacherWang', '这个主意好！我好久没骑马了。'),
    ('h3l4-grassland-07', 'yang', '对，在草原上骑马、吃羊肉、看月亮，一定很有意思。'),
    ('h3l4-hotel-plan-01', 'yang', '出去玩的机票买好了吗？'),
    ('h3l4-hotel-plan-02', 'teacherWang', '买好了。星期六上午十点一刻起飞。'),
    ('h3l4-hotel-plan-03', 'yang', '宾馆也选好了吗？'),
    ('h3l4-hotel-plan-04', 'teacherWang', '是的，这家宾馆很特别，跟别的都不一样，一出门就能看见牛和羊！'),
    ('h3l4-hotel-plan-05', 'yang', '太好了！你看看要带什么东西？'),
    ('h3l4-hotel-plan-06', 'teacherWang', '我们不用带太多东西，别忘了拿上新买的相机。'),
    ('h3l4-hotel-plan-07', 'yang', '一定不会忘带的。我现在就去准备行李。'),
    ('h3l4-airport-driver-01', 'driverLi', '欢迎你们！我是你们的司机，我姓李，叫我小李就可以。'),
    ('h3l4-airport-driver-02', 'yang', '您好！不好意思，飞机晚点了，让您久等了。'),
    ('h3l4-airport-driver-03', 'driverLi', '没关系。除了这个行李箱以外，还有别的东西吗？'),
    ('h3l4-airport-driver-04', 'yang', '还有一个包，我自己拿就可以。'),
    ('h3l4-airport-driver-05', 'driverLi', '车在一层，请跟我来。'),
    ('h3l4-airport-driver-06', 'yang', '我们住的宾馆离机场远吗？'),
    ('h3l4-airport-driver-07', 'driverLi', '不远，三十分钟就能到。两位到了可以先休息休息，晚饭的时候我叫你们。'),
    ('h3l5-walk-01', 'bai', '这个星期总是阴天，今天终于晴了。'),
    ('h3l5-walk-02', 'liWen', '现在天气好得很！我们去爬山怎么样？'),
    ('h3l5-walk-03', 'bai', '好啊！又能锻炼身体，又能照好看的照片。'),
    ('h3l5-walk-04', 'liWen', '那我带点儿水和吃的，咱们现在就去？'),
    ('h3l5-walk-05', 'bai', '我回去穿上运动鞋，拿上大衣。要不要叫一雪姐一起去？'),
    ('h3l5-walk-06', 'liWen', '好主意。给她打个电话吧。'),
    ('h3l5-photos-01', 'bai', '这些照片是谁给您照的？张张都非常好看。'),
    ('h3l5-photos-02', 'wang', '一飞。她对拍照一直很感兴趣，经常给我照相。'),
    ('h3l5-photos-03', 'bai', '我喜欢您大笑的这张，看起来很漂亮。'),
    ('h3l5-photos-04', 'wang', '我觉得这张有点儿难看，那时候我不知道她在给我照相。'),
    ('h3l5-photos-05', 'bai', '这样的照片才好看。我也喜欢拍照，爬山的时候我给您照几张照片吧。'),
    ('h3l5-photos-06', 'wang', '好，我可以比较一下你们两个谁的水平高。'),
    ('h3l5-mountain-01', 'wang', '家月，这里挺漂亮的，咱们在这里拍照吧。'),
    ('h3l5-mountain-02', 'bai', '这边没有太阳，咱们去那边吧。'),
    ('h3l5-mountain-03', 'wang', '好。你觉得我站在这些树中间怎么样？'),
    ('h3l5-mountain-04', 'bai', '挺好的。等一下，后边走过去两个人。'),
    ('h3l5-mountain-05', 'wang', '我准备好了，你照的时候告诉我。'),
    ('h3l5-mountain-06', 'bai', '你不用看着我，想干什么都可以。'),
    ('h3l5-mountain-07', 'wang', '树上飞来了几只鸟，我就看它们吧。'),
    ('h3l5-mountain-08', 'bai', '啊，手机没电了。'),
    ('h3l6-tickets-01', 'liWen', '家月，咱们该买去上海的票了。你打算怎么去上海？'),
    ('h3l6-tickets-02', 'bai', '我还没坐过高铁，咱们坐高铁去，怎么样？'),
    ('h3l6-tickets-03', 'liWen', '没问题，从北京到上海的高铁很多，非常方便。'),
    ('h3l6-tickets-04', 'bai', '行！怎么买高铁票？'),
    ('h3l6-tickets-05', 'liWen', '用手机App就能买。给我你的护照，我帮你买。'),
    ('h3l6-tickets-06', 'bai', '早就听说过高铁，终于可以坐上了。'),
    ('h3l6-tickets-07', 'liWen', '高铁又快又舒服，你一定会喜欢的。'),
    ('h3l6-drive-01', 'liu', '过了前面的路口就到高铁站了。'),
    ('h3l6-drive-02', 'bai', '我看见了。马上就到了，这条路车很多，您小心点儿。'),
    ('h3l6-drive-03', 'liu', '好，你们还有一个小时，应该不会迟到的。'),
    ('h3l6-drive-04', 'bai', '我发现这条路车多，红绿灯也多。'),
    ('h3l6-drive-05', 'liu', '是啊，这条路我走过一次，后来再也不走了。'),
    ('h3l6-drive-06', 'bai', '那您今天为什么走了这条路？'),
    ('h3l6-drive-07', 'liu', '我一急就走错了。如果没走错，二十分钟以前就到了。'),
    ('h3l6-station-01', 'bai', '李文，我的耳机没电了，你有充电宝吗？'),
    ('h3l6-station-02', 'liWen', '有，这些常用的东西我都放在包里了，我给你拿。'),
    ('h3l6-station-03', 'bai', '前面的人越来越多。'),
    ('h3l6-station-04', 'liWen', '对，马上就进高铁站了。咱们一起走，别分开。'),
    ('h3l6-station-05', 'bai', '好，你检查一下，高铁票都拿好了吗？'),
    ('h3l6-station-06', 'liWen', '不用拿票，刷护照就能检票进站。'),
    ('h3l6-station-07', 'bai', '去哪里检票？'),
    ('h3l6-station-08', 'liWen', '检票口在二层，我们一会儿坐电梯上去。'),
    ('h3l8-gym-01', 'liWen', '天中，最近常看见你来体育馆。'),
    ('h3l8-gym-02', 'chen', '我每天下午都来跑一个小时步。'),
    ('h3l8-gym-03', 'liWen', '你的运动习惯真不错。'),
    ('h3l8-gym-04', 'chen', '因为我今年胖了十多斤，不能再胖下去了，有点儿不健康。'),
    ('h3l8-gym-05', 'liWen', '我下课以后常去打羽毛球，你也来玩吧。'),
    ('h3l8-gym-06', 'chen', '我知道，但是你们的水平太高了，我打得不怎么样。'),
    ('h3l8-gym-07', 'liWen', '没关系，我可以教你。'),
    ('h3l8-classroom-01', 'annie', '你怎么了？看上去有点儿不舒服。'),
    ('h3l8-classroom-02', 'chen', '昨天游完泳以后，耳朵一直有点儿疼。'),
    ('h3l8-classroom-03', 'annie', '是不是感冒了？发烧吗？'),
    ('h3l8-classroom-04', 'chen', '好像发低烧了。'),
    ('h3l8-classroom-05', 'annie', '我送你去医院，让医生检查一下吧。'),
    ('h3l8-classroom-06', 'chen', '我先回去睡一觉，可能休息休息就好了。'),
    ('h3l8-classroom-07', 'annie', '好吧，如果下午还发烧，就一定要去看医生。'),
    ('h3l8-classroom-08', 'chen', '谢谢关心，我会注意的。'),
    ('h3l8-ward-01', 'annie', '你怎么突然住院了？大家都很担心你。'),
    ('h3l8-ward-02', 'chen', '我的腿疼了几个星期了，医生说需要住院做检查。'),
    ('h3l8-ward-03', 'annie', '你看起来一点儿也不像病人。'),
    ('h3l8-ward-04', 'chen', '是啊，我很少生病。我上次来医院已经过去差不多两年了。'),
    ('h3l8-ward-05', 'annie', '你每天跑步，有时候还去游泳，是不是运动太多了？'),
    ('h3l8-ward-06', 'chen', '医生也这么说，但是还得做完检查才能知道。'),
    ('h3l8-ward-07', 'annie', '别担心！听医生的话，好好休息，你的腿一定能好。'),
    ('h3l8-ward-08', 'chen', '谢谢。有人来看我，我就开心多了。'),
    ('h3l9-card-01', 'liWen', '家月，对不起，我昨天忘了还你校园卡了。'),
    ('h3l9-card-02', 'bai', '没关系。你怎么这么快就过来了？'),
    ('h3l9-card-03', 'liWen', '我正在球场打球呢，接了你的电话就跑过来了。'),
    ('h3l9-card-04', 'bai', '听说为了准备运动会，你们几个男生每天都练球。'),
    ('h3l9-card-05', 'liWen', '是啊！你打算参加运动会吗？'),
    ('h3l9-card-06', 'bai', '我想参加网球比赛，最近一直在练习。'),
    ('h3l9-card-07', 'liWen', '好，到时候我去看你的比赛。'),
    ('h3l9-badminton-01', 'liWen', '家月，你跟我们一起打羽毛球吧？'),
    ('h3l9-badminton-02', 'bai', '我好多年没打羽毛球了，几乎忘了怎么打了。'),
    ('h3l9-badminton-03', 'liWen', '不是比赛，打不好没关系。'),
    ('h3l9-badminton-04', 'bai', '这么多同学一起打，如果总是接不住球，就太不好意思了。'),
    ('h3l9-badminton-05', 'liWen', '你想得太多了！大家打球只是为了锻炼身体。'),
    ('h3l9-badminton-06', 'bai', '我先自己练练吧，下周再跟你们一起打。'),
    ('h3l9-badminton-07', 'liWen', '我在教天中打羽毛球，你可以过来跟我们一起练。'),
    ('h3l9-football-01', 'chen', '足球比赛已经开始了，快过来看吧！'),
    ('h3l9-football-02', 'liWen', '你们先看，冰箱里有啤酒和饮料，我去拿一下。'),
    ('h3l9-football-03', 'bai', '今天怎么回事？总是踢不进去！'),
    ('h3l9-football-04', 'chen', '几个老球员生病了，新球员第一次参加这么重要的比赛，太紧张了。'),
    ('h3l9-football-05', 'liWen', '是啊，主要的球员没参加比赛，所以大家也都受到影响了。'),
    ('h3l9-football-06', 'bai', '越看越着急。我不看了，你们告诉我得分吧。'),
    ('h3l10-notes-01', 'classmate', '你的数学越来越好，能不能介绍一下学习方法？'),
    ('h3l10-notes-02', 'liuXiaoxue', '没有什么特别的方法，认真听课，认真记笔记。'),
    ('h3l10-notes-03', 'classmate', '我看过你的笔记，记得非常清楚。'),
    ('h3l10-notes-04', 'liuXiaoxue', '老师写在黑板上的题都很重要，所以我会把这些题都记在本子上。'),
    ('h3l10-notes-05', 'classmate', '你说得对。我没有记笔记的习惯。'),
    ('h3l10-notes-06', 'liuXiaoxue', '笔记挺重要的，我每天写作业以前，都要看一遍。'),
    ('h3l10-notes-07', 'classmate', '这个方法真好！我以后也试试，希望能提高成绩。'),
    ('h3l10-exam-01', 'classmate', '小雪，昨天的考试，你考得怎么样？'),
    ('h3l10-exam-02', 'liuXiaoxue', '我觉得历史有点儿难，你呢？'),
    ('h3l10-exam-03', 'classmate', '数学考试我没看清楚要求，做错了好几个题，考得挺差的。'),
    ('h3l10-exam-04', 'liuXiaoxue', '明天还有考试呢，别想那么多了，先复习外语吧。'),
    ('h3l10-exam-05', 'classmate', '外语作业里有几个问题，我可以问问你吗？'),
    ('h3l10-exam-06', 'liuXiaoxue', '当然可以。在学习上，遇到什么问题都可以问我。'),
    ('h3l10-exam-07', 'classmate', '不好意思，这几个题我也不会。咱们还是一起去办公室问问李老师吧。'),
    ('h3l10-office-01', 'classmate', '李老师，书上有几个问题，我们想问问您。'),
    ('h3l10-office-02', 'teacherLi', '好，坐下说吧，哪个题不会？'),
    ('h3l10-office-03', 'classmate', '书上第五页的这个对话我看不懂，小雪也不明白。'),
    ('h3l10-office-04', 'teacherLi', '我课上讲过这几句话，再给你们讲一遍。'),
    ('h3l10-office-05', 'classmate', '我终于懂了。这些句子一点儿也不难。'),
    ('h3l10-office-06', 'liuXiaoxue', '我也明白了，谢谢您，李老师。'),
    ('h3l10-office-07', 'teacherLi', '我这本书上还有几个练习，你们回家也做一做，明天再把书还给我。'),
    ('h3l11-meeting-01', 'wang', '会议下午几点开始？'),
    ('h3l11-meeting-02', 'yang', '今天下午经理不在，不开会了。'),
    ('h3l11-meeting-03', 'wang', '那什么时候开会？'),
    ('h3l11-meeting-04', 'yang', '后天上午十点，会议地点换到第一会议室。我正要给大家发邮件。'),
    ('h3l11-meeting-05', 'wang', '开会的时候，我们用会议室的电脑还是自己的笔记本电脑？'),
    ('h3l11-meeting-06', 'yang', '会议室的电脑或者自己的电脑都可以。'),
    ('h3l11-meeting-07', 'wang', '那到时候咱们早点儿过去，你帮我把电脑接好吧。'),
    ('h3l11-computer-01', 'wang', '电脑接好了吗？'),
    ('h3l11-computer-02', 'yang', '已经接好了，您开机看看有没有问题。'),
    ('h3l11-computer-03', 'wang', '现在什么都看不见。'),
    ('h3l11-computer-04', 'yang', '我检查一下哪里出问题了……您再试一下。'),
    ('h3l11-computer-05', 'wang', '看见了，但是听不见声音。'),
    ('h3l11-computer-06', 'yang', '现在呢？'),
    ('h3l11-computer-07', 'wang', '听得见声音，但是声音有点儿小，听不清楚。'),
    ('h3l11-computer-08', 'yang', '看来我没办法解决这个问题，只能找别人来帮帮忙了。'),
    ('h3l11-workload-01', 'wang', '同乐，你看见老张了吗？'),
    ('h3l11-workload-02', 'yang', '老张没来。他说家里有点儿事，所以请假了。'),
    ('h3l11-workload-03', 'wang', '好几个同事都休假了，开会前这么多工作我怕干不完。'),
    ('h3l11-workload-04', 'yang', '十二点多了，咱们先去吃饭吧。吃完饭，我跟您一起把这些工作做完。'),
    ('h3l11-workload-05', 'wang', '你先去吃，我想再干一会儿。明天开会前要发到公司的邮箱里。'),
    ('h3l11-workload-06', 'yang', '您没看到邮件吗？经理还没回来呢，下周才能开会。'),
    ('h3l11-workload-07', 'wang', '那不着急了。走，吃饭去。'),
    ('h3l12-park-01', 'bai', '王老师，您看，这条街上的树都开花了。'),
    ('h3l12-park-02', 'teacherWang', '上周我去公园坐船了，公园里的花也开了。'),
    ('h3l12-park-03', 'bai', '天气这么好，下午我也想去公园坐船。'),
    ('h3l12-park-04', 'teacherWang', '去吧！今天是工作日，人应该不多。'),
    ('h3l12-park-05', 'bai', '您有时间吗？我想跟您一起去。'),
    ('h3l12-park-06', 'teacherWang', '我今天下午有课，不能去太远的地方。'),
    ('h3l12-park-07', 'bai', '那咱们换一天去？'),
    ('h3l12-park-08', 'teacherWang', '行。或者明天去，或者后天去，我给你打电话。'),
    ('h3l12-rain-01', 'bai', '刚才还是大晴天呢，怎么突然就刮起风来了？'),
    ('h3l12-rain-02', 'teacherWang', '好像新闻里说今天有雨。'),
    ('h3l12-rain-03', 'bai', '啊？我每天书包里都放着雨伞，就今天没带。'),
    ('h3l12-rain-04', 'teacherWang', '我可以借给你，我车里有一把伞和一件雨衣。'),
    ('h3l12-rain-05', 'bai', '谢谢，希望下午天气能变好。'),
    ('h3l12-rain-06', 'teacherWang', '这个季节天气变化很快。'),
    ('h3l12-rain-07', 'bai', '雨已经下起来了，咱们快点儿走吧。'),
    ('h3l12-winter-01', 'bai', '您来这里已经一年多了，习惯了吧？'),
    ('h3l12-winter-02', 'teacherWang', '别的早就习惯了，就是天气我还不太习惯。'),
    ('h3l12-winter-03', 'bai', '为什么？您不喜欢这里的天气吗？'),
    ('h3l12-winter-04', 'teacherWang', '我觉得冬天太冷了。'),
    ('h3l12-winter-05', 'bai', '冬天虽然冷，但是下雪的时候特别漂亮。'),
    ('h3l12-winter-06', 'teacherWang', '我也喜欢雪。北京常常下雪，但听说今年就下了一次。'),
    ('h3l12-winter-07', 'bai', '我没关注过北京的天气，但是新闻里说过，今年冬天很多地方雪下得都少了。'),
    ('h3l13-restaurant-01', 'yang', '今天我请客，你们想吃什么就点什么！'),
    ('h3l13-restaurant-02', 'wang', '那我就不客气了。听说这家饭馆的鱼做得很特别？'),
    ('h3l13-restaurant-03', 'yang', '对，南方菜跟你们北方菜的做法不同。除了鱼，你们还想吃什么？'),
    ('h3l13-restaurant-04', 'colleague', '我不常吃南方菜，还是你决定吧。'),
    ('h3l13-restaurant-05', 'yang', '好，那再加一个鸡肉。'),
    ('h3l13-restaurant-06', 'wang', '咱们就三个人，别点那么多。'),
    ('h3l13-restaurant-07', 'yang', '好，那先来这几个菜。'),
    ('h3l13-restaurant-08', 'wang', '对了，下周我儿子过生日，你们有时间的话，就来我家做客，我给你们做北京菜。'),
    ('h3l13-party-prep-01', 'wang', '第一次请新邻居来做客，总是担心有什么没准备好。'),
    ('h3l13-party-prep-02', 'liu', '放心吧，我帮你看了，都已经准备好了。'),
    ('h3l13-party-prep-03', 'wang', '我记得刚才已经把饮料拿出来了，怎么不见了？'),
    ('h3l13-party-prep-04', 'liu', '我把饮料和酒都放进冰箱里了，客人来了再拿出来。'),
    ('h3l13-party-prep-05', 'wang', '音乐的声音合适吗？'),
    ('h3l13-party-prep-06', 'liu', '你把声音开得太大了，我去关小一点儿。'),
    ('h3l13-party-prep-07', 'wang', '好，那我们就等客人来吧。'),
    ('h3l13-birthday-01', 'wang', '谢谢你们来参加我儿子的生日晚会，希望大家今晚玩得开心。'),
    ('h3l13-birthday-02', 'yang', '小明，生日快乐！我准备了一个小礼物，希望你喜欢！'),
    ('h3l13-birthday-03', 'liuXiaoming', '谢谢您，我可以打开吗？'),
    ('h3l13-birthday-04', 'yang', '当然可以，你妈妈说你跟姐姐一样，都喜欢画画，对吗？'),
    ('h3l13-birthday-05', 'liuXiaoming', '对，我想做一名画家。啊！画板和画笔，这正是我需要的。我太喜欢了。'),
    ('h3l13-birthday-06', 'wang', '我去把盘子拿过来，咱们一边吃蛋糕，一边聊天儿吧。'),
    ('h3l14-library-01', 'liWen', '我借的这本词典最好今天还，但是我没时间去。'),
    ('h3l14-library-02', 'bai', '下午我只有两节课，可以帮你去图书馆还书。'),
    ('h3l14-library-03', 'liWen', '那太谢谢了。你能再帮我借本书吗？'),
    ('h3l14-library-04', 'bai', '行，你告诉我书名。'),
    ('h3l14-library-05', 'liWen', '我把名字写在纸上吧。我去了好几次图书馆，这本书都被别人借走了。'),
    ('h3l14-library-06', 'bai', '《名人的故事》？我有这本书。明天我借给你吧。'),
    ('h3l14-campus-01', 'annie', '今天下课早，你一会儿做什么？'),
    ('h3l14-campus-02', 'bai', '我今天忙得很，要先去图书馆借书，然后去游泳。'),
    ('h3l14-campus-03', 'annie', '咱们一起走吧，我想去图书馆看看中文报纸。'),
    ('h3l14-campus-04', 'bai', '等等，我的校园卡不见了，没有卡进不去图书馆。'),
    ('h3l14-campus-05', 'annie', '你想想上一次用是什么时候？'),
    ('h3l14-campus-06', 'bai', '我忘记了，可能被我放在家里了。'),
    ('h3l14-campus-07', 'annie', '进不去图书馆也没关系，上网看看有没有电子书。'),
    ('h3l14-campus-08', 'bai', '不行，我必须去，我还得帮李文还书呢。'),
    ('h3l14-performance-01', 'liWen', '下周学校有晚会，你知道吗？'),
    ('h3l14-performance-02', 'bai', '知道，我和几个女生要表演一个节目。你也参加吗？'),
    ('h3l14-performance-03', 'liWen', '我想唱中文歌，但是还没找到人一起表演，不知道怎么办。'),
    ('h3l14-performance-04', 'bai', '找不到人，你就一个人唱吧。'),
    ('h3l14-performance-05', 'liWen', '一想到要在校长、老师和那么多同学面前表演，我就有些紧张。'),
    ('h3l14-performance-06', 'bai', '紧张什么啊，我们都喜欢听你唱歌，你要相信自己。'),
    ('h3l15-neighborhood-01', 'yang', '您搬到蓝天小区一段时间了，觉得怎么样？'),
    ('h3l15-neighborhood-02', 'wang', '小区环境挺好的，附近买东西也很方便，过马路就是超市。'),
    ('h3l15-neighborhood-03', 'yang', '平时孩子们在哪儿玩？'),
    ('h3l15-neighborhood-04', 'wang', '小区里有很多树，孩子们放学后就在树下做游戏。你想买房子吗？'),
    ('h3l15-neighborhood-05', 'yang', '是。我想买一个大房子，让我爸妈过来跟我一起住。'),
    ('h3l15-neighborhood-06', 'wang', '蓝天小区的老人挺多的，这几年小区根据他们的需要，有了很多变化。'),
    ('h3l15-neighborhood-07', 'yang', '真不错！过几天我去蓝天小区看看。'),
    ('h3l15-nanjing-01', 'wang', '假期我想去南京旅游，但是我不太了解那里。'),
    ('h3l15-nanjing-02', 'yang', '我虽然不是南京人，可是我是在南京上的大学，可以说是半个南京人。'),
    ('h3l15-nanjing-03', 'wang', '太好了！你快给我介绍一下南京吧。'),
    ('h3l15-nanjing-04', 'yang', '南京有两千年以上的历史，有老城、老街，还有很多有名的景点，每年去旅游的游客特别多。'),
    ('h3l15-nanjing-05', 'wang', '除了这些以外，你再告诉我一些外地人不知道的地方。'),
    ('h3l15-nanjing-06', 'yang', '那太多了，我得一点儿一点儿给您讲。'),
    ('h3l15-nanjing-07', 'wang', '行，下班后我请你吃晚饭，咱们边吃边聊。'),
    ('h3l15-yellow-river-01', 'wang', '小明，中国有一条大河，它的名字跟颜色有关系，你知道是什么河吗？'),
    ('h3l15-yellow-river-02', 'liuXiaoming', '我知道，是黄河！'),
    ('h3l15-yellow-river-03', 'wang', '你说对了。我再问问你，你知道它为什么叫黄河吗？'),
    ('h3l15-yellow-river-04', 'liuXiaoming', '因为河水看起来是黄色的，所以叫这个名字。黄河是中国最长的河吗？'),
    ('h3l15-yellow-river-05', 'wang', '不是。黄河虽然不是最长的河，可是在历史上很重要。'),
    ('h3l15-yellow-river-06', 'liuXiaoming', '这个我知道。很久以前，很多中国人都住在黄河边上。'),
    ('h3l15-yellow-river-07', 'wang', '对。在我们中国人看来，黄河像妈妈一样，养了我们几千年。'),
    ('h3l16-pet-center-01', 'liuXiaoxue', '这只小猫你们养了多久了？'),
    ('h3l16-pet-center-02', 'petWorker', '已经一年多了。第一天看见它的时候，它又脏又小。'),
    ('h3l16-pet-center-03', 'liuXiaoxue', '现在它变得又干净又漂亮了。'),
    ('h3l16-pet-center-04', 'petWorker', '是啊。它还特别可爱，一会儿在你脚边睡觉，一会儿在你身上爬。'),
    ('h3l16-pet-center-05', 'liuXiaoxue', '你们把它照顾得真好。'),
    ('h3l16-pet-center-06', 'petWorker', '它就好像我们的孩子，我们照顾它，它也认得我们了。'),
    ('h3l16-pet-center-07', 'liuXiaoxue', '妈妈，我们家也养一只小猫吧。'),
    ('h3l16-pet-center-08', 'wang', '咱们没时间照顾，还是别养了，我周末带你们去北京动物园看动物吧。'),
    ('h3l16-zoo-01', 'liuXiaoming', '妈妈，大熊猫这个名字很奇怪，它们跟猫有什么关系？'),
    ('h3l16-zoo-02', 'wang', '这个问题问得好，它们跟猫没什么关系，其实应该叫大猫熊。'),
    ('h3l16-zoo-03', 'liuXiaoming', '大熊猫为什么只吃竹子不吃肉？'),
    ('h3l16-zoo-04', 'wang', '它们跟人一样，也可以吃肉，但是对肉不感兴趣。'),
    ('h3l16-zoo-05', 'liuXiaoming', '大熊猫为什么是中国的国宝？'),
    ('h3l16-zoo-06', 'wang', '全世界只有中国有野生大熊猫，中国是大熊猫的家。'),
    ('h3l16-zoo-07', 'liuXiaoming', '我听说有的熊猫出国了，他们去哪儿了？'),
    ('h3l16-zoo-08', 'wang', '关于这个问题，我得慢慢给你讲。'),
    ('h3l16-zoo-09', 'liuXiaoxue', '弟弟，你真是“十万个为什么”。'),
    ('h3l16-panda-house-01', 'liuXiaoxue', '这只大熊猫一会儿爬上去，一会儿跳下来，可爱极了！'),
    ('h3l16-panda-house-02', 'wang', '它好像还没吃饱，站起来张着嘴找吃的呢。'),
    ('h3l16-panda-house-03', 'liuXiaoxue', '它身边那只熊猫半天没动，是不是在睡觉呢？'),
    ('h3l16-panda-house-04', 'wang', '我看不见它的脸，可能是吧。一般来说，熊猫每天要睡很多次觉。'),
    ('h3l16-panda-house-05', 'liuXiaoxue', '对，除了睡觉以外，很多时间都在吃东西。'),
    ('h3l16-panda-house-06', 'liuXiaoming', '大熊猫的生活真舒服啊！'),
    ('h3l16-panda-house-07', 'liuXiaoxue', '妈妈，您帮我和这两只大熊猫照一张照片吧。'),
    ('h3l17-teaching-building-01', 'liuXiaoxue', '别再向前走了，李老师的办公室已经到了。'),
    ('h3l17-teaching-building-02', 'classmate', '你进去吧，我在楼梯那儿等你。我害怕见李老师。'),
    ('h3l17-teaching-building-03', 'liuXiaoxue', '怎么回事？'),
    ('h3l17-teaching-building-04', 'classmate', '最近我做错了好几件事，我怕李老师生气。'),
    ('h3l17-teaching-building-05', 'liuXiaoxue', '你想多了，做错事情是很常见的。'),
    ('h3l17-teaching-building-06', 'classmate', '我把简单的事情做错了，李老师一定觉得我不认真。'),
    ('h3l17-teaching-building-07', 'liuXiaoxue', '有的人虽然很聪明，但是会在简单的事情中出错，因为他们认为事情简单，就不会认真去做了。'),
    ('h3l17-teaching-building-08', 'classmate', '你说的就是我，以后我要多向认真的人学习。'),
    ('h3l17-reading-room-01', 'bai', '太阳从西边出来了？这几天怎么总是在图书馆看见你？'),
    ('h3l17-reading-room-02', 'chen', '这有什么奇怪的？我是来学习的。'),
    ('h3l17-reading-room-03', 'bai', '你怎么还来图书馆学习？同学们都在到处找工作呢。'),
    ('h3l17-reading-room-04', 'chen', '我不想现在就工作，还想继续学习，我爸妈也同意。可我还没想好学什么，所以来图书馆看看。'),
    ('h3l17-reading-room-05', 'bai', '你不是喜欢玩电脑吗？你可以去看看跟电脑有关系的书。'),
    ('h3l17-reading-room-06', 'chen', '你说得对，我记得那个屋子里有些跟电脑有关的书，我去找找。'),
    ('h3l17-campus-01', 'liWen', '天中，你的手机怎么关机了？'),
    ('h3l17-campus-02', 'chen', '我的手机没电了。你找我有事吗？'),
    ('h3l17-campus-03', 'liWen', '前天我看见家月了，她告诉我你打算继续留学？'),
    ('h3l17-campus-04', 'chen', '是，可是我还没想好学什么，更没想好去哪个国家。'),
    ('h3l17-campus-05', 'liWen', '你可以去中国学中文啊。比如可以去北京、上海这样的大城市，那里有很多好大学，也有很多留学生。'),
    ('h3l17-campus-06', 'chen', '好，那我上网查一查。'),
    ('h3l17-campus-07', 'liWen', '我给你介绍几个有用的网站。'),
    ('h3l18-spring-festival-flight-01', 'bai', '我要在中国过年，真开心。'),
    ('h3l18-spring-festival-flight-02', 'liWen', '第一次请外国朋友来家里过春节，我也很高兴。'),
    ('h3l18-spring-festival-flight-03', 'bai', '你们怎样过节？'),
    ('h3l18-spring-festival-flight-04', 'liWen', '春节是中国最重要的节日，我们一般会回家，跟家人一起过。'),
    ('h3l18-spring-festival-flight-05', 'bai', '那你跟家人会一起做什么？'),
    ('h3l18-spring-festival-flight-06', 'liWen', '我们家会一边包饺子，一边看春节联欢晚会，一直到十二点以后才睡觉。'),
    ('h3l18-spring-festival-flight-07', 'bai', '听起来很有意思。春节放几天假？'),
    ('h3l18-spring-festival-flight-08', 'liWen', '大概七八天。'),
    ('h3l18-new-year-visit-01', 'bai', '张阿姨，李叔叔。过年好！这是我准备的礼物，请收下。'),
    ('h3l18-new-year-visit-02', 'liUncle', '谢谢家月，你太客气了！'),
    ('h3l18-new-year-visit-03', 'zhangAunt', '总听小文说起你，今天终于有机会见面了。'),
    ('h3l18-new-year-visit-04', 'bai', '谢谢您和叔叔请我来家里做客。'),
    ('h3l18-new-year-visit-05', 'liUncle', '桌子上有饮料，还有矿泉水，你想喝什么就自己拿。'),
    ('h3l18-new-year-visit-06', 'zhangAunt', '你先坐着看会儿电视，饺子很快就包好了。'),
    ('h3l18-new-year-visit-07', 'bai', '我刚刚看视频学会了包饺子，我跟你们一起包吧。'),
    ('h3l18-family-photos-01', 'bai', '这张照片是李文出国前照的吗？'),
    ('h3l18-family-photos-02', 'zhangAunt', '对，这是他从北京出发时，我们全家在机场照的。'),
    ('h3l18-family-photos-03', 'bai', '那是三四年前吧？'),
    ('h3l18-family-photos-04', 'zhangAunt', '是啊，时间过得真快，好像是不久前发生的一样。'),
    ('h3l18-family-photos-05', 'bai', '您一定特别想李文吧？'),
    ('h3l18-family-photos-06', 'zhangAunt', '他刚离开家时，我很不习惯，只要几天不跟他视频，就很想他。'),
    ('h3l18-family-photos-07', 'bai', '还有最后一个学期就要毕业了，他很快就会回来了。'),
]


def manifest_entry(entry: dict) -> dict:
    """Keep only stable manifest fields (never persist runtime skip flags)."""
    stable_fields = (
        "file", "canonicalFile", "level", "lesson", "scene", "line",
        "profile", "identityId", "voice", "text", "bytes", "sha256",
        "personaPitch", "personaTempo", "loudnessTargetLufs",
        "participants", "participantVoices",
    )
    return {key: entry[key] for key in stable_fields if key in entry}


def canonical_destination(entry: dict, root: Path = ASSET_ROOT) -> Path:
    """Resolve an audio row to its lesson-first location inside Group 3 assets."""
    canonical_file = entry.get("canonicalFile")
    if not canonical_file:
        raise RuntimeError(f"Manifest entry has no canonicalFile: {entry.get('file', '<unknown>')}")
    destination = (root / canonical_file).resolve()
    if root.resolve() not in destination.parents:
        raise RuntimeError(f"Unsafe canonicalFile outside Group 3 assets: {canonical_file}")
    return destination


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


async def run_checked(command: list[str]) -> None:
    def execute() -> None:
        subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

    await asyncio.to_thread(execute)


def persona_filter(profile: dict) -> str:
    return (
        f"rubberband=pitch={profile['personaPitch']}:tempo={profile['personaTempo']}:"
        "formant=shifted:pitchq=quality,"
        f"loudnorm=I={LOUDNESS_TARGET_LUFS}:LRA=7:TP=-2"
    )


async def render_persona(raw_files: list[Path], profiles: list[dict], output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    if len(raw_files) == 1:
        command = [
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-i", str(raw_files[0]), "-af", persona_filter(profiles[0]),
            "-ar", "24000", "-ac", "1", "-b:a", "48k", str(output),
        ]
    else:
        filters = [
            f"[{index}:a]{persona_filter(profile)}[persona{index}]"
            for index, profile in enumerate(profiles)
        ]
        filters.append(
            "[persona0][persona1]amix=inputs=2:duration=longest:normalize=0,"
            f"volume=0.72,loudnorm=I={LOUDNESS_TARGET_LUFS}:LRA=7:TP=-2[mixed]"
        )
        command = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y"]
        for raw_file in raw_files:
            command.extend(["-i", str(raw_file)])
        command.extend([
            "-filter_complex", ";".join(filters), "-map", "[mixed]",
            "-ar", "24000", "-ac", "1", "-b:a", "48k", str(output),
        ])
    await run_checked(command)
    if not output.exists() or output.stat().st_size < MIN_AUDIO_BYTES:
        raise RuntimeError(f"Persona output was unexpectedly small: {output}")


def merge_manifest_files(existing: list[dict], current: list[dict]) -> list[dict]:
    """Merge by filename while allowing current generator metadata to replace stale rows."""
    merged_by_file = {entry["file"]: entry for entry in existing}
    merged_by_file.update({entry["file"]: manifest_entry(entry) for entry in current})
    return list(merged_by_file.values())


def metadata_mismatches(
    existing_by_file: dict[str, dict],
    stored_profiles: dict[str, dict],
) -> dict[str, list[str]]:
    """Return semantic mismatches for reusable current-generator audio files."""
    mismatches: dict[str, list[str]] = {}
    for stem, profile_id, text in LINES:
        file_name = f"{stem}.mp3"
        stored = existing_by_file.get(file_name)
        if stored is None:
            mismatches[file_name] = ["missing manifest entry"]
            continue
        destination = canonical_destination(stored)
        if not destination.exists() or destination.stat().st_size < MIN_AUDIO_BYTES:
            continue
        expected_profile = VOICE_PROFILES[profile_id]
        reasons = []
        expected_fields = {
            "profile": profile_id,
            "identityId": profile_id,
            "voice": expected_profile["voice"],
            "text": text,
            "personaPitch": expected_profile["personaPitch"],
            "personaTempo": expected_profile["personaTempo"],
            "loudnessTargetLufs": LOUDNESS_TARGET_LUFS,
        }
        for field, expected in expected_fields.items():
            if stored.get(field) != expected:
                reasons.append(f"{field} differs")
        if stored_profiles.get(profile_id) != expected_profile:
            reasons.append(f"profile metadata differs for {profile_id}")
        if reasons:
            mismatches[file_name] = reasons
    return mismatches


async def synthesize(
    stem: str,
    profile_id: str,
    text: str,
    semaphore: asyncio.Semaphore,
    force_files: set[str],
    existing_entry: dict,
) -> dict:
    participant_ids = list(MIXED_LINE_PROFILES.get(stem, (profile_id,)))
    profiles = [VOICE_PROFILES[participant_id] for participant_id in participant_ids]
    destination = canonical_destination(existing_entry, STAGING_ROOT)
    current_destination = canonical_destination(existing_entry)
    destination.parent.mkdir(parents=True, exist_ok=True)
    reusable = current_destination.exists() and current_destination.stat().st_size >= MIN_AUDIO_BYTES
    file_name = f"{stem}.mp3"
    if file_name not in force_files and reusable:
        return {
            **manifest_entry(existing_entry),
            "file": file_name,
            "profile": profile_id,
            "identityId": profile_id,
            "voice": profiles[0]["voice"],
            "text": text,
            "bytes": current_destination.stat().st_size,
            "skipped": True,
        }
    raw_files = [destination.with_name(f"{destination.stem}.raw-{index}.mp3") for index in range(len(profiles))]
    destination.unlink(missing_ok=True)
    try:
        async with semaphore:
            for raw_file, profile in zip(raw_files, profiles, strict=True):
                for attempt in range(1, MAX_ATTEMPTS + 1):
                    try:
                        raw_file.unlink(missing_ok=True)
                        communicate = edge_tts.Communicate(
                            text,
                            profile["voice"],
                            rate="+0%",
                            pitch="+0Hz",
                        )
                        await asyncio.wait_for(
                            communicate.save(raw_file),
                            timeout=SYNTHESIS_TIMEOUT_SECONDS,
                        )
                        if raw_file.stat().st_size < MIN_AUDIO_BYTES:
                            raise RuntimeError("generated audio was unexpectedly small")
                        break
                    except Exception:
                        raw_file.unlink(missing_ok=True)
                        if attempt == MAX_ATTEMPTS:
                            raise
                        await asyncio.sleep(attempt * 1.5)
            await render_persona(raw_files, profiles, destination)
    finally:
        for raw_file in raw_files:
            raw_file.unlink(missing_ok=True)
    entry = {
        **manifest_entry(existing_entry),
        "file": file_name,
        "profile": profile_id,
        "identityId": profile_id,
        "voice": profiles[0]["voice"],
        "text": text,
        "bytes": destination.stat().st_size,
        "sha256": file_sha256(destination),
        "personaPitch": profiles[0]["personaPitch"],
        "personaTempo": profiles[0]["personaTempo"],
        "loudnessTargetLufs": LOUDNESS_TARGET_LUFS,
    }
    if len(participant_ids) > 1:
        entry["participants"] = participant_ids
        entry["participantVoices"] = [profile["voice"] for profile in profiles]
    return entry


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--force",
        action="store_true",
        help="Regenerate only existing files whose text/profile metadata is stale or missing.",
    )
    return parser.parse_args()


async def main() -> None:
    args = parse_args()
    ASSET_ROOT.mkdir(parents=True, exist_ok=True)
    for work_root in (STAGING_ROOT, BACKUP_ROOT):
        if work_root.exists():
            shutil.rmtree(work_root)
    existing = []
    old_profiles = {}
    if MANIFEST.exists():
        manifest_data = json.loads(MANIFEST.read_text(encoding="utf-8"))
        existing = manifest_data.get("files", [])
        old_profiles = manifest_data.get("profiles", {})
    existing_by_file = {entry["file"]: entry for entry in existing}
    line_profiles = {profile_id for _, profile_id, _ in LINES}
    unknown_profiles = sorted(line_profiles - set(VOICE_PROFILES))
    unused_profiles = sorted(set(VOICE_PROFILES) - line_profiles)
    if unknown_profiles or unused_profiles or len(VOICE_PROFILES) != VOICE_CAST_DATA["personaCount"]:
        raise RuntimeError(
            f"Voice cast coverage mismatch: unknown={unknown_profiles}, unused={unused_profiles}, "
            f"profiles={len(VOICE_PROFILES)}, expected={VOICE_CAST_DATA['personaCount']}"
        )
    missing_entries = [f"{stem}.mp3" for stem, _, _ in LINES if f"{stem}.mp3" not in existing_by_file]
    if missing_entries:
        raise RuntimeError(
            "Canonical manifest is missing generator rows: " + ", ".join(missing_entries[:10])
        )
    mismatches = metadata_mismatches(existing_by_file, old_profiles)
    if mismatches and not args.force:
        preview = "; ".join(
            f"{file_name}: {', '.join(reasons)}"
            for file_name, reasons in list(mismatches.items())[:10]
        )
        remaining = len(mismatches) - min(len(mismatches), 10)
        suffix = f"; and {remaining} more" if remaining else ""
        raise RuntimeError(
            f"Refusing to reuse {len(mismatches)} stale voice files ({preview}{suffix}). "
            "Review the metadata changes, then rerun with --force to regenerate only those files."
        )
    force_files = set(mismatches) if args.force else set()
    semaphore = asyncio.Semaphore(MAX_CONCURRENT_REQUESTS)
    tasks = [
        asyncio.create_task(
            synthesize(
                stem,
                profile_id,
                text,
                semaphore,
                force_files,
                existing_by_file[f"{stem}.mp3"],
            )
        )
        for stem, profile_id, text in LINES
    ]
    generated = []
    for completed, task in enumerate(asyncio.as_completed(tasks), start=1):
        generated.append(await task)
        if completed % 25 == 0 or completed == len(tasks):
            print(f"Prepared {completed}/{len(tasks)} persona voice lines", flush=True)
    merged = merge_manifest_files(existing, generated)
    manifest = {
        "lesson": "Group 3 lessons (HSK1 L1-L15, HSK2 L1-L15, HSK3 L1-L18)",
        "generator": f"edge-tts {edge_tts.__version__} + ffmpeg rubberband personas",
        "voiceCastVersion": VOICE_CAST_DATA["version"],
        "personaCount": VOICE_CAST_DATA["personaCount"],
        "loudnessTargetLufs": LOUDNESS_TARGET_LUFS,
        "profiles": VOICE_PROFILES,
        "files": merged,
    }
    staged_manifest = STAGING_ROOT / "audio/manifest.json"
    staged_manifest.parent.mkdir(parents=True, exist_ok=True)
    staged_manifest.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    promoted: list[tuple[Path, Path]] = []
    try:
        promotion_entries = [entry for entry in generated if not entry.get("skipped")]
        for entry in promotion_entries:
            current = canonical_destination(entry)
            staged = canonical_destination(entry, STAGING_ROOT)
            backup = canonical_destination(entry, BACKUP_ROOT)
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(current, backup)
            staged.replace(current)
            promoted.append((current, backup))
        manifest_backup = BACKUP_ROOT / "audio/manifest.json"
        manifest_backup.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(MANIFEST, manifest_backup)
        staged_manifest.replace(MANIFEST)
        promoted.append((MANIFEST, manifest_backup))
    except Exception:
        for current, backup in reversed(promoted):
            if backup.exists():
                shutil.copy2(backup, current)
        raise
    else:
        shutil.rmtree(BACKUP_ROOT)
        shutil.rmtree(STAGING_ROOT)
    fresh = [entry for entry in generated if not entry.get("skipped")]
    print(
        f"Synthesized and atomically promoted {len(fresh)} persona voice lines; "
        f"manifest now has {len(merged)} files"
    )


if __name__ == "__main__":
    asyncio.run(main())
