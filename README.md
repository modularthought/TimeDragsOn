Time Drags On
=============

xkcd#1190: Time viewer; featuring panorama and drag mode.

Features:
* dragging by mouse
* navigation by <kbd>arrow</kbd> keys; <kbd>shift</kbd> + <kbd>arrow</kbd> skips
* forward auto play
* pause/play with <kbd>space bar</kbd>
* <kbd>ctrl</kbd> + <kbd>arrow</kbd> left or right advances frames
* re-center on current frame with <kbd>ctrl</kbd>+<kbd>z</kbd>
* hide/show GUI with <kbd>`</kbd> \[back-tick\] key
* panorama mode
* frames visible only within "the frame"

This is best viewed in as large of a viewing area (i.e. full screen) as possible. Currently featuring panorama 2552 (frames 2552-2610). It is limited to this only, so far, but will be expanded throughout time to feature other panoramas. Playback of all frames (except the secondary frames) is now supported. A GUI is being added, as well as other extras. Works in Firefox. Not tested in Chrome or mobile (touch) yet.

* * *

Version 0.2.1
-------------

* frame selection controls now more stable
* panorama switch now more stable
* refocus frame automatically between panoramas

Version 0.2.0
-------------

* all frames now available
* switches between panorama mode and "normal" automatically
* display shows frame numbers
* selection menu activated
* selection menu behind words
* title text added appropriately

Version 0.1.4
-------------

* re-center on current frame with <kbd>ctrl</kbd>+<kbd>z</kbd>
* hide/show GUI with <kbd>`</kbd> \[back-tick\] key

Version 0.1.3
-------------

* restructuring of code to comply with [MVC][] begun
* pause/play implemented with <kbd>space bar</kbd>
* images cache before playback

[MVC]:http://en.wikipedia.org/wiki/Model-view-controller "Model-View-Controller"

Version 0.1.2
-------------

* added web fonts

Version 0.1.1
-------------

* added location protocol awareness


## Version 0.1.0

This is a useable version, featuring panorama 2552 (frames 2552-2610). JSON is used to import the frames.