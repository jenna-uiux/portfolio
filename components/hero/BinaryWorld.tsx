'use client';
import { useEffect, useRef, type MutableRefObject } from 'react';
import type { HeadlineInteraction } from './interaction';
import { createRibbonField } from './ribbonGeometry';

const vertex = `
precision highp float;
attribute vec3 aPosition;
attribute vec4 aAppearance;
uniform vec2 uSize,uPointer,uLightPosition;
uniform float uLight,uTime,uYaw,uPitch,uEnergy,uVelocity,uDpr,uIntro,uLive,uEntrance;
varying float vAlpha,vDigit,vDetail,vBlur;
void main(){
 float seed=aAppearance.y;
 float aspect=1.83;
 // Keep the central volume circular regardless of the viewport's proportions.
 vec3 p=vec3((aPosition.xy-.5)*vec2(aspect,1.)*2.,aPosition.z);
 // Calibrate the resting silhouette to equal horizontal and vertical radii.
 // Depth still controls glyph size, focus, and parallax when the camera moves.
 p.xy*=(3.6-p.z)/3.6;
 float breath=sin(uTime*.3)*.003+uEnergy*.035;
 p.xy*=1.+breath;
 p.y+=sin(aPosition.x*8.+aPosition.y*3.+uTime*.2)*.008;
 float yaw=uYaw*.95;
 float pitch=(uPitch-.1)*.95;
 mat2 rotY=mat2(cos(yaw),-sin(yaw),sin(yaw),cos(yaw));
 mat2 rotX=mat2(cos(pitch),-sin(pitch),sin(pitch),cos(pitch));
 p.xz=rotY*p.xz;p.yz=rotX*p.yz;
 float perspective=3.6/(3.6-p.z);
 vec2 pos=p.xy*perspective*uSize.y*.5*mix(.97,1.,uIntro)+uSize*.5;
 // Staggered falling streams, then a half-second capture for each glyph.
 float traveler=step(1.5,aAppearance.x);
 float captureStart=1.8+seed*.16;
 float capture=clamp((uEntrance-captureStart)/.5,0.,1.);
 float accelerating=capture*capture;
 float pull=accelerating*accelerating*(3.-2.*accelerating);
 float dissolve=smoothstep(captureStart+.5,captureStart+1.7,uEntrance);
 float startDelay=fract(sin(seed*53.9+4.)*32541.21)*.65;
 if(traveler>.5){
   float rx=fract(sin(seed*173.7+2.)*43758.5453);
   float ry=fract(sin(seed*91.3+7.)*23421.631);
   float rainTime=max(0.,min(uEntrance,captureStart)-startDelay);
   // Gaussian spacing has soft edges; independent ages and wind avoid a block.
   float spread=sqrt(-2.*log(max(.015,rx)))*cos(ry*6.2831853);
   float stream=ry*3.;
   float drift=sin(rainTime*1.35+stream*1.9)*.065
              +sin(rainTime*2.+seed*6.2831853)*.022;
   vec2 nearScreen=vec2(
     uSize.x*.5+uSize.y*(spread*.19+drift),
     uSize.y*(-.05-ry*.3+rainTime*(.17+seed*.25)+rainTime*rainTime*.055)
   );
   float nearZ=1.65+seed*.55;
   float nearPerspective=3.6/(3.6-nearZ);
   vec3 nearPoint=vec3((nearScreen-uSize*.5)/(uSize.y*.5*nearPerspective),nearZ);
   // Approach along a shared clockwise tangent, then catch the rim from the front.
   vec2 radial=normalize(p.xy-vec2(0.,.04));
   vec3 tangent=vec3(-radial.y,radial.x,0.);
   vec3 controlA=nearPoint+(p-nearPoint)*.12+tangent*(.28+seed*.12);
   vec3 controlB=p-tangent*.32+vec3(0.,0.,.45);
   float remaining=1.-pull;
   vec3 flight=remaining*remaining*remaining*nearPoint
              +3.*remaining*remaining*pull*controlA
              +3.*remaining*pull*pull*controlB+pull*pull*pull*p;
   float flightPerspective=3.6/(3.6-flight.z);
   pos=flight.xy*flightPerspective*uSize.y*.5+uSize*.5;
 }
 // The receiving rim compresses once on impact, then releases to its resting size.
 float reception=smoothstep(2.14,2.4,uEntrance)*(1.-smoothstep(2.46,3.4,uEntrance));
 pos=uSize*vec2(.5,.52)+(pos-uSize*vec2(.5,.52))*(1.-.032*reception);
 vec2 delta=pos-uPointer;
 float dist=length(delta);
 float influence=(1.-smoothstep(10.,140.,dist))*uLive;
 vec2 direction=delta/max(dist,1.);
 pos+=direction*influence*(9.+uVelocity*16.);
 pos+=vec2(-direction.y,direction.x)*influence*uVelocity*10.;
 float illumination=(1.-smoothstep(30.,280.,length(pos-uLightPosition)))*uLight;
 float depth=smoothstep(-.5,.5,p.z);
 float accent=traveler;
 vDetail=mix(min(1.,aAppearance.x),1.-dissolve,traveler);
 float landing=smoothstep(.65,1.,pull);
 vBlur=mix(1.-depth,landing*.8,traveler);
 float restingSize=aAppearance.w*perspective*mix(.8,1.4,depth);
 gl_PointSize=mix(restingSize,mix(aAppearance.w,3.,landing)*(1.-.5*dissolve),traveler)*uDpr;
 vec2 clip=pos/uSize*2.-1.;
 gl_Position=vec4(clip.x,-clip.y,0.,1.);
 vec2 textDistance=(pos-uSize*vec2(.5,.49))/vec2(min(uSize.x*.20,290.),65.);
 float clearText=1.-.92*exp(-dot(textDistance,textDistance)*1.8);
 float fog=mix(mix(.3,1.12,depth),1.,accent);
 float worldReveal=smoothstep(1.8,2.46,uEntrance);
 float appear=mix(worldReveal,smoothstep(.0,.25,uEntrance-startDelay)*(1.-dissolve),traveler);
 float absorption=mix(1.+.24*reception,mix(1.,.45,landing),traveler);
 // Falling glyphs enter through the viewport edge instead of fading in below it.
 vAlpha=(aAppearance.z*fog+influence*.045+illumination*.012)*clearText*appear*absorption;
 vDigit=step(.5,fract(seed*11.1));
}`;
const fragment = `
precision mediump float;
uniform sampler2D uAtlas;
varying float vAlpha,vDigit,vDetail,vBlur;
void main(){
 vec2 point=gl_PointCoord-.5;
 float grain=exp(-dot(point,point)*15.);
 vec2 uv=vec2((gl_PointCoord.x+vDigit)*.5,gl_PointCoord.y);
 float digit=texture2D(uAtlas,uv).a;
 // A small depth-of-field kernel softens distant glyphs, preserving sharp near glyphs.
 float offset=.035*vBlur;
 float soft=(texture2D(uAtlas,uv+vec2(offset,0.)).a
            +texture2D(uAtlas,uv-vec2(offset,0.)).a
            +texture2D(uAtlas,uv+vec2(0.,offset*2.)).a
            +texture2D(uAtlas,uv-vec2(0.,offset*2.)).a)*.25;
 digit=mix(digit,soft,vBlur);
 float alpha=mix(grain,digit,vDetail)*vAlpha;
 if(alpha<.003)discard;
 gl_FragColor=vec4(vec3(.13),alpha);
}`;

