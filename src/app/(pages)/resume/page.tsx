import { ResumeUploader } from "@/components/resume-uploader";
import { Suspense } from "react";

function MyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResumeUploader />
    </Suspense>
  );
}

export default MyPage;
