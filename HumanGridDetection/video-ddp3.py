import numpy as np
import cv2
import time
from lib import Meteor

SIZE = 10
VIDEO_ID = 0

def meteor_call(method, parameters):
    def callback(error, response):
        print(" > ")
        if error:
            print("Error: ", error)
        else:
            print(response)

    client.call(method, parameters, callback)

def activate_position(room, x, y):
    print("Activating [%d] %d/%d..." % (room, x, y)) #, end='')
    meteor_call('activate-position', [room, x, y])

def deactivate_position(room, x, y):
    print("Activating [%d] %d/%d..." % (room, x, y)) #, end='')
    meteor_call('deactivate-position', [room, x, y])

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

        scaled_grid = cv2.resize(moving_objects_image, (SIZE, SIZE), cv2.INTER_AREA)
        new_positions = scaled_grid > 200

        overlay = np.zeros((frame_size[0], frame_size[1], 3), dtype='uint8')

        for x in range(SIZE):
            for y in range(SIZE):
                if last_positions[x][y] and not new_positions[x][y]:
                    deactivate_position(1, x, y)
                elif not last_positions[x][y] and new_positions[x][y]:
                    activate_position(1, x, y)

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
        print(moving_objects_image[0, 0])


        # cv2.rectangle(
        #     moving_objects_image,  # frame
        #     (rectangle_offset, 0),  # start coordinates
        #     (frame_size[0] + rectangle_offset, frame_size[0]),  # end coordinates
        #     (255, 0, 0, 0.5),  # color
        #     5  # line width
        # )


        cv2.rectangle(
            overlay,  # frame
            (rectangle_offset, 0),  # start coordinates
            (frame_size[0] + rectangle_offset, frame_size[0]),  # end coordinates
            (0, 255, 0),  # color
            5  # line width
        )
        #  = cv2.add(moving_objects_image, overlay)
        moving_objects_image = cv2.addWeighted(moving_objects_image, 0.8, overlay, 0.8, 1.0)

        cv2.imshow('frame', moving_objects_image)

        k = cv2.waitKey(30) & 0xff
        if k == 27:
            break

    print("\nShutting down...")
    client.close()
    cap.release()
    cv2.destroyAllWindows()
    print("Done and good bye!")
    exit(0)

if __name__ == '__main__':
    print("Initializing video...")
    print("Using camera #%d" % VIDEO_ID)
    cap = cv2.VideoCapture(VIDEO_ID)
    movement_filter = cv2.createBackgroundSubtractorKNN()
    print("Done.")

    print("Connecting to signal distribution server...")
    client = Meteor.DDPClient('ws://127.0.0.1:3000/websocket')
    client.on('connected', main)
    client.connect()
    print("Done.")

    while True:
        try:
            time.sleep(1)
        except KeyboardInterrupt:
            break
