const CHAR_NAME_SET = new Set(CHARS.map(c => c.n));
const ARTIFACT_NAME_SET = new Set(ARTIFACTS);

document.querySelectorAll('details').forEach(detail => {
  detail.removeAttribute('open');
});

let ownedChars, ownedWeapons, ownedArtifacts;

function load(key, all) {
  try {
    const s = localStorage.getItem(key);
    if (s) return new Set(JSON.parse(s));
  } catch (e) {}
  return new Set(all);
}

function save(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch (e) {}
}

ownedChars = load('tr_chars', CHARS.map(c => c.n));
ownedWeapons = load('tr_weapons', Object.values(WEAPONS).flat());
ownedArtifacts = load('tr_artifacts', ARTIFACTS);

(function () {
  const seen = (() => {
    try { return new Set(JSON.parse(localStorage.getItem('tr_seen') || '[]')); }
    catch (e) { return new Set(); }
  })();

  const all = [...CHARS.map(c => c.n), ...Object.values(WEAPONS).flat(), ...ARTIFACTS];
  all.forEach(name => {
    if (seen.has(name)) return;
    if (CHAR_NAME_SET.has(name)) ownedChars.add(name);
    else if (ARTIFACT_NAME_SET.has(name)) ownedArtifacts.add(name);
    else ownedWeapons.add(name);
  });

  try { localStorage.setItem('tr_seen', JSON.stringify(all)); } catch (e) {}
  save('tr_chars', ownedChars);
  save('tr_weapons', ownedWeapons);
  save('tr_artifacts', ownedArtifacts);
})();

