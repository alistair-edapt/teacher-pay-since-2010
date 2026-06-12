import { useState, useMemo } from "react";
import { Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, Legend, ComposedChart, ReferenceLine } from "recharts";

/* ═══ PAY DATA — [M1,M2,M3,M4,M5,M6,U1,U2,U3] — yr 26 = 3.5% award; yr 27 = 2.5% placeholder ═══ */
const _R={
"RoE":{10:[21588,23295,25168,27104,29240,31552,34181,35447,36756],11:[21588,23295,25168,27104,29240,31552,34181,35447,36756],12:[21588,23295,25168,27104,29240,31552,34181,35447,36756],13:[21804,23528,25420,27375,29532,31868,34523,35801,37124],14:[22023,23763,25674,27649,29828,32187,34868,36159,37495],15:[22244,24001,25931,27925,30126,32509,35217,36521,37870],16:[22467,24241,26190,28204,30427,32834,35569,36886,38249],17:[22917,24484,26452,28487,30732,33162,35925,37255,38631],18:[23720,25594,27188,29114,31234,33825,36644,38000,39404],19:[24373,26298,27936,29915,32093,34756,37652,39045,40488],20:[25714,27600,29664,31604,33160,35711,38690,40124,41604],21:[25714,27600,29664,31604,33160,35711,38690,40124,41604],22:[28000,29800,31750,33850,35990,38810,40625,42131,43685],23:[30000,31737,33814,36050,38329,41333,43266,44870,46525],24:[31650,33483,35674,38034,40439,43607,45646,47338,49084],25:[32916,34823,37101,39556,42057,45352,47472,49232,51048],26:[34068,36042,38400,40940,43529,46939,49134,50955,52835],27:[34920,36943,39360,41964,44617,48113,50362,52229,54156]},
"Fringe":{10:[22626,24331,26203,28146,30278,32588,35116,36397,37725],11:[22626,24331,26203,28146,30278,32588,35116,36397,37725],12:[22626,24331,26203,28146,30278,32588,35116,36397,37725],13:[22852,24574,26465,28427,30581,32914,35467,36761,38102],14:[23081,24820,26730,28712,30887,33243,35822,37129,38483],15:[23312,25068,26997,28999,31196,33575,36180,37500,38868],16:[23545,25319,27267,29289,31508,33911,36542,37875,39257],17:[24016,25572,27540,29582,31823,34250,36907,38254,39650],18:[24857,26359,28062,30174,32300,34935,37645,39019,40443],19:[25541,27084,28834,31003,33189,35896,38681,40092,41555],20:[26948,28467,30630,32773,34367,36883,39745,41195,42698],21:[26948,28467,30630,32773,34367,36883,39745,41195,42698],22:[29344,31126,33055,35151,37264,40083,41858,43360,44919],23:[31252,33149,35204,37436,39686,42688,44579,46178,47839],24:[33075,34974,37141,39495,41870,45037,47031,48719,50471],25:[34398,36373,38627,41075,43545,46839,48913,50668,52490],26:[35602,37646,39979,42513,45069,48478,50625,52441,54327],27:[36492,38587,40978,43576,46196,49690,51891,53752,55685]},
"OLon":{10:[25117,26674,28325,30080,31868,34181,37461,38857,40285],11:[25117,26674,28325,30080,31868,34181,37461,38857,40285],12:[25117,26674,28325,30080,31868,34181,37461,38857,40285],13:[25368,26941,28608,30381,32187,34523,37836,39246,40688],14:[25622,27210,28894,30685,32509,34868,38214,39638,41095],15:[25878,27482,29183,30992,32834,35217,38596,40034,41506],16:[26137,27757,29475,31302,33162,35569,38982,40435,41921],17:[26660,28035,29770,31615,33494,35925,39372,40839,42340],18:[27593,28916,30366,32247,34024,36644,40159,41656,43187],19:[28352,29711,31201,33134,34960,37652,41264,42802,44375],20:[29911,31196,33168,34848,36173,38688,42399,43979,45596],21:[29911,31196,33168,34848,36173,38688,42399,43979,45596],22:[32407,34103,35886,37763,40050,43193,44687,46340,48055],23:[34513,36320,38219,40218,42653,46001,47592,49352,51179],24:[36413,38318,40322,42430,45000,48532,50210,52068,53994],25:[37870,39851,41935,44128,46800,50474,52219,54151,56154],26:[39195,41246,43403,45672,48438,52241,54047,56046,58119],27:[40175,42277,44488,46814,49649,53547,55398,57447,59572]},
"ILon":{10:[27000,28226,29535,31446,33865,36387,41497,42898,44360],11:[27000,28226,29535,31446,33865,36387,41497,42898,44360],12:[27000,28226,29535,31446,33865,36387,41497,42898,44360],13:[27270,28508,29830,31760,34204,36751,41912,43327,44804],14:[27543,28793,30129,32078,34546,37119,42331,43760,45252],15:[27818,29081,30430,32399,34891,37490,42754,44198,45705],16:[28096,29372,30734,32723,35240,37865,43182,44640,46162],17:[28658,29666,31041,33050,35592,38244,43614,45086,46624],18:[29664,30586,31702,33712,36146,39009,44486,45988,47557],19:[30480,31427,32573,34639,37140,40082,45710,47253,48865],20:[32157,33238,34564,36457,38363,41184,46967,48552,50211],21:[32157,33238,34564,36457,38363,41184,46967,48552,50211],22:[34502,36141,37857,39655,41892,44756,49320,51743,53482],23:[36745,38490,40318,42233,44615,47665,52526,55106,56958],24:[38766,40609,42536,44556,47069,50288,55415,58138,60092],25:[40317,42234,44238,46339,48952,52300,57632,60464,62496],26:[41728,43712,45786,47961,50665,54130,59649,62580,64683],27:[42771,44805,46931,49160,51932,55483,61140,64145,66300]}};
const PROJ_START=2026;
const RKEYS=["RoE","Fringe","OLon","ILon"];
const RNAMES={"RoE":"Rest of England","Fringe":"London Fringe","OLon":"Outer London","ILon":"Inner London"};
const PPS=["M1","M2","M3","M4","M5","M6","U1","U2","U3"];
const PP_L={M1:"M1 – Starting salary",M2:"M2",M3:"M3",M4:"M4",M5:"M5",M6:"M6 – Top of main scale",U1:"U1 – Upper pay scale",U2:"U2",U3:"U3 – Top of upper scale"};
function gp(rk,yr,pi){return _R[rk][yr][pi];}
const YRS=Array.from({length:18},(_,i)=>2010+i);
const YK=y=>y-2000;
const INF={C:{10:1,11:1.052,12:1.075,13:1.104,14:1.117,15:1.116,16:1.127,17:1.161,18:1.189,19:1.209,20:1.215,21:1.253,22:1.379,23:1.472,24:1.497,25:1.548,26:1.596,27:1.636},R:{10:1,11:1.056,12:1.083,13:1.118,14:1.144,15:1.153,16:1.176,17:1.222,18:1.262,19:1.293,20:1.307,21:1.371,22:1.544,23:1.681,24:1.726,25:1.795,26:1.867,27:1.932}};
const CPI_Y={10:0,11:5.2,12:2.2,13:2.7,14:1.2,15:-0.1,16:1.0,17:3.0,18:2.4,19:1.7,20:0.5,21:3.1,22:10.1,23:6.7,24:1.7,25:3.4,26:3.1,27:2.5};
const RPI_Y={10:0,11:5.6,12:2.6,13:3.2,14:2.3,15:0.8,16:2.0,17:3.9,18:3.3,19:2.4,20:1.1,21:4.9,22:12.6,23:8.9,24:2.7,25:4.0,26:4.0,27:3.5};
const GOV=[{s:2010,e:2015,l:"Coalition",c:"#2E8B57"},{s:2015,e:2024,l:"Conservative",c:"#0087DC"},{s:2024,e:2029,l:"Labour",c:"#DC241F"}];

