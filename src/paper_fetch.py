
import json
import time
from scholarly import scholarly
from nlp.processing.storage import LocalStorage

storage = LocalStorage()

with open('data/faculty.json', 'r') as ff:
    faculty = json.load(ff)

storage.restore('papers.pkl')
papers = storage.save

for person in faculty:
    name = person['name']
    scholar_id = person['google_scholar_id']
    if scholar_id is not "" and name not in papers.keys():
        search_query = scholarly.search_author_id(scholar_id)
        author = scholarly.fill(search_query)
        cites_per_year = author['cites_per_year']
        interests = author['interests']
        publications = {}
        for i in author['publications']:
            nc = i['num_citations'] if 'num_citations' in i.keys() else 0
            year = i['bib']['pub_year'] if 'pub_year' in i['bib'].keys() else None
            publications[i['bib']['title']] = {
                'num_citations': nc,
                'pub_year': year
            }
        papers[name] = {
            'google_scholar_id': scholar_id,
            'cites_per_year': cites_per_year,
            'interests': interests,
            'publications': publications
        }
        storage.save = papers
        storage.backup('papers.pkl')
        time.sleep(5)
    print('Completed %s' % (name))
# scholarly.pprint(author)