function initials(name) {
  return name.replace(/[()]/g, '').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function slugify(name) {
  return name.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[()']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function getItemImagePath(name, kind = 'char') {
  if (kind === 'char') return ITEM_IMAGES[name] || null;
  if (kind === 'weapon') return `images/weapons/${slugify(name)}.png`;
  if (kind === 'artifact') return `images/artifacts/${slugify(name)}.png`;
  return null;
}

function resultImageMarkup(name, kind = 'char', color = null) {
  const image = getItemImagePath(name, kind);
  if (!image) {
    return `<div class="result-icon" ${color ? `style="background:linear-gradient(160deg, ${color}55, ${color}18); border-color:${color};"` : ''}>${initials(name)}</div>`;
  }
  return `<div class="result-icon"><img src="${image}" alt="${name}" loading="lazy"></div>`;
}

function makeItemCard(name, owned, color, onToggle) {
  const card = document.createElement('div');
  card.className = 'item-card' + (owned ? ' on' : '');
  if (color) card.style.setProperty('--accent', color);

  const thumb = document.createElement('div');
  thumb.className = 'thumb';
  if (color) thumb.style.background = `linear-gradient(160deg, ${color}55, ${color}18)`;

  const image = getItemImagePath(name, 'char');
  if (image) {
    thumb.innerHTML = `<img src="${image}" alt="${name}" loading="lazy"><span class="check">✓</span>`;
  } else {
    thumb.innerHTML = `<span class="ph">${initials(name)}</span><span class="check">✓</span>`;
  }

  const label = document.createElement('div');
  label.className = 'item-label';
  label.textContent = name;

  card.appendChild(thumb);
  card.appendChild(label);
  card.addEventListener('click', () => {
    const isOn = card.classList.toggle('on');
    onToggle(isOn);
  });

  return card;
}

function buildCharGroups() {
  const host = document.getElementById('chars-groups');
  host.innerHTML = '';

  Object.keys(ELEMENTS).forEach(ek => {
    const [ename, color] = ELEMENTS[ek];
    const list = CHARS.filter(c => c.e === ek);
    const group = document.createElement('div');
    group.className = 'group';
    group.innerHTML = `<div class="group-head"><b style="color:${color}">${ename}</b>
      <span><button class="mini" data-el="${ek}" data-act="on">All</button> <button class="mini" data-el="${ek}" data-act="off">None</button></span></div>
      <div class="chips"></div>`;

    host.appendChild(group);
    const chipsEl = group.querySelector('.chips');
    list.forEach(character => {
      chipsEl.appendChild(makeItemCard(character.n, ownedChars.has(character.n), color, on => {
        if (on) ownedChars.add(character.n); else ownedChars.delete(character.n);
        save('tr_chars', ownedChars);
        updateCounts();
      }));
    });
  });

  host.querySelectorAll('.mini').forEach(button => {
    button.onclick = () => {
      CHARS.filter(c => c.e === button.dataset.el).forEach(character => {
        if (button.dataset.act === 'on') ownedChars.add(character.n);
        else ownedChars.delete(character.n);
      });
      save('tr_chars', ownedChars);
      buildCharGroups();
      updateCounts();
    };
  });
}

function buildWeaponGroups() {
  const host = document.getElementById('weapons-groups');
  host.innerHTML = '';

  Object.keys(WTYPES).forEach(wk => {
    const group = document.createElement('div');
    group.className = 'group';
    group.innerHTML = `<div class="group-head"><b>${WTYPES[wk]}</b>
      <span><button class="mini" data-w="${wk}" data-act="on">All</button> <button class="mini" data-w="${wk}" data-act="off">None</button></span></div>
      <div class="chips"></div>`;

    host.appendChild(group);
    const chipsEl = group.querySelector('.chips');
    WEAPONS[wk].forEach(weapon => {
      chipsEl.appendChild(makeItemCard(weapon, ownedWeapons.has(weapon), null, on => {
        if (on) ownedWeapons.add(weapon); else ownedWeapons.delete(weapon);
        save('tr_weapons', ownedWeapons);
        updateCounts();
      }));
    });
  });

  host.querySelectorAll('.mini').forEach(button => {
    button.onclick = () => {
      WEAPONS[button.dataset.w].forEach(weapon => {
        if (button.dataset.act === 'on') ownedWeapons.add(weapon);
        else ownedWeapons.delete(weapon);
      });
      save('tr_weapons', ownedWeapons);
      buildWeaponGroups();
      updateCounts();
    };
  });
}

function buildArtifactChips() {
  const host = document.getElementById('artifacts-groups');
  host.innerHTML = '';

  ARTIFACT_GROUPS.forEach((groupData, groupIndex) => {
    const group = document.createElement('div');
    group.className = 'group';
    group.innerHTML = `<div class="group-head"><b>${groupData.label}</b>
      <span><button class="mini" data-g="${groupIndex}" data-act="on">All</button> <button class="mini" data-g="${groupIndex}" data-act="off">None</button></span></div>
      <div class="chips"></div>`;

    host.appendChild(group);
    const chipsEl = group.querySelector('.chips');
    groupData.list.forEach(artifact => {
      chipsEl.appendChild(makeItemCard(artifact, ownedArtifacts.has(artifact), null, on => {
        if (on) ownedArtifacts.add(artifact); else ownedArtifacts.delete(artifact);
        save('tr_artifacts', ownedArtifacts);
        updateCounts();
      }));
    });
  });

  host.querySelectorAll('.mini').forEach(button => {
    button.onclick = () => {
      ARTIFACT_GROUPS[+button.dataset.g].list.forEach(artifact => {
        if (button.dataset.act === 'on') ownedArtifacts.add(artifact);
        else ownedArtifacts.delete(artifact);
      });
      save('tr_artifacts', ownedArtifacts);
      buildArtifactChips();
      updateCounts();
    };
  });
}

function updateCounts() {
  const allW = Object.values(WEAPONS).flat();
  document.getElementById('chars-count').textContent = `${CHARS.filter(c => ownedChars.has(c.n)).length}/${CHARS.length}`;
  document.getElementById('weapons-count').textContent = `${allW.filter(w => ownedWeapons.has(w)).length}/${allW.length}`;
  document.getElementById('artifacts-count').textContent = `${ARTIFACTS.filter(a => ownedArtifacts.has(a)).length}/${ARTIFACTS.length}`;
}

const DOM = {
  teamSize: document.getElementById('team-size'),
  msg: document.getElementById('msg'),
  results: document.getElementById('results'),
  comboToggle: document.getElementById('combo-toggle'),
  rollBtn: document.getElementById('roll-btn'),
  teamInc: document.getElementById('team-inc'),
  teamDec: document.getElementById('team-dec')
};

let teamSize = 4;
DOM.teamInc.onclick = () => {
  if (teamSize < 4) {
    teamSize++;
    DOM.teamSize.textContent = teamSize;
  }
};

DOM.teamDec.onclick = () => {
  if (teamSize > 1) {
    teamSize--;
    DOM.teamSize.textContent = teamSize;
  }
};

const rnd = arr => arr[Math.floor(Math.random() * arr.length)];

function pickWeapon(ch) {
  const owned = WEAPONS[ch.w].filter(w => ownedWeapons.has(w));
  const pool = owned.length ? owned : WEAPONS[ch.w];
  return { name: rnd(pool), fallback: owned.length === 0 };
}

function pickArtifacts(allowCombo) {
  const owned = ARTIFACTS.filter(a => ownedArtifacts.has(a));
  const pool = owned.length ? owned : ARTIFACTS;
  const fallback = owned.length === 0;

  if (allowCombo && pool.length > 1 && Math.random() < 0.5) {
    const a = rnd(pool);
    let b;
    do { b = rnd(pool); } while (b === a);
    return { sets: [a + ' (2pc)', b + ' (2pc)'], fallback };
  }

  return { sets: [rnd(pool) + ' (4pc)'], fallback };
}

function makeResultItem(name, kind = 'char') {
  const item = document.createElement('span');
  item.className = 'result-item';
  item.innerHTML = `${resultImageMarkup(name, kind)}<b>${name}</b>`;
  return item;
}

function buildResultCard(ch, wpn, art) {
  const [ename, color] = ELEMENTS[ch.e];
  const card = document.createElement('div');
  card.className = `result-card${art.sets.length > 1 ? ' combo-result' : ''}`;
  card.style.setProperty('--elc', color);

  const head = document.createElement('div');
  head.className = 'result-head result-character';
  head.innerHTML = `${resultImageMarkup(ch.n, 'char', color)}<div><h3>${ch.n}</h3></div>`;
  card.appendChild(head);

  const weaponRow = document.createElement('div');
  weaponRow.className = 'result-section weapon-result';
  weaponRow.appendChild(makeResultItem(wpn.name, 'weapon'));
  card.appendChild(weaponRow);

  const artifactRow = document.createElement('div');
  artifactRow.className = 'result-section artifact-result';

  const artifactGroup = document.createElement('div');
  artifactGroup.className = `artifact-group${art.sets.length > 1 ? ' combo' : ''}`;
  const items = art.sets.map(setName => {
    const clean = setName.replace(/ \(2pc\)| \(4pc\)$/, '');
    const row = document.createElement('span');
    row.className = 'result-item';
    row.innerHTML = `${resultImageMarkup(clean, 'artifact')}<b>${setName}</b>`;
    return row;
  });
  items.forEach(item => artifactGroup.appendChild(item));
  artifactRow.appendChild(artifactGroup);
  card.appendChild(artifactRow);

  if (wpn.fallback || art.fallback) {
    const note = document.createElement('div');
    note.className = 'note';
    note.textContent = 'Not marked as owned — picked from full pool';
    card.appendChild(note);
  }

  return card;
}

DOM.rollBtn.onclick = () => {
  DOM.msg.textContent = '';
  DOM.results.innerHTML = '';

  const pool = CHARS.filter(c => ownedChars.has(c.n));
  const allowCombo = DOM.comboToggle.checked;

  if (pool.length === 0) {
    DOM.msg.textContent = 'Select at least one owned character first.';
    return;
  }

  let working = [...pool];
  const team = [];

  for (let i = 0; i < teamSize && working.length; i++) {
    const idx = Math.floor(Math.random() * working.length);
    const picked = working[idx];
    team.push(picked);
    working.splice(idx, 1);

    if (picked.g === 'trav') working = working.filter(c => c.g !== 'trav');
  }

  if (team.length < teamSize) {
    DOM.msg.textContent = `Only ${team.length} valid character(s) available for this roll — select more owned characters.`;
  }

  team.forEach(ch => {
    const wpn = pickWeapon(ch);
    const art = pickArtifacts(allowCombo);
    DOM.results.appendChild(buildResultCard(ch, wpn, art));
  });
};

buildCharGroups();
buildWeaponGroups();
buildArtifactChips();
updateCounts();
