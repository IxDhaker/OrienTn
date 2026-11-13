import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

from rag.engine import rag_engine

load_dotenv()

app = FastAPI(
    title="OrienTn - Service IA / RAG",
    description="Microservice Python pour le RAG et la génération de Summer Prep Roadmaps pour bacheliers tunisiens",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummerPrepRequest(BaseModel):
    chosenSection: Optional[str] = "Informatique"
    domain: Optional[str] = "Technologies de l'Information"
    facultyName: Optional[str] = "INSAT"
    targetLevel: Optional[str] = "Licence / 1ère année"

class QuestionRequest(BaseModel):
    question: str
    section: Optional[str] = None
    score: Optional[float] = None

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "OrienTn Python RAG Service",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "ok", "engine": "ready"}

@app.post("/api/summer-prep")
def generate_summer_prep(payload: SummerPrepRequest):
    try:
        roadmap = rag_engine.generate_summer_roadmap(
            section=payload.chosenSection or "",
            domain=payload.domain or "",
            faculty=payload.facultyName or ""
        )
        return {"success": True, "roadmap": roadmap}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ask-orientn")
def ask_assistant(payload: QuestionRequest):
    """Point d'entrée pour poser des questions sur le guide d'orientation tunisien."""
    context = rag_engine.retrieve_context(payload.question)
    return {
        "success": True,
        "question": payload.question,
        "retrievedDomain": context.get("domain"),
        "answer": f"Selon les données d'orientation pour le domaine '{context.get('domain')}', les filières recommandées s'étalent sur les universités : {', '.join(context.get('faculties', []))}."
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    print(f"🐍 Service Python RAG démarré sur http://localhost:{port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
