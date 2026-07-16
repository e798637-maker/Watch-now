import './styles/rasd.css';

// ── Types ─────────────────────────────────────────────────────
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  category: 'military' | 'political' | 'conflict' | 'diplomacy' | 'security';
  severity: 'critical' | 'high' | 'medium' | 'low';
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  timestamp: number;
}

// ── Category Config ────────────────────────────────────────────
const CATEGORIES: Record<string, { label: string; badge: string; color: string }> = {
  military:  { label: 'عسكري',  badge: 'badge-military',  color: '#ff4444' },
  political: { label: 'سياسي',  badge: 'badge-political', color: '#ff8800' },
  conflict:  { label: 'نزاعات', badge: 'badge-conflict',  color: '#ff2222' },
  diplomacy: { label: 'دبلوماسي', badge: 'badge-diplomacy', color: '#3388ff' },
  security:  { label: 'أمني',   badge: 'badge-security',  color: '#ffcc00' },
};

// ── RSS Sources (Military & Political only) ────────────────────
const RSS_SOURCES = [
  { url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://feeds.bbci.co.uk/arabic/world/rss.xml'), name: 'BBC عربي', lang: 'ar' },
  { url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.aljazeera.net/ajml/4/1/rss'), name: 'الجزيرة', lang: 'ar' },
  { url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.alarabiya.net/ar/rss.xml'), name: 'العربية', lang: 'ar' },
  { url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://feeds.skynewsarabia.com/web/rss/905.xml'), name: 'سكاي نيوز', lang: 'ar' },
  { url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://rss.nytimes.com/services/xml/rss/nyt/World.xml'), name: 'NYT', lang: 'en' },
  { url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://feeds.reuters.com/Reuters/worldNews'), name: 'Reuters', lang: 'en' },
];

// ── Military/Political Keywords ─────────────────────────────────
const MILITARY_KW = ['عسكري','جيش','قوات','مسيّرة','صاروخ','غارة','هجوم','قصف','معركة','انفجار','قوة','حرب','سلاح','دبابة','طيران','بحرية','احتلال','استهداف','mission','military','army','forces','drone','missile','airstrike','bomb','attack','explosion','troops','navy','war','tank','artillery','operation'];
const POLITICAL_KW = ['رئيس','وزير','حكومة','انتخاب','مجلس','سياسة','حزب','مفاوضات','دبلوماسية','اتفاق','عقوبات','أزمة','diplomat','president','minister','government','election','senate','parliament','sanctions','crisis','treaty','politics','accord','summit'];
const CONFLICT_KW = ['نزاع','ميليشيا','مسلح','اقتحام','إطلاق نار','اعتقال','مواجهة','خسائر','ضحايا','casualty','casualties','clashes','armed','militia','gunfire','wounded','killed','conflict'];
const SECURITY_KW = ['إرهاب','تفجير','اختطاف','مخابرات','استخبارات','اعتراض','حادثة','terrorism','bombing','kidnap','intelligence','incident','threat','security'];
const DIPLOMACY_KW = ['اجتماع','مباحثات','محادثات','تصريح','بيان','تعاون','تحالف','meeting','talks','statement','cooperation','alliance','bilateral'];

function classifyItem(text: string): { category: NewsItem['category']; severity: NewsItem['severity'] } {
  const t = text.toLowerCase();
  let category: NewsItem['category'] = 'political';
  let severity: NewsItem['severity'] = 'low';

  if (CONFLICT_KW.some(k => t.includes(k))) { category = 'conflict'; severity = 'critical'; }
  else if (MILITARY_KW.some(k => t.includes(k))) { category = 'military'; severity = 'high'; }
  else if (SECURITY_KW.some(k => t.includes(k))) { category = 'security'; severity = 'medium'; }
  else if (DIPLOMACY_KW.some(k => t.includes(k))) { category = 'diplomacy'; severity = 'low'; }
  else if (POLITICAL_KW.some(k => t.includes(k))) { category = 'political'; severity = 'medium'; }

  return { category, severity };
}

// ── Country Detection ───────────────────────────────────────────
const COUNTRY_MAP: Record<string, { name: string; lat: number; lng: number; code: string }> = {
  'غزة':        { name: 'فلسطين', lat: 31.5, lng: 34.4, code: 'PS' },
  'فلسطين':     { name: 'فلسطين', lat: 31.9, lng: 35.2, code: 'PS' },
  'إسرائيل':    { name: 'إسرائيل', lat: 31.0, lng: 35.0, code: 'IL' },
  'لبنان':      { name: 'لبنان', lat: 33.8, lng: 35.5, code: 'LB' },
  'سوريا':      { name: 'سوريا', lat: 34.8, lng: 38.9, code: 'SY' },
  'العراق':     { name: 'العراق', lat: 33.3, lng: 44.4, code: 'IQ' },
  'إيران':      { name: 'إيران', lat: 32.4, lng: 53.6, code: 'IR' },
  'اليمن':      { name: 'اليمن', lat: 15.5, lng: 48.5, code: 'YE' },
  'السودان':    { name: 'السودان', lat: 12.8, lng: 30.2, code: 'SD' },
  'ليبيا':      { name: 'ليبيا', lat: 26.3, lng: 17.2, code: 'LY' },
  'روسيا':      { name: 'روسيا', lat: 55.7, lng: 37.6, code: 'RU' },
  'أوكرانيا':   { name: 'أوكرانيا', lat: 48.3, lng: 31.2, code: 'UA' },
  'ukraine':    { name: 'أوكرانيا', lat: 48.3, lng: 31.2, code: 'UA' },
  'russia':     { name: 'روسيا', lat: 55.7, lng: 37.6, code: 'RU' },
  'israel':     { name: 'إسرائيل', lat: 31.0, lng: 35.0, code: 'IL' },
  'gaza':       { name: 'فلسطين', lat: 31.5, lng: 34.4, code: 'PS' },
  'iran':       { name: 'إيران', lat: 32.4, lng: 53.6, code: 'IR' },
  'syria':      { name: 'سوريا', lat: 34.8, lng: 38.9, code: 'SY' },
  'iraq':       { name: 'العراق', lat: 33.3, lng: 44.4, code: 'IQ' },
  'yemen':      { name: 'اليمن', lat: 15.5, lng: 48.5, code: 'YE' },
  'sudan':      { name: 'السودان', lat: 12.8, lng: 30.2, code: 'SD' },
  'libya':      { name: 'ليبيا', lat: 26.3, lng: 17.2, code: 'LY' },
  'lebanon':    { name: 'لبنان', lat: 33.8, lng: 35.5, code: 'LB' },
  'china':      { name: 'الصين', lat: 35.8, lng: 104.1, code: 'CN' },
  'taiwan':     { name: 'تايوان', lat: 23.6, lng: 120.9, code: 'TW' },
  'korea':      { name: 'كوريا', lat: 37.5, lng: 127.0, code: 'KR' },
  'afghanistan':{ name: 'أفغانستان', lat: 33.9, lng: 67.7, code: 'AF' },
  'pakistan':   { name: 'باكستان', lat: 30.3, lng: 69.3, code: 'PK' },
};

function detectCountry(text: string): { country: string; lat: number; lng: number; code: string } {
  const t = text.toLowerCase();
  for (const [key, val] of Object.entries(COUNTRY_MAP)) {
    if (t.includes(key.toLowerCase())) return { country: val.name, lat: val.lat, lng: val.lng, code: val.code };
  }
  return { country: 'عالمي', lat: 20 + Math.random() * 40 - 20, lng: 20 + Math.random() * 60, code: 'WW' };
}

function timeAgo(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 1000);
  if (d < 60) return `${d}ث`;
  if (d < 3600) return `${Math.floor(d/60)}د`;
  if (d < 86400) return `${Math.floor(d/3600)}س`;
  return `${Math.floor(d/86400)}ي`;
}

// ── App State ──────────────────────────────────────────────────
let allItems: NewsItem[] = [];
let activeFilter = 'all';
let map: L.Map;

// ── Parse RSS ─────────────────────────────────────────────────
async function fetchRSS(source: typeof RSS_SOURCES[0]): Promise<NewsItem[]> {
  try {
    const res = await fetch(source.url);
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');
    const items = Array.from(doc.querySelectorAll('item')).slice(0, 15);

    return items.map(item => {
      const title = item.querySelector('title')?.textContent?.trim() || '';
      const desc = item.querySelector('description')?.textContent?.trim() || '';
      const link = item.querySelector('link')?.textContent?.trim() || '#';
      const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
      const combined = title + ' ' + desc;
      const { category, severity } = classifyItem(combined);
      const { country, lat, lng, code } = detectCountry(combined);
      
      return {
        id: btoa(encodeURIComponent(title)).slice(0, 16),
        title,
        summary: desc.replace(/<[^>]*>/g, '').slice(0, 200),
        source: source.name,
        url: link,
        category,
        severity,
        country,
        countryCode: code,
        lat: lat + (Math.random() - 0.5) * 2,
        lng: lng + (Math.random() - 0.5) * 2,
        timestamp: pubDate ? new Date(pubDate).getTime() : Date.now(),
      };
    }).filter(i => i.title.length > 5);
  } catch {
    return [];
  }
}

// ── Render Wire ────────────────────────────────────────────────
function renderFeed() {
  const feed = document.getElementById('wire-feed')!;
  const filtered = activeFilter === 'all' ? allItems : allItems.filter(i => i.category === activeFilter);
  
  if (filtered.length === 0) {
    feed.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div>جاري تحميل الأخبار...</div>';
    return;
  }

  feed.innerHTML = filtered.map(item => {
    const cat = CATEGORIES[item.category];
    return `
      <div class="news-card severity-${item.severity} ${item === filtered[0] ? 'new-item' : ''}" 
           data-id="${item.id}" data-lat="${item.lat}" data-lng="${item.lng}">
        <div class="news-card-header">
          <span class="news-badge ${cat.badge}">${cat.label}</span>
          <span class="news-source">${item.source}</span>
          <span class="news-time">${timeAgo(item.timestamp)}</span>
        </div>
        <div class="news-title">${item.title}</div>
        ${item.summary ? `<div class="news-summary">${item.summary}</div>` : ''}
        <div class="news-card-footer">
          <span class="news-country">📍 ${item.country}</span>
          <a class="news-link" href="${item.url}" target="_blank">قراءة المزيد ↗</a>
        </div>
      </div>
    `;
  }).join('');

  // Click to fly to location
  feed.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).tagName === 'A') return;
      const lat = parseFloat(card.getAttribute('data-lat')!);
      const lng = parseFloat(card.getAttribute('data-lng')!);
      map?.flyTo([lat, lng], 5, { duration: 1 });
    });
  });
}

