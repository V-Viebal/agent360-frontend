import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";

export interface FaqItemSchema {
  q: string;
  a: string;
}

export interface BreadcrumbItemSchema {
  name: string;
  url: string;
}

export interface SeoHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogType?: "website" | "article" | "product";
  faqs?: FaqItemSchema[];
  breadcrumbs?: BreadcrumbItemSchema[];
  howToSteps?: { name: string; text: string }[];
  softwareSpec?: {
    name: string;
    category: string;
    role: string;
    tools: string[];
  };
  /**
   * GEO / AEO Executive Summary: Concise, fact-dense summary & key claims
   * rendered for Answer Engines, AI Crawlers, and Screen Readers.
   */
  aeoSummary?: {
    question: string;
    directAnswer: string;
    keyFacts: string[];
  };
}

const BASE_URL = "https://agent360.antares.vn";

function setMetaTag(attrName: "name" | "property", attrValue: string, content: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLinkTag(rel: string, href: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function SeoHead({
  title,
  description,
  keywords,
  canonicalPath,
  ogType = "website",
  faqs,
  breadcrumbs,
  howToSteps,
  softwareSpec,
  aeoSummary,
}: SeoHeadProps) {
  const location = useLocation();
  const { language } = useTranslation();
  const path = canonicalPath || location.pathname;
  const fullUrl = `${BASE_URL}${path === "/" ? "/" : path}`;

  useEffect(() => {
    document.title = title;
    setMetaTag("name", "title", title);
    setMetaTag("name", "description", description);
    if (keywords) {
      setMetaTag("name", "keywords", keywords);
    }

    // OpenGraph & Twitter
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", fullUrl);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:locale", language === "vi" ? "vi_VN" : "en_US");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:url", fullUrl);

    // Canonical
    setLinkTag("canonical", fullUrl);

    // Build Rich JSON-LD Graph for SEO, AEO (Answer Engines), and GEO (Generative AI Citations)
    const graph: Record<string, unknown>[] = [
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "Skyer AI",
        url: `${BASE_URL}/`,
        logo: `${BASE_URL}/logo.svg`,
        description:
          "Skyer is an Autonomous AI Workforce platform built on the AgentCore Kernel, providing AI teammates with dedicated Linux containers, headless Chromium browsers, MCP tool drivers, and ReMe persistent memory.",
      },
      {
        "@type": "WebPage",
        "@id": `${fullUrl}#webpage`,
        url: fullUrl,
        name: title,
        description: description,
        inLanguage: language === "vi" ? "vi-VN" : "en-US",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${BASE_URL}/#organization` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-aeo-answer]"],
        },
      },
    ];

    if (breadcrumbs && breadcrumbs.length > 0) {
      graph.push({
        "@type": "BreadcrumbList",
        "@id": `${fullUrl}#breadcrumb`,
        itemListElement: breadcrumbs.map((b, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: b.name,
          item: b.url.startsWith("http") ? b.url : `${BASE_URL}${b.url}`,
        })),
      });
    }

    if (faqs && faqs.length > 0) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${fullUrl}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      });
    }

    if (howToSteps && howToSteps.length > 0) {
      graph.push({
        "@type": "HowTo",
        "@id": `${fullUrl}#howto`,
        name: title,
        description: description,
        step: howToSteps.map((s, idx) => ({
          "@type": "HowToStep",
          position: idx + 1,
          name: s.name,
          text: s.text,
        })),
      });
    }

    if (softwareSpec) {
      graph.push({
        "@type": "SoftwareApplication",
        "@id": `${fullUrl}#agent`,
        name: softwareSpec.name,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: softwareSpec.category,
        operatingSystem: "AgentCore Linux Container, Web, Docker, Kubernetes",
        description: description,
        featureList: softwareSpec.tools,
      });
    }

    const scriptId = "skyer-dynamic-jsonld";
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.id = scriptId;
      scriptEl.type = "application/ld+json";
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    });
  }, [title, description, keywords, fullUrl, ogType, language, faqs, breadcrumbs, howToSteps, softwareSpec]);

  if (!aeoSummary) return null;

  // Render semantic AEO / GEO microdata capsule (accessible to crawlers, LLMs, and assistive tech without cluttering UI)
  return (
    <aside
      aria-label="Executive Summary & Key Specifications"
      data-aeo-answer="true"
      className="sr-only"
      itemScope
      itemType="https://schema.org/Question"
    >
      <h2 itemProp="name">{aeoSummary.question}</h2>
      <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
        <p itemProp="text">{aeoSummary.directAnswer}</p>
        <ul>
          {aeoSummary.keyFacts.map((fact, idx) => (
            <li key={idx}>{fact}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
