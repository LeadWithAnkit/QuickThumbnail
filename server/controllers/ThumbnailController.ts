import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";
import ai from "../configs/ai.js";

const stylePrompts = {
  "Bold & Graphic":
    "dramatic lighting, strong contrast, powerful composition",
  "Tech/Futuristic":
    "futuristic environment, neon lights, high tech atmosphere",
  "Minimalist":
    "clean composition, minimal objects, simple background",
  "Photorealistic":
    "ultra realistic photography, DSLR camera, real life lighting",
  "Illustrated":
    "stylized digital illustration look"
};

const colorSchemeDescriptions = {
  vibrant: "vibrant energetic colors, strong contrast",
  sunset: "warm sunset tones, orange pink purple gradient",
  forest: "natural green earthy colors",
  neon: "neon glowing colors, cyberpunk lighting",
  purple: "purple dominant color palette",
  monochrome: "black and white cinematic lighting",
  ocean: "blue teal ocean tones",
  pastel: "soft pastel color palette"
};

export const generateThumbnail = async (req: Request, res: Response) => {

  console.log("Generate thumbnail API hit");
  console.log("Session userId:", req.session.userId);

  try {

    const { userId } = req.session;

    const {
      title,
      prompt: user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay
    } = req.body;

    // Safety validation
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!style) {
      return res.status(400).json({ error: "Style is required" });
    }

    const thumbnail = await Thumbnail.create({
      userId,
      title,
      user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
      isGenerating: true
    });

    // -------- AI PROMPT --------

    let prompt = `
    photorealistic image of ${title},
    real world environment related to the topic,
    natural lighting, cinematic lighting,
    ultra realistic photography,
    DSLR camera, 85mm lens,
    shallow depth of field,
    HDR, sharp focus,
    4k professional photography,
    realistic colors and textures,
    not cartoon, not illustration, not painting, not anime
    `;

    // Style influence
    if (style && stylePrompts[style as keyof typeof stylePrompts]) {
      prompt += `, ${stylePrompts[style as keyof typeof stylePrompts]}`;
    }

    // Color scheme influence
    if (color_scheme && colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions]) {
      prompt += `, ${colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions]}`;
    }

    // Additional user instructions
    if (user_prompt) {
      prompt += `, ${user_prompt}`;
    }

    // Aspect ratio
    if (aspect_ratio === "16:9") {
      prompt += `, cinematic wide composition`;
    }

    if (aspect_ratio === "1:1") {
      prompt += `, centered square composition`;
    }

    if (aspect_ratio === "9:16") {
      prompt += `, vertical composition`;
    }

    console.log("Sending prompt to AI:", prompt);

    const imageUrl = await ai.generateImage(prompt);

    thumbnail.image_url = imageUrl;
    thumbnail.isGenerating = false;

    await thumbnail.save();

    res.json({
      success: true,
      message: "Thumbnail generated successfully",
      thumbnail
    });

  } catch (error) {

    console.error("Thumbnail generation error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to generate thumbnail"
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