const INK="#151F3B",GOLD="#FED02F",GREEN="#047857",RED="#b91c1c";
const fmt=v=>"£"+Math.round(v).toLocaleString("en-GB");
const fmtK=v=>"£"+(v/1000).toFixed(0)+"k";
const pc=v=>(v>=0?"+":"")+v.toFixed(1)+"%";
const SER="Georgia, 'Times New Roman', serif";
const S="system-ui,-apple-system,sans-serif";
function takeHome(gross){
  let t=0;if(gross>12570){t=gross<=50270?(gross-12570)*.2:(50270-12570)*.2+(gross-50270)*.4;}
  let n=0;if(gross>12570){n=gross<=50270?(gross-12570)*.08:(50270-12570)*.08+(gross-50270)*.02;}
  return(gross-t-n)/12;
}

const Btn=({a,onClick,children})=><button onClick={onClick} style={{padding:"7px 13px",borderRadius:4,fontSize:13,fontWeight:a?600:400,border:a?`1.5px solid ${INK}`:"1px solid #d1d5db",background:a?INK:"#fff",color:a?"#fff":"#4b5563",cursor:"pointer",whiteSpace:"nowrap"}}>{children}</button>;
const Tog=({a,onClick,children})=><button onClick={onClick} style={{padding:"6px 11px",borderRadius:4,fontSize:12,fontWeight:a?600:400,border:a?`1.5px solid ${INK}`:"1px solid #d1d5db",background:a?"#f1f3f7":"#fff",color:a?INK:"#9ca3af",cursor:"pointer"}}>{children}</button>;
const Lab=({children})=><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:"#9ca3af",marginBottom:5}}>{children}</div>;
const Src=({children})=><div style={{fontSize:9,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".05em",padding:"8px 14px 6px",borderTop:"1px solid #f3f4f6"}}>{children}</div>;
const GovLeg=()=><div style={{display:"flex",justifyContent:"center",gap:16,padding:"4px 0 8px",flexWrap:"wrap"}}>{GOV.map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:10}}><div style={{width:9,height:9,borderRadius:2,background:p.c,opacity:.3}}/><span style={{color:"#6b7280"}}>{p.l}</span></div>)}</div>;

