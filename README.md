# N-body-simulation-JS
Simple N-Body simulation of point particles of our solar system from example code taken from wikipedia. https://en.wikipedia.org/wiki/N-body_simulation

I was bored at class and decided to write this extremely basic simulator in Vanilla JavaScript + Canvas, as I thought It should not take that much time to implement (and I was right ;) ).
It is possible that in the next few weeks I might add more features, as well as some optimizations, since I plan to add this to my Universe simulator.

As a note, the variable "time factor" is... well, it kinda functions right, but might give you imprecise results because of how the physics are implemented. Basically, the final velocity of the body of each step is multiplied by the time factor, so higher time factor, crazier orbits, so that's why if you add more 0s to "time factor", particles will just simply "run away from center".
It is possible to fix this by repeating the process again with a lesser time factor again (at the cost of performance), but honestly, I think it's good so far. I might change of opinion later on.

## Changelog

### Version 0.3
 - Added -+X, -+Y, -+Z axes when displaying grid.
 - Added canvas coordinate translation.
 - Added ability to apply (naive) frustrum culling.
 - Added show particle info when hovering particle.
 - Added sandbox tab, where you can add / move particles and display a list of particles where you can select and "goto" particle.
 - Added follow particle.
 - Added ability to draw particles with a fancy flare image. :)
 - Added presets, so you can specify (as well as reset) a certain inital particle setting.
 - Minor fixes.

### Version 0.2
 - Added grid.
 - Added move camera by mouse drag.
 - Added scroll with mouse wheel.
 - Added settings tab where you can change the value of certain attributes of the simulator.
 - Added coloured orbits.
 - Changed interface.

### Version 0.1
 - First version.

### Far-Far-future updates. (TODO)
 - Fix time factor being imprecise.
 - Add collisions.
 - Speed of gravity.
 - Improve UI / UX.
 - Implement Barnes Hut tree as optimization.
 - Clean code, or use more elegant approach.
 - Add right click particle to select, goto, follow particle.
 - Implement data binding for particle list in sandbox tab.
 - Add multiple grid levels.
 - Add ability to create your own presets.
