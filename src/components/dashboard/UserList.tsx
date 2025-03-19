import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download, ChevronDown, Check, Users } from "lucide-react";
import * as XLSX from "xlsx";
import { useUpdateRole } from "@/app/hooks/user/useUpdateRole";

export interface UserDataI {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface UserListViewProps {
  users: UserDataI[];
  onBack?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function UserListView({
  users,
  onBack,
  isLoading = false,
  error = null,
}: UserListViewProps) {
  const [changedUsers, setChangedUsers] = useState<Record<string, string>>({});
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  const availableRoles = ["admin", "recruiter", "user"];

  // Function to handle role change
  const handleRoleChange = (userId: string, newRole: string) => {
    setChangedUsers((prev) => ({
      ...prev,
      [userId]: newRole,
    }));
  };

  const { mutate: updateRole, isError, isSuccess } = useUpdateRole();

  const onUpdateRole = async (userId: string, newRole: string) => {
    if (isLoading) return;

    try {
      setSavingUserId(userId);
      await updateRole({ userId, newRole });
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setSavingUserId(null);
    }
  };

  // Function to save role change
  const handleSaveRole = async (userId: string) => {
    if (!onUpdateRole || !changedUsers[userId]) return;

    try {
      setSavingUserId(userId);
      await onUpdateRole(userId, changedUsers[userId]);

      // Remove from changed users after successful update
      setChangedUsers((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setSavingUserId(null);
    }
  };

  // Function to export users to Excel
  const exportToExcel = () => {
    if (!users.length) return;

    // Prepare data for export
    const exportData = users.map((user) => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Created: user.created_at,
      Updated: user.updated_at,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Generate Excel file and trigger download
    const fileName = `Users_List_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400">Loading users...</p>
      </div>
    );
  }

  // Error message component
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 text-red-500 dark:text-red-400 mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
          Error Loading Users
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
          {error}
        </p>
        {onBack && (
          <Button
            onClick={onBack}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"
          >
            Go Back
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5"
          >
            ← Back
          </Button>
        )}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              User Management
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              {users.length} users found
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white border-0 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              onClick={exportToExcel}
              disabled={users.length === 0}
            >
              <Download className="mr-2 h-4 w-4" /> Export Users
            </Button>
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <Card className="border border-slate-200 dark:border-0 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 shadow-lg dark:shadow-2xl overflow-hidden">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
              No Users Found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
              There are no users in the system yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-slate-200 dark:border-0 shadow-lg dark:shadow-2xl bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-white/50 dark:bg-transparent dark:bg-gradient-to-br dark:from-indigo-600/5 dark:to-violet-600/5"></div>
          <CardContent className="p-0 relative">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10">
                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                      User
                    </th>
                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                      Role
                    </th>

                    <th className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 flex items-center justify-center text-white font-semibold">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              user.name?.charAt(0) || "U"
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-slate-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <select
                            value={changedUsers[user.id] || user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md py-2 pl-3 pr-10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            {availableRoles.map((role) => (
                              <option key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          {changedUsers[user.id] && (
                            <Button
                              size="sm"
                              onClick={() => handleSaveRole(user.id)}
                              disabled={savingUserId === user.id}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                              {savingUserId === user.id ? (
                                <div className="h-4 w-4 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mr-1"></div>
                              ) : (
                                <Check className="h-4 w-4 mr-1" />
                              )}
                              Save
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
