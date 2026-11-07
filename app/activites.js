/* ============================================================
   ACTIVITÉS — composants interactifs des modules au format 2.
   Une activité se déclare dans le JSON d'une étape : {"type":"bits", ...}.
   Chaque composant a la forme act<Nom>(el, spec, ctx) :
     ctx.examen  vrai pendant une évaluation : un seul essai, pas de correction affichée ;
     ctx.fini(ok, correctionHtml)  appelé à chaque validation.
   Pour en ajouter une : écrire act<Nom>() puis l'inscrire dans ACTIVITES.
   Les fonctions R, bin8, grp et shuffleQ viennent du moteur (index.html).
   ============================================================ */

const POIDS=[128,64,32,16,8,4,2,1];
const pad3=n=>String(n).padStart(3," ");
const melanger=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=R(i+1);[b[i],b[j]]=[b[j],b[i]];}return b;};
const normTrou=v=>String(v).replace(/\s+/g,"").toUpperCase();

function deroulerSoustractive(n){
  let reste=n; const rows=[];
  POIDS.forEach(p=>{
    const oui=reste>=p;
    rows.push(`<tr><td>${p}</td><td>${reste}</td><td>${oui?"oui":"non"}</td><td><b>${oui?1:0}</b></td><td>${oui?reste-p:reste}</td></tr>`);
    if(oui) reste-=p;
  });
  return `<p>On part de ${n} et on descend la table des poids. À chaque ligne : le poids rentre-t-il dans le reste ? Si oui, on écrit 1 et on le soustrait.</p>
    <div class="tscroll"><table class="soustr"><tr><th>Poids</th><th>Reste</th><th>Rentre ?</th><th>Bit</th><th>Après</th></tr>${rows.join("")}</table></div>
    <p>On lit la colonne Bit de haut en bas : ${n} = <b class="rep">${grp(bin8(n))}</b>.</p>`;
}
function sommePoids(n){
  const b=bin8(n), on=POIDS.filter((p,i)=>b[i]==="1");
  return on.length?`${on.join(" + ")} = <b>${n}</b>`:`aucun bit à 1 = <b>0</b>`;
}
function corrHtml(ok,html){
  return `<div class="corr" data-ok="${ok?1:0}"><h4>${ok?"Juste":"Pas encore — voici le raisonnement"}</h4>${html}</div>`;
}

/* Boutons communs : Vérifier (Valider en examen), et un bouton pour rejouer hors examen. */
function boutons(ctx,autre){
  return `<div class="row"><button type="button" class="act" data-a="ok">${ctx.examen?"Valider":"Vérifier"}</button>${!ctx.examen&&autre?`<button type="button" class="act ghost" data-a="new">${autre}</button>`:""}</div><div class="slot" aria-live="polite"></div>`;
}
function brancher(el,ctx,verifier,rejouer){
  const go=()=>{
    const [ok,html]=verifier();
    el.classList.remove("eclat","secousse"); void el.offsetWidth; el.classList.add(ok?"eclat":"secousse");
    if(!ctx.examen) el.querySelector(".slot").innerHTML=corrHtml(ok,html);
    ctx.fini(ok,html);
  };
  el.querySelector('[data-a="ok"]').onclick=go;
  el.querySelectorAll("input").forEach(i=>i.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();go();}}));
  const n=el.querySelector('[data-a="new"]'); if(n) n.onclick=rejouer;
}

/* ---------- interrupteurs de bits ----------
   mode "fabriquer" : allumer les bits d'un nombre donné (cible : nombre ou "aleatoire")
                      direct:true affiche la valeur en temps réel
   mode "lire"      : un octet est affiché, l'élève donne sa valeur (valeur : nombre ou "aleatoire") */
function actBits(el,spec,ctx){
  const lire=spec.mode==="lire";
  let n=null, premier=true;
  function tirer(){
    const fixe=lire?spec.valeur:spec.cible;
    if(premier&&typeof fixe==="number"){premier=false;return fixe;}
    premier=false;
    let x; do{x=1+R(254);}while(x===n);
    return x;
  }
  function tour(){
    n=tirer();
    const etat=lire?bin8(n).split("").map(Number):[0,0,0,0,0,0,0,0];
    const consigne=spec.consigne||(lire?"Combien vaut cet octet en décimal ?":"Allume les bits qui fabriquent ce nombre :");
    el.innerHTML=`<p class="consigne">${consigne}${lire?"":` <b class="cible">${n}</b>`}</p>
      <div class="bits${lire?" lecture":""}" role="group" aria-label="Huit bits, du poids 128 à gauche au poids 1 à droite">
        ${POIDS.map((p,i)=>`<button type="button" class="bit" data-i="${i}" aria-pressed="${etat[i]?"true":"false"}" aria-label="Bit de poids ${p}"${lire?" disabled":""}><span class="w">${p}</span><span class="led"></span><span class="v">${etat[i]}</span></button>`).join("")}
      </div>
      ${!lire&&spec.direct?`<p class="live">Valeur actuelle : <b>0</b></p>`:""}
      ${lire?`<div class="conv"><div class="cell"><span>Décimal</span><input inputmode="numeric" autocomplete="off" placeholder="0-255" aria-label="Valeur décimale"></div></div>`:""}
      ${boutons(ctx,"Autre nombre")}`;
    const val=()=>etat.reduce((a,b,i)=>a+b*POIDS[i],0);
    el.querySelectorAll(".bit").forEach(b=>b.onclick=()=>{
      const i=+b.dataset.i; etat[i]^=1;
      b.setAttribute("aria-pressed",etat[i]?"true":"false");
      b.querySelector(".v").textContent=etat[i];
      b.classList.remove("faux");
      const live=el.querySelector(".live b"); if(live) live.textContent=val();
    });
    brancher(el,ctx,()=>lire?verifLire():verifFabriquer(),tour);

    function verifFabriquer(){
      const v=val(), ok=v===n, cible=bin8(n);
      el.querySelectorAll(".bit").forEach((b,i)=>b.classList.toggle("faux",!ok&&String(etat[i])!==cible[i]));
      if(ok) return [true,`<p>${sommePoids(n)}.</p>`];
      const tes=v?POIDS.filter((p,i)=>etat[i]).join(" + ")+` = ${v}`:"0, aucun bit n'est allumé";
      return [false,`<p>Tes bits valent ${tes} : ${v<n?"il manque "+(n-v):"c'est "+(v-n)+" de trop"}. Les bits à changer sont entourés en rouge. La méthode, du plus gros poids au plus petit :</p>${deroulerSoustractive(n)}`];
    }
    function verifLire(){
      const raw=el.querySelector("input").value.trim(), v=parseInt(raw,10), ok=v===n;
      if(ok) return [true,`<p>${sommePoids(n)}.</p>`];
      const b=bin8(n), envers=parseInt([...b].reverse().join(""),2);
      let piege="";
      if(raw==="") piege="<p>Aucune réponse saisie.</p>";
      else if(v===envers) piege="<p>Tu as lu les poids à l'envers : le 128 est à gauche, le 1 à droite.</p>";
      else if(v===n*2) piege="<p>Ton résultat est le double du bon : tu as fait valoir 2 à la case de droite, alors qu'elle vaut 1.</p>";
      else if(v*2===n) piege="<p>Ton résultat est la moitié du bon : tu as fait valoir 64 à la case de gauche, alors qu'elle vaut 128.</p>";
      return [false,`${ctx.examen?`<p>Ta réponse : ${raw||"—"} · bonne réponse : <b>${n}</b></p>`:""}${piege}<p>On additionne les poids des cases à 1, et seulement eux :</p><pre>${POIDS.map(pad3).join("")}   <span class="c">poids</span>\n${[...b].map(pad3).join("")}   <span class="c">bits</span>\n\n${sommePoids(n)}</pre>`];
    }
  }
  tour();
}

