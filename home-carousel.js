const previewStage = document.getElementById('preview-stage');
const previewPosition = document.getElementById('preview-position');
const previewCharacters = [];
let previewIndex = 0;

function chooseRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function previewImage(name) {
  const image = ITEM_IMAGES[name];
  const icon = document.createElement('div');
  icon.className = 'result-icon';
  if (image) {
    const img = document.createElement('img');
    img.src = image;
    img.alt = name;
    img.loading = 'lazy';
    icon.appendChild(img);
  } else {
    icon.textContent = name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase();
    icon.setAttribute('aria-label', name);
  }
  return icon;
}

function previewItem(name, label = name) {
  const item = document.createElement('span');
  item.className = 'result-item';
  item.append(previewImage(name));
  const caption = document.createElement('b');
  caption.textContent = label;
  item.append(caption);
  return item;
}

function makePreviewCard(character) {
  const [, color] = ELEMENTS[character.e];
  const weapon = chooseRandom(WEAPONS[character.w]);
  const combo = ARTIFACTS.length > 1 && Math.random() < 0.5;
  const artifacts = combo
    ? [chooseRandom(ARTIFACTS), null]
    : [chooseRandom(ARTIFACTS)];
  if (combo) {
    do {
      artifacts[1] = chooseRandom(ARTIFACTS);
    } while (artifacts[1] === artifacts[0]);
  }

  const card = document.createElement('article');
  card.className = `result-card${combo ? ' combo-result' : ''}`;
  card.style.setProperty('--elc', color);

  const head = document.createElement('div');
  head.className = 'result-head result-character';
  head.append(previewImage(character.n));
  const characterName = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = character.n;
  characterName.append(title);
  head.append(characterName);
  card.append(head);

  const weaponRow = document.createElement('div');
  weaponRow.className = 'result-section weapon-result';
  weaponRow.append(previewItem(weapon));
  card.append(weaponRow);

  const artifactRow = document.createElement('div');
  artifactRow.className = 'result-section artifact-result';
  const artifactGroup = document.createElement('div');
  artifactGroup.className = `artifact-group${combo ? ' combo' : ''}`;
  artifacts.forEach(artifact => {
    artifactGroup.append(previewItem(artifact, `${artifact} (${combo ? '2pc' : '4pc'})`));
  });
  artifactRow.append(artifactGroup);
  card.append(artifactRow);
  return card;
}

function showPreview(index) {
  previewIndex = (index + previewCharacters.length) % previewCharacters.length;
  previewStage.replaceChildren(previewCards[previewIndex]);
  previewPosition.textContent = `${previewIndex + 1} / ${previewCharacters.length}`;
}

const previewPool = [...CHARS];
while (previewCharacters.length < 4 && previewPool.length) {
  const index = Math.floor(Math.random() * previewPool.length);
  const [character] = previewPool.splice(index, 1);
  previewCharacters.push(character);
  if (character.g === 'trav') {
    for (let i = previewPool.length - 1; i >= 0; i--) {
      if (previewPool[i].g === 'trav') previewPool.splice(i, 1);
    }
  }
}

const previewCards = previewCharacters.map(makePreviewCard);
document.getElementById('preview-prev').addEventListener('click', () => showPreview(previewIndex - 1));
document.getElementById('preview-next').addEventListener('click', () => showPreview(previewIndex + 1));
showPreview(0);
