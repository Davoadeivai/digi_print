"""
Simple checker to verify frontend API endpoints exist on local backend.

Usage:
  python scripts/check_links.py [--backend http://localhost:8000] [--files path1 path2 ...]

Default files checked are:
  frontend/src/components/pages/LabelPage.tsx
  frontend/src/components/pages/LabelCategoryPage.tsx

Note:
  - The script attempts simple substitutions for template vars like ${slug}, {id}, :slug -> 'test' or '1'.
  - It performs GET requests; some endpoints may require auth or POST, so adjust manually if needed.
"""
import re
import requests
import sys
import os
from pathlib import Path
import argparse

DEFAULT_BACKEND = "http://localhost:8000"
PROJECT_ROOT = Path(__file__).resolve().parents[1]  # .../Daidi_print

DEFAULT_FILES = [
    PROJECT_ROOT / "frontend" / "src" / "components" / "pages" / "LabelPage.tsx",
    PROJECT_ROOT / "frontend" / "src" / "components" / "pages" / "LabelCategoryPage.tsx",
]

API_RE = re.compile(r'(["\'`])(/api/v1/[^"\')` ]+)')  # capture strings like "/api/v1/..."
TPL_REPLACEMENTS = [
    (re.compile(r'\$\{[^}]+\}'), 'test'),
    (re.compile(r':slug\b'), 'test'),
    (re.compile(r'\{slug\}'), 'test'),
    (re.compile(r'\{id\}'), '1'),
    (re.compile(r'\$\{product\.id\}'), '1'),
    (re.compile(r'\$\{.*?id.*?\}'), '1'),
]

def normalize_endpoint(raw):
    ep = raw.strip()
    # remove query-sections that include template constructs? keep queries
    for pattern, repl in TPL_REPLACEMENTS:
        ep = pattern.sub(repl, ep)
    # collapse duplicate slashes
    ep = re.sub(r'\/+', '/', ep)
    # ensure trailing slash for Django style
    if not re.search(r'\.[a-z]{2,4}$', ep) and not ep.endswith('/'):
        ep = ep + '/'
    return ep

def extract_endpoints_from_file(path: Path):
    if not path.exists():
        return []
    text = path.read_text(encoding='utf-8')
    matches = API_RE.findall(text)
    endpoints = [m[1] for m in matches]
    return endpoints

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--backend', default=DEFAULT_BACKEND, help='Backend base URL (default http://localhost:8000)')
    parser.add_argument('--files', nargs='*', help='Frontend files to scan')
    args = parser.parse_args()

    files = []
    if args.files:
        files = [Path(f) for f in args.files]
    else:
        files = DEFAULT_FILES

    found = set()
    for f in files:
        eps = extract_endpoints_from_file(f)
        for e in eps:
            found.add(e)

    if not found:
        print("No /api/v1/ endpoints found in the scanned files.")
        return 0

    print("Extracted endpoints (raw):")
    for e in sorted(found):
        print("  ", e)
    print()

    normalized = {normalize_endpoint(e) for e in found}
    print("Normalized endpoints to test:")
    for e in sorted(normalized):
        print("  ", e)
    print()

    print(f"Testing endpoints against backend: {args.backend}")
    session = requests.Session()
    session.headers.update({"User-Agent": "daidi-link-checker/1.0"})
    results = []
    for ep in sorted(normalized):
        url = args.backend.rstrip('/') + ep
        try:
            r = session.get(url, timeout=6)
            results.append((ep, r.status_code, r.reason))
        except requests.RequestException as exc:
            results.append((ep, None, str(exc)))

    print("\nResults:")
    for ep, status, info in results:
        status_str = str(status) if status is not None else "ERROR"
        print(f"  {ep:60} -> {status_str}  {info}")

    # Summary
    missing = [r for r in results if r[1] is None or (isinstance(r[1], int) and r[1] >= 400)]
    if missing:
        print("\nEndpoints that returned errors (400+/network):")
        for ep, status, info in missing:
            print(f"  {ep} -> {status} {info}")
        print("\nAction: Implement corresponding backend view/route or adjust frontend endpoint.")
        return 2

    print("\nAll tested endpoints responded with non-error status codes.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
