import { db } from "@/database/db";
import { ApplicationI } from "@/types/applications";
import { applications } from "../schema";

export const getApplications = async () => {
  try {
    return await db.select().from(applications).execute();
  } catch (error) {
    console.error("Error getting jobs:", error);
    throw error;
  }
};

export const addNewApplication = async (newApplication: ApplicationI) => {
  try {
    const job = await db
      .insert(applications)
      .values({
        user_name: newApplication.user_name,
        user_email: newApplication.user_email,
        job_id: newApplication.job_id,
        status: newApplication.status,
        match_score: newApplication.match_score,
        resume_url: newApplication.resume_url,
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString(), 
      })
      .returning();

    return job[0];
  } catch (error) {
    console.error("Error adding new job:", error);
    throw error;
  }
};