export function BinaryWorld({ energy, interaction }: {
  energy: MutableRefObject<number>;
  interaction: MutableRefObject<HeadlineInteraction>;
}) {
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
        const draw = () => {
          const width = canvas.clientWidth, height = canvas.clientHeight;
          if (!width || !height) return;
          const dpr = Math.min(devicePixelRatio, 1.5);
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          const field = createRibbonField(true);
          for (let i = 0; i < field.count; i++) {
            if (field.appearances[i * 4] === 2) continue;
            const z = field.positions[i * 3 + 2];
            const perspective = 3.6 / (3.6 - z);
            const depth = Math.max(0, Math.min(1, z + .5));
            const x = (field.positions[i * 3] - .5) * height * 1.83 + width * .5;
            const y = field.positions[i * 3 + 1] * height;
            const alpha = field.appearances[i * 4 + 2] * (.3 + depth * .82);
            const size = field.appearances[i * 4 + 3] * perspective * (.8 + depth * .6);
            ctx.fillStyle = `rgba(35,35,35,${alpha * .55})`;
            if (field.appearances[i * 4] >= 1) {
              ctx.font = `${size * .65}px monospace`;
              ctx.fillText(field.appearances[i * 4 + 1] > .5 ? '1' : '0', x, y);
            } else {
              ctx.beginPath();
              ctx.arc(x, y, size * .3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        };
        const observer = new ResizeObserver(draw);
        observer.observe(canvas);
        draw();
        return () => observer.disconnect();
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
    const coarse = matchMedia('(pointer:coarse)').matches;
    const motion = matchMedia('(prefers-reduced-motion:reduce)');
    let reduced = motion.matches;
    const { positions, appearances, count } = createRibbonField(coarse);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    const appearanceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, appearanceBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, appearances, gl.STATIC_DRAW);
    const appearanceLocation = gl.getAttribLocation(program, 'aAppearance');
    gl.enableVertexAttribArray(appearanceLocation);
    gl.vertexAttribPointer(appearanceLocation, 4, gl.FLOAT, false, 0, 0);
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
    // The transparent canvas is composited as premultiplied alpha by the browser.
    // Accumulate opacity separately so fine, low-opacity grains remain gray.
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const uniforms = Object.fromEntries(
      [
        'LightPosition',
        'Light',
        'Size',
        'Pointer',
        'Time',
        'Yaw',
        'Pitch',
        'Energy',
        'Velocity',
        'Dpr',
        'Intro',
        'Entrance',
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
      yaw = 0,
      pitch = 0.1,
      px = -999,
      py = -999,
      tx = -999,
      ty = -999,
      targetYaw = 0,
      targetPitch = 0.1,
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
      if (reduced && !raf) raf = requestAnimationFrame(render);
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
      targetYaw = (nx / width - 0.5) * 0.48;
      targetPitch = 0.1 + (ny / height - 0.5) * 0.3;
    };
    const leave = () => {
      tx = -999;
      ty = -999;
      targetYaw = 0;
      targetPitch = 0.1;
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
        (!reduced && elapsed < 3.8) ||
        now - lastInput < 1800 ||
        energy.current > 0.005 ||
        interaction.current.light > 0.01;
      if (now - last < (active && !coarse ? 16 : 33)) {
        raf = requestAnimationFrame(render);
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      elapsed += dt;
      const handoff = reduced
        ? 1
        : Math.min(1, Math.max(0, (elapsed - 0.4) / 1.1));
      const live = handoff * handoff * (3 - 2 * handoff);
      time += reduced ? 0 : dt * live;
      const smooth = 1 - Math.exp(-dt * 6.5);
      yaw += (targetYaw * live - yaw) * smooth;
      pitch += (0.1 + (targetPitch - 0.1) * live - pitch) * smooth;
      px += (tx - px) * Math.min(1, dt * 16);
      py += (ty - py) * Math.min(1, dt * 16);
      velocity += (targetVelocity - velocity) * smooth;
      targetVelocity *= Math.exp(-dt * 4);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const light = interaction.current;
      const bounds = canvas.getBoundingClientRect();
      gl.uniform2f(uniforms.LightPosition, light.x - bounds.left, light.y - bounds.top);
      gl.uniform1f(uniforms.Light, reduced ? 0 : light.light * live);
      gl.uniform2f(uniforms.Size, width, height);
      gl.uniform2f(
        uniforms.Pointer,
        reduced || live === 0 ? -999 : px,
        reduced || live === 0 ? -999 : py,
      );
      gl.uniform1f(uniforms.Time, time);
      gl.uniform1f(uniforms.Yaw, reduced ? 0 : yaw);
      gl.uniform1f(uniforms.Pitch, reduced ? 0.1 : pitch);
      gl.uniform1f(uniforms.Velocity, reduced ? 0 : velocity * live);
      gl.uniform1f(uniforms.Energy, reduced ? 0 : energy.current * live);
      gl.uniform1f(uniforms.Dpr, dpr);
      gl.uniform1f(uniforms.Intro, reduced ? 1 : Math.min(1, elapsed / 1.5));
      gl.uniform1f(uniforms.Entrance, reduced ? 3.7 : Math.min(3.7, elapsed));
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
    const motionChange = () => { reduced = motion.matches; wake(); };
    motion.addEventListener('change', motionChange);
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
      motion.removeEventListener('change', motionChange);
      document.removeEventListener('visibilitychange', visibility);
      canvas.parentElement?.removeEventListener('pointermove', move);
      canvas.parentElement?.removeEventListener('pointerdown', move);
      canvas.parentElement?.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerup', up);
      gl.deleteBuffer(buffer);
      gl.deleteBuffer(appearanceBuffer);
      gl.deleteTexture(tex);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [energy, interaction]);
  return <canvas ref={ref} aria-hidden="true" className="binary-field" />;
}
