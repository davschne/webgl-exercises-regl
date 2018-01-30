#ifdef GL_ES
precision mediump float;
#endif

uniform vec3 u_LightColor;
uniform vec3 u_LightPosition; // in world coordinates
uniform vec3 u_AmbientLight; // ambient light color

varying vec3 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;

void main() {
  // Normalize the normal, because it's interpolated and therefore not necessarily of length 1.
  vec3 normal = normalize(v_Normal);
  // Calculate light direction (normalized).
  vec3 lightDirection = normalize(u_LightPosition - v_Position);
  // The dot product of the light direction and the normal (= cos theta)
  float nDotL = max(dot(lightDirection, normal), 0.0);
  // color due to diffuse lighting
  vec3 diffuse = u_LightColor * v_Color * nDotL;
  // color due to ambient lighting
  vec3 ambient = u_AmbientLight * v_Color;
  // fragment color is the sum of colors due to diffuse and ambient lighting
  gl_FragColor = vec4(diffuse + ambient, 1.0);
}
