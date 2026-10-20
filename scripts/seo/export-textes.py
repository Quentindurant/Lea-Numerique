"""Exporte le texte visible des pages (balise <main>) en Markdown, pour relecture.

Usage : python3 scripts/seo/export-textes.py http://localhost:3000 docs/seo/textes
Dépendances : pip install html2text beautifulsoup4
"""
import re
import sys
import urllib.request
from pathlib import Path

import html2text
from bs4 import BeautifulSoup

PAGES = {
    "solutions-hub": "/solutions",
    "telephonie-ip": "/solutions/telephonie-ip",
    "operateur-telecom": "/solutions/operateur-telecom",
    "reseaux-wifi": "/solutions/reseaux-wifi",
    "materiel-informatique": "/solutions/materiel-informatique",
    "cybersecurite": "/solutions/cybersecurite",
    "alarme-videosurveillance": "/solutions/alarme-videosurveillance",
    "services": "/services",
}


def fetch(url: str) -> str:
    with urllib.request.urlopen(url, timeout=30) as r:
        return r.read().decode("utf-8")


def main() -> None:
    base, out_dir = sys.argv[1].rstrip("/"), Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)
    conv = html2text.HTML2Text()
    conv.body_width = 0
    conv.ignore_images = True
    conv.ignore_emphasis = False
    for name, path in PAGES.items():
        html = fetch(base + path)
        soup = BeautifulSoup(html, "html.parser")
        title = soup.title.get_text(strip=True) if soup.title else ""
        desc_tag = soup.find("meta", attrs={"name": "description"})
        desc = desc_tag["content"] if desc_tag else ""
        main_el = soup.find("main")
        for tag in main_el.find_all(["svg", "script", "style", "img"]):
            tag.decompose()
        # <summary> contient un <h3> : on garde la question comme titre
        text_words = len(main_el.get_text(" ", strip=True).split())
        md = conv.handle(str(main_el))
        md = re.sub(r"\n{3,}", "\n\n", md).strip()
        header = (
            f"# Texte de la page {path}\n\n"
            f"- URL : https://lea-numerique.fr{path}\n"
            f"- Balise title ({len(title)} caractères) : {title}\n"
            f"- Meta description ({len(desc)} caractères) : {desc}\n"
            f"- Nombre de mots du contenu principal : {text_words}\n\n"
            "Fichier généré automatiquement depuis la page construite, pour relecture. "
            "Les corrections se font dans le code source (src/content/solutions/*.ts, "
            "src/app/solutions/page.tsx ou src/content/services.ts), puis ce fichier est régénéré.\n\n"
            "---\n\n"
        )
        (out_dir / f"{name}.md").write_text(header + md + "\n", encoding="utf-8")
        print(f"{name}: {text_words} mots, title {len(title)}, description {len(desc)}")


if __name__ == "__main__":
    main()
