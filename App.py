import requests
from bs4 import BeautifulSoup
import json

def scrape_books():
    url = "http://books.toscrape.com/"
    response = requests.get(url)
    
    if response.status_code != 200:
        print("Failed to retrieve website data")
        return

    soup = BeautifulSoup(response.text, 'html.parser')
    books = []

    # Finding all book listings on the page
    for article in soup.find_all('article', class_='product_pod'):
        title = article.h3.a['title']
        price = article.find('p', class_='price_color').text
        availability = article.find('p', class_='instock availability').text.strip()
        
        books.append({
            "title": title,
            "price": price,
            "status": availability
        })
        
    # Saving data locally as a JSON file
    with open('books_data.json', 'w', encoding='utf-8') as f:
        json.dump(books, f, indent=4)
        
    print(f"Successfully scraped {len(books)} items and saved to books_data.json!")

if __name__ == "__main__":
    scrape_books()