// app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createJobSchema } from "@/app/hooks/jobs/useCreateJob";
import { addNewJob, getJobs } from "@/database/queries/jobs";
import { getToken } from "next-auth/jwt";
import { AuthUser } from "@/types/user";
import { HttpStatusCode } from "axios";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  try {
    const allJobs = await getJobs();

    return NextResponse.json(allJobs, { status: 200 });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    if (!user?.id || user.role !== "recruiter") {
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
    const validatedData = createJobSchema.parse(body);

    const newJob = await addNewJob(validatedData, user.id);

    return NextResponse.json(newJob, { status: 201 });
  } catch (error: any) {
    console.error("Error creating job:", error);

    // Handle validation errors specifically
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
