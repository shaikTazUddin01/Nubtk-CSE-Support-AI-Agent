import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  File,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const WEBHOOK_URL =
  "https://tazuddin.app.n8n.cloud/webhook-test/48e20d47-b63c-412a-a173-057df68206dc";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setMessage("");

    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, DOCX, XLS, and XLSX files are allowed.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const getFileIcon = () => {
    if (!selectedFile) return <File className="h-6 w-6" />;

    if (selectedFile.type.includes("pdf")) {
      return <FileText className="h-6 w-6 text-red-500" />;
    }

    if (
      selectedFile.type.includes("sheet") ||
      selectedFile.type.includes("excel")
    ) {
      return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
    }

    return <FileText className="h-6 w-6 text-blue-500" />;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!title.trim()) {
      setError("Please enter a document title.");
      return;
    }

    if (!category.trim()) {
      setError("Please select a category.");
      return;
    }

    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("category", category);
      formData.append("file", selectedFile, selectedFile.name);

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      const result = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new Error(
          typeof result === "string"
            ? result || "Upload failed"
            : result?.message || "Upload failed"
        );
      }

      setMessage("File sent successfully to n8n webhook.");
      setSelectedFile(null);
      setTitle("");
      setCategory("");

      const fileInput = document.getElementById(
        "knowledge-file"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while uploading."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border/50 bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload academic files for the CSE student support AI agent.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Upload Knowledge File</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                PDF, DOCX, and Excel files will be sent to n8n, then uploaded to
                Google Drive.
              </p>
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="Example: CSE Course Outline"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                >
                  <option value="">Select category</option>
                  <option value="routine">Class Routine</option>
                  <option value="notice">Notice</option>
                  <option value="syllabus">Syllabus</option>
                  <option value="course-material">Course Material</option>
                  <option value="exam-info">Exam Information</option>
                  <option value="department-info">Department Information</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Upload File
                </label>

                <label
                  htmlFor="knowledge-file"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/30 px-6 py-10 text-center transition hover:bg-secondary/50"
                >
                  <UploadCloud className="mb-3 h-10 w-10 text-muted-foreground" />

                  <p className="text-sm font-medium">
                    Click to upload your file
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Supported: PDF, DOCX, XLS, XLSX
                  </p>

                  <input
                    id="knowledge-file"
                    name="file"
                    type="file"
                    accept=".pdf,.docx,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {selectedFile && (
                <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                    {getFileIcon()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}

              {message && (
                <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  {message}
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" />
                    Send to AI Agent
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold">n8n Settings</h3>

            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-secondary/40 p-4">
                <p className="text-sm font-medium">Webhook Binary Field</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Field Name for Binary Data must be{" "}
                  <span className="font-semibold text-foreground">file</span>.
                </p>
              </div>

              <div className="rounded-xl bg-secondary/40 p-4">
                <p className="text-sm font-medium">Google Drive Field</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Input Data Field Name must be{" "}
                  <span className="font-semibold text-foreground">file</span>.
                </p>
              </div>

              <div className="rounded-xl bg-secondary/40 p-4">
                <p className="text-sm font-medium">Test Mode</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Keep n8n “Listen for test event” active while using this test
                  webhook URL.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold">Allowed Files</h3>

            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>✅ PDF documents</li>
              <li>✅ Word DOCX files</li>
              <li>✅ Excel XLS/XLSX files</li>
              <li>❌ Images, videos, ZIP files</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default AdminDashboard;