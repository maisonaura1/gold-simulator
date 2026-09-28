import * as THREE from 'three'
import { PALETTE } from './palette'

/* ───────────────────────── Shared material set ───────────────────────── */

/** Paper whose reverse side is faintly blush, so folds read even when both sides show. */
function createPaperMaterial() {
  const material = new THREE.MeshStandardMaterial({
    color: '#fdfaf5',
    roughness: 0.9,
    envMapIntensity: 1,
    side: THREE.DoubleSide,
  })
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      /* glsl */ `#include <color_fragment>
      if (!gl_FrontFacing) diffuseColor.rgb *= vec3(0.97, 0.87, 0.81);`,
    )
  }
  material.customProgramCacheKey = () => 'rx-paper-1'
  return material
}

export function createMaterials(brushed: THREE.Texture) {
  return {
    /** Brushed brass — the signature metal. */
    brass: new THREE.MeshStandardMaterial({
      color: PALETTE.gold,
      metalness: 1,
      roughness: 0.36,
      roughnessMap: brushed,
      envMapIntensity: 1.3,
    }),
    /** Lighter champagne gold for accents (pans, rims, nibs). */
    champagne: new THREE.MeshStandardMaterial({
      color: PALETTE.goldSoft,
      metalness: 1,
      roughness: 0.26,
      roughnessMap: brushed,
      envMapIntensity: 1.1,
    }),
    /** Glossy ivory ceramic. */
    ivory: new THREE.MeshPhysicalMaterial({
      color: '#f6efe5',
      roughness: 0.42,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 0.95,
    }),
    /** Blush glazed ceramic. */
    blush: new THREE.MeshPhysicalMaterial({
      color: '#ecd3c4',
      roughness: 0.45,
      clearcoat: 0.8,
      clearcoatRoughness: 0.14,
      envMapIntensity: 0.9,
    }),
    /** Matte terracotta clay with a soft velvet sheen. */
    clay: new THREE.MeshPhysicalMaterial({
      color: PALETTE.clay,
      roughness: 0.82,
      sheen: 0.55,
      sheenRoughness: 0.75,
      sheenColor: new THREE.Color(PALETTE.claySoft),
      envMapIntensity: 0.8,
    }),
    /** Deep navy lacquer (pen barrel, microphone core). */
    navy: new THREE.MeshPhysicalMaterial({
      color: PALETTE.navy,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1,
    }),
    /** Uncoated paper (paper plane, envelope). */
    paper: createPaperMaterial(),
    /** Blush-tinted paper (envelope lining). */
    paperBlush: new THREE.MeshStandardMaterial({
      color: '#f0d7ca',
      roughness: 0.86,
      envMapIntensity: 1,
      side: THREE.DoubleSide,
    }),
    glass: createGlassMaterial(),
  }
}

export type MaterialSet = ReturnType<typeof createMaterials>

export function disposeMaterials(materials: MaterialSet) {
  for (const material of Object.values(materials)) material.dispose()
}

/* ───────────────────────── Glass ───────────────────────── */

/**
 * "Glass" without a transmission pass (which would re-render the scene every
 * frame and could not refract the HTML behind a transparent canvas anyway).
 * The body stays almost clear while reflections, the fresnel rim and the
 * clear-coat highlight are layered on top, so it reads as a glass marble over
 * the page. The shader composes the result as premultiplied light, then hands
 * three.js a straight colour + alpha (three premultiplies again after the
 * sRGB conversion, which must not see premultiplied values).
 */
export function createGlassMaterial() {
  const material = new THREE.MeshPhysicalMaterial({
    // A whisper of amber so it reads as glass on light paper backgrounds.
    color: '#b0946a',
    roughness: 0.05,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    iridescence: 0.4,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [220, 520],
    envMapIntensity: 1.3,
    transparent: true,
    opacity: 0.18,
    premultipliedAlpha: true,
    depthWrite: false,
  })
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <opaque_fragment>',
      /* glsl */ `
      float glassFresnel = pow(1.0 - saturate(dot(geometryNormal, geometryViewDir)), 2.2);
      float glassBody = saturate(diffuseColor.a + glassFresnel * 0.6);
      vec3 glassSpecular = max(outgoingLight - totalDiffuse, vec3(0.0));
      vec3 glassLight = totalDiffuse * glassBody + glassSpecular;
      float glassAlpha = saturate(max(glassBody + dot(glassSpecular, vec3(0.3333)), max(glassLight.r, max(glassLight.g, glassLight.b))));
      gl_FragColor = vec4(glassLight / max(glassAlpha, 0.0001), glassAlpha);
      `,
    )
  }
  material.customProgramCacheKey = () => 'rx-glass-2'
  return material
}

/* ───────────────────────── Fluid "bloom" ───────────────────────── */

