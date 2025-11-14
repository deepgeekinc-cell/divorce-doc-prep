import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { FileText, Upload, Download, Loader2, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Documents() {
  const { isAuthenticated, loading } = useAuth();
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const utils = trpc.useUtils();

  const { data: documentTypes } = trpc.documents.types.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: documents } = trpc.documents.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const uploadDocument = trpc.documents.upload.useMutation({
    onSuccess: () => {
      toast.success("Document uploaded successfully!");
      setFile(null);
      setSelectedDocumentType("");
      utils.documents.list.invalidate();
      utils.checklist.progress.invalidate();
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const deleteDocument = trpc.documents.delete.useMutation({
    onSuccess: () => {
      toast.success("Document deleted successfully!");
      utils.documents.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });

  const generatePDF = trpc.pdf.generate.useMutation({
    onSuccess: (data) => {
      window.open(data.url, "_blank");
      toast.success("PDF generated successfully!");
    },
    onError: (error) => {
      toast.error(`PDF generation failed: ${error.message}`);
    },
  });

  const handleUpload = async () => {
    if (!file || !selectedDocumentType) {
      toast.error("Please select a document type and file");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const fileData = base64.split(",")[1]; // Remove data:image/png;base64, prefix

        await uploadDocument.mutateAsync({
          documentTypeId: parseInt(selectedDocumentType),
          fileName: file.name,
          fileData,
          mimeType: file.type,
        });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploading(false);
      toast.error("Failed to upload file");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-blue-900 cursor-pointer">DivorceDocPrep</h1>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Documents</h2>
            <p className="text-gray-600 mt-2">Upload and manage your divorce documents</p>
          </div>
          <Button
            onClick={() => generatePDF.mutate()}
            disabled={generatePDF.isPending || !documents || documents.length === 0}
          >
            {generatePDF.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export All as PDF
          </Button>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>
              Select the document type and upload your file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="docType">Document Type</Label>
              <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                <SelectTrigger id="docType">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={!file || !selectedDocumentType || uploading}
              className="w-full"
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload Document
            </Button>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents ({documents?.length || 0})</CardTitle>
            <CardDescription>
              All your uploaded documents organized by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {documents && documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <FileText className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="font-medium">{doc.fileName}</p>
                        <p className="text-sm text-gray-600">
                          {doc.categoryName} • {doc.documentTypeName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Uploaded {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc.fileUrl, "_blank")}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteDocument.mutate({ documentId: doc.id })}
                        disabled={deleteDocument.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No documents uploaded yet</p>
                <p className="text-sm text-gray-500">
                  Start by uploading your first document using the form above
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
