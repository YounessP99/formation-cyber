#!/usr/bin/env node
// Écrit modules-index.json : la liste des modules écrits, lue en une seule requête au démarrage de l'application.
// À relancer après chaque module ajouté ou retiré : node outils/indexer.js
// Le validateur signale un index qui ne correspond plus au dossier modules/.
const fs=require("fs"),path=require("path");
const racine=path.join(__dirname,"..");
const lister=()=>fs.readdirSync(path.join(racine,"modules")).filter(f=>f.endsWith(".json")).map(f=>path.basename(f,".json"))
  .sort((a,b)=>a.localeCompare(b,"fr",{numeric:true}));
if(require.main===module){
  const ids=lister();
  fs.writeFileSync(path.join(racine,"modules-index.json"),JSON.stringify({modules:ids},null,2)+"\n");
  console.log(`modules-index.json : ${ids.length} modules (${ids.join(", ")})`);
}
module.exports={lister};
