var app = app || {};

app.controller = {
  doCameraRot: true,
  paused: false,
  cameraRot: 0.005,
  scale: 1.0,
  bpm: 60,
};

app.init = function(){

  app.gui = new dat.GUI();
  app.gui.add( app.controller, 'cameraRot', 0, 0.1 );
  app.gui.add( app.controller, 'scale', 0, 2 );
  app.gui.add( app.controller, 'bpm', 30, 160).onChange( val => {
    app.oscPort.send({
        address: "/controls",
        args: [
          {type: "s", value: 'bpm' },
          {type: "i", value: val   },
        ]
      });
  });

  app.scene = new THREE.Scene();

  app.width = window.innerWidth;
  app.height = window.innerHeight;
  app.camera = new THREE.PerspectiveCamera(60, app.width/app.height, 0.1, 3000);

  app.camera.position.x = -230;
  app.camera.position.y = 310;
  app.camera.position.z = 400;
  app.camera.lookAt( app.scene.position );

  app.renderer = new THREE.WebGLRenderer();
  app.renderer.setSize( app.width, app.height );
  // app.renderer.setClearColor( 0x000000 ); // background colour

  app.controls = new THREE.OrbitControls( app.camera, app.renderer.domElement );
  document.getElementById('output').appendChild( app.renderer.domElement );

  // app.axes = new THREE.AxesHelper( 40 );
  // app.scene.add( app.axes );

  // app.spotlight = app.createSpotlight();
  // app.scene.add( app.spotlight );

  // app.sphere = app.createSphere();
  // app.scene.add( app.sphere );

  app.ambient = new THREE.AmbientLight( 0xFFFFFF );
  app.scene.add( app.ambient );

  app.stats = app.addStats();
  app.animate();
};

window.onload = app.init;
window.addEventListener('resize', app.resize);
window.addEventListener('keypress', app.keypress);
