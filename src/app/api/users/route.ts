// app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { AuthUser } from "@/types/user";
import { HttpStatusCode } from "axios";
import { getUserList, updateUserRole } from "@/database/queries";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const cookieName =
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token";

    const user = (await getToken({
      req,
      secret: JWT_SECRET,
      cookieName,
    })) as AuthUser | null;

    if (!user?.id || user.role !== "admin") {
      return NextResponse.json(
        {
          status: "Error",
          data: null,
          message: "Unauthorized",
        },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    const allUsers = await getUserList();

    return NextResponse.json(allUsers, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieName =
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token";

    const user = (await getToken({
      req,
      secret: JWT_SECRET,
      cookieName,
    })) as AuthUser | null;

    if (!user?.id || user.role !== "admin") {
      return NextResponse.json(
        {
          status: "Error",
          data: null,
          message: "Unauthorized",
        },
        { status: HttpStatusCode.Unauthorized }
      );
    }

    const body = await req.json();
    const { userId, newRole } = body;

    const updated = await updateUserRole(userId, newRole);

    return NextResponse.json(
      { status: "Success", data: null, message: "Password updated" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating password:", error);

    return NextResponse.json(
      {
        status: "Error",
        data: null,
        message: "Failed to update password",
      },
      { status: 500 }
    );
  }
}
