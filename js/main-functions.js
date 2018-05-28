var app = app || {};

app.cubes = [];

app.osc = {
  // DEBUG: true,
  // DATA: true,
  data: {},
  setData: function(path, args, force=false){
    if(this.DEBUG || force){
      console.log(path, args);
      this.data && console.log(this.data);
    }
    if(this.DATA){
      this.data[path] = args;
    }
  },

  '/bass': function( args ){
    console.log('make a cube!');
  },

  '/log': function( args ){
    this.setData( '/log', args );
    app.controller.debug = args.length > 1 ? args.join(', ') : args[0];
  },

};


const o = (path, ind=0) => {
  if(!app.osc.data || typeof app.osc.data[path] === 'undefined') {
    return 0;
  }
  return app.osc.data[path][ind];
};


app.randRange = function(min, max){
  const range = max - min;
  return min + (Math.random() * range);
}

app.randomCube = function( range=100, opts={} ){
  console.log('randomCube');
  const cube = app.createCube(
    app.randRange(-range, range),
    app.randRange(-range, range),
    app.randRange(-range, range),
    app.randRange(4, 20), // random size
    opts
  );
  app.cubes.push( cube );
  app.scene.add( cube );
  console.log(cube);
};

app.createCube = function(x, y, z, size=4, opts={}){

  const cubeGeometry = new THREE.BoxGeometry(
    (opts && opts.x) || size,
    (opts && opts.y) || size,
    (opts && opts.z) || size,
  );
  const cubeMaterial = new THREE.MeshLambertMaterial({
    // color: 0xFF8F00,
    // map: THREE.ImageUtils.loadTexture("img/s.png"),
    wireframe: false,
    transparent: true,
    opacity: 0.5
  });

  const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
  cube.position.set( x, y, z );
  cube.material.color.setHSL(Math.random(), 1.0, 0.5 );

  return cube;
};

app.createSphere = function(){
  const sphereGeometry = new THREE.SphereGeometry( 30, 40, 40);
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF,
    wireframe: false,
    side: THREE.DoubleSide,
    map: THREE.ImageUtils.loadTexture("img/earth.jpg")
  });

  const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
  sphere.position.set(0, 0, 0);
  // sphere.castShadow =  true;

  return sphere;
};


app.createSpotlight = function(){
  const spotlight = new THREE.SpotLight( 0xFFFFFF );
  spotlight.position.set( -10, 60, 10 );
  return spotlight;
};


app.animate = function(){

  app.stats.update();

  app.animateCubes();

  if(app.controller.doCameraRot && app.controller.cameraRot > 0){
    app.animateCamera();
  }

  app.renderer.render( app.scene, app.camera );
  requestAnimationFrame( app.animate );
};

app.animateCamera = function(){
   // https://github.com/josdirksen/threejs-cookbook/blob/master/03-camera/03.08-rotate-camera-around-scene-y-axis.html
   var x = app.camera.position.x;
   var z = app.camera.position.z;
   app.camera.position.x = x * Math.cos(app.controller.cameraRot) + z * Math.sin(app.controller.cameraRot);
   app.camera.position.z = z * Math.cos(app.controller.cameraRot) - x * Math.sin(app.controller.cameraRot);
   app.camera.lookAt(app.scene.position);
};

app.animateCubes = function(){
};

app.keypress = function(ev){
  console.log('keyCode', ev.keyCode);
  switch( ev.keyCode ){
    case 32: // space
      break;
    case 13: // enter
      break;
    case 112:  // 'p': pause animation (prevent overheating)
      app.controller.paused = !app.controller.paused;
      app.controller.paused || app.animate();
      break;
    case 114:  // 'r': toggle camera auto-rotation
      app.controller.doCameraRot = !app.controller.doCameraRot;
      break;
    case 115:
      app.oscPort.send({
          address: "/controls",
          args: [
            {type: "s", value: 'play'},
            {type: "i", value: 1},
          ]
        });
    break;
  }
}

app.resize = function(){
  app.width = window.innerWidth;
  app.height = window.innerHeight;

  app.camera.aspect = app.width / app.height;
  app.camera.updateProjectionMatrix();

  app.renderer.setSize(app.width, app.height);
}

app.addStats = function(){
  const stats = new Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.getElementById('stats').appendChild(stats.domElement);

  return stats;
};
