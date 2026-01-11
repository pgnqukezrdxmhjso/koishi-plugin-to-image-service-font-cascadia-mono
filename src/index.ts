import { Context, Schema, Service } from "koishi";
import fs from "node:fs/promises";
import path from "node:path";
import { Font, FontWeight, FontStyle } from "koishi-plugin-to-image-service";

const serviceName = "toImageServiceFontCascadiaMono";

class ToImageServiceFontCascadiaMono extends Service {
  private _ctx: Context;
  constructor(ctx: Context, config: ToImageServiceFontCascadiaMono.Config) {
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
          supports: ["satori"],
        });
      }
    }
    this._ctx.toImageService.addFont(fonts);
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

namespace ToImageServiceFontCascadiaMono {
  export const inject = ["toImageService"];

  export const usage =
    '<a target="_blank" href="https://github.com/microsoft/cascadia-code">cascadia-code</a>';
  export interface Config {}
  export const Config: Schema<Config> = Schema.object({});
}
export default ToImageServiceFontCascadiaMono;
