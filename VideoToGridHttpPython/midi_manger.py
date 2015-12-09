import rtmidi
from rtmidi.midiutil import open_midiport

__author__ = 'mrssheep'

class MidiManager():
    PLAY_BUTTON = 45
    STOP_BUTTON = 46
    REPEAT_BUTTON = 49

    SLIDER_0 = 2  # left most
    SLIDER_1 = 3
    SLIDER_2 = 4
    SLIDER_3 = 5

    def __init__(self, ):
        self.input = rtmidi.MidiIn().open_port(1)
        self.input.set_callback(self.signal_manager)
        self.callbacks = {}

    def signal_manager(self, parameters, temp):
        (_, key, value), velocity = parameters
        # print("Hit %d with %d" % (key, value))
        if key in self.callbacks:
            self.callbacks[key](value)

    def register_handler(self, key, function):
        self.callbacks[key] = function

    @staticmethod
    def test_midi_support():
        midi_in = rtmidi.MidiIn()
        return len(midi_in.get_ports()) > 1

    @staticmethod
    def lambda_midi_positive(function):
        def lambda_positive(value):
            if value == 127:
                function()
        return lambda_positive