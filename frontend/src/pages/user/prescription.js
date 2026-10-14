import { useEffect } from "react";
import { useRouter } from "next/router";

const PrescriptionPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user/dashboard");
  }, [router]);

  return null;
};

export default PrescriptionPage;
