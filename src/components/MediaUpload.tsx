+import React, { useState } from 'react';
+import { Camera, Upload, X, Play, Image as ImageIcon } from 'lucide-react';
+
+interface MediaUploadProps {
+  onUpload: (files: File[]) => void;
+  maxFiles?: number;
+  acceptedTypes?: string[];
+  existingMedia?: string[];
+}
+
+export const MediaUpload: React.FC<MediaUploadProps> = ({
+  onUpload,
+  maxFiles = 5,
+  acceptedTypes = ['image/*', 'video/*'],
+  existingMedia = []
+}) => {
+  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
+  const [previews, setPreviews] = useState<string[]>([]);
+
+  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
+    const files = Array.from(e.target.files || []);
+    if (files.length + selectedFiles.length > maxFiles) {
+      alert(`Maximum ${maxFiles} files allowed`);
+      return;
+    }
+
+    const newFiles = [...selectedFiles, ...files];
+    setSelectedFiles(newFiles);
+
+    // Generate previews
+    const newPreviews = [...previews];
+    files.forEach(file => {
+      const reader = new FileReader();
+      reader.onload = (e) => {
+        newPreviews.push(e.target?.result as string);
+        setPreviews([...newPreviews]);
+      };
+      reader.readAsDataURL(file);
+    });
+
+    onUpload(newFiles);
+  };
+
+  const removeFile = (index: number) => {
+    const newFiles = selectedFiles.filter((_, i) => i !== index);
+    const newPreviews = previews.filter((_, i) => i !== index);
+    setSelectedFiles(newFiles);
+    setPreviews(newPreviews);
+    onUpload(newFiles);
+  };
+
+  const capturePhoto = () => {
+    // In a real app, this would open camera
+    const input = document.createElement('input');
+    input.type = 'file';
+    input.accept = 'image/*';
+    input.capture = 'environment';
+    input.onchange = (e) => {
+      const target = e.target as HTMLInputElement;
+      if (target.files) {
+        handleFileSelect({ target } as any);
+      }
+    };
+    input.click();
+  };
+
+  return (
+    <div className="space-y-4">
+      <div className="flex gap-2">
+        <button
+          onClick={capturePhoto}
+          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
+        >
+          <Camera className="w-4 h-4" />
+          Camera
+        </button>
+        
+        <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
+          <Upload className="w-4 h-4" />
+          Upload
+          <input
+            type="file"
+            multiple
+            accept={acceptedTypes.join(',')}
+            onChange={handleFileSelect}
+            className="hidden"
+          />
+        </label>
+      </div>
+
+      {(previews.length > 0 || existingMedia.length > 0) && (
+        <div className="grid grid-cols-2 gap-2">
+          {existingMedia.map((media, index) => (
+            <div key={`existing-${index}`} className="relative">
+              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
+                {media.includes('video') ? (
+                  <div className="w-full h-full flex items-center justify-center">
+                    <Play className="w-8 h-8 text-gray-400" />
+                  </div>
+                ) : (
+                  <img
+                    src={media}
+                    alt={`Media ${index + 1}`}
+                    className="w-full h-full object-cover"
+                  />
+                )}
+              </div>
+            </div>
+          ))}
+          
+          {previews.map((preview, index) => (
+            <div key={`preview-${index}`} className="relative">
+              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
+                {selectedFiles[index]?.type.startsWith('video/') ? (
+                  <video
+                    src={preview}
+                    className="w-full h-full object-cover"
+                    controls
+                  />
+                ) : (
+                  <img
+                    src={preview}
+                    alt={`Preview ${index + 1}`}
+                    className="w-full h-full object-cover"
+                  />
+                )}
+              </div>
+              <button
+                onClick={() => removeFile(index)}
+                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
+              >
+                <X className="w-3 h-3" />
+              </button>
+            </div>
+          ))}
         </div>
       )}
 
-      <p className="text-sm text-gray-500">
-        {selectedFiles.length + existingMedia.length}/{maxFiles} files selected
-      </p>
+      <p className="text-sm text-gray-500">
+        {selectedFiles.length + existingMedia.length}/{maxFiles} files selected
+      </p>
     </div>
   );
 };