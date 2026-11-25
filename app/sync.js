/* ============================================================
   SYNCHRONISATION PAR GIST GITHUB (BRIEF_SECTIONS_ESGI §9.4)
   La progression est copiée dans un Gist secret du compte GitHub de l'utilisateur.
   Pas de serveur : le navigateur parle directement à l'API GitHub avec un jeton
   à portée « gist », rangé dans le localStorage de l'appareil (clé fc.sync), jamais
   dans le dépôt, jamais dans une sauvegarde (progression.js n'exporte pas fc.*).

   Cycle : à l'ouverture, on lit le Gist, on fusionne, on renvoie s'il y a du nouveau.
   Après chaque changement local, envoi quelques secondes plus tard ; à la fermeture,
   envoi immédiat. Hors connexion, l'application marche et envoie au retour du réseau.
   La fusion est celle de progression.js : jamais d'écrasement silencieux.
   ============================================================ */
(function(racine){
const FICHIER="formation-cyber-progression.json", API="https://api.github.com", CLE="fc.sync";
const DELAI_ENVOI=4000, DELAI_REESSAI=30000;

function creer(o){
  const S=o.stockage, P=o.Progression||racine.Progression;
  const maintenant=o.maintenant||(()=>new Date());
  const minuteur=o.minuteur||{poser:(f,ms)=>setTimeout(f,ms),annuler:id=>clearTimeout(id)};
  const lireCfg=()=>{try{return JSON.parse(S.getItem(CLE))||{};}catch(e){return {};}};
  const ecrireCfg=c=>S.setItem(CLE,JSON.stringify(c));
  /* le thème appartient à l'appareil : il ne voyage pas */
  const local=()=>{const c=P.instantane(S);delete c["fc.theme"];return c;};
  let connu=local(), enCours=null, relancer=false, attente=false, minut=null, dernierDistant=null;
  let etat=lireCfg().jeton?"attente":"inactif", detail="", porteeLarge=false;

  function poser(e,d){etat=e;detail=d||"";if(o.surEtat)o.surEtat(e,detail);}
  function planifier(ms){if(minut!==null)minuteur.annuler(minut);minut=minuteur.poser(()=>{minut=null;synchroniser();},ms);}

  async function api(chemin,{methode="GET",corps,keepalive}={}){
    const r=await o.fetch(API+chemin,{method:methode,cache:"no-store",keepalive:!!keepalive,
      headers:{"Accept":"application/vnd.github+json","Authorization":"Bearer "+lireCfg().jeton,"X-GitHub-Api-Version":"2022-11-28",...(corps?{"Content-Type":"application/json"}:{})},
      body:corps?JSON.stringify(corps):undefined});
    const sc=r.headers&&r.headers.get&&r.headers.get("x-oauth-scopes");
    if(typeof sc==="string") porteeLarge=sc.split(",").map(s=>s.trim()).filter(s=>s&&s!=="gist").length>0;
    if(!r.ok){const e=new Error("HTTP "+r.status);e.status=r.status;throw e;}
    return r.status===204?null:r.json();
  }
  const contenu=(cles,h)=>JSON.stringify({...P.fichier(cles,maintenant()),horodatages:h},null,1);
  /* lit le fichier du Gist ; null si illisible (on ne l'écrase alors jamais) */
  function lireDistant(texte){
    try{
      const obj=JSON.parse(texte), v=P.verifier(obj), h={};
      delete v.cles["fc.theme"];
      for(const [k,d] of Object.entries(obj.horodatages||{})) if(P.estCleApp(k)&&typeof d==="string"&&!isNaN(Date.parse(d))) h[k]=d;
      return {cles:v.cles,h};
    }catch(e){return null;}
  }
  async function trouverGist(){
    for(let page=1;page<=10;page++){
      const l=await api(`/gists?per_page=100&page=${page}`);
      const g=l.find(x=>x&&x.files&&x.files[FICHIER]);
      if(g) return g.id;
      if(l.length<100) return null;
    }
    return null;
  }

  /* repère les clés modifiées localement depuis le dernier passage et les horodate ;
     à appeler régulièrement (toutes les 2 s) : attrape toute écriture, y compris des clés futures */
  function surveiller(){
    const n=local(), changees=Object.keys(n).filter(k=>n[k]!==connu[k]);
    if(!changees.length) return false;
    connu=n;
    const cfg=lireCfg(), t=maintenant().toISOString();
    cfg.h=cfg.h||{}; changees.forEach(k=>{cfg.h[k]=t;}); ecrireCfg(cfg);
    if(cfg.jeton){attente=true;poser("attente","changement à envoyer");planifier(DELAI_ENVOI);}
    return true;
  }

  async function un(){
    let cfg=lireCfg();
    if(!cfg.jeton){poser("inactif");return;}
    if(o.horsLigne&&o.horsLigne()){poser("attente","hors connexion");return;}
    surveiller();
    try{
      if(!cfg.gist){
        const id=await trouverGist();
        if(id){cfg=lireCfg();cfg.gist=id;ecrireCfg(cfg);}
        else{
          const l=local(), h=lireCfg().h||{};
          const g=await api("/gists",{methode:"POST",corps:{description:"Progression de la formation cybersécurité (synchronisation automatique)",public:false,files:{[FICHIER]:{content:contenu(l,h)}}}});
          cfg=lireCfg(); cfg.gist=g.id; cfg.derniere=maintenant().toISOString(); ecrireCfg(cfg);
          dernierDistant={cles:l,h}; attente=false; poser("ok","Gist créé"); return;
        }
      }
      let g;
      try{g=await api(`/gists/${cfg.gist}`);}
      catch(e){if(e.status===404){cfg=lireCfg();delete cfg.gist;ecrireCfg(cfg);relancer=true;return;}throw e;}
      const f=g.files&&g.files[FICHIER];
      if(f&&f.truncated){poser("erreur","fichier du Gist trop gros pour être lu");return;}
      let distant={cles:{},h:{}};
      if(f&&typeof f.content==="string"&&f.content.trim()){
        distant=lireDistant(f.content);
        if(!distant){poser("erreur","fichier du Gist illisible ou d'une version plus récente : rien n'a été écrasé");return;}
      }
      const l=local(); cfg=lireCfg();
      const fus=P.fusionner(l,distant.cles,{local:cfg.h,distant:distant.h});
      const h=P.fusionnerHorodatages(cfg.h||{},distant.h);
      const modifiees=Object.keys(fus).filter(k=>fus[k]!==l[k]);
      modifiees.forEach(k=>S.setItem(k,fus[k]));
      connu=local();
      if(modifiees.length&&o.surChangement) o.surChangement(modifiees);
      if(Object.keys(fus).some(k=>fus[k]!==distant.cles[k]))
        await api(`/gists/${cfg.gist}`,{methode:"PATCH",corps:{files:{[FICHIER]:{content:contenu(fus,h)}}}});
      dernierDistant={cles:fus,h};
      const c2=lireCfg(); c2.h=P.fusionnerHorodatages(c2.h||{},h); c2.derniere=maintenant().toISOString(); ecrireCfg(c2);
      attente=false; poser("ok");
    }catch(e){
      if(e.status===401) poser("erreur","jeton refusé : expiré, révoqué ou mal recopié");
      else if(e.status===403||e.status===404) poser("erreur","accès refusé : le jeton doit avoir la portée « gist »");
      else if(!e.status){poser("attente","réseau indisponible, nouvel essai dans 30 s");planifier(DELAI_REESSAI);}
      else poser("erreur",`GitHub a répondu ${e.status}`);
    }
  }
  /* une seule synchronisation à la fois ; un appel pendant qu'elle tourne la relance à la fin */
  function synchroniser(){
    if(enCours){relancer=true;return enCours;}
    enCours=(async()=>{try{do{relancer=false;await un();}while(relancer);}finally{enCours=null;}})();
    return enCours;
  }
  /* fermeture de la page : envoi immédiat sans relire le Gist (pas le temps).
     On fusionne avec la dernière version lue : ce qu'un autre appareil aurait envoyé entre-temps
     reste chez lui et revient à sa prochaine synchronisation, la fusion ne perd rien. */
  function depart(){
    surveiller();
    const cfg=lireCfg();
    if(!attente||!cfg.jeton||!cfg.gist||!dernierDistant) return false;
    const fus=P.fusionner(local(),dernierDistant.cles,{local:cfg.h,distant:dernierDistant.h});
    const h=P.fusionnerHorodatages(cfg.h||{},dernierDistant.h);
    api(`/gists/${cfg.gist}`,{methode:"PATCH",keepalive:true,corps:{files:{[FICHIER]:{content:contenu(fus,h)}}}}).catch(()=>{});
    return true;
  }
  async function activer(jeton){
    jeton=String(jeton||"").trim();
    if(!jeton) throw new Error("Jeton vide.");
    const cfg=lireCfg(); cfg.jeton=jeton; delete cfg.gist; delete cfg.derniere; ecrireCfg(cfg);
    await synchroniser();
    if(etat==="erreur"){const c=lireCfg();delete c.jeton;ecrireCfg(c);const d=detail;poser("inactif");throw new Error(d);}
  }
  /* oublie le jeton sur cet appareil ; le Gist reste sur GitHub */
  function desactiver(){
    const cfg=lireCfg(); delete cfg.jeton; delete cfg.gist; delete cfg.derniere; ecrireCfg(cfg);
    if(minut!==null){minuteur.annuler(minut);minut=null;}
    attente=false; dernierDistant=null; poser("inactif");
  }
  return {
    surveiller,synchroniser,depart,activer,desactiver,
    actif:()=>!!lireCfg().jeton,
    infos:()=>{const c=lireCfg();return {etat,detail,gist:c.gist||null,derniere:c.derniere||null,porteeLarge};}
  };
}
const api={creer,FICHIER,CLE};
if(typeof module!=="undefined"&&module.exports) module.exports=api; else racine.Sync=api;
})(typeof window!=="undefined"?window:globalThis);
