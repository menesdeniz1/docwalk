// TEMPORARY diagnostic, never committed.
import { expect, test, type Page } from "@playwright/test";
import { ready, replaceSource } from "./helpers";

const TABLE = [
  "## Table",
  "",
  "| Region | Writes per second | p50 latency | p99 latency | Error budget | Owner |",
  "| --- | --- | --- | --- | --- | --- |",
  "| eu-west | 5,200 | 12 ms | 80 ms | 0.1% | storage |",
  "| us-east | 7,900 | 15 ms | 91 ms | 0.1% | storage |",
  "",
].join("\n");
const IMAGE = "## Image\n\n![Company logo](/icons/icon-192.png)\n";

async function openDoc(page: Page, markdown: string) {
  await ready(page);
  await replaceSource(page, markdown);
  await expect(page.locator(".docwalk-statusbar")).toContainText(/(?<!\d)1 slides?/);
}

for (const [name, markdown, selector] of [
  ["table", TABLE, "table"],
  ["image", IMAGE, "img"],
] as const) {
  for (const delay of [0, 50, 100, 150, 200, 250, 300, 400]) {
    test(`window ${name} ${delay}`, async ({ page }, info) => {
      await openDoc(page, markdown);
      // The spec's own steps, with the wire's round trips replaced by a chosen gap between
      // the Present click and the settle line.
      const out = await page.evaluate(
        async ({ delay, selector }) => {
          const cancels: string[] = [];
          document.addEventListener(
            "transitioncancel",
            (e) => {
              const ev = e as TransitionEvent;
              cancels.push(`${(ev.target as Element).className}${ev.pseudoElement}/${ev.propertyName}`);
            },
            true,
          );
          const t0 = performance.now();
          document.querySelector<HTMLElement>(".docwalk-present")!.click();
          while (document.querySelector(".docwalk-app")?.getAttribute("data-view") !== "present") {
            await new Promise((r) => setTimeout(r, 1));
          }
          await new Promise((r) => setTimeout(r, delay));
          document.querySelector<HTMLElement>(`.reveal .slides > section.present ${selector}`)!.click();
          while (!document.querySelector(".docwalk-focus")) await new Promise((r) => setTimeout(r, 1));
          const at = performance.now() - t0;
          const anims = document.getAnimations();
          const before = cancels.length;
          // The line that failed in CI, unchanged.
          const outcome = await Promise.all(document.getAnimations().map((a) => a.finished)).then(
            () => "ok",
            (e: Error) => `${e.name}: ${e.message}`,
          );
          await new Promise((r) => setTimeout(r, 500));
          const later = cancels.slice(before);
          const kinds = [...new Set(later)];
          return { at: Math.round(at), running: anims.length, outcome, cancelsAfter: later.length, kinds: kinds.slice(0, 4) };
        },
        { delay, selector },
      );
      console.log(`@@ ${info.project.name} ${name} gap=${delay} ${JSON.stringify(out)}`);
    });
  }
}
