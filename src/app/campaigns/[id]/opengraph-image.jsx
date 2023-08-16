import BackendAxios from "@/utils/axios";
import { ImageResponse } from "next/server";

export const runtime = "edge";

export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }) {
  const post = await BackendAxios.get(`/api/campaign/${params.id}`).then(
    (res) => res.data
  );

  return new ImageResponse(
    (
      <div
        style={{
          backgroundImage: URL(
            post?.file_path
              ? `https://api.virolife.in/${post?.file_path}`
              : "https://idea.batumi.ge/files/default.jpg"
          ),
          backgroundSize: 'cover',
          backgroundRepeat: "no-repeat",
          width:"1200px",
          height:"630px"
        }}
      ></div>
    ),
    {
      ...size,
    }
  );
}
