import axios from "axios";

const ai = {
  async generateImage(prompt: string) {

    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/SG161222/RealVisXL_V4.0/pipeline/text-to-image",
      {
        inputs: prompt
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          Accept: "image/png",
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer"
      }
    );

    const base64 = Buffer.from(response.data).toString("base64");

    return `data:image/png;base64,${base64}`;
  }
};

export default ai;