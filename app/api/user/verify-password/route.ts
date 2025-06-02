import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { verifyUserPassword } from "@/lib/actions/user";

export async function POST(req: NextRequest) {
  try {
    // Step 1: Authenticate the user
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Step 2: Extract password from request body
    const { password } = await req.json();

    if (typeof password !== "string" || password.trim().length === 0) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Step 3: Verify the password
    const isValid = await verifyUserPassword(Number(userId), password);

    // Step 4: Respond with appropriate status
    if (isValid) {
      return NextResponse.json({ valid: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { valid: false, error: "Invalid password" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Password verification failed:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
