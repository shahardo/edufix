#!/usr/bin/env python3
"""
Test script for management API endpoints.
"""
import requests
import json
import sys
import os

# Backend URL
BASE_URL = "http://localhost:8000"

def test_login(username: str, password: str):
    """Test login and get token."""
    print(f"[LOGIN] Testing login for user: {username}")

    try:
        response = requests.post(
            f"{BASE_URL}/auth/token",
            data={
                "username": username,
                "password": password
            }
        )

        if response.status_code == 200:
            token_data = response.json()
            token = token_data["access_token"]
            print(f"[SUCCESS] Login successful for {username}")
            return token
        else:
            print(f"[FAILED] Login failed for {username}: {response.status_code} - {response.text}")
            return None

    except Exception as e:
        print(f"[ERROR] Login error for {username}: {e}")
        return None

def test_management_endpoint(token: str, endpoint: str):
    """Test a management API endpoint."""
    print(f"[TEST] Testing endpoint: {endpoint}")

    try:
        response = requests.get(
            f"{BASE_URL}/api/management/{endpoint}",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )

        print(f"Status: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"[SUCCESS] Returned {len(data)} items")
                if len(data) > 0:
                    print(f"   Sample item: {json.dumps(data[0], indent=2)[:200]}...")
            else:
                print(f"[SUCCESS] Returned data: {json.dumps(data, indent=2)[:300]}...")
            return True
        else:
            print(f"[FAILED] {response.status_code} - {response.text}")
            return False

    except Exception as e:
        print(f"[ERROR] Testing {endpoint}: {e}")
        return False

def main():
    """Test all management endpoints."""
    print("Testing EduFix Management API Endpoints")
    print("=" * 50)

    # Test manager login
    manager_token = test_login("manager", "pass123")
    if not manager_token:
        print("[ERROR] Manager login failed, trying teacher login...")
        # Try teacher login as fallback
        teacher_token = test_login("teacher1", "pass123")
        if teacher_token:
            print("[INFO] Using teacher token instead")
            manager_token = teacher_token
        else:
            print("[ERROR] Cannot proceed without any valid token")
            return

    print("\n" + "=" * 50)

    # Test all management endpoints
    endpoints = ["overview", "teachers", "students", "classes", "lessons"]
    results = {}

    for endpoint in endpoints:
        success = test_management_endpoint(manager_token, endpoint)
        results[endpoint] = success
        print()

    # Summary
    print("=" * 50)
    print("Test Summary:")
    successful = sum(results.values())
    total = len(results)

    for endpoint, success in results.items():
        status = "[OK]" if success else "[FAIL]"
        print(f"  {status} {endpoint}")

    print(f"\nResult: {successful}/{total} endpoints working")

    if successful == total:
        print("All management API endpoints are working correctly!")
    else:
        print("Some endpoints are failing. Check the errors above.")

if __name__ == "__main__":
    main()
