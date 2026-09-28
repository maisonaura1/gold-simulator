'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import { useKit, useSceneFrame } from '../core/kit'
import { Drift, FitCamera, PointerParallax, ShadowBlob } from '../core/rig'
import type { Motif } from '../core/types'
import { Bloom } from '../models/Bloom'
import { GrowthChart } from '../models/GrowthChart'
import { LetterTile } from '../models/LetterTile'
import { Microphone } from '../models/Microphone'
import { Orb, type OrbFinish } from '../models/Orb'
import { DottedTrail, PaperPlane } from '../models/PaperPlane'
import { Scales } from '../models/Scales'
import { Envelope, FountainPen, PaperSheet, Paperclip, sheetCurl } from '../models/Stationery'

/*
 * One light scene per inner-page motif. Each is composed inside a 2.4 × 2.4
 * design box centred in the square wrapper (the CSS disc behind it has a
 * radius of ~0.91 in these units).
 */
const BOX = 2.4

function Frame({ elevation = 0.1, children }: { elevation?: number; children: ReactNode }) {
  return (
    <>
      <FitCamera width={BOX} height={BOX} fov={30} elevation={elevation} />
      {children}
    </>
  )
}

/* ───────────────────────── business ───────────────────────── */

function BusinessMotif() {
  const float = useRef<THREE.Group>(null)
  return (
    <Frame elevation={0.3}>
      <PointerParallax move={0.03} tilt={0.12}>
        <Drift innerRef={float} float={0.035} tilt={0.025} speed={0.6} seed={3}>
          <GrowthChart position={[0, -0.6, 0]} scale={1.02} />
        </Drift>
      </PointerParallax>
      <ShadowBlob position={[0, -0.74, 0]} width={1.75} depth={1.5} opacity={0.28} follow={float} />
    </Frame>
  )
}

/* ───────────────────────── legal ───────────────────────── */

function LegalMotif() {
  const float = useRef<THREE.Group>(null)
  return (
    <Frame elevation={0.12}>
      <Drift position={[-0.6, 0.3, -0.55]} float={0.05} tilt={0.06} speed={0.5} seed={11}>
        <PaperSheet variant="contract" width={0.62} height={0.86} rotation={[0.08, 0.42, 0.16]} />
      </Drift>
      <PointerParallax move={0.03} tilt={0.14} position={[0, -0.78, 0]}>
        <Drift innerRef={float} float={0.03} tilt={0.015} speed={0.6} seed={5}>
          <Scales rotation={[0.1, -0.5, 0, 'YXZ']} scale={1.52} />
        </Drift>
      </PointerParallax>
      <Drift position={[0.66, -0.3, 0.45]} float={0.05} tilt={0.07} speed={0.55} seed={12}>
        <PaperSheet variant="letter" width={0.44} height={0.61} rotation={[-0.1, -0.52, -0.12]} />
      </Drift>
      <ShadowBlob position={[0, -0.8, 0]} width={1.1} depth={0.9} opacity={0.3} follow={float} />
    </Frame>
  )
}

/* ───────────────────────── beginner ───────────────────────── */

function BeginnerMotif() {
  return (
    <Frame elevation={0.06}>
      <PointerParallax move={0.03} tilt={0.16}>
        <Drift position={[-0.6, 0.4, 0]} float={0.06} tilt={0.09} speed={0.7} seed={21}>
          <LetterTile glyph="A" tile="ivory" letter="brass" size={0.9} rotation={[0.1, 0.34, -0.08]} />
        </Drift>
        <Drift position={[0.02, 0, 0.25]} float={0.06} tilt={0.09} speed={0.7} seed={22}>
          <LetterTile glyph="B" tile="clay" letter="ivory" size={0.9} rotation={[0.04, -0.06, 0.05]} />
        </Drift>
        <Drift position={[0.62, -0.4, 0]} float={0.06} tilt={0.09} speed={0.7} seed={23}>
          <LetterTile glyph="C" tile="blush" letter="clay" size={0.9} rotation={[-0.04, -0.36, 0.08]} />
        </Drift>
      </PointerParallax>
    </Frame>
  )
}

