import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './ui/Button';
import { FileUp, RotateCcw, Trash2 } from 'lucide-react';
import AlertModal from './ui/AlertModal';

interface ValidationStepProps {
  onCompleteValidation: (validationData: {
    mdoSignature: string;
    coSignerSignature: string | null;
    letterheads: File[];
  }) => void;
}

const ValidationStep: React.FC<ValidationStepProps> = ({ onCompleteValidation }) => {
  const mdoSigPad = useRef<SignatureCanvas>(null);
  const coSignerSigPad = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [letterheads, setLetterheads] = useState<File[]>([]);
  const [isCoSignerPresent, setIsCoSignerPresent] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, title: '', message: '' });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setLetterheads(prev => [...prev, ...Array.from(event.target.files as FileList)]);
    }
  };
  
  const removeFile = (fileName: string) => {
    setLetterheads(prev => prev.filter(file => file.name !== fileName));
  };

  const handleSubmit = () => {
    if (mdoSigPad.current?.isEmpty()) {
      setAlert({ isOpen: true, title: "Signature Missing", message: "Please provide the MDO's signature." });
      return;
    }
    if (isCoSignerPresent && coSignerSigPad.current?.isEmpty()) {
      setAlert({ isOpen: true, title: "Signature Missing", message: "Please provide the Co-signer's signature." });
      return;
    }
    if (letterheads.length === 0) {
      setAlert({ isOpen: true, title: "Document Missing", message: "Please upload at least one letterhead document." });
      return;
    }
    
    const validationData = {
        mdoSignature: mdoSigPad.current!.toDataURL(),
        coSignerSignature: isCoSignerPresent && !coSignerSigPad.current!.isEmpty() ? coSignerSigPad.current!.toDataURL() : null,
        letterheads,
    };
    onCompleteValidation(validationData);
  };

  return (
    <>
      <AlertModal {...alert} onClose={() => setAlert({ ...alert, isOpen: false })} />
      <div className="mt-6 rounded-lg border bg-background p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Step 3: Validation</h2>
        <p className="text-sm text-secondary-foreground mb-4">Provide signatures and upload documents to validate the stock entry.</p>
        
        <div className="flex items-center space-x-2 mb-4">
          <input type="checkbox" id="coSignerCheck" checked={isCoSignerPresent} onChange={(e) => setIsCoSignerPresent(e.target.checked)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
          <label htmlFor="coSignerCheck" className="text-sm font-medium">Is a senior (TSM/RMM) accompanying you?</label>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Distributor Letterhead(s)</label>
          {letterheads.length > 0 && (
            <div className="mt-2 space-y-2">
                {letterheads.map(file => (
                    <div key={file.name} className="flex items-center justify-between rounded-md border bg-secondary p-2 text-sm">
                        <span>{file.name}</span>
                        <Button variant="ghost" size="icon" onClick={() => removeFile(file.name)}><Trash2 className="h-4 w-4 text-danger"/></Button>
                    </div>
                ))}
            </div>
          )}
          <div className="mt-2 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="space-y-1 text-center"><FileUp className="mx-auto h-12 w-12 text-secondary-foreground" /><p className="text-sm">Click to upload documents</p><input ref={fileInputRef} type="file" multiple className="sr-only" onChange={handleFileChange} /></div>
          </div>
        </div>

        <div className={`grid gap-6 ${isCoSignerPresent ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          <div>
            <label className="text-sm font-medium">MDO Signature</label>
            <div className="mt-1 rounded-md border bg-secondary">
              <SignatureCanvas ref={mdoSigPad} penColor="hsl(var(--foreground))" canvasProps={{ className: 'w-full h-40 rounded-md' }} />
            </div>
            <div className="mt-2 flex justify-end"><Button type="button" variant="ghost" onClick={() => mdoSigPad.current?.clear()}><RotateCcw className="mr-2 h-4 w-4" /> Clear</Button></div>
          </div>
          {isCoSignerPresent && (
            <div>
              <label className="text-sm font-medium">Co-Signer Signature</label>
              <div className="mt-1 rounded-md border bg-secondary">
                <SignatureCanvas ref={coSignerSigPad} penColor="hsl(var(--foreground))" canvasProps={{ className: 'w-full h-40 rounded-md' }} />
              </div>
              <div className="mt-2 flex justify-end"><Button type="button" variant="ghost" onClick={() => coSignerSigPad.current?.clear()}><RotateCcw className="mr-2 h-4 w-4" /> Clear</Button></div>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end border-t pt-4">
          <Button onClick={handleSubmit}>Complete Liquidation Entry</Button>
        </div>
      </div>
    </>
  );
};

export default ValidationStep;