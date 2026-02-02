import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function TestApi() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/")
      .then(res => setMsg(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="text-center mt-10 text-2xl">
      Backend says: {msg}
    </div>
  );
}
