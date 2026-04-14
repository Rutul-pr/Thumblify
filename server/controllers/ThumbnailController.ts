// import { Request,Response } from "express"
// import Thumbnail from "../models/Thumbnail.js";
// import { GenerateContentConfig, HarmBlockThreshold, HarmCategory } from "@google/genai";
// import ai from "../configs/ai.js";
// import path from "path";
// import fs  from "fs";
// import {v2 as cloudinary} from 'cloudinary'

// const stylePrompts = {
//     'Bold & Graphic': 'eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style',
//     'Tech/Futuristic': 'futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere',
//    'Minimalist': 'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point',
//   'Photorealistic': 'photorealistic thumbnail, ultra-realistic lighting,      natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field',
//   'Illustrated': 'illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style',
// }

// const colorSchemeDescriptions = {
//   vibrant: 'vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette',
//   sunset: 'warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow',
//   forest: 'natural green tones, earthy colors, calm and organic palette, fresh atmosphere',
//   neon: 'neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow',
//   purple: 'purple-dominant color palette, magenta and violet tones, modern and stylish mood',
//   monochrome: 'black and white color scheme, high contrast, dramatic lighting, timeless aesthetic',
//   ocean: 'cool blue and teal tones, aquatic color palette, fresh and clean atmosphere',
//   pastel: 'soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic',
// }

// export const generateThumbnail = async(req:Request,res:Response)=>{
//     try {
//         const {userId} = req.session;
//         const {
//             title,prompt:user_prompt,style,aspect_ratio,color_scheme, text_overlay} = req.body

//             const thumbnail = await Thumbnail.create({
//                 userId,
//                 title,
//                 prompt_used:user_prompt,
//                 user_prompt,
//                 style,
//                 aspect_ratio,
//                 color_scheme,
//                 text_overlay,
//                 isGenerating:true
//             })

//             // const model = 'gemini-3-flash-preview'
//             const model = 'gemini-2.0-flash-lite'

//             const generationConfig : GenerateContentConfig = {
//                 maxOutputTokens:32768,
//                 temperature:1,
//                 topP:0.95,
//                 responseModalities:['IMAGE'],
//                 // imageConfig:{
//                 //     aspectRatio: aspect_ratio || '16:9',
//                 //     imageSize:'1K'
//                 // },
//                 safetySettings:[
//                      {
//                     category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//                     threshold: HarmBlockThreshold.OFF,
//                 },
//                 {
//                     category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
//                     threshold: HarmBlockThreshold.OFF,
//                 },
//                 {
//                     category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//                     threshold: HarmBlockThreshold.OFF,
//                 },
//                 {
//                     category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//                     threshold: HarmBlockThreshold.OFF,
//                 },
//                 ]
//             }

//             let prompt = `Creat a ${stylePrompts[style as keyof typeof stylePrompts]} for: "${title}" `;

//             if (color_scheme) {
//                 prompt += `Use a ${colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions]} color scheme`;
//             }

//             if (user_prompt) {
//                 prompt += `Additional details: ${user_prompt}`;
//             }

//             prompt += `The thumbnail shoud be ${aspect_ratio}, visually stunning and designed to maximize click-through rate for a content creater and according to given description`

//             // Generate the image using ai model in config
//             const response : any = await ai.models.generateContent({
//                 model,
//                 contents:[prompt],
//                 config:generationConfig
//             })

//             // now checking if response is valid
//             if (!response?.candidates?.[0]?.content?.parts) {
//                 throw new Error('Unexpected Response')
//             }

//             const parts = response.candidates[0].content.parts;

//             let finalBuffer :Buffer | null = null;

//             for(const part of parts){
//                 if (part.inlineData) {
//                     finalBuffer = Buffer.from(part.inlineData.data,'base64')
//                 }
//             }

//             const filename = `final-output-${Date.now()}.png`;

//             const filepath = path.join('images',filename)

//             // create image directory if not exists
//             fs.mkdirSync('images',{recursive:true})

//             // write the final image to the file
//             fs.writeFileSync(filepath,finalBuffer!)

//             const uploadResult = await cloudinary.uploader.upload(filepath,{resource_type:'image'})

//             thumbnail.image_url = uploadResult.url
//             thumbnail.isGenerating = false
//             await thumbnail.save()

//             res.json({message:'Thumbnail Generated',thumbnail})

