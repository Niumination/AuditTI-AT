import { useState, useEffect, useRef } from "react";

const RISK_CONFIG = {
  low: { label: "Rendah", color: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.3)" },
  med: { label: "Sedang", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" },
  high: { label: "Tinggi", color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" },
  absurd: { label: "Absurd", color: "#ff00ff", bg: "rgba(255,0,255,0.12)", border: "rgba(255,0,255,0.35)" },
  pending: { label: "Belum Diaudit", color: "#64748b", bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)" },
};

const SAMPLE_DATA = [
  { id: "AT-001", paket: "Pengadaan Laptop Core i7 Gen 12 untuk Operasional SKPD", skpk: "Diskominfo Aceh Tengah", metode: "Pengadaan Langsung", pagu: 225000000, jenis: "Barang", volume: "15 Unit", spesifikasi: "Laptop Core i7 Gen12, RAM 16GB, SSD 512GB, layar 14 inch", risk: "low", pemborosan: 0, alasan: "" },
  { id: "AT-002", paket: "Sewa Server Cloud untuk Hosting Aplikasi Pemda", skpk: "Diskominfo Aceh Tengah", metode: "Pengadaan Langsung", pagu: 180000000, jenis: "Jasa", volume: "12 Bulan", spesifikasi: "Cloud server VPS 8 core, 32GB RAM, 500GB SSD, bandwidth unlimited", risk: "low", pemborosan: 0, alasan: "" },
  { id: "AT-003", paket: "Pengadaan iPhone 15 Pro Max untuk Pimpinan Daerah", skpk: "Sekretariat Daerah Kab. Aceh Tengah", metode: "Pengadaan Langsung", pagu: 620000000, jenis: "Barang", volume: "20 Unit", spesifikasi: "iPhone 15 Pro Max 256GB, Gold Titanium", risk: "absurd", pemborosan: 420000000, alasan: "Pengadaan iPhone 15 Pro Max senilai Rp 620 juta untuk 20 unit (@Rp 31 juta/unit) untuk pimpinan daerah sangat tidak pantas. Perangkat kerja pimpinan tidak memerlukan flagship premium seperti ini. Smartphone kelas menengah seharga Rp 5-8 juta sudah sangat memadai untuk keperluan dinas." },
  { id: "AT-004", paket: "Pengadaan Komputer Gaming High-End Ruang Rapat DPRD", skpk: "Sekretariat DPRD Aceh Tengah", metode: "Pengadaan Langsung", pagu: 350000000, jenis: "Barang", volume: "10 Unit", spesifikasi: "PC Gaming RTX 4080, i9-13900K, RAM 64GB, Monitor 4K 144Hz", risk: "high", pemborosan: 250000000, alasan: "Ruang rapat DPRD tidak memerlukan PC gaming high-end dengan GPU RTX 4080 dan RAM 64GB. Spesifikasi ini jauh melampaui kebutuhan presentasi dan pengolahan dokumen. Dugaan kuat markup dan pemborosan anggaran." },
  { id: "AT-005", paket: "Pengadaan Smart TV 75 Inch untuk Ruang Kerja Pejabat", skpk: "Bappeda Aceh Tengah", metode: "Pengadaan Langsung", pagu: 175000000, jenis: "Barang", volume: "7 Unit", spesifikasi: "Smart TV OLED 75 inch, 4K, untuk ruang kerja eselon II dan III", risk: "high", pemborosan: 100000000, alasan: "Smart TV OLED 75 inch (@Rp 25 juta/unit) untuk ruang kerja pejabat bukan kebutuhan operasional yang wajar. TV kelas ini lebih cocok untuk hiburan daripada kerja. LED TV 55 inch sudah lebih dari cukup untuk keperluan presentasi ruang kerja." },
  { id: "AT-006", paket: "Pengadaan Printer A3 Multifungsi untuk Kantor Dinas", skpk: "Dinas Pendidikan Aceh Tengah", metode: "Pengadaan Langsung", pagu: 96000000, jenis: "Barang", volume: "8 Unit", spesifikasi: "Printer A3 multifungsi print/scan/copy, network, duplex", risk: "low", pemborosan: 0, alasan: "" },
  { id: "AT-007", paket: "Pemeliharaan Jaringan LAN dan CCTV Komplek Perkantoran", skpk: "Diskominfo Aceh Tengah", metode: "Pengadaan Langsung", pagu: 145000000, jenis: "Jasa", volume: "12 Bulan", spesifikasi: "Pemeliharaan 45 titik CCTV, cabling LAN cat6, maintenance switch managed", risk: "low", pemborosan: 0, alasan: "" },
  { id: "AT-008", paket: "Pengembangan Aplikasi e-Government Terintegrasi", skpk: "Diskominfo Aceh Tengah", metode: "Tender", pagu: 850000000, jenis: "Jasa", volume: "1 Paket", spesifikasi: "Pengembangan sistem integrasi layanan e-Gov, API gateway, mobile app Android dan iOS", risk: "med", pemborosan: 150000000, alasan: "Nilai pengadaan Rp 850 juta untuk pengembangan aplikasi e-Government patut dicermati. Spesifikasi kurang detail terkait fitur dan deliverable. Potensi pemborosan ada jika tidak disertai SLA dan acceptance test yang ketat." },
  { id: "AT-009", paket: "Pengadaan Router, Switch, dan Access Point untuk SKPD", skpk: "Diskominfo Aceh Tengah", metode: "Pengadaan Langsung", pagu: 112000000, jenis: "Barang", volume: "1 Paket", spesifikasi: "Router enterprise Cisco 2 unit, Managed switch 24 port 5 unit, Access point WiFi 6 20 unit", risk: "low", pemborosan: 0, alasan: "" },
  { id: "AT-010", paket: "Sewa Kendaraan Operasional Berbasis Aplikasi Ride-Hailing 1 Tahun", skpk: "Dinas Kesehatan Aceh Tengah", metode: "Pengadaan Langsung", pagu: 280000000, jenis: "Jasa", volume: "12 Bulan", spesifikasi: "Sewa kendaraan premium berbasis aplikasi untuk mobilitas pejabat dinas kesehatan", risk: "med", pemborosan: 80000000, alasan: "Sewa kendaraan ride-hailing premium untuk operasional dinas senilai Rp 280 juta/tahun perlu dikaji ulang. Dinas Kesehatan umumnya memiliki kendaraan operasional dinas sendiri. Jika dibutuhkan, aplikasi ride-hailing reguler lebih efisien." },
  { id: "AT-011", paket: "Pengadaan UPS dan Stabilizer Ruang Server", skpk: "BKAD Aceh Tengah", metode: "Pengadaan Langsung", pagu: 68000000, jenis: "Barang", volume: "4 Unit", spesifikasi: "UPS 3KVA online double conversion 2 unit, Stabilizer 5KVA 2 unit untuk ruang server", risk: "low", pemborosan: 0, alasan: "" },
  { id: "AT-012", paket: "Pelatihan dan Sertifikasi IT untuk ASN Seluruh SKPD", skpk: "BKPSDM Aceh Tengah", metode: "Pengadaan Langsung", pagu: 320000000, jenis: "Jasa", volume: "50 Orang", spesifikasi: "Pelatihan dan sertifikasi CompTIA, Microsoft, Google Workspace untuk 50 ASN", risk: "med", pemborosan: 70000000, alasan: "Pelatihan IT untuk 50 ASN senilai Rp 320 juta (@Rp 6,4 juta/orang) cukup wajar untuk sertifikasi vendor seperti CompTIA dan Microsoft. Namun perlu dipastikan sertifikasi yang dipilih relevan dengan tupoksi masing-masing ASN dan ada mekanisme retensi pasca-pelatihan." },
];

const formatRupiah = (n) => "Rp " + n.toLocaleString("id-ID");

const RiskBadge = ({ risk }) => {
  const c = RISK_CONFIG[risk] || RISK_CONFIG.pending;
  return (
    <span style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontFamily: "'Space Mono', monospace", fontWeight: 700, letterSpacing: 0.5, whiteSpace: "nowrap" }}>
      {c.label}
    </span>
  );
};

