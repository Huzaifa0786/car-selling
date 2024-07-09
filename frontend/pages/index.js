import { Inter } from "next/font/google";
import SignIn from "./SignIn";

const inter = Inter({ subsets: ["latin"] });

export default function Index() {
  return (
    <>
    <SignIn/>
    </>
  );
}
