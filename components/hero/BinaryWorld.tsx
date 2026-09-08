'use client';
import { useEffect, useRef, type MutableRefObject } from 'react';

const vertex = `
precision highp float;
attribute vec3 aSeed;
uniform vec2 uSize,uPointer;
uniform float uTime,uMorph,uYaw,uPitch,uEnergy,uVelocity,uDpr,uIntro,uArrivalTime,uLive;
varying float vAlpha,vDigit;
void main(){
 float a=aSeed.x,b=aSeed.y;
 float lobes=cos(a*7.+uTime*.06);
 float ring=.74+.045*lobes*uMorph;
 float tube=.265+.025*sin(a*3.+uTime*.14);
 vec3 torus=vec3((ring+tube*cos(b))*cos(a),(ring+tube*cos(b))*sin(a),tube*sin(b));
 float sy=cos(b*.5);float sr=sqrt(max(0.,1.-sy*sy));
 vec3 sphere=vec3(cos(a)*sr,sy,sin(a)*sr)*.91;
 float sphereMix=smoothstep(.54,1.,uMorph);
 vec3 p=mix(torus,sphere,sphereMix);
 // Surface normals make the silhouette and front surface legible in grayscale.
 vec3 normal=normalize(mix(vec3(cos(b)*cos(a),cos(b)*sin(a),sin(b)),normalize(sphere),sphereMix));
 float bloom=1.-smoothstep(0.,.48,uMorph);
 p.xy*=1.+bloom*.13*cos(a*7.);
 p.z+=bloom*.14*sin(a*7.);
 p*=1.+uEnergy*.24+sin(uTime*.42)*.009;
 // Bounded idle rotation: never let the world turn edge-on and disappear.
 float yaw=uYaw+sin(uTime*.22)*.18;
 float pitch=uPitch+sin(uTime*.19)*.045;
 mat2 rotY=mat2(cos(yaw),-sin(yaw),sin(yaw),cos(yaw));
 mat2 rotX=mat2(cos(pitch),-sin(pitch),sin(pitch),cos(pitch));
 p.xz=rotY*p.xz;p.yz=rotX*p.yz;
 normal.xz=rotY*normal.xz;normal.yz=rotX*normal.yz;
 float radius=min(uSize.x*.36,uSize.y*.387);
 float perspective=3.8/(3.8-p.z);
 vec2 pos=p.xy*radius*perspective+uSize*vec2(.5,.49);
 // Independent falling columns land from bottom to top, assembling the world.
 // Once the intro ends this branch is skipped entirely.
 if(uArrivalTime<3.35){
  float seed=aSeed.z;
  float landing=1.05+(1.-clamp(pos.y/uSize.y,0.,1.))*1.65+seed*.25;
  float duration=.78+fract(seed*7.31)*.22;
  float progress=clamp((uArrivalTime-(landing-duration))/duration,0.,1.);
  float targetY=pos.y;
  float startY=-24.-seed*100.;
  // Accelerate downward, then settle at each particle's own destination.
  pos.y=mix(startY,targetY,progress*progress);
  float age=max(0.,uArrivalTime-landing);
  float settle=clamp(age/.32,0.,1.);
  pos.y-=sin(settle*3.14159265)*(1.-settle)*8.;
  pos.x+=sin(aSeed.x*13.+seed*21.)*(1.-progress)*12.;
 }
 vec2 delta=pos-uPointer;
 float dist=length(delta);
 float influence=(1.-smoothstep(0.,145.,dist))*uLive;
 vec2 direction=delta/max(dist,1.);
 pos+=direction*influence*(10.+uVelocity*28.);
 pos+=vec2(-direction.y,direction.x)*influence*uVelocity*18.;
 pos+=direction*sin(dist*.055-uTime*7.)*influence*uEnergy*30.;
 vec2 clip=pos/uSize*2.-1.;
 gl_Position=vec4(clip.x,-clip.y,0.,1.);
 gl_PointSize=(10.5+(p.z+.7)*2.0)*uDpr;
 float depth=smoothstep(-.65,.65,p.z);
 float centerX=1.-smoothstep(uSize.x<600.?uSize.x*.33:205.,uSize.x<600.?uSize.x*.47:305.,abs(pos.x-uSize.x*.5));
 float centerY=1.-smoothstep(46.,88.,abs(pos.y-uSize.y*.49));
 float contour=pow(1.-abs(normal.z),2.);
 float surface=smoothstep(-.3,.8,normal.z);
 float ink=.22+depth*.24+surface*.24+contour*.19;
 // Keep connected contours around the title instead of erasing the whole middle.
 vAlpha=min(.9,ink+influence*.12)*(1.-centerX*centerY*.56)*uIntro;
 vDigit=step(.5,fract(aSeed.z+floor(uTime*4.)*influence*uVelocity*.05));
}`;
const fragment = `
precision mediump float;
uniform sampler2D uAtlas;
varying float vAlpha,vDigit;
void main(){
 vec2 uv=vec2((gl_PointCoord.x+vDigit)*.5,gl_PointCoord.y);
 float glyph=texture2D(uAtlas,uv).a;
 if(glyph<.02)discard;
 gl_FragColor=vec4(.075,.075,.075,glyph*vAlpha);
}`;

