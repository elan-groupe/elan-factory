"""
build_data.py — оркестратор: читает всё из data/ и пишет docs/data.js.

Входы:
  data/snapshots/YYYY-MM.json      — из parse_raporlar.py (месячные факты)
  data/snapshots/ag_kassa.json     — из parse_kassa_ag.py
  data/constants.json              — ручные данные (meta, scenarios, loreal, valuation, payroll, capex)

Выход:
  docs/data.js — window.ELAN_DATA = {...}

Usage:
  # 1) парсим raw xlsx → JSON-снапшоты
  python scripts/parse_raporlar.py "_raw/RAPORLAR 2026 MART Kimya (1).xlsx" 2026-03
  python scripts/parse_raporlar.py "_raw/RAPORLAR 2026 ŞUBAT1.xlsx"          2026-02
  python scripts/parse_kassa_ag.py  "_raw/УЧЕТ НАЛИЧНЫХ 2026 АГ.xlsx"
  # 2) собираем data.js
  python scripts/build_data.py
"""
import sys, os, json, glob
from datetime import date
sys.stdout.reconfigure(encoding='utf-8')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def build_month(snapshot: dict, constants: dict, ag_kassa: list) -> dict:
    """Из snapshot (raporlar) + ag_kassa (other direction income) собираем
    месячный блок той же формы, что был в старом data.js."""
    period = snapshot["period"]
    meta = constants.get("monthMetadata", {}).get(period, {})
    totals = snapshot.get("totals", {})
    costs = snapshot.get("costs", {})

    revenue = totals.get("revenue", 0) or 0
    cash_in = totals.get("cash_in", 0) or 0
    cash_out = totals.get("cash_out", 0) or 0

    # ── COGS ──
    customs = costs.get("customs_duty", 0) or 0
    cogs_raw = costs.get("cogs_raw", 0) or 0
    cogs_packaging = (costs.get("cogs_packaging_jars", 0) or 0) + (costs.get("cogs_packaging_china", 0) or 0)
    cogs_labels = costs.get("cogs_labels", 0) or 0
    cogs_boxes = costs.get("cogs_boxes", 0) or 0
    cogs_shipping = costs.get("cogs_shipping_total", 0) or 0
    cogs_total = cogs_raw + cogs_packaging + cogs_labels + cogs_boxes + cogs_shipping + customs

    # ── OPEX ──
    opex_factory = costs.get("opex_factory_total", 0) or 0
    opex_personnel = costs.get("opex_personnel_total", 0) or 0
    opex_services_raw = costs.get("opex_services_total", 0) or 0
    opex_services = max(0, opex_services_raw - customs)  # customs отделили в COGS
    opex_other = (costs.get("opex_other_total", 0) or 0) + (costs.get("opex_ukr_office", 0) or 0)
    opex_total = opex_factory + opex_personnel + opex_services + opex_other

    capex_through_opex = costs.get("capex_through_opex", 0) or 0
    capex_explicit = meta.get("capex", capex_through_opex)

    # ── Other revenue = "Поступление от учредителей" из RAPORLAR (per user: группа) ──
    other_revenue = totals.get("founder_injection", 0) or 0

    total_revenue = revenue + other_revenue
    op_profit = total_revenue - cogs_total - opex_total
    op_margin = op_profit / total_revenue if total_revenue > 0 else 0

    # ── Clients ──
    client_map = constants.get("clientMetadata", {})
    clients = []
    for key, amount in (snapshot.get("clients") or {}).items():
        cm = client_map.get(key, {"name": key, "country": "?"})
        clients.append({"name": cm["name"], "country": cm["country"], "amount": round(amount, 2), "key": key})
    clients.sort(key=lambda c: -c["amount"])

    export = totals.get("export_total", 0) or 0
    privates = (snapshot.get("clients") or {}).get("privates", 0) or 0

    return {
        "month": period,
        "label": meta.get("label", period),
        "status": meta.get("status", "normal"),
        "note": meta.get("note", ""),
        "revenue": round(revenue, 2),
        "cashIn": round(cash_in, 2),
        "cashOut": round(cash_out, 2),
        "cogs": {
            "raw_materials": round(cogs_raw, 2),
            "packaging":     round(cogs_packaging, 2),
            "labels":        round(cogs_labels, 2),
            "boxes":         round(cogs_boxes, 2),
            "shipping":      round(cogs_shipping, 2),
            "customs":       round(customs, 2),
            "total":         round(cogs_total, 2),
        },
        "opex": {
            "factory":   round(opex_factory, 2),
            "personnel": round(opex_personnel, 2),
            "services":  round(opex_services, 2),
            "other":     round(opex_other, 2),
            "total":     round(opex_total, 2),
        },
        "capex": round(capex_explicit, 2),
        "otherRevenue": round(other_revenue, 2),
        "totalRevenue": round(total_revenue, 2),
        "opProfit":     round(op_profit, 2),
        "opMargin":     round(op_margin, 4),
        "founderInjection": round(other_revenue, 2),  # legacy alias
        "export":      round(export + privates, 2),
        "exportShare": round((export + privates) / revenue, 4) if revenue > 0 else 0,
        "clients": clients,
    }


