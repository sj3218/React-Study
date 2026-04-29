#version 300 es
in vec4 aPosition;
in vec4 aColor;

uniform vec2 uOffset;
uniform bool uIs3D;

out vec4 vColor;

void main() {
    if (uIs3D) {
        // 3D 모드: Z축 값을 활용 (깊이감 부여)
        gl_Position = vec4(aPosition.xy + uOffset, aPosition.z, 1.0);
    } else {
        // 2D 모드: Z축 무시
        gl_Position = vec4(aPosition.xy + uOffset, 0.0, 1.0);
    }
    vColor = aColor;
}