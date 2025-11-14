import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Camera, CheckCircle2, FileText, Loader2, MessageSquare, Settings, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function DocumentScanner() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedDocumentType, setSelectedDocumentType] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [useCamera, setUseCamera] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { data: documentTypes } = trpc.documentTypes.listForUser.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const extractMutation = trpc.extraction.analyzeDocument.useMutation();
  const uploadMutation = trpc.documents.upload.useMutation();
  const uploadImageMutation = trpc.documents.uploadImage.useMutation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    return () => {
      // Cleanup camera stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setUseCamera(true);
      }
    } catch (error) {
      console.error("Camera access error:", error);
      toast.error("Could not access camera. Please check permissions or use file upload.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setUseCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image as base64
    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(imageData);
    stopCamera();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCapturedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const analyzeDocument = async () => {
    if (!capturedImage) {
      toast.error("Please capture or upload an image first");
      return;
    }

    setIsProcessing(true);
    setExtractedData(null);

    try {
      // Upload image to S3 first to get a public URL
      const base64Data = capturedImage.split(",")[1];
      
      toast.info("Uploading image...");
      const uploadResult = await uploadImageMutation.mutateAsync({
        imageData: base64Data,
        mimeType: "image/jpeg",
      });
      
      const suggestedType = selectedDocumentType 
        ? documentTypes?.find(dt => dt.id === selectedDocumentType)?.name
        : undefined;

      toast.info("Analyzing document with AI...");
      const result = await extractMutation.mutateAsync({
        imageUrl: uploadResult.url,
        suggestedType,
      });

      setExtractedData(result);
      toast.success(`Document identified as: ${result.documentType}`);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze document. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const saveDocument = async () => {
    if (!capturedImage || !selectedDocumentType) {
      toast.error("Please select a document type");
      return;
    }

    try {
      const base64Data = capturedImage.split(",")[1];
      const fileName = `scan-${Date.now()}.jpg`;

      await uploadMutation.mutateAsync({
        documentTypeId: selectedDocumentType,
        fileName,
        fileData: base64Data,
        mimeType: "image/jpeg",
        notes: extractedData ? JSON.stringify(extractedData.fields) : undefined,
      });

      toast.success("Document saved successfully!");
      
      // Reset state
      setCapturedImage(null);
      setExtractedData(null);
      setSelectedDocumentType(null);
      
      // Redirect to documents page
      setTimeout(() => setLocation("/documents"), 1000);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save document");
    }
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <FileText className="h-5 w-5" /> },
    { label: "Checklist", path: "/checklist", icon: <CheckCircle2 className="h-5 w-5" /> },
    { label: "Documents", path: "/documents", icon: <FileText className="h-5 w-5" /> },
    { label: "Scan Document", path: "/scan", icon: <Camera className="h-5 w-5" /> },
    { label: "AI Assistant", path: "/assistant", icon: <MessageSquare className="h-5 w-5" /> },
    { label: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <DashboardLayout navItems={navItems}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Document Scanner</h1>
          <p className="text-gray-600 mt-2">
            Capture or upload a document image, and our AI will automatically extract the data
          </p>
        </div>

        {/* Document Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Document Type</CardTitle>
            <CardDescription>Choose the type of document you're scanning</CardDescription>
          </CardHeader>
          <CardContent>
            <Label>Document Type</Label>
            <Select
              value={selectedDocumentType?.toString() || ""}
              onValueChange={(value) => setSelectedDocumentType(parseInt(value))}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select document type..." />
              </SelectTrigger>
              <SelectContent>
                {documentTypes?.map((dt) => (
                  <SelectItem key={dt.id} value={dt.id.toString()}>
                    {dt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Camera/Upload Section */}
        {!capturedImage && (
          <Card>
            <CardHeader>
              <CardTitle>Capture or Upload Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!useCamera ? (
                <div className="flex gap-4">
                  <Button onClick={startCamera} className="flex-1">
                    <Camera className="mr-2 h-4 w-4" />
                    Use Camera
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full"
                      style={{ maxHeight: "500px" }}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={capturePhoto} className="flex-1">
                      <Camera className="mr-2 h-4 w-4" />
                      Capture Photo
                    </Button>
                    <Button variant="outline" onClick={stopCamera}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Preview and Analysis */}
        {capturedImage && (
          <Card>
            <CardHeader>
              <CardTitle>Captured Document</CardTitle>
              <CardDescription>Review the image and analyze with AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <img src={capturedImage} alt="Captured document" className="w-full" />
              </div>
              
              {!extractedData && (
                <div className="flex gap-4">
                  <Button
                    onClick={analyzeDocument}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze with AI"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCapturedImage(null);
                      setExtractedData(null);
                    }}
                  >
                    Retake
                  </Button>
                </div>
              )}

              {extractedData && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">
                      Detected: {extractedData.documentType}
                    </h3>
                    <p className="text-sm text-green-700">
                      Confidence: {Math.round(extractedData.confidence * 100)}%
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Extracted Data</h3>
                    <div className="grid gap-2">
                      {Object.entries(extractedData.fields).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 gap-2 text-sm">
                          <div className="font-medium text-gray-600 capitalize">
                            {key.replace(/_/g, " ")}:
                          </div>
                          <div>{value !== null ? String(value) : "Not found"}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={saveDocument}
                      disabled={uploadMutation.isPending}
                      className="flex-1"
                    >
                      {uploadMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Document"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCapturedImage(null);
                        setExtractedData(null);
                      }}
                    >
                      Scan Another
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </DashboardLayout>
  );
}
