import * as THREE from 'three';

const vShader = `
void main() {
    gl_Position = vec4( position, 1.0 );
}
`

const fShader = `
uniform vec2 u_resolution;
uniform float u_time;

float plot(vec2 st, float pct){
    // float y = smoothstep(0.2,0.5,st.x) - smoothstep(0.5,0.8,st.x);
    return  smoothstep( pct-0.01, pct, st.y) -
            smoothstep( pct, pct+0.01, st.y);
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;

    float y = smoothstep(0.2,0.5,st.x) - smoothstep(0.5,0.8,st.x);

    vec3 color = vec3(y);

    float pct = plot(st,y);
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);

    gl_FragColor = vec4(color,1.0);
}
`



var container;
var camera, scene, renderer;
var uniforms;

init();
animate();

function init() {

    camera = new THREE.Camera();
    camera.position.z = 1;

    scene = new THREE.Scene();

    var geometry = new THREE.PlaneBufferGeometry( 2, 2 );

    uniforms = {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new THREE.Vector2() },
        u_mouse: { type: "v2", value: new THREE.Vector2() }
    };

    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: vShader,
        fragmentShader: fShader
    } );

    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );

    document.body.appendChild( renderer.domElement );

    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );

    document.onmousemove = function(e){
      uniforms.u_mouse.value.x = e.pageX
      uniforms.u_mouse.value.y = e.pageY
    }
}

function onWindowResize( event ) {
    renderer.setSize( window.innerWidth, window.innerHeight );
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    uniforms.u_time.value += 0.05;
    renderer.render( scene, camera );
}