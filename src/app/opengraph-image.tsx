import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "GoodBiz: electrical equipment sourced for your grid";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg("Electrical equipment sourced for your grid");
}
