#!/usr/bin/env node
// Vérifie qu'un module respecte le format attendu par app/index.html
const fs=require("fs"),path=require("path");
const GENS=["convBin","convTriple","bitop","subnet","cidr","decoupe","ipv4","paquet","qcm"];
const BLOCKS=["p","h3","pre","note","table"];
/* ---------- format 2 : parties → étapes, une idée par étape ----------
   Règle centrale (principe 5 du cahier des charges) : une épreuve d'évaluation, une carte
   ou une question d'examen ne peut porter que sur une notion pratiquée dans une étape. */
const ACTS=["bits","ordre","trous","choix"];
const ACT_GENS={trous:["decompo10","suiteBinaire","poids"],ordre:[]};
const mots=t=>String(t||"").replace(/<[^>]+>/g," ").split(/\s+/).filter(w=>/[\p{L}\p{N}]/u.test(w)).length;
function verifActivite(a,ou,err){
  if(!ACTS.includes(a.type)){err.push(`${ou} : type d'activité "${a.type}" inconnu (${ACTS.join(", ")})`);return;}
  if(a.type==="bits"){
    if(!["fabriquer","lire"].includes(a.mode)) err.push(`${ou} : bits sans mode "fabriquer" ou "lire"`);
    const v=a.mode==="lire"?a.valeur:a.cible;
    if(v!=="aleatoire"&&!(Number.isInteger(v)&&v>=0&&v<=255)) err.push(`${ou} : bits — ${a.mode==="lire"?"valeur":"cible"} doit être un entier de 0 à 255 ou "aleatoire"`);
  }
  if(a.type==="ordre"||a.type==="trous"){
    if(a.gen){ if(!(ACT_GENS[a.type]||[]).includes(a.gen)) err.push(`${ou} : générateur "${a.gen}" inconnu pour ${a.type}`); }
    else if(a.type==="ordre"&&!(Array.isArray(a.items)&&a.items.length>=3)) err.push(`${ou} : ordre sans au moins 3 items`);
    else if(a.type==="trous"&&!/\{\{.+?\}\}/.test(a.texte||"")) err.push(`${ou} : trous sans case {{réponse}}`);
  }
  if(a.type==="choix"){
    if(!a.q||!a.o||a.a===undefined||!a.w) err.push(`${ou} : choix incomplet (q/o/a/w)`);
    else{
      if(a.o.length!==4) err.push(`${ou} : ${a.o.length} options, il en faut 4`);
      if(a.a<0||a.a>=a.o.length) err.push(`${ou} : index de réponse hors bornes`);
    }
  }
}
function validerV2(m,err,warn){
  ["id","level","title","why","parties","evaluation"].forEach(k=>{if(m[k]===undefined)err.push(`champ manquant : ${k}`);});
  const pratiquees=new Set();
  let n=0;
  (m.parties||[]).forEach((p,pi)=>{
    if(!p.titre) err.push(`partie ${pi+1} sans titre`);
    if(!Array.isArray(p.etapes)||!p.etapes.length) err.push(`partie ${pi+1} sans étape`);
    (p.etapes||[]).forEach(e=>{
      n++; const ou=`étape ${n}${e.titre?` « ${e.titre} »`:""}`;
      if(!e.titre) err.push(`étape ${n} sans titre`);
      if(!e.notion) err.push(`${ou} : champ "notion" manquant`);
      if(!e.idee) err.push(`${ou} : champ "idee" manquant`);
      if(!e.image) warn.push(`${ou} : pas d'image de la vie quotidienne`);
      if(!e.exemple||!Array.isArray(e.exemple.lignes)||!e.exemple.lignes.length) warn.push(`${ou} : pas d'exemple déroulé pas à pas`);
      (e.mots||[]).forEach((x,i)=>{if(!x.m||!x.d)err.push(`${ou} : mot nouveau ${i+1} sans "m" ou sans "d"`);});
      const acts=e.activites||(e.activite?[e.activite]:[]);
      if(!acts.length) err.push(`${ou} : aucune activité — chaque idée se termine par une manipulation`);
      acts.forEach((a,i)=>verifActivite(a,`${ou}, activité ${i+1}`,err));
      if(acts.length&&e.notion) pratiquees.add(e.notion);
      const w=mots([].concat(e.idee||[]).join(" "));
      if(w>90) warn.push(`${ou} : idée de ${w} mots — viser court, une seule idée`);
      if(e.cyber&&mots([].concat(e.cyber).join(" "))>70) warn.push(`${ou} : encadré cyber long`);
    });
  });
  const ev=m.evaluation||{}, banque=ev.banque||[];
  if(!ev.count||!ev.pass||ev.pass>ev.count) err.push(`evaluation : count et pass requis, pass ≤ count`);
  if(banque.length<(ev.count||0)) err.push(`evaluation : ${banque.length} épreuves en banque pour ${ev.count} tirées`);
  banque.forEach((a,i)=>{
    const ou=`évaluation, épreuve ${i+1}`;
    verifActivite(a,ou,err);
    if(!a.notion) err.push(`${ou} : champ "notion" manquant`);
    else if(!pratiquees.has(a.notion)) err.push(`${ou} : notion "${a.notion}" jamais pratiquée dans une étape`);
  });
  (m.cartes||[]).forEach((c,i)=>{
    if(!c.r||!c.v) err.push(`carte ${i+1} : il faut un recto "r" et un verso "v"`);
    if(!c.notion) warn.push(`carte ${i+1} : pas de notion`);
    else if(!pratiquees.has(c.notion)) err.push(`carte ${i+1} : notion "${c.notion}" jamais pratiquée`);
  });
  const vues=new Set(banque.filter(a=>a.q).map(a=>a.q.trim()));
  (m.examen||[]).forEach((q,i)=>{
    const ou=`examen ${i+1}`;
    verifActivite({type:"choix",...q},ou,err);
    if(!q.notion) err.push(`${ou} : champ "notion" manquant`);
    else if(!pratiquees.has(q.notion)) err.push(`${ou} : notion "${q.notion}" jamais pratiquée`);
    if(q.q&&vues.has(q.q.trim())) err.push(`${ou} : question identique à une épreuve de l'évaluation du module`);
  });
}

let fail=0;
const files=process.argv.slice(2);
if(!files.length){console.error("usage: node outils/valider.js modules/n0-1.json [...]");process.exit(2);}
for(const f of files){
  const err=[],warn=[];
  let m;
  try{m=JSON.parse(fs.readFileSync(f,"utf8"));}catch(e){console.error(`✗ ${f} — JSON invalide : ${e.message}`);fail++;continue;}
  const want=path.basename(f,".json");
  if(m.id!==want) err.push(`id "${m.id}" ≠ nom de fichier "${want}"`);
  if(m.format===2) validerV2(m,err,warn);
  else{
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
  }
  if(err.length){fail++;console.log(`✗ ${f}`);err.forEach(e=>console.log(`    ERREUR  ${e}`));}
  else console.log(`✓ ${f}`);
  warn.forEach(w=>console.log(`    alerte  ${w}`));
}
process.exit(fail?1:0);
