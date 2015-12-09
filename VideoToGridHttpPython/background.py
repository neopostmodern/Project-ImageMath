import colorsys
import numpy
import cv2
import time
import argparse
import sys

from capture_settings import camera_information
from midi_manger import MidiManager

class Abort:
    def __init__(self):
        self._abort = False

    @property
    def should_abort(self):
        return self._abort

    def abort(self):
        self._abort = True

GLOBAL_ABORT = Abort()


class BackgroundSubtraction:
    def __init__(self, background_images):
        self.shape = background_images[0].shape
        self.shape_bw = (self.shape[0], self.shape[1])
        print("Created BackgroundSubtraction", self.shape, self.shape_bw)
        self._dynamic_factor = 1
        self.set_background_image(background_images)

    def set_background_image(self, images):
        self._background_images = images
        self._mean_background = numpy.vstack(numpy.mean(self._background_images, axis=0)).astype(numpy.uint8)
        self._max_background = numpy.vstack(numpy.max(self._background_images, axis=0)).astype(numpy.uint8)
        self._min_background = numpy.vstack(numpy.min(self._background_images, axis=0)).astype(numpy.uint8)
        self._range_background = self._max_background - self._min_background
        self._background_dynamic = numpy.linalg.norm(self._range_background, axis=1)
        # cv2.imshow('Average reference image', self._mean_background.reshape(self.shape))
        # cv2.imshow('Max reference image', self._max_background.reshape(self.shape))
        # cv2.imshow('Min reference image', self._min_background.reshape(self.shape))
        # cv2.imshow('Reference image: Range', self._range_background.reshape(self.shape))
        # cv2.imshow('Reference image: Dynamic', self._background_dynamic.astype(numpy.uint8).reshape(self.shape_bw))
        self.show_background_summary()

    def change_dynamic(self, dynamic):
        self._dynamic_factor = dynamic
        self.show_background_summary()

    @property
    def _adjusted_background_dynamic(self):
        return self._background_dynamic * self._dynamic_factor

    def show_background_summary(self):
        background_summary = numpy.zeros((self.shape[0] * 2, self.shape[1] * 2, self.shape[2]), dtype=numpy.uint8)

        background_summary[:self.shape[0], :self.shape[1]] = self._min_background.reshape(self.shape)
        cv2.putText(background_summary, "MINIMUM", (10, 20), cv2.FONT_HERSHEY_PLAIN, 1, 255)

        background_summary[:self.shape[0], self.shape[1]:] = self._max_background.reshape(self.shape)
        cv2.putText(background_summary, "MAXIMUM", (self.shape[1] + 10, 20), cv2.FONT_HERSHEY_PLAIN, 1, 255)

        background_summary[self.shape[0]:, :self.shape[1]] = self._mean_background.reshape(self.shape)
        cv2.putText(background_summary, "MEAN", (10, self.shape[0] + 20), cv2.FONT_HERSHEY_PLAIN, 1, 255)

        background_summary[self.shape[0]:, self.shape[1]:, 0] = self._adjusted_background_dynamic.reshape(self.shape_bw)
        cv2.putText(background_summary, "DYNAMIC (%.2f)" % self._dynamic_factor, (self.shape[1] + 10, self.shape[0] + 20), cv2.FONT_HERSHEY_PLAIN, 1, 255)

        cv2.imshow('Reference image summary', background_summary)

    def apply(self, image):
        flat_image = numpy.vstack(image)
        absdiff = cv2.absdiff(flat_image, self._mean_background)
        mask = numpy.sum(numpy.logical_and(self._min_background < flat_image, flat_image < self._max_background), axis=1) >= 2
        # mask = numpy.linalg.norm(flat_image, axis=1) <= self._adjusted_background_dynamic
        # cv2.imshow('AND', mask.reshape((self.shape[1], self.shape[2])).astype(numpy.uint8) * 200)
        # return numpy.linalg.norm(flat_image - self._mean_background, axis=1).astype(numpy.uint8).reshape(self.shape_bw)
        absdiff[mask] = [255, 0, 0]
        return absdiff.reshape(self.shape)
        # return image - self._mean_background


def reset_background():
    print("Resetting background image...", end=" ")
    movement_filter.set_background_image([cap.read()[1] for _ in range(40)])
    print("Done.")


