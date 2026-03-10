const ai = {
  async generateImage(prompt: string) {

    const encodedPrompt = encodeURIComponent(prompt);

    const imageUrl =
      `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&model=flux`;

    return imageUrl;

  }
};

export default ai;