import { mockChannels, categories } from './src/data/mockChannels.js';
import fs from 'fs';

const payload = {
  "working": [],
  "broken": [
    "cm77mmgbpf"
  ],
  "order": [
    "cvlt4f5n3s", "cvoluj1wyy", "cuxhlg978l", "c16g679utm", "cq9sxtg4o2",
    "ccbdd1hxj9", "c8m9dki2h5", "cm77mmgbpf", "c8t77do5ox", "c9cu3v4krw",
    "cqe4ks7ppb", "c7p8vtl70l", "ck4kw3hw7b", "c6f8kghdj4", "cbkn0jb19d",
    "cqgkipzpxp", "c5tkmboj2f", "c0mpyf3g9w", "cz2cy731ug", "c2qwx23wp8",
    "c22a0wpm0p", "ci3h7lu7ix", "cnnizm622y", "c2bhcm408t", "ce52lcyaym",
    "c4bend6tq6", "cpqdncn9ax", "casmrymmh2", "c67jlj0u00", "cjva1j1vm6",
    "cgm1jqt1dr", "c2cewkongr", "c3ccgsvj0a", "copdcjtb7x", "c59vvhfllp",
    "cq13a0gcne", "cl3ovo4qz1", "ckgnty5gfw", "cccwx7kn49", "c4x9hxap5f",
    "c5g6f0uga8", "c9j8u2uhy1", "c8gc15wl99", "cdbr3h96zx", "co2ih8db0x",
    "cfci7irg74", "c43ztj4rhy", "cazxpehjve", "cuzzvq4zd6", "csaubf03r0",
    "c0iske9ecp", "c15qeh8p8p", "coipqenyxr", "c33j7qlxna", "csld5xy0p8",
    "c8x1c8urhe", "crjoy121db", "cbd87ij9zn", "cyd39dd2r6", "cflt3o03bn",
    "c7mvjjzwj1", "c0js3zhcfp", "cx8tllkj7w", "c4d7yswe3u", "cy1ql3iwtx",
    "cn5u9i7xc6", "c4ja0k7fyx", "ca94liv0wx", "ctf5qcj5tp", "c0wjavtf04",
    "c1zkh6mjz8", "ck676etuqg", "cjbw47mbai", "ct8hx0ugaa", "cdgojhqirm",
    "czau63qov7", "c0kkplmxx3", "c53c9rkepd", "cas8bdfjtj", "coaninpwc4",
    "c3sx0qd1i2", "ccqs272iky", "cdp3h75yu2", "caystzf58e", "c6sv6jt6x0",
    "cncm1inx1h", "c54wkf4f7n", "c2pbg5zlok", "cbcrks9vja", "czej65x07v",
    "cikgx5pomy", "cvoyzwyau1", "cm8qdum0mf", "c2teawda7o", "c3ub8vzy7l",
    "cu27j9ltba", "cqsjkse2v5", "cbl6q23pi4", "cbn9ot0vvg", "c1bcg0ihlo",
    "cnkeeizm6c", "cq5fe4nwhq", "cxpoogtzmu", "cxqvtdi8qp", "cx642upzzp",
    "cetdojitow", "c2uoclp8kl", "c7fs933zpt", "c6aqhu3ljr", "cl423iclth",
    "cw8ovhmn49", "cokn5a494h", "ccz19wb42n", "cqgqewdqx3", "cn7xoyrbu3",
    "c4pu7i3rxr", "cdn19c6cqz", "cqozy46mv6", "cj03ftykyb", "cj7mgwm9jo",
    "cmaqzijvvr", "cnfh29n293", "ccg70m4kza", "cgdqkz1803", "ci6dab2s5o",
    "cgxyn3xyp5", "c27gg4xl1h", "cm8snj1ffq", "clmuyad5xe", "c6stpiewg6",
    "c9449lorv7", "cakrq897te", "cutggos3z4", "cihm7yszs1", "ccxcwtwsgq",
    "c5jvprs32a", "c1qbre5528", "ca3ar4nema", "csjvdrpjlx", "cvwy5xr1cr",
    "ce9g8l391l", "c3a7gweuc5", "cd3qczbnb7", "c26sx1ki2y", "c1cuqa5bei",
    "c7npy9lp4i", "cyhxmxfw3h", "cfrxdhtjbw", "cdfkc0ewr2", "cbjhfmfwl8",
    "c9a8j84un7", "c33mwsbsm9", "ch8cmmcf2v", "cxlf2559xo", "cmkalsm0xi",
    "cbabs5wtjj", "czreo1uiww", "cripnfs4go", "cwmnqeec9n", "chlaz6qz45",
    "csqcp0g006", "ctqr1fa3jp", "c57o969fsw", "ckrke0nf9i", "c0lo40jmwc",
    "cs4aby8sdh", "czm00l2le4", "cc01omefed", "c2j0vebdpz", "c9hy8n88e7",
    "cumzdrqj8f", "c40z20mz95", "clz7mt1m5c", "cnvvxcpqt3"
  ],
  "renames": {
    "cvlt4f5n3s": "BTV (Server 1)",
    "cvoluj1wyy": "BTV (Server 2)",
    "cuxhlg978l": "T Sports (Server 1)",
    "c16g679utm": "T Sports (Server 2)",
    "cq9sxtg4o2": "T Sports (Server 3)",
    "ccbdd1hxj9": "SOMOY (Server 1)",
    "c8m9dki2h5": "SOMOY (Server 2)",
    "c8t77do5ox": "PTV (Server 1)",
    "c9cu3v4krw": "PTV (Server 2)",
    "cqe4ks7ppb": "SONY MAX (Server 1)",
    "c7p8vtl70l": "SONY MAX (Server 2)",
    "ck4kw3hw7b": "MBC (Server 1)",
    "c6f8kghdj4": "TV RI (Server 1)"
  }
};

let updated = mockChannels.filter(c => !payload.broken.includes(c.id));

updated = updated.map(c => {
  if (payload.renames[c.id]) {
    return { ...c, name: payload.renames[c.id] };
  }
  return c;
});

const orderedChannels = [];
const remainingChannels = [...updated];

for (const id of payload.order) {
  const idx = remainingChannels.findIndex(c => c.id === id);
  if (idx !== -1) {
    orderedChannels.push(remainingChannels[idx]);
    remainingChannels.splice(idx, 1);
  }
}
orderedChannels.push(...remainingChannels);

const uniqueCategories = ['All'];
for (const c of orderedChannels) {
  if (!uniqueCategories.includes(c.category)) {
    uniqueCategories.push(c.category);
  }
}

const jsContent = "export const mockChannels = " + JSON.stringify(orderedChannels, null, 2) + ";\n\nexport const categories = " + JSON.stringify(uniqueCategories, null, 2) + ";\n";
fs.writeFileSync('src/data/mockChannels.js', jsContent);
console.log('Successfully applied renames, reordering, and removals.');
