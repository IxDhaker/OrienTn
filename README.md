# 🇹🇳 OrienTn - Plateforme Web d'Orientation Universitaire Intelligente

> **Projet MERN Stack + Python RAG pour les nouveaux bacheliers tunisiens**  
> **Architecture conforme à 100% au diagramme de classes StarUML (`Untitled.mdj`)**

OrienTn est une plateforme web interactive conçue pour simplifier l'orientation des bacheliers tunisiens en calculant leur score officiel, en recommandant les filières et universités adéquates sur une carte interactive géolocalisée, et en fournissant un accompagnement personnalisé pour la rentrée grâce à l'Intelligence Artificielle (RAG).

---

## 📐 Conformité StarUML 100% (Modèle de Classes)

Le modèle de données et les services backend implémentent rigoureusement les 4 packages, 17 classes et 1 interface du diagramme de classes StarUML :

### 1. Package `Utilisateurs`
- **`Etudiant`** : `id: int`, `nom: String`, `prenom: String`, `email: String [0..1]`
  - *Associations* : `1 Etudiant -- realise --> * ResultatScore`, `1 Etudiant -- reçoit --> * RoadmapPreparation`
- **`Administrateur`** : `id: int`, `login: String`, `motDePasseHash: String`

### 2. Package `Scoring`
- **`SectionBac`** : `id: int`, `nom: String`
  - *Associations* : `1 SectionBac -- * CoefficientMatiere`, `* SectionBac -- accessible aux --> * OffreFormation`, `1 SectionBac <-- simulé avec -- * ResultatScore`
- **`Matiere`** : `id: int`, `nom: String`
  - *Associations* : `1 Matiere <-- * CoefficientMatiere`, `1 Matiere <-- * NoteBac`
- **`CoefficientMatiere`** : `valeur: float`, `estBonus: boolean`
  - *Associations* : relié à `SectionBac` et `Matiere`
- **`ResultatScore`** : `id: int`, `date: Date`, `scoreFige: float`, `moyenneGenerale: float`
  - *Composition* : `1 ResultatScore *-- * NoteBac`
  - *Associations* : produit `Recommandation *`, relié à `SectionBac` et `Etudiant`
- **`NoteBac`** : `valeur: float` (reliée à `Matiere`, intégrée dans `ResultatScore`)
- **`Recommandation`** : `rang: int`, `ecartAvecSeuil: float`
  - *Association* : reliée à `OffreFormation` et `ResultatScore`
- **`CalculateurScore`** (Service métier) :
  - `+ calculer(notes: List<NoteBac>, section: SectionBac) -> float`
  - *Dépendances* : lit `CoefficientMatiere`, alimente `ResultatScore`
- **`MoteurRecommandation`** (Service métier) :
  - `+ recommander(resultat: ResultatScore) -> List<Recommandation>`
  - *Dépendances* : compare au seuil de `OffreFormation`, produit `Recommandation`

### 3. Package `Etablissements`
- **`Faculte`** : `id: int`, `nom: String`, `universite: String`, `gouvernorat: String`, `adresse: String`, `latitude: double`, `longitude: double`, `description: String`
  - *Compositions* : `1 Faculte *-- * OffreFormation`, `1 Faculte *-- * VieAssociative`
- **`Filiere`** : `id: int`, `nom: String`, `domaine: String`, `description: String`
  - *Associations* : `1 Filiere -- * OffreFormation`, `1 Filiere <-- pour -- * RoadmapPreparation`
- **`OffreFormation`** : `annee: int`, `scoreSeuil: float`, `capacite: int`
  - *Associations* : composite de `Faculte`, liée à `Filiere`, accessible aux `SectionBac`, cible des `Recommandation`
- **`VieAssociative`** : `type: String`, `nom: String`, `description: String`
  - *Composition* : composite de `Faculte`

### 4. Package `IA`
- **`RoadmapPreparation`** : `id: int`, `dateGeneration: Date`, `resume: String`, `promptUtilise: String`, `statut: String`
  - *Composition* : `1 RoadmapPreparation *-- * EtapeRoadmap`
  - *Associations* : reçue par `Etudiant`, pour une `Filiere`
- **`EtapeRoadmap`** : `ordre: int`, `titre: String`, `description: String`, `dureeSemaines: int`
- **`ServiceIA`** (Interface) :
  - `+ genererPlan(filiere: Filiere) -> List<EtapeRoadmap>`
- **`RoadmapService`** (Service métier) :
  - `+ generer(etudiant: Etudiant, filiere: Filiere) -> RoadmapPreparation`
  - *Dépendances* : appelle `ServiceIA`, crée `RoadmapPreparation`

---

## 🗄️ Préparation & Initialisation de la Base de Données MongoDB

### 1. Démarrer MongoDB
Vous pouvez lancer une instance locale MongoDB de deux manières :

#### Option A : Via Docker Compose (Recommandé)
```bash
docker compose up -d
```
Ceci lance un conteneur officiel MongoDB sur le port standard `27017` avec volume persistant `orientn_mongodb_data`.

#### Option B : Via service local ou MongoDB Atlas
Définissez votre URI dans `server/.env` :
```env
MONGODB_URI=mongodb://localhost:27017/orientn
```

### 2. Peupler la Base de Données (Seed)
Exécutez la commande de peuplement complète :
```bash
npm run seed
# ou directement :
cd server && npm run seed
```

Cette commande initialise et remplit automatiquement :
- Les 7 **Sections officielles du Baccalauréat tunisien** (Math, Sc. Expérimentales, Info, Technique, Éco-Gestion, Lettres, Sport).
- Toutes les **Matières d'examen** et l'intégralité de leurs **Coefficients officiels** (`CoefficientMatiere`).
- Les **Facultés & Universités tunisiennes** géolocalisées avec adresses et coordonnées GPS (INSAT, ISI, FMT, ENIT, IHEC Carthage, FMM, ENIS, ESSTHS...).
- Les **Filières universitaires** d'excellence (MPI, L-GL, Médecine, Génie Électrique, Finance, Business Computing...).
- Les **Offres de formation** avec leurs scores seuils récents 2024 et capacités d'accueil.
- Les clubs et la **Vie associative** étudiante (IEEE, SecurNets, Aerobotix, Enactus, Associa-Med, Junior Entreprise...).
- Les comptes d'administrateur et d'étudiants types.
- Un exemple de simulation `ResultatScore`, ses `Recommandations` et sa `RoadmapPreparation` estivale.
- Un export complet autonome sauvegardé dans `server/src/data/mongoSeedData.json`.

---

## 🧪 Validation de la conformité StarUML

Un script de test dédié permet de valider instantanément l'instanciation et l'exécution des 4 packages :
```bash
cd server
npm run test:uml
```

---

## 🚀 Démarrage de l'Application

### Lancement complet (Client + Serveur + RAG Python) :
```bash
npm run dev:all
```

- **Client Web (React)** : [http://localhost:5173](http://localhost:5173)
- **API Backend (Express & Mongo)** : [http://localhost:5000](http://localhost:5000)
- **Métadonnées de l'architecture UML** : [http://localhost:5000/api/uml/meta](http://localhost:5000/api/uml/meta)
- **Microservice Python RAG** : [http://localhost:8000](http://localhost:8000)
