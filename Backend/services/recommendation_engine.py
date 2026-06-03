def get_recommendations(data):

    tips=[]

    if data["transport"]>4:
        tips.append(
        "Use public transport twice a week"
        )

    if data["electricity"]>5:
        tips.append(
        "Turn off unused appliances"
        )

    if data["food"]>4:
        tips.append(
        "Try plant-based meals"
        )

    return tips