
from __future__ import division
import nltk
from nltk.corpus import wordnet as wn
from nltk.corpus import brown
import math
import numpy as np
import sys

ALPHA = 0.2
BETA = 0.45
ETA = 0.4
PHI = 0.2
DELTA = 0.85

brown_freqs = dict()
N = 0

######################### word similarity ##########################

def get_best_synset_pair(word_1, word_2):


    max_sim = -1.0
    synsets_1 = wn.synsets(word_1)
    synsets_2 = wn.synsets(word_2)


    if len(synsets_1) == 0 or len(synsets_2) == 0:
        return None, None


    else:
        max_sim = -1.0
        best_pair = None, None
        for synset_1 in synsets_1:
            for synset_2 in synsets_2:
               sim = wn.path_similarity(synset_1, synset_2)

               # error occured
               if sim is not None and sim > max_sim:
                   max_sim = sim
                   best_pair = synset_1, synset_2

        # 2つの単語の類義語一覧の中から最も似ているペアを返す
        return best_pair


# 2つの単語の距離を計算する
def length_dist(synset_1, synset_2):


    # 整数int型に最大値はない出やんす
    # l_dist = sys.maxint

    l_dist = sys.maxsize

    if synset_1 is None or synset_2 is None:
        return 0.0


    if synset_1 == synset_2:
        # if synset_1 and synset_2 are the same synset return 0
        l_dist = 0.0


    else:

        # lemmarize
        wset_1 = set([str(x.name()) for x in synset_1.lemmas()])
        wset_2 = set([str(x.name()) for x in synset_2.lemmas()])


        # wset1と2から共通するものを探し、新たな集合を作成
        if len(wset_1.intersection(wset_2)) > 0:

            # 2つの集合の重なりからなる新たな集合が存在する場合
            l_dist = 1.0

        else:

            # just compute the shortest path between the two
            l_dist = synset_1.shortest_path_distance(synset_2)

            if l_dist is None:
                l_dist = 0.0


    # normalize path length to the range [0,1]
    # alpha = 0.2
    return math.exp(-ALPHA * l_dist)


# 階層構造
# most similar pair
def hierarchy_dist(synset_1, synset_2):


    # h_dist = sys.maxint
    h_dist = sys.maxsize


    if synset_1 is None or synset_2 is None:
        return h_dist

    if synset_1 == synset_2:
        # return the depth of one of synset_1 or synset_2
        h_dist = max([x[1] for x in synset_1.hypernym_distances()])

    else:
        # find the max depth of least common subsumer
        hypernyms_1 = {x[0]:x[1] for x in synset_1.hypernym_distances()}
        hypernyms_2 = {x[0]:x[1] for x in synset_2.hypernym_distances()}


        lcs_candidates = set(hypernyms_1.keys()).intersection(

            set(hypernyms_2.keys()))

        if len(lcs_candidates) > 0:
            lcs_dists = []
            for lcs_candidate in lcs_candidates:

                lcs_d1 = 0

                # dictはhas_keyを持たない
                if 'lcs_candidate' in hypernyms_1:
                    lcs_d1 = hypernyms_1[lcs_candidate]

                lcs_d2 = 0

                if 'lcs_candidate' in hypernyms_2:
                    lcs_d2 = hypernyms_2[lcs_candidate]

                lcs_dists.append(max([lcs_d1, lcs_d2]))
            h_dist = max(lcs_dists)
        else:
            h_dist = 0


    return ((math.exp(BETA * h_dist) - math.exp(-BETA * h_dist)) /
        (math.exp(BETA * h_dist) + math.exp(-BETA * h_dist)))


# 2つの単語の類似度
def word_similarity(word_1, word_2):


    # 2つの単語の最も類似だが高いペアを見つける
    synset_pair = get_best_synset_pair(word_1, word_2)

    # 単語の距離[0, 1] と
    return (length_dist(synset_pair[0], synset_pair[1]) * hierarchy_dist(synset_pair[0], synset_pair[1]))

######################### sentence similarity ##########################


# 和集合の単語と文章の単語集合
def most_similar_word(word, word_set):



    max_sim = -1.0
    sim_word = ""
    for ref_word in word_set:
      sim = word_similarity(word, ref_word)


      if sim > max_sim:
          max_sim = sim
          sim_word = ref_word
    return sim_word, max_sim

def info_content(lookup_word):
    """
    Uses the Brown corpus available in NLTK to calculate a Laplace
    smoothed frequency distribution of words, then uses this information
    to compute the information content of the lookup_word.
    """
    global N



    if N == 0:
        # poor man's lazy evaluation
        for sent in brown.sents():

            for word in sent:
                word = word.lower()


                # if not brown_freqs.has_key(word):
                #     print(word)

                if word in brown_freqs:
                    brown_freqs[word] = brown_freqs[word] + 1

                else:
                    brown_freqs[word] = 0
                    brown_freqs[word] = brown_freqs[word] + 1



                N = N + 1
    lookup_word = lookup_word.lower()
    n = 0 if not 'lookup_word' in brown_freqs else brown_freqs[lookup_word]
    return 1.0 - (math.log(n + 1) / math.log(N + 1))


# ある文の集合と比較対象との和集合
def semantic_vector(words, joint_words, info_content_norm):


    # 入力単語を集合に変換する
    sent_set = set(words)

    # 和集合と同じ大きさでベクトルを初期化
    semvec = np.zeros(len(joint_words))

    i = 0

    for joint_word in joint_words:

        if joint_word in sent_set:
            # if word in union exists in the sentence, s(i) = 1 (unnormalized)
            semvec[i] = 1.0

            # true or false
            # vectorの要素に重みをつける
            if info_content_norm:
                semvec[i] = semvec[i] * math.pow(info_content(joint_word), 2)

        else:
            # PHI = 0.2
            # 置き換える単語とその類似度
            sim_word, max_sim = most_similar_word(joint_word, sent_set)

            # 0.2より小さい場合要素は0になる
            semvec[i] = PHI if max_sim > PHI else 0.0


            # 重み付け
            if info_content_norm:
                semvec[i] = semvec[i] * info_content(joint_word) * info_content(sim_word)


        i = i + 1

    return semvec  # semantic vector



