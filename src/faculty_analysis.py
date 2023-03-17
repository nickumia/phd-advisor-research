
from nlp.processing.inputs import BasicText
from nlp.processing.corpus.representativeness import occurences
import json

exclude = ['and', 'of', 'for', 'to', 'in', 'the', 'ai', 'if', 'rf']


def presanitize(raw):
    raw.replace('AI', 'Artificial Intelligence')
    raw.replace('RF', 'Radio Frequency')
    raw.replace('IF', 'Infrared')
    raw.replace('IoT', 'Internet of Things')

def postsanitize(high):
    for filler in exclude:
        if filler in high.keys():
            del high[filler]

## Load Raw Data
with open('data/faculty.json', 'r') as ff:
    faculty = json.load(ff)


## Create Reference Corpus
raw_interests = ' '.join([instance for person in faculty for instance in person['interests']])
presanitize(raw_interests)
text = BasicText(raw_interests)

## Get Baseline from Reference Corpus
reference = occurences(text.getWords())
high_rank = { k:v for k,v in reference.items() if v > 1 }
postsanitize(high_rank)

## Determine which faculty share the same high ranking interests
connected_interests = { k:[] for k in high_rank.keys() }
for person in faculty:
    interests = ' '.join(person['interests'])
    presanitize(interests)
    # print(interests)
    try:
        text2 = BasicText(interests)
        unique = occurences(text2.getWords())
        postsanitize(unique)
        for word in occurences(text2.getWords()).keys():
            if word in connected_interests.keys():
                connected_interests[word].append(person['name'])
    except KeyError:
        pass
# print(connected_interests)

## Delete high rank interest if only consists of one person
for topic,people in connected_interests.items():
    if len(people) == 1:
        del high_rank[topic]
# print(high_rank)

print(len(high_rank.keys()))
print(len(connected_interests.keys()))