def main():
    print("Human detection grid started...")

    ret, first_frame = cap.read()
    frame_size = (len(first_frame), len(first_frame[0]))

    while True:
        ret, frame = cap.read()

        # frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        moving_objects_image = movement_filter.apply(frame)
        cv2.imshow('Input', frame)
        cv2.imshow('After substraction', moving_objects_image)

        # contour_image = np.zeros((frame_size[0], frame_size[1], 3), dtype='uint8')
        # rainbow_contour_image = np.zeros((frame_size[0], frame_size[1], 3), dtype='uint8')
        # center_image = np.zeros((frame_size[0], frame_size[1], 3), dtype='uint8')
        # overlay = np.zeros((frame_size[0], frame_size[1], 3), dtype='uint8')
        #
        # # two_channel_objects_in_field = cv2.threshold(objects_in_field, 200, 255, cv2.THRESH_BINARY)
        # two_channel_objects_in_field = cv2.threshold(moving_objects_image, 100, 255, cv2.THRESH_BINARY)
        # two_channel_objects_in_field = two_channel_objects_in_field[1]
        # _, raw_contours, hierarchy = cv2.findContours(two_channel_objects_in_field, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        # # , offset=(rectangle_offset, 0)
        #
        # significant_contours = [contour for contour in raw_contours if cv2.contourArea(contour) > 100]
        # contours = [cv2.approxPolyDP(contour, 3, True) for contour in significant_contours]
        #
        # centers = []
        # for contour in contours:
        #     center = np.zeros(2)
        #     for point in contour:
        #         center += point[0]  # weird extra nesting
        #     center /= len(contour)
        #     centers.append(center)
        #
        # contours_for_display = [contour for contour in contours]
        # cv2.fillPoly(contour_image, contours_for_display, (255, 0, 0))
        # for index, contour in enumerate(contours_for_display):
        #     # print(contours_for_display)
        #     # print(contour)
        #     cv2.fillPoly(
        #         rainbow_contour_image,
        #         [np.array(contour)],
        #         tuple(np.array(colorsys.hsv_to_rgb(
        #             index / len(contours_for_display),
        #             1,
        #             1)
        #         ) * 255)
        #     )
        #
        # moving_objects_image = cv2.cvtColor(moving_objects_image, cv2.COLOR_GRAY2RGB)
        #
        # moving_objects_image = cv2.addWeighted(moving_objects_image, 0.6, contour_image, 0.5, 0.1)
        # overlay = cv2.addWeighted(contour_image, 0.8, overlay, 0.8, 1.0)
        # overlay = cv2.addWeighted(center_image, 0.8, overlay, 0.8, 1.0)
        #
        # cv2.imshow('Input (converted to grayscale)', frame)
        # cv2.imshow('Processed', moving_objects_image)
        # cv2.imshow('Analysis', overlay)
        # cv2.imshow('Analysis (areas only)', rainbow_contour_image)

        key = cv2.waitKey(30) & 0xff
        if key == 143 or key == 32:  # camera trigger or space bar
            reset_background()
        elif key == 190:   # F1
            camera_information(cap)
        elif key == 191:   # F2
            print("Trying to set values")
            cap.set(cv2.CAP_PROP_SATURATION, 1.0)
        elif key == 27 or GLOBAL_ABORT.should_abort:
            break
        else:
            if key != 255:
                print(key)

    print("\nShutting down...")
    print("OK.")

    cap.release()
    cv2.destroyAllWindows()
    print("Done and good bye!")
    exit(0)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-v', '--video', action='store', type=int, default=0)
    arguments = parser.parse_args(sys.argv[1:])

    VIDEO_ID = arguments.video

    print("Initializing video...")
    print("Using camera #%d" % VIDEO_ID)
    cap = cv2.VideoCapture(VIDEO_ID)
    camera_information(cap)

    movement_filter = BackgroundSubtraction([cap.read()[1] for _ in range(10)])
    print("Done.")

    print("Initializing MIDI...")
    if not MidiManager.test_midi_support():
        print("No MIDI :(")
    else:
        midi_manager = MidiManager()

        midi_manager.register_handler(
            MidiManager.SLIDER_0,
            lambda value: cap.set(cv2.CAP_PROP_SATURATION, value / 127.0)
        )
        midi_manager.register_handler(
            MidiManager.SLIDER_1,
            lambda value: cap.set(cv2.CAP_PROP_CONTRAST, value / 127.0)
        )
        midi_manager.register_handler(
            MidiManager.SLIDER_2,
            lambda value: cap.set(cv2.CAP_PROP_GAIN, value / 127.0)
        )
        midi_manager.register_handler(
            MidiManager.SLIDER_3,
            lambda value: movement_filter.change_dynamic(value / 127.0 * 10)
        )
        midi_manager.register_handler(
            MidiManager.REPEAT_BUTTON,
            MidiManager.lambda_midi_positive(reset_background)
        )
        midi_manager.register_handler(
            MidiManager.STOP_BUTTON,
            MidiManager.lambda_midi_positive(GLOBAL_ABORT.abort)
        )
        print("Done.")

    main()

    while True:
        try:
            time.sleep(1)
        except KeyboardInterrupt:
            break
