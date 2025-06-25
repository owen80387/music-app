import pytest
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_ping_endpoint():
    """Test the ping endpoint"""
    response = requests.get(f"{BASE_URL}/ping")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"

def test_root_endpoint():
    """Test the root endpoint"""
    response = requests.get(f"{BASE_URL}/")
    assert response.status_code == 200
    data = response.json()
    assert "Music App API is running" in data["message"]

def test_analyze_endpoint_invalid_url():
    """Test analyze endpoint with invalid URL"""
    payload = {
        "fileUrl": "https://invalid-url.com/nonexistent.mp3"
    }
    response = requests.post(
        f"{BASE_URL}/analyse",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 400

def test_cors_headers():
    """Test CORS headers are present"""
    response = requests.options(f"{BASE_URL}/ping")
    assert "access-control-allow-origin" in response.headers

if __name__ == "__main__":
    print("Running backend tests...")
    
    try:
        test_ping_endpoint()
        print("✅ Ping endpoint test passed")
        
        test_root_endpoint()
        print("✅ Root endpoint test passed")
        
        test_analyze_endpoint_invalid_url()
        print("✅ Analyze endpoint validation test passed")
        
        test_cors_headers()
        print("✅ CORS headers test passed")
        
        print("\n🎉 All backend tests passed!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        print("Make sure the backend is running with: docker-compose up") 