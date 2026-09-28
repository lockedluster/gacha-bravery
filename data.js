const ELEMENTS = {P:['Pyro','#e8623c'],H:['Hydro','#4fa8e0'],A:['Anemo','#7fd9c4'],E:['Electro','#b98be0'],D:['Dendro','#a8c848'],C:['Cryo','#9fe0e8'],G:['Geo','#e0b64f']};
const WTYPES = {S:'Sword',C:'Claymore',L:'Polearm',B:'Bow',M:'Catalyst'};

const CHAR_TXT = `Amber|P|B
Bennett|P|S
Xiangling|P|L
Diluc|P|C
Klee|P|M
Yoimiya|P|B
Hu Tao|P|L
Yanfei|P|M
Thoma|P|L
Dehya|P|C
Lyney|P|B
Chevreuse|P|L
Arlecchino|P|L
Mavuika|P|C
Xinyan|P|C
Gaming|P|C
Nicole|P|M
Durin|P|S
Traveler (Pyro)|P|S|trav
Barbara|H|M
Xingqiu|H|S
Tartaglia|H|B
Mona|H|M
Sangonomiya Kokomi|H|M
Yelan|H|B
Kamisato Ayato|H|S
Nilou|H|S
Furina|H|S
Neuvillette|H|M
Sigewinne|H|B
Mualani|H|M
Vodyanitsa|H|M
Aino|H|C
Candace|H|L
Dahlia|H|S
Columbina|H|M
Traveler (Hydro)|H|S|trav
Sucrose|A|M
Jean|A|S
Venti|A|B
Xiao|A|L
Kaedehara Kazuha|A|S
Sayu|A|C
Shikanoin Heizou|A|M
Wanderer|A|M
Faruzan|A|B
Xianyun|A|M
Chasca|A|B
Lynette|A|S
Yumemizuki Mizuki|A|M
Vesna|A|S
Varka|A|C
Jahoda|A|B
Prune|A|M
Ifa|A|M
Lan Yan|A|M
Traveler (Anemo)|A|S|trav
Beidou|E|C
Fischl|E|B
Razor|E|C
Keqing|E|S
Cyno|E|L
Yae Miko|E|M
Kuki Shinobu|E|S
Raiden Shogun|E|L
Dori|E|C
Lisa|E|M
Clorinde|E|S
Sethos|E|B
Ororon|E|M
Varesa|E|C
Kujou Sara|E|B
Iansan|E|L
Flins|E|L
Ineffa|E|L
Alyosha|E|L
Traveler (Electro)|E|S|trav
Ningguang|G|M
Noelle|G|C
Zhongli|G|L
Albedo|G|S
Yun Jin|G|L
Arataki Itto|G|C
Gorou|G|B
Chiori|G|S
Navia|G|C
Xilonen|G|S
Kachina|G|L
Illuga|G|L
Linnea|G|B
Zibai|G|S
Traveler (Geo)|G|S|trav
Chongyun|C|C
Kaeya|C|S
Qiqi|C|S
Diona|C|B
Rosaria|C|L
Ganyu|C|B
Eula|C|C
Shenhe|C|L
Kamisato Ayaka|C|S
Layla|C|S
Mika|C|L
Wriothesley|C|M
Freminet|C|C
Charlotte|C|M
Escoffier|C|L
Skirk|C|S
Odette|C|S
Citlali|C|M
Aloy|C|B
Sandrone|C|C
Lohen|C|L
Traveler (Cryo)|C|S|trav
Tighnari|D|B
Collei|D|B
Yaoyao|D|L
Kaveh|D|C
Alhaitham|D|S
Nahida|D|M
Baizhu|D|M
Kirara|D|S
Emilie|D|L
Kinich|D|C
Lauma|D|M
Nefer|D|M
Traveler (Dendro)|D|S|trav`;

