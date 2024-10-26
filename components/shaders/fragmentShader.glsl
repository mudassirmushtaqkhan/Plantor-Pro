varying vec2 vUv;
varying vec3 vPosition;

void main(){
  vec3 startColor = vec3(1.0, 1.0, 0.0);
  
  float opacity = smoothstep(0.0,1.0 , normalize(vPosition).y );
  gl_FragColor = vec4(0.3, 0.2,0.1 ,opacity);
}
