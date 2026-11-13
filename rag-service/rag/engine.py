import os
import json
from typing import Dict, Any, List

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'guide_orientation_sample.json')

class TunisianOrientationRAG:
    """
    Moteur RAG pour l'orientation universitaire tunisienne et la génération
    de Summer Prep Roadmaps personnalisées.
    """
    def __init__(self):
        self.knowledge_base = self._load_knowledge()

    def _load_knowledge(self) -> List[Dict[str, Any]]:
        if os.path.exists(DATA_PATH):
            with open(DATA_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def retrieve_context(self, domain_or_section: str) -> Dict[str, Any]:
        """Recherche dans la base documentaire le domaine le plus pertinent."""
        query = domain_or_section.lower()
        for doc in self.knowledge_base:
            doc_domain = doc.get("domain", "").lower()
            if any(term in query for term in ["info", "logiciel", "ordinateur", "code", "tech"]) and "informatique" in doc_domain:
                return doc
            if any(term in query for term in ["med", "méd", "santé", "pharma", "dentaire"]) and "médecine" in doc_domain:
                return doc
            if any(term in query for term in ["eco", "éco", "gestion", "finance", "mgt", "compta"]) and "économie" in doc_domain:
                return doc
            if doc_domain in query or query in doc_domain:
                return doc
        return self.knowledge_base[0] if self.knowledge_base else {}

    def generate_summer_roadmap(self, section: str, domain: str, faculty: str = "") -> Dict[str, Any]:
        """
        Génère une roadmap estivale personnalisée pour le nouvel admis.
        Dans un environnement de production avec clé API (OpenAI ou Gemini),
        cette méthode injecte le contexte récupéré dans le prompt LLM.
        """
        context = self.retrieve_context(f"{section} {domain}")
        prep = context.get("summer_prep_recommendations", {})
        subjects = context.get("semester1_subjects", [])

        faculty_display = faculty if faculty else "votre nouvelle faculté"

        roadmap = {
            "title": f"Summer Prep Roadmap : {section or domain}",
            "faculty": faculty_display,
            "targetDomain": context.get("domain", domain),
            "intro": (
                f"Félicitations pour votre orientation en {section or domain} à {faculty_display} ! "
                "Pour assurer une transition fluide entre le lycée et l'université tunisienne, "
                "voici votre plan de préparation personnalisé généré par l'IA d'OrienTn."
            ),
            "keyFirstSemesterModules": subjects,
            "weeks": [
                {
                    "week": "Semaines 1 & 2 : Fondations & Remise à niveau",
                    "focus": "Maîtrise des concepts fondamentaux",
                    "description": prep.get("week_1_2", "Révision des fondamentaux théoriques et pratiques."),
                    "tasks": [
                        "Consolider les prérequis du bac pertinents pour la filière",
                        "Prendre en main les outils indispensables (IDE, compilateurs, ou manuels spécialisés)",
                        "Effectuer 1 à 2 heures de pratique quotidienne autonome"
                    ]
                },
                {
                    "week": "Semaines 3 & 4 : Compétences Techniques & Pratique",
                    "focus": "Approfondissement et méthodologie",
                    "description": prep.get("week_3_4", "Approfondissement des matières clés du premier semestre."),
                    "tasks": [
                        "Découvrir la structure des examens universitaires (DS et Examens finaux)",
                        "Réaliser un mini-projet d'application pratique",
                        "Rejoindre des groupes d'entraide d'étudiants de la filière"
                    ]
                },
                {
                    "week": "Semaines 5 & 6 : Intégration & Préparation à la Rentrée",
                    "focus": "Outils collaboratifs & culture universitaire",
                    "description": prep.get("week_5_6", "Préparation aux clubs, projets d'équipe et vie de campus."),
                    "tasks": [
                        "Se renseigner sur les clubs actifs sur le campus (IEEE, OSC, Associa-Med, etc.)",
                        "Préparer son environnement de travail (PC configuré, système de prise de notes)",
                        "Planifier son emploi du temps pour le premier semestre"
                    ]
                }
            ]
        }
        return roadmap

rag_engine = TunisianOrientationRAG()