const PayTip=({active,payload,label,sB,iT,rk,pp,sy})=>{
  if(!active||!payload?.length)return null;
  const ac=payload.find(p=>p.dataKey==="actual")?.value;
  const cA=payload.find(p=>p.dataKey==="cpi")?.value;
  const rA=payload.find(p=>p.dataKey==="rpi")?.value;
  const iA=payload.find(p=>p.dataKey==="inf")?.value;
  const yk=YK(label),pyk=YK(label-1),pi=PPS.indexOf(pp);
  const prev=pyk>=10?gp(rk,pyk,pi):null;
  const yoy=prev?((ac/prev-1)*100):null;
  const cR=CPI_Y[yk]||0,rR=RPI_Y[yk]||0;
  return(<div style={{background:"#fff",border:`1.5px solid ${INK}`,borderRadius:6,padding:"12px 14px",fontSize:12,lineHeight:1.7,boxShadow:"0 4px 16px rgba(21,31,59,.15)",maxWidth:280,fontFamily:S}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
      <div style={{fontWeight:700,fontSize:14,fontFamily:SER,color:INK}}>September {label}</div>
      {label>=PROJ_START&&<span style={{fontSize:9,background:GOLD,color:INK,padding:"2px 6px",borderRadius:3,fontWeight:700}}>PROJECTED</span>}
    </div>
    <div style={{display:"flex",justifyContent:"space-between"}}><span>Pay</span><span style={{fontWeight:700}}>{fmt(ac)}</span></div>
    {yoy!==null&&label>sy&&<div style={{background:"#f8f9fb",borderRadius:4,padding:"6px 9px",margin:"6px 0",fontSize:11}}>
      {[["Pay rise",yoy,1],["CPI inflation",cR],["RPI inflation",rR]].map(([n,v,b],j)=><div key={j} style={{display:"flex",justifyContent:"space-between"}}><span>{n}</span><span style={{fontWeight:b?700:400,color:b?(v>0?GREEN:RED):"#6b7280"}}>{pc(v)}</span></div>)}
      <div style={{borderTop:"1px solid #e5e7eb",marginTop:4,paddingTop:4}}>
        {[["vs CPI",yoy-cR],["vs RPI",yoy-rR]].map(([n,v],j)=><div key={j} style={{display:"flex",justifyContent:"space-between"}}><span>{n}</span><span style={{fontWeight:700,color:v>=0?GREEN:RED}}>{pc(v)}</span></div>)}
      </div></div>}
    {sB&&cA&&[["CPI-matched",cA],["RPI-matched",rA]].map(([n,v],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#6b7280"}}><span>{n}</span><span style={{fontWeight:600}}>{fmt(v)}</span></div>)}
    {!sB&&iA&&<div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#6b7280"}}><span>{iT}-matched</span><span style={{fontWeight:600}}>{fmt(iA)}</span></div>}
  </div>);
};

export default function App(){
  const[rk,setRk]=useState("RoE");
  const[pp,setPP]=useState("M6");
  const[iT,setIT]=useState("CPI");
  const[sB,setSB]=useState(false);
  const[sG,setSG]=useState(true);
  const[sy,setSY]=useState(2010);
  const[ey,setEY]=useState(2025);
  const[sProj,setSProj]=useState(false);
  const maxY=sProj?2027:2025;

  const yrs=useMemo(()=>YRS.filter(y=>y>=sy&&y<=ey&&y<=maxY),[sy,ey,maxY]);
  const pi=PPS.indexOf(pp);
  const cD=useMemo(()=>{const bv=gp(rk,YK(sy),pi);const cB=INF.C[YK(sy)],rB=INF.R[YK(sy)];const IM={CPI:INF.C,RPI:INF.R};const iB=IM[iT][YK(sy)];return yrs.map(y=>{const yk=YK(y);return{year:y,actual:gp(rk,yk,pi),inf:bv*(IM[iT][yk]/iB),cpi:bv*(INF.C[yk]/cB),rpi:bv*(INF.R[yk]/rB)};});},[rk,pi,iT,sy,ey,yrs]);
  const st=useMemo(()=>{const f=cD[0],l=cD[cD.length-1];const nP=(l.actual/f.actual-1)*100,cP=(l.actual/l.cpi-1)*100,rP=(l.actual/l.rpi-1)*100;return{nP,cP,rP,ac:l.actual,f:f.actual,cT:l.cpi,rT:l.rpi,aCG:l.cpi-l.actual,aRG:l.rpi-l.actual,mA:takeHome(l.actual),mC:takeHome(l.cpi),mR:takeHome(l.rpi)};},[cD]);
  const[yMn,yMx]=useMemo(()=>{const v=cD.flatMap(d=>[d.actual,d.cpi,d.rpi]);return[Math.floor(Math.min(...v)/2000)*2000,Math.ceil(Math.max(...v)/2000)*2000+2000];},[cD]);
  const gvF=useMemo(()=>GOV.filter(p=>p.s<ey+.5&&p.e>sy),[sy,ey]);

  return(<div style={{fontFamily:S,maxWidth:880,margin:"0 auto",padding:"20px 16px 36px",color:INK,background:"#fff"}}>
    <div style={{borderBottom:`1px solid ${INK}`,paddingBottom:10,marginBottom:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:4}}>
        <div style={{fontFamily:SER,fontSize:19,fontWeight:700}}>Teacher Pay in England</div>
        <div style={{fontSize:10,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".08em"}}>Edapt analysis</div>
      </div>
    </div>

    <div style={{marginBottom:18,paddingBottom:14,borderBottom:`3px solid ${INK}`}}>
      <div style={{fontFamily:SER,fontSize:"clamp(22px, 5vw, 30px)",fontWeight:700,lineHeight:1.15}}>Has pay kept up with inflation?</div>
      <div style={{fontSize:14,color:"#4b5563",marginTop:8,lineHeight:1.55,maxWidth:620}}>The solid line is actual pay. The dashed line shows where pay would be if it had risen in line with inflation. Switch between CPI and RPI to see how the verdict changes.</div>
    </div>

    <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:12}}>
      <div><Lab>Region</Lab><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{RKEYS.map(r=><Btn key={r} a={rk===r} onClick={()=>setRk(r)}>{RNAMES[r]}</Btn>)}</div></div>
      <div style={{flex:"1 1 180px"}}><Lab>Pay point</Lab><select value={pp} onChange={e=>setPP(e.target.value)} style={{padding:"8px 12px",borderRadius:4,border:"1px solid #d1d5db",fontSize:13,background:"#fff",cursor:"pointer",width:"100%",maxWidth:240}}>{PPS.map(p=><option key={p} value={p}>{p} — {PP_L[p]}</option>)}</select></div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,flexWrap:"wrap"}}>
      <Lab>Inflation measure</Lab>
      <Tog a={!sB&&iT==="CPI"} onClick={()=>{setIT("CPI");setSB(false);}}>CPI</Tog>
      <Tog a={!sB&&iT==="RPI"} onClick={()=>{setIT("RPI");setSB(false);}}>RPI</Tog>
      <Tog a={sB} onClick={()=>setSB(b=>!b)}>Both</Tog>
      <div style={{width:1,height:18,background:"#e5e7eb"}}/>
      <Tog a={sG} onClick={()=>setSG(v=>!v)}>Governments</Tog>
      <Tog a={sProj} onClick={()=>{setSProj(v=>{if(!v)setEY(2027);else if(ey>2025)setEY(2025);return!v;});}}>Project to 2027</Tog>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:14,flexWrap:"wrap"}}>
      <Lab>Years</Lab>
      <select value={sy} onChange={e=>{const v=+e.target.value;setSY(v);if(v>=ey)setEY(Math.min(v+1,maxY));}} style={{padding:"5px 8px",borderRadius:4,border:"1px solid #d1d5db",fontSize:12}}>{YRS.filter(y=>y<maxY).map(y=><option key={y}>{y}</option>)}</select>
      <span style={{color:"#9ca3af",fontSize:12}}>to</span>
      <select value={Math.min(ey,maxY)} onChange={e=>{const v=+e.target.value;setEY(v);if(v<=sy)setSY(Math.max(v-1,2010));}} style={{padding:"5px 8px",borderRadius:4,border:"1px solid #d1d5db",fontSize:12}}>{YRS.filter(y=>y>sy&&y<=maxY).map(y=><option key={y}>{y}</option>)}</select>
      {[[2010,2015,"Coalition"],[2015,2024,"Conservative"],[2024,maxY,"Labour"],[2010,maxY,"All"]].map(([s,e,l])=>
        <button key={l} style={{padding:"4px 8px",borderRadius:4,fontSize:11,fontWeight:sy===s&&ey===e?700:400,border:sy===s&&ey===e?`1.5px solid ${INK}`:"1px solid #d1d5db",background:sy===s&&ey===e?"#f1f3f7":"#fff",color:sy===s&&ey===e?INK:"#6b7280",cursor:"pointer"}} onClick={()=>{setSY(s);setEY(e);}}>{l}</button>
      )}
    </div>

    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))",border:"1px solid #e5e7eb",borderRadius:8,overflow:"hidden",marginBottom:14}}>
      <div style={{padding:"10px 14px",borderRight:"1px solid #e5e7eb",borderBottom:"1px solid #e5e7eb"}}><Lab>Pay rise in cash</Lab><div style={{fontFamily:SER,fontSize:21,fontWeight:700}}>+{st.nP.toFixed(1)}%</div><div style={{fontSize:10,color:"#6b7280"}}>{fmt(st.f)} → {fmt(st.ac)}</div></div>
      <div style={{padding:"10px 14px",borderRight:"1px solid #e5e7eb",borderBottom:"1px solid #e5e7eb"}}><Lab>After inflation · CPI</Lab><div style={{fontFamily:SER,fontSize:21,fontWeight:700,color:st.cP>=0?GREEN:RED}}>{pc(st.cP)}</div><div style={{fontSize:10,color:"#6b7280"}}>{fmt(st.cT)} if CPI-matched</div></div>
      <div style={{padding:"10px 14px",borderBottom:"1px solid #e5e7eb"}}><Lab>After inflation · RPI</Lab><div style={{fontFamily:SER,fontSize:21,fontWeight:700,color:st.rP>=0?GREEN:RED}}>{pc(st.rP)}</div><div style={{fontSize:10,color:"#6b7280"}}>{fmt(st.rT)} if RPI-matched</div></div>
    </div>

    <div style={{border:"1px solid #e5e7eb",borderRadius:8,overflow:"hidden",marginBottom:14}}>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={cD} margin={{top:16,right:14,bottom:4,left:0}}>
          <defs><linearGradient id="gF" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={RED} stopOpacity={.1}/><stop offset="100%" stopColor={RED} stopOpacity={.02}/></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
          {sG&&gvF.map((p,i)=><ReferenceArea key={i} x1={Math.max(p.s,sy)} x2={Math.min(p.e,Math.min(ey,maxY))} fill={p.c} fillOpacity={.06}/>)}
          <XAxis dataKey="year" type="number" domain={[sy,Math.min(ey,maxY)]} ticks={yrs} tick={{fontSize:10,fontWeight:600}} tickFormatter={v=>"'"+String(v).slice(-2)} stroke="#d1d5db"/>
          <YAxis domain={[yMn,yMx]} tick={{fontSize:10}} tickFormatter={fmtK} stroke="#d1d5db" width={42}/>
          <Tooltip content={<PayTip sB={sB} iT={iT} rk={rk} pp={pp} sy={sy}/>}/>
          {sProj&&ey>2025&&<ReferenceLine x={2025.5} stroke="#d97706" strokeWidth={1.5} strokeDasharray="4 4"/>}
          {!sB&&<Area type="monotone" dataKey="inf" stroke="none" fill="url(#gF)" isAnimationActive={false}/>}
          {sB&&<Line type="monotone" dataKey="cpi" stroke={GREEN} strokeWidth={2} strokeDasharray="6 3" dot={false} name="If matched CPI" isAnimationActive={false}/>}
          {sB&&<Line type="monotone" dataKey="rpi" stroke={RED} strokeWidth={2} strokeDasharray="6 3" dot={false} name="If matched RPI" isAnimationActive={false}/>}
          {!sB&&<Line type="monotone" dataKey="inf" stroke={RED} strokeWidth={2} strokeDasharray="6 3" dot={false} name={`If matched ${iT}`} isAnimationActive={false}/>}
          <Line type="monotone" dataKey="actual" stroke={INK} strokeWidth={2.5} dot={{r:2.5,fill:INK,stroke:"#fff",strokeWidth:1.5}} activeDot={{r:5}} name="Actual pay" isAnimationActive={false}/>
          <Legend verticalAlign="bottom" height={30} wrapperStyle={{fontSize:11}}/>
        </ComposedChart>
      </ResponsiveContainer>
      {sG&&<GovLeg/>}
      <Src>Source: STPCD; ONS September CPI/RPI · Edapt analysis{sProj?" · 2026–27 projected (BoE Apr 2026)":""}</Src>
    </div>

    <div style={{border:"1px solid #e5e7eb",borderRadius:8,padding:"12px 16px",marginBottom:10}}>
      <div style={{fontFamily:SER,fontSize:15,fontWeight:700,marginBottom:6}}>In your pocket: the monthly difference</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))",gap:12,fontSize:12.5,lineHeight:1.6}}>
        {[["CPI",st.cT,st.aCG,st.mC],["RPI",st.rT,st.aRG,st.mR]].map(([n,target,gap,mTg],i)=>
          <div key={i} style={{color:"#374151"}}>
            {gap>0
              ?<>If pay had matched {n} inflation since {sy}, this salary would now be <strong>{fmt(target)}</strong>. A teacher on this pay point would have an extra <strong style={{color:GREEN}}>{fmt(Math.abs(mTg-st.mA))} per month</strong> after tax (<strong style={{color:GREEN}}>{fmt(Math.abs(gap))} per year</strong> before tax).</>
              :<>Pay on this point has outpaced {n} inflation since {sy}. A teacher here earns <strong style={{color:GREEN}}>{fmt(Math.abs(mTg-st.mA))} more per month</strong> after tax than if pay had only matched {n} (<strong style={{color:GREEN}}>{fmt(Math.abs(gap))}/year</strong> before tax).</>}
          </div>
        )}
      </div>
      <div style={{fontSize:10,color:"#9ca3af",marginTop:8}}>After-tax figures use 2025/26 income tax and National Insurance rates only (pension contributions not included here).</div>
    </div>
    <p style={{fontSize:12,color:"#6b7280",lineHeight:1.6,margin:0}}><strong>CPI</strong> leaves out most housing costs (the Government's preferred measure). <strong>RPI</strong> includes mortgage interest and runs higher (preferred by unions; lost official "National Statistic" status in 2013). Both shown so you can judge.</p>
  </div>);
}