const WEAPONS = {
S:["Absolution","Amenoma Kageuchi","Aquila Favonia","Athame Artis","Azurelight","Beyond the Chrysalis","Blackcliff Longsword","Calamity of Eshu","Cinnabar Spindle","Cool Steel","Dark Iron Sword","Dull Blade","Emberwell","Exaiphanes Blade","Favonius Sword","Festering Desire","Fillet Blade","Finale of the Deep","Fleuve Cendre Ferryman","Flute of Ezpitzal","Freedom-Sworn","Harbinger of Dawn","Haran Geppaku Futsu","Heretic's Molten Blade","Iron Sting","Kagotsurube Isshin","Key of Khaj-Nisut","Light of Foliar Incision","Lightbearing Moonshard","Lion's Roar","Mistsplitter Reforged","Moonweaver's Dawn","New Bough","Peak Patrol Song","Primordial Jade Cutter","Prototype Rancour","Royal Longsword","Sacrificial Sword","Sapwood Blade","Serenity's Call","Silver Light","Silver Sword","Skyrider Sword","Skyward Blade","Splendor of Tranquil Waters","Sturdy Bone","Summit Shaper","Sword of Descension","Sword of Narzissenkreuz","The Alley Flash","The Black Sword","The Dockhand's Assistant","The Flute","Toukabou Shigure","Traveler's Handy Sword","Uraku Misugiri","Whitelake Frostfeather","Wolf-Fang","Xiphos' Moonlight"],
C:["A Teaspoon of Transcendence","A Thousand Blazing Suns","Akuoumaru","Beacon of the Reed Sea","Blackcliff Slasher","Blade of Atonement","Bloodtainted Greatsword","Debate Club","Earth Shaker","Fang of the Mountain King","Favonius Greatsword","Ferrous Shadow","Flame-Forged Insight","Forest Regalia","Forged by the Golden Melody","Fruitful Hook","Gest of the Mighty Wolf","Katsuragikiri Nagamasa","Lithic Blade","Luxurious Sea-Lord","Mailed Flower","Makhaira Aquamarine","Master Key","Old Merc's Pal","Portable Power Saw","Prototype Archaic","Rainslasher","Redhorn Stonethresher","Royal Greatsword","Sacrificial Greatsword","Serpent Spine","Skyrider Greatsword","Skyward Pride","Snow-Tombed Starsilver","Song of Broken Pines","Talking Stick","The Bell","The Unforged","Tidal Shadow","Ultimate Overlord's Mega Magic Sword","Verdict","Waster Greatsword","White Iron Greatsword","Whiteblind","Wolf's Gravestone"],
L:["Ballad of the Fjords","Beginner's Protector","Black Tassel","Blackcliff Pole","Bloodsoaked Ruins","Calamity Queller","Crescent Pike","Crimson Moon's Semblance","Deathmatch","Dialogues of the Desert Sages","Disaster and Remorse","Dragon's Bane","Dragonspine Spear","Engulfing Lightning","Favonius Lance","Footprint of the Rainbow","Fractured Halo","Frostbreath","Halberd","Iron Point","Kitain Cross Spear","Lithic Spear","Lumidouce Elegy","Missive Windspear","Moonpiercer","Mountain-Bracing Bolt","Primordial Jade Winged-Spear","Prospector's Drill","Prospector's Shovel","Prototype Starglitter","Rightful Reward","Royal Spear","Sacrificer's Staff","Skyward Spine","Song of the Vigil","Staff of Homa","Staff of the Scarlet Sands","Symphonist of Scents","Tamayuratei no Ohanashi","The Catch","Vortex Vanquisher","Wavebreaker's Fin","White Tassel"],
B:["Alley Hunter","Amos' Bow","Aqua Simulacra","Astral Vulture's Crimson Plumage","Blackcliff Warbow","Breezeborne Refrain","Chain Breaker","Cloudforged","Compound Bow","Covenant of Frost and Snow","Elegy for the End","End of the Line","Fading Twilight","Favonius Warbow","Flower-Wreathed Feathers","Golden Frostbound Oath","Hamayumi","Hunter's Bow","Hunter's Path","Ibis Piercer","Jade Vista","King's Squire","Messenger","Mitternachts Waltz","Mouun's Moon","Polar Star","Predator","Prototype Crescent","Rainbow Serpent's Rain Bow","Range Gauge","Raven Bow","Recurve Bow","Royal Bow","Rust","Sacrificial Bow","Scion of the Blazing Sun","Seasoned Hunter's Bow","Sequence of Solitude","Sharpshooter's Oath","Silvershower Heartstrings","Skyward Harp","Slingshot","Snare Hook","Song of Stillness","The Daybreak Chronicles","The First Great Magic","The Stringless","The Viridescent Hunt","Thundering Pulse","Windblume Ode"],
M:["A Thousand Floating Dreams","Angelos' Heptades","Apprentice's Notes","Ash-Graven Drinking Horn","Ballad of the Boundless Blue","Blackcliff Agate","Blackmarrow Lantern","Cashflow Supervision","Clash of Kings","Crane's Echoing Call","Dawning Frost","Dodoco Tales","Echoes of the Heart","Emerald Orb","Etherlight Spindlelute","Everlasting Moonglow","Eye of Perception","Favonius Codex","Flowing Purity","Frostbearer","Fruit of Fulfillment","Hakushin Ring","Hymn of the Maelstrom","Jadefall's Splendor","Kagura's Verity","Lost Prayer to the Sacred Winds","Magic Guide","Mappa Mare","Memory of Dust","Nightweaver's Looking Glass","Nocturne's Curtain Call","Oathsworn Eye","Otherworldly Story","Pocket Grimoire","Prototype Amber","Reliquary of Truth","Ring of Yaxche","Royal Grimoire","Sacrificial Fragments","Sacrificial Jade","Skyward Atlas","Solar Pearl","Starcaller's Watch","Sunny Morning Sleep-In","Surf's Up","The Widsith","Thrilling Tales of Dragon Slayers","Tome of the Eternal Flow","Tulaytullah's Remembrance","Twin Nephrite","Vivid Notions","Wandering Evenstar","Waveriding Whirl","Wine and Song","Winter's Heavy Heart"]
};
Object.keys(WEAPONS).forEach(k => WEAPONS[k].sort((a, b) => a.localeCompare(b)));

