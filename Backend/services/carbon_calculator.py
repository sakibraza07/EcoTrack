transport_emission = {
    "car":0.21,
    "bike":0.12,
    "bus":0.08,
    "train":0.05,
    "walking":0
}

food_emission = {
    "vegetarian":1.5,
    "mixed":3,
    "nonvegetarian":5
}


def calculate_carbon(
        transport,
        distance,
        food,
        electricity):

    transport_score = transport_emission[transport]*distance

    food_score=food_emission[food]

    electricity_score=electricity*0.82

    total=(
        transport_score
        +food_score
        +electricity_score
    )

    return {
        "transport":transport_score,
        "food":food_score,
        "electricity":electricity_score,
        "total":round(total,2)
    }