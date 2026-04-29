import GUI from "lil-gui";
import vsSource from "./shaders/vertex.glsl?raw";
import fsSource from "./shaders/fragment.glsl?raw";

// 1. 상태 관리 객체
const settings = {
  posX: 0,
  posY: 0,
  is3D: false,
};

// 셰이더 컴파일 유틸리티
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

async function main() {
  const canvas = document.querySelector("#webgl-canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) return;

  // 2. GUI 설정
  const gui = new GUI();
  gui.add(settings, "posX", -1, 1).name("X 이동");
  gui.add(settings, "posY", -1, 1).name("Y 이동");
  gui.add(settings, "is3D").name("3D 모드 전환");

  // 3. 프로그램 준비
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = createProgram(gl, vertexShader, fragmentShader);

  // 4. 데이터 세팅 (x, y, z, r, g, b)
  const vertices = new Float32Array([
    // 좌표(x,y,z)      색상(r,g,b)
    0.0,
    0.5,
    0.0,
    1.0,
    0.0,
    0.0, // 위 (빨강)
    -0.5,
    -0.5,
    0.5,
    0.0,
    1.0,
    0.0, // 왼쪽 아래 (초록, Z 뒤로)
    0.5,
    -0.5,
    -0.5,
    0.0,
    0.0,
    1.0, // 오른쪽 아래 (파랑, Z 앞으로)
  ]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const stride = 6 * Float32Array.BYTES_PER_ELEMENT;

  // 위치 속성 (3개: x, y, z)
  const posLoc = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, stride, 0);

  // 색상 속성 (3개: r, g, b)
  const colorLoc = gl.getAttribLocation(program, "aColor");
  gl.enableVertexAttribArray(colorLoc);
  gl.vertexAttribPointer(
    colorLoc,
    3,
    gl.FLOAT,
    false,
    stride,
    3 * Float32Array.BYTES_PER_ELEMENT,
  );

  // Uniform 위치 저장
  const offsetLoc = gl.getUniformLocation(program, "uOffset");
  const is3DLoc = gl.getUniformLocation(program, "uIs3D");

  function render() {
    // 캔버스 리사이즈 대응
    if (
      canvas.width !== window.innerWidth ||
      canvas.height !== window.innerHeight
    ) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    // 화면 지우기
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 3D 설정 적용
    if (settings.is3D) {
      gl.enable(gl.DEPTH_TEST);
    } else {
      gl.disable(gl.DEPTH_TEST);
    }

    gl.useProgram(program);
    gl.bindVertexArray(vao);

    // 실시간 값 전송
    gl.uniform2f(offsetLoc, settings.posX, settings.posY);
    gl.uniform1i(is3DLoc, settings.is3D ? 1 : 0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(render);
  }

  render();
}

main();
