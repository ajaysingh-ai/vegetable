import { useState, useEffect } from "react";

const VEGETABLES = ["Tomatoes","Potatoes","Onions","Spinach","Carrots","Cauliflower","Cabbage","Brinjal","Okra","Green Peas"];
const CATEGORIES = { Leafy: ["Spinach","Cabbage"], Root: ["Potatoes","Carrots","Onions"], Fruit: ["Tomatoes","Brinjal","Okra","Green Peas"], Flower: ["Cauliflower"] };
const CITIES = ["Delhi","Mumbai","Bangalore","Hyderabad","Chennai","Jaipur","Lucknow","Pune"];
const STATUSES = ["Loading","In Transit","Delivered","Delayed"];

const STATUS_COLORS = {
  "Loading":    { bg:"#E8F4FD", text:"#1565C0", dot:"#1E88E5" },
  "In Transit": { bg:"#FFF8E1", text:"#E65100", dot:"#FB8C00" },
  "Delivered":  { bg:"#E8F5E9", text:"#2E7D32", dot:"#43A047" },
  "Delayed":    { bg:"#FFEBEE", text:"#B71C1C", dot:"#E53935" },
};

const CAT_COLORS = {
  Leafy:  "#43A047", Root: "#795548",
  Fruit:  "#E53935", Flower: "#8E24AA",
};

function getCategory(veg) {
  return Object.keys(CATEGORIES).find(c => CATEGORIES[c].includes(veg)) || "Other";
}

const seed = [
  { id:"D001", from:"Delhi", to:"Mumbai", veg:"Tomatoes", qty:1200, unit:"kg", status:"In Transit", driver:"Ramesh Kumar", vehicle:"DL-01-AB-1234", depart:"2024-06-10 08:30", eta:"2024-06-11 18:00", progress:62 },
  { id:"D002", from:"Jaipur", to:"Bangalore", veg:"Potatoes", qty:2500, unit:"kg", status:"Loading", driver:"Suresh Singh", vehicle:"RJ-14-CD-5678", depart:"2024-06-10 14:00", eta:"2024-06-12 10:00", progress:8 },
  { id:"D003", from:"Lucknow", to:"Hyderabad", veg:"Onions", qty:1800, unit:"kg", status:"Delivered", driver:"Anil Verma", vehicle:"UP-32-EF-9012", depart:"2024-06-08 06:00", eta:"2024-06-10 20:00", progress:100 },
  { id:"D004", from:"Pune", to:"Chennai", veg:"Cauliflower", qty:900, unit:"kg", status:"Delayed", driver:"Prakash Nair", vehicle:"MH-12-GH-3456", depart:"2024-06-09 10:00", eta:"2024-06-11 22:00", progress:45 },
  { id:"D005", from:"Delhi", to:"Jaipur", veg:"Spinach", qty:400, unit:"kg", status:"In Transit", driver:"Vinod Sharma", vehicle:"DL-02-IJ-7890", depart:"2024-06-10 07:00", eta:"2024-06-10 15:00", progress:78 },
  { id:"D006", from:"Mumbai", to:"Lucknow", veg:"Carrots", qty:1100, unit:"kg", status:"Delivered", driver:"Ravi Desai", vehicle:"MH-01-KL-2345", depart:"2024-06-07 09:00", eta:"2024-06-09 20:00", progress:100 },
];

function Badge({ status }) {
  const c = STATUS_COLORS[status] || {};
  return (
    <span style={{ background: c.bg, color: c.text, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600, display:"inline-flex", alignItems:"center", gap: 5 }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background: c.dot, display:"inline-block" }} />
      {status}
    </span>
  );
}

function CatBadge({ veg }) {
  const cat = getCategory(veg);
  return (
    <span style={{ background: CAT_COLORS[cat] + "22", color: CAT_COLORS[cat], borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>
      {cat}
    </span>
  );
}

function ProgressBar({ value, status }) {
  const color = status === "Delivered" ? "#43A047" : status === "Delayed" ? "#E53935" : status === "Loading" ? "#1E88E5" : "#FB8C00";
  return (
    <div style={{ background:"#F0F0F0", borderRadius:8, height:6, width:"100%", overflow:"hidden" }}>
      <div style={{ width:`${value}%`, background: color, height:"100%", borderRadius:8, transition:"width .5s" }} />
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ background:"#fff", border:"1px solid #EEE", borderRadius:14, padding:"16px 20px", flex:1, minWidth:130 }}>
      <div style={{ fontSize:26, fontWeight:700, color: color || "#1A1A2E" }}>{value}</div>
      <div style={{ fontSize:13, fontWeight:600, color:"#555", marginTop:2 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:"#999", marginTop:2 }}>{sub}</div>}
    </div>
  );
}

function DispatchModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ from:"Delhi", to:"Mumbai", veg:"Tomatoes", qty:"", driver:"", vehicle:"" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const handleSubmit = () => {
    if (!form.qty || !form.driver || !form.vehicle) return alert("Fill all fields");
    onAdd({
      id: "D" + String(Date.now()).slice(-4),
      from: form.from, to: form.to, veg: form.veg,
      qty: parseInt(form.qty), unit:"kg",
      status:"Loading", driver: form.driver, vehicle: form.vehicle,
      depart: new Date().toISOString().slice(0,16).replace("T"," "),
      eta: new Date(Date.now()+86400000*2).toISOString().slice(0,10)+" 18:00",
      progress: 5
    });
    onClose();
  };
  const inp = { width:"100%", padding:"9px 12px", borderRadius:8, border:"1px solid #DDD", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box", background:"#FAFAFA" };
  const lbl = { fontSize:12, fontWeight:600, color:"#666", marginBottom:4, display:"block" };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:20, padding:28, width:420, maxWidth:"95vw", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontSize:18, fontWeight:700, marginBottom:20, color:"#1A1A2E" }}>New Dispatch</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
          {[["from","From City"],["to","To City"]].map(([k,l]) => (
            <div key={k}>
              <label style={lbl}>{l}</label>
              <select style={inp} value={form[k]} onChange={set(k)}>
                {CITIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={lbl}>Vegetable</label>
          <select style={inp} value={form.veg} onChange={set("veg")}>
            {VEGETABLES.map(v=><option key={v}>{v}</option>)}
          </select>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={lbl}>Quantity (kg)</label>
          <input style={inp} type="number" placeholder="e.g. 1500" value={form.qty} onChange={set("qty")} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:22 }}>
          <div>
            <label style={lbl}>Driver Name</label>
            <input style={inp} placeholder="Full name" value={form.driver} onChange={set("driver")} />
          </div>
          <div>
            <label style={lbl}>Vehicle No.</label>
            <input style={inp} placeholder="e.g. DL-01-XX-0000" value={form.vehicle} onChange={set("vehicle")} />
          </div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:"10px", borderRadius:10, border:"1px solid #DDD", background:"#F5F5F5", cursor:"pointer", fontWeight:600, fontSize:13 }}>Cancel</button>
          <button onClick={handleSubmit} style={{ flex:2, padding:"10px", borderRadius:10, border:"none", background:"#2E7D32", color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13 }}>Dispatch</button>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({ dispatch: d, onClose, onStatusChange }) {
  const pct = (d.status==="Delivered")?100:d.progress;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:999 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", padding:"28px 28px 36px", width:"100%", maxWidth:520, boxShadow:"0 -8px 40px rgba(0,0,0,0.12)" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <div style={{ fontWeight:700, fontSize:18, color:"#1A1A2E" }}>{d.veg} · {d.qty} kg</div>
            <div style={{ fontSize:13, color:"#888", marginTop:3 }}>{d.id} · {d.from} → {d.to}</div>
          </div>
          <Badge status={d.status} />
        </div>
        <div style={{ marginBottom:18 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#888", marginBottom:6 }}>
            <span>Journey Progress</span><span style={{ fontWeight:700, color:"#333" }}>{pct}%</span>
          </div>
          <ProgressBar value={pct} status={d.status} />
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#AAA", marginTop:4 }}>
            <span>{d.from}</span><span>{d.to}</span>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
          {[["Driver", d.driver],["Vehicle", d.vehicle],["Departed", d.depart],["ETA", d.eta]].map(([l,v])=>(
            <div key={l} style={{ background:"#F8F8F8", borderRadius:10, padding:"10px 14px" }}>
              <div style={{ fontSize:11, color:"#999", marginBottom:2 }}>{l}</div>
              <div style={{ fontSize:13, fontWeight:600, color:"#333" }}>{v}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize:12, fontWeight:600, color:"#666", marginBottom:8 }}>Update Status</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {STATUSES.map(s => (
              <button key={s} onClick={() => onStatusChange(d.id, s)} style={{ padding:"7px 14px", borderRadius:20, border:`1.5px solid ${d.status===s?"#2E7D32":"#DDD"}`, background: d.status===s?"#E8F5E9":"#fff", color: d.status===s?"#2E7D32":"#555", cursor:"pointer", fontWeight:600, fontSize:12 }}>{s}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VegTrack() {
  const [dispatches, setDispatches] = useState(seed);
  const [tab, setTab] = useState("dashboard");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCat, setFilterCat] = useState("All");
  const [search, setSearch] = useState("");
  const [showDispatch, setShowDispatch] = useState(false);
  const [selected, setSelected] = useState(null);
  const [tick, setTick] = useState(0);

  // Simulate real-time progress updates
  useEffect(() => {
    const t = setInterval(() => {
      setDispatches(prev => prev.map(d =>
        d.status === "In Transit" && d.progress < 99
          ? { ...d, progress: Math.min(99, d.progress + 1) }
          : d
      ));
      setTick(n => n + 1);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const addDispatch = d => setDispatches(prev => [d, ...prev]);
  const updateStatus = (id, status) => {
    setDispatches(prev => prev.map(d => d.id===id ? { ...d, status, progress: status==="Delivered"?100:d.progress } : d));
    setSelected(sel => sel?.id===id ? { ...sel, status, progress: status==="Delivered"?100:sel.progress } : sel);
  };

  const stats = {
    total: dispatches.length,
    inTransit: dispatches.filter(d=>d.status==="In Transit").length,
    delivered: dispatches.filter(d=>d.status==="Delivered").length,
    delayed: dispatches.filter(d=>d.status==="Delayed").length,
    totalKg: dispatches.reduce((s,d)=>s+d.qty, 0),
  };

  const catData = Object.keys(CATEGORIES).map(cat => ({
    cat, count: dispatches.filter(d=>getCategory(d.veg)===cat).length,
    kg: dispatches.filter(d=>getCategory(d.veg)===cat).reduce((s,d)=>s+d.qty,0)
  }));

  const filtered = dispatches.filter(d => {
    const matchSt = filterStatus==="All" || d.status===filterStatus;
    const matchCat = filterCat==="All" || getCategory(d.veg)===filterCat;
    const matchSr = !search || d.veg.toLowerCase().includes(search.toLowerCase()) || d.from.toLowerCase().includes(search.toLowerCase()) || d.to.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase());
    return matchSt && matchCat && matchSr;
  });

  const TABS = [
    { id:"dashboard", label:"Dashboard" },
    { id:"dispatches", label:"Dispatches" },
    { id:"inventory", label:"Inventory" },
  ];

  const tabBtn = (id) => ({
    padding:"8px 18px", borderRadius:20, border:"none", cursor:"pointer", fontWeight:600, fontSize:13,
    background: tab===id ? "#2E7D32" : "transparent",
    color: tab===id ? "#fff" : "#666",
    transition:"all .2s"
  });

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:"#F4F6F0", minHeight:"100vh", color:"#1A1A2E" }}>
      {/* Header */}
      <div style={{ background:"#1A3320", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"#2E7D32", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🥦</div>
          <div>
            <div style={{ fontWeight:800, fontSize:17, color:"#fff", letterSpacing:"-0.3px" }}>VegTrack</div>
            <div style={{ fontSize:11, color:"#81C784" }}>Inter-city produce logistics</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:"#81C784", animation:"pulse 2s infinite" }} />
          <span style={{ fontSize:11, color:"#A5D6A7" }}>Live · {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E8EDE4", padding:"10px 24px", display:"flex", gap:4, alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:4 }}>
          {TABS.map(t => <button key={t.id} style={tabBtn(t.id)} onClick={()=>setTab(t.id)}>{t.label}</button>)}
        </div>
        <button onClick={() => setShowDispatch(true)} style={{ background:"#2E7D32", color:"#fff", border:"none", borderRadius:10, padding:"8px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>
          + New Dispatch
        </button>
      </div>

      <div style={{ padding:"20px 24px", maxWidth:900, margin:"0 auto" }}>

        {/* DASHBOARD TAB */}
        {tab === "dashboard" && (
          <>
            {/* Stat cards */}
            <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
              <StatCard label="Total Dispatches" value={stats.total} sub="All time" />
              <StatCard label="In Transit" value={stats.inTransit} color="#E65100" sub="Active now" />
              <StatCard label="Delivered" value={stats.delivered} color="#2E7D32" sub="Completed" />
              <StatCard label="Delayed" value={stats.delayed} color="#C62828" sub="Needs attention" />
              <StatCard label="Total Cargo" value={`${(stats.totalKg/1000).toFixed(1)}T`} color="#1565C0" sub="Kilograms" />
            </div>

            {/* Category breakdown */}
            <div style={{ background:"#fff", borderRadius:16, padding:20, marginBottom:16, border:"1px solid #E8EDE4" }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Vegetable Categories</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
                {catData.map(({ cat, count, kg }) => (
                  <div key={cat} style={{ background:"#F8FAF5", borderRadius:12, padding:"14px 16px", borderLeft:`4px solid ${CAT_COLORS[cat]}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                      <span style={{ fontWeight:700, color: CAT_COLORS[cat], fontSize:14 }}>{cat}</span>
                      <span style={{ fontSize:12, color:"#888" }}>{count} shipments</span>
                    </div>
                    <div style={{ fontSize:20, fontWeight:800, color:"#1A1A2E" }}>{kg.toLocaleString()} kg</div>
                    <div style={{ marginTop:8 }}>
                      <ProgressBar value={Math.round(kg/stats.totalKg*100)} status="In Transit" />
                    </div>
                    <div style={{ fontSize:11, color:"#AAA", marginTop:4 }}>{Math.round(kg/stats.totalKg*100)}% of total volume</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live feed */}
            <div style={{ background:"#fff", borderRadius:16, padding:20, border:"1px solid #E8EDE4" }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                Live Activity Feed
                <span style={{ fontSize:11, color:"#888", fontWeight:400 }}>Auto-updating</span>
              </div>
              {dispatches.filter(d=>d.status==="In Transit").slice(0,4).map(d => (
                <div key={d.id} onClick={() => setSelected(d)} style={{ display:"flex", gap:14, alignItems:"center", padding:"10px 0", borderBottom:"1px solid #F0F0F0", cursor:"pointer" }}>
                  <div style={{ width:44, height:44, borderRadius:12, background: CAT_COLORS[getCategory(d.veg)]+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                    🚛
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{d.veg} · {d.qty}kg</div>
                    <div style={{ fontSize:12, color:"#888" }}>{d.from} → {d.to}</div>
                    <div style={{ marginTop:6 }}><ProgressBar value={d.progress} status={d.status} /></div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontWeight:700, fontSize:14, color:"#FB8C00" }}>{d.progress}%</div>
                    <div style={{ fontSize:11, color:"#AAA" }}>ETA {d.eta.slice(11)}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* DISPATCHES TAB */}
        {tab === "dispatches" && (
          <>
            {/* Filters */}
            <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by veg, city, ID…" style={{ flex:1, minWidth:180, padding:"9px 14px", borderRadius:10, border:"1px solid #DDD", fontSize:13, fontFamily:"inherit", outline:"none", background:"#fff" }} />
              <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ padding:"9px 12px", borderRadius:10, border:"1px solid #DDD", fontSize:13, fontFamily:"inherit", background:"#fff", outline:"none" }}>
                <option>All</option>
                {STATUSES.map(s=><option key={s}>{s}</option>)}
              </select>
              <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{ padding:"9px 12px", borderRadius:10, border:"1px solid #DDD", fontSize:13, fontFamily:"inherit", background:"#fff", outline:"none" }}>
                <option>All</option>
                {Object.keys(CATEGORIES).map(c=><option key={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ fontSize:12, color:"#888", marginBottom:10 }}>{filtered.length} dispatches</div>

            {/* List */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {filtered.map(d => (
                <div key={d.id} onClick={()=>setSelected(d)} style={{ background:"#fff", borderRadius:14, padding:"14px 18px", border:"1px solid #E8EDE4", cursor:"pointer", transition:"box-shadow .15s" }}
                  onMouseOver={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)"}
                  onMouseOut={e=>e.currentTarget.style.boxShadow="none"}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ fontWeight:800, fontSize:13, color:"#2E7D32" }}>{d.id}</span>
                      <CatBadge veg={d.veg} />
                    </div>
                    <Badge status={d.status} />
                  </div>
                  <div style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>{d.veg} <span style={{ color:"#888", fontWeight:400, fontSize:14 }}>· {d.qty.toLocaleString()} kg</span></div>
                  <div style={{ fontSize:13, color:"#666", marginBottom:10 }}>{d.from} <span style={{ color:"#BBB" }}>→</span> {d.to} · Driver: {d.driver}</div>
                  <ProgressBar value={d.status==="Delivered"?100:d.progress} status={d.status} />
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"#AAA", marginTop:5 }}>
                    <span>Departed: {d.depart}</span>
                    <span>ETA: {d.eta}</span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ textAlign:"center", padding:"40px 0", color:"#BBB", fontSize:14 }}>No dispatches found</div>
              )}
            </div>
          </>
        )}

        {/* INVENTORY TAB */}
        {tab === "inventory" && (
          <>
            <div style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Inventory by Vegetable</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px,1fr))", gap:12 }}>
              {VEGETABLES.map(veg => {
                const vegDisp = dispatches.filter(d=>d.veg===veg);
                const totalKg = vegDisp.reduce((s,d)=>s+d.qty,0);
                const inTransit = vegDisp.filter(d=>d.status==="In Transit").reduce((s,d)=>s+d.qty,0);
                const delivered = vegDisp.filter(d=>d.status==="Delivered").reduce((s,d)=>s+d.qty,0);
                const cat = getCategory(veg);
                if (!totalKg) return null;
                return (
                  <div key={veg} style={{ background:"#fff", borderRadius:14, padding:"14px 16px", border:"1px solid #E8EDE4" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <span style={{ fontWeight:700, fontSize:14 }}>{veg}</span>
                      <CatBadge veg={veg} />
                    </div>
                    <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>{totalKg.toLocaleString()}<span style={{ fontSize:12, color:"#AAA", fontWeight:400 }}> kg</span></div>
                    <div style={{ fontSize:12, color:"#666", marginBottom:10 }}>{vegDisp.length} shipment{vegDisp.length!==1?"s":""}</div>
                    <div style={{ display:"flex", gap:8, fontSize:11, flexWrap:"wrap" }}>
                      {inTransit>0 && <span style={{ color:"#E65100", fontWeight:600 }}>🚛 {inTransit}kg moving</span>}
                      {delivered>0 && <span style={{ color:"#2E7D32", fontWeight:600 }}>✓ {delivered}kg done</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop:20, background:"#fff", borderRadius:16, padding:20, border:"1px solid #E8EDE4" }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>City-wise Inventory Flow</div>
              {CITIES.filter(city => dispatches.some(d=>d.from===city||d.to===city)).map(city => {
                const outKg = dispatches.filter(d=>d.from===city).reduce((s,d)=>s+d.qty,0);
                const inKg  = dispatches.filter(d=>d.to===city).reduce((s,d)=>s+d.qty,0);
                return (
                  <div key={city} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
                    <div style={{ width:90, fontWeight:600, fontSize:13 }}>{city}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                        <span style={{ fontSize:11, color:"#E65100", width:60, textAlign:"right" }}>{outKg.toLocaleString()}kg↗</span>
                        <div style={{ flex:1, height:8, borderRadius:4, background:"#FFF3E0", overflow:"hidden" }}>
                          <div style={{ width:`${Math.min(100,outKg/100)}%`, background:"#FB8C00", height:"100%", borderRadius:4 }} />
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:4, alignItems:"center", marginTop:4 }}>
                        <span style={{ fontSize:11, color:"#2E7D32", width:60, textAlign:"right" }}>{inKg.toLocaleString()}kg↙</span>
                        <div style={{ flex:1, height:8, borderRadius:4, background:"#E8F5E9", overflow:"hidden" }}>
                          <div style={{ width:`${Math.min(100,inKg/100)}%`, background:"#43A047", height:"100%", borderRadius:4 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {showDispatch && <DispatchModal onClose={()=>setShowDispatch(false)} onAdd={addDispatch} />}
      {selected && <DetailPanel dispatch={selected} onClose={()=>setSelected(null)} onStatusChange={updateStatus} />}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 2px; }
      `}</style>
    </div>
  );
}