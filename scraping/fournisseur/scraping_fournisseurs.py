import requests
from bs4 import BeautifulSoup
import json
import re
import sys
import io

# تعيين stdout ل UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# لا تطبع أي شيء قبل طباعة الـ JSON النظيف!

def scrape_entreprises():
    secteur = sys.argv[1]
    produit = sys.argv[2]

    BASE_URL = "https://www.tunisieindustrie.nat.tn/fr/"
    search_url = BASE_URL + "dbi.asp"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": search_url
    }

    data = {
        "secteur": secteur,
        "produit": produit,
        "District": "",
        "action": "search"
    }

    session = requests.Session()
    response = session.post(search_url, headers=headers, data=data)
    soup = BeautifulSoup(response.text, "html.parser")

    rows = soup.select("table.one tr")

    fournisseurs = []

    for index, row in enumerate(rows):
        cols = row.find_all("td")
        if len(cols) < 4:
            continue

        nom = cols[0].text.strip()
        tel = cols[2].text.strip()
        gouvernorat = cols[3].text.strip()
        categorie = cols[1].text.strip()

        onclick = row.get("onclick")
        ident = None
        url = "N/A"
        email = "N/A"
        adresse = "N/A"
        pays = "N/A"

        if onclick:
            match = re.search(r'ident=(\d+)', onclick)
            if match:
                ident = match.group(1)
                url = f"{BASE_URL}dbi.asp?action=result&ident={ident}"

                try:
                    detail_resp = session.get(url)
                    detail_soup = BeautifulSoup(detail_resp.text, "html.parser")

                    def extract_text(label):
                        tag = detail_soup.find(string=lambda t: label in t)
                        if tag and tag.find_next():
                            return tag.find_next().text.strip()
                        return "N/A"

                    nom = extract_text("Dénomination") or nom
                    email = extract_text("E-mail")
                    tel = extract_text("Téléphone siège/usine") or tel
                    categorie = extract_text("Activités") or categorie
                    adresse = extract_text("Adresse usine")
                    pays = extract_text("Pays du Participant Etranger")

                except Exception:
                    pass

        fournisseur = {
            "idf": index + 1,
            "nom": nom,
            "email": email,
            "tel": tel,
            "categorie": categorie,
            "adresse": adresse,
            "pays": pays,
            "rating": 4.5,
            "ida_f": ident if ident else f"noid_{index+1}",
            "image_url": "https://via.placeholder.com/150",
            "url": url
        }

        fournisseurs.append(fournisseur)

    # اطبع فقط هذا الـ JSON النظيف
    print(json.dumps(fournisseurs, ensure_ascii=False))


if __name__ == "__main__":
    scrape_entreprises()
