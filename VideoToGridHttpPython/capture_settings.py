#!/usr/bin/env python3
#-*- coding: utf-8 -*-

import contextlib
import os

import sys

import cv2


@contextlib.contextmanager
def stdchannel_redirected(stdchannel, dest_filename):
    """
    A context manager to temporarily redirect stdout or stderr

    e.g.:


    with stdchannel_redirected(sys.stderr, os.devnull):
        if compiler.has_function('clock_gettime', libraries=['rt']):
            libraries.append('rt')
    """

    try:
        oldstdchannel = os.dup(stdchannel.fileno())
        dest_file = open(dest_filename, 'w')
        os.dup2(dest_file.fileno(), stdchannel.fileno())

        yield
    finally:
        if oldstdchannel is not None:
            os.dup2(oldstdchannel, stdchannel.fileno())
        if dest_file is not None:
            dest_file.close()


def camera_information(capture):
    properties = {
        "Aperture": cv2.CAP_PROP_APERTURE,
        "Saturation": cv2.CAP_PROP_SATURATION,
        "Hue": cv2.CAP_PROP_HUE,
        "Gain": cv2.CAP_PROP_GAIN,
        "Contrast": cv2.CAP_PROP_CONTRAST,
        "Exposure": cv2.CAP_PROP_EXPOSURE,
        "White Balance (U)": cv2.CAP_PROP_WHITE_BALANCE_BLUE_U,
        "White Balance (V)": cv2.CAP_PROP_WHITE_BALANCE_RED_V,
        "ISO": cv2.CAP_PROP_ISO_SPEED
    }

    values = {}

    with stdchannel_redirected(sys.stderr, os.devnull):
        for name, selector in properties.items():
            value = capture.get(selector)
            if value != -1:
                values[name] = value

    print(values)


# print("┌ Aperture",   capture.get(cv2.CAP_PROP_APERTURE))
# print("│ Saturation", capture.get(cv2.CAP_PROP_SATURATION))
# print("│ Hue",        capture.get(cv2.CAP_PROP_HUE))
# print("│ Gain",       capture.get(cv2.CAP_PROP_GAIN))
# print("│ Contrast",   capture.get(cv2.CAP_PROP_CONTRAST))
# print("│ Exposure",   capture.get(cv2.CAP_PROP_EXPOSURE))
# print("│ White Balance (U/V)", capture.get(cv2.CAP_PROP_WHITE_BALANCE_BLUE_U),
#                                capture.get(cv2.CAP_PROP_WHITE_BALANCE_RED_V))
# print("└ ISO",        capture.get(cv2.CAP_PROP_ISO_SPEED))
