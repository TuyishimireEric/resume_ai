import {
    X,
    Check,
    List,
    Plus,
  } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { Label } from "@/components/ui/label";
  import { useCreateJobMutation } from "@/app/hooks/jobs/useCreateJob";
  import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface AddJobProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export const AddJob = ({ isModalOpen, setIsModalOpen }: AddJobProps) => {

  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    description: "",
    requirements: [""],
    required_staff: 1,
    open_date: new Date().toISOString().split("T")[0],
    close_date: "",
  });

  // Create job mutation
  const createJobMutation = useCreateJobMutation();

  const handleAddNewJob = async () => {
    try {
      await createJobMutation.mutateAsync({
        title: newJob.title,
        description: newJob.description,
        required_staff: newJob.required_staff.toString(),
        requirements: JSON.stringify(newJob.requirements),
        location: newJob.location,
        open_date: newJob.open_date,
        close_date: newJob.close_date,
      });

      setIsModalOpen(false);
      setNewJob({
        title: "",
        location: "",
        description: "",
        requirements: [""],
        required_staff: 1,
        open_date: new Date().toISOString().split("T")[0],
        close_date: "",
      });

      toast({
        title: "Success",
        description: "Job posting created successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create job posting. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating job:", error);
    }
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...newJob.requirements];
    updatedRequirements[index] = value;
    setNewJob({ ...newJob, requirements: updatedRequirements });
  };

  const addRequirement = () => {
    setNewJob({
      ...newJob,
      requirements: [...newJob.requirements, ""],
    });
  };

  const removeRequirement = (index: number) => {
    const updatedRequirements = [...newJob.requirements];
    updatedRequirements.splice(index, 1);
    setNewJob({ ...newJob, requirements: updatedRequirements });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-0 shadow-xl dark:shadow-2xl max-w-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-violet-600/5 rounded-lg pointer-events-none"></div>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Create New Job Posting
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label
                htmlFor="title"
                className="text-gray-700 dark:text-slate-300"
              >
                Job Title
              </Label>
              <Input
                id="title"
                value={newJob.title}
                onChange={(e) =>
                  setNewJob({ ...newJob, title: e.target.value })
                }
                className="bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
                placeholder="e.g. Senior Developer"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-gray-700 dark:text-slate-300"
              >
                Location
              </Label>
              <Input
                id="location"
                value={newJob.location}
                onChange={(e) =>
                  setNewJob({ ...newJob, location: e.target.value })
                }
                className="bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
                placeholder="e.g. Remote, New York, NY"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="required_staff"
                className="text-gray-700 dark:text-slate-300"
              >
                Required Staff
              </Label>
              <Input
                id="required_staff"
                type="number"
                min="1"
                value={newJob.required_staff}
                onChange={(e) =>
                  setNewJob({
                    ...newJob,
                    required_staff: parseInt(e.target.value) || 1,
                  })
                }
                className="bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="open_date"
                className="text-gray-700 dark:text-slate-300"
              >
                Post Date
              </Label>
              <Input
                id="open_date"
                type="date"
                className="bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
                value={newJob.open_date}
                onChange={(e) =>
                  setNewJob({ ...newJob, open_date: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="close_date"
                className="text-gray-700 dark:text-slate-300"
              >
                Deadline
              </Label>
              <Input
                id="close_date"
                type="date"
                value={newJob.close_date}
                onChange={(e) =>
                  setNewJob({ ...newJob, close_date: e.target.value })
                }
                className="bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-gray-700 dark:text-slate-300"
            >
              Job Description
            </Label>
            <Textarea
              id="description"
              value={newJob.description}
              onChange={(e) =>
                setNewJob({ ...newJob, description: e.target.value })
              }
              className="bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white min-h-24"
              placeholder="Describe the role and responsibilities..."
            />
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700 dark:text-slate-300 flex items-center">
              <List className="h-4 w-4 mr-2" />
              Key Requirements
            </Label>

            {newJob.requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={req}
                  onChange={(e) =>
                    handleRequirementChange(index, e.target.value)
                  }
                  className="bg-white dark:bg-slate-800/60 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
                  placeholder="e.g. 3+ years of experience"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeRequirement(index)}
                  className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-900/30"
                  disabled={newJob.requirements.length === 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              onClick={addRequirement}
              className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Requirement
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            className="bg-white hover:bg-gray-100 dark:bg-transparent dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddNewJob}
            className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white border-0"
            disabled={
              createJobMutation.isPending ||
              !newJob.title ||
              !newJob.location
            }
          >
            {createJobMutation.isPending ? (
              "Creating..."
            ) : (
              <>
                <Check className="h-4 w-4 mr-1" /> Create Job Posting
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