/* ---------- remettre dans l'ordre ----------
   items : la liste dans le bon ordre (elle est mélangée à l'affichage), ou gen : un nom de ACT_GENS */
function actOrdre(el,spec,ctx){
  function tour(){
    const src=spec.gen?ACT_GENS[spec.gen]():spec;
    const bon=src.items;
    let cur;
    do{cur=melanger(bon.map((t,i)=>i));}while(cur.every((v,i)=>v===i));
    el.innerHTML=`<p class="consigne">${src.consigne||spec.consigne||"Remets dans le bon ordre."}</p>
      <p class="aide">Utilise les flèches, ou fais glisser les lignes à la souris.</p>
      <ol class="ordre"></ol>${boutons(ctx,spec.gen?"Autre série":"Mélanger à nouveau")}`;
    const ol=el.querySelector(".ordre");
    let depuis=null;
    function dessiner(){
      ol.innerHTML=cur.map((k,pos)=>`<li draggable="true" data-pos="${pos}"><span class="txt">${bon[k]}</span><span class="mv"><button type="button" data-up="${pos}" aria-label="Monter" ${pos===0?"disabled":""}>↑</button><button type="button" data-dn="${pos}" aria-label="Descendre" ${pos===cur.length-1?"disabled":""}>↓</button></span></li>`).join("");
      ol.querySelectorAll("[data-up]").forEach(b=>b.onclick=()=>bouger(+b.dataset.up,-1));
      ol.querySelectorAll("[data-dn]").forEach(b=>b.onclick=()=>bouger(+b.dataset.dn,1));
      ol.querySelectorAll("li").forEach(li=>{
        li.addEventListener("dragstart",e=>{depuis=+li.dataset.pos;li.classList.add("drag");e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain","");});
        li.addEventListener("dragend",()=>li.classList.remove("drag"));
        li.addEventListener("dragover",e=>e.preventDefault());
        li.addEventListener("drop",e=>{
          e.preventDefault();
          const vers=+li.dataset.pos;
          if(depuis===null||depuis===vers) return;
          const [x]=cur.splice(depuis,1); cur.splice(vers,0,x); depuis=null; dessiner();
        });
      });
    }
    /* après un déplacement au clavier, le focus suit la ligne déplacée */
    function bouger(pos,d){
      const t=pos+d; [cur[pos],cur[t]]=[cur[t],cur[pos]]; dessiner();
      const btn=ol.querySelector(`[data-${d<0?"up":"dn"}="${t}"]:not([disabled])`)||ol.querySelector(`li[data-pos="${t}"] button:not([disabled])`);
      if(btn) btn.focus();
    }
    dessiner();
    brancher(el,ctx,()=>{
      const ok=cur.every((k,i)=>k===i);
      ol.querySelectorAll("li").forEach((li,i)=>{li.classList.toggle("good",cur[i]===i);li.classList.toggle("bad",cur[i]!==i);});
      const nb=cur.filter((k,i)=>k===i).length;
      const expl=src.explication?`<p>${src.explication}</p>`:"";
      if(ok) return [true,expl||"<p>Tout est à sa place.</p>"];
      return [false,`<p>${nb} ligne${nb>1?"s":""} sur ${bon.length} à la bonne place. L'ordre juste :</p><ol class="sol">${bon.map(t=>`<li>${t}</li>`).join("")}</ol>${expl}`];
    },tour);
  }
  tour();
}

/* ---------- texte à trous ----------
   texte : les réponses entre {{ }}, variantes acceptées séparées par | ; ou gen : un nom de ACT_GENS.
   explication : texte, ou fonction(réponsesDeLÉlève) pour les générateurs. */
function actTrous(el,spec,ctx){
  function tour(){
    const src=spec.gen?ACT_GENS[spec.gen]():spec;
    const reps=[];
    const html=src.texte.replace(/\{\{(.+?)\}\}/g,(_,a)=>{
      const alts=a.split("|"); reps.push(alts);
      const w=Math.max(2,...alts.map(x=>x.length));
      return `<input class="trou" data-k="${reps.length-1}" style="width:calc(${w}ch + 22px)" autocomplete="off" aria-label="Case ${reps.length}">`;
    });
    const consigne=src.consigne||spec.consigne;
    el.innerHTML=`${consigne?`<p class="consigne">${consigne}</p>`:""}<div class="trous">${html}</div>${boutons(ctx,spec.gen?"Autre exemple":null)}`;
    brancher(el,ctx,()=>{
      let ok=true;
      const champs=[...el.querySelectorAll("input.trou")];
      champs.forEach(i=>{
        const bon=reps[+i.dataset.k].some(r=>normTrou(r)===normTrou(i.value));
        i.classList.toggle("good",bon); i.classList.toggle("bad",!bon);
        if(!bon) ok=false;
      });
      const tes=champs.map(i=>i.value.trim());
      const expl=typeof src.explication==="function"?src.explication(tes):(src.explication||"");
      const sol=src.texte.replace(/\{\{(.+?)\}\}/g,(_,a)=>`<b class="rep">${a.split("|")[0]}</b>`);
      if(ok) return [true,expl?`<p>${expl}</p>`:"<p>Toutes les cases sont justes.</p>"];
      return [false,`${ctx.examen?`<p>Tes réponses : ${tes.map(t=>t||"—").join(" · ")}</p>`:""}<p>La version complète :</p><div class="trous sol">${sol}</div>${expl?`<p>${expl}</p>`:""}`];
    },tour);
  }
  tour();
}

/* ---------- choix unique (le QCM, devenu une activité parmi d'autres) ----------
   q, o (4 options), a (index de la bonne), w (correction) — options mélangées à chaque affichage */
function actChoix(el,spec,ctx){
  function tour(){
    const q=shuffleQ(spec);
    el.innerHTML=`<p class="consigne">${q.q}</p><div class="opts"></div><div class="slot" aria-live="polite"></div>`;
    const box=el.querySelector(".opts");
    q.o.forEach((t,i)=>{
      const b=document.createElement("button");
      b.type="button"; b.className="opt";
      b.innerHTML=`<span class="k">${"ABCD"[i]}</span><span>${t}</span>`;
      b.onclick=()=>{
        const ok=i===q.a;
        if(!ctx.examen){
          [...box.children].forEach((x,j)=>{x.disabled=true;if(j===q.a)x.classList.add("good");else if(j===i)x.classList.add("bad");});
          el.querySelector(".slot").innerHTML=corrHtml(ok,`<p>${q.w}</p>`)+`<div class="row"><button type="button" class="act ghost" data-a="new">Rejouer la question</button></div>`;
          el.querySelector('[data-a="new"]').onclick=tour;
        }
        ctx.fini(ok,`<p>Ta réponse : ${t}<br>Bonne réponse : <b>${q.o[q.a]}</b></p><p>${q.w}</p>`);
      };
      box.appendChild(b);
    });
  }
  tour();
}

/* ---------- classer dans des catégories ----------
   categories : les noms des cases ; items : [{t, c, w}] — t le texte, c l'index de la bonne case,
   w la raison affichée en correction ; ou gen : un nom de ACT_GENS.
   Au toucher ou au clavier : on choisit une étiquette, puis la case. À la souris : glisser-déposer. */
function actClasser(el,spec,ctx){
  function tour(){
    const src=spec.gen?ACT_GENS[spec.gen]():spec;
    const cats=src.categories, items=melanger(src.items.map((it,i)=>({...it,i})));
    const place={}; let sel=null;
    el.innerHTML=`<p class="consigne">${src.consigne||spec.consigne||"Range chaque étiquette dans la bonne case."}</p>
      <p class="aide">Touche une étiquette, puis le nom de la case où la ranger. À la souris, tu peux aussi la faire glisser.</p>
      <div class="pool"></div>
      <div class="bacs">${cats.map((c,k)=>`<div class="bac" data-cat="${k}"><button type="button" class="bac-t" data-cat="${k}">${c}</button><div class="bac-in"></div></div>`).join("")}</div>
      ${boutons(ctx,spec.gen?"Autre série":"Recommencer")}`;
    const pool=el.querySelector(".pool");
    function dessiner(){
      pool.innerHTML=""; el.querySelectorAll(".bac-in").forEach(b=>b.innerHTML="");
      items.forEach(it=>{
        const b=document.createElement("button");
        b.type="button"; b.className="chip"; b.draggable=true; b.dataset.i=it.i;
        b.innerHTML=it.t; b.setAttribute("aria-pressed",sel===it.i?"true":"false");
        b.onclick=()=>{sel=sel===it.i?null:it.i;dessiner();const f=el.querySelector(`.chip[data-i="${it.i}"]`);if(f)f.focus();};
        b.addEventListener("dragstart",e=>{sel=it.i;e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain","");});
        (place[it.i]===undefined?pool:el.querySelector(`.bac[data-cat="${place[it.i]}"] .bac-in`)).appendChild(b);
      });
      pool.hidden=!items.some(it=>place[it.i]===undefined);
      el.querySelectorAll(".bac").forEach(b=>b.classList.toggle("cible-active",sel!==null));
    }
    function ranger(k){
      if(sel===null) return;
      place[sel]=k; const i=sel; sel=null; dessiner();
      const f=el.querySelector(`.chip[data-i="${i}"]`); if(f) f.focus();
    }
    el.querySelectorAll(".bac-t").forEach(b=>b.onclick=()=>ranger(+b.dataset.cat));
    el.querySelectorAll(".bac").forEach(b=>{
      b.addEventListener("dragover",e=>e.preventDefault());
      b.addEventListener("drop",e=>{e.preventDefault();ranger(+b.dataset.cat);});
    });
    dessiner();
    brancher(el,ctx,()=>{
      const faux=items.filter(it=>place[it.i]!==it.c);
      el.querySelectorAll(".chip").forEach(b=>{
        const it=items.find(x=>x.i===+b.dataset.i);
        b.classList.toggle("good",place[it.i]===it.c); b.classList.toggle("bad",place[it.i]!==it.c);
      });
      const expl=src.explication?`<p>${src.explication}</p>`:"";
      if(!faux.length) return [true,expl||"<p>Tout est bien rangé.</p>"];
      return [false,`<p>${items.length-faux.length} étiquette${items.length-faux.length>1?"s":""} sur ${items.length} bien rangée${items.length-faux.length>1?"s":""}. À corriger :</p><ul class="sol">${faux.map(it=>`<li><b class="rep">${it.t}</b> va dans <b>${cats[it.c]}</b>${place[it.i]===undefined?" (pas rangée)":""}${it.w?" : "+it.w:""}</li>`).join("")}</ul>${expl}`];
    },tour);
  }
  tour();
}

/* ---------- relier deux colonnes ----------
   paires : [[gauche, droite, raison], ...] ; titres : [titre gauche, titre droite] ; ou gen.
   On choisit un élément d'une colonne, puis son partenaire dans l'autre, dans l'ordre qu'on veut. */
function actRelier(el,spec,ctx){
  function tour(){
    const src=spec.gen?ACT_GENS[spec.gen]():spec;
    const P=src.paires, ordreD=melanger(P.map((p,i)=>i)), titres=src.titres||spec.titres||["",""];
    const lien={}; let selG=null, selD=null;
    el.innerHTML=`<p class="consigne">${src.consigne||spec.consigne||"Relie chaque élément de gauche à son partenaire de droite."}</p>
      <p class="aide">Touche un élément d'une colonne, puis son partenaire dans l'autre. Le numéro montre les liens faits.</p>
      <div class="relier">
        <div class="col">${titres[0]?`<p class="col-t">${titres[0]}</p>`:""}<div class="col-g"></div></div>
        <div class="col">${titres[1]?`<p class="col-t">${titres[1]}</p>`:""}<div class="col-d"></div></div>
      </div>${boutons(ctx,spec.gen?"Autre série":"Recommencer")}`;
    const gaucheDe=j=>Object.keys(lien).map(Number).find(i=>lien[i]===j);
    function dessiner(focus){
      el.querySelector(".col-g").innerHTML=P.map((p,i)=>`<button type="button" class="lien" data-g="${i}" aria-pressed="${selG===i}"><span class="num">${i+1}</span><span class="t">${p[0]}</span></button>`).join("");
      el.querySelector(".col-d").innerHTML=ordreD.map(j=>{const g=gaucheDe(j);return `<button type="button" class="lien" data-d="${j}" aria-pressed="${selD===j}"><span class="num">${g===undefined?"·":g+1}</span><span class="t">${P[j][1]}</span></button>`;}).join("");
      el.querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>{const i=+b.dataset.g; if(selD!==null){relier(i,selD,`[data-g="${i}"]`);} else {selG=selG===i?null:i;dessiner(`[data-g="${i}"]`);}});
      el.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{const j=+b.dataset.d; if(selG!==null){relier(selG,j,`[data-d="${j}"]`);} else {selD=selD===j?null:j;dessiner(`[data-d="${j}"]`);}});
      if(focus){const f=el.querySelector(focus); if(f) f.focus();}
    }
    function relier(i,j,focus){
      const ancien=gaucheDe(j); if(ancien!==undefined) delete lien[ancien];
      lien[i]=j; selG=null; selD=null; dessiner(focus);
    }
    dessiner();
    brancher(el,ctx,()=>{
      const faux=P.map((p,i)=>i).filter(i=>lien[i]!==i);
      el.querySelectorAll("[data-g]").forEach(b=>{const i=+b.dataset.g;b.classList.toggle("good",lien[i]===i);b.classList.toggle("bad",lien[i]!==i);});
      const expl=src.explication?`<p>${src.explication}</p>`:"";
      if(!faux.length) return [true,expl||"<p>Tous les liens sont justes.</p>"];
      return [false,`<p>${P.length-faux.length} lien${P.length-faux.length>1?"s":""} juste${P.length-faux.length>1?"s":""} sur ${P.length}. Les bons liens :</p><ul class="sol">${faux.map(i=>`<li><b class="rep">${P[i][0]}</b> ↔ <b class="rep">${P[i][1]}</b>${P[i][2]?" : "+P[i][2]:""}</li>`).join("")}</ul>${expl}`];
    },tour);
  }
  tour();
}

/* ---------- cliquer sur la bonne zone ----------
   segments : les morceaux affichés ; bons : les index des bons morceaux ; multi : plusieurs à choisir.
   ou gen. Le morceau choisi se valide ensuite avec Vérifier. */
function actZone(el,spec,ctx){
  function tour(){
    const src=spec.gen?ACT_GENS[spec.gen]():spec;
    const seg=src.segments, bons=new Set(src.bons), multi=src.multi||spec.multi;
    const choisis=new Set();
    el.innerHTML=`<p class="consigne">${src.consigne||spec.consigne}</p>
      <div class="zone${src.lignes?" lignes":""}" role="group">${seg.map((s,i)=>`<button type="button" class="seg" data-i="${i}" aria-pressed="false">${s}</button>`).join("")}</div>
      ${boutons(ctx,spec.gen?"Autre exemple":null)}`;
    el.querySelectorAll(".seg").forEach(b=>b.onclick=()=>{
      const i=+b.dataset.i;
      if(choisis.has(i)) choisis.delete(i); else { if(!multi) choisis.clear(); choisis.add(i); }
      el.querySelectorAll(".seg").forEach(x=>{x.setAttribute("aria-pressed",choisis.has(+x.dataset.i)?"true":"false");x.classList.remove("good","bad","rate");});
    });
    brancher(el,ctx,()=>{
      const ok=choisis.size===bons.size&&[...choisis].every(i=>bons.has(i));
      el.querySelectorAll(".seg").forEach(x=>{
        const i=+x.dataset.i;
        x.classList.toggle("good",choisis.has(i)&&bons.has(i));
        x.classList.toggle("bad",choisis.has(i)&&!bons.has(i));
        x.classList.toggle("rate",!ok&&!choisis.has(i)&&bons.has(i));
      });
      const expl=typeof src.explication==="function"?src.explication([...choisis]):(src.explication||"");
      if(ok) return [true,`<p>${expl||"C'est la bonne zone."}</p>`];
      const tes=choisis.size?[...choisis].map(i=>`<b class="rep">${seg[i]}</b>`).join(", "):"rien";
      return [false,`<p>Tu as choisi ${tes}. La bonne zone : ${[...bons].map(i=>`<b class="rep">${seg[i]}</b>`).join(", ")}${ctx.examen?"":", entourée en pointillés"}.</p>${expl?`<p>${expl}</p>`:""}`];
    },tour);
  }
  tour();
}

/* ---------- opération bit à bit ----------
   Deux octets sont posés l'un sous l'autre, l'élève allume les bits du résultat colonne par colonne.
   op : "ET", "OU", "XOR" ou "aleatoire" ; a, b : nombres ou "aleatoire". */
const OPS={
  ET:{f:(x,y)=>x&y,regle:"1 seulement si les deux bits valent 1"},
  OU:{f:(x,y)=>x|y,regle:"1 si au moins un des deux bits vaut 1"},
  XOR:{f:(x,y)=>x^y,regle:"1 si les deux bits sont différents"}
};
function actOperation(el,spec,ctx){
  let premier=true;
  function tour(){
    const fixe=k=>premier&&typeof spec[k]==="number"?spec[k]:null;
    const op=spec.op&&spec.op!=="aleatoire"?spec.op:["ET","OU","XOR"][R(3)];
    const a=fixe("a")??R(256), b=fixe("b")??R(256), r=OPS[op].f(a,b);
    premier=false;
    const A=bin8(a), B=bin8(b), Rb=bin8(r), etat=[0,0,0,0,0,0,0,0];
    const cases=(s,d)=>[...s.slice(d,d+4)].map(c=>`<span class="cel">${c}</span>`).join("");
    const bloc=d=>`<div class="op-bloc"><span class="lbl-op"></span>${cases(A,d)}<span class="lbl-op">${op}</span>${cases(B,d)}<span class="lbl-op">=</span>${[0,1,2,3].map(k=>`<button type="button" class="bit res" data-i="${d+k}" aria-pressed="false" aria-label="Bit ${d+k+1} du résultat"><span class="v">0</span></button>`).join("")}</div>`;
    el.innerHTML=`<p class="consigne">${spec.consigne||`Calcule <b class="cible">${op}</b> colonne par colonne : allume les bits du résultat.`}</p>
      <div class="op" role="group" aria-label="Opération ${op} sur deux octets">
        ${bloc(0)}${bloc(4)}
      </div>
      ${boutons(ctx,"Autre calcul")}`;
    el.querySelectorAll(".res").forEach(btn=>btn.onclick=()=>{
      const i=+btn.dataset.i; etat[i]^=1;
      btn.setAttribute("aria-pressed",etat[i]?"true":"false"); btn.querySelector(".v").textContent=etat[i]; btn.classList.remove("faux");
    });
    brancher(el,ctx,()=>{
      const tes=etat.join(""), ok=tes===Rb;
      el.querySelectorAll(".res").forEach((x,i)=>x.classList.toggle("faux",!ok&&tes[i]!==Rb[i]));
      const sol=`<pre>  ${grp(A)}\n  ${grp(B)}\n  ───────── ${op}\n  <b>${grp(Rb)}</b></pre>`;
      if(ok) return [true,`<p>Règle du ${op} : ${OPS[op].regle}.</p>${sol}`];
      const faux=[...Rb].map((c,i)=>i).filter(i=>tes[i]!==Rb[i]);
      return [false,`${ctx.examen?`<p>Ta réponse : ${grp(tes)}</p>`:""}<p>Règle du ${op} : ${OPS[op].regle}. ${faux.length} colonne${faux.length>1?"s":""} à corriger, entourée${faux.length>1?"s":""} en rouge :</p><ul class="sol">${faux.slice(0,4).map(i=>`<li>colonne ${i+1} : ${A[i]} ${op} ${B[i]} = <b>${Rb[i]}</b></li>`).join("")}${faux.length>4?"<li>…</li>":""}</ul>${sol}`];
    },tour);
  }
  tour();
}

const ACTIVITES={bits:actBits,ordre:actOrdre,trous:actTrous,choix:actChoix,classer:actClasser,relier:actRelier,zone:actZone,operation:actOperation};

/* hexadécimal : un chiffre ↔ 4 bits */
const HEXA="0123456789ABCDEF";
const nib=d=>d.toString(2).padStart(4,"0");
const detailNib=d=>{
  const p=[8,4,2,1].filter(w=>d&w);
  return `${nib(d)} = ${p.length?p.join(" + "):"0"}${p.length>1?` = ${d}`:""}${d>9?` = ${HEXA[d]}`:""}`;
};

/* ============================================================
   GÉNÉRATEURS D'ACTIVITÉS — produisent le contenu d'une activité à chaque tirage.
   Ils retournent les mêmes champs que la spec statique (texte, items, consigne, explication).
   ============================================================ */
const ACT_GENS={
  /* décomposer un nombre de 3 chiffres en centaines, dizaines, unités */
  decompo10(){
    const c=1+R(9), d=R(3)===0?0:R(10), u=R(10), n=c*100+d*10+u;
    return {
      consigne:"Décompose ce nombre : combien de centaines, de dizaines, d'unités ?",
      texte:`<b class="cible">${n}</b> = <span class="nw">{{${c}}} × 100</span> + <span class="nw">{{${d}}} × 10</span> + <span class="nw">{{${u}}} × 1</span>`,
      explication:tes=>{
        const envers=tes.join(",")===`${u},${d},${c}`&&!(u===c);
        return `${envers?"Tu as lu le nombre de droite à gauche. ":""}Le chiffre de gauche compte les centaines, celui du milieu les dizaines, celui de droite les unités : ${c} × 100 + ${d} × 10 + ${u} × 1 = ${c*100} + ${d*10} + ${u} = ${n}.${d===0?" Le 0 du milieu compte : il dit « aucune dizaine », et c'est lui qui garde le "+c+" à la place des centaines.":""}`;
      }
    };
  },
  /* compter en binaire : trois nombres consécutifs donnés, les deux suivants à écrire */
  suiteBinaire(){
    const k=1+R(12), b=x=>x.toString(2);
    const plusUn=x=>{
      const s=b(x), t=s.length-s.replace(/1+$/,"").length;
      if(t===0) return `${s} se termine par 0 : ce 0 devient 1, rien d'autre ne bouge → ${b(x+1)}`;
      if(t===s.length) return `${s} ne contient que des 1 : ils repassent tous à 0, et un 1 apparaît à gauche → ${b(x+1)}`;
      return `${s} se termine par ${t===1?"un 1":t+" fois 1"} : ${t===1?"il repasse":"ils repassent"} à 0, et le 0 juste à gauche devient 1 → ${b(x+1)}`;
    };
    return {
      consigne:"On compte en binaire. Écris les deux nombres suivants.",
      texte:`${b(k)}, ${b(k+1)}, ${b(k+2)}, {{${b(k+3)}}}, {{${b(k+4)}}}`,
      explication:tes=>`${tes[0]===String(k+3)&&tes[1]===String(k+4)?"Tu as écrit les nombres en décimal : ici, on les écrit avec des 0 et des 1. ":""}Pour ajouter 1, on part de la droite. ${plusUn(k+2)}. Puis ${plusUn(k+3)}.`
    };
  },
  /* compléter la table des poids d'un octet (le 1 de droite reste visible comme point d'appui) */
  poids(){
    const caches=melanger([0,1,2,3,4,5,6]).slice(0,3);
    return {
      consigne:"Complète la table des poids d'un octet.",
      texte:POIDS.map((p,i)=>caches.includes(i)?`{{${p}}}`:`<b>${p}</b>`).join(" · "),
      explication:()=>"La case de droite vaut 1, et chaque case vaut le double de sa voisine de droite : 1, 2, 4, 8, 16, 32, 64, 128. Lue de gauche à droite, chaque case vaut la moitié de sa voisine."
    };
  },
  /* relier 5 chiffres hexadécimaux (dont au moins 2 lettres) à leurs 4 bits */
  relierNibble(){
    const lettres=melanger([10,11,12,13,14,15]).slice(0,2+R(2));
    const chiffres=melanger([0,1,2,3,4,5,6,7,8,9]).slice(0,5-lettres.length);
    const d=melanger([...lettres,...chiffres]);
    return {
      consigne:"Relie chaque chiffre hexadécimal à ses 4 bits.",
      titres:["Hexa","Binaire"],
      paires:d.map(x=>[HEXA[x],nib(x),detailNib(x)]),
      explication:"Pour retrouver un lien, on additionne les poids 8, 4, 2, 1 des bits à 1, puis on traduit 10 à 15 en A à F."
    };
  },
  /* classer des écritures selon ce que leur préfixe annonce ; sans préfixe, c'est le contexte qui décide */
  bases(){
    const cats=["Binaire, préfixe 0b","Hexadécimal, préfixe 0x","Sans préfixe : le contexte décide"];
    const b=k=>Array.from({length:k},(_,i)=>i===0?"1":String(R(2))).join("");
    const items=melanger([
      {t:"0x"+hex2(160+R(96)),c:1,w:"le préfixe 0x annonce de l'hexadécimal"},
      {t:"0x"+(10+R(90)),c:1,w:"le préfixe 0x annonce de l'hexadécimal, même sans lettre"},
      {t:"0b"+b(4+R(5)),c:0,w:"le préfixe 0b annonce du binaire"},
      {t:"0b10",c:0,w:"le préfixe 0b annonce du binaire : ici, deux"},
      {t:(()=>{let x;do{x=String(20+R(230));}while(/^[01]+$/.test(x));return x;})(),c:2,w:"aucun préfixe : du décimal dans la vie courante, mais un outil qui affiche des octets peut écrire de l'hexadécimal sans préfixe"},
      {t:b(3+R(2)),c:2,w:"aucun préfixe : ce peut être du décimal ou du binaire, seul le contexte le dit"}
    ]);
    return {
      consigne:"Range chaque nombre selon la base dans laquelle il est écrit.",
      categories:cats, items,
      explication:"Le préfixe annonce la base : 0x pour l'hexadécimal, 0b pour le binaire. Sans préfixe, l'écriture seule ne suffit pas : il faut savoir ce qu'on lit."
    };
  },
  /* 32 bits en 8 groupes de 4 : cliquer sur le groupe qui s'écrit d'un chiffre hexa donné (unique) */
  zoneNibble(){
    let d, uniques;
    do{ d=Array.from({length:8},()=>R(16)); uniques=d.filter(x=>d.indexOf(x)===d.lastIndexOf(x)); }while(!uniques.length);
    const cible=uniques[R(uniques.length)], k=d.indexOf(cible);
    return {
      consigne:`Voici 32 bits, en 8 groupes de 4. Clique sur le groupe qui s'écrit <b class="cible">${HEXA[cible]}</b> en hexadécimal.`,
      segments:d.map(nib), bons:[k],
      explication:ch=>{
        const tes=ch.length===1&&ch[0]!==k?`Le groupe que tu as choisi : ${detailNib(d[ch[0]])}. `:"";
        return `${tes}Le chiffre ${HEXA[cible]} vaut ${cible}, soit ${[8,4,2,1].filter(w=>cible&w).join(" + ")||"0"} : ${nib(cible)}. C'est le groupe n° ${k+1}.`;
      }
    };
  },
  /* hexa vers binaire ou binaire vers hexa, un nibble à la fois */
  hexBin(){
    const n=R(256), h=hex2(n), b=bin8(n), haut=n>>4, bas=n&15;
    return R(2)===0?{
      consigne:"Traduis chaque chiffre hexadécimal en 4 bits.",
      texte:`<b class="cible">0x${h}</b> = <span class="nw">{{${grp(b)}}}</span>`,
      explication:()=>`Chaque caractère se traduit seul : ${HEXA[haut]} → ${detailNib(haut)}, puis ${HEXA[bas]} → ${detailNib(bas)}. On colle : ${grp(b)}.`
    }:{
      consigne:"Coupe l'octet en deux nibbles et traduis chacun en hexadécimal.",
      texte:`<b class="cible">${grp(b)}</b> = 0x<span class="nw">{{${h}|0x${h}}}</span>`,
      explication:()=>`Nibble de gauche : ${detailNib(haut)}. Nibble de droite : ${detailNib(bas)}. Résultat : 0x${h}.`
    };
  },
  /* construire le second octet à partir d'un besoin */
  construireMasque(){
    const P=POIDS[R(8)], k=1+R(4), s=k>1?"s":"";
    const cas=[
      {b:`mettre à 0 le${k>1?"s "+k:""} bit${s} de droite`,op:"ET",m:(0xFF<<k)&0xFF},
      {b:`garder seulement le${k>1?"s "+k:""} bit${s} de gauche`,op:"ET",m:(0xFF<<(8-k))&0xFF},
      {b:`garder seulement le${k>1?"s "+k:""} bit${s} de droite`,op:"ET",m:(1<<k)-1},
      {b:`mettre à 0 le bit de poids ${P}`,op:"ET",m:0xFF^P},
      {b:`allumer le bit de poids ${P}`,op:"OU",m:P},
      {b:`mettre à 1 le${k>1?"s "+k:""} bit${s} de gauche`,op:"OU",m:(0xFF<<(8-k))&0xFF},
      {b:`inverser le bit de poids ${P}`,op:"XOR",m:P},
      {b:`inverser le${k>1?"s "+k:""} bit${s} de droite`,op:"XOR",m:(1<<k)-1}
    ][R(8)];
    const regle=cas.op==="ET"?"avec ET, 1 sous ce qu'on garde, 0 sous ce qu'on efface":cas.op==="OU"?"avec OU, 1 sous ce qu'on allume, 0 partout ailleurs":"avec XOR, 1 sous ce qu'on inverse, 0 partout ailleurs";
    return {
      consigne:"Écris le second octet qui répond à ce besoin.",
      texte:`Besoin : ${cas.b}, avec un <b>${cas.op}</b>.<br>Second octet : <span class="nw">{{${grp(bin8(cas.m))}}}</span>`,
      explication:()=>`La règle : ${regle}. Pour « ${cas.b} », cela donne ${grp(bin8(cas.m))}.`
    };
  },
  /* tester un bit avec un ET : résultat nul, bit éteint */
  testerBit(){
    const n=R(256), P=POIDS[R(8)], r=n&P, on=r!==0;
    return {
      consigne:`Le bit de poids ${P} de cet octet est-il allumé ? Fais le ET, puis conclus.`,
      texte:`<span class="nw"><b class="rep">${grp(bin8(n))}</b></span> ET <span class="nw"><b class="rep">${grp(bin8(P))}</b></span> = <span class="nw">{{${grp(bin8(r))}}}</span>, donc le bit est {{${on?"allumé|allume":"éteint|eteint"}}}.`,
      explication:()=>`Le second octet n'a qu'un 1, au poids ${P} : le ET efface tout le reste. Le résultat vaut ${on?P+", pas 0 : le bit est allumé":"0 : le bit est éteint"}.`
    };
  },
  /* convertir un octet, dans un sens ou dans l'autre, en passant par le binaire */
  convHex(){
    const n=16+R(240), h=hex2(n), b=bin8(n), haut=n>>4, bas=n&15;
    const somme=POIDS.filter((p,i)=>b[i]==="1").join(" + ");
    const versHexa=R(2)===0;
    return versHexa?{
      consigne:"Écris ce nombre décimal en binaire, puis en hexadécimal.",
      texte:`<b class="cible">${n}</b> = {{${grp(b)}}} = 0x{{${h}|0x${h}}}`,
      explication:()=>`Méthode soustractive : ${n} = ${somme}, donc ${grp(b)}. Puis chaque groupe de 4 bits : ${detailNib(haut)}, et ${detailNib(bas)}. Résultat : 0x${h}.`
    }:{
      consigne:"Écris cet octet hexadécimal en binaire, puis en décimal.",
      texte:`<b class="cible">0x${h}</b> = {{${grp(b)}}} = {{${n}}}`,
      explication:()=>`Chaque caractère donne 4 bits : ${HEXA[haut]} → ${nib(haut)}, ${HEXA[bas]} → ${nib(bas)}, soit ${grp(b)}. Puis on additionne les poids des bits à 1 : ${somme} = ${n}.`
    };
  },
  /* appliquer un masque avec ET : résultat en binaire et en décimal */
  masque(){
    const M=[{m:0xF0,d:"garde les 4 bits de gauche"},{m:0x0F,d:"garde les 4 bits de droite"},{m:0xC0,d:"garde les 2 bits de gauche"},{m:0xE0,d:"garde les 3 bits de gauche"},{m:0xFC,d:"garde les 6 bits de gauche"}][R(5)];
    const v=1+R(255), r=v&M.m, rb=bin8(r);
    return {
      consigne:"Applique ce masque avec un ET. Donne le résultat en binaire, puis en décimal.",
      texte:`<span class="nw"><b class="rep">${grp(bin8(v))}</b></span> ET <span class="nw"><b class="rep">${grp(bin8(M.m))}</b></span> = <span class="nw">{{${grp(rb)}}}</span> = {{${r}}}`,
      explication:()=>`Le masque ${grp(bin8(M.m))} ${M.d} : sous chaque 1 du masque, le bit de l'octet passe tel quel ; sous chaque 0, il est effacé. Résultat ${grp(rb)}, soit ${r?POIDS.filter((p,i)=>rb[i]==="1").join(" + ")+" = ":""}${r}.`
    };
  },
  /* XOR réversible : retrouver le message à partir du chiffré et de la clé */
  xorRetour(){
    const m=R(256), k=1+R(255), c=m^k;
    return {
      consigne:"Ce message a été caché par un XOR avec la clé ci-dessous. Retrouve le message d'origine.",
      texte:`caché <span class="nw"><b class="rep">${grp(bin8(c))}</b></span> · clé <span class="nw"><b class="rep">${grp(bin8(k))}</b></span><br>message = <span class="nw">{{${grp(bin8(m))}}}</span>`,
      explication:()=>`On refait un XOR avec la même clé, colonne par colonne : 1 si les deux bits diffèrent. ${grp(bin8(c))} XOR ${grp(bin8(k))} = ${grp(bin8(m))}. Le même calcul cache et retrouve.`
    };
  },
  /* relier des caractères à leur code ASCII, à partir de A = 65, a = 97, 0 = 48 */
  relierAscii(){
    const pool=[...Array(26)].map((_,i)=>65+i).concat([...Array(26)].map((_,i)=>97+i),[...Array(10)].map((_,i)=>48+i));
    let cs; do{cs=melanger(pool).slice(0,5);}while(new Set(cs.map(c=>c<58?0:c<91?1:2)).size<2);
    const base=c=>c<58?["0",48]:c<91?["A",65]:["a",97];
    return {
      consigne:"Relie chaque caractère à son code ASCII. Pars de A = 65, a = 97 et 0 = 48.",
      titres:["Caractère","Code"],
      paires:cs.map(c=>{const [l,v]=base(c);return [String.fromCharCode(c),String(c),c===v?`c'est le point de départ, ${v}`:`${l} = ${v}, et ${String.fromCharCode(c)} est ${c-v} rang${c-v>1?"s":""} plus loin : ${v} + ${c-v} = ${c}`];}),
      explication:"Les lettres et les chiffres se suivent dans la table : on compte à partir du premier de la série."
    };
  },
  /* méthode soustractive avec une ligne fausse : un poids qui rentrait a reçu « non » */
  erreurSoustractive(){
    const n=30+R(226), bonsPoids=POIDS.filter((p,i)=>bin8(n)[i]==="1"), faux=bonsPoids[R(bonsPoids.length)];
    let reste=n, restePiege=0; const lignes=[];
    POIDS.forEach(w=>{
      const oui=w!==faux&&reste>=w;
      if(w===faux) restePiege=reste;
      lignes.push(`${w} dans ${reste} : ${oui?`oui, reste ${reste-w}`:`non, reste ${reste}`}`);
      if(oui) reste-=w;
    });
    return {
      consigne:`On convertit <b class="cible">${n}</b>. La méthode finit avec un reste de ${reste} au lieu de 0. Clique sur la ligne fausse.`,
      segments:lignes, bons:[POIDS.indexOf(faux)], lignes:true,
      explication:()=>`À la ligne du poids ${faux}, le reste valait ${restePiege} : ${faux} rentrait, il fallait répondre oui. Toutes les autres lignes sont justes, puisqu'elles suivent le reste affiché. Sans cette erreur, ${n} = ${grp(bin8(n))}.`
    };
  },
  /* trois octets à recouper en quatre paquets de 6 bits */
  base64Paquets(){
    const o=[R(256),R(256),R(256)], s=o.map(bin8).join(""), p=[0,6,12,18].map(i=>s.slice(i,i+6));
    return {
      consigne:"Recoupe ces 3 octets en 4 paquets de 6 bits, en partant de la gauche.",
      texte:`<span class="nw"><b class="rep">${bin8(o[0])}</b></span> <span class="nw"><b class="rep">${bin8(o[1])}</b></span> <span class="nw"><b class="rep">${bin8(o[2])}</b></span><br>${p.map(x=>`<span class="nw">{{${x}}}</span>`).join(" ")}`,
      explication:()=>`On colle les 24 bits, ${s}, puis on coupe tous les 6 : ${p.join(" ")}. Le deuxième paquet commence par les 2 derniers bits du premier octet.`
    };
  },
  /* un paquet de 6 bits : sa valeur, puis son caractère (A à Z, pour rester sans ambiguïté de casse) */
  base64Caractere(){
    const v=R(26), b=v.toString(2).padStart(6,"0"), L=String.fromCharCode(65+v);
    const somme=[32,16,8,4,2,1].filter((p,i)=>b[i]==="1");
    return {
      consigne:"Lis ce paquet de 6 bits, puis trouve son caractère dans la table de Base64.",
      texte:`Paquet <span class="nw"><b class="rep">${b}</b></span> : il vaut <span class="nw">{{${v}}}</span>, soit le caractère <span class="nw">{{${L}}}</span>.`,
      explication:()=>`Les poids d'un paquet sont 32, 16, 8, 4, 2, 1 : ${somme.length?somme.join(" + ")+" = ":""}${v}. A vaut 0 et les lettres se suivent, donc ${v} donne ${L}.`
    };
  },
  /* combien de signes = et de caractères pour n octets */
  base64Egal(){
    const n=1+R(20), r=n%3, eq=r===0?0:3-r, c=Math.ceil(n/3)*4;
    return {
      consigne:"Calcule la fin de l'encodage Base64 pour cette donnée.",
      texte:`<b class="cible">${n}</b> octets. Reste après les groupes de 3 : <span class="nw">{{${r}}} octet(s)</span>. Signes = : <span class="nw">{{${eq}}}</span>. Caractères en tout, signes = compris : <span class="nw">{{${c}}}</span>.`,
      explication:()=>`${n} = 3 × ${Math.floor(n/3)} + ${r}. ${r===0?"Aucun octet ne reste, donc aucun signe =.":r===1?"Un seul octet reste : deux signes =.":"Deux octets restent : un signe =."} Chaque groupe commencé donne 4 caractères : ${Math.ceil(n/3)} × 4 = ${c}.`
    };
  },
  /* taille d'une donnée une fois encodée en Base64 */
  base64Taille(){
    const n=3*(1+R(30));
    return {
      consigne:"Calcule la taille de cette donnée une fois encodée en Base64.",
      texte:`<b class="cible">${n}</b> octets = {{${n*8}}} bits = {{${n*8/6}}} paquets de 6 bits = {{${n*4/3}}} caractères Base64`,
      explication:()=>`${n} × 8 = ${n*8} bits. Base64 relit ces bits par paquets de 6 : ${n*8} ÷ 6 = ${n*8/6} paquets, et chaque paquet devient un caractère. Autrement dit, 3 octets donnent 4 caractères : la taille augmente d'un tiers.`
    };
  }
};
