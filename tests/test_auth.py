
def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={
        "email": "test@example.com",
        "password": "password123"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["email"] == "test@example.com"
    assert "id" in data

def test_duplicate_email_registration(client):
    user = {
        "email": "test@example.com",
        "password": "password123"
    }

    first = client.post(
        "/auth/register",
        json=user
    )

    second = client.post(
        "/auth/register",
        json=user
    )

    assert first.status_code == 201
    assert second.status_code == 400
    assert second.json()["detail"] == "Email already registered"

def test_login_user(client):
    client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "password123"
        }
    )

    response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_password(client):
    client.post(
        "/auth/register",
        json={
            "email": "test@example.com",
            "password": "password123"
        }
    )

    response = client.post(
        "/auth/login",
        data={
            "username": "test@example.com",
            "password": "wrongpassword"
        }
    )

    assert response.status_code == 401
