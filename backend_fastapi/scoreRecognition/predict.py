import tensorflow as tf
import scoreRecognition.ctc_utils as ctc_utils
import cv2
import numpy as np

def decode_score(image_path, model_path, vocabulary_path):
    tf.reset_default_graph()
    sess = tf.InteractiveSession()

    dict_file = open(vocabulary_path, 'r')
    dict_list = dict_file.read().splitlines()
    int2word = dict()
    for word in dict_list:
        word_idx = len(int2word)
        int2word[word_idx] = word
    dict_file.close()

    saver = tf.train.import_meta_graph(model_path)
    saver.restore(sess, model_path[:-5])

    graph = tf.get_default_graph()

    input_tensor = graph.get_tensor_by_name("model_input:0")
    seq_len = graph.get_tensor_by_name("seq_lengths:0")
    rnn_keep_prob = graph.get_tensor_by_name("keep_prob:0")
    height_tensor = graph.get_tensor_by_name("input_height:0")
    width_reduction_tensor = graph.get_tensor_by_name("width_reduction:0")
    logits = tf.get_collection("logits")[0]

    # Constants that are saved inside the model itself
    WIDTH_REDUCTION, HEIGHT = sess.run([width_reduction_tensor, height_tensor])

    decoded, _ = tf.nn.ctc_greedy_decoder(logits, seq_len)

    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    image = ctc_utils.resize(image, HEIGHT)
    image = ctc_utils.normalize(image)
    image = np.asarray(image).reshape(1, image.shape[0], image.shape[1], 1)

    seq_lengths = [image.shape[2] / WIDTH_REDUCTION]

    prediction = sess.run(decoded,
                          feed_dict={
                              input_tensor: image,
                              seq_len: seq_lengths,
                              rnn_keep_prob: 1.0,
                          })

    str_predictions = ctc_utils.sparse_tensor_to_strs(prediction)
    
    word = []
    for w in str_predictions[0]:
        word.append(int2word[w])
    
    return word