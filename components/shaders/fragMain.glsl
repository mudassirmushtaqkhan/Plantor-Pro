 
float opacity = mix(0.5,0.0 , normalize(varPosition).z ) - 0.5;

// vec3 skinColor = vec3(0.988, 0.792, 0.643);
vec4 diffuseColor = vec4(0.71, 0.4, 0.19 ,opacity);
