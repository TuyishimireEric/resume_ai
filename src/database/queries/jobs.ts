import { db } from "@/database/db";
import { jobs, users } from "../schema";
import { JobI } from "@/types/job";

export const getJobs = async () => {
  try {
    return await db.select().from(jobs).execute();
  } catch (error) {
    console.error("Error getting jobs:", error);
    throw error;
  }
};

export const addNewJob = async (newJob: JobI, user_id: string) => {
  try {
    const job = await db
      .insert(jobs)
      .values({
        title: newJob.title,
        description: newJob.description,
        required_staff: newJob.required_staff,
        requirements: newJob.requirements,
        location: newJob.location,
        open_date: newJob.open_date,
        close_date: newJob.close_date,
        created_by: user_id,
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
