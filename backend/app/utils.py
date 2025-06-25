import requests
import tempfile
import os
import mimetypes
from typing import Optional
import librosa

ALLOWED_AUDIO_TYPES = {
    'audio/mpeg',  # MP3
    'audio/wav',   # WAV
    'audio/flac',  # FLAC
    'audio/ogg',   # OGG
    'audio/aac',   # AAC
    'audio/m4a',   # M4A
    'audio/webm',  # WebM audio
}

ALLOWED_EXTENSIONS = {'.mp3', '.wav', '.flac', '.ogg', '.aac', '.m4a', '.webm'}

async def download_file(url: str) -> Optional[str]:
    """
    Download file from URL and save to temporary location
    Returns path to temporary file or None if failed
    """
    try:
        # Handle Firebase Storage URLs and other URLs
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()
        
        # Get file extension from URL or content type
        content_type = response.headers.get('content-type', '')
        extension = get_extension_from_content_type(content_type)
        
        if not extension:
            # Try to get extension from URL
            extension = os.path.splitext(url)[1]
            if extension not in ALLOWED_EXTENSIONS:
                extension = '.wav'  # Default fallback
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as temp_file:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    temp_file.write(chunk)
            
            return temp_file.name
            
    except Exception as e:
        print(f"Failed to download file from {url}: {e}")
        return None

def get_extension_from_content_type(content_type: str) -> str:
    """Get file extension from content type"""
    extension_map = {
        'audio/mpeg': '.mp3',
        'audio/wav': '.wav',
        'audio/flac': '.flac',
        'audio/ogg': '.ogg',
        'audio/aac': '.aac',
        'audio/m4a': '.m4a',
        'audio/webm': '.webm',
    }
    
    return extension_map.get(content_type.split(';')[0].strip(), '')

def validate_audio_file(file_path: str) -> bool:
    """
    Validate that the file is a supported audio format
    Returns True if valid, False otherwise
    """
    try:
        # Check file extension
        _, extension = os.path.splitext(file_path.lower())
        if extension not in ALLOWED_EXTENSIONS:
            return False
        
        # Check MIME type
        mime_type, _ = mimetypes.guess_type(file_path)
        if mime_type and mime_type not in ALLOWED_AUDIO_TYPES:
            return False
        
        # Try to load with librosa (this will fail for non-audio files)
        try:
            librosa.load(file_path, sr=None, duration=1.0)  # Load just 1 second for validation
            return True
        except Exception:
            return False
            
    except Exception:
        return False

def cleanup_temp_file(file_path: str) -> None:
    """Safely remove temporary file"""
    try:
        if os.path.exists(file_path):
            os.unlink(file_path)
    except Exception as e:
        print(f"Failed to cleanup temp file {file_path}: {e}")

def get_file_info(file_path: str) -> dict:
    """Get basic information about an audio file"""
    try:
        # Get file size
        file_size = os.path.getsize(file_path)
        
        # Get audio info using librosa
        duration = librosa.get_duration(filename=file_path)
        
        return {
            "size_bytes": file_size,
            "duration_seconds": round(duration, 2),
            "valid": True
        }
    except Exception as e:
        return {
            "size_bytes": 0,
            "duration_seconds": 0,
            "valid": False,
            "error": str(e)
        } 