attribute vec3 a_Position;
attribute vec3 a_Color; // surface base color
attribute vec3 a_Normal; // surface orientation

uniform mat4 u_MvpMatrix;
uniform vec3 u_LightColor;
uniform vec3 u_LightDirection; // in world coordinates, normalized
uniform vec3 u_AmbientLight;

varying vec3 v_Color;

void main() {
  gl_Position = u_MvpMatrix * vec4(a_Position, 1.0);
  vec3 normal = normalize(a_Normal);
  // The dot product of the light direction and the normal (= cos theta)
  float nDotL = max(dot(u_LightDirection, normal), 0.0);
  // color due to diffuse lighting
  vec3 diffuse = u_LightColor * a_Color * nDotL;
  // color due to ambient lighting
  vec3 ambient = u_AmbientLight * a_Color;
  // vertex color is the sum of colors due to diffuse and ambient lighting
  v_Color = diffuse + ambient;
}