# deltaをかける式
# 2つの意味ベクトルのコサイン類似度を求める
def semantic_similarity(sentence_1, sentence_2, info_content_norm):


    # 形態素解析
    words_1 = nltk.word_tokenize(sentence_1)
    words_2 = nltk.word_tokenize(sentence_2)


    # 2つの文章の和集合
    joint_words = set(words_1).union(set(words_2))


    # semantic vector (onr_hot)
    vec_1 = semantic_vector(words_1, joint_words, info_content_norm)
    vec_2 = semantic_vector(words_2, joint_words, info_content_norm)


    # 2つのベクトルをもとに意味的類似度ベクトルの計算
    return np.dot(vec_1, vec_2.T) / (np.linalg.norm(vec_1) * np.linalg.norm(vec_2))

######################### word order similarity ##########################


# 単語の出現順序を意識したベクトル
def word_order_vector(words, joint_words, windex):


    # ETA = 0.4

    # 和集合でベクトル初期科
    wovec = np.zeros(len(joint_words))
    i = 0

    wordset = set(words)

    for joint_word in joint_words:

        if joint_word in wordset:
            # word in joint_words found in sentence, just populate the index
            wovec[i] = windex[joint_word]
        else:
            # word not in joint_words, find most similar word and populate
            # word_vector with the thresholded similarity
            sim_word, max_sim = most_similar_word(joint_word, wordset)
            if max_sim > ETA:
                wovec[i] = windex[sim_word]
            else:
                wovec[i] = 0
        i = i + 1
    return wovec

def word_order_similarity(sentence_1, sentence_2):
    """
    Computes the word-order similarity between two sentences as the normalized
    difference of word order between the two sentences.
    """
    words_1 = nltk.word_tokenize(sentence_1)
    words_2 = nltk.word_tokenize(sentence_2)

    joint_words = list(set(words_1).union(set(words_2)))

    windex = {x[1]: x[0] for x in enumerate(joint_words)}

    r1 = word_order_vector(words_1, joint_words, windex)
    r2 = word_order_vector(words_2, joint_words, windex)


    return 1.0 - (np.linalg.norm(r1 - r2) / np.linalg.norm(r1 + r2))

######################### overall similarity ##########################


# caluculate semantic similarity between two sentence
def similarity(sentence_1, sentence_2, info_content_norm):

    # DELTA = 0.85

    # semantic similarity is one hot-ector

    return DELTA * semantic_similarity(sentence_1, sentence_2, info_content_norm) + \
        (1.0 - DELTA) * word_order_similarity(sentence_1, sentence_2)

######################### main / test ##########################

# the results of the algorithm are largely dependent on the results of
# the word similarities, so we should test this first...
# word_pairs = [
#   ["asylum", "fruit", 0.21],
#   ["autograph", "shore", 0.29],
#   ["autograph", "signature", 0.55],
#   ["automobile", "car", 0.64],
#   ["bird", "woodland", 0.33],
#   ["boy", "rooster", 0.53],
#   ["boy", "lad", 0.66],
#   ["boy", "sage", 0.51],
#   ["cemetery", "graveyard", 0.73],
#   ["coast", "forest", 0.36],
#   ["coast", "shore", 0.76],
#   ["cock", "rooster", 1.00],
#   ["cord", "smile", 0.33],
#   ["cord", "string", 0.68],
#   ["cushion", "pillow", 0.66],
#   ["forest", "graveyard", 0.55],
#   ["forest", "woodland", 0.70],
#   ["furnace", "stove", 0.72],
#   ["glass", "tumbler", 0.65],
#   ["grin", "smile", 0.49],
#   ["gem", "jewel", 0.83],
#   ["hill", "woodland", 0.59],
#   ["hill", "mound", 0.74],
#   ["implement", "tool", 0.75],
#   ["journey", "voyage", 0.52],
#   ["magician", "oracle", 0.44],
#   ["magician", "wizard", 0.65],
#   ["midday", "noon", 1.0],
#   ["oracle", "sage", 0.43],
#   ["serf", "slave", 0.39],
#   ['easy', 'difficult', 0.05]
# ]


# wordnetを用いて単語間の類似度を計算する
# for word_pair in word_pairs:
#     print ("%s\t%s\t%.2f\t%.2f" % (word_pair[0], word_pair[1], word_pair[2], word_similarity(word_pair[0], word_pair[1])))



# 意味を計算するための文章ペア
# sentence_pairs = [
#
#     ["It is difficult to understand English.", "I can hardly understand English.", 0.03],
#     ["It is difficult to understand English.", "I can easily understand English.", 0.33],
#     ["It is difficult to understand English.", "It is easy understand English.", 0.33]
# ]



sentence_list = []

for i in range(len(sys.argv)):

    if(i != 0):
        sentence_list.append(sys.argv[i])



    # print ("%s\t%s\t%.3f\t%.3f\t%.3f" % (sent_pair[0], sent_pair[1], sent_pair[2],
    #
    #     #文章ペアとレマライズの許可？
    #     similarity(sent_pair[0], sent_pair[1], False),
    #     similarity(sent_pair[0], sent_pair[1], True)))

print(similarity(sentence_list[0], sentence_list[1], True))
