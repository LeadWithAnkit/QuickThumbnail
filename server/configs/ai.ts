import axios from "axios";

const ai = {
  async generateImage(prompt: string) {

    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/SG161222/RealVisXL_V4.0",
      {
        inputs: prompt,
        parameters: {
          guidance_scale: 7,
          num_inference_steps: 30,
          negative_prompt:
            "cartoon, anime, illustration, painting, drawing, sketch, low quality, blurry"
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "image/png"
        },
        responseType: "arraybuffer"
      }
    );

    const base64 = Buffer.from(response.data).toString("base64");

    return `data:image/png;base64,${base64}`;
  }
};

export default ai;