- create splitView
- create api that adds/moves buildings randomly and updates the elevation
- add the site to the 3d viewer
- log the surrounding polygon
- shader for site boundary 
- fetch all surrounding buildings

PIPELINE:
- define a polyon/site limit
- open up the threejs float
- promt gpt to create something for u
- ?? select a subset and spesify that these are the interested part
- import it into the 3d viewer
- remove poygon/glbs with button 
- OR  
    - add more stuff into spacemaker
    - open float again
    - and continue to work on the site (this will work since one cannot alter the glb inside spacemaker)

QUESTIONS:
- monorepo for different apps? or just different repos?
    - or just a next app if jarle is willing to write in node....
- should we build a chat UI also? or just 1 prompt?

IDEA: 
- billing information in a db?
- generate multiple proposals like magic wand. choose to continue with one of them
- sun analyssis from [threejs hemisphere](https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_sky.html) as a preview proxy
- upload regulation image. vectorize image to geojson footprints. make chatgpt create the buildings ontop of the geojson
- use selection to ask the user to do it only with the spesified house. This requires the types to have an id [aswell](aswell)
- could maybe also read the actual houses and inside the site and modify them
