"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const STORAGE_KEY = "demo_persona_proofs_v1";
const META_KEY = "demo_persona_meta_v1";

export default function Persona() {
  const params = useSearchParams();

  const defaultMeta = {
    name: params?.get("name") ?? "Solar Rooftop - Community A",
    category: params?.get("category") ?? "Renewable Energy",
    description:
      params?.get("description") ??
      "Community rooftop solar arrays that supply power to 50 homes.",
    website: params?.get("website") ?? "",
    owner: "0xAbC...1234", 
  };

  const [meta, setMeta] = useState(defaultMeta);
  const [proofs, setProofs] = useState([]);
  const [impactScore, setImpactScore] = useState(42); 
  const [nftPrice, setNftPrice] = useState(0.25); 

  const [priceHistory, setPriceHistory] = useState([
  { time: Date.now(), price: 0.25 }
]);

    useEffect(() => {
    setPriceHistory(prev => [
        ...prev,
        { time: Date.now(), price: nftPrice }
    ]);
    }, [nftPrice]);


  const [proofFile, setProofFile] = useState(null);
  const [proofDesc, setProofDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [carbonReduced, setCarbonReduced] = useState(120); 
    const [priceJump, setPriceJump] = useState(false); 


  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { proofs: p, impactScore: s, nftPrice: price, meta: m } = JSON.parse(
          stored
        );
        if (p) setProofs(p);
        if (typeof s === "number") setImpactScore(s);
        if (typeof price === "number") setNftPrice(price);
        if (m) setMeta({ ...defaultMeta, ...m });
      } catch (e) {
        
      }
    } else {
     
      const seed = [
        {
          id: Date.now(),
          desc: "Initial installation photo (seed)",
          preview: null,
          status: "approved",
          submittedAt: new Date().toISOString(),
        },
      ];
      setProofs(seed);
      setImpactScore(48);
      setNftPrice(0.28);
    }
  }, []); 

  useEffect(() => {
    const payload = {
      proofs,
      impactScore,
      nftPrice,
      meta,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [proofs, impactScore, nftPrice, meta]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setProofFile({ file, preview, name: file.name });
  };
const handleSubmitProof = async (e) => {
  e.preventDefault();
  if (!proofDesc && !proofFile) {
    toast.error("Please add a description or attach a proof file.");
    return;
  }

  setSubmitting(true);

  setTimeout(() => {
    const newProof = {
      id: Date.now(),
      desc: proofDesc || (proofFile ? proofFile.name : "Uploaded proof"),
      preview: proofFile ? proofFile.preview : null,
      status: "approved",
      submittedAt: new Date().toISOString(),
      auditedAt: new Date().toISOString(),
    };

    setProofs((prev) => [newProof, ...prev]);

    const scoreGain = Math.floor(Math.random() * 8) + 3; 
    setImpactScore((s) => s + scoreGain);

    const pct = (Math.random() * 6 + 2) / 100;
    setNftPrice((p) => +(p * (1 + pct)).toFixed(4));

    setProofFile(null);
    setProofDesc("");
    setSubmitting(false);

    toast.success(" Proof Verified! NFT Price Increased ");
  }, 800);
};

  const handleApprove = (id) => {
    setProofs((prev) =>
      prev.map((p) =>
        p.id === id && p.status === "pending"
          ? { ...p, status: "approved", auditedAt: new Date().toISOString() }
          : p
      )
    );

    const scoreGain = Math.floor(Math.random() * 8) + 3; // 3..10
    setImpactScore((s) => s + scoreGain);

    const pct = (Math.random() * 6 + 2) / 100;
    setNftPrice((p) => +(p * (1 + pct)).toFixed(4));

    toast.success("Proof approved by AI auditor. Impact score + NFT price increased.");
  };

  const handleReject = (id) => {
    setProofs((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: "rejected", auditedAt: new Date().toISOString() }
          : p
      )
    );
    toast.warn("Proof rejected. User may resubmit with improved evidence.");
  };

  const handleRemoveProof = (id) => {
    setProofs((prev) => prev.filter((p) => p.id !== id));
  };

  const pendingCount = proofs.filter((p) => p.status === "pending").length;
  const approvedCount = proofs.filter((p) => p.status === "approved").length;

  const handleResetDemo = () => {
    if (!confirm("Reset demo data (clears stored proofs)?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setProofs([]);
    setImpactScore(42);
    setNftPrice(0.25);
    toast.info("Demo reset. Refresh the page.");
  };

  const graphRef = React.useRef(null);

useEffect(() => {
  if (!graphRef.current || priceHistory.length < 2) return;
  const canvas = graphRef.current;
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // scale values
  const maxPrice = Math.max(...priceHistory.map(p => p.price));
  const minPrice = Math.min(...priceHistory.map(p => p.price));
  const diff = maxPrice - minPrice || 1;

  const padding = 20;

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#00ffc3";

  priceHistory.forEach((point, i) => {
    const x = (i / (priceHistory.length - 1)) * (canvas.width - padding * 2) + padding;
    const y = canvas.height - padding - ((point.price - minPrice) / diff) * (canvas.height - padding * 2);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();

  const last = priceHistory[priceHistory.length - 1];
  const lx = ( (priceHistory.length - 1) / (priceHistory.length - 1)) * (canvas.width - padding * 2) + padding;
  const ly = canvas.height - padding - ((last.price - minPrice) / diff) * (canvas.height - padding * 2);
  ctx.fillStyle = "#00ffc3";
  ctx.beginPath();
  ctx.arc(lx, ly, 5, 0, 2 * Math.PI);
  ctx.fill();

}, [priceHistory]);


  return (
    <div className={styles.dashboard}>
      <ToastContainer position="top-right" autoClose={2500} />

      <header className={styles.header}>
        <div className={styles.nftCard}>
          <div className={styles.nftImage}>
            <div className={styles.nftPlaceholder}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="4" fill="#0b3a2b" />
                <path d="M4 16l4-6 3 4 5-8 4 6" stroke="#7EFBA0" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className={styles.nftMeta}>
            <h2 className={styles.projectName}>{meta.name}</h2>
            <p className={styles.wallet}>Owner: <span className={styles.walletAddr}>{meta.owner}</span></p>
            <p className={styles.category}>{meta.category}</p>
            <p className={styles.desc}>{meta.description}</p>
            {meta.website ? (
              <a className={styles.websiteLink} href={meta.website} target="_blank" rel="noreferrer">
                Visit project page
              </a>
            ) : null}
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Impact Score</div>
            <div className={styles.statValue}>{impactScore}</div>
            <div className={styles.statNote}>Verified actions: {approvedCount}</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statLabel}>NFT Price (sim)</div>
            <div className={styles.statValue}>{nftPrice} ETH</div>
            <div className={styles.statNote}>{pendingCount} proofs pending</div>
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryBtn} onClick={() => toast.info("This is a demo — minting already simulated.")}>
              View Mint Info
            </button>
            <button className={styles.ghostBtn} onClick={handleResetDemo}>
              Reset Demo
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.graphSection}>
  <h3 className={styles.sectionTitle}>NFT Value Growth (Simulated)</h3>
  <div className={styles.graphCard}>
    <canvas ref={graphRef} className={styles.graphCanvas}></canvas>
  </div>
</section>

        <section className={styles.submitSection}>
          <h3 className={styles.sectionTitle}>Submit Proof (demo)</h3>
          <form className={styles.form} onSubmit={handleSubmitProof}>
            <textarea
              value={proofDesc}
              onChange={(e) => setProofDesc(e.target.value)}
              placeholder="Describe your proof (e.g., installation photo, invoice, sensor reading...)"
              className={styles.textarea}
            />
            <div className={styles.controls}>
              <label className={styles.fileLabel}>
                <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
                Attach file (optional)
              </label>

              {proofFile && (
                <div className={styles.preview}>
                  <div className={styles.previewTitle}>Preview:</div>
                  <img src={proofFile.preview} alt="preview" className={styles.previewImg} />
                </div>
              )}

              <button className={styles.submitBtn} type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit for Audit"}
              </button>
            </div>
          </form>
        </section>

        <section className={styles.proofsSection}>
          <h3 className={styles.sectionTitle}>Your Proofs</h3>

          {proofs.length === 0 ? (
            <div className={styles.empty}>No proofs yet — submit one above to start auditing.</div>
          ) : (
            <div className={styles.proofList}>
              {proofs.map((p) => (
                <div className={styles.proofCard} key={p.id}>
                  <div className={styles.proofLeft}>
                    {p.preview ? (
                      <img className={styles.proofImg} src={p.preview} alt="proof" />
                    ) : (
                      <div className={styles.proofPlaceholder}>No image</div>
                    )}
                  </div>

                  <div className={styles.proofRight}>
                    <div className={styles.proofDesc}>{p.desc}</div>
                    <div className={styles.proofMeta}>
                      <span className={styles.metaItem}>Status: <strong className={styles[`status_${p.status}`]}>{p.status}</strong></span>
                      <span className={styles.metaItem}>Submitted: {new Date(p.submittedAt).toLocaleString()}</span>
                    </div>

                    <div className={styles.proofActions}>
                      <button className={styles.removeBtn} onClick={() => handleRemoveProof(p.id)}>
  Remove
</button>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
