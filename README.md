# ELAN Factory Dashboard

Аналитический сайт-дашборд для **ELAN KİMYA A.Ş.** (Турция) — CMO/private label производство косметики.

**Цель:** собрать финансовую картину группы (TR/PL/UAE/UA), отслеживать путь к целевой оценке **$250M за 5-7 лет**, поддерживать DD-готовность перед exit.

## Архитектура данных (Level 0)

```
_raw/                       # локально, в git НЕ коммитится (xlsx от бухгалтера)
  ├── RAPORLAR YYYY MONTH.xlsx
  ├── УЧЕТ НАЛИЧНЫХ АГ.xlsx
  ├── Зарплата Month.xlsx
  └── Расходы на стройку.xlsx

data/                       # В git — аудит-след
  ├── constants.json        # Ручные данные: meta, scenarios, loreal, valuation, payroll, capex
  └── snapshots/
      ├── 2026-02.json      # ← parse_raporlar.py "_raw/RAPORLAR 2026 ŞUBAT.xlsx" 2026-02
      ├── 2026-03.json
      └── ag_kassa.json     # ← parse_kassa_ag.py "_raw/УЧЕТ НАЛИЧНЫХ.xlsx"

scripts/                    # В git
  ├── parse_raporlar.py     # ИТОГ sheet → JSON snapshot
  ├── parse_kassa_ag.py     # 5 monthly sheets → JSON
  └── build_data.py         # snapshots/* + constants.json → docs/data.js

docs/                       # В git — сайт
  ├── index.html / pnl.html / clients.html / products.html / capex.html
  ├── cashflow.html / path.html / ceo.html / brain.html / risk.html
  ├── data.js               # ← build_data.py (AUTO, не править руками)
  └── style.css · style-themes.css · theme.js · chart-theme.js
```

## Как обновить данные когда бухгалтер прислал новый xlsx

1. Клади файл в `_raw/` (замени существующий или добавь новый месяц)
2. Прогнать парсеры:
   ```bash
   python scripts/parse_raporlar.py "_raw/RAPORLAR 2026 АПРЕЛЬ.xlsx" 2026-04
   python scripts/parse_kassa_ag.py  "_raw/УЧЕТ НАЛИЧНЫХ 2026 АГ.xlsx"
   ```
3. Пересобрать сайт:
   ```bash
   python scripts/build_data.py
   ```
4. Закоммитить `data/snapshots/*.json` + `docs/data.js` → push → Pages деплоит.

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
