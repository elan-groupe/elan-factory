// ELAN KIMYA / ELAN FACTORY — unified data
// Source: RAPORLAR xlsx (Jun'25, Feb'26, Mar'26), UCHET NALICHNYH, Stroika tracker
// Currency: EUR primary, USD for comparison to $250M target
// Updated: 2026-04-23

window.ELAN_DATA = {
  meta: {
    entity: "ELAN KİMYA ANONİM ŞİRKETİ",
    country: "Türkiye",
    headcount: 40,
    ownerShare: 0.07, // user's equity share
    currentValuation: 7_000_000, // USD, user-provided
    targetValuation: 250_000_000, // USD, 5-7 year exit target
    targetYears: [5, 7],
    brandLaunch: "2026-05", // own brand launch (шампунь, гель для душа)
    lastUpdate: "2026-04-23",
    fxEurUsd: 1.08, // approximate
  },

  // Monthly P&L snapshots (EUR)
  // Where revenue = SATIŞLAR, opex = ÖDEMELER total excluding CAPEX
  months: [
    {
      month: "2025-06",
      label: "Июнь 2025",
      status: "baseline",
      note: "Стационарный режим, прибыльный",
      revenue: 107_307.75,
      cashIn: 129_853.82,
      cashOut: 71_343.30,
      cogs: {
        raw_materials: 15_946.43,
        packaging: 16_032.43, // tara+kutu+etiket aggregated from AMBALAJ categories
        shipping: 2_558.16,
        customs: 3_040.17,
        total: 37_577.19,
      },
      opex: {
        factory: 4_100.43,
        personnel: 25_307.12,
        services: 5_974.96 - 3_040.17, // exclude customs
        other: 1_423.77,
        total: 33_765.92,
      },
      capex: 0, // june was before heavy investment phase
      opProfit: 107_307.75 - 37_577.19 - 33_765.92,
      opMargin: (107_307.75 - 37_577.19 - 33_765.92) / 107_307.75,
      founderInjection: 500.33,
      export: 100_319.42,
      exportShare: 100_319.42 / 107_307.75,
      clients: [
        { name: "LUNESI UK", country: "UK", amount: 60_057.03 },
        { name: "ФОП Кравченко", country: "UA (related)", amount: 16_922.40 },
        { name: "USUPSO (Украина)", country: "UA", amount: 13_808.39 },
        { name: "Польша (ELAN BEAUTY)", country: "PL (related)", amount: 9_531.60 },
        { name: "Элан Козметик", country: "TR", amount: 2_058.35 },
        { name: "COLORIST ACADEMY", country: "TR", amount: 4_929.98 },
      ],
    },
    {
      month: "2026-02",
      label: "Февраль 2026",
      status: "moving",
      note: "Переезд на новую фабрику — продажи почти 0, максимум CAPEX",
      revenue: 3_673.55,
      cashIn: 116_112.68,
      cashOut: 192_211.77,
      cogs: {
        raw_materials: 10_767.22,
        packaging: 15_741.04,
        shipping: 6_968.07,
        customs: 18_523.26,
        total: 51_999.59,
      },
      opex: {
        factory: 4_601.07,
        personnel: 38_566.65,
        services: 22_338.73 - 18_523.26,
        other: 2_302.51,
        total: 49_285.70,
      },
      capex: 87_810.51, // equipment + relocation
      opProfit: 3_673.55 - 51_999.59 - 49_285.70,
      opMargin: (3_673.55 - 51_999.59 - 49_285.70) / Math.max(3_673.55, 1),
      founderInjection: 52_931.77,
      export: 2_247.60,
      exportShare: 2_247.60 / 3_673.55,
      clients: [
        { name: "Австралия (BROWED)", country: "AU", amount: 2_247.60 },
        { name: "ELAN KOZMETIK", country: "TR", amount: 881.38 },
        { name: "Розница Турция", country: "TR", amount: 544.57 },
      ],
    },
    {
      month: "2026-03",
      label: "Март 2026",
      status: "recovery",
      note: "Восстановление после переезда, частично CAPEX ещё идёт",
      revenue: 110_592.56,
      cashIn: 165_291.19,
      cashOut: 174_832.93,
      cogs: {
        raw_materials: 21_109.98,
        packaging: 14_047.00 + 2_445.77, // tara + kutu + etiket + china tara
        shipping: 4_595.11,
        customs: 53_738.15,
        total: 95_936.01, // includes large customs on imported raw materials backlog
      },
      opex: {
        factory: 4_846.20,
        personnel: 41_833.51,
        services: 59_492.65 - 53_738.15,
        other: 1_599.17 + 3_045.20, // +Ukr office
        total: 57_078.58,
      },
      capex: 19_512.22,
      opProfit: 110_592.56 - 95_936.01 - 57_078.58,
      opMargin: (110_592.56 - 95_936.01 - 57_078.58) / 110_592.56,
      founderInjection: 91_019.60,
      export: 44_289.00 + 35_629.35, // export + privates
      exportShare: (44_289.00 + 35_629.35) / 110_592.56,
      clients: [
        { name: "ФОП Кравченко (UA)", country: "UA (related)", amount: 45_251.74 },
        { name: "ELAN BEAUTY Польша", country: "PL (related)", amount: 18_382.27 },
        { name: "LUNESI LTD (UK)", country: "UK", amount: 14_415.63 },
        { name: "Розница + Trendyol", country: "TR", amount: 5_533.00 },
        { name: "ELAN COSMETICS Дубаи", country: "UAE (related)", amount: 2_729.50 },
        { name: "USUPSO + C-LAB + BILOBROV", country: "UA/various", amount: 24_281.00 },
      ],
    },
  ],

  // Cash flow through AG Kravchenko personal kassa (USD)
  // User's note: this is income from "other direction", not equity injection
  agKassa: [
    { month: "2025-12", label: "Дек 2025", in: 423_507, out: 247_261, ending: 176_246, note: "Транш 263k EUR от TG/Гузенко" },
    { month: "2026-01", label: "Янв 2026", in: 236_521, out: 247_395, ending: -10_874 },
    { month: "2026-02", label: "Фев 2026", in: 77_751, out: 115_390, ending: -37_639, note: "Переезд" },
    { month: "2026-03", label: "Мар 2026", in: 102_245, out: 92_246, ending: 9_998 },
    { month: "2026-04", label: "Апр 2026", in: 47_498, out: 47_995, ending: 497, note: "Текущий (неполный)" },
  ],

  // Bank/cash positions as of end of March 2026 (EUR/USD equivalent)
  cashPositions: [
    { account: "EMLAK BANK TL", currency: "TL", balance: 16_673.82, eurEquiv: 326 },
    { account: "VAKIF BANK TL", currency: "TL", balance: 13_537.35, eurEquiv: 265 },
    { account: "KASA TL", currency: "TL", balance: 75_246.75, eurEquiv: 1_473 },
    { account: "EMLAK BANK EUR", currency: "EUR", balance: 21_527.34, eurEquiv: 21_527 },
    { account: "VAKIF BANK EUR", currency: "EUR", balance: 16_970.00, eurEquiv: 16_970 },
    { account: "KASA EUR", currency: "EUR", balance: 0, eurEquiv: 0 },
    { account: "EMLAK BANK USD", currency: "USD", balance: 818, eurEquiv: 758 },
    { account: "VAKIF BANK USD", currency: "USD", balance: 5_150, eurEquiv: 4_769 },
    { account: "KASA USD", currency: "USD", balance: 2_000, eurEquiv: 1_852 },
  ],

  // Product/SKU shipments March 2026 with margins (EUR)
  productShipments: [
    { brand: "USUPSO", sku_count: 7, units: 6645, cost: 8_769.60, price: 23_839.82, markup: 1.72 },
    { brand: "C-LAB", sku_count: 15, units: 12_849, cost: 8_448.35, price: 12_851.52, markup: 0.52 },
    { brand: "BILOBROV", sku_count: 3, units: 1269, cost: 6_282.80, price: 9_113.28, markup: 0.45 },
    { brand: "LUNESI UK", sku_count: 9, units: 3644, cost: 8_503.60, price: 9_848.88, markup: 0.16 },
    { brand: "LUNESI COSMOPROF", sku_count: 14, units: 2215, cost: 2_625.00, price: 3_512.60, markup: 0.34 },
    { brand: "LUNESI UK RAYE", sku_count: 14, units: 380, cost: 1_000.00, price: 1_054.15, markup: 0.05 },
  ],

  // Inventory snapshot March 2026 (EUR)
  inventory: {
    finishedGoods: { units: 44_544, value: 85_779.62 },
    rawMaterials: { units: 11_603, value: 202_641.08 },
    packaging_jars: { units: 523_053, value: 232_213.90 },
    packaging_boxes: { units: 491_852, value: 106_696.96 },
    labels: { units: 541_004, value: 50_555.69 },
    instructions: { units: 378_184, value: 16_843.00 },
    total: 694_730.25,
  },

  // CAPEX cumulative Sep 2025 - Mar 2026 (USD)
  capex: {
    budget: 550_000,
    spent: 485_553,
    remaining_budget: 64_447,
    pending_to_chinese: 141_760, // from остаток к оплате по проформам
    breakdown: [
      { month: "2025-09", ремонт: 23_436, оборудование: 14_054 },
      { month: "2025-10", ремонт: 57_565, оборудование: 57_652 },
      { month: "2025-11", ремонт: 38_970, оборудование: 67_892 },
      { month: "2025-12", ремонт: 29_074, оборудование: 99_517 },
      { month: "2026-01", ремонт: 0, оборудование: 50_789 },
      { month: "2026-02", ремонт: 0, оборудование: 102_700 },
      { month: "2026-03", ремонт: 0, оборудование: 21_942 },
    ],
    majorItems: [
      { name: "Тубная машина", status: "оплачена 50%, долг 29 891 EUR", value: 43_077 },
      { name: "Грузовой лифт", status: "оплачен полностью", value: 19_512 },
      { name: "Водоочистка", status: "оплачена", value: 28_100 },
      { name: "Система пожаротушения", status: "оплачена 50%, долг 11 904", value: 35_573 },
      { name: "Реактор 250л", status: "оплачен", value: 19_586 },
      { name: "Реактор 100л", status: "оплачен", value: 2_000 },
      { name: "Реактор миксер 1т", status: "оплачен 50%", value: 11_509 },
      { name: "Гомогенизатор миксер", status: "оплачен", value: 11_200 },
      { name: "Погрузчик", status: "оплачен", value: 21_276 },
      { name: "Поломоющая Karcher", status: "оплачена", value: 4_537 },
      { name: "Пресс для разлива", status: "50% оплачен", value: 3_369 },
      { name: "Сашедные машины", status: "оплачены", value: 6_771 },
      { name: "Система видеонаблюдения", status: "установлена", value: 2_400 },
      { name: "Система пожарной сигнализации", status: "установлена", value: 5_611 },
      { name: "Вентиляция", status: "установлена", value: 10_948 },
      { name: "Автомобиль (трансфер)", status: "куплен", value: 35_162 },
      { name: "Мебель", status: "оплачена", value: 16_733 },
      { name: "Офисная техника", status: "куплена", value: 1_406 },
    ],
  },

  // Path-to-$250M scenarios
  scenarios: {
    baseline: {
      name: "Baseline (только CMO)",
      rev2030: 5_000_000,
      ebitda2030: 1_000_000,
      multiple: 8,
      exitValue: 8_000_000,
      probability: 0.50,
    },
    brand_moderate: {
      name: "Бренд умеренный успех",
      rev2030: 20_000_000,
      brandShare: 0.50,
      ebitda2030: 4_000_000,
      multiple: 10,
      exitValue: 40_000_000,
      probability: 0.30,
    },
    brand_strong: {
      name: "Бренд сильный рост",
      rev2030: 50_000_000,
      brandShare: 0.70,
      ebitda2030: 12_000_000,
      multiple: 10,
      exitValue: 120_000_000,
      probability: 0.15,
    },
    strategic_exit: {
      name: "Strategic exit (L'Oréal/EL/Shiseido)",
      rev2030: 80_000_000,
      brandShare: 0.80,
      ebitda2030: 20_000_000,
      multiple: 12,
      exitValue: 240_000_000,
      probability: 0.05,
    },
  },

  // Current valuation breakdown (my calculation as of Apr 2026)
  valuation: {
    method: "Mixed (asset + comparable + brand optionality)",
    components: [
      { name: "Net tangible assets (CAPEX + inventory - payables)", value: 1_100_000 },
      { name: "CMO going concern (Jun'25 normalized EBITDA × 8×)", value: 3_800_000 },
      { name: "Other direction group income ($1M × 3×)", value: 1_250_000 },
      { name: "Brand optionality (launch May 2026)", value: 2_500_000 },
    ],
    totalLow: 7_000_000,
    totalHigh: 12_000_000,
    userShare7pct: { low: 490_000, high: 840_000 },
  },
};
