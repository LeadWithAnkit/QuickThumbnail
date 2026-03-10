import axios from "axios";

const ai = {
  async generateImage(prompt: string) {

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        inputs: prompt
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