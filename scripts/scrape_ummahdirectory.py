#!/usr/bin/env python3
import csv
import html
import json
import re
import time
from collections import defaultdict
from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


BASE = "https://ummahdirectory.com.au"
OUT_DIR = Path("data/ummahdirectory")
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "Mozilla/5.0 (compatible; Codex directory mapper)"})
retry_policy = Retry(
    total=3,
    connect=3,
    read=3,
    backoff_factor=0.6,
    status_forcelist=(429, 500, 502, 503, 504),
    allowed_methods=("GET",),
)
adapter = HTTPAdapter(max_retries=retry_policy, pool_connections=8, pool_maxsize=8)
SESSION.mount("https://", adapter)
SESSION.mount("http://", adapter)


def get_json(url, params=None, retries=4):
    for attempt in range(retries):
        try:
            response = SESSION.get(url, params=params, timeout=(6, 20))
            response.raise_for_status()
            return response.json(), response.headers
        except requests.RequestException:
            if attempt == retries - 1:
                raise
            time.sleep(1 + attempt)


def get_html(url, retries=4):
    for attempt in range(retries):
        try:
            response = SESSION.get(url, timeout=(6, 20))
            response.raise_for_status()
            return response.text
        except requests.RequestException:
            if attempt == retries - 1:
                raise
            time.sleep(1 + attempt)


def paginated(endpoint, params):
    params = dict(params)
    params.setdefault("per_page", 100)
    page = 1
    rows = []
    while True:
        params["page"] = page
        print(f"fetching {endpoint} page {page}", flush=True)
        data, headers = get_json(f"{BASE}/wp-json/wp/v2/{endpoint}", params=params)
        rows.extend(data)
        total_pages = int(headers.get("X-WP-TotalPages", page))
        if page >= total_pages:
            return rows
        page += 1


def text_from_html(value):
    soup = BeautifulSoup(value or "", "html.parser")
    return " ".join(soup.get_text(" ", strip=True).split())


def meta_content(soup, prop):
    tag = soup.find("meta", property=prop) or soup.find("meta", attrs={"name": prop})
    return tag.get("content", "").strip() if tag else ""


def visible_lines(soup):
    soup = BeautifulSoup(str(soup), "html.parser")
    for tag in soup(["script", "style", "noscript", "svg"]):
        tag.decompose()
    lines = [line.strip() for line in soup.get_text("\n").splitlines()]
    return [line for line in lines if line]


def external_links(soup):
    links = []
    for link in soup.find_all("a", href=True):
        href = link["href"].strip()
        label = " ".join(link.get_text(" ", strip=True).split())
        if not href or href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:"):
            continue
        parsed = urlparse(href)
        if parsed.netloc and "ummahdirectory.com.au" not in parsed.netloc:
            links.append({"label": label, "url": href})
    return links


def parse_listing_page(post):
    soup = BeautifulSoup(get_html(post["link"]), "html.parser")
    title = html.unescape(post["title"]["rendered"])
    lines = visible_lines(soup)

    title_index = None
    for idx, line in enumerate(lines):
        if line == title and idx + 1 < len(lines) and lines[idx + 1] in {"Ummah Partner", "Free Listing"}:
            title_index = idx
            break
    if title_index is None:
        for idx, line in enumerate(lines):
            if line == title:
                title_index = idx
                break

    status = ""
    tagline = ""
    description_lines = []
    if title_index is not None:
        cursor = title_index + 1
        if cursor < len(lines) and lines[cursor] in {"Ummah Partner", "Free Listing"}:
            status = lines[cursor]
            cursor += 1
        while cursor < len(lines) and lines[cursor] in {"Website", "Contact This Listing"}:
            cursor += 1
        if cursor < len(lines):
            tagline = lines[cursor]
            cursor += 1
        while cursor < len(lines) and lines[cursor] not in {"Contact This Listing", "Business Hours", "Share this listing", "Contact this Business"}:
            if lines[cursor] not in {"Website", "Instagram", "Facebook", "LinkedIn", "WhatsApp", "X", "Threads", "Email"}:
                description_lines.append(lines[cursor])
            cursor += 1

    address = ""
    email = ""
    phone = ""
    contact_links = []
    icon_items = soup.select("li.elementor-icon-list-item")
    for item in icon_items:
        label = " ".join(item.get_text(" ", strip=True).split())
        link = item.find("a", href=True)
        href = link["href"].strip() if link else ""
        if href.startswith("mailto:") and not email:
            email = href.replace("mailto:", "").split("?")[0]
        elif href.startswith("tel:") and not phone:
            phone = label or href.replace("tel:", "")
        elif href and label in {"Instagram", "Facebook", "LinkedIn", "WhatsApp", "X", "Threads", "Email"}:
            contact_links.append({"label": label, "url": href})
        elif not href and label and label not in {
            "Australia's Largest Online Directory for Muslims",
            "Ummah Partner",
            "Free Listing",
        } and not label.startswith("ABN "):
            if not address and re.search(r"\b(?:NSW|VIC|QLD|SA|WA|TAS|NT|ACT)\b|\d{4}\b", label):
                address = label

    all_external = external_links(soup)
    image = meta_content(soup, "og:image")
    og_description = meta_content(soup, "og:description")

    return {
        "id": post["id"],
        "title": title,
        "url": post["link"],
        "slug": post["slug"],
        "status_badge": status,
        "tagline": tagline,
        "address": address,
        "email": email,
        "phone": phone,
        "description": "\n".join(description_lines).strip() or text_from_html(post.get("content", {}).get("rendered", "")),
        "excerpt": text_from_html(post.get("excerpt", {}).get("rendered", "")),
        "og_description": og_description,
        "image": image,
        "external_links": all_external,
        "contact_links": contact_links,
        "category_ids": post.get("categories", []),
        "tag_ids": post.get("tags", []),
        "date": post.get("date", ""),
        "modified": post.get("modified", ""),
    }


