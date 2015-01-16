import numpy as np
import cv2

SIZE = 10

cap = cv2.VideoCapture(0)

fgbg = cv2.createBackgroundSubtractorKNN()

last_positions = np.zeros((10, 10))

while(1):
    ret, frame = cap.read()

    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    fgmask = fgbg.apply(frame)

    # fgmask = cv2.fastNlMeansDenoising(fgmask)
    #


    # imgray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # ret, thresh = cv2.threshold(imgray, 127, 255, cv2.THRESH_BINARY)
    #
    # _, contours, hierarchy = cv2.findContours(fgmask, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
    # print(contours)
    # print(hierarchy)
    # print(_)
    # cv2.drawContours(frame, contours, -1, (0, 255, 0), -10)

    fgmask = cv2.resize(fgmask, (SIZE, SIZE), cv2.INTER_AREA)
    new_positions = fgmask > 200

    for i in range(SIZE):
        for j in range(SIZE):
            if last_positions[i][j] and not new_positions[i][j]:
                print("%d / %d turned off." % (i, j))
            elif not last_positions[i][j] and new_positions[i][j]:
                print("%d / %d turned on." % (i, j))

    last_positions = new_positions


    #print(fgmask)
    fgmask = cv2.resize(fgmask, (1000, 1000), -1)
    cv2.imshow('frame', fgmask)

    k = cv2.waitKey(30) & 0xff
    if k == 27:
        break

cap.release()
cv2.destroyAllWindows()