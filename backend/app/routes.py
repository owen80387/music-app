from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
import requests
import tempfile
import os
from app.model import analyze_audio
from app.utils import download_file, validate_audio_file
from fastapi.responses import StreamingResponse
from urllib.parse import unquote
import io


router = APIRouter()

class AnalyzeRequest(BaseModel):
    fileUrl: str

class BeatRecommendation(BaseModel):
    id: str
    similarity: float
    bpm: int
    key: str
    user: str
    price: int

class AnalyzeResponse(BaseModel):
    bpm: int
    key: str
    recommend: list[BeatRecommendation]

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

@router.get("/proxy-audio")
@router.head("/proxy-audio")
@router.options("/proxy-audio")
async def proxy_audio(url: str):
    """Proxy Firebase Storage audio files to bypass CORS"""
    try:
        # Clean and decode the URL properly
        decoded_url = unquote(url)
        print(f"📥 Proxy request for: {url}")
        print(f"🔗 Decoded URL: {decoded_url}")
        
        # Set up headers that Firebase Storage expects
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'identity',  # Don't compress
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'audio',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site'
        }
        
        print(f"📡 Making request to Firebase Storage...")
        response = requests.get(
            decoded_url, 
            headers=headers, 
            stream=True, 
            timeout=30,
            allow_redirects=True
        )
        
        print(f"📊 Firebase Storage response: {response.status_code}")
        print(f"📄 Response headers: {dict(response.headers)}")
        
        if response.status_code == 403:
            raise HTTPException(
                status_code=403, 
                detail="Firebase Storage access denied. Please check Firebase Storage security rules."
            )
        elif response.status_code == 404:
            raise HTTPException(
                status_code=404, 
                detail="Audio file not found in Firebase Storage."
            )
        elif response.status_code not in [200, 206]:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Firebase Storage returned status {response.status_code}"
            )
        
        # Get content info
        content_type = response.headers.get('content-type', 'audio/mpeg')
        content_length = response.headers.get('content-length', '')
        
        print(f"✅ Successfully proxying audio file (type: {content_type})")
        
        def generate():
            try:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        yield chunk
            except Exception as e:
                print(f"❌ Error streaming content: {e}")
                raise
        
        return StreamingResponse(
            generate(),
            status_code=response.status_code,
            media_type=content_type,
            headers={
                "Accept-Ranges": "bytes",
                "Content-Length": content_length,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Expose-Headers": "*",
                "Cache-Control": "public, max-age=3600",
                "Content-Disposition": "inline"
            }
        )
        
    except requests.exceptions.Timeout:
        print("⏰ Request timeout")
        raise HTTPException(status_code=504, detail="Request to Firebase Storage timed out")
    except requests.exceptions.ConnectionError:
        print("🔌 Connection error")
        raise HTTPException(status_code=502, detail="Could not connect to Firebase Storage")
    except requests.exceptions.RequestException as e:
        print(f"❌ Request error: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"📊 Error response status: {e.response.status_code}")
            print(f"📄 Error response text: {e.response.text}")
        raise HTTPException(status_code=502, detail=f"Failed to fetch from Firebase Storage: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        print(f"💥 Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal proxy error: {str(e)}")

 