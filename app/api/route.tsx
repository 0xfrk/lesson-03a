import { init, fetchQuery } from "@airstack/node";
import { type NextRequest, NextResponse } from "next/server";

const apiKey = process.env.AIRSTACK_API_KEY;
if (!apiKey) {
  throw new Error("AIRSTACK_API_KEY is not defined");
}
init(apiKey);

const userDataQuery = `
  query MyQuery($userId: String!) {
    Socials(input: {blockchain: ethereum, filter: {userId: {_eq: $userId}}}) {
      Social {
        userId
        profileImage
      }
    }
  }
`;

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  console.log("Requester userId:", userId);
  if (!userId) {
    console.log("Error: userId parameter is missing");
    return NextResponse.json({ error: "userId parameter is required" }, { status: 400 });
  }
  try {
    const [response] = await Promise.all([fetchQuery(userDataQuery, { userId })]);
    if (response.error) {
      console.error("Airstack API Error (User Data):", response.error);
      return NextResponse.json({ error: response.error.message }, { status: 500 });
    }
    console.log("userData: %o", response.data);
    return NextResponse.json({
      userData: response.data,
    });
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
