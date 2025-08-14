import { Uniform, TextureLoader } from "three";
import { Effect } from "postprocessing";
import { forwardRef, useMemo } from "react";
import { wrapEffect } from "@react-three/postprocessing";

const fragmentShader = /* glsl */ `
uniform sampler2D cloudTex;
uniform float progress;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec4 cloud = texture2D(cloudTex, uv);
  float mask = step(progress, cloud.r);
  outputColor = mix(vec4(1.0), inputColor, mask);
}
`;

class CloudTransitionEffect extends Effect {
  constructor({ cloudTexture, progress = 0 }) {
    const texture = new TextureLoader().load(cloudTexture);

    super("CloudTransition", fragmentShader, {
      uniforms: new Map([
        ["cloudTex", new Uniform(texture)],
        ["progress", new Uniform(progress)]
      ])
    });
  }
}

export const CloudTransition = forwardRef((props, ref) => {
  const EffectComponent = useMemo(() => wrapEffect(CloudTransitionEffect), []);
  return <EffectComponent ref={ref} {...props} />;
});