def build_ag_kassa(ag_kassa_data: dict, notes: dict) -> list:
    out = []
    prev_end = 0
    for m in ag_kassa_data.get("months", []):
        in_ = m.get("in") or 0
        out_ = m.get("out_total") or 0
        end = m.get("ending")
        if end is None:
            end = prev_end + in_ - out_
        out.append({
            "month": m["month"],
            "label": m.get("sheet", m["month"]),
            "in":     round(in_, 0),
            "out":    round(out_, 0),
            "ending": round(end, 0),
            **({"note": notes[m["month"]]} if m["month"] in notes else {}),
        })
        prev_end = end
    return out


def build_cash_positions(snapshot: dict) -> list:
    """Bank positions из последнего снапшота. Пересчёт в EUR по курсу TL/EUR из constants."""
    out = []
    for key, b in (snapshot.get("banks") or {}).items():
        label = b["label"]
        if " TL" in label: currency = "TL"
        elif "EUR" in label: currency = "EUR"
        elif "USD" in label: currency = "USD"
        else: currency = "?"
        balance = b.get("end") or 0
        out.append({
            "account":  label,
            "currency": currency,
            "balance":  round(balance, 2),
        })
    return out


def build_inventory(snapshot: dict) -> dict:
    inv = snapshot.get("inventory", {}) or {}
    total = sum((v.get("value") or 0) for v in inv.values())
    return {
        "finishedGoods":    inv.get("finished_goods", {}),
        "rawMaterials":     inv.get("raw_materials", {}),
        "packaging_jars":   inv.get("jars", {}),
        "packaging_boxes":  inv.get("boxes", {}),
        "labels":           inv.get("labels", {}),
        "instructions":     inv.get("instructions", {}),
        "total":            round(total, 2),
    }


def main():
    constants = load_json(os.path.join(ROOT, "data", "constants.json"))

    # Все месячные снапшоты
    snap_files = sorted(glob.glob(os.path.join(ROOT, "data", "snapshots", "20??-??.json")))
    snapshots = [load_json(f) for f in snap_files]

    # AG kassa
    ag_path = os.path.join(ROOT, "data", "snapshots", "ag_kassa.json")
    ag_data = load_json(ag_path) if os.path.exists(ag_path) else {"months": []}
    ag_kassa_list = build_ag_kassa(ag_data, constants.get("agKassaNotes", {}))

    # Months
    months = [build_month(s, constants, ag_data.get("months", [])) for s in snapshots]
    months.sort(key=lambda m: m["month"])

    # Последний снапшот → cashPositions + inventory
    latest = snapshots[-1] if snapshots else {}
    cash_positions = build_cash_positions(latest)
    inventory = build_inventory(latest)

    # Собираем итоговый объект
    out = {
        "meta": {
            **constants["meta"],
            "lastUpdate": date.today().isoformat(),
            "sourceSnapshots": [s["period"] for s in snapshots],
        },
        "months": months,
        "agKassa": ag_kassa_list,
        "cashPositions": cash_positions,
        "payroll": constants.get("payroll_march"),
        "productShipments": constants.get("productShipments"),
        "inventory": inventory,
        "capex": constants.get("capex_summary"),
        "scenarios": constants.get("scenarios"),
        "loreal_acquisitions": constants.get("loreal_acquisitions"),
        "valuation": constants.get("valuation"),
    }

    # Дополним valuation userShare
    share = constants["meta"]["ownerShare"]
    out["valuation"]["userShare7pct"] = {
        "low":  round(out["valuation"]["totalLow"]  * share),
        "high": round(out["valuation"]["totalHigh"] * share),
    }

    # Пишем docs/data.js
    out_path = os.path.join(ROOT, "docs", "data.js")
    header = (
        "// ELAN KIMYA / ELAN FACTORY — unified data (AUTO-GENERATED)\n"
        "// Source: data/snapshots/* (из xlsx) + data/constants.json (ручные данные).\n"
        "// НЕ ПРАВИТЬ ВРУЧНУЮ. Перегенерация: python scripts/build_data.py\n"
        f"// Built: {date.today().isoformat()}\n\n"
        "window.ELAN_DATA = "
    )
    js_body = json.dumps(out, ensure_ascii=False, indent=2)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(header + js_body + ";\n")

    print(f"Wrote {out_path} ({len(months)} months, {len(ag_kassa_list)} kassa months)")
    for m in months:
        print(f"  {m['month']} [{m['status']:10s}] rev={m['revenue']:>10.0f}  other={m['otherRevenue']:>10.0f}  opProfit={m['opProfit']:>+10.0f}  margin={m['opMargin']*100:+.1f}%")


if __name__ == "__main__":
    main()