// 3D simplex noise — Ian McEwan, Stefan Gustavson (Ashima Arts), MIT licence.
const SIMPLEX_3D = /* glsl */ `
vec3 rxMod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 rxMod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 rxPermute(vec4 x) { return rxMod289(((x * 34.0) + 10.0) * x); }
vec4 rxTaylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float rxSnoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = rxMod289(i);
  vec4 p = rxPermute(rxPermute(rxPermute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = rxTaylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`

export interface BloomOptions {
  colorA?: THREE.ColorRepresentation
  colorB?: THREE.ColorRepresentation
  amplitude?: number
  frequency?: number
}

/**
 * Pearlescent, slowly morphing blob: a unit sphere displaced along its radius
 * by two octaves of simplex noise. Normals are rebuilt from neighbouring
 * displaced points so the lighting follows the fluid surface, and the base
 * colour flows between blush and clay with the displacement.
 */
export class BloomMaterial extends THREE.MeshPhysicalMaterial {
  readonly bloom = {
    uTime: { value: 0 },
    uAmp: { value: 0.08 },
    uFreq: { value: 0.58 },
    uColorA: { value: new THREE.Color('#f3e4da') },
    uColorB: { value: new THREE.Color('#d9a38e') },
  }

  constructor({ colorA, colorB, amplitude, frequency }: BloomOptions = {}) {
    super({
      roughness: 0.24,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      sheen: 0.35,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color('#f7dccd'),
      iridescence: 0.7,
      iridescenceIOR: 1.4,
      iridescenceThicknessRange: [200, 620],
      envMapIntensity: 1,
    })
    if (colorA !== undefined) this.bloom.uColorA.value.set(colorA)
    if (colorB !== undefined) this.bloom.uColorB.value.set(colorB)
    if (amplitude !== undefined) this.bloom.uAmp.value = amplitude
    if (frequency !== undefined) this.bloom.uFreq.value = frequency
  }

  override onBeforeCompile(shader: THREE.WebGLProgramParametersWithUniforms) {
    Object.assign(shader.uniforms, this.bloom)

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        uniform float uTime;
        uniform float uAmp;
        uniform float uFreq;
        varying float vBloom;
        ${SIMPLEX_3D}
        float bloomField(vec3 dir) {
          vec3 q = dir * uFreq;
          float n = rxSnoise(q + vec3(0.0, uTime * 0.11, uTime * 0.06));
          n += 0.15 * rxSnoise(q * 1.9 + vec3(uTime * 0.07, 3.7, -uTime * 0.05));
          return n;
        }
        vec3 bloomPoint(vec3 p, out float field) {
          vec3 dir = normalize(p);
          field = bloomField(dir);
          return dir * length(p) * (1.0 + uAmp * field);
        }`,
      )
      .replace(
        '#include <beginnormal_vertex>',
        /* glsl */ `
        float bloomF0;
        float bloomF1;
        float bloomF2;
        vec3 bloomN = normalize(position);
        vec3 bloomT = normalize(cross(bloomN, abs(bloomN.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
        vec3 bloomB = cross(bloomN, bloomT);
        vec3 bloomP0 = bloomPoint(position, bloomF0);
        vec3 bloomP1 = bloomPoint(position + bloomT * 0.02, bloomF1);
        vec3 bloomP2 = bloomPoint(position + bloomB * 0.02, bloomF2);
        vec3 objectNormal = normalize(cross(bloomP1 - bloomP0, bloomP2 - bloomP0));
        vBloom = bloomF0;
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3(tangent.xyz);
        #endif
        `,
      )
      .replace(
        '#include <begin_vertex>',
        /* glsl */ `
        vec3 transformed = bloomP0;
        #ifdef USE_ALPHAHASH
          vPosition = vec3(position);
        #endif
        `,
      )

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying float vBloom;`,
      )
      .replace(
        '#include <color_fragment>',
        /* glsl */ `#include <color_fragment>
        diffuseColor.rgb = mix(uColorB, uColorA, smoothstep(-1.0, 0.55, vBloom));`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        /* glsl */ `#include <emissivemap_fragment>
        // Pearl glow, part 1: a soft inner lift, as if lit from within.
        totalEmissiveRadiance += diffuseColor.rgb * 0.16;`,
      )
      .replace(
        '#include <opaque_fragment>',
        /* glsl */ `
        // Pearl glow, part 2: a luminous rim added after the clear coat, whose
        // fresnel would otherwise leave a dull outline against the light page.
        float bloomRim = pow(1.0 - saturate(dot(geometryNormal, geometryViewDir)), 2.4);
        outgoingLight += (diffuseColor.rgb * 0.42 + vec3(0.98, 0.93, 1.0) * 0.12) * bloomRim;
        #include <opaque_fragment>`,
      )
  }

  override customProgramCacheKey() {
    return 'rx-bloom-3'
  }
}
