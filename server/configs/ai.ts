const ai = {
  async generateImage(prompt: string) {

    const cleanPrompt = prompt.replace(/\s+/g, " ").trim();

    const encodedPrompt = encodeURIComponent(cleanPrompt);

    const imageUrl =
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&model=flux`;

    return imageUrl;
  }
};

export default ai;