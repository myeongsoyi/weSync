import cv2
import os
import numpy as np
from PIL import Image

def threshold(img):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    ret, img = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)
    return img

def dnImg(img, path):
    img1 = threshold(img)
    masked_img, mask = staff_devide(img1)

    masked_img = erase_data(masked_img)

    cnt, labels, stats, centroids = cv2.connectedComponentsWithStats(mask)

    for i in range(1, cnt):
        x, y, w, h, area = stats[i]
        if w > img1.shape[1] * 0.5:
            barline_removed_img = barline_removal(masked_img[y-5:y+h+5, x-5:x+w+5])
            Image.fromarray(barline_removed_img).save(f"{path}/{len(os.listdir(path))}.png")

def erase_data(img):
    wordMask = np.zeros(img.shape, np.uint8)

    cnt, labels, stats, centroids = cv2.connectedComponentsWithStats(img)

    for i in range(1, cnt):
        x, y, w, h, area = stats[i]
        if w < img.shape[1] * 0.5:
            cv2.rectangle(wordMask, (x, y, w, h), (255, 0, 0), -1)

    masked_img = cv2.bitwise_xor(img,cv2.bitwise_and(wordMask, img))

    return masked_img

def staff_devide(img1):
    mask = np.zeros(img1.shape, np.uint8)

    cnt, labels, stats, centroids = cv2.connectedComponentsWithStats(img1)

    for i in range(1, cnt):
        x, y, w, h, area = stats[i]
        if w > img1.shape[1] * 0.5:
            cv2.rectangle(mask, (x, y, w, h), (255, 0, 0), -1)

    masked_img = cv2.bitwise_and(img1, mask)

    return masked_img, mask

def barline_removal(img):
    height, width = img.shape
    histogram = np.zeros(img.shape, np.uint8)

    for col in range(width):
        pixels = 0
        for row in range(height):
            pixels += (img[row][col] == 255)
        # for pixel in range(pixels):
        #     histogram[pixel][col] = 255
        if pixels >= height * 0.5:
            for row in range(height):
                img[row][col] = 0
    
    return img

def split_part(img, path, n):
    img1 = threshold(img)
    mask = np.zeros(img1.shape, np.uint8)

    cnt, labels, stats, centroids = cv2.connectedComponentsWithStats(img1)

    for i in range(1, cnt):
        x, y, w, h, area = stats[i]
        if w <= img1.shape[1] * 0.5:
            cv2.rectangle(mask, (x, y, w, h), (255, 0, 0), 10)

    cnt, labels, stats, centroids = cv2.connectedComponentsWithStats(mask)

    for i in range(1, cnt):
        x, y, w, h, area = stats[i]
        if w > img1.shape[1] * 0.5:
            if not os.path.exists(f"{path}/{i-1}"):
                os.mkdir(f"{path}/{i-1}")
            Image.fromarray(255 - img[y:y+h, x:x+w]).save(f"{path}/{i-1}/{n}.png")
