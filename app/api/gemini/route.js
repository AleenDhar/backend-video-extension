// import { db } from "@/firebase";
// import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

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
    const { transcript, message } = await request.json();
 
    // console.log(prompt)
    let prompt = `U ARE GIVEN A TASK TO READ A VIDEO TRANSCRIPT AND REPLY TO THE PROMPTS.  STOP REPLYING WITH ** AND --.  : \n HERE IS THE VIDEO TRANSCRIPT WITH TIMESTAMPS OF THE FORMAT Hours:mins:seconds ${transcript} \n BELOW IS THE PROMPT: \n ${message}`;
    // let prompt = `In detail, summarize this youtube video transcript ${transcript}`;
    // let prompt = `WHAT is the last timestamp and what does he talk about ${transcript}`;
    // console.log(prompt)

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

    const generatedText = result.response.text();
    console.log(generatedText)
    return Response.json({ generatedText}, { headers: corsHeaders });

  } catch (error) {
    console.log(error);
    return Response.json(error);
  }
}
