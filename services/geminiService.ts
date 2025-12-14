import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAssistantResponse = async (
  prompt: string,
  context: string = ""
): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    const fullPrompt = `
      Context:
      ${context}

      User Question:
      ${prompt}

      System Instruction:
      你是一个专业的软件研发团队助手。
      请根据上下文回答用户问题。如果涉及技术问题，请给出专业建议。
      请始终使用**中文**回答，并使用 Markdown 格式优化排版。
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
    });

    return response.text || "抱歉，我无法生成回复。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "与 AI 助手通信时发生错误。";
  }
};

export const summarizeRequirement = async (reqDescription: string): Promise<string> => {
  try {
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `请将以下软件需求总结为一句话，并给出 3 个建议的测试用例（请用中文回答）：\n\n${reqDescription}`
      });
      return response.text || "无法生成总结。";
  } catch (error) {
      console.error("Gemini Summarize Error", error);
      return "总结时发生错误。";
  }
}
