/* ============================================================
   yu.nails — admin panel v2
   ============================================================ */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const isDemo = !window.YUNAILS_API;

  // ============== TELEGRAM INIT ==============
  const tg = window.Telegram?.WebApp;
  let myTgId = 0;
  let myName = 'админ';
  let myPhoto = null;

  if (tg) {
    try {
      tg.ready();
      tg.expand();
      const u = tg.initDataUnsafe?.user;
      if (u) {
        myTgId = u.id;
        myName = [u.first_name, u.last_name].filter(Boolean).join(' ') || 'админ';
        myPhoto = u.photo_url;
      }
    } catch (e) { console.warn('TG init:', e); }
  }

  if (isDemo) {
    myTgId = 123456789;
    myName = 'демо-админ';
  }

  // ============== DEMO STORAGE ==============
  const STORAGE_KEY = 'yunails_admin_demo';
  function loadDemoData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return initDemoData();
  }
  function initDemoData() {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 86400000);
    const dayAfter = new Date(today.getTime() + 2 * 86400000);
    const fmt = d => d.toISOString().slice(0, 10);

    return {
      bookings: [
        { id: 1, service: 'маникюр с покрытием', service_id: 'cover', design: '', date: fmt(today), time: '16:00', name: 'Аня Иванова', username: 'anya_nails', tg_id: 111111, comment: 'хочу миндаль, длина средняя', price: 1000, status: 'pending', created_at: today.toISOString() },
        { id: 2, service: 'комбинированный маникюр', service_id: 'combo', design: 'лёгкий', date: fmt(today), time: '17:00', name: 'Мария Петрова', username: 'mary_p', tg_id: 222222, comment: '', price: 500, status: 'confirmed', created_at: today.toISOString() },
        { id: 3, service: 'коррекция покрытия', service_id: 'fix', design: '', date: fmt(today), time: '19:00', name: 'Ольга', username: 'olya', tg_id: 333333, comment: '', price: 1200, status: 'confirmed', created_at: today.toISOString() },
        { id: 4, service: 'маникюр с покрытием', service_id: 'cover', design: 'сложный', date: fmt(tomorrow), time: '16:00', name: 'Екатерина', username: 'kate_nails', tg_id: 444444, comment: 'френч с дизайном', price: 1200, status: 'confirmed', created_at: today.toISOString() },
        { id: 5, service: 'маникюр с покрытием', service_id: 'cover', design: '', date: fmt(tomorrow), time: '18:00', name: 'Светлана', username: null, tg_id: 555555, comment: '', price: 1000, status: 'confirmed', created_at: today.toISOString() },
        { id: 6, service: 'комбинированный маникюр', service_id: 'combo', design: '', date: fmt(dayAfter), time: '17:00', name: 'Дарья', username: 'dasha', tg_id: 666666, comment: '', price: 500, status: 'pending', created_at: today.toISOString() },
        { id: 7, service: 'коррекция покрытия', service_id: 'fix', design: '', date: '2026-01-15', time: '16:00', name: 'Юлия', username: 'yulia', tg_id: 777777, comment: '', price: 1200, status: 'completed', created_at: '2026-01-15T10:00:00' },
      ],
      services: [
        { id: 'combo', name: 'комбинированный маникюр', price: 500, duration: 60, description: 'аппарат + классика. кутикула, форма, шлифовка.', is_addon: 0, sort_order: 1, active: 1 },
        { id: 'cover', name: 'маникюр с покрытием', price: 1000, duration: 90, description: 'гель-лак под кутикулу. носится 3-4 недели.', is_addon: 0, sort_order: 2, active: 1 },
        { id: 'fix', name: 'коррекция покрытия', price: 1200, duration: 90, description: 'спил, выравнивание, новое покрытие.', is_addon: 0, sort_order: 3, active: 1 },
        { id: 'design-simple', name: 'лёгкий дизайн', price: 0, duration: 15, description: 'фольга, втирка, слайдеры, акценты до 2 ногтей.', is_addon: 1, sort_order: 4, active: 1 },
        { id: 'design-hard', name: 'сложный дизайн', price: 200, duration: 30, description: 'роспись, объём, акварель, инкрустация.', is_addon: 1, sort_order: 5, active: 1 },
      ],
      schedule: [
        { id: 1, day_of_week: 0, start_time: '16:00', end_time: '21:00', active: 1 },
        { id: 2, day_of_week: 1, start_time: '16:00', end_time: '21:00', active: 1 },
        { id: 3, day_of_week: 2, start_time: '16:00', end_time: '21:00', active: 1 },
        { id: 4, day_of_week: 3, start_time: '16:00', end_time: '21:00', active: 1 },
        { id: 5, day_of_week: 4, start_time: '16:00', end_time: '21:00', active: 1 },
        { id: 6, day_of_week: 5, start_time: '16:00', end_time: '21:00', active: 1 },
        { id: 7, day_of_week: 6, start_time: '16:00', end_time: '21:00', active: 0 },
      ],
      blocked: [
        { id: 1, date: '2026-09-15', time: '16:00', reason: 'отпуск' },
        { id: 2, date: '2026-09-15', time: '17:00', reason: 'отпуск' },
      ],
      clients: [
        { tg_id: 111111, username: 'anya_nails', first_name: 'Аня', last_name: 'Иванова', phone: null, visits: 5, last_visit: '2026-01-10', created_at: '2025-09-01' },
        { tg_id: 222222, username: 'mary_p', first_name: 'Мария', last_name: 'Петрова', phone: null, visits: 12, last_visit: '2026-01-12', created_at: '2025-06-15' },
        { tg_id: 333333, username: 'olya', first_name: 'Ольга', last_name: '', phone: null, visits: 3, last_visit: '2026-01-08', created_at: '2025-12-01' },
        { tg_id: 444444, username: 'kate_nails', first_name: 'Екатерина', last_name: '', phone: null, visits: 8, last_visit: '2026-01-11', created_at: '2025-10-15' },
      ],
      settings: {
        default_start_time: '16:00',
        default_end_time: '21:00',
        slot_duration_min: '60',
        booking_lead_hours: '2',
      },
    };
  }
  function saveDemoData(data) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {} }
  const db = isDemo ? loadDemoData() : null;
  if (isDemo) saveDemoData(db);

  // ============== API LAYER ==============
  async function api(path, options = {}) {
    if (isDemo) return mockApi(path, options);
    const headers = { 'Content-Type': 'application/json', 'X-Tg-Id': String(myTgId), ...(options.headers || {}) };
    const res = await fetch(window.YUNAILS_API + path, { ...options, headers });
    if (!res.ok) {
      let msg = 'ошибка ' + res.status;
      try { const j = await res.json(); msg = j.detail || msg; } catch {}
      throw new Error(msg);
    }
    return res.json();
  }

  // ============== MOCK API ==============
  function delay(ms = 150) { return new Promise(r => setTimeout(r, ms)); }
  function parseBody(o) { return o?.body ? JSON.parse(o.body) : null; }

  async function mockApi(path, options = {}) {
    await delay();
    const { method = 'GET' } = options;
    const data = JSON.parse(JSON.stringify(db));

    if (path === '/api/admin/check') return { is_admin: true };

    if (path === '/api/admin/stats') {
      const today = new Date().toISOString().slice(0, 10);
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
      const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      const sum = arr => arr.reduce((s, b) => s + b.price, 0);
      const today_b = data.bookings.filter(b => b.date === today);
      const week_b = data.bookings.filter(b => b.date >= weekAgo);
      const month_b = data.bookings.filter(b => b.date >= monthAgo);
      const upcoming = data.bookings.filter(b => b.date >= today && b.status !== 'cancelled' && b.status !== 'completed');
      const popular = {};
      data.bookings.forEach(b => { if (b.status !== 'cancelled') popular[b.service] = (popular[b.service] || 0) + 1; });
      const pop = Object.entries(popular).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([service, count]) => ({ service, count }));
      return {
        total_bookings: data.bookings.length,
        today_count: today_b.length,
        upcoming: upcoming.length,
        pending: data.bookings.filter(b => b.status === 'pending').length,
        clients_total: data.clients.length,
        revenue_total: sum(data.bookings.filter(b => ['confirmed', 'completed'].includes(b.status))),
        revenue_today: sum(today_b.filter(b => b.status !== 'cancelled')),
        revenue_week: sum(week_b.filter(b => ['confirmed', 'completed'].includes(b.status))),
        revenue_month: sum(month_b.filter(b => ['confirmed', 'completed'].includes(b.status))),
        popular_services: pop,
        today_bookings: today_b,
        tomorrow_bookings: data.bookings.filter(b => b.date === tomorrow),
      };
    }

    if (path.startsWith('/api/admin/bookings') && method === 'GET') {
      const url = new URL('http://x' + path);
      const status = url.searchParams.get('status');
      let arr = data.bookings;
      if (status && status !== 'all') arr = arr.filter(b => b.status === status);
      return arr.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    }

    const statusMatch = path.match(/^\/api\/admin\/bookings\/(\d+)\/status$/);
    if (statusMatch && method === 'POST') {
      const id = +statusMatch[1];
      const { status } = parseBody(options);
      const b = data.bookings.find(x => x.id === id);
      if (b) b.status = status;
      saveDemoData(data);
      return { ok: true };
    }

    const delMatch = path.match(/^\/api\/admin\/bookings\/(\d+)$/);
    if (delMatch && method === 'DELETE') {
      const id = +delMatch[1];
      data.bookings = data.bookings.filter(x => x.id !== id);
      saveDemoData(data);
      return { ok: true };
    }

    if (path === '/api/admin/block-slot' && method === 'POST') {
      const b = parseBody(options);
      const newId = Math.max(0, ...data.blocked.map(x => x.id)) + 1;
      data.blocked.push({ id: newId, ...b });
      saveDemoData(data);
      return { ok: true };
    }
    const unblockMatch = path.match(/^\/api\/admin\/block-slot\/(\d+)$/);
    if (unblockMatch && method === 'DELETE') {
      const id = +unblockMatch[1];
      data.blocked = data.blocked.filter(x => x.id !== id);
      saveDemoData(data);
      return { ok: true };
    }
    if (path === '/api/admin/blocked-slots' && method === 'GET') {
      return data.blocked.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    }

    if (path === '/api/admin/services' && method === 'GET') return data.services.sort((a, b) => a.sort_order - b.sort_order);
    if (path === '/api/admin/services' && method === 'POST') {
      const s = parseBody(options);
      const newId = Math.max(0, ...data.services.map(x => parseInt(x.id.replace(/\D/g, '')) || 0)) + 1;
      const id = s.id || `svc_${newId}`;
      data.services.push({ ...s, id, created_at: new Date().toISOString() });
      saveDemoData(data);
      return { ok: true };
    }
    const svcMatch = path.match(/^\/api\/admin\/services\/(.+)$/);
    if (svcMatch && method === 'PUT') {
      const id = svcMatch[1];
      const idx = data.services.findIndex(s => s.id === id);
      if (idx >= 0) Object.assign(data.services[idx], parseBody(options));
      saveDemoData(data);
      return { ok: true };
    }
    if (svcMatch && method === 'DELETE') {
      const id = svcMatch[1];
      data.services = data.services.filter(s => s.id !== id);
      saveDemoData(data);
      return { ok: true };
    }

    if (path === '/api/admin/schedule' && method === 'GET') return data.schedule;
    if (path === '/api/admin/schedule' && method === 'PUT') {
      data.schedule = parseBody(options);
      saveDemoData(data);
      return { ok: true };
    }

    if (path === '/api/admin/settings' && method === 'GET') return data.settings;
    if (path === '/api/admin/settings' && method === 'PUT') {
      data.settings = { ...data.settings, ...parseBody(options) };
      saveDemoData(data);
      return { ok: true };
    }

    if (path === '/api/admin/clients') {
      return data.clients.map(c => ({
        ...c,
        visits: data.bookings.filter(b => b.tg_id === c.tg_id && ['confirmed', 'completed'].includes(b.status)).length,
        total_spent: data.bookings.filter(b => b.tg_id === c.tg_id && ['confirmed', 'completed'].includes(b.status)).reduce((s, b) => s + b.price, 0),
      })).sort((a, b) => b.created_at.localeCompare(a.created_at));
    }

    throw new Error('demo: route not found ' + path);
  }

  // ============== TOAST ==============
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg, ok = true) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.toggle('error', !ok);
    toastEl.classList.toggle('success', ok);
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2500);
  }

  // ============== MODAL ==============
  const modal = $('#modal');
  const modalTitle = $('#modalTitle');
  const modalBody = $('#modalBody');
  const modalFoot = $('#modalFoot');

  function openModal(title, bodyHtml, footHtml = '') {
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modalFoot.innerHTML = footHtml;
    modal.removeAttribute('hidden');
    // force reflow перед добавлением класса — чтобы анимация сработала
    void modal.offsetWidth;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { if (!modal.classList.contains('open')) modal.setAttribute('hidden', ''); }, 300);
  }
  $$('[data-modal-close]').forEach(el => el.addEventListener('click', closeModal));
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal(); });

  // ============== INIT ==============
  async function init() {
    if (isDemo) showDemoBanner();
    if (myPhoto) {
      $('#meAvatar').style.backgroundImage = `url(${myPhoto})`;
      $('#meAvatar').textContent = '';
    } else {
      $('#meAvatar').textContent = (myName[0] || 'A').toUpperCase();
    }
    $('#meName').textContent = myName;

    $$('.nav-item').forEach(n => n.addEventListener('click', () => {
      switchTab(n.dataset.tab);
      // закрываем сайдбар на мобиле после выбора
      $('.sidebar')?.classList.remove('open');
      $('#sidebarBackdrop')?.classList.remove('open');
    }));
    $('#mobileMenuBtn')?.addEventListener('click', () => {
      const opening = !$('.sidebar')?.classList.contains('open');
      $('.sidebar')?.classList.toggle('open', opening);
      $('#sidebarBackdrop')?.classList.toggle('open', opening);
      document.body.style.overflow = opening ? 'hidden' : '';
    });
    $('#sidebarBackdrop')?.addEventListener('click', closeMobileMenu);
    function closeMobileMenu() {
      $('.sidebar')?.classList.remove('open');
      $('#sidebarBackdrop')?.classList.remove('open');
      document.body.style.overflow = '';
    }
    $('#refreshBtn').addEventListener('click', () => loadCurrentTab());
    $('#closeBtn').addEventListener('click', () => tg ? tg.close() : window.close());

    // закрываем сайдбар по Escape (отдельно от модалки)
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && $('.sidebar')?.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    await switchTab('dashboard');
    updateNavBadges();
  }

  function showDemoBanner() {
    const banner = document.createElement('div');
    banner.className = 'demo-banner';
    banner.textContent = '✦ DEMO — нажми чтобы сбросить';
    banner.onclick = () => {
      if (confirm('сбросить демо-данные?')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      }
    };
    document.body.appendChild(banner);
  }

  async function updateNavBadges() {
    try {
      const s = await api('/api/admin/stats');
      const pending = document.querySelector('[data-tab="bookings"] .ni-badge');
      if (pending) {
        if (s.pending > 0) { pending.textContent = s.pending; pending.style.display = ''; }
        else pending.style.display = 'none';
      }
    } catch {}
  }

  let currentTab = 'dashboard';
  async function switchTab(tab) {
    currentTab = tab;
    $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.tab === tab));
    $$('.tab-pane').forEach(p => p.classList.toggle('active', p.dataset.pane === tab));
    const titles = {
      dashboard: ['дашборд', 'обзор студии'],
      bookings: ['записи', 'все записи клиентов'],
      schedule: ['расписание', 'рабочие часы'],
      services: ['услуги', 'управление прайсом'],
      blocked: ['блокировки', 'недоступные слоты'],
      clients: ['клиенты', 'база клиентов'],
      settings: ['настройки', 'параметры системы'],
    };
    const [t, s] = titles[tab] || [tab, ''];
    $('#pageTitle').textContent = t;
    $('#pageSub').innerHTML = `<span class="live-dot"></span>${s}`;
    await loadCurrentTab();
  }

  async function loadCurrentTab() {
    try {
      const map = {
        dashboard: loadDashboard, bookings: loadBookings, schedule: loadSchedule,
        services: loadServices, blocked: loadBlocked, clients: loadClients, settings: loadSettings,
      };
      await map[currentTab]();
    } catch (e) { console.error(e); toast(e.message, false); }
  }

  // ============== DASHBOARD ==============
  async function loadDashboard() {
    const s = await api('/api/admin/stats');
    const fmt = n => new Intl.NumberFormat('ru-RU').format(n);

    $('#statsGrid').innerHTML = `
      <div class="stat">
        <div class="stat-icon accent">💰</div>
        <div class="stat-label">выручка сегодня</div>
        <div class="stat-value accent">${fmt(s.revenue_today)}₽</div>
      </div>
      <div class="stat">
        <div class="stat-icon success">📅</div>
        <div class="stat-label">за неделю</div>
        <div class="stat-value">${fmt(s.revenue_week)}₽</div>
        <div class="stat-sub">за последние 7 дней</div>
      </div>
      <div class="stat">
        <div class="stat-icon info">📈</div>
        <div class="stat-label">за месяц</div>
        <div class="stat-value">${fmt(s.revenue_month)}₽</div>
        <div class="stat-sub">за последние 30 дней</div>
      </div>
      <div class="stat">
        <div class="stat-icon success">💎</div>
        <div class="stat-label">всего</div>
        <div class="stat-value green">${fmt(s.revenue_total)}₽</div>
        <div class="stat-sub">за всё время</div>
      </div>
      <div class="stat">
        <div class="stat-icon warning">⏰</div>
        <div class="stat-label">записей сегодня</div>
        <div class="stat-value">${s.today_count}</div>
        <div class="stat-sub"><b>${s.pending}</b> новых ожидают</div>
      </div>
      <div class="stat">
        <div class="stat-icon info">📆</div>
        <div class="stat-label">предстоящих</div>
        <div class="stat-value">${s.upcoming}</div>
        <div class="stat-sub">активных записей</div>
      </div>
      <div class="stat">
        <div class="stat-icon">📊</div>
        <div class="stat-label">всего записей</div>
        <div class="stat-value">${s.total_bookings}</div>
        <div class="stat-sub">за всё время</div>
      </div>
      <div class="stat">
        <div class="stat-icon info">👥</div>
        <div class="stat-label">клиентов</div>
        <div class="stat-value info">${s.clients_total}</div>
        <div class="stat-sub">уникальных</div>
      </div>
    `;

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 86400000);
    $('#todayDate').textContent = today.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
    $('#tomorrowDate').textContent = tomorrow.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

    $('#todayList').innerHTML = s.today_bookings.length
      ? renderBookingsList(s.today_bookings)
      : '<div class="empty"><div class="empty-icon">📭</div>сегодня записей нет</div>';
    $('#tomorrowList').innerHTML = s.tomorrow_bookings.length
      ? renderBookingsList(s.tomorrow_bookings)
      : '<div class="empty"><div class="empty-icon">📭</div>завтра записей нет</div>';

    const maxCount = Math.max(1, ...s.popular_services.map(p => p.count));
    $('#popularList').innerHTML = s.popular_services.length
      ? s.popular_services.map((p, i) => `
        <div class="popular-row">
          <span class="popular-rank">${i + 1}</span>
          <span class="popular-name">${escapeHtml(p.service)}</span>
          <div class="popular-bar-wrap"><div class="popular-bar" style="width: ${(p.count / maxCount) * 100}%"></div></div>
          <span class="popular-count">${p.count} шт</span>
        </div>`).join('')
      : '<div class="empty"><div class="empty-icon">📊</div>пока нет данных</div>';
  }

  function renderBookingsList(arr) {
    return arr.map(b => {
      const d = new Date(b.date);
      return `<div class="booking-row">
        <div class="booking-time">${b.time}<small>${d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</small></div>
        <div class="booking-info">
          <div class="booking-name">
            ${escapeHtml(b.name)}
            ${b.username ? `<span class="booking-username">@${b.username}</span>` : ''}
            <span class="booking-status ${b.status}">${statusText(b.status)}</span>
          </div>
          <div class="booking-service"><b>${escapeHtml(b.service)}</b>${b.design ? ' + ' + b.design + ' дизайн' : ''} · ${b.price}₽</div>
          ${b.comment ? `<div class="booking-comment">💬 ${escapeHtml(b.comment)}</div>` : ''}
        </div>
        <div class="booking-actions">
          ${b.status === 'pending' ? `<button class="btn-icon success" data-quick-confirm="${b.id}" title="подтвердить">✓</button>` : ''}
          ${b.status !== 'cancelled' ? `<button class="btn-icon danger" data-quick-cancel="${b.id}" title="отменить">✕</button>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  function statusText(s) {
    return { pending: '⏳ новая', confirmed: '✅ подтв.', completed: '✓ было', cancelled: '✕ отменена' }[s] || s;
  }

  // delegation для быстрых кнопок
  document.addEventListener('click', e => {
    const c = e.target.closest('[data-quick-confirm]');
    if (c) changeStatus(c.dataset.quickConfirm, 'confirmed');
    const x = e.target.closest('[data-quick-cancel]');
    if (x) changeStatus(x.dataset.quickCancel, 'cancelled');
  });

  // ============== BOOKINGS ==============
  let currentFilter = 'all';
  $$('.chip').forEach(c => c.addEventListener('click', () => {
    $$('.chip').forEach(x => x.classList.remove('active'));
    c.classList.add('active');
    currentFilter = c.dataset.filter;
    loadBookings();
  }));

  async function loadBookings() {
    const status = currentFilter === 'all' ? '' : `&status=${currentFilter}`;
    const arr = await api('/api/admin/bookings?limit=200' + status);
    if (!arr.length) {
      $('#bookingsList').innerHTML = '<div class="empty"><div class="empty-icon">📭</div>записей нет</div>';
      return;
    }
    $('#bookingsList').innerHTML = arr.map(b => {
      const d = new Date(b.date);
      return `<div class="booking-row">
        <div class="booking-time">${b.time}<small>${d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</small></div>
        <div class="booking-info">
          <div class="booking-name">
            ${escapeHtml(b.name)}
            ${b.username ? `<span class="booking-username">@${b.username}</span>` : ''}
            <span class="booking-status ${b.status}">${statusText(b.status)}</span>
          </div>
          <div class="booking-service"><b>${escapeHtml(b.service)}</b>${b.design ? ' + ' + b.design + ' дизайн' : ''} · <b>${b.price}₽</b></div>
          ${b.comment ? `<div class="booking-comment">💬 ${escapeHtml(b.comment)}</div>` : ''}
        </div>
        <div class="booking-price">${b.price}₽</div>
        <div class="booking-actions">
          ${b.status === 'pending' ? `<button class="btn-icon success" data-confirm="${b.id}" title="подтвердить">✓</button>` : ''}
          ${b.status !== 'cancelled' ? `<button class="btn-icon danger" data-cancel="${b.id}" title="отменить">✕</button>` : ''}
          <a class="btn-icon" href="tg://user?id=${b.tg_id}" title="написать">✉</a>
        </div>
      </div>`;
    }).join('');

    $$('[data-confirm]').forEach(b => b.addEventListener('click', () => changeStatus(b.dataset.confirm, 'confirmed')));
    $$('[data-cancel]').forEach(b => b.addEventListener('click', () => changeStatus(b.dataset.cancel, 'cancelled')));
  }

  async function changeStatus(id, status) {
    if (status === 'cancelled' && !confirm('отменить запись? клиенту уйдёт уведомление.')) return;
    try {
      await api(`/api/admin/bookings/${id}/status`, { method: 'POST', body: JSON.stringify({ status }) });
      toast('✓ статус обновлён');
      await loadBookings();
      if (currentTab === 'dashboard') await loadDashboard();
      updateNavBadges();
    } catch (e) { toast(e.message, false); }
  }

  // ============== SCHEDULE ==============
  const DAY_NAMES = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];
  async function loadSchedule() {
    const arr = await api('/api/admin/schedule');
    const data = DAY_NAMES.map((name, i) => {
      const s = arr.find(x => x.day_of_week === i) || { start_time: '16:00', end_time: '21:00', active: 0 };
      return { ...s, name, dow: i };
    });
    $('#scheduleList').innerHTML = data.map(s => `
      <div class="schedule-day ${s.active ? '' : 'off'}" data-day="${s.dow}">
        <span class="schedule-day-name"><span class="weekday-dot"></span>${s.name}</span>
        <input type="time" value="${s.start_time}" data-field="start" ${s.active ? '' : 'disabled'}>
        <input type="time" value="${s.end_time}" data-field="end" ${s.active ? '' : 'disabled'}>
        <div class="switch ${s.active ? 'on' : ''}" data-field="active" role="switch" aria-checked="${s.active}"></div>
      </div>
    `).join('');

    $$('.schedule-day').forEach(row => {
      const dow = +row.dataset.day;
      const activeSwitch = row.querySelector('[data-field="active"]');
      const startInp = row.querySelector('[data-field="start"]');
      const endInp = row.querySelector('[data-field="end"]');
      activeSwitch.addEventListener('click', () => {
        const on = !activeSwitch.classList.contains('on');
        activeSwitch.classList.toggle('on', on);
        activeSwitch.setAttribute('aria-checked', on);
        row.classList.toggle('off', !on);
        startInp.disabled = !on;
        endInp.disabled = !on;
      });
    });
  }
  $('#saveSchedule')?.addEventListener('click', async () => {
    const items = DAY_NAMES.map((_, i) => {
      const row = $(`.schedule-day[data-day="${i}"]`);
      return {
        day_of_week: i,
        start_time: row.querySelector('[data-field="start"]').value || '16:00',
        end_time: row.querySelector('[data-field="end"]').value || '21:00',
        active: row.querySelector('[data-field="active"]').classList.contains('on') ? 1 : 0,
      };
    });
    try {
      await api('/api/admin/schedule', { method: 'PUT', body: JSON.stringify(items) });
      toast('✓ расписание сохранено');
    } catch (e) { toast(e.message, false); }
  });

  // ============== SERVICES ==============
  let servicesCache = [];
  async function loadServices() {
    servicesCache = await api('/api/admin/services');
    $('#servicesList').innerHTML = servicesCache.map(s => `
      <div class="service-row" data-id="${s.id}">
        <span class="service-id ${s.is_addon ? 'addon' : ''}">${s.id}</span>
        <input type="text" data-f="name" value="${escapeAttr(s.name)}" placeholder="название услуги">
        <input type="number" data-f="price" value="${s.price}" min="0" placeholder="₽">
        <input type="number" data-f="duration" value="${s.duration}" min="5" step="5" placeholder="мин">
        <select data-f="is_addon">
          <option value="0" ${!s.is_addon ? 'selected' : ''}>база</option>
          <option value="1" ${s.is_addon ? 'selected' : ''}>дополнение</option>
        </select>
        <button class="btn-icon danger" data-del="${s.id}" title="удалить">×</button>
      </div>
    `).join('');
    $$('[data-f]').forEach(el => el.addEventListener('change', e => saveService(e.target.dataset.id || e.target.closest('.service-row').dataset.id)));
    $$('[data-del]').forEach(el => el.addEventListener('click', () => deleteService(el.dataset.del)));
  }
  async function saveService(id) {
    const s = servicesCache.find(x => x.id === id);
    if (!s) return;
    ['name', 'price', 'duration', 'is_addon'].forEach(f => {
      const el = $(`.service-row[data-id="${id}"] [data-f="${f}"]`);
      if (el) s[f] = el.type === 'number' ? +el.value : (f === 'is_addon' ? +el.value : el.value);
    });
    try {
      await api(`/api/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(s) });
      toast('✓ сохранено');
    } catch (e) { toast(e.message, false); }
  }
  async function deleteService(id) {
    if (!confirm('удалить услугу «' + (servicesCache.find(s => s.id === id)?.name || id) + '»?')) return;
    try {
      await api(`/api/admin/services/${id}`, { method: 'DELETE' });
      toast('✓ удалено');
      loadServices();
    } catch (e) { toast(e.message, false); }
  }
  $('#addService')?.addEventListener('click', () => {
    const newId = 'svc_' + Date.now().toString(36);
    openModal('новая услуга', `
      <label class="field"><span class="field-label">id (латиницей)</span>
        <input id="ns-id" value="${newId}" placeholder="design-luxe">
        <span class="field-hint">используется в коде, не меняйте потом без необходимости</span>
      </label>
      <label class="field"><span class="field-label">название</span>
        <input id="ns-name" placeholder="премиум дизайн">
      </label>
      <div class="form-grid">
        <label class="field"><span class="field-label">цена (₽)</span>
          <input id="ns-price" type="number" value="0" min="0">
        </label>
        <label class="field"><span class="field-label">длительность (мин)</span>
          <input id="ns-duration" type="number" value="60" min="5" step="5">
        </label>
      </div>
      <label class="field"><span class="field-label">тип</span>
        <select id="ns-type">
          <option value="0">базовая услуга (комби, покрытие...)</option>
          <option value="1">дополнение (дизайн и т.п.)</option>
        </select>
      </label>
      <label class="field"><span class="field-label">описание</span>
        <textarea id="ns-desc" rows="2" placeholder="краткое описание для клиентов"></textarea>
      </label>
    `, `<button class="btn btn-ghost" data-modal-close>отмена</button><button class="btn btn-primary" id="ns-save">создать</button>`);
    $('#ns-save')?.addEventListener('click', async () => {
      const data = {
        id: $('#ns-id').value.trim(),
        name: $('#ns-name').value.trim(),
        price: +$('#ns-price').value,
        duration: +$('#ns-duration').value,
        is_addon: +$('#ns-type').value,
        description: $('#ns-desc').value.trim(),
        sort_order: servicesCache.length + 1,
        active: 1,
      };
      if (!data.id || !data.name) { toast('заполни id и название', false); return; }
      try {
        await api('/api/admin/services', { method: 'POST', body: JSON.stringify(data) });
        toast('✓ создано');
        closeModal();
        loadServices();
      } catch (e) { toast(e.message, false); }
    });
  });

  // ============== BLOCKED ==============
  async function loadBlocked() {
    const arr = await api('/api/admin/blocked-slots');
    if (!arr.length) {
      $('#blockedList').innerHTML = '<div class="empty"><div class="empty-icon">🔓</div>нет заблокированных слотов</div>';
      return;
    }
    $('#blockedList').innerHTML = arr.map(b => {
      const d = new Date(b.date);
      return `<div class="blocked-row">
        <div class="blocked-day">${d.getDate()}</div>
        <div class="blocked-date">${d.toLocaleDateString('ru-RU', { month: 'long', weekday: 'short' })}</div>
        <div class="blocked-time">${b.time}</div>
        <div class="blocked-reason">${escapeHtml(b.reason || '—')}</div>
        <button class="btn-icon danger" data-unblock="${b.id}" title="разблокировать">×</button>
      </div>`;
    }).join('');
    $$('[data-unblock]').forEach(b => b.addEventListener('click', async () => {
      if (!confirm('разблокировать слот?')) return;
      try {
        await api(`/api/admin/block-slot/${b.dataset.unblock}`, { method: 'DELETE' });
        toast('✓ разблокировано');
        loadBlocked();
      } catch (e) { toast(e.message, false); }
    }));
  }
  $('#addBlock')?.addEventListener('click', () => {
    const today = new Date().toISOString().slice(0, 10);
    openModal('заблокировать слот', `
      <label class="field"><span class="field-label">дата</span>
        <input id="b-date" type="date" value="${today}">
      </label>
      <label class="field"><span class="field-label">время</span>
        <input id="b-time" type="time" value="16:00">
      </label>
      <label class="field"><span class="field-label">причина (необязательно)</span>
        <input id="b-reason" placeholder="отпуск / ремонт / выходной">
      </label>
    `, `<button class="btn btn-ghost" data-modal-close>отмена</button><button class="btn btn-primary" id="b-save">заблокировать</button>`);
    $('#b-save')?.addEventListener('click', async () => {
      const data = {
        date: $('#b-date').value,
        time: $('#b-time').value,
        reason: $('#b-reason').value,
      };
      if (!data.date || !data.time) { toast('выбери дату и время', false); return; }
      try {
        await api('/api/admin/block-slot', { method: 'POST', body: JSON.stringify(data) });
        toast('✓ заблокировано');
        closeModal();
        loadBlocked();
      } catch (e) { toast(e.message, false); }
    });
  });

  // ============== CLIENTS ==============
  async function loadClients() {
    const arr = await api('/api/admin/clients');
    if (!arr.length) { $('#clientsList').innerHTML = '<div class="empty"><div class="empty-icon">👥</div>клиентов нет</div>'; return; }
    $('#clientsList').innerHTML = arr.map(c => {
      const initial = (c.first_name || c.username || '?')[0].toUpperCase();
      return `<div class="client-row">
        <div class="client-avatar">${initial}</div>
        <div>
          <div class="client-name">${escapeHtml(c.first_name || 'без имени')} ${escapeHtml(c.last_name || '')}</div>
          <div class="client-handle">${c.username ? '@' + c.username : '—'}</div>
        </div>
        <div class="client-stat">
          <span class="client-stat-label">визитов</span>
          <span class="client-stat-value">${c.visits || 0}</span>
        </div>
        <div class="client-stat">
          <span class="client-stat-label">потрачено</span>
          <span class="client-stat-value green">${(c.total_spent || 0).toLocaleString('ru-RU')}₽</span>
        </div>
        <a class="btn-icon" href="tg://user?id=${c.tg_id}" title="написать">✉</a>
      </div>`;
    }).join('');
  }

  // ============== SETTINGS ==============
  async function loadSettings() {
    const s = await api('/api/admin/settings');
    $('#setStart').value = s.default_start_time || '16:00';
    $('#setEnd').value = s.default_end_time || '21:00';
    $('#setDuration').value = s.slot_duration_min || '60';
    $('#setLead').value = s.booking_lead_hours || '2';
  }
  $('#saveSettings')?.addEventListener('click', async () => {
    const data = {
      default_start_time: $('#setStart').value,
      default_end_time: $('#setEnd').value,
      slot_duration_min: $('#setDuration').value,
      booking_lead_hours: $('#setLead').value,
    };
    try {
      await api('/api/admin/settings', { method: 'PUT', body: JSON.stringify(data) });
      toast('✓ настройки сохранены');
    } catch (e) { toast(e.message, false); }
  });

  // ============== UTILS ==============
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  if (tg) {
    try { tg.BackButton.show(); tg.BackButton.onClick(() => tg.close()); } catch {}
  }

  init();
})();
