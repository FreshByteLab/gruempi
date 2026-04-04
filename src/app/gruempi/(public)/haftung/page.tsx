import type { Metadata } from "next";
import { prisma } from "@/lib/gruempi/db";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Haftungsausschluss" };

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactElement[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++} className="text-2xl font-bold text-gray-900 mt-8 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={key++} className="text-lg font-semibold text-gray-900 mt-6 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith("- ")) {
      elements.push(<li key={key++} className="text-gray-700 leading-relaxed ml-4">{line.slice(2)}</li>);
    } else if (line.trim() === "") {
      elements.push(<div key={key++} className="h-2" />);
    } else {
      elements.push(<p key={key++} className="text-gray-700 leading-relaxed">{line}</p>);
    }
  }

  return elements;
}

export default async function HaftungPage() {
  const page = await prisma.legalPage.findUnique({ where: { slug: "haftung" } });
  if (!page) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{page.title}</h1>
      <p className="text-sm text-gray-400 mb-8">
        Zuletzt aktualisiert:{" "}
        {new Intl.DateTimeFormat("de-CH", { day: "numeric", month: "long", year: "numeric" }).format(
          new Date(page.updatedAt)
        )}
      </p>
      <div className="prose-like">{renderMarkdown(page.content)}</div>
    </div>
  );
}
