import requests
from bs4 import BeautifulSoup
import json
import sys
import io

# تعيين stdout ل UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def get_secteur():
    url = "https://www.tunisieindustrie.nat.tn/fr/dbi.asp"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    }

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(json.dumps({"error": "Erreur de chargement de la page"}))
        return

    soup = BeautifulSoup(response.text, "html.parser")
    select = soup.find("select", {"name": "secteur"})

    if not select:
        print(json.dumps({"error": "select secteur non trouvé"}))
        return

    secteurs = []
    for option in select.find_all("option"):
        code = option.get("value").strip()
        nom = option.text.strip()
        if code != "":
            secteurs.append({"code": code, "nom": nom})

    print(json.dumps(secteurs, ensure_ascii=False))


if __name__ == "__main__":
    get_secteur()
