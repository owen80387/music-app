from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
import requests
import tempfile
import os
from app.model import analyze_audio
from app.utils import download_file, validate_audio_file

router = APIRouter()

class AnalyzeRequest(BaseModel):
    fileUrl: str

class AnalyzeResponse(BaseModel):
    bpm: int
    key: str
    recommend: list[str]

@router.get("/ping")
async def ping():
    """Health check endpoint"""
    return {"status": "ok"}

@router.post("/analyse", response_model=AnalyzeResponse)
async def analyze_beat(request: AnalyzeRequest):
    """
    Analyze audio file for BPM and key detection
    Accepts a file URL and returns analysis results
    """
    try:
        # Download the file from URL
        temp_file_path = await download_file(request.fileUrl)
        
        if not temp_file_path:
            raise HTTPException(status_code=400, detail="Failed to download audio file")
        
        # Validate it's an audio file
        if not validate_audio_file(temp_file_path):
            os.unlink(temp_file_path)
            raise HTTPException(status_code=400, detail="Invalid audio file format")
        
        # Analyze the audio
        analysis_result = await analyze_audio(temp_file_path)
        
        # Clean up temporary file
        os.unlink(temp_file_path)
        
        return AnalyzeResponse(
            bpm=analysis_result["bpm"],
            key=analysis_result["key"],
            recommend=analysis_result["recommend"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/analyse-upload", response_model=AnalyzeResponse)
async def analyze_upload(file: UploadFile = File(...)):
    """
    Alternative endpoint for direct file upload
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('audio/'):
            raise HTTPException(status_code=400, detail="File must be an audio file")
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Analyze the audio
        analysis_result = await analyze_audio(temp_file_path)
        
        # Clean up temporary file
        os.unlink(temp_file_path)
        
        return AnalyzeResponse(
            bpm=analysis_result["bpm"],
            key=analysis_result["key"],
            recommend=analysis_result["recommend"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}") 