#!/usr/bin/env node
// Vérifie qu'un module respecte le format attendu par app/index.html
const fs=require("fs"),path=require("path");
const GENS=["convBin","convTriple","bitop","subnet","cidr","decoupe","ipv4","paquet","qcm"];
const BLOCKS=["p","h3","pre","note","table"];
/* ---------- format 2 : parties → étapes, une idée par étape ----------
   Règle centrale (principe 5 du cahier des charges) : une épreuve d'évaluation, une carte
   ou une question d'examen ne peut porter que sur une notion pratiquée dans une étape. */
const ACTS=["bits","ordre","trous","choix","classer","relier","zone","operation"];
const ACT_GENS={trous:["decompo10","suiteBinaire","poids","convHex","hexBin","masque","construireMasque","testerBit","xorRetour","base64Taille","base64Paquets","base64Caractere","base64Egal"],ordre:[],classer:["bases"],relier:["relierNibble","relierAscii"],zone:["zoneNibble","erreurSoustractive"]};
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
  if(["classer","relier","zone"].includes(a.type)){
    if(a.gen){ if(!(ACT_GENS[a.type]||[]).includes(a.gen)) err.push(`${ou} : générateur "${a.gen}" inconnu pour ${a.type}`); }
    else if(a.type==="classer"){
      if(!(Array.isArray(a.categories)&&a.categories.length>=2)) err.push(`${ou} : classer sans au moins 2 catégories`);
      if(!(Array.isArray(a.items)&&a.items.length>=3)) err.push(`${ou} : classer sans au moins 3 items`);
      else a.items.forEach((it,i)=>{if(!it.t||!Number.isInteger(it.c)||it.c<0||it.c>=(a.categories||[]).length)err.push(`${ou} : item ${i+1} — il faut t et une catégorie c valide`);});
    }
    else if(a.type==="relier"){
      if(!(Array.isArray(a.paires)&&a.paires.length>=3)) err.push(`${ou} : relier sans au moins 3 paires`);
      else{
        a.paires.forEach((p,i)=>{if(!Array.isArray(p)||p.length<2||!p[0]||!p[1])err.push(`${ou} : paire ${i+1} incomplète`);});
        const d=a.paires.map(p=>p[1]); if(new Set(d).size!==d.length) err.push(`${ou} : deux paires ont le même élément de droite`);
      }
    }
    else if(a.type==="zone"){
      if(!a.consigne) err.push(`${ou} : zone sans consigne`);
      if(!(Array.isArray(a.segments)&&a.segments.length>=2)) err.push(`${ou} : zone sans au moins 2 segments`);
      if(!(Array.isArray(a.bons)&&a.bons.length)||(a.bons||[]).some(i=>!Number.isInteger(i)||i<0||i>=(a.segments||[]).length)) err.push(`${ou} : zone — "bons" doit lister des index de segments`);
    }
  }
  if(a.type==="operation"){
    if(a.op!==undefined&&!["ET","OU","XOR","aleatoire"].includes(a.op)) err.push(`${ou} : operation — op doit valoir ET, OU, XOR ou "aleatoire"`);
    ["a","b"].forEach(k=>{const v=a[k]; if(v!==undefined&&v!=="aleatoire"&&!(Number.isInteger(v)&&v>=0&&v<=255)) err.push(`${ou} : operation — ${k} doit être un octet ou "aleatoire"`);});
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

/* ---------- labo d'un module (BRIEF_APPLICATION §6.3) ----------
   labo : { etapes : [{ objectif, consigne, verification : { commande, attendu : { type, valeur } }, correction }] }
   type : "motif" (expression régulière), "egal", "contient" ou "absent" (la sortie ne doit pas contenir valeur) */
const ATTENDUS=["motif","egal","contient","absent"];
function verifLabo(l,err){
  if(!l||!Array.isArray(l.etapes)||!l.etapes.length){err.push(`labo : il faut au moins une étape dans "etapes"`);return;}
  l.etapes.forEach((e,i)=>{
    const ou=`labo, étape ${i+1}`;
    ["objectif","consigne","correction"].forEach(k=>{if(!e[k])err.push(`${ou} : champ "${k}" manquant`);});
    const v=e.verification||{};
    if(!v.commande) err.push(`${ou} : commande de vérification manquante`);
    const a=v.attendu||{};
    if(!ATTENDUS.includes(a.type)) err.push(`${ou} : sortie attendue de type "${a.type}" inconnu (${ATTENDUS.join(", ")})`);
    if(typeof a.valeur!=="string"||!a.valeur) err.push(`${ou} : valeur attendue manquante`);
    else if(a.type==="motif"){try{new RegExp(a.valeur);}catch(x){err.push(`${ou} : motif invalide, ${x.message}`);}}
  });
}

/* ---------- curriculum.json, version 2 ----------
   niveaux[] : n, cycle, titre, but, prereq (numéros de niveaux), modules[]
   module   : id (n<N>-<k>), titre, resume, prereq (ids), annee, esgi, statut, labo facultatif { env, rendu? }
   hors_parcours : titre, but, format "court", modules[] : id (x-…), titre, resume, annee, esgi */
const ANNEES=["1A","2A","3A","4A","5A"], STATUTS=["complet","ancrage"];
function acyclique(noeuds,succ){
  const etat={},boucles=[];
  const visite=(k,chemin)=>{
    if(etat[k]===2) return; if(etat[k]===1){boucles.push([...chemin,k].join(" → "));return;}
    etat[k]=1; (succ(k)||[]).forEach(s=>visite(s,[...chemin,k])); etat[k]=2;
  };
  noeuds.forEach(k=>visite(k,[]));
  return boucles;
}
function validerCurriculum(c,err,warn){
  if(c.version!==2) err.push(`version ${c.version} : ce validateur attend la version 2`);
  if(!c.titre) err.push(`champ manquant : titre`);
  const cycles=new Set((c.cycles||[]).map(x=>x.cycle));
  if(!cycles.size) err.push(`aucun cycle déclaré`);
  const N=c.niveaux||[], parN=new Map();
  N.forEach((l,i)=>{
    if(l.n!==i) err.push(`niveau en position ${i} numéroté ${l.n} : les niveaux se suivent à partir de 0`);
    parN.set(l.n,l);
    ["titre","but"].forEach(k=>{if(!l[k])err.push(`N${l.n} : champ "${k}" manquant`);});
    if(!cycles.has(l.cycle)) err.push(`N${l.n} : cycle ${l.cycle} inconnu`);
    if(!Array.isArray(l.prereq)) err.push(`N${l.n} : "prereq" doit être une liste de numéros de niveaux`);
    if(!Array.isArray(l.modules)||!l.modules.length) err.push(`N${l.n} : aucun module`);
  });
  N.forEach(l=>(l.prereq||[]).forEach(p=>{if(!parN.has(p))err.push(`N${l.n} : prérequis N${p} inexistant`);if(p===l.n)err.push(`N${l.n} : se requiert lui-même`);}));
  acyclique(N.map(l=>l.n),n=>(parN.get(n)||{}).prereq).forEach(b=>err.push(`boucle de prérequis entre niveaux : N${b.replace(/ → /g," → N")}`));
  /* niveaux accessibles avant un niveau donné : lui-même et tous ses ancêtres */
  const ancetres=n=>{const vus=new Set([n]),pile=[n];while(pile.length){const x=pile.pop();((parN.get(x)||{}).prereq||[]).forEach(p=>{if(!vus.has(p)){vus.add(p);pile.push(p);}});}return vus;};
  const mods=new Map(), ids=new Set();
  N.forEach(l=>(l.modules||[]).forEach((m,k)=>{
    if(ids.has(m.id)) err.push(`identifiant ${m.id} en double`); ids.add(m.id); mods.set(m.id,{...m,n:l.n});
    if(m.id!==`n${l.n}-${k+1}`) err.push(`N${l.n} : le module ${k+1} devrait s'appeler n${l.n}-${k+1}, pas ${m.id}`);
    ["titre","resume","esgi"].forEach(x=>{if(!m[x])err.push(`${m.id} : champ "${x}" manquant`);});
    if(!ANNEES.includes(m.annee)) err.push(`${m.id} : année "${m.annee}" inconnue (${ANNEES.join(", ")})`);
    if(!STATUTS.includes(m.statut)) err.push(`${m.id} : statut "${m.statut}" inconnu (${STATUTS.join(", ")})`);
    if(!Array.isArray(m.prereq)) err.push(`${m.id} : "prereq" doit être une liste`);
    if(m.labo!==undefined){
      if(!m.labo||typeof m.labo.env!=="string"||!m.labo.env) err.push(`${m.id} : labo sans environnement "env"`);
      if(m.labo&&m.labo.rendu!==undefined&&(typeof m.labo.rendu!=="string"||!m.labo.rendu)) err.push(`${m.id} : labo, "rendu" doit être un texte`);
      Object.keys(m.labo||{}).filter(k=>!["env","rendu"].includes(k)).forEach(k=>err.push(`${m.id} : labo, champ "${k}" inconnu`));
    }
  }));
  mods.forEach(m=>(m.prereq||[]).forEach(p=>{
    const q=mods.get(p);
    if(!q){err.push(`${m.id} : prérequis ${p} inexistant`);return;}
    if(!ancetres(m.n).has(q.n)) err.push(`${m.id} : prérequis ${p} appartient à N${q.n}, qui n'est pas un prérequis de N${m.n}`);
  }));
  acyclique([...mods.keys()],k=>(mods.get(k)||{}).prereq).forEach(b=>err.push(`boucle de prérequis entre modules : ${b}`));
  const H=c.hors_parcours;
  if(H){
    if(H.format!=="court") err.push(`hors_parcours : format "court" attendu`);
    (H.modules||[]).forEach(m=>{
      if(!/^x-[a-z0-9-]+$/.test(m.id||"")) err.push(`hors parcours : identifiant "${m.id}" invalide (x-…)`);
      if(ids.has(m.id)) err.push(`identifiant ${m.id} en double`); ids.add(m.id);
      ["titre","resume","esgi"].forEach(x=>{if(!m[x])err.push(`${m.id} : champ "${x}" manquant`);});
      if(!ANNEES.includes(m.annee)) err.push(`${m.id} : année "${m.annee}" inconnue`);
      if(m.prereq) warn.push(`${m.id} : le hors parcours n'a pas de prérequis`);
      if(m.statut!==undefined&&!STATUTS.includes(m.statut)) err.push(`${m.id} : statut "${m.statut}" inconnu (${STATUTS.join(", ")})`);
    });
  }
  /* les modules déjà écrits doivent rester rattachés au bon niveau */
  const dir=path.join(path.dirname(path.resolve(__dirname)),"modules");
  if(fs.existsSync(dir)) fs.readdirSync(dir).filter(x=>x.endsWith(".json")).forEach(x=>{
    const id=path.basename(x,".json"), m=mods.get(id);
    if(!m){err.push(`modules/${x} existe mais ${id} n'est pas dans le curriculum`);return;}
    try{const mod=JSON.parse(fs.readFileSync(path.join(dir,x),"utf8"));if(mod.level!==m.n)err.push(`modules/${x} : level ${mod.level}, mais ${id} est rangé en N${m.n}`);}catch(e){}
  });
  /* l'index lu au démarrage doit correspondre exactement au dossier modules/ */
  const fi=path.join(path.dirname(path.resolve(__dirname)),"modules-index.json");
  if(fs.existsSync(dir)){
    const reel=require("./indexer.js").lister();
    let idx=null; try{idx=JSON.parse(fs.readFileSync(fi,"utf8")).modules;}catch(e){}
    if(!Array.isArray(idx)) err.push(`modules-index.json absent ou illisible : lance node outils/indexer.js`);
    else if(JSON.stringify([...idx].sort())!==JSON.stringify([...reel].sort())) err.push(`modules-index.json ne correspond plus au dossier modules/ (index : ${idx.join(", ")} ; dossier : ${reel.join(", ")}) : lance node outils/indexer.js`);
    else (idx||[]).forEach(id=>{if(!mods.has(id))err.push(`modules-index.json liste ${id}, absent du curriculum`);});
  }
  const nb=mods.size; console.log(`    ${N.length} niveaux, ${nb} modules, ${(H&&H.modules||[]).length} hors parcours, ${[...mods.values()].filter(m=>m.labo).length} avec labo, ${[...mods.values()].filter(m=>m.statut==="ancrage").length} en ancrage`);
}
/* un module comparé à sa déclaration dans curriculum.json */
function croiserCurriculum(m,err,warn){
  const f=path.join(path.dirname(path.resolve(__dirname)),"curriculum.json");
  let c; try{c=JSON.parse(fs.readFileSync(f,"utf8"));}catch(e){return;}
  if(c.version!==2) return;
  const l=(c.niveaux||[]).find(x=>(x.modules||[]).some(y=>y.id===m.id));
  if(!l){err.push(`${m.id} n'est pas déclaré dans curriculum.json`);return;}
  const d=l.modules.find(y=>y.id===m.id);
  if(m.level!==l.n) err.push(`level ${m.level}, mais curriculum.json range ${m.id} en N${l.n}`);
  if(d.labo&&!m.labo) warn.push(`curriculum.json annonce un labo (${d.labo.env}), le module n'en déclare pas encore`);
}

/* ---------- sections ESGI : esgi/*.json (BRIEF_SECTIONS_ESGI §3, schéma : esgi/SCHEMA.md) ----------
   Les références (matières, modules du parcours) sont résolues à partir du dossier esgi/
   qui contient le fichier, et de curriculum.json à la racine du dépôt. */
const ESGI_FICHIERS=["matieres.json","realisations.json","tp.json","controles.json"];
const RE_ID=/^[a-z0-9]+(-[a-z0-9]+)*$/, RE_NOTE=/^(\d+(?:[.,]\d+)?)\/(\d+)$/;
function dateValide(s,heure){
  if(typeof s!=="string") return false;
  const r=(heure?/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/:/^(\d{4})-(\d{2})-(\d{2})$/).exec(s);
  if(!r) return false;
  const d=new Date(Date.UTC(+r[1],+r[2]-1,+r[3]));
  if(d.getUTCFullYear()!==+r[1]||d.getUTCMonth()!==+r[2]-1||d.getUTCDate()!==+r[3]) return false;
  return r[4]===undefined||(+r[4]<24&&+r[5]<60);
}
function esgiType(f){
  const abs=path.resolve(f), dir=path.dirname(abs), base=path.basename(abs);
  if(path.basename(dir)==="esgi"&&ESGI_FICHIERS.includes(base)) return {type:base.replace(".json",""),racine:dir};
  if(path.basename(dir)==="cartes"&&path.basename(path.dirname(dir))==="esgi"&&base.endsWith(".json")) return {type:"cartes",racine:path.dirname(dir),id:path.basename(base,".json")};
  return null;
}
function idsCurriculum(){
  try{
    const c=JSON.parse(fs.readFileSync(path.join(path.dirname(path.resolve(__dirname)),"curriculum.json"),"utf8"));
    const s=new Set();
    (c.niveaux||[]).forEach(l=>(l.modules||[]).forEach(m=>s.add(m.id)));
    ((c.hors_parcours||{}).modules||[]).forEach(m=>s.add(m.id));
    return s;
  }catch(e){return null;}
}
function idsMatieres(racine,err){
  try{
    const l=JSON.parse(fs.readFileSync(path.join(racine,"matieres.json"),"utf8"));
    return new Set((Array.isArray(l)?l:[]).map(x=>x&&x.id).filter(Boolean));
  }catch(e){err.push(`matieres.json absent ou illisible à côté de ce fichier : les matières citées ne peuvent pas être vérifiées`);return null;}
}
/* vérifie un objet contre une description { champ : [type, requis] } ; types :
   id, texte, texte?, date, date?, echeance?, note?, bool, liste, matiere, modules, enum:a|b */
function verifChamps(o,spec,ou,ctx,err){
  if(!o||typeof o!=="object"||Array.isArray(o)){err.push(`${ou} : objet attendu`);return;}
  Object.keys(o).filter(k=>!(k in spec)).forEach(k=>err.push(`${ou} : champ "${k}" inconnu`));
  Object.entries(spec).forEach(([k,[t,requis]])=>{
    const v=o[k];
    if(v===undefined){if(requis)err.push(`${ou} : champ "${k}" manquant`);return;}
    const nul=t.endsWith("?"), base=nul?t.slice(0,-1):t;
    if(v===null){if(!nul)err.push(`${ou} : "${k}" ne peut pas être null`);return;}
    if(base==="id"){if(typeof v!=="string"||!RE_ID.test(v))err.push(`${ou} : identifiant "${v}" invalide (minuscules, chiffres, tirets)`);}
    else if(base==="texte"){if(typeof v!=="string"||!v.trim())err.push(`${ou} : "${k}" doit être un texte non vide`);}
    else if(base==="date"){if(!dateValide(v,false))err.push(`${ou} : "${k}" = ${JSON.stringify(v)}, date AAAA-MM-JJ attendue`);}
    else if(base==="echeance"){if(!dateValide(v,true))err.push(`${ou} : "${k}" = ${JSON.stringify(v)}, AAAA-MM-JJ ou AAAA-MM-JJTHH:MM attendu`);}
    else if(base==="bool"){if(typeof v!=="boolean")err.push(`${ou} : "${k}" doit valoir true ou false`);}
    else if(base==="note"){
      const r=typeof v==="string"&&RE_NOTE.exec(v);
      if(!r) err.push(`${ou} : note ${JSON.stringify(v)} invalide ("17,64/20", "85/100" ou null)`);
      else if(+r[2]===0||parseFloat(r[1].replace(",","."))>+r[2]) err.push(`${ou} : note ${v} au-dessus du barème`);
    }
    else if(base==="matiere"){if(typeof v!=="string")err.push(`${ou} : "${k}" doit être un id de matière`);else if(ctx.matieres&&!ctx.matieres.has(v))err.push(`${ou} : matière "${v}" absente de matieres.json`);}
    else if(base==="liste"){if(!Array.isArray(v))err.push(`${ou} : "${k}" doit être une liste`);else v.forEach((x,i)=>{if(typeof x!=="string"||!x.trim())err.push(`${ou} : "${k}" élément ${i+1} doit être un texte non vide`);});}
    else if(base==="modules"){
      if(!Array.isArray(v)){err.push(`${ou} : "${k}" doit être une liste d'ids du curriculum`);return;}
      v.forEach(x=>{if(ctx.curriculum&&!ctx.curriculum.has(x))err.push(`${ou} : module du parcours "${x}" absent de curriculum.json`);});
    }
    else if(base.startsWith("enum:")){const ok=base.slice(5).split("|");if(!ok.includes(v))err.push(`${ou} : "${k}" = ${JSON.stringify(v)}, attendu ${ok.join(", ")}`);}
  });
}
function idsUniques(l,quoi,err){
  const vus=new Set();
  l.forEach(x=>{if(x&&x.id){if(vus.has(x.id))err.push(`${quoi} : identifiant "${x.id}" en double`);vus.add(x.id);}});
}
const SPEC={
  matieres:{id:["id",1],titre:["texte",1],intervenant:["texte?",1],trimestre:["enum:T1|T2|T3",1],type:["enum:tronc|electif",1],dossier:["texte?",1],seances:["*",1],modules_parcours:["modules",1]},
  seance:{date:["date",1],sujet:["texte",1],supports:["*",1]},
  support:{fichier:["texte",1],reperes:["texte?",1]},
  realisations:{id:["id",1],date:["date",1],matiere:["matiere",1],titre:["texte",1],fait:["liste",1],competences:["liste",1],note:["note?",1],preuve:["texte?",1],modules_parcours:["modules",1]},
  tp:{id:["id",1],matiere:["matiere",1],titre:["texte",1],echeance:["echeance?",1],statut:["enum:a_faire|en_cours|rendu|note",1],note:["note?",1],plateforme:["texte?",1],enonce:["texte?",1],etapes:["*",1]},
  etape:{t:["texte",1],fait:["bool",1]},
  controles:{id:["id",1],matiere:["matiere",1],date:["date?",1],format:["texte?",1],perimetre:["liste",1],a_confirmer:["texte?",1],cartes:["*",1]},
  carte:{r:["texte",1],v:["texte",1],source:["texte",1],piege:["bool",0]}
};
function validerEsgi(d,info,err,warn){
  const ctx={curriculum:idsCurriculum(),matieres:info.type==="matieres"?null:idsMatieres(info.racine,err)};
  if(!ctx.curriculum) err.push(`curriculum.json illisible : modules_parcours non vérifiés`);
  if(info.type==="cartes"){
    if(!d||typeof d!=="object"||Array.isArray(d)){err.push(`objet { matiere, cartes } attendu`);return;}
    Object.keys(d).filter(k=>!["matiere","cartes"].includes(k)).forEach(k=>err.push(`champ "${k}" inconnu`));
    if(d.matiere!==info.id) err.push(`matiere "${d.matiere}" ≠ nom de fichier "${info.id}"`);
    if(ctx.matieres&&!ctx.matieres.has(info.id)) err.push(`matière "${info.id}" absente de matieres.json`);
    if(!Array.isArray(d.cartes)||!d.cartes.length){err.push(`aucune carte dans "cartes"`);return;}
    const rectos=new Set();
    d.cartes.forEach((c,i)=>{
      verifChamps(c,SPEC.carte,`carte ${i+1}`,ctx,err);
      const r=c&&typeof c.r==="string"?c.r.trim():"";
      if(r&&rectos.has(r)) warn.push(`carte ${i+1} : même recto qu'une carte précédente`); rectos.add(r);
      if(c&&typeof c.source==="string"&&/slide|page/i.test(c.source)&&!/\d/.test(c.source)) warn.push(`carte ${i+1} : source mentionne slide/page sans numéro`);
    });
    console.log(`    ${d.cartes.length} cartes, ${d.cartes.filter(c=>c&&c.piege).length} piège(s)`);
    return;
  }
  if(!Array.isArray(d)){err.push(`une liste est attendue à la racine de ${info.type}.json`);return;}
  idsUniques(d,info.type,err);
  d.forEach((o,i)=>{
    const ou=`${info.type} ${i+1}${o&&o.id?` (${o.id})`:""}`;
    verifChamps(o,SPEC[info.type],ou,ctx,err);
    if(!o||typeof o!=="object") return;
    if(info.type==="realisations"&&Array.isArray(o.fait)&&!o.fait.length) err.push(`${ou} : "fait" vide, au moins une action réalisée`);
    if(info.type==="matieres"){
      if(!Array.isArray(o.seances)) err.push(`${ou} : "seances" doit être une liste`);
      else{
        o.seances.forEach((s,j)=>{
          const os=`${ou}, séance ${j+1}`;
          verifChamps(s,SPEC.seance,os,ctx,err);
          if(s&&!Array.isArray(s.supports)) err.push(`${os} : "supports" doit être une liste`);
          else if(s) s.supports.forEach((x,k)=>verifChamps(x,SPEC.support,`${os}, support ${k+1}`,ctx,err));
        });
        const dates=o.seances.map(s=>s&&s.date).filter(x=>dateValide(x,false));
        if(dates.some((x,j)=>j&&x<dates[j-1])) warn.push(`${ou} : séances pas rangées par date`);
      }
    }
    if(info.type==="tp"){
      if(!Array.isArray(o.etapes)) err.push(`${ou} : "etapes" doit être une liste`);
      else o.etapes.forEach((e,j)=>verifChamps(e,SPEC.etape,`${ou}, étape ${j+1}`,ctx,err));
      if(o.statut==="note"&&o.note==null) err.push(`${ou} : statut "note" sans note`);
      if(o.note!=null&&o.statut!=="note") warn.push(`${ou} : une note est renseignée mais le statut est "${o.statut}"`);
    }
    if(info.type==="controles"){
      if(!Array.isArray(o.cartes)) err.push(`${ou} : "cartes" doit être une liste de matières`);
      else o.cartes.forEach(x=>{
        if(ctx.matieres&&!ctx.matieres.has(x)) err.push(`${ou} : cartes de "${x}", matière absente de matieres.json`);
        else if(!fs.existsSync(path.join(info.racine,"cartes",`${x}.json`))) warn.push(`${ou} : esgi/cartes/${x}.json n'existe pas encore, l'examen blanc n'aura pas ces cartes`);
      });
      if(o.date===null&&!o.a_confirmer) warn.push(`${ou} : date inconnue, à noter dans "a_confirmer"`);
    }
  });
  console.log(`    ${d.length} entrée${d.length>1?"s":""}`);
}

let fail=0;
/* un dossier esgi/ passé en argument est remplacé par ses fichiers */
const files=process.argv.slice(2).flatMap(f=>{
  if(!fs.existsSync(f)||!fs.statSync(f).isDirectory()) return [f];
  const l=ESGI_FICHIERS.map(x=>path.join(f,x)).filter(x=>fs.existsSync(x));
  const c=path.join(f,"cartes");
  if(fs.existsSync(c)) fs.readdirSync(c).filter(x=>x.endsWith(".json")).sort().forEach(x=>l.push(path.join(c,x)));
  return l;
});
if(!files.length){console.error("usage: node outils/valider.js curriculum.json modules/n0-1.json esgi [...]");process.exit(2);}
for(const f of files){
  const err=[],warn=[];
  let m;
  try{m=JSON.parse(fs.readFileSync(f,"utf8"));}catch(e){console.error(`✗ ${f} — JSON invalide : ${e.message}`);fail++;continue;}
  const esgi=esgiType(f);
  if(esgi){
    validerEsgi(m,esgi,err,warn);
    if(err.length){fail++;console.log(`✗ ${f}`);err.forEach(e=>console.log(`    ERREUR  ${e}`));}else console.log(`✓ ${f}`);
    warn.forEach(w=>console.log(`    alerte  ${w}`));
    continue;
  }
  if(/^curriculum.*\.json$/.test(path.basename(f))){
    validerCurriculum(m,err,warn);
    if(err.length){fail++;console.log(`✗ ${f}`);err.forEach(e=>console.log(`    ERREUR  ${e}`));}else console.log(`✓ ${f}`);
    warn.forEach(w=>console.log(`    alerte  ${w}`));
    continue;
  }
  const want=path.basename(f,".json");
  if(m.id!==want) err.push(`id "${m.id}" ≠ nom de fichier "${want}"`);
  croiserCurriculum(m,err,warn);
  if(m.labo!==undefined) verifLabo(m.labo,err);
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