export function BinaryWorld({ energy }: { energy: MutableRefObject<number> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const candidate = canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });
    if (!candidate) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 800;
        canvas.height = 600;
        ctx.fillStyle = '#999';
        ctx.font = '9px monospace';
        for (let i = 0; i < 700; i++) {
          const a = i * 2.39996,
            r = (185 + 25 * Math.sin(i * 0.09)) * 0.9;
          ctx.fillText(
            i % 2 ? '1' : '0',
            400 + Math.cos(a) * r,
            300 + Math.sin(a) * r,
          );
        }
      }
      return;
    }
    const gl: WebGLRenderingContext = candidate;
    const compile = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(s) || 'Shader compilation failed');
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, vertex),
      fs = compile(gl.FRAGMENT_SHADER, fragment),
      program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error('Binary field unavailable');
    gl.useProgram(program);
    const coarse = matchMedia('(pointer:coarse)').matches,
      reduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
    const rows = coarse ? 17 : 25,
      cols = coarse ? 88 : 144,
      count = rows * cols;
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols),
        col = i % cols;
      data[i * 3] = ((col + (row % 2) * 0.5) / cols) * Math.PI * 2;
      data[i * 3 + 1] = ((row + 0.5) / rows) * Math.PI * 2;
      data[i * 3 + 2] = (i * 0.61803398875) % 1;
    }
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'aSeed');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
    const atlas = document.createElement('canvas');
    atlas.width = 128;
    atlas.height = 64;
    const ac = atlas.getContext('2d')!;
    ac.fillStyle = '#fff';
    ac.font = '44px monospace';
    ac.textAlign = 'center';
    ac.textBaseline = 'middle';
    ac.fillText('0', 32, 33);
    ac.fillText('1', 96, 33);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const uniforms = Object.fromEntries(
      [
        'Size',
        'Pointer',
        'Time',
        'Morph',
        'Yaw',
        'Pitch',
        'Energy',
        'Velocity',
        'Dpr',
        'Intro',
        'ArrivalTime',
        'Live',
      ].map((n) => [n, gl.getUniformLocation(program, 'u' + n)]),
    );
    let width = 0,
      height = 0,
      dpr = 1,
      raf = 0,
      last = 0,
      time = 0,
      elapsed = 0,
      morph = 0.42,
      yaw = 0,
      pitch = 0.28,
      px = -999,
      py = -999,
      tx = -999,
      ty = -999,
      targetMorph = 0.42,
      targetYaw = 0,
      targetPitch = 0.28,
      velocity = 0,
      targetVelocity = 0,
      lastInput = 0,
      visible = true;
    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      dpr = Math.min(devicePixelRatio, coarse ? 1.25 : 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = e.clientX - r.left,
        ny = e.clientY - r.top;
      const now = performance.now();
      if (tx > -900)
        targetVelocity = Math.min(
          1,
          (Math.hypot(nx - tx, ny - ty) / Math.max(8, now - lastInput)) * 0.3,
        );
      tx = nx;
      ty = ny;
      lastInput = now;
      targetMorph = Math.min(1, Math.max(0, ny / height));
      targetYaw = (nx / width - 0.5) * 0.95;
      targetPitch = 0.22 + (ny / height - 0.5) * 0.44;
    };
    const leave = () => {
      tx = -999;
      ty = -999;
      targetMorph = 0.42;
      targetYaw = 0;
      targetPitch = 0.28;
      targetVelocity = 0;
    };
    const up = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') leave();
    };
    canvas.parentElement!.addEventListener('pointermove', move, {
      passive: true,
    });
    canvas.parentElement!.addEventListener('pointerdown', move, {
      passive: true,
    });
    canvas.parentElement!.addEventListener('pointerleave', leave);
    window.addEventListener('pointerup', up);
    function render(now: number) {
      raf = 0;
      if (!visible || document.hidden) return;
      const active =
        (!reduced && elapsed < 4.1) ||
        now - lastInput < 1800 ||
        energy.current > 0.005;
      if (now - last < (active && !coarse ? 16 : 33)) {
        raf = requestAnimationFrame(render);
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      elapsed += dt;
      const handoff = reduced
        ? 1
        : Math.min(1, Math.max(0, (elapsed - 3.35) / 0.75));
      const live = handoff * handoff * (3 - 2 * handoff);
      time += reduced ? 0 : dt * live;
      const smooth = 1 - Math.exp(-dt * 6.5);
      morph += (0.42 + (targetMorph - 0.42) * live - morph) * smooth;
      yaw += (targetYaw * live - yaw) * smooth;
      pitch += (0.28 + (targetPitch - 0.28) * live - pitch) * smooth;
      px += (tx - px) * Math.min(1, dt * 16);
      py += (ty - py) * Math.min(1, dt * 16);
      velocity += (targetVelocity - velocity) * smooth;
      targetVelocity *= Math.exp(-dt * 4);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uniforms.Size, width, height);
      gl.uniform2f(
        uniforms.Pointer,
        reduced || live === 0 ? -999 : px,
        reduced || live === 0 ? -999 : py,
      );
      gl.uniform1f(uniforms.Time, time);
      gl.uniform1f(uniforms.Morph, reduced ? 0.42 : morph);
      gl.uniform1f(uniforms.Yaw, reduced ? 0 : yaw);
      gl.uniform1f(uniforms.Pitch, reduced ? 0.28 : pitch);
      gl.uniform1f(uniforms.Velocity, reduced ? 0 : velocity * live);
      gl.uniform1f(uniforms.Energy, reduced ? 0 : energy.current * live);
      gl.uniform1f(uniforms.Dpr, dpr);
      gl.uniform1f(uniforms.Intro, reduced ? 1 : Math.min(1, elapsed * 2.5));
      gl.uniform1f(uniforms.ArrivalTime, reduced ? 4 : elapsed);
      gl.uniform1f(uniforms.Live, live);
      gl.drawArrays(gl.POINTS, 0, count);
      if (!reduced || elapsed < 1) raf = requestAnimationFrame(render);
    }
    const wake = () => {
      if (!raf && !document.hidden && visible) {
        last = performance.now();
        raf = requestAnimationFrame(render);
      }
    };
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else wake();
    };
    document.addEventListener('visibilitychange', visibility);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(canvas);
    wake();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      canvas.parentElement?.removeEventListener('pointermove', move);
      canvas.parentElement?.removeEventListener('pointerdown', move);
      canvas.parentElement?.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerup', up);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(tex);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [energy]);
  return <canvas ref={ref} aria-hidden="true" className="binary-field" />;
}
