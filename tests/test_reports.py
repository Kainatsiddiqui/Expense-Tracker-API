import pprint

def test_dashboard_summary(client, auth_headers):
    client.post(
        "/expenses",
        json={
            "title": "Lunch",
            "amount": 500,
            "category": "Food"
        },
        headers=auth_headers
    )


    client.post(
        "/expenses",
        json={
            "title": "Rent",
            "amount": 1500,
            "category": "Rent"
        },
        headers=auth_headers
    )

    client.post(
        "/expenses",
        json={
            "title": "Cab",
            "amount": 1000,
            "category": "Travel"
        },
        headers=auth_headers
    )

    response = client.get(
        "/reports/dashboard",
        headers=auth_headers
    )

    pprint.pprint(response.json())

    assert response.status_code == 200


def test_category_percentage(client, auth_headers):
    client.post(
        "/expenses",
        json={
            "title": "Lunch",
            "amount": 500,
            "category": "Food"
        },
        headers=auth_headers
    )

    client.post(
        "/expenses",
        json={
            "title": "Rent",
            "amount": 1500,
            "category": "Rent"
        },
        headers=auth_headers
    )

    client.post(
        "/expenses",
        json={
            "title": "Cab",
            "amount": 1000,
            "category": "Travel"
        },
        headers=auth_headers
    )

    response = client.get(
        "/reports/category-percentage",
        headers=auth_headers
    )

    assert response.status_code == 200

    data = response.json()

    percentages = {
        item["category"]: item["percentage"]
        for item in data
    }

    assert round(percentages["Food"], 2) == 16.67
    assert round(percentages["Rent"], 2) == 50.00
    assert round(percentages["Travel"], 2) == 33.33
