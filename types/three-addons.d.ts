/**
 * Type declarations for three.js addon modules
 * Maps the three/addons/* paths to the corresponding @types/three definitions
 */

// EffectComposer
declare module "three/addons/postprocessing/EffectComposer.js" {
  export * from "three/examples/jsm/postprocessing/EffectComposer.js";
}

// RenderPass
declare module "three/addons/postprocessing/RenderPass.js" {
  export * from "three/examples/jsm/postprocessing/RenderPass.js";
}

// UnrealBloomPass
declare module "three/addons/postprocessing/UnrealBloomPass.js" {
  export * from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
}

// ShaderPass
declare module "three/addons/postprocessing/ShaderPass.js" {
  export * from "three/examples/jsm/postprocessing/ShaderPass.js";
}
