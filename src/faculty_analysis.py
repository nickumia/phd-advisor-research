
from nlp.processing.inputs import BasicText
from nlp.processing.corpus.representativeness import occurences
from nltk.stem import WordNetLemmatizer
import json

exclude = ['and', 'of', 'for', 'to', 'in', 'the', 'ai', 'if', 'rf']
# Create WordNetLemmatizer object
wnl = WordNetLemmatizer()
class blanklemma:
    def __init__(self):
        pass
    def lemmatize(self, w):
        return w
# wnl = blanklemma()

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
raw_interests = ' '.join([wnl.lemmatize(instance) for person in faculty for instance in person['interests']])
presanitize(raw_interests)
text = BasicText(raw_interests)

## Get Baseline from Reference Corpus
reference = occurences([wnl.lemmatize(w) for w in text.getWords()])
high_rank = { k:v for k,v in reference.items() if v > 2 }
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
        partials = occurences([wnl.lemmatize(w) for w in text2.getWords()])
        for word in occurences(partials).keys():
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

labels = []
data = []
for k,v in high_rank.items():
    labels.append(k)
    data.append(v)

faculty_names = [person['name'] for person in faculty]

with open('data/interests.json', 'w') as di:
    data_out = [{'data': data}]
    json.dump({'labels': labels, 'datasets': data_out}, di, indent = 2)


with open('data/connected_interests.json', 'w') as di:
    data_out = []

    for topic in connected_interests.keys():
        for person in connected_interests[topic]:
            data_out.append({'y': topic, 'x': person, 'v': 21})

    struct_out = {
        'connections': data_out,
        'names': faculty_names,
        'topics': list(connected_interests.keys())
    }
    json.dump(struct_out, di, indent = 2)

print('# Of Topics: %s' % (len(connected_interests.keys())))
print('# Of People: %s' % (len(faculty_names)))
