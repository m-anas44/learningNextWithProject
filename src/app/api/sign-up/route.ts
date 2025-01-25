import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();

  try {
  } catch (error) {
    // const {username, email, verifyCode}= request.json()
    console.error("Error in registering the user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering the user",
      },
      { status: 500 }
    );
  }
}
