#!/usr/bin/env node
// Écrit les index lus en une seule requête par l'application :
//   modules-index.json       la liste des modules écrits (dossier modules/)
//   esgi/cartes-index.json   la liste des matières qui ont un fichier de cartes (dossier esgi/cartes/)
// À relancer après chaque fichier ajouté ou retiré : node outils/indexer.js
// Le validateur signale un index qui ne correspond plus à son dossier.
const fs=require("fs"),path=require("path");
const racine=path.join(__dirname,"..");
const trier=l=>l.sort((a,b)=>a.localeCompare(b,"fr",{numeric:true}));
const lister=()=>trier(fs.readdirSync(path.join(racine,"modules")).filter(f=>f.endsWith(".json")).map(f=>path.basename(f,".json")));
const listerCartes=(dirEsgi=path.join(racine,"esgi"))=>{
  const d=path.join(dirEsgi,"cartes");
  return fs.existsSync(d)?trier(fs.readdirSync(d).filter(f=>f.endsWith(".json")).map(f=>path.basename(f,".json"))):[];
};
if(require.main===module){
  const ids=lister();
  fs.writeFileSync(path.join(racine,"modules-index.json"),JSON.stringify({modules:ids},null,2)+"\n");
  console.log(`modules-index.json : ${ids.length} modules (${ids.join(", ")})`);
  const c=listerCartes();
  fs.writeFileSync(path.join(racine,"esgi","cartes-index.json"),JSON.stringify({cartes:c},null,2)+"\n");
  console.log(`esgi/cartes-index.json : ${c.length} fichier(s) de cartes (${c.join(", ")})`);
}
module.exports={lister,listerCartes};
