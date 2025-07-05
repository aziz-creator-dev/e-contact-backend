import sys
import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def get_produits(secteur_code):
    options = Options()
    options.headless = True  # بش مايظهرش المتصفح

    # 🔥 حدد المسار إلى chromedriver
    driver_path = r"D:\Stage\Silex-E-carnet\backend-sql\scraping\chromedriver-win64\chromedriver.exe"
    service = Service(driver_path)

    # ✅ هكّا تنشئ المتصفح بالطريقة الصحيحة
    driver = webdriver.Chrome(service=service, options=options)

    try:
        url = "https://www.tunisieindustrie.nat.tn/fr/dbi.asp"
        driver.get(url)
        time.sleep(2)  # ننتظر شوية باش تحمل الصفحة

        # نختار القطاع حسب الكود
        secteur_select = Select(driver.find_element(By.NAME, "secteur"))
        secteur_select.select_by_value(secteur_code)

        time.sleep(2)  # ننتظر تحديث القائمة

        produit_select = Select(driver.find_element(By.NAME, "produit"))
        produits = []

        for option in produit_select.options:
            code = option.get_attribute("value").strip()
            nom = option.text.strip()
            if code and code != "":
                produits.append({"code": code, "nom": nom})

        return produits

    finally:
        driver.quit()

# ✅ Exécution principale
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "secteur code manquant"}))
        sys.exit(1)

    secteur = sys.argv[1]

    try:
        produits = get_produits(secteur)
        print(json.dumps(produits, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
