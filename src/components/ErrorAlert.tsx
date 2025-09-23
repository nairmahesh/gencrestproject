import { CircleAlertIcon } from 'lucide-react'

const ErrorAlert = ({ text }: { text: string }) => {
 return (
  <div className="w-full h-4 my-4 flex items-center justify-center">
   <h1 className="bg-error-500/20 px-2 rounded-sm py-2 w-full text-xs flex items-center justify-center gap-3">
    <CircleAlertIcon className="text-error-600" />
    <span className="text-error-600">{text}</span>
   </h1>
  </div>
 )
}

export default ErrorAlert