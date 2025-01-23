import Image from "next/image";
import FileUpload from "./Components/FileUpload";

export default function Home() {
  return (
    <div className="border-2 h-screen">
        <FileUpload/>
    </div>
  );
}
