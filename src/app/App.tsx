import { useState } from "react";
import { RouterProvider } from "react-router";
import { motion } from "motion/react";
import { router } from "./routes";
import { LoadingScreen } from "./LoadingScreen";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <LoadingScreen
        duration={1800}
        onComplete={() => setLoaded(true)}
      />
      {loaded && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          <RouterProvider router={router} />
        </motion.div>
      )}
    </>
  );
}