// import { db } from "@/firebase";
// import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import TranscriptAPI from 'youtube-transcript-api';
// import youtube from "youtube-toolkit"
const youtube = require("youtube-toolkit")
import { HfInference } from "@huggingface/inference";
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
export async function OPTIONS(request) {
  return NextResponse.json({}, { headers: corsHeaders });
}
export async function POST(request) {
  try {
    const { url, message } = await request.json();
    console.log(url, message);
    console.log(url);
    


// const videodetails= await youtube.fetch(url).then(data=>{
//                           console.log(data)
//                             return JSON.stringify(data)
//                           }).catch(err=>{
//                             console.log(err)
//                           })


    const id=url.slice(32)
    console.log(id)

     const generatedText= await TranscriptAPI.getTranscript(id).then(async(res)=>{
          const videodetails= await youtube.fetch(url).then(async(data)=>{
            const videodata=JSON.stringify(data)
          // console.log(...res)
          const transcript=JSON.stringify(res)
          console.log(transcript)
          let prompt = `U ARE GIVEN A TASK TO READ A VIDEO TRANSCRIPT AND REPLY TO THE PROMPTS.  STOP REPLYING WITH ** AND --.  : \n Here is the video description${videodata} \n HERE IS THE VIDEO TRANSCRIPT WITH TIMESTAMPS ${transcript} \n BELOW IS THE PROMPT: \n ${message}`;
          // let prompt = `In detail, summarize this youtube video transcript ${transcript}`;
          // let prompt = `WHAT is the last timestamp and what does he talk about ${transcript}`;
          // console.log(prompt)

          const hf_api="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"

          let generatedText = "";

          //mistral
          // async function query(data) {
          //   const response = await fetch(
          //     "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-v0.3",
          //     {
          //       headers: {
          //         Authorization:"Bearer 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",
          //         "Content-Type": "application/json",
          //       },
          //       method: "POST",
          //       body: JSON.stringify(data),
          //     }
          //   );
          //   const result = await response.json();
          //   return result;
          // }
          
          // generatedText=await query({"inputs": prompt}).then((response) => {
          //   console.log(JSON.stringify(response));
          //   return  JSON.stringify(response)
          // });

            //llama
          // const inference = new HfInference(hf_api);
          // for await (const chunk of inference.chatCompletionStream({
          //   model: "meta-llama/Meta-Llama-3-8B-Instruct",
          //   messages: [{ role: "user", content: prompt}],
          //   // max_tokens: 500,
          // })) {
          //   generatedText+=chunk.choices[0]?.delta?.content || "";
          //   process.stdout.write(chunk.choices[0]?.delta?.content || "");
          // }

          //gemini
      const {
          GoogleGenerativeAI,
          HarmCategory,
          HarmBlockThreshold,
        } = require("@google/generative-ai");
        
        const apiKey = "AIzaSyClQEDtWrbJC6QikMksi7f4-C1RClESXGo";
        const genAI = new GoogleGenerativeAI(apiKey);
        
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash-001",
        });
        
        const generationConfig = {
          temperature: 1,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        };
          const chatSession = model.startChat({
            generationConfig,
         // safetySettings: Adjust safety settings
         // See https://ai.google.dev/gemini-api/docs/safety-settings
            history: [
            ],
          });
        
          const result = await chatSession.sendMessage(prompt);
          result.response.text()
      
          generatedText = result.response.text();
          console.log(generatedText)
          return generatedText
        })
        return videodetails
      }).catch((err)=>{
          console.log(err)
        })
        
        
        return Response.json({ generatedText}, { headers: corsHeaders });

  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}
