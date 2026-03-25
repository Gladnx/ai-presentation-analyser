import mammoth from "mammoth";
import { NextResponse } from "next/server";
import WordExtractor from "word-extractor";

export const runtime = "nodejs";

const SUPPORTED_FILE_TYPES = new Set([".pdf", ".doc", ".docx"]);

function getFileExtension(filename: string) {
  const parts = filename.toLowerCase().split(".");
  if (parts.length < 2) return "";
  return `.${parts.at(-1)}`;
}

function normaliseExtractedText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function extractPdfText(fileBuffer: Uint8Array) {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = getDocument({
    data: fileBuffer,
    useWorkerFetch: false,
    isEvalSupported: false,
  });

  try {
    const pdf = await loadingTask.promise;
    const pages: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = (textContent.items as Array<{ str?: string }>)
        .map((item) => item.str?.trim() ?? "")
        .filter(Boolean)
        .join(" ");

      if (pageText) {
        pages.push(pageText);
      }
    }

    return pages.join("\n\n");
  } finally {
    await loadingTask.destroy();
  }
}

async function extractWordText(
  extension: ".doc" | ".docx",
  fileBuffer: Buffer
) {
  if (extension === ".docx") {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  }

  const extractor = new WordExtractor();
  const document = await extractor.extract(fileBuffer);
  return document.getBody();
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a PDF or Word document." },
        { status: 400 }
      );
    }

    const extension = getFileExtension(file.name);

    if (!SUPPORTED_FILE_TYPES.has(extension)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use .pdf, .doc, or .docx." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const extractedText =
      extension === ".pdf"
        ? await extractPdfText(new Uint8Array(arrayBuffer))
        : await extractWordText(extension as ".doc" | ".docx", buffer);

    const script = normaliseExtractedText(extractedText);

    if (!script) {
      return NextResponse.json(
        { error: "No readable text was found in that file." },
        { status: 400 }
      );
    }

    return NextResponse.json({ script });
  } catch (error) {
    console.error("Script extraction error:", error);
    return NextResponse.json(
      { error: "Failed to read that file. Try another document." },
      { status: 500 }
    );
  }
}
