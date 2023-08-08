import BackendAxios from "@/utils/axios";
import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

export default async function handler({ id }) {
    let filePath = ''
    BackendAxios.get(`/api/campaign/${id}`)
      .then((res) => {
        if (!res.data[0]?.status) {
          return;
        }
        filePath = res.data[0]?.file_path
      })
      .catch((err) => {
        console.log(err);
      });

  return new ImageResponse(
    (
        <img
          alt="Virolife"
          src={
            filePath
              ? `https://api.virolife.in/${filePath}`
              : "https://idea.batumi.ge/files/default.jpg"
          }
          style={{
            width: 1200,
            height: 630
          }}
        />
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