const ARTIFACTS = ["Resolution of Sojourner","Brave Heart","Defender's Will","Tiny Miracle","Berserker","Martial Artist","Instructor","Gambler","The Exile","Scholar","Blizzard Strayer","Thundersoother","Lavawalker","Maiden Beloved","Gladiator's Finale","Viridescent Venerer","Wanderer's Troupe","Thundering Fury","Crimson Witch of Flames","Noblesse Oblige","Bloodstained Chivalry","Prayers for Illumination","Prayers for Destiny","Prayers for Wisdom","Prayers to Springtime","Archaic Petra","Retracing Bolide","Heart of Depth","Tenacity of the Millelith","Pale Flame","Shimenawa's Reminiscence","Emblem of Severed Fate","Husk of Opulent Dreams","Ocean-Hued Clam","Vermillion Hereafter","Echoes of an Offering","Deepwood Memories","Gilded Dreams","Desert Pavilion Chronicle","Flower of Paradise Lost","Nymph's Dream","Vourukasha's Glow","Marechaussee Hunter","Golden Troupe","Song of Days Past","Nighttime Whispers in the Echoing Woods","Fragment of Harmonic Whimsy","Unfinished Reverie","Scroll of the Hero of Cinder City","Obsidian Codex","Long Night's Oath","Finale of the Deep Galleries","Night of the Sky's Unveiling","Silken Moon's Serenade","Aubade of Morningstar and Moon","A Day Carved From Rising Winds","Celestial Gift","Disenchantment in Deep Shadow","Scarlet Proof","Heart of the Furnace"];