/* ───────────────────────── speech ───────────────────────── */

function SpeechMotif() {
  const float = useRef<THREE.Group>(null)
  return (
    <Frame elevation={0.08}>
      <PointerParallax move={0.03} tilt={0.14} position={[0, 0.3, 0]}>
        <Drift innerRef={float} float={0.03} tilt={0.03} speed={0.5} seed={31}>
          <Microphone scale={1.08} />
        </Drift>
      </PointerParallax>
      <ShadowBlob position={[0, -0.68, 0]} width={0.95} depth={0.7} opacity={0.3} follow={float} />
    </Frame>
  )
}

/* ───────────────────────── freelance ───────────────────────── */

const DOC_W = 0.74
const DOC_H = 1.02
const CLIP_X = -0.19

function FreelanceMotif() {
  return (
    <Frame elevation={0.1}>
      <PointerParallax move={0.03} tilt={0.14}>
        <Drift position={[-0.16, 0.1, -0.3]} float={0.04} tilt={0.05} speed={0.5} seed={41}>
          <PaperSheet variant="letter" width={DOC_W} height={DOC_H} rotation={[0.04, 0.3, 0.14]} />
        </Drift>
        <Drift position={[0.1, -0.02, 0]} float={0.045} tilt={0.05} speed={0.55} seed={42}>
          <group rotation={[-0.05, -0.24, -0.06]}>
            <PaperSheet variant="contract" width={DOC_W} height={DOC_H} />
            <Paperclip position={[CLIP_X, DOC_H / 2 - 0.066, sheetCurl(CLIP_X, DOC_W)]} scale={0.62} />
          </group>
        </Drift>
        <Drift position={[0.2, -0.34, 0.42]} float={0.06} tilt={0.08} speed={0.6} seed={43}>
          <FountainPen rotation={[0.35, 0.25, -1]} scale={0.95} />
        </Drift>
      </PointerParallax>
    </Frame>
  )
}

/* ───────────────────────── about ───────────────────────── */

interface Orbiter {
  finish: OrbFinish
  size: number
  radius: number
  speed: number
  phase: number
  tilt: [number, number, number]
  ring?: boolean
}

const ABOUT_ORBITERS: Orbiter[] = [
  { finish: 'ivory', size: 0.075, radius: 0.9, speed: 0.3, phase: 0.4, tilt: [1.2, 0, 0.32], ring: true },
  { finish: 'clay', size: 0.058, radius: 0.8, speed: -0.24, phase: 2.4, tilt: [1.32, 0, -0.5] },
  { finish: 'champagne', size: 0.044, radius: 1.02, speed: 0.2, phase: 4.3, tilt: [1.08, 0, -0.12], ring: true },
  { finish: 'glass', size: 0.085, radius: 0.74, speed: 0.17, phase: 5.4, tilt: [1.42, 0, 0.78] },
]

function OrbitRing({ radius }: { radius: number }) {
  const { materials, compact } = useKit()
  const [geometry] = useState(() => {
    const g = new THREE.TorusGeometry(radius, 0.0035, 6, compact ? 96 : 160)
    g.rotateX(Math.PI / 2)
    return g
  })
  useEffect(() => () => geometry.dispose(), [geometry])
  return <mesh geometry={geometry} material={materials.champagne} />
}

function Orbiting({ spec }: { spec: Orbiter }) {
  const body = useRef<THREE.Group>(null)
  useSceneFrame((t) => {
    const g = body.current
    if (!g) return
    const a = spec.phase + t * spec.speed
    g.position.set(Math.cos(a) * spec.radius, 0, Math.sin(a) * spec.radius)
  })
  return (
    <group rotation={spec.tilt}>
      {spec.ring && <OrbitRing radius={spec.radius} />}
      <group ref={body}>
        <Orb finish={spec.finish} radius={spec.size} />
      </group>
    </group>
  )
}

