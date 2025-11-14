import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, FileText, MessageSquare, Settings, Upload, Trash2, Share2, Download, Loader2 } from "lucide-react";
import { ShareDialog } from "./ShareDialog";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Documents() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  
  const { data: documents } = trpc.documents.list.useQuery(undefined, { enabled: isAuthenticated });
  const { data: documentTypes } = trpc.documentTypes.listForUser.useQuery(undefined, { enabled: isAuthenticated });
  const { data: categories } = trpc.categories.list.useQuery();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<number | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  
  const downloadPdfMutation = trpc.pdf.generateForDownload.useMutation({
    onSuccess: (data) => {
      // Convert base64 to blob and trigger download
      const byteCharacters = atob(data.pdfData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`PDF package downloaded! (${data.pageCount} pages, ${data.documentCount} documents)`);
    },
    onError: (error) => {
      toast.error(`Failed to generate PDF: ${error.message}`);
    },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  const uploadMutation = trpc.documents.upload.useMutation({
    onSuccess: () => {
      toast.success("Document uploaded successfully!");
      utils.documents.list.invalidate();
      setSelectedFile(null);
      setSelectedDocType(null);
    },
    onError: (error) => {
      toast.error("Upload failed: " + error.message);
    },
  });

  const deleteMutation = trpc.documents.delete.useMutation({
    onSuccess: () => {
      toast.success("Document deleted");
      utils.documents.list.invalidate();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedDocType) {
      toast.error("Please select a document type and file");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result?.toString().split(',')[1];
      if (base64) {
        uploadMutation.mutate({
          documentTypeId: selectedDocType,
          fileName: selectedFile.name,
          fileData: base64,
          mimeType: selectedFile.type,
        });
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FileText className="h-5 w-5" /> },
    { label: "Checklist", path: "/checklist", icon: <CheckCircle2 className="h-5 w-5" /> },
    { label: "Documents", path: "/documents", icon: <FileText className="h-5 w-5" /> },
    { label: "AI Assistant", path: "/assistant", icon: <MessageSquare className="h-5 w-5" /> },
    { label: "Settings", path: "/state-selection", icon: <Settings className="h-5 w-5" /> },
  ];

  const groupedDocs = categories?.map(category => ({
    ...category,
    docs: documents?.filter(d => {
      const docType = documentTypes?.find(dt => dt.id === d.documentTypeId);
      return docType?.categoryId === category.id;
    }) || []
  })).filter(cat => cat.docs.length > 0);

  const handleDownloadPDF = () => {
    downloadPdfMutation.mutate();
  };

  const handleShareClick = () => {
    setShareDialogOpen(true);
  };

  return (
    <DashboardLayout navItems={navItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Documents</h1>
            <p className="text-gray-600 mt-2">Upload and manage your divorce documents</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleDownloadPDF} 
              disabled={downloadPdfMutation.isPending}
              variant="outline"
              className="gap-2"
            >
              {downloadPdfMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Download PDF Package
            </Button>
            <Button onClick={handleShareClick} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share with Attorney
            </Button>
          </div>
        </div>

        <ShareDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} />

        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>Add a new document to your collection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="docType">Document Type</Label>
              <select
                id="docType"
                className="w-full border rounded-md p-2"
                value={selectedDocType || ""}
                onChange={(e) => setSelectedDocType(Number(e.target.value))}
              >
                <option value="">Select document type...</option>
                {documentTypes?.map(dt => (
                  <option key={dt.id} value={dt.id}>{dt.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="file">File</Label>
              <Input id="file" type="file" onChange={handleFileChange} />
            </div>
            <Button onClick={handleUpload} disabled={uploadMutation.isPending}>
              <Upload className="mr-2 h-4 w-4" />
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </CardContent>
        </Card>

        {groupedDocs && groupedDocs.length > 0 ? (
          groupedDocs.map(category => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.docs.map(doc => {
                    const docType = documentTypes?.find(dt => dt.id === doc.documentTypeId);
                    return (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{doc.fileName}</div>
                          <div className="text-sm text-gray-600">{docType?.name}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteMutation.mutate({ documentId: doc.id })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No documents uploaded yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
