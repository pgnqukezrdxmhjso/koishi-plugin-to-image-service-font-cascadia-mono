import { Context, Schema, Service } from "koishi";
import type { Font, FontWeight, FontStyle } from "satori";
import fs from "node:fs/promises";
import path from "node:path";
// noinspection ES6UnusedImports
import {} from "koishi-plugin-vercel-satori-png-service";

const serviceName = "vercelSatoriPngServiceFontCascadiaMono";

class VercelSatoriPngServiceFontCascadiaMono extends Service {
  private _ctx: Context;
  constructor(
    ctx: Context,
    config: VercelSatoriPngServiceFontCascadiaMono.Config,
  ) {
    super(ctx, serviceName);
    this._ctx = ctx;
  }

  protected async start(): Promise<void> {
    await this.initFonts();
  }
  private async initFonts() {
    const fonts: Font[] = [];
    for (let i = 0; i < this.fontNames.length; i++) {
      const fontName = this.fontNames[i];
      for (let j = 0; j < 2; j++) {
        fonts.push({
          name: "Cascadia Mono",
          weight: ((i + 2) * 100) as FontWeight,
          style: ["normal", "italic"][j] as FontStyle,
          data: await fs.readFile(
            path.join(
              __dirname,
              `../fonts/CascadiaMono-${j === 0 || fontName !== "Regular" ? fontName : ""}${["", "Italic"][j]}.ttf`,
            ),
          ),
        });
      }
    }
    this._ctx.vercelSatoriPngService.addFont(fonts);
  }

  private fontNames: string[] = [
    "ExtraLight",
    "Light",
    "SemiLight",
    "Regular",
    "SemiBold",
    "Bold",
  ];
}

namespace VercelSatoriPngServiceFontCascadiaMono {
  export const inject = ["vercelSatoriPngService"];

  export const usage =
    '<a target="_blank" href="https://github.com/microsoft/cascadia-code">cascadia-code</a>';
  export interface Config {}
  export const Config: Schema<Config> = Schema.object({});
}
export default VercelSatoriPngServiceFontCascadiaMono;
