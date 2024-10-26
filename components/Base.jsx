
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Base(props) {
  const { nodes, materials } = useGLTF('/base.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Cylinder001.geometry} material={nodes.Cylinder001.material} scale={14.407} />
      <mesh geometry={nodes.Cylinder002.geometry} material={nodes.Cylinder002.material} scale={14.407} />
      <mesh geometry={nodes.Cylinder003.geometry} material={materials['Material.001']} scale={14.407} />
      <group scale={14.407}>
        <mesh geometry={nodes.Cylinder024.geometry} material={materials['caster_plastic touched.002']} />
        <mesh geometry={nodes.Cylinder024_1.geometry} material={materials['caster_plastic touched w.002']} />
      </group>
      <mesh geometry={nodes.Cylinder005.geometry} material={materials['caster_plastic touched.002']} scale={14.407} />
      <mesh geometry={nodes.Cylinder006.geometry} material={materials['caster_plastic touched.002']} scale={14.407} />
      <group scale={14.407}>
        <mesh geometry={nodes.Cylinder028.geometry} material={materials['caster_plastic touched.002']} />
        <mesh geometry={nodes.Cylinder028_1.geometry} material={materials['caster_plastic touched w.002']} />
      </group>
      <mesh geometry={nodes.Cylinder008.geometry} material={materials['caster_plastic touched.002']} scale={14.407} />
      <mesh geometry={nodes.Cylinder009.geometry} material={materials['caster_plastic touched.002']} scale={14.407} />
      <group scale={14.407}>
        <mesh geometry={nodes.Cylinder042.geometry} material={materials['caster_plastic touched.002']} />
        <mesh geometry={nodes.Cylinder042_1.geometry} material={materials['caster_plastic touched w.002']} />
      </group>
      <mesh geometry={nodes.Cylinder011.geometry} material={materials['caster_plastic touched.002']} scale={14.407} />
      <mesh geometry={nodes.Cylinder012.geometry} material={materials['caster_plastic touched.002']} scale={14.407} />
      <mesh geometry={nodes.Cylinder013.geometry} material={materials['caster_plastic touched.002']} scale={14.407} />
      <mesh geometry={nodes.Cylinder022.geometry} material={materials['caster_plastic touched.002']} scale={14.407} />
      <mesh geometry={nodes.Cylinder026.geometry} material={materials['caster_plastic touched.002']} scale={14.407} />
      <group scale={14.407}>
        <mesh geometry={nodes.Cylinder054.geometry} material={materials['Material.001']} />
        <mesh geometry={nodes.Cylinder054_1.geometry} material={materials['Material.003']} />
      </group>
      <mesh geometry={nodes.Cylinder034.geometry} material={nodes.Cylinder034.material} scale={14.407} />
    </group>
  )
}

useGLTF.preload('/base.glb')