def write_csv(path, rows, fieldnames):
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            flat = {}
            for field in fieldnames:
                value = row.get(field, "")
                if isinstance(value, (list, dict)):
                    value = json.dumps(value, ensure_ascii=False)
                flat[field] = value
            writer.writerow(flat)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    categories = paginated("categories", {"hide_empty": "false"})
    print(f"fetched {len(categories)} categories", flush=True)
    category_by_id = {cat["id"]: cat for cat in categories}
    category_rows = []
    for cat in categories:
        parent = category_by_id.get(cat.get("parent"))
        category_rows.append({
            "id": cat["id"],
            "name": html.unescape(cat["name"]),
            "slug": cat["slug"],
            "parent_id": cat["parent"],
            "parent_name": html.unescape(parent["name"]) if parent else "",
            "count": cat["count"],
            "url": cat["link"],
        })

    posts = paginated("posts", {
        "_fields": "id,slug,link,title,categories,tags,excerpt,date,modified",
        "orderby": "date",
        "order": "desc",
    })
    print(f"fetched {len(posts)} listings from API", flush=True)

    listings = []
    for index, post in enumerate(posts, 1):
        try:
            listing = parse_listing_page(post)
        except Exception as exc:
            listing = {
                "id": post["id"],
                "title": html.unescape(post["title"]["rendered"]),
                "url": post["link"],
                "slug": post["slug"],
                "description": text_from_html(post.get("excerpt", {}).get("rendered", "")),
                "category_ids": post.get("categories", []),
                "tag_ids": post.get("tags", []),
                "scrape_error": str(exc),
            }
        listing["category_names"] = [
            html.unescape(category_by_id[cat_id]["name"])
            for cat_id in listing.get("category_ids", [])
            if cat_id in category_by_id
        ]
        listings.append(listing)
        if index % 25 == 0:
            print(f"parsed {index}/{len(posts)} listings", flush=True)

    per_category = defaultdict(list)
    for listing in listings:
        for cat_id in listing.get("category_ids", []):
            per_category[cat_id].append(listing)

    samples = []
    for cat in sorted(category_rows, key=lambda row: (row["parent_name"], row["name"])):
        for listing in per_category.get(cat["id"], [])[:5]:
            samples.append({
                "category_id": cat["id"],
                "category_name": cat["name"],
                "category_slug": cat["slug"],
                "listing_id": listing["id"],
                "listing_title": listing["title"],
                "listing_url": listing["url"],
                "tagline": listing.get("tagline", ""),
                "address": listing.get("address", ""),
                "email": listing.get("email", ""),
                "phone": listing.get("phone", ""),
                "description": listing.get("description", ""),
                "category_names": listing.get("category_names", []),
            })

    about_soup = BeautifulSoup(get_html(f"{BASE}/about/"), "html.parser")
    about_lines = visible_lines(about_soup)
    about_copy = "\n".join(about_lines)
    mission_start = about_copy.find("Ummah Directory started")
    mission_copy = about_copy[mission_start:].strip() if mission_start >= 0 else about_copy

    (OUT_DIR / "categories.json").write_text(json.dumps(category_rows, indent=2, ensure_ascii=False), encoding="utf-8")
    (OUT_DIR / "listings.json").write_text(json.dumps(listings, indent=2, ensure_ascii=False), encoding="utf-8")
    (OUT_DIR / "sample_5_per_category.json").write_text(json.dumps(samples, indent=2, ensure_ascii=False), encoding="utf-8")
    (OUT_DIR / "vision_and_mission.txt").write_text(mission_copy, encoding="utf-8")

    category_fields = ["id", "name", "slug", "parent_id", "parent_name", "count", "url"]
    listing_fields = [
        "id", "title", "url", "slug", "status_badge", "tagline", "address", "email", "phone",
        "description", "excerpt", "og_description", "image", "external_links", "contact_links",
        "category_ids", "category_names", "tag_ids", "date", "modified", "scrape_error",
    ]
    sample_fields = [
        "category_id", "category_name", "category_slug", "listing_id", "listing_title", "listing_url",
        "tagline", "address", "email", "phone", "description", "category_names",
    ]
    write_csv(OUT_DIR / "categories.csv", category_rows, category_fields)
    write_csv(OUT_DIR / "listings.csv", listings, listing_fields)
    write_csv(OUT_DIR / "sample_5_per_category.csv", samples, sample_fields)

    print(json.dumps({
        "categories": len(category_rows),
        "categories_with_posts": sum(1 for row in category_rows if row["count"] > 0),
        "listings": len(listings),
        "sample_rows": len(samples),
        "output_dir": str(OUT_DIR),
    }, indent=2))


if __name__ == "__main__":
    main()
