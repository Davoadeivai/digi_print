import json
import urllib.error
import urllib.request

BASE = 'http://127.0.0.1:8000/api/v1'
def get_products():
    url = f"{BASE}/products/"
    print('GET', url)
    try:
        with urllib.request.urlopen(url) as r:
            print('Status:', r.status)
            print(r.read().decode())
    except urllib.error.HTTPError as e:
        print('HTTPError:', e.code, e.read().decode())
    except Exception as e:
        print('Error:', e)
def post_calculate():
    url = f"{BASE}/products/123/calculate_price/"
    data = json.dumps({'quantity': 2, 'base_price': 10}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    print('POST', url)
    try:
        with urllib.request.urlopen(req) as r:
            print('Status:', r.status)
            print(r.read().decode())
    except urllib.error.HTTPError as e:
        print('HTTPError:', e.code, e.read().decode())
    except Exception as e:
        print('Error:', e)
def post_contact():
    url = f"{BASE}/contact/"
    data = json.dumps({'name': 'Test', 'email': 'test@example.com', 'message': 'Hello from smoke test'}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    print('POST', url)
    try:
        with urllib.request.urlopen(req) as r:
            print('Status:', r.status)
            print(r.read().decode())
    except urllib.error.HTTPError as e:
        print('HTTPError:', e.code, e.read().decode())
    except Exception as e:
        print('Error:', e)
if __name__ == '__main__':
    get_products()
    print('\n---\n')
    post_calculate()
    print('\n---\n')
    post_contact()