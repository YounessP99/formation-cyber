/* ============================================================
   MODULES AU FORMAT 2 — un module est une suite d'étapes, une idée par étape.
   Ordre fixe d'une étape : mots nouveaux → idée → image → exemple pas à pas
   → activité(s) → encadré « À quoi ça sert en cyber ».
   L'étape suivante ne s'ouvre qu'une fois chaque activité de l'étape validée
   (réussie, ou ratée avec la correction affichée).
   ============================================================ */
const KEYE="formation.cyber.etapes.v1";
let avance={};
try{const r=localStorage.getItem(KEYE); if(r) avance=JSON.parse(r)||{};}catch(e){}
function saveAvance(){try{localStorage.setItem(KEYE,JSON.stringify(avance))}catch(e){}}

function monterActivite(el,spec,ctx){
  const f=ACTIVITES[spec.type];
  if(!f){el.innerHTML=`<div class="err">Activité inconnue : <code>${spec.type}</code>.</div>`;return;}
  f(el,spec,ctx);
}
const paras=v=>(Array.isArray(v)?v:[v]).map(t=>`<p>${t}</p>`).join("");
const activitesDe=e=>e.activites||(e.activite?[e.activite]:[]);
function listeEtapes(mod){
  return mod.parties.flatMap((p,pi)=>p.etapes.map(e=>({...e,partie:p.titre,pi})));
}

/* exemple déroulé une ligne à la fois ; tout est visible d'emblée si l'étape est déjà faite */
function monterExemple(el,ex,tout){
  const lignes=ex.lignes||[];
  let vus=tout?lignes.length:1;
  el.innerHTML=`${ex.intro?`<p>${ex.intro}</p>`:""}
    <pre class="deroule">${lignes.map((l,i)=>`<span class="ln" data-i="${i}"${i<vus?"":" hidden"}>${l}\n</span>`).join("")}</pre>
    <div class="row pas"${vus>=lignes.length?" hidden":""}><button type="button" class="act ghost" data-a="ligne">Ligne suivante</button><button type="button" class="act ghost" data-a="tout">Tout afficher</button></div>
    ${ex.conclusion?`<div class="concl"${vus>=lignes.length?"":" hidden"}><p>${ex.conclusion}</p></div>`:""}`;
  const montrer=k=>{
    vus=Math.min(lignes.length,k);
    el.querySelectorAll(".ln").forEach(s=>s.hidden=+s.dataset.i>=vus);
    if(vus>=lignes.length){
      el.querySelector(".pas").hidden=true;
      const c=el.querySelector(".concl"); if(c) c.hidden=false;
    }
  };
  el.querySelector('[data-a="ligne"]').onclick=()=>{
    montrer(vus+1);
    if(vus>=lignes.length){const c=el.querySelector(".concl");(c||el).scrollIntoView({block:"nearest"});}
  };
  el.querySelector('[data-a="tout"]').onclick=()=>montrer(lignes.length);
}