//             // then remove the image file from disk(your storage)
//             fs.unlinkSync(filepath)


//     } catch (error:any) {
//         console.log(error);
//         res.status(500).json({message:error.message})
        
//     }
// }

// // controller function to delete the existing thumbnail
// export const deleteThumbnail = async(req:Request,res:Response)=>{
//     try {

//         const {id} = req.params        
//         const {userId} = req.session  
        
//         await Thumbnail.findByIdAndDelete({
//             _id:id,
//             userId
//         })

//         res.json({message:'Thumbnail Deleted Successfully'})
        
//     } catch (error:any) {
//         console.log(error);
//         res.status(500).json({message:error.message})
//     }
// }




import { Request, Response } from "express"
import Thumbnail from "../models/Thumbnail.js";
import { v2 as cloudinary } from 'cloudinary'

const stylePrompts = {
    'Bold & Graphic': 'eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style',
    'Tech/Futuristic': 'futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere',
    'Minimalist': 'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point',
    'Photorealistic': 'photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field',
    'Illustrated': 'illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style',
}

const colorSchemeDescriptions = {
    vibrant: 'vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette',
    sunset: 'warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow',
    forest: 'natural green tones, earthy colors, calm and organic palette, fresh atmosphere',
    neon: 'neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow',
    purple: 'purple-dominant color palette, magenta and violet tones, modern and stylish mood',
    monochrome: 'black and white color scheme, high contrast, dramatic lighting, timeless aesthetic',
    ocean: 'cool blue and teal tones, aquatic color palette, fresh and clean atmosphere',
    pastel: 'soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic',
}

export const generateThumbnail = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const { title, prompt: user_prompt, style, aspect_ratio, color_scheme, text_overlay } = req.body

        const thumbnail = await Thumbnail.create({
            userId,
            title,
            prompt_used: user_prompt,
            user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
            isGenerating: true
        })

        // Keep prompt short and clean for Pollinations
        const styleText = stylePrompts[style as keyof typeof stylePrompts] || 'professional thumbnail';
        const colorText = colorSchemeDescriptions[color_scheme as keyof typeof colorSchemeDescriptions] || '';
        const extraText = user_prompt ? `, ${user_prompt}` : '';

        const prompt = `YouTube thumbnail for "${title}", ${styleText}, ${colorText}${extraText}`;

        // ---- POLLINATIONS AI (Free, No API Key Needed) ----
        const encodedPrompt = encodeURIComponent(prompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${Date.now()}`;

        console.log('Fetching image from Pollinations...');

        // Fetch with retries
        let imageBuffer: Buffer | null = null;

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                console.log(`Attempt ${attempt}...`);
                const fetchRes = await fetch(imageUrl);
                const contentType = fetchRes.headers.get('content-type') || '';

                console.log(`Status: ${fetchRes.status}, Content-Type: ${contentType}`);

                if (fetchRes.ok && contentType.includes('image')) {
                    imageBuffer = Buffer.from(await fetchRes.arrayBuffer());
                    console.log(`Success on attempt ${attempt}, buffer size: ${imageBuffer.length}`);
                    break;
                } else {
                    console.log(`Attempt ${attempt} failed - not an image response`);
                }
            } catch (err) {
                console.log(`Attempt ${attempt} fetch error:`, err);
            }

            // Wait before retrying (3s, 6s)
            if (attempt < 3) {
                await new Promise(resolve => setTimeout(resolve, 3000 * attempt));
            }
        }

        if (!imageBuffer || imageBuffer.length === 0) {
            throw new Error('Image generation failed after 3 attempts. Please try again.');
        }
        // ---- END POLLINATIONS AI ----

        const uploadResult = await new Promise<{ url: string }>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'image', folder: 'thumblify' },
                (error, result) => {
                    if (error || !result?.url) {
                        return reject(error ?? new Error('Cloudinary upload failed'));
                    }
                    resolve({ url: result.url });
                }
            );
            uploadStream.end(imageBuffer);
        });

        thumbnail.image_url = uploadResult.url;
        thumbnail.isGenerating = false;
        await thumbnail.save();

        res.json({ message: 'Thumbnail Generated', thumbnail });

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

// Controller function to delete the existing thumbnail
export const deleteThumbnail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { userId } = req.session

        await Thumbnail.findByIdAndDelete({
            _id: id,
            userId
        })

        res.json({ message: 'Thumbnail Deleted Successfully' })

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}