// ── Update Stats ───────────────────────────────────────────────
function updateStats() {
  const total = document.getElementById('stat-total')!;
  const critical = document.getElementById('stat-critical')!;
  const military = document.getElementById('stat-military')!;
  const conflict = document.getElementById('stat-conflict')!;
  const wire = document.getElementById('wire-count')!;

  total.textContent = String(allItems.length);
  critical.textContent = String(allItems.filter(i => i.severity === 'critical' || i.severity === 'high').length);
  military.textContent = String(allItems.filter(i => i.category === 'military').length);
  conflict.textContent = String(allItems.filter(i => i.category === 'conflict').length);
  wire.textContent = `${allItems.length} حدث`;
}

// ── Map Markers ────────────────────────────────────────────────
let markerLayer: L.LayerGroup;

function updateMarkers() {
  markerLayer?.clearLayers();
  allItems.forEach(item => {
    const cat = CATEGORIES[item.category];
    const icon = L.divIcon({
      html: `<div class="map-marker ${item.category}"></div>`,
      className: '',
      iconSize: [12, 12],
    });
    const marker = L.marker([item.lat, item.lng], { icon }).addTo(markerLayer);
    marker.bindPopup(`
      <div class="popup-content">
        <span class="popup-badge ${CATEGORIES[item.category].badge}">${CATEGORIES[item.category].label}</span>
        <div class="popup-title">${item.title}</div>
        <div class="popup-time">${item.source} · ${timeAgo(item.timestamp)}</div>
      </div>
    `, { maxWidth: 280 });
  });
}

