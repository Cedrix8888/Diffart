from diffusers.pipelines.stable_diffusion_xl.pipeline_stable_diffusion_xl import StableDiffusionXLPipeline
import torch
from typing import Any

# Load with optimizations
pipe = StableDiffusionXLPipeline.from_pretrained(
    "stabilityai/stable-diffusion-xl-base-1.0",
    torch_dtype=torch.float16,
    use_safetensors=True,
    variant="fp16"
)

# Move to device
pipe = pipe.to("cuda")

# Enable memory optimizations
# Enable xformers for faster attention (if installed)
# pipe.enable_xformers_memory_efficient_attention()

prompt = "Astronaut in a jungle, cold color palette, muted colors, detailed, 8k"

# Call the pipeline with optimized settings
result: Any = pipe(
    prompt,
    num_inference_steps=30,  # Reduce steps for faster generation (default is 50)
    guidance_scale=7.5
)

# The pipeline returns a StableDiffusionXLPipelineOutput object with images attribute
image = result.images[0]
image.save("astronaut_jungle.png")
