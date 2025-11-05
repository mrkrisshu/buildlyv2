declare module "three" {
  const three: any;
  export = three;
}

// Provide a minimal global THREE namespace for type references used in code
declare namespace THREE {
  type Texture = any;
  type OrthographicCamera = any;
  type InstancedMesh = any;
  type ShaderMaterial = any;
  type InstancedBufferAttribute = any;
  type Vector2 = any;
  type PlaneGeometry = any;
  type Color = any;
  const MathUtils: any;
  const FrontSide: any;
  const AdditiveBlending: any;
  const DynamicDrawUsage: any;
}

declare module "three/addons/postprocessing/EffectComposer.js" {
  export const EffectComposer: any;
  export type EffectComposer = any;
}

declare module "three/addons/postprocessing/RenderPass.js" {
  export const RenderPass: any;
  export type RenderPass = any;
}

declare module "three/addons/postprocessing/UnrealBloomPass.js" {
  export const UnrealBloomPass: any;
  export type UnrealBloomPass = any;
}

declare module "three/addons/postprocessing/ShaderPass.js" {
  export const ShaderPass: any;
  export type ShaderPass = any;
}