import requests
from bs4 import BeautifulSoup
import json
import re
import sys
import io

# تعيين stdout لـ UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def scrape_clients():
    secteur = sys.argv[1]
    denomination = sys.argv[2]

    BASE_URL = "https://www.tunisieindustrie.nat.tn/fr/"
    search_url = BASE_URL + "dbS.asp"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": search_url
    }

    data = {
        "secteur": secteur,
        "Denomination": denomination,
        "action": "search"
    }

    session = requests.Session()
    response = session.post(search_url, headers=headers, data=data)
    soup = BeautifulSoup(response.text, "html.parser")

    rows = soup.select("table.one tr")

    clients = []

    for index, row in enumerate(rows):
        cols = row.find_all("td")
        if len(cols) < 4:
            continue

        nom = cols[0].text.strip()
        tel = cols[2].text.strip()
        gouvernorat = cols[3].text.strip()
        secteur_ = cols[1].text.strip()

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
                url = f"{BASE_URL}dbS.asp?action=result&ident={ident}"

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
                    tel = extract_text("Téléphone") or tel
                    adresse = extract_text("Adresse")
                    pays = extract_text("Pays")

                except Exception:
                    pass

        client = {
            "idc": index + 1,
            "nom": nom,
            "email": email,
            "tel": tel,
            "secteur": secteur_,
            "adresse": adresse,
            "pays": pays,
            "rating": 4.3,
            "ida_c": ident if ident else f"noid_{index+1}",
            "image_url": "https://via.placeholder.com/150",
            "url": url
        }

        clients.append(client)

    print(json.dumps(clients, ensure_ascii=False))


if __name__ == "__main__":
    scrape_clients()
