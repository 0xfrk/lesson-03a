import { Button } from "frames.js/next";
import { frames } from "app/frames/frames";
import { appURL } from "app/utils";

const handleRequest = frames(async (ctx) => {
  // UserData の構造を定義するインターフェース
  interface UserData {
    fid: string;
    profileImageUrl: string;
  }

  // 変数を定義
  let userData: UserData | null = null; // userData を格納する変数
  let error: string | null = null;
  let isLoading = false;

  // ユーザーデータを取得する非同期関数
  const fetchUserData = async (fid: string) => {
    isLoading = true;
    try {
      const airstackUrl = `${appURL()}/api?userId=${encodeURIComponent(fid)}`;
      const airstackResponse = await fetch(airstackUrl);
      if (!airstackResponse.ok) {
        throw new Error(`Airstack HTTP error! status: ${airstackResponse.status}`);
      }
      const airstackData = await airstackResponse.json();
      // Airstack API からデータを取得できたかどうかをチェックする処理
      if (airstackData.userData.Socials.Social && airstackData.userData.Socials.Social.length > 0) {
        // Airstack API からデータを取得できた場合にデータを変数 social に格納
        const social = airstackData.userData.Socials.Social[0];
        // 変数 social の値を連想配列に格納
        userData = {
          fid: social.userId || "", // ユーザーIDを fid に格納
          profileImageUrl: social.profileImage || "", // プロフィール画像のURLを profileImageUrl 格納
        };
      } else {
        throw new Error("No user data found");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      error = (err as Error).message;
    } finally {
      isLoading = false;
    }
  };
  let fid: string | null = null;
  if (ctx.message?.requesterFid) {
    fid = ctx.message.requesterFid.toString();
    console.log("Using requester FID:", fid);
  } else {
    console.log("No ctx.url available");
  }
  console.log("Final FID used:", fid);

  // データを取得する必要があるかどうかを判断する処理
  const shouldFetchData = fid && (!userData || (userData as UserData).fid !== fid);
  // データを取得する必要がある場合は fid をもとに fetchUserData 関数でデータを取得
  if (shouldFetchData && fid) {
    await Promise.all([fetchUserData(fid)]);
  }

  // 変数 profileImageUrl を定義
  const profileImageUrl = userData ? (userData as UserData).profileImageUrl : `${appURL()}/unavailable.png`;

  return {
    image: profileImageUrl,
    imageOptions: {
      aspectRatio: "1:1", // 画像のアスペクト比を1:1に設定
    },
    buttons: [
      <Button action="post" target="/">
        Reset
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
