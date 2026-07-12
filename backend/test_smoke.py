"""Smoke test for the batch-1 CRUD endpoints. Hits the real dev DB via
TestClient and cleans up everything it creates. Run: python test_smoke.py
"""
import uuid

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def demo():
    assert client.get("/health").json() == {"status": "ok"}

    # departments: full CRUD round trip
    code = f"SMOKE{uuid.uuid4().hex[:6]}"
    r = client.post("/departments", json={"name": "Smoke Test Dept", "code": code})
    assert r.status_code == 201, r.text
    dept = r.json()
    assert dept["name"] == "Smoke Test Dept" and dept["active"] is True

    r = client.patch(f"/departments/{dept['id']}", json={"active": False})
    assert r.status_code == 200 and r.json()["active"] is False

    assert any(d["id"] == dept["id"] for d in client.get("/departments").json())

    # esg-categories
    r = client.post("/esg-categories", json={"name": "Smoke Cat", "module": "Environmental", "color": "#fff"})
    assert r.status_code == 201, r.text
    cat = r.json()
    assert cat["module"] == "Environmental"

    # goals: computed status
    r = client.post(
        "/goals",
        json={"name": "Smoke Goal", "dept": dept["id"], "target": 100, "current": 100},
    )
    assert r.status_code == 201, r.text
    goal = r.json()
    assert goal["status"] == "completed", goal

    # org-settings singleton PATCH
    r = client.patch("/org-settings", json={"autoEmission": False})
    assert r.status_code == 200 and r.json()["autoEmission"] is False

    # challenges: difficulty/col case-mapping
    r = client.post("/challenges", json={"name": "Smoke Challenge", "xp": 50, "difficulty": "Easy"})
    assert r.status_code == 201, r.text
    challenge = r.json()
    assert challenge["difficulty"] == "Easy" and challenge["col"] == "draft"

    r = client.patch(f"/challenges/{challenge['id']}", json={"col": "active"})
    assert r.json()["col"] == "active"

    # read-only listing endpoints don't error
    for path in ["/badges", "/rewards", "/activities", "/policies", "/audits", "/compliance-issues"]:
        assert client.get(path).status_code == 200, path

    # cleanup (goal references dept, so delete it first)
    client.delete(f"/goals/{goal['id']}")
    client.delete(f"/departments/{dept['id']}")
    client.delete(f"/esg-categories/{cat['id']}")

    print("smoke test passed")


if __name__ == "__main__":
    demo()