const CHARS = CHAR_TXT.trim().split("\n").map(line => {
  const [n, e, w, g] = line.split("|");
  return { n, e, w, g: g || null };
}).sort((a, b) => a.n.localeCompare(b.n));

const ITEM_IMAGES = {
  "Amber":"images/characters/amber.png",
  "Bennett":"images/characters/bennett.png",
  "Xiangling":"images/characters/xiangling.png",
  "Diluc":"images/characters/diluc.png",
  "Klee":"images/characters/klee.png",
  "Yoimiya":"images/characters/yoimiya.png",
  "Hu Tao":"images/characters/hu-tao.png",
  "Yanfei":"images/characters/yanfei.png",
  "Thoma":"images/characters/thoma.png",
  "Dehya":"images/characters/dehya.png",
  "Lyney":"images/characters/lyney.png",
  "Chevreuse":"images/characters/chevreuse.png",
  "Arlecchino":"images/characters/arlecchino.png",
  "Mavuika":"images/characters/mavuika.png",
  "Xinyan":"images/characters/xinyan.png",
  "Gaming":"images/characters/gaming.png",
  "Nicole":"images/characters/nicole.png",
  "Durin":"images/characters/durin.png",
  "Traveler (Pyro)":"images/characters/traveler.png",
  "Barbara":"images/characters/barbara.png",
  "Xingqiu":"images/characters/xingqiu.png",
  "Tartaglia":"images/characters/tartaglia.png",
  "Mona":"images/characters/mona.png",
  "Sangonomiya Kokomi":"images/characters/sangonomiya-kokomi.png",
  "Yelan":"images/characters/yelan.png",
  "Kamisato Ayato":"images/characters/kamisato-ayato.png",
  "Nilou":"images/characters/nilou.png",
  "Furina":"images/characters/furina.png",
  "Neuvillette":"images/characters/neuvillette.png",
  "Sigewinne":"images/characters/sigewinne.png",
  "Mualani":"images/characters/mualani.png",
  "Vodyanitsa":"images/characters/vodyanitsa.png",
  "Aino":"images/characters/aino.png",
  "Candace":"images/characters/candace.png",
  "Dahlia":"images/characters/dahlia.png",
  "Columbina":"images/characters/columbina.png",
  "Traveler (Hydro)":"images/characters/traveler.png",
  "Sucrose":"images/characters/sucrose.png",
  "Jean":"images/characters/jean.png",
  "Venti":"images/characters/venti.png",
  "Xiao":"images/characters/xiao.png",
  "Kaedehara Kazuha":"images/characters/kaedehara-kazuha.png",
  "Sayu":"images/characters/sayu.png",
  "Shikanoin Heizou":"images/characters/shikanoin-heizou.png",
  "Wanderer":"images/characters/wanderer.png",
  "Faruzan":"images/characters/faruzan.png",
  "Xianyun":"images/characters/xianyun.png",
  "Chasca":"images/characters/chasca.png",
  "Lynette":"images/characters/lynette.png",
  "Yumemizuki Mizuki":"images/characters/mizuki.png",
  "Vesna":"images/characters/vesna.png",
  "Varka":"images/characters/varka.png",
  "Jahoda":"images/characters/jahoda.png",
  "Prune":"images/characters/prune.png",
  "Ifa":"images/characters/ifa.png",
  "Lan Yan":"images/characters/lanyan.png",
  "Traveler (Anemo)":"images/characters/traveler.png",
  "Beidou":"images/characters/beidou.png",
  "Fischl":"images/characters/fischl.png",
  "Razor":"images/characters/razor.png",
  "Keqing":"images/characters/keqing.png",
  "Cyno":"images/characters/cyno.png",
  "Yae Miko":"images/characters/yae-miko.png",
  "Kuki Shinobu":"images/characters/kuki-shinobu.png",
  "Raiden Shogun":"images/characters/raiden-shogun.png",
  "Dori":"images/characters/dori.png",
  "Lisa":"images/characters/lisa.png",
  "Clorinde":"images/characters/clorinde.png",
  "Sethos":"images/characters/sethos.png",
  "Ororon":"images/characters/ororon.png",
  "Varesa":"images/characters/varesa.png",
  "Kujou Sara":"images/characters/kujou-sara.png",
  "Iansan":"images/characters/iansan.png",
  "Flins":"images/characters/flins.png",
  "Ineffa":"images/characters/ineffa.png",
  "Alyosha":"images/characters/alyosha.png",
  "Traveler (Electro)":"images/characters/traveler.png",
  "Ningguang":"images/characters/ningguang.png",
  "Noelle":"images/characters/noelle.png",
  "Zhongli":"images/characters/zhongli.png",
  "Albedo":"images/characters/albedo.png",
  "Yun Jin":"images/characters/yun-jin.png",
  "Arataki Itto":"images/characters/arataki-itto.png",
  "Gorou":"images/characters/gorou.png",
  "Chiori":"images/characters/chiori.png",
  "Navia":"images/characters/navia.png",
  "Xilonen":"images/characters/xilonen.png",
  "Kachina":"images/characters/kachina.png",
  "Illuga":"images/characters/illuga.png",
  "Linnea":"images/characters/linnea.png",
  "Zibai":"images/characters/zibai.png",
  "Traveler (Geo)":"images/characters/traveler.png",
  "Chongyun":"images/characters/chongyun.png",
  "Kaeya":"images/characters/kaeya.png",
  "Qiqi":"images/characters/qiqi.png",
  "Diona":"images/characters/diona.png",
  "Rosaria":"images/characters/rosaria.png",
  "Ganyu":"images/characters/ganyu.png",
  "Eula":"images/characters/eula.png",
  "Shenhe":"images/characters/shenhe.png",
  "Kamisato Ayaka":"images/characters/kamisato-ayaka.png",
  "Layla":"images/characters/layla.png",
  "Mika":"images/characters/mika.png",
  "Wriothesley":"images/characters/wriothesley.png",
  "Freminet":"images/characters/freminet.png",
  "Charlotte":"images/characters/charlotte.png",
  "Escoffier":"images/characters/escoffier.png",
  "Skirk":"images/characters/skirk.png",
  "Odette":"images/characters/odette.png",
  "Citlali":"images/characters/citlali.png",
  "Aloy":"images/characters/aloy.png",
  "Sandrone":"images/characters/sandrone.png",
  "Lohen":"images/characters/lohen.png",
  "Traveler (Cryo)":"images/characters/traveler.png",
  "Tighnari":"images/characters/tighnari.png",
  "Collei":"images/characters/collei.png",
  "Yaoyao":"images/characters/yaoyao.png",
  "Kaveh":"images/characters/kaveh.png",
  "Alhaitham":"images/characters/alhaitham.png",
  "Nahida":"images/characters/nahida.png",
  "Baizhu":"images/characters/baizhu.png",
  "Kirara":"images/characters/kirara.png",
  "Emilie":"images/characters/emilie.png",
  "Kinich":"images/characters/kinich.png",
  "Lauma":"images/characters/lauma.png",
  "Nefer":"images/characters/nefer.png",
  "Traveler (Dendro)":"images/characters/traveler.png"
};

const FOUR_STAR_ONLY = new Set([
  "Resolution of Sojourner","Brave Heart","Defender's Will","Tiny Miracle","Berserker","Martial Artist","Instructor","Gambler","The Exile","Scholar","Prayers for Illumination","Prayers for Destiny","Prayers for Wisdom","Prayers to Springtime"
]);

const ARTIFACT_GROUPS = [
  {label:'Up to 5★ sets — by release order', list: ARTIFACTS.filter(a => !FOUR_STAR_ONLY.has(a))},
  {label:'4★-only sets — by release order', list: ARTIFACTS.filter(a => FOUR_STAR_ONLY.has(a))}
];
