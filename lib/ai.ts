interface AnalyzeResult {
  title: string;
  description: string;
  tags: string[];
  model: string;
  generatedAt: string;
}

const FALLBACK: AnalyzeResult = {
  title: "未命名作品",
  description: "这是一件具有独特视觉语言的艺术作品，待艺术家补充创作说明。",
  tags: ["艺术", "创作"],
  model: "fallback",
  generatedAt: new Date().toISOString(),
};

export async function analyzeWorkImage(imageUrl: string): Promise<AnalyzeResult> {
  const apiKey = process.env.LLM_API_KEY;
  const base = process.env.LLM_API_BASE || "https://api.deepseek.com";
  const model = process.env.LLM_MODEL || "deepseek-chat";

  if (!apiKey) {
    return {
      ...FALLBACK,
      title: "静安里 · 光影序曲",
      description:
        "以城市街巷与光影为母题的创作，强调东方当代美学与叙事性，适用于展览主视觉与品牌联名场景。",
      tags: ["插画", "城市", "当代"],
      model: "mock",
    };
  }

  try {
    const res = await fetch(`${base}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "你是艺术策展助手。根据作品信息生成 JSON：{title, description, tags}。description 80-120字，tags 3-5个中文标签。只返回 JSON。",
          },
          {
            role: "user",
            content: `作品图片地址：${imageUrl}。请生成适合艺术家档案页的标题、简介与标签。`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!res.ok) throw new Error("LLM request failed");
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content) as {
      title?: string;
      description?: string;
      tags?: string[];
    };

    return {
      title: parsed.title || FALLBACK.title,
      description: parsed.description || FALLBACK.description,
      tags: parsed.tags?.slice(0, 5) || FALLBACK.tags,
      model,
      generatedAt: new Date().toISOString(),
    };
  } catch {
    return { ...FALLBACK, model: "fallback" };
  }
}

export async function draftNarrative(input: {
  artistName: string;
  medium?: string;
  keywords?: string[];
}) {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    return `我是${input.artistName}，专注于${input.medium || "当代艺术"}创作。${(input.keywords || []).join("、")}是我持续探索的方向，希望通过档案记录创作脉络与支持者建立长期连接。`;
  }

  try {
    const base = process.env.LLM_API_BASE || "https://api.deepseek.com";
    const model = process.env.LLM_MODEL || "deepseek-chat";
    const res = await fetch(`${base}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "为艺术家写一段 120 字以内的个人陈述，面向大众，非学院腔。",
          },
          {
            role: "user",
            content: JSON.stringify(input),
          },
        ],
      }),
    });
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content?.trim() || "";
  } catch {
    return "";
  }
}
