import numpy
from gensim.models import keyedvectors

e2v = keyedvectors.load_word2vec_format('emoji2vec.bin', binary=True)
print(e2v.shape)