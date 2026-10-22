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
        ${POIDS.map((p,i)=>`<button type="button" class="bit" data-i="${i}" aria-pressed="${etat[i]?"true":"false"}" aria-label="Bit de poids ${p}"${lire?" disabled":""}><span class="w">${p}</span><span class="v">${etat[i]}</span></button>`).join("")}
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

const ACTIVITES={bits:actBits,ordre:actOrdre,trous:actTrous,choix:actChoix};

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
  }
};