// ── Init Map ───────────────────────────────────────────────────
function initMap() {
  map = L.map('map', {
    center: [25, 40],
    zoom: 3,
    zoomControl: false,
    attributionControl: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    subdomains: 'abcd',
  }).addTo(map);

  L.control.zoom({ position: 'bottomleft' }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);
}

// ── Load All Sources ───────────────────────────────────────────
async function loadAll() {
  const feed = document.getElementById('wire-feed')!;
  feed.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div>جاري تحميل الأخبار...</div>';

  const results = await Promise.allSettled(RSS_SOURCES.map(s => fetchRSS(s)));
  const newItems: NewsItem[] = [];
  results.forEach(r => { if (r.status === 'fulfilled') newItems.push(...r.value); });

  // دمج وإزالة المكررات وترتيب حسب الوقت
  const existing = new Set(allItems.map(i => i.id));
  const fresh = newItems.filter(i => !existing.has(i.id));
  allItems = [...fresh, ...allItems].sort((a, b) => b.timestamp - a.timestamp).slice(0, 200);

  renderFeed();
  updateStats();
  updateMarkers();

  // Breaking news banner
  const critical = allItems.find(i => i.severity === 'critical');
  if (critical) {
    const banner = document.getElementById('breaking-banner')!;
    banner.classList.add('visible');
    banner.querySelector('.breaking-text')!.textContent = critical.title;
  }
}

