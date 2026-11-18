from app.services.aqi_engine import calculate_sub_index, calculate_naqi, get_aqi_category_info

def test_pm25_sub_index():
    assert calculate_sub_index("pm25", 15) == 25.0
    assert calculate_sub_index("pm25", 60) == 100.0
    # 121 - 250 maps to 301 - 400
    sub = calculate_sub_index("pm25", 250)
    assert sub == 400.0

def test_aqi_category():
    assert get_aqi_category_info(45)["category"] == "Good"
    assert get_aqi_category_info(85)["category"] == "Satisfactory"
    assert get_aqi_category_info(150)["category"] == "Moderate"
    assert get_aqi_category_info(250)["category"] == "Poor"
    assert get_aqi_category_info(350)["category"] == "Very Poor"
    assert get_aqi_category_info(450)["category"] == "Severe"

def test_overall_naqi():
    data = {
        "pm25": 180.0,
        "pm10": 260.0,
        "no2": 45.0
    }
    result = calculate_naqi(data)
    assert result["aqi"] > 0
    assert result["primary_pollutant"] in ["PM25", "PM10"]
    assert result["is_official_cpcb_compliant"] is True

