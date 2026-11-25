/* ============================================================
   PROGRESSION — sauvegarde, restauration et fusion (BRIEF_SECTIONS_ESGI §9.2)
   Tout ce que l'application écrit dans le navigateur vit sous les clés formation.cyber.*
   et fc.theme. Ce fichier sait en faire un instantané, le résumer et fusionner deux
   instantanés. Il ne touche pas à l'affichage : réutilisé par la synchronisation (§9.4).
   Les réglages propres à l'appareil (date de dernière sauvegarde, plus tard le jeton
   GitHub) sont rangés sous fc.sauvegarde / fc.sync et ne sortent jamais dans un fichier.
   ============================================================ */
(function(racine){
const FORMAT="formation-cyber-progression", VERSION=1;
const estCleApp=k=>k==="fc.theme"||/^formation\.cyber\.[\w.-]+$/.test(k);

/* Règles de fusion, clé par clé. Prudence : un module ou un examen validé le reste ;
   une carte garde la boîte la plus basse (on la revoit plutôt que de la croire sue) ;
   l'avancement dans les étapes d'un module garde le plus loin atteint. */
const ou=(a,b)=>{const r={...a};for(const k in b) r[k]=!!(a[k]||b[k]);return r;};
const min=(a,b)=>{const r={...a};for(const k in b) r[k]=k in a?Math.min(a[k],b[k]):b[k];return r;};
const max=(a,b)=>{const r={...a};for(const k in b) r[k]=k in a?Math.max(a[k],b[k]):b[k];return r;};
const REGLES={
  "formation.cyber.v1":ou,
  "formation.cyber.cartes.v1":min,
  "formation.cyber.esgi.cartes.v1":min,
  "formation.cyber.etapes.v1":max
};
const lire=s=>{try{const v=JSON.parse(s);return v&&typeof v==="object"&&!Array.isArray(v)?v:null;}catch(e){return null;}};

/* cles : { nom → texte tel que stocké dans localStorage } */
function instantane(stockage){
  const cles={};
  for(let i=0;i<stockage.length;i++){const k=stockage.key(i); if(estCleApp(k)) cles[k]=stockage.getItem(k);}
  return cles;
}
function fichier(cles,date){
  return {format:FORMAT,version:VERSION,date:(date||new Date()).toISOString(),cles};
}
/* contrôle un fichier importé ; renvoie {cles, date} ou lève une erreur lisible */
function verifier(obj){
  if(!obj||obj.format!==FORMAT) throw new Error("Ce fichier n'est pas une sauvegarde de la formation.");
  if(!Number.isInteger(obj.version)||obj.version<1) throw new Error("Version de sauvegarde illisible.");
  if(obj.version>VERSION) throw new Error(`Sauvegarde faite par une version plus récente de l'application (v${obj.version}).`);
  if(!obj.cles||typeof obj.cles!=="object"||Array.isArray(obj.cles)) throw new Error("Sauvegarde sans contenu.");
  const cles={}, ignorees=[];
  for(const [k,v] of Object.entries(obj.cles)){
    if(!estCleApp(k)||typeof v!=="string"){ignorees.push(k);continue;}
    if(k==="fc.theme"){if(v==="dark"||v==="light")cles[k]=v;else ignorees.push(k);continue;}
    if(REGLES[k]&&!lire(v)){ignorees.push(k);continue;}
    cles[k]=v;
  }
  const d=new Date(obj.date);
  return {cles,ignorees,date:isNaN(d)?null:d};
}
function resume(cles){
  const p=lire(cles["formation.cyber.v1"])||{};
  const vrais=Object.keys(p).filter(k=>p[k]===true);
  const n=k=>Object.keys(lire(cles[k])||{}).length;
  const et=lire(cles["formation.cyber.etapes.v1"])||{};
  return {
    modules:vrais.filter(k=>!k.startsWith("examen-")).length,
    examens:vrais.filter(k=>k.startsWith("examen-")).length,
    etapes:Object.values(et).filter(x=>x>0).length,
    cartes:n("formation.cyber.cartes.v1"),
    cartesEsgi:n("formation.cyber.esgi.cartes.v1"),
    vide:!Object.keys(cles).some(k=>k!=="fc.theme")
  };
}
/* fusion de deux instantanés.
   Clé avec règle : la règle. Clé sans règle : la plus récente si les deux côtés sont horodatés
   (h.local / h.distant : { clé → date ISO de dernière modification }), sinon l'appareil courant.
   Le thème reste toujours celui de l'appareil. */
function fusionner(local,distant,h){
  const hl=(h&&h.local)||{}, hd=(h&&h.distant)||{};
  const r={...local};
  for(const [k,v] of Object.entries(distant)){
    if(!(k in local)){r[k]=v;continue;}
    if(k==="fc.theme"||v===local[k]) continue;
    const f=REGLES[k], a=lire(local[k]), b=lire(v);
    if(f&&a&&b) r[k]=JSON.stringify(f(a,b));
    else if(!f&&hd[k]&&(!hl[k]||hd[k]>hl[k])) r[k]=v;
  }
  return r;
}
/* horodatages fusionnés : le plus récent des deux, clé par clé */
function fusionnerHorodatages(a,b){
  const r={...a};
  for(const [k,v] of Object.entries(b||{})) if(!r[k]||v>r[k]) r[k]=v;
  return r;
}
/* écrit un instantané ; "remplacer" efface d'abord les clés de l'application absentes du fichier */
function appliquer(stockage,cles,mode){
  const cible=mode==="remplacer"?cles:fusionner(instantane(stockage),cles);
  if(mode==="remplacer") Object.keys(instantane(stockage)).filter(k=>!(k in cible)&&k!=="fc.theme").forEach(k=>stockage.removeItem(k));
  for(const [k,v] of Object.entries(cible)) stockage.setItem(k,v);
  return cible;
}
const api={FORMAT,VERSION,estCleApp,instantane,fichier,verifier,resume,fusionner,fusionnerHorodatages,appliquer,REGLES};
if(typeof module!=="undefined"&&module.exports) module.exports=api; else racine.Progression=api;
})(typeof window!=="undefined"?window:globalThis);
