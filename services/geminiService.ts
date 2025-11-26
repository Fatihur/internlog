import { GoogleGenAI, Type } from "@google/genai";
import { ReportResult } from "../types";

// Deklarasi agar TypeScript tidak error saat mengakses process
declare const process: any;

// Mengambil API Key dengan aman (fallback ke undefined jika process tidak ada)
// Ini mencegah "White Screen of Death" jika env variables belum terload sempurna
const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;

// Initialize Gemini client only if API key is present
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateInternReport = async (keywords: string): Promise<ReportResult> => {
  if (!ai) {
    throw new Error("API Key tidak ditemukan. Pastikan Environment Variable 'API_KEY' sudah diset di Vercel.");
  }

  const modelId = "gemini-2.5-flash"; // Optimized for speed and text generation

  const systemInstruction = `
    Anda adalah asisten profesional untuk mahasiswa magang. Tugas anda adalah membantu mereka menulis laporan harian magang (Logbook).
    
    Pengguna akan memberikan "Kata Kunci" atau deskripsi singkat tentang apa yang mereka lakukan hari ini.
    Anda harus menguraikan kata kunci tersebut menjadi 3 bagian laporan yang formal, detail, dan profesional dalam Bahasa Indonesia.
    
    Persyaratan Output:
    1. **Uraian Aktivitas**: Jelaskan langkah-langkah teknis atau proses yang dilakukan berdasarkan kata kunci. Gunakan bahasa kerja aktif.
    2. **Ilmu/Pembelajaran**: Jelaskan konsep teori, soft skill, atau hard skill yang didapat dari aktivitas tersebut.
    3. **Kendala/Hambatan**: Sebutkan potensi tantangan yang umum terjadi pada aktivitas tersebut dan cara mengatasinya secara singkat.
    
    PENTING:
    - Setiap bagian (Uraian, Pembelajaran, Kendala) HARUS memiliki panjang MINIMAL 100 karakter.
    - Gunakan bahasa Indonesia yang baku dan enak dibaca (flow mengalir).
    - Hindari pengulangan kata yang membosankan.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Kata kunci aktivitas hari ini: "${keywords}"`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            activity: {
              type: Type.STRING,
              description: "Uraian detail aktivitas yang dilakukan, minimal 100 karakter.",
            },
            learning: {
              type: Type.STRING,
              description: "Pelajaran atau ilmu yang didapat, minimal 100 karakter.",
            },
            challenges: {
              type: Type.STRING,
              description: "Hambatan yang ditemui dan solusinya, minimal 100 karakter.",
            },
          },
          required: ["activity", "learning", "challenges"],
        },
      },
    });

    const resultText = response.text;
    
    if (!resultText) {
      throw new Error("Gagal menghasilkan teks dari model.");
    }

    const parsedResult = JSON.parse(resultText) as ReportResult;
    return parsedResult;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Terjadi kesalahan saat menghubungi AI.");
  }
};