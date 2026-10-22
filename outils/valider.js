#!/usr/bin/env node
// Vérifie qu'un module respecte le format attendu par app/index.html
const fs=require("fs"),path=require("path");
const GENS=["convBin","convTriple","bitop","subnet","cidr","decoupe","ipv4","paquet","qcm"];
const BLOCKS=["p","h3","pre","note","table"];
let fail=0;
const files=process.argv.slice(2);
if(!files.length){console.error("usage: node outils/valider.js modules/n0-1.json [...]");process.exit(2);}
for(const f of files){
  const err=[],warn=[];
  let m;
  try{m=JSON.parse(fs.readFileSync(f,"utf8"));}catch(e){console.error(`✗ ${f} — JSON invalide : ${e.message}`);fail++;continue;}
  const want=path.basename(f,".json");
  if(m.id!==want) err.push(`id "${m.id}" ≠ nom de fichier "${want}"`);
  ["id","level","title","why","sections","qcm"].forEach(k=>{if(m[k]===undefined)err.push(`champ manquant : ${k}`);});
  if(!Array.isArray(m.sections)||m.sections.length<4) err.push(`${(m.sections||[]).length} sections — minimum 4`);
  (m.sections||[]).forEach((s,i)=>{
    if(!s.title) err.push(`section ${i+1} sans titre`);
    (s.blocks||[]).forEach((b,j)=>{
      if(!BLOCKS.includes(b.t)) err.push(`section ${i+1} bloc ${j+1} : type "${b.t}" inconnu`);
      if(b.t==="table"&&(!b.head||!b.rows)) err.push(`section ${i+1} bloc ${j+1} : table sans head/rows`);
      if(b.t==="table"&&b.rows) b.rows.forEach((r,k)=>{if(r.length!==b.head.length)err.push(`section ${i+1} table ligne ${k+1} : ${r.length} cellules pour ${b.head.length} colonnes`);});
    });
    const words=(s.blocks||[]).filter(b=>b.t==="p").map(b=>b.v).join(" ").split(/\s+/).length;
    if(words<250) warn.push(`section ${i+1} "${s.title}" : ~${words} mots de prose (cible 400+)`);
    if(s.exercise&&!GENS.includes(s.exercise.gen)) err.push(`section ${i+1} : générateur "${s.exercise.gen}" inconnu`);
  });
  const withEx=(m.sections||[]).filter(s=>s.exercise).length;
  if(withEx*2<(m.sections||[]).length) warn.push(`${withEx} exercices pour ${(m.sections||[]).length} sections (cible : la moitié)`);
  if(!Array.isArray(m.qcm)||m.qcm.length<5) err.push(`${(m.qcm||[]).length} questions de QCM — minimum 5`);
  (m.qcm||[]).forEach((q,i)=>{
    if(!q.q||!q.o||q.a===undefined||!q.w) err.push(`qcm ${i+1} : champ manquant (q/o/a/w)`);
    if(q.o&&q.o.length!==4) err.push(`qcm ${i+1} : ${q.o.length} options, il en faut 4`);
    if(q.a!==undefined&&(q.a<0||q.a>3)) err.push(`qcm ${i+1} : index de réponse hors bornes`);
    if(q.w&&q.w.split(/\s+/).length<25) warn.push(`qcm ${i+1} : correction très courte`);
  });

  /* cartes de révision : [{r, v}] — recto, verso */
  if(!Array.isArray(m.cartes)||!m.cartes.length) warn.push(`aucune carte de révision (champ "cartes", cible : 12 à 16)`);
  else{
    if(m.cartes.length<10) warn.push(`${m.cartes.length} cartes — cible : 12 à 16`);
    m.cartes.forEach((c,i)=>{ if(!c.r||!c.v) err.push(`carte ${i+1} : il faut un recto "r" et un verso "v"`); });
  }
  /* questions d'examen de niveau : même format que le QCM, jamais montrées dans le module */
  if(!Array.isArray(m.examen)||!m.examen.length) warn.push(`aucune question d'examen de niveau (champ "examen", cible : 5 à 6)`);
  else{
    const dejaVues=new Set((m.qcm||[]).map(q=>q.q.trim()));
    m.examen.forEach((q,i)=>{
      if(!q.q||!q.o||q.a===undefined||!q.w) err.push(`examen ${i+1} : champ manquant (q/o/a/w)`);
      if(q.o&&q.o.length!==4) err.push(`examen ${i+1} : ${q.o.length} options, il en faut 4`);
      if(q.a!==undefined&&(q.a<0||q.a>3)) err.push(`examen ${i+1} : index de réponse hors bornes`);
      if(q.q&&dejaVues.has(q.q.trim())) err.push(`examen ${i+1} : question identique à une question du QCM du module`);
    });
  }
  if(err.length){fail++;console.log(`✗ ${f}`);err.forEach(e=>console.log(`    ERREUR  ${e}`));}
  else console.log(`✓ ${f}`);
  warn.forEach(w=>console.log(`    alerte  ${w}`));
}
process.exit(fail?1:0);
