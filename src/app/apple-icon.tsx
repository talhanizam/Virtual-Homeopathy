import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const url = new URL("/logo.png", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  const res = await fetch(url.toString());
  const arrayBuffer = await res.arrayBuffer();
  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url.toString()} width={size.width} height={size.height} alt="apple icon" />
    ),
    { width: size.width, height: size.height }
  );
}


