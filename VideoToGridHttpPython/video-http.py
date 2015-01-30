import functools
import numpy as np
import cv2
import time
import httplib2
import argparse
import sys

def server_call(method, parameters):
    def callback(error, response):
        print(" > ")
        if error:
            print("Error: ", error)
        else:
            print(response)

    parameters.insert(0, method)
    url = "http://localhost:4000/%s/%d/%d/%d" % tuple(parameters)
    print(url)
    (result, response) = http.request(url, method="POST")
    if result.status != 200:
        print("Failed.")
        print(result)

def activate_position(room, x, y):
    print("Activating [%d] %d/%d..." % (room, x, y)) #, end='')
    server_call('activate', [room, x, y])

def deactivate_position(room, x, y):
    print("Deactivating [%d] %d/%d..." % (room, x, y)) #, end='')
    server_call('deactivate', [room, x, y])

def main():
    print("Connection to server successful.")
    print("Human detection grid started...")
    last_positions = np.zeros((10, 10))


    ret, first_frame = cap.read()
    frame_size = (len(first_frame), len(first_frame[0]))
    rectangle_offset = (frame_size[1] - frame_size[0]) // 2
    target_size = frame_size[0]
    square_size = target_size // SIZE

    while(1):
        ret, frame = cap.read()

        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        moving_objects_image = movement_filter.apply(frame)

        objects_in_field = moving_objects_image[:, rectangle_offset:rectangle_offset+target_size]

        contour_image = np.zeros((frame_size[0], frame_size[1], 3), dtype='uint8')
        center_image = np.zeros((frame_size[0], frame_size[1], 3), dtype='uint8')
        overlay = np.zeros((frame_size[0], frame_size[1], 3), dtype='uint8')

        two_channel_objects_in_field = cv2.threshold(objects_in_field, 200, 255, cv2.THRESH_BINARY)
        two_channel_objects_in_field = two_channel_objects_in_field[1]
        _, raw_contours, hierarchy = cv2.findContours(two_channel_objects_in_field, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        # , offset=(rectangle_offset, 0)

        significant_contours = [contour for contour in raw_contours if cv2.contourArea(contour) > 100]
        contours = [cv2.approxPolyDP(contour, 3, True) for contour in significant_contours]

        centers = []
        for contour in contours:
            center = np.zeros(2)
            for point in contour:
                center += point[0]  # weird extra nesting
            center /= len(contour)
            centers.append(center)

        # re-ordering x vs. y here:
        new_position_indices = ([(int(center[1] / square_size), int(center[0] / square_size)) for center in centers])
        new_positions = np.zeros((SIZE, SIZE), dtype='int')
        for new_position_index in new_position_indices:
            new_positions[new_position_index] = True

        for center in centers:
            center_for_display = (int(center[0]) + rectangle_offset, int(center[1]))
            cv2.circle(center_image, center_for_display, 10, (0, 255, 255), thickness=-1)

        contours_for_display = [contour + [[rectangle_offset, 0]] for contour in contours]
        cv2.fillPoly(contour_image, contours_for_display, (255, 0, 0))

        for x in range(SIZE):
            for y in range(SIZE):
                if last_positions[x][y] and not new_positions[x][y]:
                    deactivate_position(ROOM, x, y)
                elif not last_positions[x][y] and new_positions[x][y]:
                    activate_position(ROOM, x, y)

                if new_positions[x][y]:
                    cv2.rectangle(
                        overlay,  # frame
                        (rectangle_offset + y * square_size, x * square_size),  # start coordinates
                        (rectangle_offset + (y + 1) * square_size, (x + 1) * square_size),  # end coordinates
                        (0, 0, 255),  # color
                        -1  # line width: fill
                    )

                # cv2.recoverPose(moving_objects_image, ()

        last_positions = new_positions

        # moving_objects_image = cv2.resize(moving_objects_image, (1000, 1000), -1)
        moving_objects_image = cv2.cvtColor(moving_objects_image, cv2.COLOR_GRAY2RGB)
        # print(moving_objects_image[0, 0])

        cv2.rectangle(
            overlay,  # frame
            (rectangle_offset, 0),  # start coordinates
            (frame_size[0] + rectangle_offset, frame_size[0]),  # end coordinates
            (0, 255, 0),  # color
            5  # line width
        )
        #  = cv2.add(moving_objects_image, overlay)
        moving_objects_image = cv2.addWeighted(moving_objects_image, 0.6, contour_image, 0.5, 0.1)
        overlay = cv2.addWeighted(contour_image, 0.8, overlay, 0.8, 1.0)
        overlay = cv2.addWeighted(center_image, 0.8, overlay, 0.8, 1.0)

        cv2.imshow('Input (converted to grayscale)', frame)
        cv2.imshow('Processed', moving_objects_image)
        cv2.imshow('Analysis', overlay)

        k = cv2.waitKey(30) & 0xff
        if k == 27:
            break

    print("\nShutting down...")
    print("Deactivating all cells...")
    for x in range(SIZE):
        for y in range(SIZE):
            deactivate_position(ROOM, x, y)
    print("OK.")

    cap.release()
    cv2.destroyAllWindows()
    print("Done and good bye!")
    exit(0)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-v', '--video', action='store', type=int, default=0)
    parser.add_argument('-r', '--room', action='store', type=int, default=0)
    parser.add_argument('-s', '--size', action='store', type=int, default=10)
    arguments = parser.parse_args(sys.argv[1:])

    VIDEO_ID = arguments.video
    ROOM = arguments.room
    SIZE = arguments.size

    print("Initializing video...")
    print("Using camera #%d" % VIDEO_ID)
    cap = cv2.VideoCapture(VIDEO_ID)
    movement_filter = cv2.createBackgroundSubtractorKNN()
    print("Done.")

    http = httplib2.Http()
    main()

    while True:
        try:
            time.sleep(1)
        except KeyboardInterrupt:
            break