function renderModuleV2(mod){
  const E=listeEtapes(mod);
  const faites=()=>Math.min(avance[mod.id]||0,E.length);
  const ev=mod.evaluation||{};
  view.innerHTML=`
    <p class="meta">Niveau ${mod.level}, module ${mod.id}${mod.duration?", "+mod.duration:""}</p>
    <h1>${mod.title}</h1>
    <p class="sub">${mod.subtitle||""}</p>
    <div class="why"><p>${mod.why}</p></div>
    <div class="avance" aria-live="polite"><span>Étape <b id="av-n">1</b> sur ${E.length}</span><div class="pbar"><i id="av-bar"></i></div></div>
    <div id="etapes"></div>
    <div id="fin"></div>
    <div class="row">
      <button class="act ghost" id="back">Retour au sommaire</button>
      <button class="act ghost" id="reset">Recommencer le module</button>
    </div>`;
  document.getElementById("back").onclick=renderIndex;
  document.getElementById("reset").onclick=()=>{avance[mod.id]=0;saveAvance();renderModuleV2(mod);};
  const zone=document.getElementById("etapes");

  function peindreAvance(k){
    document.getElementById("av-n").textContent=Math.min(k+1,E.length);
    document.getElementById("av-bar").style.width=Math.round(faites()/E.length*100)+"%";
  }

  function ajouter(k,dejaFaite){
    const e=E[k], acts=activitesDe(e);
    const sec=document.createElement("section");
    sec.className="etape"; sec.id="etape-"+(k+1); sec.dataset.notion=e.notion||"";
    const nouvellePartie=k===0||E[k-1].pi!==e.pi;
    sec.innerHTML=`${nouvellePartie?`<p class="partie"><small>Partie ${e.pi+1} sur ${mod.parties.length}</small>${e.partie}</p>`:""}
      <p class="etape-n">Étape ${k+1} sur ${E.length}</p>
      <h2 tabindex="-1">${e.titre}</h2>
      ${e.mots&&e.mots.length?`<div class="mots"><p class="lbl">${e.mots.length>1?"Mots nouveaux":"Mot nouveau"}</p><dl>${e.mots.map(m=>`<div><dt>${m.m}</dt><dd>${m.d}</dd></div>`).join("")}</dl></div>`:""}
      <p class="lbl">L'idée</p><div class="idee">${paras(e.idee)}</div>
      ${e.image?`<p class="lbl">Dans la vie</p><div class="image">${paras(e.image)}</div>`:""}
      ${e.exemple?`<p class="lbl">Pas à pas</p><div class="exemple"></div>`:""}
      <p class="lbl">À toi</p>
      ${acts.map((a,j)=>`<div class="ex activite" data-j="${j}"></div>`).join("")}
      ${e.cyber?`<div class="cyber"${dejaFaite?"":" hidden"}><p class="lbl">À quoi ça sert en cyber</p>${paras(e.cyber)}</div>`:""}
      ${dejaFaite?"":`<div class="row suite"><button class="act" data-a="suite" disabled>${k+1<E.length?"Étape suivante":"Passer à l'évaluation"}</button><span class="aide">Fais l'activité pour continuer.</span></div>`}`;
    zone.appendChild(sec);
    if(e.exemple) monterExemple(sec.querySelector(".exemple"),e.exemple,dejaFaite);

    const validees=new Set();
    sec.querySelectorAll(".activite").forEach(el=>{
      const j=+el.dataset.j;
      monterActivite(el,acts[j],{examen:false,fini(){
        validees.add(j);
        if(!dejaFaite&&validees.size===acts.length) debloquer();
      }});
    });
    function debloquer(){
      const b=sec.querySelector('[data-a="suite"]'); if(!b||!b.disabled) return;
      b.disabled=false;
      sec.querySelector(".suite .aide").textContent="";
      const c=sec.querySelector(".cyber"); if(c) c.hidden=false;
    }
    const suite=sec.querySelector('[data-a="suite"]');
    if(suite) suite.onclick=()=>{
      avance[mod.id]=Math.max(faites(),k+1); saveAvance();
      sec.querySelector(".suite").remove();
      if(k+1<E.length){
        ajouter(k+1,false);
        const h=document.querySelector(`#etape-${k+2} h2`);
        h.scrollIntoView({behavior:"smooth",block:"start"}); h.focus({preventScroll:true});
      }else{
        afficherEvaluation();
        document.getElementById("fin").scrollIntoView({behavior:"smooth",block:"start"});
      }
      peindreAvance(k+1);
    };
  }

  /* évaluation : épreuves tirées de la banque, une notion différente à chaque fois tant que possible.
     Le validateur garantit que chaque épreuve porte sur une notion pratiquée dans une étape. */
  function afficherEvaluation(){
    const count=ev.count||5, pass=ev.pass||4, banque=ev.banque||[];
    const fin=document.getElementById("fin");
    fin.innerHTML=`<div class="eval">
      <p class="tag-ex">Évaluation du module</p>
      <p>${count} épreuves, sans correction avant la fin. Il en faut <strong>${pass} sur ${count}</strong> pour valider le module. Chacune porte sur une notion que tu as manipulée dans une étape.</p>
      <div class="row"><button class="act" id="go-eval">Lancer l'évaluation</button></div>
      <div id="eval-body"></div></div>`;
    document.getElementById("go-eval").onclick=()=>lancer(count,pass,banque);
  }
  function lancer(count,pass,banque){
    const vues=new Set(), tirage=[], reste=[];
    melanger(banque).forEach(it=>{ if(!vues.has(it.notion)){vues.add(it.notion);tirage.push(it);} else reste.push(it); });
    const items=[...tirage,...reste].slice(0,count);
    const body=document.getElementById("eval-body");
    document.getElementById("go-eval").hidden=true;
    let i=0, bons=0; const erreurs=[];
    function suivante(){
      if(i>=items.length) return bilan();
      body.innerHTML=`<div class="pbar"><i style="width:${i/items.length*100}%"></i></div>
        <p class="tag-ex" style="color:var(--muted)">Épreuve ${i+1} sur ${items.length}</p><div class="activite"></div>`;
      const el=body.querySelector(".activite"), it=items[i];
      monterActivite(el,it,{examen:true,fini(ok,html){
        if(ok) bons++;
        else{
          const c=el.querySelector(".consigne");
          erreurs.push({n:i+1,notion:it.notion,titre:c?c.textContent:"",html});
        }
        i++; suivante();
      }});
    }
    function bilan(){
      const ok=bons>=pass;
      if(ok){prog[mod.id]=true;save();paintGlobal();}
      const etapeDe=notion=>E.findIndex(e=>e.notion===notion);
      body.innerHTML=`<div class="pbar"><i style="width:100%"></i></div>
        <div class="big">${bons} / ${items.length}</div>
        <p class="gate">${ok?"Module validé.":"Pas encore. Reprends les étapes indiquées ci-dessous, puis relance."}</p>
        <div class="row" style="justify-content:center"><button class="act ghost" id="re">Relancer</button></div>
        ${erreurs.length?`<div class="recap"><h3>Corrigé</h3>${erreurs.map(x=>{
          const k=etapeDe(x.notion);
          return `<div class="corr" data-ok="0"><h4>Épreuve ${x.n}${x.titre?" — "+x.titre:""}</h4>${x.html}${k>=0?`<p><button type="button" class="act ghost" data-revoir="${k+1}">Revoir l'étape ${k+1} : ${E[k].titre}</button></p>`:""}</div>`;
        }).join("")}</div>`:""}`;
      document.getElementById("re").onclick=()=>{document.getElementById("go-eval").hidden=false;body.innerHTML="";};
      body.querySelectorAll("[data-revoir]").forEach(b=>b.onclick=()=>{
        const h=document.querySelector(`#etape-${b.dataset.revoir} h2`);
        h.scrollIntoView({behavior:"smooth",block:"start"}); h.focus({preventScroll:true});
      });
    }
    suivante();
  }

  const nb=faites();
  for(let k=0;k<=Math.min(nb,E.length-1);k++) ajouter(k,k<nb);
  if(nb>=E.length) afficherEvaluation();
  peindreAvance(Math.min(nb,E.length-1));
  window.scrollTo(0,0);
}
