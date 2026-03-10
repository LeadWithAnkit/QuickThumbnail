import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";
import ai from "../configs/ai.js";

export const generateThumbnail = async (req: Request, res: Response) => {

  console.log("Generate thumbnail API hit");
  console.log("Session userId:", req.session.userId);

  try {

    const { userId } = req.session;

    const {
      title,
      prompt: user_prompt,
      aspect_ratio
    } = req.body;

    const thumbnail = await Thumbnail.create({
      userId,
      title,
      user_prompt,
      aspect_ratio,
      isGenerating: true
    });

    // ---- REALISTIC IMAGE PROMPT ----
    let prompt = `
    photorealistic image of ${title},
    real world environment related to the topic,
    natural lighting, cinematic lighting,
    realistic skin texture and materials,
    DSLR photography, 85mm lens,
    shallow depth of field,
    ultra detailed, HDR,
    sharp focus, professional photography,
    4k resolution,
    natural colors and realistic shadows,
    not illustration, not cartoon, not painting, not anime, not digital art
    `;

    if (user_prompt) {
      prompt += `, ${user_prompt}`;
    }

    if (aspect_ratio === "16:9") {
      prompt += `, cinematic wide composition`;
    }

    console.log("Sending prompt to AI:", prompt);

    const imageUrl = await ai.generateImage(prompt);

    thumbnail.image_url = imageUrl;
    thumbnail.isGenerating = false;

    await thumbnail.save();

    res.json({
      success: true,
      message: "Image generated successfully",
      thumbnail
    });

  } catch (error) {

    console.error("Thumbnail generation error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to generate image"
    });

  }
};

export const deleteThumbnail = async (req: Request, res: Response) => {

  try {

    const { id } = req.params;
    const { userId } = req.session;

    await Thumbnail.findOneAndDelete({
      _id: id,
      userId
    });

    res.json({
      success: true,
      message: "Thumbnail deleted successfully"
    });

  } catch (error) {

    console.error("Delete thumbnail error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to delete thumbnail"
    });

  }
};