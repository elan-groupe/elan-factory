# ELAN Factory Dashboard

Аналитический сайт-дашборд для **ELAN KİMYA A.Ş.** (Турция) — CMO/private label производство косметики.

**Цель:** собрать финансовую картину группы (TR/PL/UAE/UA), отслеживать путь к целевой оценке **$250M за 5-7 лет**, поддерживать DD-готовность перед exit.

## Структура

```
docs/
├── index.html      # Cockpit — главные KPI, runway, путь к $250M
├── pnl.html        # P&L помесячно (EUR), gross/operating margin
├── clients.html    # Выручка по клиентам, related vs external, HHI
├── products.html   # Юнит-экономика брендов, inventory
├── capex.html      # CAPEX tracker (оборудование + стройка)
├── cashflow.html   # Cash движения ELAN KIMYA + касса АГ
├── path.html       # Value Bridge к $250M, сценарии exit
├── brain.html      # 🧠 AI knowledge base — читать первым
├── data.js         # Унифицированные данные (JSON)
└── style.css       # Индустриальная dark-тема
```

## Текущие данные

- **Июнь 2025** — benchmark стационарного прибыльного режима (из скриншота, op margin +33%)
- **Февраль 2026** — провал из-за переезда на новую фабрику
- **Март 2026** — восстановление после переезда

## Следующие шаги

1. Перевести `data.js` на Google Sheets через gviz API (как V7)
2. Импортировать RAPORLAR за июль 2025 — апрель 2026 (ежемесячно)
3. Добавить страницу `payroll.html` (персонал с productivity per person)
4. Добавить `production.html` (загрузка реакторов, выработка SKU/день)
5. Подключить живые данные бренда ELAN после запуска в мае 2026

## Запуск локально

Просто откройте `docs/index.html` в браузере. Без сборки, без зависимостей — только Chart.js с CDN.

## Online

https://volodimirrykov-lang.github.io/elan-factory/

## GitHub

Новый репо: `elan-factory` (отдельно от V7 Padel).

---

**Владелец:** ELAN KIMYA group · **Доля пользователя:** 7% · **Основано:** апрель 2026
