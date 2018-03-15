uniform mat4 u_MvpMatrix;
uniform int u_PickedFace;

attribute vec3 a_Position;
attribute vec3 a_Color;
attribute float a_Face;

varying vec4 v_Color;

void main() {
  gl_Position = u_MvpMatrix * vec4(a_Position, 1.0);
  int face = int(a_Face); // integer index of face
  vec3 color = face == u_PickedFace ? vec3(1.0) : a_Color; // face is white if selected
  // 0 is a sentinel value for u_PickedFace. When it occurs, we encode the current face index
  // into the alpha channel so that the control program can read find which face was clicked.
  v_Color = vec4(
    color,
    u_PickedFace == 0 ? a_Face / 255.0 : 1.0
  );
}