export default function App() {
  const [data, setData] = useState(SAMPLE_DATA);
  const [filter, setFilter] = useState("all");
  const [skpkFilter, setSkpkFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("dashboard"); // dashboard | table | audit
  const [auditLoading, setAuditLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [newPaket, setNewPaket] = useState({ paket: "", skpk: "", metode: "Pengadaan Langsung", pagu: "", jenis: "Barang", volume: "", spesifikasi: "" });
  const [adding, setAdding] = useState(false);
  const [auditAll, setAuditAll] = useState(false);

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const skpkList = [...new Set(data.map(d => d.skpk))];
  const filtered = data.filter(d => {
    const rOk = filter === "all" || d.risk === filter;
    const sOk = skpkFilter === "all" || d.skpk === skpkFilter;
    return rOk && sOk;
  });

  const totalPagu = data.reduce((a, b) => a + b.pagu, 0);
  const totalPemborosan = data.reduce((a, b) => a + (b.pemborosan || 0), 0);
  const paketBerisiko = data.filter(d => d.risk === "high" || d.risk === "absurd").length;
  const belumDiaudit = data.filter(d => d.risk === "pending").length;

  const handleAudit = async (item) => {
    setAuditLoading(item.id);
    try {
      const prompt = `Kamu adalah auditor pemerintah daerah. Tugasmu mengaudit pengadaan IT pemerintah dan mendeteksi anomali, pemborosan, atau pengadaan yang tidak pantas untuk pemerintah kabupaten.

Analisa paket pengadaan berikut dari ${item.skpk}, Aceh Tengah:

Nama Paket: ${item.paket}
Pagu Anggaran: ${formatRupiah(item.pagu)}
Jenis: ${item.jenis}
Metode: ${item.metode}
Volume/Kuantitas: ${item.volume}
Spesifikasi: ${item.spesifikasi}

Berikan analisa dalam format JSON SAJA (tanpa markdown, tanpa backtick):
{
  "potensiPemborosan": <angka dalam rupiah, 0 jika wajar>,
  "isInappropriate": "<low|med|high|absurd>",
  "inappropriateReason": "<alasan jika high atau absurd, kosong jika low atau med>"
}

Keterangan level:
- low: Pengadaan wajar, spesifikasi sesuai kebutuhan
- med: Ada kekhawatiran kecil, perlu dicermati
- high: Spesifikasi berlebihan atau nilai tidak wajar
- absurd: Jelas pemborosan atau tidak pantas sama sekali untuk kantor pemerintah`;

      const key = import.meta.env.VITE_OPENROUTER_KEY;
      const model = import.meta.env.VITE_OPENROUTER_MODEL || "google/gemini-2.0-flash-001";

      if (!key) {
        showToast("🔑 OPENROUTER_KEY belum di-set. Set VITE_OPENROUTER_KEY di .env", "err");
        setAuditLoading(null);
        return;
      }

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "AuditTI-AT Aceh Tengah",
        },
        body: JSON.stringify({
          model,
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "unknown");
        showToast(`Gagal: API ${res.status} — ${errText.slice(0, 80)}`, "err");
        setAuditLoading(null);
        return;
      }

      const json = await res.json();
      const text = json.choices?.[0]?.message?.content || "{}";
      const clean = text.replace(/```json|```/g, "").trim();
      const result = JSON.parse(clean);

      setData(prev => prev.map(d => d.id === item.id ? {
        ...d,
        risk: result.isInappropriate || "low",
        pemborosan: result.potensiPemborosan || 0,
        alasan: result.inappropriateReason || "",
      } : d));
      showToast(`Audit selesai: ${item.paket.slice(0, 40)}...`, "ok");
    } catch (e) {
      showToast("Gagal melakukan audit AI. Coba lagi.", "err");
    }
    setAuditLoading(null);
  };

  const handleAuditAll = async () => {
    const pending = data.filter(d => d.risk === "pending");
    if (pending.length === 0) { showToast("Semua paket sudah diaudit."); return; }
    setAuditAll(true);
    for (const item of pending) {
      await handleAudit(item);
    }
    setAuditAll(false);
    showToast("Audit massal selesai!", "ok");
  };

  const handleAddPaket = async () => {
    if (!newPaket.paket || !newPaket.skpk || !newPaket.pagu) { showToast("Lengkapi field yang diperlukan!", "err"); return; }
    const id = "AT-" + String(data.length + 1).padStart(3, "0");
    const entry = { ...newPaket, id, pagu: parseInt(newPaket.pagu.replace(/\D/g, "")) || 0, risk: "pending", pemborosan: 0, alasan: "" };
    setData(prev => [...prev, entry]);
    setNewPaket({ paket: "", skpk: "", metode: "Pengadaan Langsung", pagu: "", jenis: "Barang", volume: "", spesifikasi: "" });
    setAdding(false);
    showToast(`Paket ditambahkan: ${id}`);
    setView("table");
  };

  const riskCounts = { low: 0, med: 0, high: 0, absurd: 0, pending: 0 };
  data.forEach(d => { riskCounts[d.risk] = (riskCounts[d.risk] || 0) + 1; });

  return (
    <div style={{ minHeight: "100vh", background: "#070d1a", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0f1828; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
        .row-hover:hover { background: rgba(30,58,95,0.3) !important; cursor: pointer; }
        .btn { cursor: pointer; border: none; border-radius: 6px; font-family: 'DM Sans', sans-serif; font-weight: 600; transition: all 0.18s; }
        .btn:hover { filter: brightness(1.15); transform: translateY(-1px); }
        .btn:active { transform: translateY(0); }
        .nav-item { cursor: pointer; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; transition: all 0.15s; color: #94a3b8; }
        .nav-item:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; }
        .nav-item.active { background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.25); }
        .kpi-card { background: rgba(15,24,42,0.9); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; transition: border-color 0.2s; }
        .kpi-card:hover { border-color: rgba(255,255,255,0.12); }
        .input-field { background: rgba(15,24,42,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 14px; color: #e2e8f0; font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; width: 100%; transition: border-color 0.2s; }
        .input-field:focus { border-color: rgba(59,130,246,0.5); }
        .input-field::placeholder { color: #475569; }
        select.input-field option { background: #0f1828; }
        .tag-bar { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag { padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; cursor: pointer; font-family: 'Space Mono', monospace; transition: all 0.15s; }
        .tag:hover { filter: brightness(1.2); }
        .pulsing { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .slide-in { animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        @media (max-width: 700px) { .grid-4 { grid-template-columns: repeat(2, 1fr); } .grid-2 { grid-template-columns: 1fr; } }
      `}</style>

      {/* HEADER */}
      <div style={{ background: "rgba(7,13,26,0.95)", borderBottom: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛡️</div>
            <div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, fontWeight: 700, color: "#e2e8f0", letterSpacing: 1 }}>AUDIT PENGADAAN IT</div>
              <div style={{ fontSize: 10, color: "#64748b", letterSpacing: 0.5 }}>SKPK KAB. ACEH TENGAH · TA 2025</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["dashboard", "table", "audit"].map(v => (
              <div key={v} className={`nav-item ${view === v ? "active" : ""}`} onClick={() => setView(v)}>
                {v === "dashboard" ? "📊 Dashboard" : v === "table" ? "📋 Data Paket" : "➕ Tambah Paket"}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            <span style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono',monospace" }}>LIVE</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div className="slide-in">
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono',monospace", letterSpacing: 1, marginBottom: 6 }}>IKHTISAR AUDIT · AI-POWERED</div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>Audit Pengadaan IT — Seluruh SKPK</h1>
              <p style={{ color: "#64748b", fontSize: 13 }}>Hasil klasifikasi AI terhadap {data.length} paket pengadaan IT di lingkup Kabupaten Aceh Tengah. Data berdasarkan simulasi RUP/SiRUP.</p>
            </div>

            {/* KPI GRID */}
            <div className="grid-4" style={{ marginBottom: 20 }}>
              {[
                { label: "Total Paket", value: data.length, sub: "paket pengadaan IT", icon: "📦", color: "#60a5fa" },
                { label: "Total Pagu", value: formatRupiah(totalPagu), sub: "anggaran keseluruhan", icon: "💰", color: "#34d399" },
                { label: "Potensi Pemborosan", value: formatRupiah(totalPemborosan), sub: "estimasi AI", icon: "⚠️", color: "#f87171" },
                { label: "Paket Berisiko", value: paketBerisiko, sub: "high + absurd", icon: "🚨", color: "#fb923c" },
              ].map((k, i) => (
                <div key={i} className="kpi-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontSize: 10, color: "#475569", fontFamily: "'Space Mono',monospace", letterSpacing: 0.5, textTransform: "uppercase" }}>{k.label}</div>
                    <span style={{ fontSize: 18 }}>{k.icon}</span>
                  </div>
                  <div style={{ fontSize: k.label === "Total Pagu" || k.label === "Potensi Pemborosan" ? 15 : 26, fontWeight: 700, color: k.color, margin: "8px 0 4px", fontFamily: "'Space Mono',monospace", lineHeight: 1.2 }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* RISK DISTRIBUTION */}
            <div className="grid-2" style={{ marginBottom: 20 }}>
              <div className="kpi-card">
                <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono',monospace", marginBottom: 14, letterSpacing: 0.5 }}>DISTRIBUSI RISIKO</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {Object.entries(RISK_CONFIG).map(([k, v]) => {
                    const count = riskCounts[k] || 0;
                    const pct = data.length ? Math.round((count / data.length) * 100) : 0;
                    return (
                      <div key={k}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, color: v.color, fontWeight: 600 }}>{v.label}</span>
                          <span style={{ fontSize: 12, fontFamily: "'Space Mono',monospace", color: "#94a3b8" }}>{count} paket ({pct}%)</span>
                        </div>
                        <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: v.color, borderRadius: 4, transition: "width 0.8s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="kpi-card">
                <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono',monospace", marginBottom: 14, letterSpacing: 0.5 }}>PAKET PERLU PERHATIAN</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", maxHeight: 240 }}>
                  {data.filter(d => d.risk === "high" || d.risk === "absurd").map(d => (
                    <div key={d.id} onClick={() => { setSelected(d); setView("table"); }} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, cursor: "pointer" }}>
                      <RiskBadge risk={d.risk} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.paket}</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{d.skpk} · {formatRupiah(d.pagu)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SKPK BREAKDOWN */}
            <div className="kpi-card">
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono',monospace", marginBottom: 14, letterSpacing: 0.5 }}>REKAPITULASI PER SKPK</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      {["SKPK", "Jumlah Paket", "Total Pagu", "Potensi Pemborosan", "Risiko Tertinggi"].map(h => (
                        <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#475569", fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {skpkList.map(skpk => {
                      const items = data.filter(d => d.skpk === skpk);
                      const paguTotal = items.reduce((a, b) => a + b.pagu, 0);
                      const pemborosanTotal = items.reduce((a, b) => a + (b.pemborosan || 0), 0);
                      const risks = ["absurd", "high", "med", "low", "pending"];
                      const topRisk = risks.find(r => items.some(i => i.risk === r)) || "pending";
                      return (
                        <tr key={skpk} className="row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} onClick={() => { setSkpkFilter(skpk); setView("table"); }}>
                          <td style={{ padding: "10px 12px", color: "#cbd5e1", fontWeight: 500 }}>{skpk}</td>
                          <td style={{ padding: "10px 12px", color: "#94a3b8", fontFamily: "'Space Mono',monospace" }}>{items.length}</td>
                          <td style={{ padding: "10px 12px", color: "#94a3b8", fontFamily: "'Space Mono',monospace", fontSize: 12 }}>{formatRupiah(paguTotal)}</td>
                          <td style={{ padding: "10px 12px", color: pemborosanTotal > 0 ? "#f87171" : "#64748b", fontFamily: "'Space Mono',monospace", fontSize: 12 }}>{formatRupiah(pemborosanTotal)}</td>
                          <td style={{ padding: "10px 12px" }}><RiskBadge risk={topRisk} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TABLE VIEW */}
        {view === "table" && (
          <div className="slide-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono',monospace", letterSpacing: 1, marginBottom: 4 }}>DATA PAKET PENGADAAN IT</div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>Seluruh SKPK · Aceh Tengah</h2>
              </div>
              <button className="btn" onClick={handleAuditAll} disabled={auditAll || belumDiaudit === 0} style={{ background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", color: "#fff", padding: "9px 18px", fontSize: 13, opacity: (auditAll || belumDiaudit === 0) ? 0.5 : 1 }}>
                {auditAll ? <span className="pulsing">⏳ Mengaudit semua...</span> : `🤖 Audit AI Semua (${belumDiaudit} pending)`}
              </button>
            </div>

            {/* FILTERS */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <div className="tag-bar">
                {["all", "low", "med", "high", "absurd", "pending"].map(f => {
                  const c = f === "all" ? { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" } : RISK_CONFIG[f];
                  const isActive = filter === f;
                  return (
                    <div key={f} className="tag" onClick={() => setFilter(f)} style={{ background: isActive ? c.bg : "transparent", border: `1px solid ${isActive ? c.border : "rgba(255,255,255,0.08)"}`, color: isActive ? c.color : "#475569" }}>
                      {f === "all" ? "Semua" : RISK_CONFIG[f].label} {f !== "all" && `(${riskCounts[f] || 0})`}
                    </div>
                  );
                })}
              </div>
              <select className="input-field" style={{ width: "auto", maxWidth: 240 }} value={skpkFilter} onChange={e => setSkpkFilter(e.target.value)}>
                <option value="all">Semua SKPK</option>
                {skpkList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* TABLE */}
            <div style={{ background: "rgba(15,24,42,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      {["ID", "Nama Paket", "SKPK", "Pagu", "Risiko", "Pemborosan Est.", "Aksi"].map(h => (
                        <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: "#475569", fontSize: 10, fontFamily: "'Space Mono',monospace", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((d) => (
                      <>
                        <tr key={d.id} className="row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: selected?.id === d.id ? "rgba(59,130,246,0.08)" : "transparent" }}
                          onClick={() => setSelected(selected?.id === d.id ? null : d)}>
                          <td style={{ padding: "11px 14px", fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#475569" }}>{d.id}</td>
                          <td style={{ padding: "11px 14px", color: "#cbd5e1", maxWidth: 260 }}>
                            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.paket}</div>
                            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{d.jenis} · {d.metode}</div>
                          </td>
                          <td style={{ padding: "11px 14px", color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap" }}>{d.skpk.replace("Aceh Tengah", "Aceh Tgh").replace("Kabupaten", "Kab.")}</td>
                          <td style={{ padding: "11px 14px", color: "#e2e8f0", fontFamily: "'Space Mono',monospace", fontSize: 12, whiteSpace: "nowrap" }}>{formatRupiah(d.pagu)}</td>
                          <td style={{ padding: "11px 14px" }}><RiskBadge risk={d.risk} /></td>
                          <td style={{ padding: "11px 14px", fontFamily: "'Space Mono',monospace", fontSize: 12, color: d.pemborosan > 0 ? "#f87171" : "#475569" }}>
                            {d.pemborosan > 0 ? formatRupiah(d.pemborosan) : "—"}
                          </td>
                          <td style={{ padding: "11px 14px" }}>
                            <button className="btn" disabled={auditLoading === d.id} onClick={(e) => { e.stopPropagation(); handleAudit(d); }}
                              style={{ background: d.risk === "pending" ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${d.risk === "pending" ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"}`, color: d.risk === "pending" ? "#60a5fa" : "#64748b", padding: "5px 12px", fontSize: 11, opacity: auditLoading === d.id ? 0.5 : 1 }}>
                              {auditLoading === d.id ? <span className="pulsing">⏳</span> : "🤖 Audit"}
                            </button>
                          </td>
                        </tr>
                        {selected?.id === d.id && (
                          <tr key={d.id + "-detail"}>
                            <td colSpan={7} style={{ padding: "0 14px 14px" }}>
                              <div style={{ background: "rgba(30,58,95,0.15)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8, padding: 16 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: d.alasan ? 12 : 0 }}>
                                  <div><div style={{ fontSize: 10, color: "#475569", marginBottom: 3, fontFamily: "'Space Mono',monospace" }}>VOLUME</div><div style={{ color: "#cbd5e1", fontSize: 13 }}>{d.volume}</div></div>
                                  <div><div style={{ fontSize: 10, color: "#475569", marginBottom: 3, fontFamily: "'Space Mono',monospace" }}>JENIS PENGADAAN</div><div style={{ color: "#cbd5e1", fontSize: 13 }}>{d.jenis}</div></div>
                                  <div><div style={{ fontSize: 10, color: "#475569", marginBottom: 3, fontFamily: "'Space Mono',monospace" }}>METODE</div><div style={{ color: "#cbd5e1", fontSize: 13 }}>{d.metode}</div></div>
                                </div>
                                {d.spesifikasi && <div style={{ marginBottom: d.alasan ? 12 : 0 }}><div style={{ fontSize: 10, color: "#475569", marginBottom: 3, fontFamily: "'Space Mono',monospace" }}>SPESIFIKASI</div><div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6 }}>{d.spesifikasi}</div></div>}
                                {d.alasan && (
                                  <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: 12 }}>
                                    <div style={{ fontSize: 10, color: "#f87171", marginBottom: 6, fontFamily: "'Space Mono',monospace", letterSpacing: 0.5 }}>⚠️ TEMUAN AI</div>
                                    <div style={{ color: "#fca5a5", fontSize: 12, lineHeight: 1.7 }}>{d.alasan}</div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: "#475569", textAlign: "right" }}>
              Menampilkan {filtered.length} dari {data.length} paket
            </div>
          </div>
        )}

        {/* ADD PAKET */}
        {view === "audit" && (
          <div className="slide-in" style={{ maxWidth: 680 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono',monospace", letterSpacing: 1, marginBottom: 4 }}>INPUT DATA BARU</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>Tambah Paket Pengadaan IT</h2>
              <p style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>Masukkan data paket pengadaan untuk diaudit oleh AI secara otomatis.</p>
            </div>

            <div style={{ background: "rgba(15,24,42,0.7)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 24 }}>
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono',monospace", display: "block", marginBottom: 6 }}>NAMA PAKET *</label>
                  <input className="input-field" placeholder="Contoh: Pengadaan Laptop 10 Unit untuk Operasional Dinas..." value={newPaket.paket} onChange={e => setNewPaket(p => ({ ...p, paket: e.target.value }))} />
                </div>
                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono',monospace", display: "block", marginBottom: 6 }}>SKPK *</label>
                    <input className="input-field" placeholder="Nama SKPD/OPD..." value={newPaket.skpk} onChange={e => setNewPaket(p => ({ ...p, skpk: e.target.value }))} list="skpk-list" />
                    <datalist id="skpk-list">{skpkList.map(s => <option key={s} value={s} />)}</datalist>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono',monospace", display: "block", marginBottom: 6 }}>PAGU ANGGARAN (Rp) *</label>
                    <input className="input-field" type="number" placeholder="Contoh: 150000000" value={newPaket.pagu} onChange={e => setNewPaket(p => ({ ...p, pagu: e.target.value }))} />
                  </div>
                </div>
                <div className="grid-2">
                  <div>
                    <label style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono',monospace", display: "block", marginBottom: 6 }}>JENIS PENGADAAN</label>
                    <select className="input-field" value={newPaket.jenis} onChange={e => setNewPaket(p => ({ ...p, jenis: e.target.value }))}>
                      <option>Barang</option><option>Jasa</option><option>Konstruksi</option><option>Konsultansi</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono',monospace", display: "block", marginBottom: 6 }}>METODE</label>
                    <select className="input-field" value={newPaket.metode} onChange={e => setNewPaket(p => ({ ...p, metode: e.target.value }))}>
                      <option>Pengadaan Langsung</option><option>Tender</option><option>Penunjukan Langsung</option><option>e-Purchasing</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono',monospace", display: "block", marginBottom: 6 }}>VOLUME/KUANTITAS</label>
                  <input className="input-field" placeholder="Contoh: 10 Unit, 1 Paket, 12 Bulan..." value={newPaket.volume} onChange={e => setNewPaket(p => ({ ...p, volume: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#64748b", fontFamily: "'Space Mono',monospace", display: "block", marginBottom: 6 }}>SPESIFIKASI TEKNIS</label>
                  <textarea className="input-field" rows={3} placeholder="Uraian spesifikasi, merek, tipe, dsb..." value={newPaket.spesifikasi} onChange={e => setNewPaket(p => ({ ...p, spesifikasi: e.target.value }))} style={{ resize: "vertical" }} />
                </div>
              </div>

              <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn" onClick={handleAddPaket} style={{ background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", color: "#fff", padding: "11px 24px", fontSize: 13 }}>
                  ➕ Tambah & Simpan
                </button>
                <button className="btn" onClick={() => { handleAddPaket().then(() => {}); }} style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa", padding: "11px 24px", fontSize: 13 }} disabled>
                  🤖 Tambah & Audit Sekarang
                </button>
              </div>
            </div>

            <div style={{ marginTop: 16, padding: 14, background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#fbbf24", fontFamily: "'Space Mono',monospace", marginBottom: 4 }}>⚠️ CATATAN</div>
              <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
                Hasil klasifikasi AI merupakan alat bantu pemantauan, bukan keputusan final. Gunakan sebagai acuan awal untuk investigasi lebih lanjut oleh auditor/inspektorat.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: toast.type === "err" ? "rgba(239,68,68,0.9)" : "rgba(34,197,94,0.9)", color: "#fff", padding: "12px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500, backdropFilter: "blur(10px)", zIndex: 999, maxWidth: 340, boxShadow: "0 4px 20px rgba(0,0,0,0.4)", animation: "slideIn 0.3s ease" }}>
          {toast.type === "err" ? "❌ " : "✅ "}{toast.msg}
        </div>
      )}

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "24px 20px", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: 24 }}>
        <p style={{ fontSize: 11, color: "#334155", fontFamily: "'Space Mono',monospace" }}>
          AUDIT PENGADAAN IT · DISKOMINFO ACEH TENGAH · POWERED BY CLAUDE AI
        </p>
        <p style={{ fontSize: 10, color: "#1e3a5f", marginTop: 4 }}>Data merupakan hasil klasifikasi AI dan dapat keliru. Gunakan sebagai acuan pemantauan saja.</p>
      </div>
    </div>
  );
}
