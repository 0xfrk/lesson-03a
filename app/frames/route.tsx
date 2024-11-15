import { Button } from "frames.js/next";
import { frames } from "app/frames/frames";
import { appURL } from "app/utils";

const handleRequest = frames(async (ctx) => {
  return {
    image: `${appURL()}/who-are-you.png`,
    imageOptions: {
      aspectRatio: "1:1",
    },
    buttons: [
      <Button action="post" key="reveal" target="/reveal">
        Reveal
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
