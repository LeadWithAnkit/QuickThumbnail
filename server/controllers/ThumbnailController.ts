import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";
import {
  GenerateContentConfig,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/genai";
import ai from "../configs/ai.js";
import path from "node:path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

const stylePrompts = {
  "Bold & Graphic":
    "eye-catching YouTube thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style",
  "Tech/Futuristic":
    "futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting",
  Minimalist:
    "minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design",
  Photorealistic:
    "photorealistic thumbnail, ultra-realistic lighting, natural skin tones, DSLR-style photography, shallow depth of field",
  Illustrated:
    "illustrated thumbnail, stylized digital illustration, bold outlines, vibrant colors, creative cartoon or vector art style",
};

const colorSchemeDescriptions = {
  vibrant:
    "vibrant energetic colors, high saturation, bold contrasts, eye-catching palette",
  sunset:
    "warm sunset tones, orange pink and purple hues, soft cinematic gradients",
  forest:
    "natural green earthy tones, calm organic palette",
  neon: "neon glow effects, electric blue and pink cyberpunk lighting",
  purple:
    "purple dominant palette with violet and magenta tones",
  monochrome:
    "black and white high contrast dramatic lighting",
  ocean:
    "cool blue and teal aquatic palette",
  pastel:
    "soft pastel colors with gentle tones",
};

export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;

    const {
      title,
      prompt: user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
    } = req.body;

    const thumbnail = await Thumbnail.create({
      userId,
      title,
      prompt_used: user_prompt,
      user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
      isGenerating: true,
    });

    // Correct Gemini Image Model
    const model = "gemini-2.0-flash-preview-image-generation";

    const generationConfig: GenerateContentConfig = {
      temperature: 1,
      topP: 0.95,
      maxOutputTokens: 32768,
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: aspect_ratio || "16:9",
        imageSize: "1K",
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.OFF,
        },
      ],
    };

    let prompt = `Create a ${
      stylePrompts[style as keyof typeof stylePrompts]
    } for the YouTube video titled "${title}".`;

    if (color_scheme) {
      prompt += ` Use a ${
        colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions]
      } color scheme.`;
    }

    if (user_prompt) {
      prompt += ` Additional instructions: ${user_prompt}.`;
    }

    prompt += ` Include space for bold text overlay "${text_overlay || ""}". 
    The thumbnail must look extremely clickable with strong emotional reaction, 
    dramatic lighting, and high contrast. Ensure aspect ratio ${aspect_ratio}.`;

    // Generate image from Gemini
    const response: any = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      config: generationConfig,
    });

    if (!response?.candidates?.[0]?.content?.parts) {
      throw new Error("Invalid Gemini response");
    }

    const parts = response.candidates[0].content.parts;

    let finalBuffer: Buffer | null = null;

    for (const part of parts) {
      if (part.inlineData?.data) {
        finalBuffer = Buffer.from(part.inlineData.data, "base64");
        break;
      }
    }

    if (!finalBuffer) {
      throw new Error("No image returned from Gemini");
    }

    const filename = `thumbnail-${Date.now()}.png`;
    const filepath = path.join("images", filename);

    fs.mkdirSync("images", { recursive: true });
    fs.writeFileSync(filepath, finalBuffer);

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filepath, {
      resource_type: "image",
    });

    thumbnail.image_url = uploadResult.url;
    thumbnail.isGenerating = false;
    await thumbnail.save();

    res.json({
      success: true,
      message: "Thumbnail generated successfully",
      thumbnail,
    });

    // remove local image
    fs.unlinkSync(filepath);
  } catch (error) {
    console.error("Thumbnail generation error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to generate thumbnail",
    });
  }
};

// Delete Thumbnail
export const deleteThumbnail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.session;

    await Thumbnail.findOneAndDelete({
      _id: id,
      userId,
    });

    res.json({
      success: true,
      message: "Thumbnail deleted successfully",
    });
  } catch (error) {
    console.error("Delete thumbnail error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to delete thumbnail",
    });
  }
};