function AboutMotif() {
  return (
    <Frame elevation={0.1}>
      <PointerParallax move={0.03} tilt={0.1}>
        <Drift float={0.04} tilt={0.1} speed={0.5} seed={51}>
          <Bloom radius={0.52} />
        </Drift>
        {ABOUT_ORBITERS.map((spec) => (
          <Orbiting key={spec.phase} spec={spec} />
        ))}
      </PointerParallax>
    </Frame>
  )
}

/* ───────────────────────── contact ───────────────────────── */

const TRAIL: [number, number, number][] = [
  [-1.02, -0.74, -0.3],
  [-0.7, -0.84, -0.1],
  [-0.38, -0.66, 0.05],
  [-0.3, -0.36, 0.1],
  [-0.24, -0.1, 0.1],
  [-0.08, 0.06, 0.08],
]

function ContactMotif() {
  return (
    <Frame elevation={0.08}>
      <PointerParallax move={0.04} tilt={0.14}>
        <Drift position={[-0.5, 0.52, -0.5]} float={0.04} tilt={0.08} speed={0.45} seed={62}>
          <Envelope rotation={[0.1, 0.35, 0.14]} scale={0.95} />
        </Drift>
        <DottedTrail points={TRAIL} count={28} radius={0.02} />
        <Drift position={[0.3, 0.2, 0.1]} float={0.07} tilt={0.1} speed={0.65} seed={61}>
          <PaperPlane rotation={[0.45, 0.3, 0.38]} scale={1.02} />
        </Drift>
      </PointerParallax>
    </Frame>
  )
}

/* ───────────────────────── courses ───────────────────────── */

const ORBIT_RADIUS = 0.84
const ORBIT_TILT = 0.34

function ProgramEmblem({ index, children }: { index: number; children: ReactNode }) {
  const holder = useRef<THREE.Group>(null)
  useSceneFrame((t) => {
    const g = holder.current
    if (!g) return
    // Same plane as the ring (rotated about X by ORBIT_TILT): the near side dips.
    const a = index * (Math.PI / 2) + t * 0.14 + 0.5
    const s = Math.sin(a)
    g.position.set(Math.cos(a) * ORBIT_RADIUS, -s * Math.sin(ORBIT_TILT) * ORBIT_RADIUS, s * Math.cos(ORBIT_TILT) * ORBIT_RADIUS)
    g.rotation.y = Math.sin(t * 0.5 + index) * 0.3
  })
  return <group ref={holder}>{children}</group>
}

function CoursesMotif() {
  return (
    <Frame elevation={0.14}>
      <PointerParallax move={0.03} tilt={0.1}>
        <Drift float={0.04} tilt={0.1} speed={0.5} seed={71}>
          <Bloom radius={0.3} />
        </Drift>
        <group rotation={[ORBIT_TILT, 0, 0]}>
          <OrbitRing radius={ORBIT_RADIUS} />
        </group>
        <ProgramEmblem index={0}>
          <GrowthChart mini spin={false} scale={0.46} position={[0, -0.2, 0]} />
        </ProgramEmblem>
        <ProgramEmblem index={1}>
          <Scales scale={0.4} position={[0, -0.2, 0]} rotation={[0.12, -0.4, 0, 'YXZ']} swing={0.6} />
        </ProgramEmblem>
        <ProgramEmblem index={2}>
          <LetterTile glyph="A" tile="ivory" letter="brass" size={0.52} />
        </ProgramEmblem>
        <ProgramEmblem index={3}>
          <Microphone waves={false} scale={0.36} position={[0, 0.06, 0]} />
        </ProgramEmblem>
      </PointerParallax>
    </Frame>
  )
}

/* ───────────────────────── switch ───────────────────────── */

const SCENES: Record<Motif, () => ReactNode> = {
  business: BusinessMotif,
  legal: LegalMotif,
  beginner: BeginnerMotif,
  speech: SpeechMotif,
  freelance: FreelanceMotif,
  about: AboutMotif,
  contact: ContactMotif,
  courses: CoursesMotif,
}

export function MotifScene({ motif }: { motif: Motif }) {
  const Scene = SCENES[motif]
  return <Scene />
}
