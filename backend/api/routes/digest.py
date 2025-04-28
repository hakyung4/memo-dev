from datetime import date
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.services.digest import get_weekly_digest

router = APIRouter()

class DigestRequest(BaseModel):
    user_id: str
    selected_date: date = None

@router.post("/weekly")
def weekly_digest(req: DigestRequest):
    try:
        digest = get_weekly_digest(req.user_id, req.selected_date)
        return digest
    except Exception as e:
        raise HTTPException(status_code=500, detail={"error": f"Failed to get weekly digest: {str(e)}"})
