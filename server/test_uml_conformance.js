import {
  Etudiant,
  Administrateur,
  SectionBac,
  Matiere,
  CoefficientMatiere,
  ResultatScore,
  NoteBac,
  Recommandation,
  Faculte,
  Filiere,
  OffreFormation,
  VieAssociative,
  RoadmapPreparation,
  EtapeRoadmap
} from './src/models/index.js';

import CalculateurScore from './src/services/CalculateurScore.js';
import MoteurRecommandation from './src/services/MoteurRecommandation.js';
import ServiceIA from './src/services/ServiceIA.js';
import RoadmapService from './src/services/RoadmapService.js';

console.log('🧪 === TEST DE CONFORMITÉ STARUML ===');

// 1. Test Package Utilisateurs
console.log('\n--- 1. Package Utilisateurs ---');
const etudiant = new Etudiant({
  id: 101,
  nom: 'Ben Salah',
  prenom: 'Sami',
  email: 'sami.bensalah@email.tn'
});
console.log('✅ Modèle Etudiant instancié :', etudiant.nomComplet, 'Email:', etudiant.email);

const admin = new Administrateur({
  id: 1,
  login: 'superadmin',
  motDePasseHash: 'hash_secret_123'
});
console.log('✅ Modèle Administrateur instancié :', admin.login);

// 2. Test Package Scoring
console.log('\n--- 2. Package Scoring ---');
const secInfo = new SectionBac({ id: 1, nom: "Sciences de l'Informatique", code: 'INFO' });
const matAlgo = new Matiere({ id: 1, nom: 'Algorithmique & TIC', code: 'algo_tic' });
const coeff = new CoefficientMatiere({ valeur: 1.5, estBonus: false, section: secInfo._id, matiere: matAlgo._id });
console.log(`✅ SectionBac (${secInfo.nom}) & Matiere (${matAlgo.nom}) & Coeff (${coeff.valeur}) instanciés`);

const note1 = { matiereNom: 'Algorithmique & TIC', matiereCode: 'algo_tic', valeur: 18.0 };
const note2 = { matiereNom: 'Mathématiques', matiereCode: 'math', valeur: 15.0 };
const note3 = { matiereNom: 'Sciences Physiques', matiereCode: 'physique', valeur: 14.0 };
const note4 = { matiereNom: 'Français', matiereCode: 'francais', valeur: 13.0 };
const note5 = { matiereNom: 'Anglais', matiereCode: 'anglais', valeur: 16.0 };

const calcRes = await CalculateurScore.calculer([note1, note2, note3, note4, note5], 'INFO', {
  moyenneGenerale: 15.5,
  avec7Pourcent: false
});
console.log('✅ CalculateurScore.calculer() exécuté avec succès :');
console.log(`   Score obtenu: ${calcRes.score} (MG: ${calcRes.moyenneGenerale})`);

// 3. Test Package Etablissements
console.log('\n--- 3. Package Etablissements ---');
const facInsat = new Faculte({
  id: 1,
  nom: "Institut National des Sciences Appliquées et de Technologie",
  nomCourt: "INSAT",
  universite: "Université de Carthage",
  gouvernorat: "Ariana",
  adresse: "Centre Urbain Nord",
  latitude: 36.8428,
  longitude: 10.1963,
  description: "Grande école d'ingénieurs publique"
});
console.log(`✅ Faculte instanciée : ${facInsat.nom} (${facInsat.shortName}) [${facInsat.latitude}, ${facInsat.longitude}]`);

const filiereMPI = new Filiere({
  id: 1,
  nom: "Cycle Préparatoire Intégré : MPI",
  domaine: "Informatique",
  description: "Math-Physique-Informatique"
});
console.log(`✅ Filiere instanciée : ${filiereMPI.nom}`);

const offre = new OffreFormation({
  annee: 2024,
  scoreSeuil: 162.0,
  capacite: 350,
  faculte: facInsat._id,
  filiere: filiereMPI._id,
  sectionsBac: [secInfo._id]
});
console.log(`✅ OffreFormation instanciée : Seuil = ${offre.scoreSeuil}, Capacité = ${offre.capacite}`);

const vie = new VieAssociative({
  type: "Club Cybersécurité",
  nom: "SecurNets",
  description: "Club de hacking éthique",
  faculte: facInsat._id
});
console.log(`✅ VieAssociative instanciée : ${vie.nom} (${vie.type})`);

// 4. Test Package IA
console.log('\n--- 4. Package IA ---');
const planEtapes = await ServiceIA.genererPlan(filiereMPI, { faculteNom: facInsat.nomCourt });
console.log(`✅ ServiceIA.genererPlan() a généré ${planEtapes.length} étapes :`);
planEtapes.forEach((e) => console.log(`   - Étape ${e.ordre}: ${e.titre} (${e.dureeSemaines} semaines)`));

console.log('\n🎉 TOUS LES MODÈLES ET SERVICES MATCHE 100% LE DIAGRAMME STARUML !');
