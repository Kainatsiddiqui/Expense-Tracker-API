

#Test to Create expense for login user
def test_create_expense(client, auth_headers):
    response = client.post(
        "/expenses",
        json={
            "title": "Lunch",
            "amount": 250,
            "category": "Food"
        },
        headers=auth_headers
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Lunch"
    assert data["amount"] == 250
    assert data["category"] == "Food"

#Test Unauthorized access
def test_create_expense_without_token(client):
    response = client.post(
        "/expenses",
        json={
            "title": "Lunch",
            "amount": 250,
            "category": "Food"
        }
    )

    assert response.status_code == 401

# Test to get expense of created by login user
def test_get_expenses(client, auth_headers):
    client.post(
        "/expenses",
        json={
            "title": "Lunch",
            "amount": 250,
            "category": "Food"
        },
        headers=auth_headers
    )

    response = client.get(
        "/expenses",
        headers=auth_headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["title"] == "Lunch"


def test_update_expense(client, auth_headers):
    create = client.post(
        "/expenses",
        json={
            "title": "Lunch",
            "amount": 250,
            "category": "Food"
        },
        headers=auth_headers
    )

    expense_id = create.json()["id"]

    response = client.patch(
        f"/expenses/{expense_id}",
        json={
            "title": "Dinner",
            "amount": 400,
            "category": "Food"
        },
        headers=auth_headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["title"] == "Dinner"
    assert data["amount"] == 400

def test_delete_expense(client, auth_headers):
    create = client.post(
        "/expenses",
        json={
            "title": "Lunch",
            "amount": 250,
            "category": "Food"
        },
        headers=auth_headers
    )

    expense_id = create.json()["id"]

    response = client.delete(
        f"/expenses/{expense_id}",
        headers=auth_headers
    )

    assert response.status_code == 200

    deleted = response.json()
    assert deleted["id"] == expense_id
    assert deleted["title"] == "Lunch"

    expenses = client.get(
        "/expenses",
        headers=auth_headers
    )

    data = expenses.json()

    assert data["total"] == 0
    assert data["items"] == []


#Test Access Protection
def test_user_cannot_access_another_users_expense(
client,
auth_headers,
auth_headers_user2
):
    create = client.post(
        "/expenses",
        json={
            "title": "Rent",
            "amount": 15000,
            "category": "Rent"
        },
        headers=auth_headers
    )

    expense_id = create.json()["id"]

    response = client.get(
        f"/expenses/{expense_id}",
        headers=auth_headers_user2
    )

    assert response.status_code == 404

#Test Update Protection accessing by 2nd user of 1st users data
def test_user_cannot_update_another_users_expense(
client,
auth_headers,
auth_headers_user2
):
    create = client.post(
        "/expenses",
        json={
            "title": "Rent",
            "amount": 15000,
            "category": "Rent"
        },
        headers=auth_headers
    )

    expense_id = create.json()["id"]

    response = client.patch(
        f"/expenses/{expense_id}",
        json={
            "title": "Hacked"
        },
        headers=auth_headers_user2
    )

    assert response.status_code == 404

def test_user_cannot_delete_another_users_expense(
client,
auth_headers,
auth_headers_user2
):
    create = client.post(
        "/expenses",
        json={
            "title": "Rent",
            "amount": 15000,
            "category": "Rent"
        },
        headers=auth_headers
    )

    expense_id = create.json()["id"]

    response = client.delete(
        f"/expenses/{expense_id}",
        headers=auth_headers_user2
    )

    assert response.status_code == 404
