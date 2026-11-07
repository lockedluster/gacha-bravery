const CHAR_NAME_SET = new Set(CHARS.map(c => c.n));
const ARTIFACT_NAME_SET = new Set(ARTIFACTS);

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
  if (kind === 'weapon') return `images/genshin/weapons/${slugify(name)}.png`;
  if (kind === 'artifact') return `images/genshin/artifacts/${slugify(name)}.png`;
  return null;
}

function resultImageMarkup(name, kind = 'char', color = null) {
  const image = getItemImagePath(name, kind);
  if (!image) {
    return `<div class="result-icon" ${color ? `style="background:linear-gradient(160deg, ${color}55, ${color}18); border-color:${color};"` : ''}>${initials(name)}</div>`;
  }
  return `<div class="result-icon"><img src="${image}" alt="${name}" loading="lazy"></div>`;
}

function makeItemCard(name, owned, color, onToggle, rarity = null) {
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

  if (rarity) {
    const rarityLabel = document.createElement('span');
    rarityLabel.className = 'item-rarity';
    rarityLabel.textContent = '★'.repeat(rarity);
    rarityLabel.setAttribute('role', 'img');
    rarityLabel.setAttribute('aria-label', `${rarity}-star rarity`);
    thumb.appendChild(rarityLabel);
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

function getFilteredCharacters() {
  const elementFilter = document.getElementById('chars-element-filter').value;
  const weaponFilter = document.getElementById('chars-weapon-filter').value;
  const rarityFilter = document.getElementById('chars-rarity-filter').value;
  return CHARS.filter(character =>
    (!elementFilter || character.e === elementFilter) &&
    (!weaponFilter || character.w === weaponFilter) &&
    (!rarityFilter || character.rarity === Number(rarityFilter))
  );
}

function buildCharacterList() {
  const host = document.getElementById('chars-items');
  host.innerHTML = '';
  getFilteredCharacters().forEach(character => {
    const [, color] = ELEMENTS[character.e];
    host.appendChild(makeItemCard(character.n, ownedChars.has(character.n), color, on => {
      if (on) ownedChars.add(character.n); else ownedChars.delete(character.n);
      save('tr_chars', ownedChars);
      updateCounts();
    }, character.rarity));
  });
}

function getFilteredWeapons() {
  const weaponFilter = document.getElementById('weapons-type-filter').value;
  const rarityFilter = document.getElementById('weapons-rarity-filter').value;
  return Object.entries(WEAPONS)
    .filter(([type]) => !weaponFilter || type === weaponFilter)
    .flatMap(([, weapons]) => weapons)
    .filter(weapon => !rarityFilter || WEAPON_RARITIES[weapon] === Number(rarityFilter));
}

function buildWeaponList() {
  const host = document.getElementById('weapons-items');
  host.innerHTML = '';
  getFilteredWeapons().forEach(weapon => {
    host.appendChild(makeItemCard(weapon, ownedWeapons.has(weapon), null, on => {
      if (on) ownedWeapons.add(weapon); else ownedWeapons.delete(weapon);
      save('tr_weapons', ownedWeapons);
      updateCounts();
    }, WEAPON_RARITIES[weapon]));
  });
}

function updateCollectionOwnership(collection, action) {
  const isOwned = action === 'all';
  const items = collection === 'chars'
    ? getFilteredCharacters().map(character => character.n)
    : getFilteredWeapons();
  const owned = collection === 'chars' ? ownedChars : ownedWeapons;
  items.forEach(item => {
    if (isOwned) owned.add(item);
    else owned.delete(item);
  });
  save(collection === 'chars' ? 'tr_chars' : 'tr_weapons', owned);
  if (collection === 'chars') buildCharacterList();
  else buildWeaponList();
  updateCounts();
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
  const counts = {
    chars: `${CHARS.filter(c => ownedChars.has(c.n)).length}/${CHARS.length}`,
    weapons: `${allW.filter(w => ownedWeapons.has(w)).length}/${allW.length}`,
    artifacts: `${ARTIFACTS.filter(a => ownedArtifacts.has(a)).length}/${ARTIFACTS.length}`
  };
  Object.entries(counts).forEach(([key, count]) => {
    document.getElementById(`${key}-count`).textContent = count;
    document.getElementById(`${key}-count-label`).textContent = count;
  });
}

function populateCollectionFilters() {
  const elementFilter = document.getElementById('chars-element-filter');
  Object.entries(ELEMENTS).forEach(([key, [name]]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = name;
    elementFilter.appendChild(option);
  });

  [['chars-weapon-filter', 'All weapon types'], ['weapons-type-filter', 'All weapon types']].forEach(([id]) => {
    const select = document.getElementById(id);
    Object.entries(WTYPES).forEach(([key, name]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = name;
      select.appendChild(option);
    });
  });

  const characterRarities = [...new Set(CHARS.map(character => character.rarity))].sort((a, b) => b - a);
  const weaponRarities = [...new Set(Object.values(WEAPON_RARITIES))].sort((a, b) => b - a);
  [
    ['chars-rarity-filter', characterRarities],
    ['weapons-rarity-filter', weaponRarities]
  ].forEach(([id, rarities]) => {
    const select = document.getElementById(id);
    rarities.forEach(rarity => {
      const option = document.createElement('option');
      option.value = rarity;
      option.textContent = `${rarity}-star`;
      select.appendChild(option);
    });
  });

  elementFilter.addEventListener('change', buildCharacterList);
  document.getElementById('chars-weapon-filter').addEventListener('change', buildCharacterList);
  document.getElementById('chars-rarity-filter').addEventListener('change', buildCharacterList);
  document.getElementById('weapons-type-filter').addEventListener('change', buildWeaponList);
  document.getElementById('weapons-rarity-filter').addEventListener('change', buildWeaponList);
}

document.querySelectorAll('.collection-bulk-action').forEach(button => {
  button.addEventListener('click', () => {
    updateCollectionOwnership(button.dataset.collection, button.dataset.action);
  });
});

function setCollectionLauncherImages() {
  const images = {
    'chars-popout': 'images/genshin/characters/traveler.png',
    'weapons-popout': 'images/genshin/weapons/dull-blade.png',
    'artifacts-popout': 'images/genshin/artifacts/gladiators-finale.png'
  };

  document.querySelectorAll('.collection-launcher').forEach(button => {
    const image = button.querySelector('img');
    image.src = images[button.dataset.popout];
    image.onerror = () => { image.hidden = true; };
  });
}

function closeCollectionPopouts(returnFocus = false) {
  document.querySelectorAll('.collection-popout:not([hidden])').forEach(popout => {
    popout.hidden = true;
    const launcher = document.querySelector(`[data-popout="${popout.id}"]`);
    launcher.setAttribute('aria-expanded', 'false');
    if (returnFocus) launcher.focus();
  });
}

document.querySelectorAll('.collection-launcher').forEach(button => {
  button.addEventListener('click', () => {
    const popout = document.getElementById(button.dataset.popout);
    const wasOpen = !popout.hidden;
    closeCollectionPopouts();
    if (!wasOpen) {
      popout.hidden = false;
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

document.querySelectorAll('.collection-popout .popout-close').forEach(button => {
  button.addEventListener('click', () => closeCollectionPopouts(true));
});

document.addEventListener('click', event => {
  const clickedInsideCollection = event.composedPath().some(target =>
    target instanceof Element && target.matches('.collection-dock, .collection-popout')
  );
  if (!clickedInsideCollection) closeCollectionPopouts();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeCollectionPopouts(true);
});

const DOM = {
  teamSize: document.getElementById('team-size'),
  msg: document.getElementById('msg'),
  results: document.getElementById('results'),
  history: document.getElementById('roll-history'),
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

function renderRollResults(roll) {
  DOM.results.replaceChildren();
  document.querySelector('.result-stage').classList.toggle('has-results', roll.length > 0);
  roll.forEach(({ character, weapon, artifacts }, index) => {
    const card = buildResultCard(character, weapon, artifacts);
    card.style.setProperty('--reveal-delay', `${index * 90}ms`);
    DOM.results.appendChild(card);
  });
}

function addRollToHistory(roll) {
  const emptyMessage = DOM.history.querySelector('.history-empty');
  if (emptyMessage) emptyMessage.remove();

  const entry = document.createElement('li');
  entry.className = 'history-entry';

  const rollNumber = DOM.history.querySelectorAll('.history-entry').length + 1;
  const button = document.createElement('button');
  button.className = 'history-roll';
  button.type = 'button';
  button.setAttribute('aria-label', `Show roll ${rollNumber}: ${roll.map(result => result.character.n).join(', ')}`);
  button.setAttribute('aria-current', 'true');
  const characters = document.createElement('div');
  characters.className = 'history-characters';
  roll.forEach(({ character }) => {
    const avatar = document.createElement('span');
    avatar.className = 'history-avatar';
    const imagePath = getItemImagePath(character.n, 'char');
    if (imagePath) {
      const image = document.createElement('img');
      image.src = imagePath;
      image.alt = character.n;
      image.loading = 'lazy';
      avatar.appendChild(image);
    } else {
      avatar.textContent = initials(character.n);
      avatar.setAttribute('aria-label', character.n);
    }
    characters.appendChild(avatar);
  });
  button.appendChild(characters);
  button.addEventListener('click', () => {
    DOM.history.querySelectorAll('.history-roll').forEach(item => item.removeAttribute('aria-current'));
    button.setAttribute('aria-current', 'true');
    DOM.msg.textContent = '';
    renderRollResults(roll);
  });
  DOM.history.querySelectorAll('.history-roll').forEach(item => item.removeAttribute('aria-current'));
  entry.appendChild(button);
  DOM.history.prepend(entry);
}

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
  document.querySelector('.result-stage').classList.remove('has-results');

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

  const roll = team.map(ch => {
    const wpn = pickWeapon(ch);
    const art = pickArtifacts(allowCombo);
    return { character: ch, weapon: wpn, artifacts: art };
  });

  renderRollResults(roll);
  addRollToHistory(roll);
};

populateCollectionFilters();
setCollectionLauncherImages();
buildCharacterList();
buildWeaponList();
buildArtifactChips();
updateCounts();