// ── Build HTML ─────────────────────────────────────────────────
function buildUI() {
  document.getElementById('app')!.innerHTML = `
    <div id="header">
      <div class="header-logo">
        <span class="live-dot"></span>
        رَصَد
      </div>
      <nav class="header-nav">
        <button class="nav-btn active" data-filter="all">🌐 الكل</button>
        <button class="nav-btn" data-filter="conflict">⚔️ نزاعات</button>
        <button class="nav-btn" data-filter="military">🪖 عسكري</button>
        <button class="nav-btn" data-filter="political">🏛️ سياسي</button>
        <button class="nav-btn" data-filter="diplomacy">🤝 دبلوماسي</button>
        <button class="nav-btn" data-filter="security">🛡️ أمني</button>
      </nav>
      <div class="header-status">
        <span id="last-update">جاري التحديث...</span>
      </div>
    </div>

    <div id="breaking-banner">
      <span class="breaking-label">🔴 عاجل</span>
      <span class="breaking-text"></span>
    </div>

    <div id="layout">
      <div id="sidebar">
        <div class="wire-header">
          <span class="wire-title">📡 سلك الأخبار</span>
          <span class="wire-count" id="wire-count">0 حدث</span>
        </div>
        <div class="wire-filters">
          <button class="filter-btn active red" data-filter="conflict">نزاعات</button>
          <button class="filter-btn active orange" data-filter="military">عسكري</button>
          <button class="filter-btn" data-filter="political">سياسي</button>
          <button class="filter-btn" data-filter="security">أمني</button>
          <button class="filter-btn" data-filter="diplomacy">دبلوماسي</button>
        </div>
        <div id="wire-feed"></div>
        <div id="stats-bar">
          <div class="stat-item">
            <span class="stat-num" id="stat-total">0</span>
            <span class="stat-label">حدث</span>
          </div>
          <div class="stat-item">
            <span class="stat-num red" id="stat-critical">0</span>
            <span class="stat-label">خطر</span>
          </div>
          <div class="stat-item">
            <span class="stat-num orange" id="stat-military">0</span>
            <span class="stat-label">عسكري</span>
          </div>
          <div class="stat-item">
            <span class="stat-num red" id="stat-conflict">0</span>
            <span class="stat-label">نزاع</span>
          </div>
        </div>
      </div>
      <div id="map-container">
        <div id="map"></div>
        <div class="map-overlay-badge">
          <span class="event-count" id="event-count">0</span>
          حدث على الخريطة
        </div>
      </div>
    </div>
  `;
}

// ── Wire Filters ───────────────────────────────────────────────
function bindFilters() {
  // Header nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      renderFeed();
    });
  });

  // Wire filters (toggle)
  const activeFilters = new Set(['conflict', 'military']);
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.getAttribute('data-filter')!;
      if (activeFilters.has(f)) { activeFilters.delete(f); btn.classList.remove('active'); }
      else { activeFilters.add(f); btn.classList.add('active'); }
    });
  });
}

// ── Start ──────────────────────────────────────────────────────
async function start() {
  buildUI();
  bindFilters();
  initMap();
  await loadAll();

  // Update time display
  document.getElementById('last-update')!.textContent = `آخر تحديث: ${new Date().toLocaleTimeString('ar')}`;

  // Update map event count
  document.getElementById('event-count')!.textContent = String(allItems.length);

  // Auto-refresh every 3 minutes
  setInterval(async () => {
    await loadAll();
    document.getElementById('last-update')!.textContent = `آخر تحديث: ${new Date().toLocaleTimeString('ar')}`;
    document.getElementById('event-count')!.textContent = String(allItems.length);
  }, 3 * 60 * 1000);
}

start();
